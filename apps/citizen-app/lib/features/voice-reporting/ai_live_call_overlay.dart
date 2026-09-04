import 'dart:async';
import 'dart:math' as math;
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/widgets/elastic_pressable.dart';
import 'widgets/aura_glow_painter.dart';

/// Full-screen live call session with Setu AI Voice Assistant:
/// - Screen corner glow & edge perimeter vignette
/// - Bottom 20% radiant volumetric aura gradient
/// - Real-time conversational voice waveform visualizer
/// - Interactive live call controls (Mute, Speaker, End Call)
class SetuAILiveCallOverlay extends StatefulWidget {
  const SetuAILiveCallOverlay({super.key});

  static Future<void> show(BuildContext context) {
    return Navigator.of(context, rootNavigator: true).push(
      PageRouteBuilder(
        opaque: false,
        barrierDismissible: false,
        barrierColor: Colors.black.withValues(alpha: 0.35),
        transitionDuration: const Duration(milliseconds: 400),
        reverseTransitionDuration: const Duration(milliseconds: 300),
        pageBuilder: (context, animation, secondaryAnimation) {
          return FadeTransition(
            opacity: CurvedAnimation(
              parent: animation,
              curve: Curves.easeOutCubic,
            ),
            child: ScaleTransition(
              scale: Tween<double>(begin: 0.96, end: 1.0).animate(
                CurvedAnimation(
                  parent: animation,
                  curve: Curves.easeOutBack,
                ),
              ),
              child: const SetuAILiveCallOverlay(),
            ),
          );
        },
      ),
    );
  }

  @override
  State<SetuAILiveCallOverlay> createState() => _SetuAILiveCallOverlayState();
}

