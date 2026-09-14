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
/**
 * Extracts multiple distinct visual keyframes across a video file or blob for AI Vision analysis.
 * Skips initial dark/black startup frames and samples across duration (e.g. 20%, 50%, 80%).
 */
/**
 * Calculates average luminance across a canvas using a 200+ point grid.
 * Returns value 0-255 (values < 16 indicate pitch black or unrendered frames).
 */
function calculateCanvasLuminance(ctx, width, height) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height).data;
    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / 200));
    let sumLum = 0;
    let count = 0;
    for (let i = 0; i < totalPixels; i += step) {
      const idx = i * 4;
      const r = imgData[idx];
      const g = imgData[idx + 1];
      const b = imgData[idx + 2];
      sumLum += 0.299 * r + 0.587 * g + 0.114 * b;
      count++;
    }
    return count > 0 ? sumLum / count : 0;
  } catch (e) {
    return 50; // default to acceptable if security prevents reading
  }
}

/**
 * Extracts multiple distinct visual keyframes across a video file or blob for AI Vision analysis.
 * Strictly rejects dark/pitch-black startup frames and samples illuminated physical content.
 */
export function extractVideoKeyframes(videoSrcOrBlob, maxFrames = 3) {
  return new Promise((resolve) => {
    if (!videoSrcOrBlob) return resolve([]);

    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';

      // Keep in DOM offscreen so browser hardware compositor and video decoder run reliably
      video.style.position = 'fixed';
      video.style.top = '-9999px';
      video.style.left = '-9999px';
      video.style.width = '320px';
      video.style.height = '240px';
      video.style.opacity = '0';
      video.style.pointerEvents = 'none';
      document.body.appendChild(video);

      const url =
        typeof videoSrcOrBlob === 'string'
          ? videoSrcOrBlob
          : URL.createObjectURL(videoSrcOrBlob);
      video.src = url;

      let finished = false;
      const cleanup = () => {
        if (!finished) {
          finished = true;
          try { video.pause(); } catch (_) {}
          if (typeof videoSrcOrBlob !== 'string') {
            try { URL.revokeObjectURL(url); } catch (_) {}
          }
          try { video.remove(); } catch (_) {}
        }
      };

      const capturedFrames = [];
      const frameScores = []; // { dataUrl, lum }

      const processVideo = async () => {
        try {
          const duration = video.duration && !isNaN(video.duration) && isFinite(video.duration)
            ? video.duration
            : 3.5;

          // Compute target timestamps spread across the video avoiding initial 0.3s black fade-in
          let targetTimes = [];
          if (duration > 2.5) {
            targetTimes = [
              duration * 0.25,
              duration * 0.50,
              duration * 0.75,
              Math.max(1.0, duration - 0.4)
            ];
          } else if (duration > 1.0) {
            targetTimes = [0.5, duration * 0.5, Math.max(0.7, duration - 0.2)];
          } else {
            targetTimes = [Math.max(0.1, duration * 0.4), Math.max(0.2, duration * 0.8)];
          }

          const canvas = document.createElement('canvas');
          const maxDim = 720;
          const origW = video.videoWidth || 640;
          const origH = video.videoHeight || 480;
          const scale = Math.min(1, maxDim / Math.max(origW, origH));
          canvas.width = Math.round(origW * scale);
          canvas.height = Math.round(origH * scale);
          const ctx = canvas.getContext('2d');

          // Pass 1: Seek through target timestamps
          for (const time of targetTimes) {
            if (capturedFrames.length >= maxFrames) break;
            try {
              await new Promise((seekRes) => {
                let done = false;
                const onSeek = () => {
                  if (!done) {
                    done = true;
                    video.removeEventListener('seeked', onSeek);
                    seekRes();
                  }
                };
                video.addEventListener('seeked', onSeek, { once: true });
                video.currentTime = Math.min(time, Math.max(0.1, duration - 0.15));
                setTimeout(onSeek, 900); // safety fallback
              });

              if (ctx && canvas.width > 0 && canvas.height > 0) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const lum = calculateCanvasLuminance(ctx, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

                if (dataUrl && dataUrl.length > 500) {
                  frameScores.push({ dataUrl, lum });
                  if (lum >= 16) {
                    capturedFrames.push(dataUrl);
                  }
                }
              }
            } catch (_) {}
          }

          // Pass 2: Active playback capture if static seeking returned dark frames
          if (capturedFrames.length < 2 && duration > 0.4) {
            try {
              video.currentTime = Math.min(0.6, duration * 0.2);
              await video.play().catch(() => {});
              for (let i = 0; i < 4 && capturedFrames.length < maxFrames; i++) {
                await new Promise((r) => setTimeout(r, 200));
                if (ctx && canvas.width > 0 && canvas.height > 0) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const lum = calculateCanvasLuminance(ctx, canvas.width, canvas.height);
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                  if (dataUrl && dataUrl.length > 500) {
                    frameScores.push({ dataUrl, lum });
                    if (lum >= 16) {
                      capturedFrames.push(dataUrl);
                    }
                  }
                }
              }
              video.pause();
            } catch (_) {}
          }

          cleanup();

          // If all frames were low luminance, pick the brightest frame available
          if (capturedFrames.length === 0 && frameScores.length > 0) {
            frameScores.sort((a, b) => b.lum - a.lum);
            resolve([frameScores[0].dataUrl]);
          } else {
            resolve(capturedFrames.slice(0, maxFrames));
          }
        } catch (err) {
          cleanup();
          resolve(capturedFrames);
        }
      };

      // Trigger video load
      video.onloadeddata = () => processVideo();
      video.onloadedmetadata = () => {
        if (video.readyState >= 2) processVideo();
      };

      video.onerror = () => {
        cleanup();
        resolve([]);
      };

      // Explicitly call load() to start browser decoding pipeline
      try {
        video.load();
      } catch (_) {}

      // Fallback timeout after 5.5s
      setTimeout(() => {
        cleanup();
        if (capturedFrames.length > 0) {
          resolve(capturedFrames);
        } else if (frameScores.length > 0) {
          frameScores.sort((a, b) => b.lum - a.lum);
          resolve([frameScores[0].dataUrl]);
        } else {
          resolve([]);
        }
      }, 5500);
    } catch (e) {
      resolve([]);
    }
  });
}

