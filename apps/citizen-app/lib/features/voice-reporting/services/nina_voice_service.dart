import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:audioplayers/audioplayers.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';

enum NinaAgentState {
  idle,
  connecting,
  speaking,
  listening,
  processing,
  error,
}

class NinaVoiceService extends ChangeNotifier {
  static final NinaVoiceService _instance = NinaVoiceService._internal();
  factory NinaVoiceService() => _instance;

  NinaVoiceService._internal() {
    _initAudioPlayer();
  }

  // Base URLs for SETU Backend API (USB reverse tethering and LAN Wi-Fi fallback)
  String _activeBaseUrl = 'http://127.0.0.1:5000/api/v1/voice';
  static const List<String> _candidateUrls = [
    'http://127.0.0.1:5000/api/v1/voice',
    'http://192.168.1.101:5000/api/v1/voice',
  ];

  Future<http.Response> _postWithFallback(String path, Map<String, dynamic> body) async {
    final orderedUrls = [_activeBaseUrl, ..._candidateUrls.where((u) => u != _activeBaseUrl)];
    Object? lastError;
    for (final base in orderedUrls) {
      try {
        final res = await http.post(
          Uri.parse('$base$path'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(body),
        ).timeout(const Duration(seconds: 15));
        if (res.statusCode == 200) {
          _activeBaseUrl = base;
          return res;
        }
      } catch (e) {
        lastError = e;
        debugPrint('[NINA] Endpoint $base$path failed ($e), trying fallback candidate...');
      }
    }
    if (lastError != null) throw lastError;
    throw Exception('All voice server candidate endpoints unreachable');
  }

  final AudioRecorder _audioRecorder = AudioRecorder();
  final AudioPlayer _audioPlayer = AudioPlayer();

  NinaAgentState _state = NinaAgentState.idle;
  NinaAgentState get state => _state;

  String? _sessionId;
  String? get sessionId => _sessionId;

  String _currentTranscript = '';
  String get currentTranscript => _currentTranscript;

  String _currentReply = '';
  String get currentReply => _currentReply;

  bool _isMuted = false;
  bool get isMuted => _isMuted;

  bool _isSpeakerOn = true;
  bool get isSpeakerOn => _isSpeakerOn;

  double _audioLevel = 0.0;
  double get audioLevel => _audioLevel;

  String? _currentRecordingPath;
  Timer? _levelTimer;
  Timer? _silenceTimer;

  void _initAudioPlayer() {
    _audioPlayer.onPlayerComplete.listen((_) {
      if (_state == NinaAgentState.speaking) {
        debugPrint('[NINA] Finished speaking. Now listening for citizen response...');
        _startListening();
      }
    });

    _audioPlayer.onPlayerStateChanged.listen((playerState) {
      if (playerState == PlayerState.playing) {
        _startAudioLevelSimulation();
      } else {
        _stopAudioLevelSimulation();
      }
    });
  }

  void _setState(NinaAgentState newState) {
    _state = newState;
    notifyListeners();
  }

  /// Start a full conversational session with NINA
  Future<void> startSession({String userName = 'Rampal'}) async {
    try {
      _setState(NinaAgentState.connecting);
      _currentTranscript = '';
      _currentReply = '';

      final response = await _postWithFallback('/start', {
        'user_name': userName,
      });

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final resData = data['data'] ?? {};
        _sessionId = resData['session_id'];
        final greetingText = resData['text'] ?? '';
        final audioBase64 = resData['audio_base64'] ?? '';

        _currentReply = greetingText;
        debugPrint('[NINA] Session started: $_sessionId. Greeting: $greetingText');

        if (audioBase64.isNotEmpty && _isSpeakerOn) {
          await _playAudioBase64(audioBase64);
        } else {
          // If no audio or speaker off, immediately start listening
          _startListening();
        }
      } else {
        debugPrint('[NINA] Failed to start session: ${response.statusCode} ${response.body}');
        _setState(NinaAgentState.error);
      }
    } catch (e) {
      debugPrint('[NINA] Error starting session: $e');
      _setState(NinaAgentState.error);
    }
  }

  /// Plays synthesized audio from base64 string
  Future<void> _playAudioBase64(String base64String) async {
    try {
      _setState(NinaAgentState.speaking);
      final bytes = base64Decode(base64String);
      final tempDir = await getTemporaryDirectory();
      final tempFile = File('${tempDir.path}/nina_reply_${DateTime.now().millisecondsSinceEpoch}.wav');
      await tempFile.writeAsBytes(bytes, flush: true);

      await _audioPlayer.setVolume(_isSpeakerOn ? 1.0 : 0.0);
      await _audioPlayer.play(DeviceFileSource(tempFile.path));
    } catch (e) {
      debugPrint('[NINA] Error playing audio: $e');
      _startListening();
    }
  }

  /// Starts microphone recording to capture citizen's response
  Future<void> _startListening() async {
    if (_isMuted) {
      _setState(NinaAgentState.listening);
      return;
    }

    try {
      final hasPerm = await _audioRecorder.hasPermission();
      if (!hasPerm) {
        debugPrint('[NINA] Mic permission not granted');
        _setState(NinaAgentState.error);
        return;
      }

      final tempDir = await getTemporaryDirectory();
      _currentRecordingPath = '${tempDir.path}/citizen_turn_${DateTime.now().millisecondsSinceEpoch}.wav';

      await _audioRecorder.start(
        const RecordConfig(
          encoder: AudioEncoder.wav,
          sampleRate: 16000,
          numChannels: 1,
        ),
        path: _currentRecordingPath!,
      );

      _setState(NinaAgentState.listening);
      _startMicLevelMonitor();
      debugPrint('[NINA] Listening at: $_currentRecordingPath');
    } catch (e) {
      debugPrint('[NINA] Error starting audio recording: $e');
      _setState(NinaAgentState.error);
    }
  }

