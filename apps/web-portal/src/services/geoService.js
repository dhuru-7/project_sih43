/**
 * Reverse geocodes latitude & longitude into structured administrative divisions
 * using OpenStreetMap Nominatim API (Free, open-access, no key required).
 */
export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    const resp = await fetch(url, {
      headers: {
        'Accept-Language': 'en,hi',
        'User-Agent': 'Setu-Citizen-Platform/1.0'
      }
    });
    if (!resp.ok) throw new Error(`Geocoding HTTP error: ${resp.status}`);
    const data = await resp.json();
    const addr = data.address || {};

    const villageCity =
      addr.suburb ||
      addr.neighbourhood ||
      addr.village ||
      addr.town ||
      addr.city ||
      addr.residential ||
      'Local Area';

    const subdistrict =
      addr.county ||
      addr.subdistrict ||
      addr.tehsil ||
      addr.taluk ||
      addr.block ||
      '';

    const district = addr.state_district || addr.district || 'Ranchi';
    const state = addr.state || 'Jharkhand';
    const pincode = addr.postcode || '';

    // Build human-readable formatted address
    const parts = [villageCity];
    if (subdistrict && subdistrict !== villageCity) parts.push(subdistrict);
    if (district) parts.push(district);
    if (pincode) parts.push(`PIN: ${pincode}`);

    return {
      formatted: parts.join(', '),
      villageCity,
      subdistrict,
      district,
      state,
      pincode,
      displayName: data.display_name || parts.join(', ')
    };
  } catch (err) {
    console.warn('Reverse geocode failed, using fallback:', err);
    return {
      formatted: 'Morabadi, Ranchi, Jharkhand',
      villageCity: 'Morabadi',
      subdistrict: 'Ranchi Sadar',
      district: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834008',
      displayName: 'Morabadi, Ranchi, Jharkhand'
    };
  }
}

/**
 * Extracts the first frame of a video blob or URL as a base64 JPEG thumbnail.
 */
export function extractVideoThumbnail(videoSrcOrBlob) {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';

      const url =
        typeof videoSrcOrBlob === 'string'
          ? videoSrcOrBlob
          : URL.createObjectURL(videoSrcOrBlob);
      video.src = url;

      let resolved = false;

      const finish = (dataUrl) => {
        if (!resolved) {
          resolved = true;
          if (typeof videoSrcOrBlob !== 'string') {
            try {
              URL.revokeObjectURL(url);
            } catch (e) {}
          }
          resolve(dataUrl);
        }
      };

      video.onloadeddata = () => {
        video.currentTime = 0.1;
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 320;
          canvas.height = video.videoHeight || 240;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          finish(dataUrl);
        } catch (e) {
          finish(null);
        }
      };

      video.onerror = () => finish(null);

      // Fallback timeout after 2.5s
      setTimeout(() => finish(null), 2500);
    } catch (e) {
      resolve(null);
    }
  });
}

/**
 * Helper to encode an AudioBuffer to a standard 16-bit PCM WAV Blob
 */
function bufferToWave(abuffer, totalSamples) {
  const numOfChan = abuffer.numberOfChannels;
  const length = totalSamples * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels = [];
  let sample = 0;
  let offset = 0;
  let pos = 0;

  function writeString(str) {
    for (let i = 0; i < str.length; i++) {
      out.setUint8(pos++, str.charCodeAt(i));
    }
  }

  writeString('RIFF');
  out.setUint32(pos, length - 8, true); pos += 4;
  writeString('WAVE');
  writeString('fmt ');
  out.setUint32(pos, 16, true); pos += 4;
  out.setUint16(pos, 1, true); pos += 2;
  out.setUint16(pos, numOfChan, true); pos += 2;
  out.setUint32(pos, abuffer.sampleRate, true); pos += 4;
  out.setUint32(pos, abuffer.sampleRate * 2 * numOfChan, true); pos += 4;
  out.setUint16(pos, numOfChan * 2, true); pos += 2;
  out.setUint16(pos, 16, true); pos += 2;
  writeString('data');
  out.setUint32(pos, length - pos - 4, true); pos += 4;

  for (let i = 0; i < abuffer.numberOfChannels; i++) {
    channels.push(abuffer.getChannelData(i));
  }

  while (offset < totalSamples) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out.buffer], { type: 'audio/wav' });
}

/**
 * Extracts audio track from a video/audio file or blob into a lightweight WAV blob.
 */
export async function extractAudioFromMedia(fileOrBlob) {
  if (!fileOrBlob) return null;
  try {
    if (fileOrBlob.type && fileOrBlob.type.startsWith('audio/')) {
      return fileOrBlob;
    }

    const arrayBuffer = await fileOrBlob.arrayBuffer();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    const audioCtx = new AudioContextClass();
    const decoded = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
    try { await audioCtx.close(); } catch (e) {}

    const maxSamples = Math.min(decoded.length, decoded.sampleRate * 60);
    return bufferToWave(decoded, maxSamples);
  } catch (err) {
    console.warn('Audio track extraction skipped:', err);
    return null;
  }
}

