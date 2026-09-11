import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { reverseGeocode, extractVideoThumbnail, extractAudioFromMedia } from '../../../services/geoService';
import { scanAllMedia } from '../../../services/nsfwService';
import { synthesizeFallbackGrievance } from '../../../services/clientSynthesisService';
import { TaraAuraProcessingScreen } from '../../../components/ui/TaraAuraProcessingScreen';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// =========================================================================
// REVIEW MEDIA CAROUSEL (40% HEIGHT, EXPLORE-PAGE SWIPE/SWAP, PAUSED BY DEFAULT)
// =========================================================================
const ReviewMediaCarousel = ({
  mediaItems,
  currentIndex,
  onIndexChange,
  isPlaying,
  setIsPlaying,
  videoRefs
}) => {
  const total = mediaItems.length;
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isSwipingRef = useRef(false);
  const isHorizontalGestureRef = useRef(null);
  const hasMovedRef = useRef(false);
  const containerRef = useRef(null);

  const pauseAllVideos = () => {
    Object.values(videoRefs.current).forEach((v) => {
      if (v) {
        v.pause();
      }
    });
    setIsPlaying(false);
  };

  const handlePrev = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (currentIndex > 0) {
      pauseAllVideos();
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (currentIndex < total - 1) {
      pauseAllVideos();
      onIndexChange(currentIndex + 1);
    }
  };

  const handleStart = (clientX, clientY) => {
    if (total <= 1) return;
    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
    isSwipingRef.current = true;
    isHorizontalGestureRef.current = null;
    hasMovedRef.current = false;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMove = (clientX, clientY, e) => {
    if (!isSwipingRef.current || total <= 1) return;
    const deltaX = clientX - touchStartRef.current.x;
    const deltaY = clientY - touchStartRef.current.y;

    if (isHorizontalGestureRef.current === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isHorizontalGestureRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalGestureRef.current) {
      if (e && e.cancelable && e.preventDefault) {
        e.preventDefault();
      }
      hasMovedRef.current = true;
      let effective = deltaX;
      if (currentIndex === 0 && deltaX > 0) {
        effective = deltaX * 0.32;
      } else if (currentIndex === total - 1 && deltaX < 0) {
        effective = deltaX * 0.32;
      }
      setDragOffset(effective);
    }
  };

  const handleEnd = () => {
    if (!isSwipingRef.current) return;
    isSwipingRef.current = false;
    setIsDragging(false);

    const elapsed = Date.now() - touchStartRef.current.time;
    const velocity = Math.abs(dragOffset) / (elapsed || 1);
    const containerWidth = containerRef.current?.offsetWidth || 500;
    const threshold = Math.max(40, containerWidth * 0.16);

    if ((dragOffset < -threshold || (dragOffset < -20 && velocity > 0.32)) && currentIndex < total - 1) {
      pauseAllVideos();
      onIndexChange(currentIndex + 1);
    } else if ((dragOffset > threshold || (dragOffset > 20 && velocity > 0.32)) && currentIndex > 0) {
      pauseAllVideos();
      onIndexChange(currentIndex - 1);
    }

    setDragOffset(0);
    isHorizontalGestureRef.current = null;
  };

  const toggleVideoPlay = (idx, e) => {
    if (hasMovedRef.current) return;
    if (e && e.stopPropagation) e.stopPropagation();
    const videoEl = videoRefs.current[idx];
    if (!videoEl) return;
    if (videoEl.paused) {
      videoEl.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY, e)}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY, e)}
      onMouseUp={handleEnd}
      onMouseLeave={() => {
        if (isSwipingRef.current) handleEnd();
      }}
      onClickCapture={(e) => {
        if (hasMovedRef.current) {
          e.stopPropagation();
        }
      }}
      style={{
        position: 'relative',
        width: '100%',
        height: '320px',
        maxHeight: '360px',
        backgroundColor: '#000000',
        overflow: 'hidden',
        userSelect: 'none',
        touchAction: 'pan-y',
        cursor: total > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
      }}
    >
      {/* Sliding Strip */}
      <div
        style={{
          display: 'flex',
          width: `${total * 100}%`,
          height: '100%',
          transform: `translateX(calc(-${(currentIndex * 100) / total}% + ${dragOffset}px))`,
          transition: isDragging ? 'none' : 'transform 0.32s cubic-bezier(0.23, 1, 0.32, 1)',
          willChange: 'transform'
        }}
      >
        {mediaItems.map((item, idx) => (
          <div
            key={item.id || idx}
            style={{
              width: `${100 / total}%`,
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000000',
              flexShrink: 0
            }}
          >
            {item.type === 'video' ? (
              <div
                style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}
                onClick={(e) => toggleVideoPlay(idx, e)}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={item.url}
                  loop
                  playsInline
                  muted={idx !== currentIndex}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />

                {/* Paused Play Button Overlay */}
                {(!isPlaying || idx !== currentIndex) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1.5px solid rgba(255, 255, 255, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                      pointerEvents: 'none',
                      zIndex: 5
                    }}
                  >
                    <GoogleIcon name="play_arrow" size={36} color="#ffffff" />
                  </div>
                )}
              </div>
            ) : (
              <img
                src={item.url}
                alt="Attached Evidence"
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          {/* Counter Badge */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            {currentIndex + 1} of {total}
          </div>

          {/* Prev Chevron Button */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              aria-label="Previous"
            >
              <GoogleIcon name="chevron_left" size={24} color="#ffffff" />
            </button>
          )}

          {/* Next Chevron Button */}
          {currentIndex < total - 1 && (
            <button
              type="button"
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              aria-label="Next"
            >
              <GoogleIcon name="chevron_right" size={24} color="#ffffff" />
            </button>
          )}

          {/* Dots Indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            {mediaItems.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: idx === currentIndex ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor: idx === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const DesktopReportingModal = ({
  isOpen,
  onClose,
  onReportSubmitted,
  userName = 'Citizen'
}) => {
  const navigate = useNavigate();

  // Steps: 'media' | 'notepad' | 'processing' | 'review' | 'success'
  const [step, setStep] = useState('media');

  // NSFW Moderation State
  const [isNsfwFlagged, setIsNsfwFlagged] = useState(false);
  const [nsfwReason, setNsfwReason] = useState('');

  // Media items: array of { id, type: 'video' | 'image', url, file, blob, name }
  const [mediaItems, setMediaItems] = useState([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const videoRefs = useRef({});

  // Notepad State (Citizen profile)
  const [notepadText, setNotepadText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [locationDetails, setLocationDetails] = useState({
    formatted: 'Morabadi, Ranchi, Jharkhand',
    villageCity: 'Morabadi',
    subdistrict: 'Ranchi Sadar',
    district: 'Ranchi',
    state: 'Jharkhand',
    pincode: '834008'
  });
  const [coordinates, setCoordinates] = useState(null);

  // Voice recording inside Notepad
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const voiceRecorderRef = useRef(null);
  const voiceChunksRef = useRef([]);
  const voiceStreamRef = useRef(null);
  const voiceAudioCtxRef = useRef(null);
  const silenceCheckIntervalRef = useRef(null);
  const maxVoiceTimerRef = useRef(null);

  // Synthesized Review data & Final Submission
  const [reviewData, setReviewData] = useState(null);
  const [reviewMediaIndex, setReviewMediaIndex] = useState(0);
  const [isReviewPlaying, setIsReviewPlaying] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const reviewVideoRefs = useRef({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProblem, setSubmittedProblem] = useState(null);

  const fileInputRef = useRef(null);

  // Geolocation & OpenStreetMap reverse geocoding
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCoordinates({ lat, lng: lon });
          const geo = await reverseGeocode(lat, lon);
          setLocationDetails(geo);
        },
        async () => {
          const geo = await reverseGeocode(23.3441, 85.3096);
          setLocationDetails(geo);
        },
        { timeout: 7000 }
      );
    }
  }, [isOpen]);

  // Voice recording timer
  useEffect(() => {
    let interval = null;
    if (isRecordingVoice) {
      interval = setInterval(() => setVoiceSeconds((s) => s + 1), 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // PREVENT MULTI-VIDEO AUDIO OVERLAP ON DESKTOP
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idxStr, el]) => {
      const idx = parseInt(idxStr, 10);
      if (el) {
        if (step === 'media' && idx === activeMediaIndex) {
          el.muted = false;
          el.play().catch(() => {});
        } else {
          el.pause();
          el.currentTime = 0;
          el.muted = true;
        }
      }
    });
  }, [activeMediaIndex, step]);

  // PREVENT MULTI-VIDEO AUDIO OVERLAP IN REVIEW STEP
  useEffect(() => {
    Object.entries(reviewVideoRefs.current).forEach(([idxStr, el]) => {
      const idx = parseInt(idxStr, 10);
      if (el) {
        if (step === 'review' && idx === reviewMediaIndex) {
          el.muted = false;
          if (isReviewPlaying) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        } else {
          el.pause();
          el.currentTime = 0;
          el.muted = true;
        }
      }
    });
  }, [reviewMediaIndex, step, isReviewPlaying]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newItems = files.map((file) => ({
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      file: file,
      name: file.name
    }));

    setMediaItems((prev) => {
      const updated = [...prev, ...newItems];
      setActiveMediaIndex(updated.length - 1);
      return updated;
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveMedia = (idToRemove) => {
    const remaining = mediaItems.filter((item) => item.id !== idToRemove);
    setMediaItems(remaining);
    setActiveMediaIndex((prev) => Math.min(prev, Math.max(0, remaining.length - 1)));
  };

  // Voice recording inside Notepad with Silence Detection & Guaranteed Track Release
  const stopVoiceRecording = useCallback(() => {
    if (silenceCheckIntervalRef.current) {
      clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
    }
    if (maxVoiceTimerRef.current) {
      clearTimeout(maxVoiceTimerRef.current);
      maxVoiceTimerRef.current = null;
    }
    if (voiceAudioCtxRef.current) {
      try {
        voiceAudioCtxRef.current.close();
      } catch (_) {}
      voiceAudioCtxRef.current = null;
    }
    if (voiceRecorderRef.current && voiceRecorderRef.current.state !== 'inactive') {
      try {
        voiceRecorderRef.current.stop();
      } catch (_) {}
    }
    if (voiceStreamRef.current) {
      try {
        voiceStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch (_) {}
      voiceStreamRef.current = null;
    }
    setIsRecordingVoice(false);
  }, []);

  // Voice recording inside Notepad
  const handleToggleVoiceInNotepad = async () => {
    if (isRecordingVoice) {
      stopVoiceRecording();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceStreamRef.current = stream;
      voiceChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      voiceRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          voiceChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        if (voiceStreamRef.current) {
          try {
            voiceStreamRef.current.getTracks().forEach((t) => t.stop());
          } catch (_) {}
          voiceStreamRef.current = null;
        }

        const audioBlob = new Blob(voiceChunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size > 0) {
          try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'voice.webm');

            const resp = await fetch(`${API_BASE_URL}/voice/transcribe`, {
              method: 'POST',
              body: formData
            });

            const json = await resp.json();
            if (resp.ok && json.status === 'success' && json.data) {
              const transcribed = json.data.transcript;
              if (transcribed) {
                setNotepadText((prev) => (prev ? prev.trim() + '\n\n' + transcribed : transcribed));
              }
            }
          } catch (err) {
            console.error('Error transcribing audio:', err);
          }
        }
      };

      recorder.start();
      setIsRecordingVoice(true);

      // Auto-turn off: Silence detection with Web Audio API
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          voiceAudioCtxRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          let userSpoke = false;
          let silenceMs = 0;

          silenceCheckIntervalRef.current = setInterval(() => {
            if (!voiceRecorderRef.current || voiceRecorderRef.current.state === 'inactive') {
              if (silenceCheckIntervalRef.current) {
                clearInterval(silenceCheckIntervalRef.current);
                silenceCheckIntervalRef.current = null;
              }
              return;
            }

            analyser.getByteFrequencyData(dataArray);
            let total = 0;
            for (let i = 0; i < dataArray.length; i++) {
              total += dataArray[i];
            }
            const avg = total / dataArray.length;

            if (avg > 14) {
              userSpoke = true;
              silenceMs = 0;
            } else {
              silenceMs += 150;
            }

            // Auto stop when user finishes speaking (2.2s silence) or if no speech (5s silence)
            if ((userSpoke && silenceMs >= 2200) || (!userSpoke && silenceMs >= 5000)) {
              stopVoiceRecording();
            }
          }, 150);
        }
      } catch (audioErr) {
        console.warn('AudioContext silence detection setup error:', audioErr);
      }

      // Hard safety timer: Stop after 25s maximum
      maxVoiceTimerRef.current = setTimeout(() => {
        stopVoiceRecording();
      }, 25000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access was denied. You can type grievance details directly.');
      setIsRecordingVoice(false);
    }
  };

  // Continue from Notepad -> Full-Screen Glowing Aura Processing ("Hold on...") -> Transition to Review Card
  const handleContinueFromNotepad = async () => {
    // Unconditionally kill voice recording and release microphone
    stopVoiceRecording();

    if (!notepadText.trim() && mediaItems.length === 0) {
      alert('Please type or speak your grievance details, or attach media before continuing.');
      return;
    }

    setStep('processing');

    try {
      // 0. NSFWjs Content Moderation Check
      let isFlagged = false;
      let flagReason = '';
      try {
        const scanRes = await scanAllMedia(mediaItems);
        if (scanRes && scanRes.flagged) {
          isFlagged = true;
          flagReason = scanRes.reason || 'Inappropriate / Adult content detected';
          setIsNsfwFlagged(true);
          setNsfwReason(flagReason);
        }
      } catch (scanErr) {
        console.warn('NSFW scanning warning:', scanErr);
      }

      // 1. Process all media items (Images + Videos)
      const imagePayloads = [];
      const videoTranscripts = [];

      for (const item of mediaItems) {
        if (item.type === 'image') {
          if (item.file) {
            const reader = new FileReader();
            const b64 = await new Promise((res) => {
              reader.onloadend = () => res(reader.result);
              reader.readAsDataURL(item.file);
            });
            if (b64) imagePayloads.push(b64);
          } else if (item.url && item.url.startsWith('data:')) {
            imagePayloads.push(item.url);
          }
        } else if (item.type === 'video') {
          // Extract a frame thumbnail from video as image payload for AI vision
          try {
            const frameThumb = await extractVideoThumbnail(item.file || item.blob || item.url);
            if (frameThumb) imagePayloads.push(frameThumb);
          } catch (e) {
            console.warn('Could not extract video frame thumbnail:', e);
          }

          // Extract audio track from video and transcribe via Sarvam Saaras v3 STT
          try {
            const audioBlob = await extractAudioFromMedia(item.file || item.blob);
            if (audioBlob && audioBlob.size > 1000) {
              const formData = new FormData();
              formData.append('audio', audioBlob, 'video_audio.wav');
              const tResp = await fetch(`${API_BASE_URL}/voice/transcribe`, {
                method: 'POST',
                body: formData
              });
              const tJson = await tResp.json();
              if (tResp.ok && tJson.data && tJson.data.transcript) {
                videoTranscripts.push(tJson.data.transcript);
              }
            }
          } catch (e) {
            console.warn('Could not transcribe video audio:', e);
          }
        }
      }

      // 2. Select card hero thumbnail: first image or first frame of video
      let finalThumbnail = null;
      const firstImage = mediaItems.find((m) => m.type === 'image');
      const firstVideo = mediaItems.find((m) => m.type === 'video');
      if (firstImage) {
        finalThumbnail = firstImage.url;
      } else if (firstVideo) {
        finalThumbnail = await extractVideoThumbnail(firstVideo.blob || firstVideo.file || firstVideo.url);
      }

      // 3. Process with AI Engine (Groq LLM Mind with llama-3.3-70b-versatile)
      const aiPayload = {
        text: notepadText.trim(),
        videoTranscript: videoTranscripts.join('; '),
        images: imagePayloads.slice(0, 4),
        locationInfo: locationDetails,
        reporterType: 'Individual Citizen',
        groupName: '',
        safetyStatus: isFlagged ? 'FLAGGED_POLICY_VIOLATION' : 'SAFE'
      };

      let aiResult = null;
      try {
        const aiResp = await fetch(`${API_BASE_URL}/voice/describe-issue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aiPayload)
        });
        const contentType = aiResp.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const aiJson = await aiResp.json();
          if (aiResp.ok && aiJson.status === 'success' && aiJson.data) {
            aiResult = aiJson.data;
          }
        }
      } catch (err) {
        console.warn('AI issue description fallback:', err);
      }

      // Contextual fallback synthesis when backend AI is unreachable
      const smartFallback = synthesizeFallbackGrievance({
        notepadText: notepadText.trim(),
        videoTranscripts,
        mediaItems,
        locationDetails,
        reporterType: 'Individual Citizen',
        groupName: ''
      });

      const generatedTitle = aiResult?.title || smartFallback.title;
      const generatedDesc = aiResult?.description || smartFallback.description;
      const generatedCategory = aiResult?.category || smartFallback.category;
      const generatedSeverity = aiResult?.severity || smartFallback.severity;
      const generatedImpactCount = aiResult?.impactCount || smartFallback.impactCount;
      const generatedImpactDesc = aiResult?.impactDescription || smartFallback.impactDescription;

      const now = new Date();
      const formattedDateTime =
        now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ', ' +
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      // Convert mediaItems blob/file objects to persistent data URLs
      const persistentEvidence = [];
      for (const item of mediaItems) {
        if (item.file || item.blob) {
          try {
            const b64 = await new Promise((res) => {
              const reader = new FileReader();
              reader.onloadend = () => res(reader.result);
              reader.onerror = () => res(null);
              reader.readAsDataURL(item.file || item.blob);
            });
            if (b64) {
              persistentEvidence.push(b64);
              continue;
            }
          } catch (_) {}
        }
        persistentEvidence.push(item.url);
      }

      const finalHeroThumbnail =
        finalThumbnail ||
        persistentEvidence[0] ||
        (mediaItems[0]?.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80');

      const preparedData = {
        title: generatedTitle,
        description: generatedDesc,
        category: generatedCategory,
        severity: generatedSeverity,
        impactCount: generatedImpactCount,
        impactDescription: generatedImpactDesc,
        reporterType: 'Individual Citizen',
        groupName: '',
        safetyStatus: isFlagged ? 'FLAGGED_POLICY_VIOLATION' : 'SAFE',
        author: isAnonymous ? 'Verified Citizen (Anonymous)' : userName,
        authorId: isAnonymous ? 'cit-anonymous' : `cit-${userName.toLowerCase().replace(/\s+/g, '-')}`,
        address: locationDetails.formatted,
        villageCity: locationDetails.villageCity,
        subdistrict: locationDetails.subdistrict,
        district: locationDetails.district,
        state: locationDetails.state,
        pincode: locationDetails.pincode,
        latitude: coordinates?.lat || 23.3441,
        longitude: coordinates?.lng || 85.3096,
        thumbnail: finalHeroThumbnail,
        evidenceUrls: persistentEvidence,
        dateTime: formattedDateTime
      };

      setReviewData(preparedData);
      setReviewMediaIndex(0);
      setIsReviewPlaying(false);

      setTimeout(() => {
        setStep('review');
      }, 1500);
    } catch (err) {
      console.error('Desktop continue error:', err);
      const now = new Date();
      const smartFallback = synthesizeFallbackGrievance({
        notepadText: notepadText.trim(),
        videoTranscripts: [],
        mediaItems,
        locationDetails,
        reporterType: 'Individual Citizen',
        groupName: ''
      });
      const fallback = {
        title: smartFallback.title,
        description: smartFallback.description,
        category: smartFallback.category,
        severity: smartFallback.severity,
        impactCount: smartFallback.impactCount,
        impactDescription: smartFallback.impactDescription,
        reporterType: 'Individual Citizen',
        groupName: '',
        author: userName,
        authorId: `cit-${userName.toLowerCase().replace(/\s+/g, '-')}`,
        address: locationDetails.formatted,
        villageCity: locationDetails.villageCity,
        subdistrict: locationDetails.subdistrict,
        district: locationDetails.district,
        state: locationDetails.state,
        pincode: locationDetails.pincode,
        latitude: coordinates?.lat || 23.3441,
        longitude: coordinates?.lng || 85.3096,
        thumbnail: mediaItems[0]?.url || null,
        evidenceUrls: mediaItems.map((m) => m.url),
        dateTime: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setReviewData(fallback);
      setReviewMediaIndex(0);
      setIsReviewPlaying(false);
      setStep('review');
    }
  };

  // Submit Final Report from Review Card
  const handleSubmitFinalReport = async () => {
    if (!reviewData || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const resp = await fetch(`${API_BASE_URL}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      let createdProblem = null;
      if (resp.ok) {
        const json = await resp.json();
        createdProblem = json.data;
      } else {
        createdProblem = {
          id: `SETU-${Math.floor(1000 + Math.random() * 9000)}`,
          ...reviewData,
          status: 'SUBMITTED'
        };
      }

      // Save locally to setu_user_submissions
      try {
        const existing = JSON.parse(localStorage.getItem('setu_user_submissions') || '[]');
        const updated = [createdProblem, ...existing.filter((p) => p.id !== createdProblem.id)];
        localStorage.setItem('setu_user_submissions', JSON.stringify(updated));
      } catch (e) {}

      setSubmittedProblem(createdProblem);

      const hasViolation = isNsfwFlagged || reviewData?.safetyStatus === 'FLAGGED_POLICY_VIOLATION';
      if (!hasViolation && onReportSubmitted) {
        onReportSubmitted(createdProblem);
      }
      resetAndClose();

      // If content contained policy violation:
      // Allow user to submit, but after 10 seconds delete report from database,
      // prevent showing in My Submissions, and push a violation notification to the notification sidebar!
      if (hasViolation) {
        setTimeout(async () => {
          try {
            const targetId = createdProblem?.id;
            if (targetId) {
              await fetch(`${API_BASE_URL}/problems/${targetId}`, { method: 'DELETE' });
            }

            try {
              const cur = JSON.parse(localStorage.getItem('setu_user_submissions') || '[]');
              localStorage.setItem('setu_user_submissions', JSON.stringify(cur.filter((p) => p.id !== targetId)));
            } catch (e) {}

            const violationNotif = {
              id: 'notif-' + Date.now(),
              type: 'Policy Violation',
              isAlert: true,
              title: 'Grievance Report Removed',
              message: `Your report ${targetId || ''} has been deleted because attached media violated platform community guidelines (${nsfwReason || 'Inappropriate / NSFW content detected'}). It has not been forwarded to authorities and will not appear in your submissions.`,
              problemId: targetId,
              timestamp: 'Just now',
              isNew: true
            };

            const existing = JSON.parse(localStorage.getItem('setu_notifications') || '[]');
            existing.unshift(violationNotif);
            localStorage.setItem('setu_notifications', JSON.stringify(existing));

            // Notify open views in real time
            window.dispatchEvent(new CustomEvent('setu-new-notification', { detail: violationNotif }));
            window.dispatchEvent(new CustomEvent('setu-problem-deleted', { detail: { id: targetId } }));
          } catch (err) {
            console.warn('Policy violation post-processing error:', err);
          }
        }, 10000);
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      const fallback = {
        id: `SETU-${Math.floor(1000 + Math.random() * 9000)}`,
        ...reviewData,
        status: 'SUBMITTED'
      };
      try {
        const existing = JSON.parse(localStorage.getItem('setu_user_submissions') || '[]');
        const updated = [fallback, ...existing.filter((p) => p.id !== fallback.id)];
        localStorage.setItem('setu_user_submissions', JSON.stringify(updated));
      } catch (e) {}
      setSubmittedProblem(fallback);
      if (onReportSubmitted && !isNsfwFlagged) onReportSubmitted(fallback);
      resetAndClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    stopVoiceRecording();
    Object.values(videoRefs.current).forEach((v) => {
      if (v) {
        v.pause();
        v.muted = true;
      }
    });
    Object.values(reviewVideoRefs.current).forEach((v) => {
      if (v) {
        v.pause();
        v.muted = true;
      }
    });
    setStep('media');
    setMediaItems([]);
    setActiveMediaIndex(0);
    setReviewMediaIndex(0);
    setNotepadText('');
    setReviewData(null);
    setSubmittedProblem(null);
    onClose();
  };

  // Ensure microphone stream is unconditionally terminated if modal unmounts
  useEffect(() => {
    return () => {
      stopVoiceRecording();
    };
  }, [stopVoiceRecording]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 12px'
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <div
        className="apple-modal-content"
        style={{
          width: '100%',
          maxWidth: '820px',
          height: 'min(640px, calc(100dvh - 32px))',
          maxHeight: 'calc(100dvh - 32px)',
          minHeight: 0,
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* If processing, display Apple Intelligence glowing aura strictly inside this report card */}
        {step === 'processing' && <TaraAuraProcessingScreen inline={true} />}
        {/* ===================================================================== */}
        {/* STEP 1: MEDIA UPLOAD & PREVIEW */}
        {/* ===================================================================== */}
        {step === 'media' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            {/* Header */}
            <header
              style={{
                flexShrink: 0,
                padding: '16px 24px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#000000', letterSpacing: '-0.02em' }}>
                  Attach Evidence
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6e6e73', margin: '4px 0 0 0' }}>
                  Upload photos or videos of the issue before describing
                </p>
              </div>

              <button
                onClick={resetAndClose}
                className="apple-tap"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#f2f2f7',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <GoogleIcon name="close" size={20} color="#1c1c1e" />
              </button>
            </header>

            {/* Media Body */}
            <div style={{ flex: 1, minHeight: 0, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
              {mediaItems.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="apple-tap"
                  style={{
                    flex: 1,
                    minHeight: '280px',
                    borderRadius: '20px',
                    border: '2px dashed rgba(0, 0, 0, 0.15)',
                    backgroundColor: '#f9f9fb',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                    }}
                  >
                    <GoogleIcon name="cloud_upload" size={32} color="#0071e3" />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1c1c1e', margin: 0 }}>
                    Click to upload photos or videos
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#8e8e93', margin: 0 }}>
                    MP4, WebM, PNG, or JPG files
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                  {/* Large Active Preview with Non-Overlapping Video Audio */}
                  <div
                    style={{
                      flex: 1,
                      minHeight: '280px',
                      borderRadius: '20px',
                      backgroundColor: '#000000',
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {mediaItems[activeMediaIndex]?.type === 'video' ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[activeMediaIndex] = el;
                        }}
                        src={mediaItems[activeMediaIndex]?.url}
                        autoPlay
                        loop
                        playsInline
                        muted={false}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <img
                        src={mediaItems[activeMediaIndex]?.url}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    )}

                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(10px)',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#ffffff'
                      }}
                    >
                      {activeMediaIndex + 1} of {mediaItems.length}
                    </div>

                    <button
                      onClick={() => handleRemoveMedia(mediaItems[activeMediaIndex]?.id)}
                      className="apple-tap"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 59, 48, 0.8)',
                        border: 'none',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Remove"
                    >
                      <GoogleIcon name="delete" size={18} color="#ffffff" />
                    </button>
                  </div>

                  {/* Thumbnails Tray */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {mediaItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        onClick={() => setActiveMediaIndex(idx)}
                        className="apple-tap"
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          position: 'relative',
                          flexShrink: 0,
                          cursor: 'pointer',
                          border: idx === activeMediaIndex ? '2.5px solid #0071e3' : '1px solid rgba(0, 0, 0, 0.1)',
                          boxShadow: idx === activeMediaIndex ? '0 0 12px rgba(0, 113, 227, 0.4)' : 'none',
                          backgroundColor: '#000000'
                        }}
                      >
                        {item.type === 'video' ? (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827' }}>
                            <GoogleIcon name="play_arrow" size={24} color="#ffffff" />
                          </div>
                        ) : (
                          <img src={item.url} alt="clip" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                    ))}

                    <button
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="apple-tap"
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '14px',
                        border: '1.5px dashed rgba(0, 0, 0, 0.2)',
                        backgroundColor: '#f2f2f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                      title="Add more media"
                    >
                      <GoogleIcon name="add" size={28} color="#1c1c1e" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer
              style={{
                flexShrink: 0,
                padding: '14px 24px',
                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                backgroundColor: '#ffffff'
              }}
            >
              <button
                onClick={() => setStep('notepad')}
                className="apple-tap"
                style={{
                  height: '48px',
                  padding: '0 28px',
                  borderRadius: '9999px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
                }}
              >
                <span>Write Notes</span>
                <GoogleIcon name="arrow_forward" size={18} color="#ffffff" />
              </button>
            </footer>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 2: NOTEPAD CANVAS (EXACT EMPTY SCREEN WITH MIC & CONTINUE) */}
        {/* ===================================================================== */}
        {(step === 'notepad' || step === 'processing') && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, backgroundColor: '#ffffff' }}>
            {/* Minimal Header */}
            <header
              style={{
                flexShrink: 0,
                padding: '14px 24px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setStep('media')}
                  className="apple-tap"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#f2f2f7',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label="Back"
                >
                  <GoogleIcon name="arrow_back" size={20} color="#1c1c1e" />
                </button>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '800', margin: 0, color: '#000000' }}>
                  Grievance Notes
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={resetAndClose}
                  className="apple-tap"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#f2f2f7',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <GoogleIcon name="close" size={20} color="#1c1c1e" />
                </button>
              </div>
            </header>

            {/* Empty Notepad Writing Area */}
            <main style={{ flex: 1, minHeight: 0, padding: '20px 28px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <textarea
                autoFocus
                value={notepadText}
                onChange={(e) => setNotepadText(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    handleContinueFromNotepad();
                  }
                }}
                placeholder="Describe your grievance in detail here... or tap the Mic below to speak. (Press ⌘+Enter to continue)"
                style={{
                  flex: 1,
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '1.25rem',
                  lineHeight: 1.6,
                  color: '#1c1c1e',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-sans)',
                  boxSizing: 'border-box'
                }}
              />

              {isRecordingVoice && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 59, 48, 0.1)',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginTop: '8px'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626', animation: 'pulse 1s infinite' }} />
                  <span>Listening ({formatTimer(voiceSeconds)})... Tap mic again to stop</span>
                </div>
              )}
            </main>

            {/* Bottom Bar: ONLY 2 BUTTONS (MIC & CONTINUE) */}
            <footer
              style={{
                flexShrink: 0,
                padding: '14px 28px',
                borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}
            >
              {/* Mic Button */}
              <button
                type="button"
                onClick={handleToggleVoiceInNotepad}
                className="apple-tap"
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: isRecordingVoice ? '#ff3b30' : '#1c1c1e',
                  border: isRecordingVoice ? '3px solid #fca5a5' : 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: isRecordingVoice ? '0 0 20px rgba(255, 59, 48, 0.5)' : '0 4px 14px rgba(0, 0, 0, 0.12)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                aria-label={isRecordingVoice ? 'Stop Recording' : 'Speak'}
              >
                {isRecordingVoice ? (
                  <GoogleIcon name="stop" size={26} color="#ffffff" />
                ) : (
                  <GoogleIcon name="mic" size={26} color="#ffffff" />
                )}
              </button>

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinueFromNotepad}
                className="apple-tap"
                style={{
                  height: '54px',
                  padding: '0 32px',
                  borderRadius: '9999px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '700',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
                }}
              >
                <span>Continue</span>
                <GoogleIcon name="arrow_forward" size={20} color="#ffffff" />
              </button>
            </footer>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 3: REVIEW CARD BEFORE SUBMISSION */}
        {/* ===================================================================== */}
        {step === 'review' && reviewData && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, backgroundColor: '#ffffff' }}>
            {/* Header */}
            <header
              style={{
                flexShrink: 0,
                padding: '14px 24px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setStep('notepad')}
                  className="apple-tap"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#f2f2f7',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label="Back"
                >
                  <GoogleIcon name="arrow_back" size={20} color="#1c1c1e" />
                </button>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '800', margin: 0, color: '#000000', letterSpacing: '-0.02em' }}>
                  Review Grievance
                </h2>
              </div>

              <button
                onClick={resetAndClose}
                className="apple-tap"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#f2f2f7',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <GoogleIcon name="close" size={20} color="#1c1c1e" />
              </button>
            </header>

            {/* Body */}
            <div style={{ flex: 1, minHeight: 0, padding: '20px 28px 36px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* 1. Media Carousel on top of Card: 40% height, swappable like explore posts, paused by default */}
                {mediaItems.length > 0 && (
                  <ReviewMediaCarousel
                    mediaItems={mediaItems}
                    currentIndex={reviewMediaIndex}
                    onIndexChange={(idx) => {
                      setReviewMediaIndex(idx);
                      setIsReviewPlaying(false);
                    }}
                    isPlaying={isReviewPlaying}
                    setIsPlaying={setIsReviewPlaying}
                    videoRefs={reviewVideoRefs}
                  />
                )}

                {/* Card Details */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* 2. Heading (Title) */}
                  <h3
                    style={{
                      fontSize: '1.375rem',
                      fontWeight: '800',
                      color: '#000000',
                      margin: 0,
                      lineHeight: 1.3,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {reviewData.title}
                  </h3>

                  {/* 3. Category */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '0.8125rem',
                        fontWeight: '700'
                      }}
                    >
                      <GoogleIcon name="category" size={16} color="#1d4ed8" />
                      <span>{reviewData.category}</span>
                    </span>
                  </div>

                  {/* Location & Date/Time Strip */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#1c1c1e' }}>
                      <GoogleIcon name="location_on" size={18} color="#71717a" />
                      <span style={{ fontWeight: '600' }}>
                        {reviewData.address || reviewData.villageCity || 'Delhi, Outer North Delhi, PIN: 131028'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#6e6e73' }}>
                      <GoogleIcon name="schedule" size={18} color="#8e8e93" />
                      <span>{reviewData.dateTime}</span>
                    </div>
                  </div>

                  {/* 4. Impact Summary */}
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid rgba(22, 163, 74, 0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <GoogleIcon name="groups" size={18} color="#16a34a" />
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d', textTransform: 'uppercase' }}>
                        Impact Summary
                      </span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#14532d', marginTop: '2px' }}>
                      {reviewData.impactCount}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#166534', lineHeight: 1.45 }}>
                      {reviewData.impactDescription}
                    </div>
                  </div>

                  {/* 5. Severity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        backgroundColor:
                          reviewData.severity === 'CRITICAL' || reviewData.severity === 'HIGH'
                            ? '#fee2e2'
                            : reviewData.severity === 'LOW'
                            ? '#dcfce7'
                            : '#fef3c7',
                        color:
                          reviewData.severity === 'CRITICAL' || reviewData.severity === 'HIGH'
                            ? '#b91c1c'
                            : reviewData.severity === 'LOW'
                            ? '#15803d'
                            : '#b45309',
                        fontSize: '0.8125rem',
                        fontWeight: '700'
                      }}
                    >
                      <GoogleIcon
                        name="priority_high"
                        size={15}
                        color={
                          reviewData.severity === 'CRITICAL' || reviewData.severity === 'HIGH'
                            ? '#b91c1c'
                            : reviewData.severity === 'LOW'
                            ? '#15803d'
                            : '#b45309'
                        }
                      />
                      <span>{reviewData.severity} Severity</span>
                    </span>
                  </div>

                  {/* 6. Description (4 lines clamp with ...more toggle) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: '#8e8e93',
                        marginBottom: '4px'
                      }}
                    >
                      Description
                    </div>
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        lineHeight: 1.6,
                        color: '#3a3a3c',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        display: isDescExpanded ? 'block' : '-webkit-box',
                        WebkitLineClamp: isDescExpanded ? 'unset' : 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: isDescExpanded ? 'visible' : 'hidden'
                      }}
                    >
                      {reviewData.description}
                    </p>
                    {reviewData.description && reviewData.description.length > 150 && (
                      <button
                        type="button"
                        onClick={() => setIsDescExpanded((prev) => !prev)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#000000',
                          fontSize: '0.875rem',
                          fontWeight: '700',
                          padding: '4px 0',
                          cursor: 'pointer',
                          alignSelf: 'flex-start',
                          fontFamily: 'inherit'
                        }}
                      >
                        {isDescExpanded ? 'Show less' : '...more'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Submit button with no arrow */}
            <footer
              style={{
                padding: '16px 32px',
                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}
            >
              <button
                type="button"
                onClick={() => setStep('notepad')}
                className="apple-tap"
                style={{
                  height: '48px',
                  padding: '0 20px',
                  borderRadius: '9999px',
                  backgroundColor: '#f2f2f7',
                  color: '#1c1c1e',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Back to Notes
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitFinalReport}
                className="apple-tap"
                style={{
                  height: '48px',
                  padding: '0 36px',
                  borderRadius: '9999px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
              </button>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};