/**
 * Extracts the single best, illuminated visual frame thumbnail from a video.
 * Never returns a pitch-black box if any illuminated content exists.
 */
export async function extractVideoThumbnail(videoSrcOrBlob) {
  if (!videoSrcOrBlob) return null;
  const frames = await extractVideoKeyframes(videoSrcOrBlob, 3);
  if (frames && frames.length > 0) {
    return frames[0];
  }
  return null;
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
 * Extracts audio track from a video/audio file or blob into a lightweight WAV or WebM blob.
 * Uses Web Audio API decodeAudioData with fallback to MediaElementSource fast-capture.
 */
export async function extractAudioFromMedia(fileOrBlob) {
  if (!fileOrBlob) return null;

  // Direct attached audioBlob on media item
  if (fileOrBlob.audioBlob) {
    return fileOrBlob.audioBlob;
  }

  // Already an audio file
  if (fileOrBlob.type && fileOrBlob.type.startsWith('audio/')) {
    return fileOrBlob;
  }

  // Method 1: Try decodeAudioData via AudioContext
  try {
    const arrayBuffer = await fileOrBlob.arrayBuffer();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      const audioCtx = new AudioContextClass();
      const decoded = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
      try { await audioCtx.close(); } catch (e) {}

      if (decoded && decoded.length > 0) {
        const maxSamples = Math.min(decoded.length, decoded.sampleRate * 60);
        const wave = bufferToWave(decoded, maxSamples);
        if (wave && wave.size > 1500) return wave;
      }
    }
  } catch (err) {
    // decodeAudioData may fail on some container formats, proceed to Method 2
  }

  // Method 2: HTML5 Video captureStream with MUTED playback (bypasses browser autoplay policy)
  try {
    return await new Promise((resolve) => {
      const video = document.createElement('video');
      video.muted = true; // MUST be muted so video.play() is NEVER blocked by browser autoplay policy!
      video.playsInline = true;
      video.crossOrigin = 'anonymous';
      const url = URL.createObjectURL(fileOrBlob);
      video.src = url;

      let finished = false;
      const cleanup = () => {
        if (!finished) {
          finished = true;
          try { URL.revokeObjectURL(url); } catch (e) {}
          video.remove();
        }
      };

      video.onloadedmetadata = async () => {
        try {
          // Check for captureStream
          let captureStream = null;
          if (video.captureStream) {
            captureStream = video.captureStream();
          } else if (video.mozCaptureStream) {
            captureStream = video.mozCaptureStream();
          }

          let audioTracks = captureStream ? captureStream.getAudioTracks() : [];
          
          // Fallback to Web Audio destination if captureStream has no audio track
          let streamToRecord = null;
          let ctx = null;
          if (audioTracks && audioTracks.length > 0) {
            streamToRecord = new MediaStream(audioTracks);
          } else {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
              ctx = new AudioContextClass();
              const source = ctx.createMediaElementSource(video);
              const dest = ctx.createMediaStreamDestination();
              source.connect(dest);
              streamToRecord = dest.stream;
            }
          }

          if (!streamToRecord || streamToRecord.getAudioTracks().length === 0) {
            cleanup();
            // If it's a webm file, it often already contains audio/webm payload
            if (fileOrBlob.type && fileOrBlob.type.includes('webm')) {
              return resolve(new Blob([fileOrBlob], { type: 'audio/webm' }));
            }
            return resolve(null);
          }

          const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '');
          const recorder = new MediaRecorder(streamToRecord, mimeType ? { mimeType } : {});
          const chunks = [];

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
          };

          recorder.onstop = () => {
            cleanup();
            if (ctx) { try { ctx.close(); } catch (e) {} }
            const blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
            resolve(blob.size > 800 ? blob : null);
          };

          recorder.start(100);
          video.playbackRate = 2.0; // Extract at 2x speed
          video.play().catch(() => {
            if (recorder.state !== 'inactive') recorder.stop();
          });

          video.onended = () => {
            if (recorder.state !== 'inactive') recorder.stop();
          };

          setTimeout(() => {
            if (recorder.state !== 'inactive') recorder.stop();
          }, 6000);
        } catch (e) {
          cleanup();
          // Fallback: If webm, pass as audio/webm
          if (fileOrBlob.type && fileOrBlob.type.includes('webm')) {
            return resolve(new Blob([fileOrBlob], { type: 'audio/webm' }));
          }
          resolve(null);
        }
      };

      video.onerror = () => {
        cleanup();
        if (fileOrBlob.type && fileOrBlob.type.includes('webm')) {
          return resolve(new Blob([fileOrBlob], { type: 'audio/webm' }));
        }
        resolve(null);
      };

      setTimeout(() => {
        cleanup();
        if (fileOrBlob.type && fileOrBlob.type.includes('webm')) {
          return resolve(new Blob([fileOrBlob], { type: 'audio/webm' }));
        }
        resolve(null);
      }, 7000);
    });
  } catch (e) {
    console.warn('Video audio track extraction skipped:', e);
    if (fileOrBlob.type && fileOrBlob.type.includes('webm')) {
      return new Blob([fileOrBlob], { type: 'audio/webm' });
    }
    return null;
  }
}

