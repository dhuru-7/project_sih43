/**
 * NSFWjs Content Moderation Service for SETU Citizen Reporting.
 * Dynamically loads TensorFlow.js & NSFWJS to scan images and video frames
 * client-side for inappropriate / NSFW content before civic report submission.
 */

let nsfwModelInstance = null;
let modelLoadingPromise = null;

function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Initializes and caches the NSFWJS model.
 */
export async function getNsfwModel() {
  if (nsfwModelInstance) return nsfwModelInstance;

  if (modelLoadingPromise) return modelLoadingPromise;

  modelLoadingPromise = (async () => {
    try {
      if (!window.tf) {
        await loadExternalScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js');
      }
      if (!window.nsfwjs) {
        await loadExternalScript('https://cdn.jsdelivr.net/npm/nsfwjs@2.4.2/dist/nsfwjs.min.js');
      }
      if (window.nsfwjs) {
        nsfwModelInstance = await window.nsfwjs.load();
        return nsfwModelInstance;
      }
    } catch (err) {
      console.warn('NSFWjs model loading error:', err);
    }
    return null;
  })();

  return modelLoadingPromise;
}

/**
 * Evaluates an array of NSFWJS predictions against safety thresholds.
 * Returns { isFlagged: boolean, reason: string, topOffender: object }
 */
function evaluatePredictions(predictions) {
  if (!predictions || !Array.isArray(predictions)) return { isFlagged: false };

  // Find probabilities
  const pornProb = predictions.find((p) => p.className === 'Porn')?.probability || 0;
  const hentaiProb = predictions.find((p) => p.className === 'Hentai')?.probability || 0;
  const sexyProb = predictions.find((p) => p.className === 'Sexy')?.probability || 0;

  if (pornProb > 0.50) {
    return {
      isFlagged: true,
      reason: `Explicit content detected (Porn: ${(pornProb * 100).toFixed(1)}%)`,
      topOffender: { className: 'Porn', probability: pornProb }
    };
  }

  if (hentaiProb > 0.50) {
    return {
      isFlagged: true,
      reason: `Animated adult content detected (Hentai: ${(hentaiProb * 100).toFixed(1)}%)`,
      topOffender: { className: 'Hentai', probability: hentaiProb }
    };
  }

  if (sexyProb > 0.75) {
    return {
      isFlagged: true,
      reason: `Inappropriate suggestiveness detected (Sexy: ${(sexyProb * 100).toFixed(1)}%)`,
      topOffender: { className: 'Sexy', probability: sexyProb }
    };
  }

  return { isFlagged: false };
}

/**
 * Classifies an image source (data URL, blob URL, or img element)
 */
async function classifyImageSource(model, src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        const predictions = await model.classify(img);
        resolve(evaluatePredictions(predictions));
      } catch (err) {
        console.warn('Image classification error:', err);
        resolve({ isFlagged: false });
      }
    };
    img.onerror = () => resolve({ isFlagged: false });
    img.src = src;

    // Timeout fallback after 3.5s
    setTimeout(() => resolve({ isFlagged: false }), 3500);
  });
}

/**
 * Extracts and classifies representative frames from a video file or blob.
 */
async function classifyVideoFrames(model, videoSrcOrBlob) {
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

      let cleaned = false;
      const cleanup = () => {
        if (!cleaned) {
          cleaned = true;
          if (typeof videoSrcOrBlob !== 'string') {
            try { URL.revokeObjectURL(url); } catch (e) {}
          }
          video.remove();
        }
      };

      video.onloadedmetadata = async () => {
        try {
          const duration = video.duration || 2;
          const seekPoints = [0.3, Math.min(1.5, duration / 2)];
          const canvas = document.createElement('canvas');
          canvas.width = 224;
          canvas.height = 224;
          const ctx = canvas.getContext('2d');

          for (const seekTime of seekPoints) {
            video.currentTime = seekTime;
            await new Promise((r) => { video.onseeked = r; });

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const predictions = await model.classify(canvas);
            const evalResult = evaluatePredictions(predictions);
            if (evalResult.isFlagged) {
              cleanup();
              return resolve(evalResult);
            }
          }

          cleanup();
          resolve({ isFlagged: false });
        } catch (e) {
          cleanup();
          resolve({ isFlagged: false });
        }
      };

      video.onerror = () => {
        cleanup();
        resolve({ isFlagged: false });
      };

      setTimeout(() => {
        cleanup();
        resolve({ isFlagged: false });
      }, 5000);
    } catch (e) {
      resolve({ isFlagged: false });
    }
  });
}

/**
 * Scans all media items (images and videos) attached by the user.
 * Returns:
 * {
 *   safe: boolean,
 *   flagged: boolean,
 *   reason?: string,
 *   offendingItem?: object
 * }
 */
export async function scanAllMedia(mediaItems) {
  if (!mediaItems || mediaItems.length === 0) {
    return { safe: true, flagged: false };
  }

  const model = await getNsfwModel();
  if (!model) {
    // If NSFWJS could not be loaded (e.g. offline), permit submission smoothly
    return { safe: true, flagged: false };
  }

  for (const item of mediaItems) {
    try {
      if (item.type === 'image') {
        const src = item.url || (item.file ? URL.createObjectURL(item.file) : null);
        if (src) {
          const res = await classifyImageSource(model, src);
          if (res.isFlagged) {
            return {
              safe: false,
              flagged: true,
              reason: res.reason,
              offendingItem: item
            };
          }
        }
      } else if (item.type === 'video') {
        const videoInput = item.file || item.blob || item.url;
        if (videoInput) {
          const res = await classifyVideoFrames(model, videoInput);
          if (res.isFlagged) {
            return {
              safe: false,
              flagged: true,
              reason: res.reason,
              offendingItem: item
            };
          }
        }
      }
    } catch (err) {
      console.warn('Media scan item error:', err);
    }
  }

  return { safe: true, flagged: false };
}
