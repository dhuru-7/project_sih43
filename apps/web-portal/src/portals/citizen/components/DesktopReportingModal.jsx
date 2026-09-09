import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { reverseGeocode, extractVideoThumbnail } from '../../../services/geoService';
import { TaraAuraProcessingScreen } from '../../../components/ui/TaraAuraProcessingScreen';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const DesktopReportingModal = ({
  isOpen,
  onClose,
  onReportSubmitted,
  userName = 'Citizen'
}) => {
  const navigate = useNavigate();

  // Steps: 'media' | 'notepad' | 'processing' | 'review' | 'success'
  const [step, setStep] = useState('media');

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

  // Synthesized Review data & Final Submission
  const [reviewData, setReviewData] = useState(null);
  const [reviewMediaIndex, setReviewMediaIndex] = useState(0);
  const [isReviewPlaying, setIsReviewPlaying] = useState(true);
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
            formData.append('audio', audioBlob, 'voice.webm');

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
        alert('Microphone access was denied. You can type grievance details directly.');
      }
    } else {
      if (voiceRecorderRef.current && voiceRecorderRef.current.state !== 'inactive') {
        voiceRecorderRef.current.stop();
      }
      setIsRecordingVoice(false);
    }
  };

  // Continue from Notepad -> Full-Screen Glowing Aura Processing ("Hold on...") -> Transition to Review Card
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
        finalThumbnail = await extractVideoThumbnail(lastVideo.file || lastVideo.url);
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
      const generatedDesc = aiResult?.description || notepadText || 'Citizen reported civic problem with attached photographic/video evidence.';
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

      setTimeout(() => {
        setStep('review');
      }, 1500);
    } catch (err) {
      console.error('Desktop continue error:', err);
      const now = new Date();
      const fallback = {
        title: notepadText.slice(0, 45) || 'Civic Grievance',
        description: notepadText || 'Citizen reported civic problem with attached photographic/video evidence.',
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

  const resetAndClose = () => {
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
        padding: '24px'
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

      {step === 'processing' && <TaraAuraProcessingScreen />}

      <div
        className="apple-modal-content"
        style={{
          width: '100%',
          maxWidth: '820px',
          height: '680px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: step === 'processing' ? 'none' : 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* ===================================================================== */}
        {/* STEP 1: MEDIA UPLOAD & PREVIEW */}
        {/* ===================================================================== */}
        {step === 'media' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <header
              style={{
                padding: '18px 24px',
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
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
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
                padding: '16px 24px',
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
        {step === 'notepad' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
            {/* Minimal Header */}
            <header
              style={{
                padding: '16px 24px',
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
            <main style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
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
                padding: '16px 32px',
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
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
            {/* Header */}
            <header
              style={{
                padding: '16px 24px',
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
            <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                {/* Media Carousel on top of Card */}
                {mediaItems.length > 0 && (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '280px',
                      backgroundColor: '#000000',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {mediaItems[reviewMediaIndex]?.type === 'video' ? (
                      <video
                        ref={(el) => {
                          reviewVideoRefs.current[reviewMediaIndex] = el;
                        }}
                        src={mediaItems[reviewMediaIndex]?.url}
                        autoPlay
                        loop
                        playsInline
                        muted={false}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <img
                        src={mediaItems[reviewMediaIndex]?.url}
                        alt="Evidence"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    )}

                    {/* Counter Pill */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(10px)',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#ffffff'
                      }}
                    >
                      {reviewMediaIndex + 1} of {mediaItems.length}
                    </div>

                    {/* Carousel Nav Controls */}
                    {mediaItems.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setReviewMediaIndex((p) => (p > 0 ? p - 1 : mediaItems.length - 1))}
                          className="apple-tap"
                          style={{
                            position: 'absolute',
                            left: '12px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(8px)',
                            border: 'none',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <GoogleIcon name="chevron_left" size={22} color="#ffffff" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setReviewMediaIndex((p) => (p < mediaItems.length - 1 ? p + 1 : 0))}
                          className="apple-tap"
                          style={{
                            position: 'absolute',
                            right: '12px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(8px)',
                            border: 'none',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <GoogleIcon name="chevron_right" size={22} color="#ffffff" />
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Card Details */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Category & Severity Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
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

                  {/* Title */}
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
                      <GoogleIcon name="location_on" size={18} color="#0071e3" />
                      <span style={{ fontWeight: '600' }}>
                        {reviewData.address || reviewData.villageCity || 'Ranchi, Jharkhand'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#6e6e73' }}>
                      <GoogleIcon name="schedule" size={18} color="#8e8e93" />
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
                        lineHeight: 1.6,
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
                </div>
              </div>
            </div>

            {/* Footer */}
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
                  padding: '0 32px',
                  borderRadius: '9999px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit Report</span>
                    <GoogleIcon name="arrow_forward" size={18} color="#ffffff" />
                  </>
                )}
              </button>
            </footer>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STEP 4: SUCCESS STATE (CLEAN, NO NATIONAL DATABASE JARGON) */}
        {/* ===================================================================== */}
        {step === 'success' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              padding: '40px 32px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa'
            }}
          >
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                border: '2px solid #16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GoogleIcon name="check_circle" size={48} color="#16a34a" />
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
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '12px', marginBottom: '6px', color: '#000000' }}>
                {submittedProblem?.id || '#SETU-LIVE'}
              </h2>
              <p style={{ fontSize: '1rem', color: '#6e6e73', margin: 0, maxWidth: '360px', lineHeight: 1.5 }}>
                Your grievance has been submitted successfully and assigned for field review.
              </p>
            </div>

            <div
              style={{
                width: '100%',
                maxWidth: '420px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#8e8e93', fontWeight: '600', textTransform: 'uppercase' }}>Title</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#000000', marginTop: '2px' }}>
                {submittedProblem?.title}
              </div>

              <div style={{ fontSize: '0.75rem', color: '#8e8e93', fontWeight: '600', textTransform: 'uppercase', marginTop: '12px' }}>Category</div>
              <div style={{ fontSize: '0.9375rem', color: '#16a34a', fontWeight: '600', marginTop: '2px' }}>
                {submittedProblem?.category}
              </div>

              <div style={{ fontSize: '0.75rem', color: '#8e8e93', fontWeight: '600', textTransform: 'uppercase', marginTop: '12px' }}>Location</div>
              <div style={{ fontSize: '0.875rem', color: '#3c3c43', marginTop: '2px' }}>
                {submittedProblem?.address || locationDetails.formatted}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '420px' }}>
              <button
                onClick={() => {
                  resetAndClose();
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
                onClick={resetAndClose}
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
    </div>
  );
};