class _SetuAILiveCallOverlayState extends State<SetuAILiveCallOverlay>
    with TickerProviderStateMixin {
  late final AnimationController _auraController;
  late final AnimationController _waveController;

  Timer? _callDurationTimer;
  Timer? _speechSimulationTimer;
  int _secondsElapsed = 0;

  bool _isMuted = false;
  bool _isSpeakerOn = true;
  String _aiSpeechState = 'Listening...';
  String _aiTranscript =
      'Namaste! I am Setu AI. What issue would you like to report in your ward today?';
  double _simulatedSoundLevel = 0.5;

  final List<String> _suggestedTopics = [
    'Broken road / pothole',
    'Water tank or drainage',
    'Streetlight broken',
    'Garbage accumulation',
  ];

  @override
  void initState() {
    super.initState();

    // 4.0s fluid continuous aura breathing loop
    _auraController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 4000),
    )..repeat();

    // 1.2s rapid voice waveform equalizer controller
    _waveController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();

    // Call duration stopwatch
    _callDurationTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() => _secondsElapsed++);
      }
    });

    // Dynamic voice simulation loop to make waveform feel realistically alive
    final random = math.Random();
    _speechSimulationTimer =
        Timer.periodic(const Duration(milliseconds: 250), (timer) {
      if (mounted && !_isMuted) {
        setState(() {
          _simulatedSoundLevel = 0.2 + (random.nextDouble() * 0.7);
        });
      }
    });
  }

  @override
  void dispose() {
    _callDurationTimer?.cancel();
    _speechSimulationTimer?.cancel();
    _auraController.dispose();
    _waveController.dispose();
    super.dispose();
  }

  String _formatDuration(int totalSeconds) {
    final minutes = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final seconds = (totalSeconds % 60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  void _onTopicTap(String topic) {
    HapticFeedback.lightImpact();
    setState(() {
      _aiSpeechState = 'Processing report...';
      _aiTranscript =
          'Understood. I am recording details for "$topic". Can you tell me the exact location or how long this has been happening?';
      _simulatedSoundLevel = 0.85;
    });

    Future.delayed(const Duration(milliseconds: 2200), () {
      if (mounted) {
        setState(() {
          _aiSpeechState = 'Listening...';
        });
      }
    });
  }

  void _endCall() {
    HapticFeedback.heavyImpact();
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          // 1. Glassmorphism backdrop blur
          BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
            child: Container(
              color: const Color(0xFF0B0F17).withValues(alpha: 0.82),
            ),
          ),

          // 2. Animated Aura Glow (Screen corners + Perimeter + Bottom 20%)
          AnimatedBuilder(
            animation: Listenable.merge([_auraController, _waveController]),
            builder: (context, child) {
              return CustomPaint(
                size: Size.infinite,
                painter: AuraGlowPainter(
                  animationProgress: _auraController.value,
                  soundLevel: _isMuted ? 0.0 : _simulatedSoundLevel,
                ),
              );
            },
          ),

          // 3. Live Call Foreground Content
          SafeArea(
            child: Column(
              children: [
                const SizedBox(height: 8),

                // Top Header: Status & Call Info
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      // Pulsing Live Indicator
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: const Color(0xFF10B981).withValues(alpha: 0.40),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                                color: Color(0xFF10B981),
                                boxShadow: [
                                  BoxShadow(
                                    color: Color(0xFF10B981),
                                    blurRadius: 6,
                                    spreadRadius: 1,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Text(
                              'SETU LIVE AI',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 0.8,
                                color: Color(0xFF10B981),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),

                      // Timer
                      Text(
                        _formatDuration(_secondsElapsed),
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.white.withValues(alpha: 0.70),
                        ),
                      ),

                      const Spacer(),

                      // Minimize / Close Button
                      ElasticPressable(
                        pressedScale: 0.88,
                        onTap: _endCall,
                        child: Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white.withValues(alpha: 0.12),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.15),
                            ),
                          ),
                          child: const Icon(
                            Icons.keyboard_arrow_down_rounded,
                            color: Colors.white,
                            size: 24,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const Spacer(flex: 1),

                // Center AI Orb & Sound Waveform
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Glowing Center AI Orb
                      AnimatedBuilder(
                        animation: _auraController,
                        builder: (context, child) {
                          final scale = 1.0 +
                              (math.sin(_auraController.value * 2 * math.pi) *
                                  0.05);
                          return Transform.scale(
                            scale: scale,
                            child: Container(
                              width: 88,
                              height: 88,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: const LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    Color(0xFF06B6D4), // Cyan
                                    Color(0xFF8B5CF6), // Violet
                                    Color(0xFFEC4899), // Pink
                                  ],
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF8B5CF6)
                                        .withValues(alpha: 0.50),
                                    blurRadius: 36,
                                    spreadRadius: 4,
                                  ),
                                  BoxShadow(
                                    color: const Color(0xFF06B6D4)
                                        .withValues(alpha: 0.40),
                                    blurRadius: 48,
                                    spreadRadius: 8,
                                  ),
                                ],
                              ),
                              child: const Center(
                                child: Icon(
                                  Icons.auto_awesome,
                                  color: Colors.white,
                                  size: 40,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 28),

                      // State Tag (Listening / Speaking)
                      Text(
                        _isMuted ? 'Microphone Muted' : _aiSpeechState,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.4,
                          color: _isMuted
                              ? const Color(0xFFEF4444)
                              : const Color(0xFF67E8F9),
                        ),
                      ),
                      const SizedBox(height: 18),

                      // Animated Voice Waveform (7 Frequency Bars)
                      SizedBox(
                        height: 48,
                        child: AnimatedBuilder(
                          animation: _waveController,
                          builder: (context, child) {
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: List.generate(7, (index) {
                                final offset = index * 0.35;
                                final waveVal = math.sin(
                                  (_waveController.value * 2 * math.pi) + offset,
                                );
                                final heightMultiplier =
                                    _isMuted ? 0.15 : (0.35 + (waveVal.abs() * 0.65) * _simulatedSoundLevel);
                                final barHeight = (12.0 + (heightMultiplier * 36.0)).clamp(6.0, 48.0);

                                return Container(
                                  width: 4.5,
                                  height: barHeight,
                                  margin: const EdgeInsets.symmetric(horizontal: 3),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(4),
                                    gradient: const LinearGradient(
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                      colors: [
                                        Color(0xFF67E8F9),
                                        Color(0xFFC084FC),
                                        Color(0xFFF472B6),
                                      ],
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: const Color(0xFFC084FC).withValues(alpha: 0.45),
                                        blurRadius: 6,
                                      ),
                                    ],
                                  ),
                                );
                              }),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),

                const Spacer(flex: 1),

                // AI Speech Bubble Transcript
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 28),
                  child: Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.14),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.20),
                          blurRadius: 16,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Text(
                      _aiTranscript,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 15,
                        height: 1.45,
                        fontWeight: FontWeight.w500,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Quick Topic Suggestion Chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: _suggestedTopics.map((topic) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ElasticPressable(
                          pressedScale: 0.94,
                          onTap: () => _onTopicTap(topic),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.10),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.18),
                              ),
                            ),
                            child: Text(
                              topic,
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Colors.white.withValues(alpha: 0.90),
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),

                const SizedBox(height: 24),

                // Bottom Call Controls (Directly above the bottom 20% radiant aura)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      // 1. Mute Toggle
                      _buildCallActionButton(
                        icon: _isMuted ? Icons.mic_off : Icons.mic,
                        label: _isMuted ? 'Unmute' : 'Mute',
                        isActive: _isMuted,
                        activeColor: const Color(0xFFEF4444),
                        onTap: () {
                          HapticFeedback.mediumImpact();
                          setState(() => _isMuted = !_isMuted);
                        },
                      ),

                      // 2. End Call Button (Prominent Red Call End)
                      ElasticPressable(
                        pressedScale: 0.88,
                        onTap: _endCall,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 70,
                              height: 70,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: const Color(0xFFEF4444), // Vibrant Red
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFFEF4444)
                                        .withValues(alpha: 0.55),
                                    blurRadius: 20,
                                    offset: const Offset(0, 6),
                                  ),
                                ],
                              ),
                              child: const Icon(
                                Icons.call_end,
                                color: Colors.white,
                                size: 32,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'End Call',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // 3. Speaker Toggle
                      _buildCallActionButton(
                        icon: _isSpeakerOn ? Icons.volume_up : Icons.volume_down,
                        label: 'Speaker',
                        isActive: _isSpeakerOn,
                        activeColor: const Color(0xFF3B82F6),
                        onTap: () {
                          HapticFeedback.mediumImpact();
                          setState(() => _isSpeakerOn = !_isSpeakerOn);
                        },
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCallActionButton({
    required IconData icon,
    required String label,
    required bool isActive,
    required Color activeColor,
    required VoidCallback onTap,
  }) {
    return ElasticPressable(
      pressedScale: 0.90,
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isActive
                  ? activeColor.withValues(alpha: 0.35)
                  : Colors.white.withValues(alpha: 0.12),
              border: Border.all(
                color: isActive
                    ? activeColor
                    : Colors.white.withValues(alpha: 0.20),
                width: 1.5,
              ),
            ),
            child: Icon(
              icon,
              color: Colors.white,
              size: 24,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.white.withValues(alpha: 0.75),
            ),
          ),
        ],
      ),
    );
  }
}
