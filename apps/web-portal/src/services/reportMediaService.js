import { extractVideoKeyframes } from './geoService';

function readFileAsDataUrl(fileOrBlob) {
  return new Promise((resolve) => {
    if (!fileOrBlob) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(fileOrBlob);
  });
}

function writeWavString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeMonoWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeWavString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 36 + samples.length * 2, true);
  /* RIFF type */
  writeWavString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeWavString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw PCM) */
  view.setUint16(20, 1, true);
  /* channel count (1 = mono) */
  view.setUint16(22, 1, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 2, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeWavString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  // Write 16-bit PCM samples (clamped)
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

/**
 * Decodes the audio track from a video File or Blob into a 16kHz mono WAV Blob.
 * Supported natively by browser Web Audio API across desktop & mobile.
 */
export async function extractAudioFromVideo(videoFileOrBlob) {
  if (!videoFileOrBlob) return null;

  try {
    const arrayBuffer = await videoFileOrBlob.arrayBuffer();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    const audioCtx = new AudioContextClass({ sampleRate: 16000 });
    let audioBuffer = null;
    try {
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
    } catch (decodeErr) {
      try { audioCtx.close(); } catch (_) {}
      return null;
    }

    if (!audioBuffer || audioBuffer.numberOfChannels === 0 || audioBuffer.length === 0) {
      try { audioCtx.close(); } catch (_) {}
      return null;
    }

    const numChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const monoData = new Float32Array(length);

    for (let c = 0; c < numChannels; c++) {
      const channelData = audioBuffer.getChannelData(c);
      for (let i = 0; i < length; i++) {
        monoData[i] += channelData[i] / numChannels;
      }
    }

    try { audioCtx.close(); } catch (_) {}

    // Check if audio has audible sound (RMS check)
    let sumSquares = 0;
    const step = Math.max(1, Math.floor(length / 1000));
    let sampleCount = 0;
    for (let i = 0; i < length; i += step) {
      sumSquares += monoData[i] * monoData[i];
      sampleCount++;
    }
    const rms = Math.sqrt(sumSquares / Math.max(1, sampleCount));
    if (rms < 0.001) {
      // Near-zero energy / silent video
      return null;
    }

    return encodeMonoWav(monoData, sampleRate);
  } catch (err) {
    console.warn('extractAudioFromVideo error:', err);
    return null;
  }
}

import { transcribeAudioDirect } from './sarvamClientService';

async function transcribeAudioBlob(blob, fallbackName, apiBaseUrl) {
  if (!blob || blob.size <= 800) return '';

  const filename = blob.name || fallbackName || 'speech.wav';

  // 1. Try backend proxy first
  try {
    const formData = new FormData();
    formData.append('audio', blob, filename);

    const response = await fetch(`${apiBaseUrl}/voice/transcribe`, {
      method: 'POST',
      body: formData
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const json = await response.json().catch(() => null);
      if (json?.status === 'success' && json?.data?.transcript) {
        return json.data.transcript.trim();
      }
    }
  } catch (err) {
    console.warn('Backend transcription unavailable, using direct Sarvam STT:', err);
  }

  // 2. Direct Sarvam Saaras v3 fallback (CORS supported natively by api.sarvam.ai)
  try {
    const directTranscript = await transcribeAudioDirect(blob, filename);
    if (directTranscript) {
      return directTranscript;
    }
  } catch (directErr) {
    console.warn('Direct Sarvam STT fallback failed:', directErr);
  }

  return '';
}

async function transcribeVideoItem(item, apiBaseUrl) {
  const cachedTranscript = item?.transcript?.trim();
  if (cachedTranscript) return cachedTranscript;

  // 1. If an audio blob was already recorded or extracted, transcribe that directly
  if (item?.audioBlob && item.audioBlob.size > 800) {
    try {
      const transcript = await transcribeAudioBlob(item.audioBlob, 'recorded_audio.wav', apiBaseUrl);
      if (transcript) return transcript;
    } catch (err) {
      console.warn('Direct audioBlob transcription failed:', err);
    }
  }

  // 2. Extract audio track from video file into 16kHz mono WAV
  const videoSource = item?.file || item?.blob;
  if (videoSource) {
    try {
      const wavAudio = await extractAudioFromVideo(videoSource);
      if (wavAudio && wavAudio.size > 800) {
        const transcript = await transcribeAudioBlob(wavAudio, 'video_extracted.wav', apiBaseUrl);
        if (transcript) return transcript;
      }
    } catch (err) {
      console.warn('Extracted video audio transcription failed:', err);
    }
  }

  return '';
}

export async function collectReportMediaEvidence(mediaItems = [], apiBaseUrl) {
  const imagePayloads = [];
  const videoTranscripts = [];

  for (const item of mediaItems) {
    if (item.type === 'image') {
      if (item.file || item.blob) {
        const dataUrl = await readFileAsDataUrl(item.file || item.blob);
        if (dataUrl) imagePayloads.push(dataUrl);
      } else if (item.url?.startsWith('data:')) {
        imagePayloads.push(item.url);
      }
      continue;
    }

    if (item.type === 'video') {
      try {
        const keyframes = await extractVideoKeyframes(item.file || item.blob || item.url, 3);
        if (keyframes?.length) {
          imagePayloads.push(...keyframes);
        }
      } catch (err) {
        console.warn('Could not extract video keyframes:', err);
      }

      const transcript = await transcribeVideoItem(item, apiBaseUrl);
      if (transcript) {
        videoTranscripts.push(transcript);
      }
    }
  }

  return { imagePayloads, videoTranscripts };
}

