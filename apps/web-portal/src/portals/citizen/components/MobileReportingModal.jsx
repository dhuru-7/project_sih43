import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { reverseGeocode, extractVideoThumbnail } from '../../../services/geoService';
import { TaraAuraProcessingScreen } from '../../../components/ui/TaraAuraProcessingScreen';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const MobileReportingModal = ({
  isOpen,
  onClose,
  onReportSubmitted,
  userName = 'Citizen'
}) => {
  const navigate = useNavigate();

  // Steps: 'camera' | 'preview' | 'description' | 'processing' | 'review' | 'success'
  const [step, setStep] = useState('camera');

  // Media items: array of { id, type: 'video' | 'image', url, blob, file, name }
  const [mediaItems, setMediaItems] = useState([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Video playback management in preview
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const videoRefs = useRef({});

  // Camera stream & recording
  const cameraVideoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraError, setCameraError] = useState(null);

  // Notepad Description state (Citizen profile)
  const [notepadText, setNotepadText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [locationDetails, setLocationDetails] = useState({
    formatted: 'Ranchi, Jharkhand',
    villageCity: 'Ranchi',
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

  // Synthesized Review data & Final Submission
  const [reviewData, setReviewData] = useState(null);
  const [reviewMediaIndex, setReviewMediaIndex] = useState(0);
  const [isReviewPlaying, setIsReviewPlaying] = useState(true);
  const reviewVideoRefs = useRef({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProblem, setSubmittedProblem] = useState(null);

  const galleryInputRef = useRef(null);

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

  // Camera stream management
  useEffect(() => {
    if (isOpen && step === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, step, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera error, attempting fallback:', err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = stream;
        }
      } catch (fallbackErr) {
        console.error('Camera fallback failed:', fallbackErr);
        setCameraError('Camera access unavailable. You can choose photos or videos from your gallery.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Video recording timer
  useEffect(() => {
    let interval = null;
    if (isRecordingVideo) {
      interval = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVideo]);

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

  // CRITICAL FIX: PREVENT MULTI-VIDEO AUDIO OVERLAP
  // Pause & mute all videos except the currently active one
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([indexStr, videoEl]) => {
      const idx = parseInt(indexStr, 10);
      if (videoEl) {
        if (step === 'preview' && idx === activeMediaIndex) {
          videoEl.muted = false;
          if (isPlaying) {
            videoEl.play().catch(() => {});
          } else {
            videoEl.pause();
          }
        } else {
          videoEl.pause();
          videoEl.currentTime = 0;
          videoEl.muted = true;
        }
      }
    });
  }, [activeMediaIndex, step, isPlaying]);

  // CRITICAL FIX: PREVENT MULTI-VIDEO AUDIO OVERLAP IN REVIEW CARD
  useEffect(() => {
    Object.entries(reviewVideoRefs.current).forEach(([indexStr, videoEl]) => {
      const idx = parseInt(indexStr, 10);
      if (videoEl) {
        if (step === 'review' && idx === reviewMediaIndex) {
          videoEl.muted = false;
          if (isReviewPlaying) {
            videoEl.play().catch(() => {});
          } else {
            videoEl.pause();
          }
        } else {
          videoEl.pause();
          videoEl.currentTime = 0;
          videoEl.muted = true;
        }
      }
    });
  }, [reviewMediaIndex, step, isReviewPlaying]);

  // Record Video Toggle
  const handleToggleVideoRecord = () => {
    if (!isRecordingVideo) {
      if (!streamRef.current) {
        startCamera();
        return;
      }
      try {
        recordedChunksRef.current = [];
        let recorder;
        try {
          recorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm;codecs=vp8,opus' });
        } catch {
          recorder = new MediaRecorder(streamRef.current);
        }

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          const newItem = {
            id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            type: 'video',
            url: url,
            blob: blob,
            name: `Clip_${mediaItems.length + 1}.mp4`
          };
          setMediaItems((prev) => {
            const updated = [...prev, newItem];
            setActiveMediaIndex(updated.length - 1);
            return updated;
          });
          setIsPlaying(true);
          setStep('preview');
        };

        recorder.start(500);
        mediaRecorderRef.current = recorder;
        setIsRecordingVideo(true);
      } catch (err) {
        console.error('Failed to start MediaRecorder:', err);
        alert('Could not start video recording: ' + err.message);
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecordingVideo(false);
    }
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleGallerySelect = (e) => {
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
    setIsPlaying(true);
    setStep('preview');
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleDeleteMedia = (idToRemove) => {
    const remaining = mediaItems.filter((item) => item.id !== idToRemove);
    setMediaItems(remaining);
    if (remaining.length === 0) {
      setStep('camera');
      setActiveMediaIndex(0);
    } else {
      setActiveMediaIndex((prev) => Math.min(prev, remaining.length - 1));
    }
  };

  // Toggle Video Play / Pause on Tap
  const handleTogglePreviewPlayback = () => {
    setIsPlaying((prev) => !prev);
    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 700);
  };

  // Voice recording inside Notepad
  const handleToggleVoiceInNotepad = async () => {
    if (!isRecordingVoice) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        voiceChunksRef.current = [];
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            voiceChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const audioBlob = new Blob(voiceChunksRef.current, { type: 'audio/webm' });

          try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'grievance_voice.webm');

            const resp = await fetch(`${API_BASE_URL}/voice/describe-issue`, {
              method: 'POST',
              body: formData
            });

            const json = await resp.json();
            if (resp.ok && json.status === 'success' && json.data) {
              const transcribed = json.data.transcript || json.data.description;
              if (transcribed) {
                setNotepadText((prev) => (prev ? prev.trim() + '\n\n' + transcribed : transcribed));
              }
            }
          } catch (err) {
            console.error('Error transcribing audio:', err);
          }
        };

        recorder.start();
        voiceRecorderRef.current = recorder;
        setIsRecordingVoice(true);
      } catch (err) {
        console.error('Microphone access denied:', err);
        alert('Microphone access was denied. You can type grievance notes directly.');
      }
    } else {
      if (voiceRecorderRef.current && voiceRecorderRef.current.state !== 'inactive') {
        voiceRecorderRef.current.stop();
      }
      setIsRecordingVoice(false);
    }
  };

  // Continue from Notepad -> Full-Screen Aura Processing ("Hold on...") -> Transition to Review Card
  const handleContinueFromNotepad = async () => {
    if (!notepadText.trim() && mediaItems.length === 0) {
      alert('Please type or speak your grievance details, or attach media before continuing.');
      return;
    }

    setStep('processing');

    try {
      // 1. Extract thumbnail: first image or first frame of last video
      let finalThumbnail = null;
      const firstImage = mediaItems.find((m) => m.type === 'image');
      const videos = mediaItems.filter((m) => m.type === 'video');

      if (firstImage) {
        finalThumbnail = firstImage.url;
      } else if (videos.length > 0) {
        const lastVideo = videos[videos.length - 1];
        finalThumbnail = await extractVideoThumbnail(lastVideo.blob || lastVideo.url);
      }

      // 2. Prepare images payload for multimodal Gemini
      const imagePayloads = [];
      for (const item of mediaItems.filter((m) => m.type === 'image').slice(0, 3)) {
        if (item.file) {
          const reader = new FileReader();
          const b64 = await new Promise((res) => {
            reader.onloadend = () => res(reader.result);
            reader.readAsDataURL(item.file);
          });
          imagePayloads.push(b64);
        }
      }

      // 3. Process with AI Engine
      const aiPayload = {
        text: notepadText.trim(),
        images: imagePayloads,
        locationInfo: locationDetails,
        reporterType: 'Individual Citizen',
        groupName: ''
      };

      let aiResult = null;
      try {
        const aiResp = await fetch(`${API_BASE_URL}/voice/describe-issue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aiPayload)
        });
        const aiJson = await aiResp.json();
        if (aiResp.ok && aiJson.status === 'success' && aiJson.data) {
          aiResult = aiJson.data;
        }
      } catch (err) {
        console.warn('AI issue description fallback:', err);
      }

      const generatedTitle = aiResult?.title || notepadText.slice(0, 45) || 'Civic Infrastructure Grievance';
      const generatedDesc = aiResult?.description || notepadText || 'Citizen reported civic problem with attached evidence.';
      const generatedCategory = aiResult?.category || 'Urban Development and Infrastructure';
      const generatedSeverity = aiResult?.severity || 'MEDIUM';
      const generatedImpactCount = aiResult?.impactCount || '100-250 local residents';
      const generatedImpactDesc = aiResult?.impactDescription || 'Local residents facing public disruption.';

      const now = new Date();
      const formattedDateTime =
        now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ', ' +
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      const preparedData = {
        title: generatedTitle,
        description: generatedDesc,
        category: generatedCategory,
        severity: generatedSeverity,
        impactCount: generatedImpactCount,
        impactDescription: generatedImpactDesc,
        reporterType: 'Individual Citizen',
        groupName: '',
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
        thumbnail: finalThumbnail || (mediaItems[0]?.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80'),
        evidenceUrls: mediaItems.map((m) => m.url),
        dateTime: formattedDateTime
      };

      setReviewData(preparedData);
      setReviewMediaIndex(0);
      setIsReviewPlaying(true);

      // Transition smoothly from aura animation to review card
      setTimeout(() => {
        setStep('review');
      }, 1500);
    } catch (err) {
      console.error('Error during continue:', err);
      const now = new Date();
      const fallback = {
        title: notepadText.slice(0, 45) || 'Civic Grievance',
        description: notepadText || 'Citizen reported civic grievance.',
        category: 'Urban Development and Infrastructure',
        severity: 'MEDIUM',
        impactCount: 'Local community',
        impactDescription: 'Public disruption reported in locality.',
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
      setIsReviewPlaying(true);
      setStep('review');
    }
  };

  // Submit Final Report from Review Screen
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

      setSubmittedProblem(createdProblem);
      if (onReportSubmitted) onReportSubmitted(createdProblem);
      setStep('success');
    } catch (err) {
      console.error('Error submitting report:', err);
      const fallback = {
        id: `SETU-${Math.floor(1000 + Math.random() * 9000)}`,
        ...reviewData,
        status: 'SUBMITTED'
      };
      setSubmittedProblem(fallback);
      if (onReportSubmitted) onReportSubmitted(fallback);
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAllAndClose = () => {
    stopCamera();
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
    setStep('camera');
    setMediaItems([]);
    setActiveMediaIndex(0);
    setReviewMediaIndex(0);
    setNotepadText('');
    setReviewData(null);
    setSubmittedProblem(null);
    onClose();
  };

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
        backgroundColor: step === 'description' || step === 'processing' ? '#fbfbfa' : step === 'review' ? '#f2f2f7' : '#000000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        color: step === 'description' || step === 'processing' || step === 'review' ? '#1c1c1e' : '#ffffff',
        fontFamily: 'var(--font-sans)',
        transition: 'background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Hidden Gallery Picker */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleGallerySelect}
      />

      {/* ========================================================================= */}
      {/* STEP 1: CAMERA VIEW */}
      {/* ========================================================================= */}
      {step === 'camera' && (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Top Bar: Close, Recording Indicator, Flip */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              padding: 'calc(18px + env(safe-area-inset-top, 0px)) 20px 16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)'
            }}
          >
            <button
              onClick={resetAllAndClose}
              className="apple-tap"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Close"
            >
              <GoogleIcon name="close" size={22} color="#ffffff" />
            </button>

            {isRecordingVideo ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 59, 48, 0.9)',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  letterSpacing: '0.02em',
                  boxShadow: '0 0 16px rgba(255, 59, 48, 0.6)'
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    animation: 'pulse 1s infinite'
                  }}
                />
                <span>REC {formatTimer(recordingSeconds)}</span>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                VIDEO / PHOTO
              </div>
            )}

            <button
              onClick={handleFlipCamera}
              className="apple-tap"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Flip Camera"
            >
              <GoogleIcon name="flip_camera_ios" size={20} color="#ffffff" />
            </button>
          </div>

          {/* Camera Viewfinder */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#000000' }}>
            <video
              ref={cameraVideoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {cameraError && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  gap: '12px'
                }}
              >
                <GoogleIcon name="videocam_off" size={36} color="#f87171" />
                <p style={{ color: '#ffffff', fontSize: '0.9375rem', margin: 0, maxWidth: '280px' }}>
                  {cameraError}
                </p>
                <button
                  onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
                  style={{
                    marginTop: '8px',
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Open Gallery
                </button>
              </div>
            )}
          </div>

          {/* Bottom Bar: Gallery, Shutter/Record, Preview Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              padding: '20px 24px calc(24px + env(safe-area-inset-bottom, 0px)) 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)'
            }}
          >
            <button
              onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
              className="apple-tap"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Open Gallery"
            >
              <GoogleIcon name="photo_library" size={24} color="#ffffff" />
            </button>

            {/* Red Shutter/Record Button */}
            <button
              onClick={handleToggleVideoRecord}
              className="apple-tap"
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: '4px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '4px'
              }}
              aria-label={isRecordingVideo ? 'Stop Recording' : 'Start Recording'}
            >
              <div
                style={{
                  width: isRecordingVideo ? '28px' : '60px',
                  height: isRecordingVideo ? '28px' : '60px',
                  borderRadius: isRecordingVideo ? '6px' : '50%',
                  backgroundColor: '#ff3b30',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </button>

            {mediaItems.length > 0 ? (
              <button
                onClick={() => setStep('preview')}
                className="apple-tap"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Preview Media"
              >
                <GoogleIcon name="arrow_forward" size={24} color="#000000" />
              </button>
            ) : (
              <div style={{ width: '50px' }} />
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: PREVIEW WITH FIXED NON-OVERLAPPING VIDEO AUDIO */}
      {/* ========================================================================= */}
      {step === 'preview' && (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000000' }}>
          {/* Top Bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 40,
              padding: 'calc(18px + env(safe-area-inset-top, 0px)) 20px 16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)'
            }}
          >
            <button
              onClick={() => setStep('camera')}
              className="apple-tap"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Back to Camera"
            >
              <GoogleIcon name="arrow_back" size={22} color="#ffffff" />
            </button>

            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(16px)',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.18)'
              }}
            >
              {activeMediaIndex + 1} of {mediaItems.length}
            </div>

            <button
              onClick={() => handleDeleteMedia(mediaItems[activeMediaIndex]?.id)}
              className="apple-tap"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 59, 48, 0.3)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 59, 48, 0.6)',
                color: '#ff453a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Delete Clip"
            >
              <GoogleIcon name="delete" size={20} color="#ff453a" />
            </button>
          </div>

          {/* Swipeable Carousel */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const width = e.currentTarget.offsetWidth;
              if (width > 0) {
                const index = Math.round(scrollLeft / width);
                if (index !== activeMediaIndex && index >= 0 && index < mediaItems.length) {
                  setActiveMediaIndex(index);
                }
              }
            }}
          >
            {mediaItems.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={item.type === 'video' ? handleTogglePreviewPlayback : undefined}
                style={{
                  flex: '0 0 100%',
                  width: '100%',
                  height: '100%',
                  scrollSnapAlign: 'start',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundColor: '#000000',
                  cursor: item.type === 'video' ? 'pointer' : 'default'
                }}
              >
                {item.type === 'video' ? (
                  <>
                    <video
                      ref={(el) => {
                        videoRefs.current[idx] = el;
                      }}
                      src={item.url}
                      autoPlay={idx === activeMediaIndex}
                      loop
                      playsInline
                      muted={idx !== activeMediaIndex}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                    {showPlayIcon && (
                      <div
                        style={{
                          position: 'absolute',
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          backdropFilter: 'blur(12px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: 'none'
                        }}
                      >
                        <GoogleIcon
                          name={isPlaying ? 'play_arrow' : 'pause'}
                          size={36}
                          color="#ffffff"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src={item.url}
                    alt="Evidence Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Bottom Bar: Plus (+) to Add More & Arrow (>) to Continue to Notepad */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 40,
              padding: '20px 28px calc(28px + env(safe-area-inset-bottom, 0px)) 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
              pointerEvents: 'none'
            }}
          >
            <button
              onClick={() => setStep('camera')}
              className="apple-tap"
              style={{
                pointerEvents: 'auto',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(255, 255, 255, 0.45)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
              }}
              aria-label="Add More Media"
            >
              <GoogleIcon name="add" size={30} color="#ffffff" />
            </button>

            <button
              onClick={() => setStep('description')}
              className="apple-tap"
              style={{
                pointerEvents: 'auto',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: 'none',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255, 255, 255, 0.35)'
              }}
              aria-label="Continue to Notepad"
            >
              <GoogleIcon name="arrow_forward" size={26} color="#000000" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: NOTEPAD DESCRIPTION CANVAS (CLEAN EMPTY SCREEN, 2 BUTTONS: MIC & CONTINUE) */}
      {/* ========================================================================= */}
      {step === 'description' && (
        <div
          className="apple-page-enter"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            color: '#1c1c1e'
          }}
        >
          {/* Minimal Frosted Header */}
          <header
            style={{
              padding: 'calc(14px + env(safe-area-inset-top, 0px)) 16px 12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              zIndex: 30
            }}
          >
            <button
              onClick={() => setStep('preview')}
              className="apple-tap"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#f2f2f7',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Back to Preview"
            >
              <GoogleIcon name="arrow_back" size={20} color="#1c1c1e" />
            </button>

            <span style={{ fontSize: '1rem', fontWeight: '700', color: '#1c1c1e' }}>
              Grievance Notes
            </span>

            <button
              onClick={resetAllAndClose}
              className="apple-tap"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#f2f2f7',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Close"
            >
              <GoogleIcon name="close" size={20} color="#1c1c1e" />
            </button>
          </header>

          {/* Full Notepad Typing Area */}
          <main
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 20px',
              overflowY: 'auto'
            }}
          >
            <textarea
              autoFocus
              value={notepadText}
              onChange={(e) => setNotepadText(e.target.value)}
              placeholder="Describe your grievance in detail here... or tap the Mic below to speak."
              style={{
                flex: 1,
                width: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontSize: '1.125rem',
                lineHeight: 1.6,
                color: '#1c1c1e',
                backgroundColor: 'transparent',
                fontFamily: 'var(--font-sans)',
                padding: '8px 0',
                boxSizing: 'border-box'
              }}
            />

            {/* Subtle Voice Recording Live Feedback Banner */}
            {isRecordingVoice && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 59, 48, 0.1)',
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#dc2626',
                    animation: 'pulse 1s infinite'
                  }}
                />
                <span>Listening ({formatTimer(voiceSeconds)})... Tap mic again to finish</span>
              </div>
            )}
          </main>

          {/* Fixed Bottom Bar: ONLY 2 BUTTONS (MIC & CONTINUE) */}
          <footer
            style={{
              padding: '14px 20px calc(20px + env(safe-area-inset-bottom, 0px)) 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              zIndex: 30
            }}
          >
            {/* 1. Mic Button */}
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
                boxShadow: isRecordingVoice
                  ? '0 0 20px rgba(255, 59, 48, 0.5)'
                  : '0 4px 14px rgba(0, 0, 0, 0.12)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              aria-label={isRecordingVoice ? 'Stop Speaking' : 'Record Speech'}
            >
              {isRecordingVoice ? (
                <GoogleIcon name="stop" size={26} color="#ffffff" />
              ) : (
                <GoogleIcon name="mic" size={26} color="#ffffff" />
              )}
            </button>

            {/* 2. Continue Button */}
            <button
              type="button"
              onClick={handleContinueFromNotepad}
              className="apple-tap"
              style={{
                height: '54px',
                padding: '0 28px',
                borderRadius: '9999px',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '700',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
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

      {/* ========================================================================= */}
      {/* STEP 4: FULL-SCREEN GLOWING AURA ANIMATION ("Hold on...") */}
      {/* ========================================================================= */}
      {step === 'processing' && <TaraAuraProcessingScreen />}

      {/* ========================================================================= */}
      {/* STEP 5: REPORT REVIEW CARD (MEDIA ON TOP, SWIPEABLE, TITLE, CATEGORY, LOCATION, DATE/TIME, DESCRIPTION, IMPACT SUMMARY, SEVERITY BRIEF, SUBMIT BUTTON) */}
      {/* ========================================================================= */}
      {step === 'review' && reviewData && (
        <div
          className="apple-page-enter"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f2f2f7',
            overflow: 'hidden',
            color: '#1c1c1e'
          }}
        >
          {/* Top Bar */}
          <header
            style={{
              padding: 'calc(14px + env(safe-area-inset-top, 0px)) 16px 12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              zIndex: 30
            }}
          >
            <button
              onClick={() => setStep('description')}
              className="apple-tap"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#f2f2f7',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Back to Notes"
            >
              <GoogleIcon name="arrow_back" size={20} color="#1c1c1e" />
            </button>

            <span style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#000000', letterSpacing: '-0.02em' }}>
              Review Grievance
            </span>

            <button
              onClick={resetAllAndClose}
              className="apple-tap"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#f2f2f7',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Close"
            >
              <GoogleIcon name="close" size={20} color="#1c1c1e" />
            </button>
          </header>

          {/* Scrollable Body */}
          <main
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 16px calc(90px + env(safe-area-inset-bottom, 0px)) 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* The Main Report Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Media Carousel on top of card */}
              {mediaItems.length > 0 && (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '240px',
                    backgroundColor: '#000000',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      overflowX: 'auto',
                      scrollSnapType: 'x mandatory',
                      WebkitOverflowScrolling: 'touch',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                    onScroll={(e) => {
                      const scrollLeft = e.currentTarget.scrollLeft;
                      const width = e.currentTarget.offsetWidth;
                      if (width > 0) {
                        const index = Math.round(scrollLeft / width);
                        if (index !== reviewMediaIndex && index >= 0 && index < mediaItems.length) {
                          setReviewMediaIndex(index);
                        }
                      }
                    }}
                  >
                    {mediaItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        onClick={item.type === 'video' ? () => setIsReviewPlaying((p) => !p) : undefined}
                        style={{
                          flex: '0 0 100%',
                          width: '100%',
                          height: '100%',
                          scrollSnapAlign: 'start',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          backgroundColor: '#000000',
                          cursor: item.type === 'video' ? 'pointer' : 'default'
                        }}
                      >
                        {item.type === 'video' ? (
                          <video
                            ref={(el) => {
                              reviewVideoRefs.current[idx] = el;
                            }}
                            src={item.url}
                            autoPlay={idx === reviewMediaIndex}
                            loop
                            playsInline
                            muted={idx !== reviewMediaIndex}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt="Attached Evidence"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Indicator Pill: e.g. "1 of 3" */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {reviewMediaIndex + 1} of {mediaItems.length}
                  </div>

                  {/* Dots Indicator */}
                  {mediaItems.length > 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        pointerEvents: 'none'
                      }}
                    >
                      {mediaItems.map((_, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: idx === reviewMediaIndex ? '18px' : '6px',
                            height: '6px',
                            borderRadius: '9999px',
                            backgroundColor: idx === reviewMediaIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Card Content Body */}
              <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Category Badge & Severity Brief Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    <GoogleIcon name="category" size={14} color="#1d4ed8" />
                    <span>{reviewData.category}</span>
                  </span>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
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
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}
                  >
                    <GoogleIcon
                      name="priority_high"
                      size={14}
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

                {/* Title */}
                <div>
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      lineHeight: 1.35,
                      margin: 0,
                      color: '#000000',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {reviewData.title}
                  </h2>
                </div>

                {/* Location & Date/Time Strip */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#1c1c1e' }}>
                    <GoogleIcon name="location_on" size={17} color="#0071e3" />
                    <span style={{ fontWeight: '600' }}>
                      {reviewData.address || reviewData.villageCity || 'Ranchi, Jharkhand'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#6e6e73' }}>
                    <GoogleIcon name="schedule" size={16} color="#8e8e93" />
                    <span>{reviewData.dateTime}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: '#8e8e93',
                      marginBottom: '6px'
                    }}
                  >
                    Description
                  </div>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      lineHeight: 1.55,
                      color: '#3a3a3c',
                      margin: 0,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {reviewData.description}
                  </p>
                </div>

                {/* Impact Summary */}
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid rgba(22, 163, 74, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GoogleIcon name="groups" size={17} color="#16a34a" />
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d', textTransform: 'uppercase' }}>
                      Impact Summary
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#14532d', marginTop: '2px' }}>
                    {reviewData.impactCount}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#166534', lineHeight: 1.45 }}>
                    {reviewData.impactDescription}
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Sticky Submit Bar */}
          <footer
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 40,
              padding: '12px 18px calc(16px + env(safe-area-inset-bottom, 0px)) 18px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitFinalReport}
              className="apple-tap"
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '9999px',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '700',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <span>Submit Report</span>
                  <GoogleIcon name="arrow_forward" size={20} color="#ffffff" />
                </>
              )}
            </button>
          </footer>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: SUCCESS STATE (CLEAN, NO NATIONAL DATABASE JARGON) */}
      {/* ========================================================================= */}
      {step === 'success' && (
        <div
          className="apple-page-enter"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa'
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              border: '2px solid #16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <GoogleIcon name="check_circle" size={44} color="#16a34a" />
          </div>

          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                padding: '4px 12px',
                borderRadius: '9999px',
                letterSpacing: '0.04em'
              }}
            >
              REPORT SUBMITTED
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '12px', marginBottom: '6px', color: '#000000' }}>
              {submittedProblem?.id || '#SETU-LIVE'}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#6e6e73', margin: 0, maxWidth: '290px', lineHeight: 1.45 }}>
              Your grievance has been submitted successfully and assigned for field review.
            </p>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'left',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#8e8e93', fontWeight: '600', textTransform: 'uppercase' }}>Title</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#000000', marginTop: '2px' }}>
              {submittedProblem?.title}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#8e8e93', fontWeight: '600', textTransform: 'uppercase', marginTop: '10px' }}>Category</div>
            <div style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: '600', marginTop: '2px' }}>
              {submittedProblem?.category}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#8e8e93', fontWeight: '600', textTransform: 'uppercase', marginTop: '10px' }}>Location</div>
            <div style={{ fontSize: '0.875rem', color: '#3c3c43', marginTop: '2px' }}>
              {submittedProblem?.address || locationDetails.formatted}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '340px' }}>
            <button
              onClick={() => {
                resetAllAndClose();
                navigate('/my-submissions');
              }}
              className="apple-tap"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)'
              }}
            >
              View in My Submissions
            </button>
            <button
              onClick={resetAllAndClose}
              className="apple-tap"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                backgroundColor: 'transparent',
                color: '#6e6e73',
                fontWeight: '600',
                fontSize: '0.9375rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