  /// Stops recording and submits audio to Gemini & Sarvam
  Future<void> finishListeningAndSend() async {
    if (_state != NinaAgentState.listening) return;

    _stopAudioLevelSimulation();
    _silenceTimer?.cancel();

    try {
      _setState(NinaAgentState.processing);

      String? recordedPath;
      if (await _audioRecorder.isRecording()) {
        recordedPath = await _audioRecorder.stop();
      } else {
        recordedPath = _currentRecordingPath;
      }

      if (recordedPath == null || !File(recordedPath).existsSync()) {
        debugPrint('[NINA] No recorded audio file found.');
        _startListening();
        return;
      }

      final file = File(recordedPath);
      final bytes = await file.readAsBytes();
      if (bytes.length < 1000) {
        // Less than 1KB is probably silence or instant tap
        debugPrint('[NINA] Audio too short, listening again.');
        _startListening();
        return;
      }

      debugPrint('[NINA] Uploading ${bytes.length} bytes to /chat...');

      http.StreamedResponse? streamedResponse;
      String responseBody = '';
      final orderedUrls = [_activeBaseUrl, ..._candidateUrls.where((u) => u != _activeBaseUrl)];
      for (final base in orderedUrls) {
        try {
          final request = http.MultipartRequest('POST', Uri.parse('$base/chat'));
          if (_sessionId != null) {
            request.fields['session_id'] = _sessionId!;
          }
          request.files.add(
            http.MultipartFile.fromBytes(
              'audio',
              bytes,
              filename: 'voice.wav',
            ),
          );
          final resp = await request.send().timeout(const Duration(seconds: 35));
          if (resp.statusCode == 200) {
            _activeBaseUrl = base;
            streamedResponse = resp;
            responseBody = await resp.stream.bytesToString();
            break;
          }
        } catch (e) {
          debugPrint('[NINA] Upload to $base/chat failed ($e), trying next candidate...');
        }
      }

      if (streamedResponse == null) {
        debugPrint('[NINA] All candidates failed for /chat upload');
        _setState(NinaAgentState.error);
        return;
      }

      if (streamedResponse.statusCode == 200) {
        final data = jsonDecode(responseBody);
        final resData = data['data'] ?? {};

        _currentTranscript = resData['user_transcript'] ?? '';
        _currentReply = resData['reply_text'] ?? '';
        final audioBase64 = resData['audio_base64'] ?? '';

        debugPrint('[NINA] Turn complete. User: "$_currentTranscript" | NINA: "$_currentReply"');

        if (audioBase64.isNotEmpty && _isSpeakerOn) {
          await _playAudioBase64(audioBase64);
        } else {
          _startListening();
        }
      } else {
        debugPrint('[NINA] /chat failed: ${streamedResponse.statusCode} $responseBody');
        _setState(NinaAgentState.error);
      }
    } catch (e) {
      debugPrint('[NINA] Error in finishListeningAndSend: $e');
      _setState(NinaAgentState.error);
    }
  }

  /// Toggle mute button
  void toggleMute() {
    _isMuted = !_isMuted;
    if (_isMuted) {
      if (_state == NinaAgentState.listening) {
        _audioRecorder.stop();
      }
    } else {
      if (_state == NinaAgentState.listening) {
        _startListening();
      }
    }
    notifyListeners();
  }

  /// Toggle speaker audio
  void toggleSpeaker() {
    _isSpeakerOn = !_isSpeakerOn;
    _audioPlayer.setVolume(_isSpeakerOn ? 1.0 : 0.0);
    notifyListeners();
  }

  /// End conversation session
  Future<void> endSession() async {
    _stopAudioLevelSimulation();
    _silenceTimer?.cancel();

    try {
      if (await _audioRecorder.isRecording()) {
        await _audioRecorder.stop();
      }
      await _audioPlayer.stop();

      if (_sessionId != null) {
        http.post(
          Uri.parse('$_activeBaseUrl/end'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'session_id': _sessionId}),
        ).catchError((_) => http.Response('', 500));
      }
    } catch (e) {
      debugPrint('[NINA] Error ending session: $e');
    } finally {
      _sessionId = null;
      _setState(NinaAgentState.idle);
    }
  }

  void _startAudioLevelSimulation() {
    _levelTimer?.cancel();
    _levelTimer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      _audioLevel = 0.35 + 0.35 * math.sin(timer.tick * 0.4).abs();
      notifyListeners();
    });
  }

  void _startMicLevelMonitor() {
    _levelTimer?.cancel();
    _levelTimer = Timer.periodic(const Duration(milliseconds: 150), (timer) {
      _audioLevel = 0.20 + 0.15 * math.sin(timer.tick * 0.3).abs();
      notifyListeners();
    });
  }

  void _stopAudioLevelSimulation() {
    _levelTimer?.cancel();
    _audioLevel = 0.0;
    notifyListeners();
  }

  @override
  void dispose() {
    _levelTimer?.cancel();
    _silenceTimer?.cancel();
    _audioRecorder.dispose();
    _audioPlayer.dispose();
    super.dispose();
  }
}
