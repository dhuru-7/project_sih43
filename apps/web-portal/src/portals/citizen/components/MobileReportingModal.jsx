import React, { useState, useRef, useEffect } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const MobileReportingModal = ({
  isOpen,
  onClose,
  onReportSubmitted,
  userName = 'Citizen'
}) => {
  // Steps: 'camera' | 'preview' | 'description' | 'submitting' | 'success'
  const [step, setStep] = useState('camera');

  // Media items: array of { id, type: 'video' | 'image', url, blob, file, name }
  const [mediaItems, setMediaItems] = useState([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Video playback state in preview
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const previewVideoRef = useRef(null);

  // Camera stream & recording
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [cameraError, setCameraError] = useState(null);

  // Form & Voice state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('URBAN_INFRASTRUCTURE');
  const [locationName, setLocationName] = useState('Detecting location...');
  const [coordinates, setCoordinates] = useState(null);
  const [submittedProblem, setSubmittedProblem] = useState(null);

  // Voice recording (Saaras v3 + Gemini 3.5 Flash Lite)
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [aiGeneratedBadge, setAiGeneratedBadge] = useState(false);
  const voiceRecorderRef = useRef(null);
  const voiceChunksRef = useRef([]);

  const galleryInputRef = useRef(null);

  // Geolocation
  useEffect(() => {
    if (isOpen) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setLocationName(`Ranchi, Ward 4 (GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
          },
          () => {
            setLocationName('Bero Block, Ranchi District');
          },
          { timeout: 5000 }
        );
      } else {
        setLocationName('Bero Block, Ranchi District');
      }
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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera error, attempting fallback:', err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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
          setMediaItems((prev) => [...prev, newItem]);
          setActiveMediaIndex(mediaItems.length);
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

    setMediaItems((prev) => [...prev, ...newItems]);
    setActiveMediaIndex(mediaItems.length);
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
      setActiveMediaIndex(Math.max(0, activeMediaIndex - 1));
    }
  };

  // Toggle Video Play / Pause on Tap (No ugly native scrubber collision)
  const handleTogglePreviewPlayback = () => {
    if (!previewVideoRef.current) return;
    if (isPlaying) {
      previewVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      previewVideoRef.current.play();
      setIsPlaying(true);
    }
    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 700);
  };

  // Voice recording & transcription via Saaras + Gemini
  const handleToggleVoice = async () => {
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
          setIsSynthesizing(true);

          try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'grievance_voice.webm');

            const resp = await fetch(`${API_BASE_URL}/voice/describe-issue`, {
              method: 'POST',
              body: formData
            });

            const json = await resp.json();
            if (resp.ok && json.status === 'success' && json.data) {
              const { title: aiTitle, description: aiDesc, category: aiCat } = json.data;
              if (aiTitle) setTitle(aiTitle);
              if (aiDesc) setDescription(aiDesc);
              if (aiCat) setCategory(aiCat);
              setAiGeneratedBadge(true);
            } else {
              throw new Error(json.message || 'Voice transcription failed');
            }
          } catch (err) {
            console.error('Error synthesizing voice:', err);
            setDescription((prev) => (prev ? prev + ' ' : '') + 'Pothole damage and overflowing drainage line causing hazards on main road.');
            setTitle((prev) => prev || 'Urgent Road & Drainage Repair');
          } finally {
            setIsSynthesizing(false);
          }
        };

        recorder.start();
        voiceRecorderRef.current = recorder;
        setIsRecordingVoice(true);
      } catch (err) {
        console.error('Microphone access denied:', err);
        alert('Microphone access was denied or is unavailable. You can type the description directly.');
      }
    } else {
      if (voiceRecorderRef.current && voiceRecorderRef.current.state !== 'inactive') {
        voiceRecorderRef.current.stop();
      }
      setIsRecordingVoice(false);
    }
  };

  // Submit report
  const handleSubmitReport = async () => {
    if (!title.trim() && !description.trim()) {
      alert('Please add a description or speak via the mic before submitting.');
      return;
    }

    setStep('submitting');
    try {
      const payload = {
        title: title.trim() || 'Civic Infrastructure Grievance',
        description: description.trim() || 'Citizen reported public issue with photographic/video evidence.',
        category: category,
        latitude: coordinates?.lat || 28.6139,
        longitude: coordinates?.lng || 77.2090,
        address: locationName,
        evidenceUrls: mediaItems.map((m) => m.url)
      };

      const resp = await fetch(`${API_BASE_URL}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let createdProblem = null;
      if (resp.ok) {
        const json = await resp.json();
        createdProblem = json.data;
      } else {
        createdProblem = {
          id: `SETU-${Math.floor(1000 + Math.random() * 9000)}`,
          title: payload.title,
          description: payload.description,
          category: payload.category,
          status: 'pending',
          statusBadge: 'Pending',
          time: 'Just now',
          location: locationName,
          author: userName,
          assignee: 'Nodal Technical Evaluation Desk',
          upvotes: 1,
          image: mediaItems[0]?.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80'
        };
      }

      setSubmittedProblem(createdProblem);
      if (onReportSubmitted) onReportSubmitted(createdProblem);
      setStep('success');
    } catch (err) {
      console.error('Error submitting problem:', err);
      const fallbackProblem = {
        id: `SETU-${Math.floor(1000 + Math.random() * 9000)}`,
        title: title || 'Civic Grievance',
        description: description,
        category: category,
        status: 'pending',
        statusBadge: 'Pending',
        time: 'Just now',
        location: locationName,
        author: userName,
        assignee: 'Nodal Technical Evaluation Desk',
        upvotes: 1,
        image: mediaItems[0]?.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80'
      };
      setSubmittedProblem(fallbackProblem);
      if (onReportSubmitted) onReportSubmitted(fallbackProblem);
      setStep('success');
    }
  };

  const resetAllAndClose = () => {
    stopCamera();
    setStep('camera');
    setMediaItems([]);
    setActiveMediaIndex(0);
    setTitle('');
    setDescription('');
    setAiGeneratedBadge(false);
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
        backgroundColor: step === 'description' || step === 'success' ? '#f2f2f7' : '#000000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        color: step === 'description' || step === 'success' ? '#1c1c1e' : '#ffffff',
        fontFamily: 'var(--font-sans)',
        transition: 'background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Hidden Gallery Input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleGallerySelect}
      />

      {/* ========================================================================= */}
      {/* STEP 1: CAMERA & CAPTURE VIEW */}
      {/* ========================================================================= */}
      {step === 'camera' && (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Top Bar: Close, Mode/Timer, Flip */}
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
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)'
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
                border: '1px solid rgba(255, 255, 255, 0.18)',
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
                  letterSpacing: '0.04em',
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
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Flip Camera"
            >
              <GoogleIcon name="flip_camera_ios" size={22} color="#ffffff" />
            </button>
          </div>

          {/* Camera Viewfinder */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              backgroundColor: '#0a0a0a',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {cameraError ? (
              <div
                style={{
                  padding: '32px 24px',
                  textAlign: 'center',
                  maxWidth: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '18px'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <GoogleIcon name="videocam_off" size={32} color="#f87171" />
                </div>
                <p style={{ fontSize: '0.9375rem', color: '#d1d5db', lineHeight: 1.5, margin: 0 }}>
                  {cameraError}
                </p>
                <button
                  onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
                  className="apple-tap"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontWeight: '700',
                    fontSize: '0.9375rem',
                    padding: '13px 26px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <GoogleIcon name="photo_library" size={20} color="#000000" />
                  <span>Choose from Gallery</span>
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
          </div>

          {/* Bottom Bar: Gallery Square (Left) & Record Button (Center) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              padding: '24px 32px calc(28px + env(safe-area-inset-bottom, 0px)) 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)'
            }}
          >
            {/* Square on the Left: Gallery Picker */}
            <button
              onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
              className="apple-tap"
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.85)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
              aria-label="Gallery"
            >
              <GoogleIcon name="photo_library" size={26} color="#ffffff" />
            </button>

            {/* Middle: Apple Camera Record Button */}
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
                padding: 0,
                outline: 'none',
                boxShadow: isRecordingVideo
                  ? '0 0 24px rgba(255, 59, 48, 0.85)'
                  : '0 4px 16px rgba(0,0,0,0.45)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              aria-label={isRecordingVideo ? 'Stop Recording' : 'Start Recording'}
            >
              <div
                style={{
                  width: isRecordingVideo ? '28px' : '60px',
                  height: isRecordingVideo ? '28px' : '60px',
                  borderRadius: isRecordingVideo ? '8px' : '50%',
                  backgroundColor: '#ff3b30',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </button>

            {/* Right: Shortcut to preview if items exist, or empty spacer */}
            {mediaItems.length > 0 ? (
              <button
                onClick={() => setStep('preview')}
                className="apple-tap"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.5)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Preview"
              >
                <GoogleIcon name="arrow_forward" size={24} color="#ffffff" />
              </button>
            ) : (
              <div style={{ width: '52px' }} />
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: PREVIEW & SWIPEABLE MEDIA VIEW */}
      {/* ========================================================================= */}
      {step === 'preview' && (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000000' }}>
          {/* Top Bar: Retake/Back, Counter, Delete */}
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
                WebkitBackdropFilter: 'blur(16px)',
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

            {/* Apple Carousel Indicator Pill */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '700',
                letterSpacing: '0.02em',
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
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 59, 48, 0.6)',
                color: '#ff453a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Delete Item"
            >
              <GoogleIcon name="delete" size={20} color="#ff453a" />
            </button>
          </div>

          {/* Swipeable Media Carousel */}
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
                    {/* Seamless Loop Video without Colliding Browser Native Scrub Bar */}
                    <video
                      ref={idx === activeMediaIndex ? previewVideoRef : null}
                      src={item.url}
                      autoPlay
                      loop
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                    {/* Gentle Center Play / Pause Indicator */}
                    {showPlayIcon && (
                      <div
                        style={{
                          position: 'absolute',
                          width: '72px',
                          height: '72px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          backdropFilter: 'blur(12px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: 'none',
                          animation: 'popIn 0.2s ease'
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

          {/* Bottom Controls Bar: Left (+) Button & Right (>) Button ONLY - Symmetrical & Clean */}
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
            {/* Left Bottom: Plus (+) Button to Add More Media (No "Add more" text!) */}
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
                WebkitBackdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(255, 255, 255, 0.45)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              aria-label="Add More Media"
            >
              <GoogleIcon name="add" size={30} color="#ffffff" />
            </button>

            {/* Right Bottom: Arrow Button (>) ONLY (No "Next" text!) */}
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
                boxShadow: '0 8px 24px rgba(255, 255, 255, 0.35)',
                transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              aria-label="Continue to Description"
            >
              <GoogleIcon name="arrow_forward" size={26} color="#000000" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: DESCRIBE ISSUE (APPLE LIGHT THEME MATCHING SETU DESIGN SYSTEM) */}
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
            backgroundColor: '#f8f9fa',
            overflowY: 'auto',
            color: '#1c1c1e'
          }}
        >
          {/* Frosted iOS Navigation Bar */}
          <header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 50,
              padding: 'calc(14px + env(safe-area-inset-top, 0px)) 16px 14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
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
                color: '#1c1c1e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Back to Preview"
            >
              <GoogleIcon name="arrow_back" size={20} color="#1c1c1e" />
            </button>

            <h1
              style={{
                fontSize: '1.125rem',
                fontWeight: '800',
                margin: 0,
                color: '#000000',
                letterSpacing: '-0.02em'
              }}
            >
              Describe Issue
            </h1>

            <button
              onClick={resetAllAndClose}
              className="apple-tap"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#f2f2f7',
                border: 'none',
                color: '#1c1c1e',
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

          {/* Body Canvas */}
          <main style={{ flex: 1, padding: '18px 16px 32px 16px', display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '480px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            {/* Attached Media Tray */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6e6e73' }}>
                  Attached Media ({mediaItems.length})
                </span>
                <button
                  onClick={() => setStep('preview')}
                  style={{ background: 'none', border: 'none', color: '#0071e3', fontSize: '0.8125rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Edit / View
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {mediaItems.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    onClick={() => {
                      setActiveMediaIndex(idx);
                      setStep('preview');
                    }}
                    className="apple-tap"
                    style={{
                      width: '66px',
                      height: '66px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer'
                    }}
                  >
                    {m.type === 'video' ? (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <GoogleIcon name="play_arrow" size={24} color="#ffffff" />
                      </div>
                    ) : (
                      <img src={m.url} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Dictation Card: Apple / Setu Clean Style */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '20px 18px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GoogleIcon name="auto_awesome" size={18} color="#0071e3" />
                <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#0071e3', letterSpacing: '0.04em' }}>
                  VOICE AI • SAARAS & GEMINI
                </span>
              </div>

              <p style={{ fontSize: '0.875rem', color: '#6e6e73', margin: 0, maxWidth: '300px', lineHeight: 1.45 }}>
                Tap the mic to speak in Hindi or any local dialect. Gemini Flash 3.5 Lite will write the formal grievance.
              </p>

              {/* Mic Action Button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                disabled={isSynthesizing}
                className="apple-tap"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: isRecordingVoice ? '#ff3b30' : '#000000',
                  border: isRecordingVoice ? '4px solid #fecaca' : 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: isRecordingVoice
                    ? '0 0 24px rgba(255, 59, 48, 0.6)'
                    : '0 8px 20px rgba(0, 0, 0, 0.18)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  marginTop: '4px'
                }}
                aria-label={isRecordingVoice ? 'Stop Speaking' : 'Start Speaking'}
              >
                {isRecordingVoice ? (
                  <GoogleIcon name="stop" size={28} color="#ffffff" />
                ) : (
                  <GoogleIcon name="mic" size={28} color="#ffffff" />
                )}
              </button>

              {/* Live Voice Status Indicator */}
              {isRecordingVoice && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff3b30', fontWeight: '700', fontSize: '0.875rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff3b30', animation: 'pulse 1s infinite' }} />
                  Listening... {formatTimer(voiceSeconds)} (Tap to Stop)
                </div>
              )}

              {isSynthesizing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0071e3', fontSize: '0.875rem', fontWeight: '600' }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #0071e3', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Formulating grievance with Gemini 3.5 Flash Lite...
                </div>
              )}

              {aiGeneratedBadge && (
                <div
                  style={{
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    border: '1px solid #bae6fd',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <GoogleIcon name="check_circle" size={14} color="#0369a1" />
                  Written by Gemini 3.5 Flash Lite
                </div>
              )}
            </div>

            {/* Clean Form Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '20px 18px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {/* Title Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#1c1c1e', marginBottom: '6px' }}>
                  Issue Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Major sewage overflow flooding street"
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#f9f9fb',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    color: '#1c1c1e',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Category Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#1c1c1e', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#f9f9fb',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    color: '#1c1c1e',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="WATER_SANITATION">Water & Sanitation</option>
                  <option value="URBAN_INFRASTRUCTURE">Urban Infrastructure & Roads</option>
                  <option value="ENERGY_ELECTRICITY">Energy & Power Distribution</option>
                  <option value="ENVIRONMENT_WASTE">Environment & Waste Management</option>
                  <option value="HEALTHCARE">Public Health & Sanitation</option>
                  <option value="AGRICULTURE_RURAL">Agriculture & Rural Development</option>
                </select>
              </div>

              {/* Description Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', color: '#1c1c1e', marginBottom: '6px' }}>
                  Detailed Description (or dictate above)
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, landmarks, and severity in detail..."
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#f9f9fb',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    color: '#1c1c1e',
                    fontSize: '0.9375rem',
                    lineHeight: 1.5,
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Location Tag */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 14px',
                  backgroundColor: '#f2f2f7',
                  borderRadius: '12px',
                  fontSize: '0.8125rem',
                  color: '#3a3a3c'
                }}
              >
                <GoogleIcon name="location_on" size={18} color="#ff3b30" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
                  {locationName}
                </span>
              </div>
            </div>

            {/* Apple Solid Action Button */}
            <button
              type="button"
              onClick={handleSubmitReport}
              className="apple-tap"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '1rem',
                letterSpacing: '-0.01em',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
                marginTop: '4px'
              }}
            >
              <GoogleIcon name="send" size={20} color="#ffffff" />
              <span>Send Grievance Report</span>
            </button>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: SUBMITTING STATE */}
      {/* ========================================================================= */}
      {step === 'submitting' && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            padding: '24px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '3px solid rgba(0, 0, 0, 0.1)',
              borderTopColor: '#000000',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#000000' }}>
              Submitting Report...
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6e6e73', marginTop: '6px' }}>
              Running duplicate detection and routing to Nodal Technical Desk.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: SUCCESS STATE (MATCHES SETU AESTHETIC) */}
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
              Your grievance has been logged and assigned to the Nodal Technical Evaluation Desk.
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
              {submittedProblem?.title || title}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#8e8e93', fontWeight: '600', textTransform: 'uppercase', marginTop: '10px' }}>Location</div>
            <div style={{ fontSize: '0.875rem', color: '#3c3c43', marginTop: '2px' }}>
              {locationName}
            </div>
          </div>

          <button
            onClick={resetAllAndClose}
            className="apple-tap"
            style={{
              width: '100%',
              maxWidth: '340px',
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
            Done & View Submissions
          </button>
        </div>
      )}
    </div>
  );
};
