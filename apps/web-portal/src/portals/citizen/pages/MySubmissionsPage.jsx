import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useLanguage } from '../../../context/LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// High-quality category fallback imagery
const CATEGORY_FALLBACK_IMAGES = {
  'Roads, Transport and Traffic Management':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuChYMCFD76IfKpkc1oLApEVIAY0KrG3rOtAcom65byNUoZXXxE0A3nVB4xqv7oM3pgWz1H01WhWQmnPvAW9DYEXAxCxMOePMQwGkpwsQhMPiQxnM6O2gpPPbRFvV6D5pUSl769KU-WLOEmjcyDpUKCgklmbYugi8GNNo3mTVg-ee7MO9aBI4C3tCie_XxQ_t8Qrzg12xCdj0--yhugUwx0j7AjyuEE816vfwOfkJUESiLLTWqeROVr32Q',
  'Roads and Public Works':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuChYMCFD76IfKpkc1oLApEVIAY0KrG3rOtAcom65byNUoZXXxE0A3nVB4xqv7oM3pgWz1H01WhWQmnPvAW9DYEXAxCxMOePMQwGkpwsQhMPiQxnM6O2gpPPbRFvV6D5pUSl769KU-WLOEmjcyDpUKCgklmbYugi8GNNo3mTVg-ee7MO9aBI4C3tCie_XxQ_t8Qrzg12xCdj0--yhugUwx0j7AjyuEE816vfwOfkJUESiLLTWqeROVr32Q',
  'Sanitation and Waste Management':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCHLgpa6w9Mc0xb0uRDCltnA57316hNCEx8m2gsDYU9dYGL8jHTe1Fx_VJe0ofiXkjfDINb8H6KhvIOUGi0CE2-F2bEf-JEP-k-mjv4lJBZ_CIkhP-SZZvBh1QIMMy9thuAXqS9HmskDhdKjrzsbeBEQ7rV5-C__8tiu2AAp0E_nbY8ixzoMvebKxizup9W0CieQrAGS8iIsY73h5sgK3k5lhJlWRischfnoQRJUVOAKbagxw8ui-0oXw',
  'Urban Development and Infrastructure':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCwOdSVlaviBH80UBoIZxQyH09PA24NZxOtxaijvNTITzuIm0cnKHgJLKS7ZBN9CQ7GjrX9wNMj3Mxnelg9HY7Bg-jIlfORB-2N1cU4d7qC5N-VnAoz6KqeFnfA2aAOF56xWkBxkSM4KuNJxxCWi2qF9ryuZHg0jo2Gy2R8rM15m3mlKNBLRvXHXxgTkJSMdn9CQc-hYPWeKa5XvrnMhiQu0z1ZpkYEwndMeQ5w4xh5lW6rZ_3JHwVNqA',
  'Water Resources and Sanitation':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCHLgpa6w9Mc0xb0uRDCltnA57316hNCEx8m2gsDYU9dYGL8jHTe1Fx_VJe0ofiXkjfDINb8H6KhvIOUGi0CE2-F2bEf-JEP-k-mjv4lJBZ_CIkhP-SZZvBh1QIMMy9thuAXqS9HmskDhdKjrzsbeBEQ7rV5-C__8tiu2AAp0E_nbY8ixzoMvebKxizup9W0CieQrAGS8iIsY73h5sgK3k5lhJlWRischfnoQRJUVOAKbagxw8ui-0oXw',
  'Environment and Pollution':
    'https://lh3.googleusercontent.com/aida/AEtjO1XamjKI0u4wiLQqbdwIjka3AUunHLyO5VUGIt-_sfI6vEgqbtRUT49D8SONBV1ygAhoLHjL9GRocWXSlc32S88GvnNoVMoR4SKJ47C_k_Xr_mC-yUbq-2nJNfPFlS-UUMXp7gxVln36z80KYaQ7KFwvLEhJh-wD_DbEGL8qKyViXPOA45OyqWIttGNuY8Fw97uZ3m6LLPDGVv4A2bAsa5OwexUT4DBznN6OrpfjcPCDR0xRwjORXc13dqLz',
  'Public Safety and Law Enforcement':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAnFhknnzKZ77MzM__18zi9CIQg_GZqe9Z6PzL3A1cLRHav_s_Oi96NIArTm4qPF3AWCuJ-fLos5M8DEYPGxQQbf96XnJn4JofBVB4EmRZ8wQijJiglIuOBSQ9jg1efg1HLBa2JxjB4aI0MyC_c0RCBA_xeliKoiMo_-jcJP3Rvmd7MUrOREH31T_bNReLQZWijcsZuKCL_hyH_QmDuCoe7JSHk0BZb4yYq7-e1pNLaS5S79urviGtK4A',
  'Public Administration and Governance':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAuamkwueplMzdyfVyVcevqYRlu16KSZ1ZAO40ibKqaiozk83dTUwBjtfTAqVCJa2rFwrCdeqVo7RyRHegHV5q7CX2VSa7oTH8AvYNVpGafkyNtQDtKEbxvfkdUKH2iJgtsl4nDJU8sGqxvhnFDZdXMwb8N6_bJAaPIUv5FniBk939zWdvsPuS1gHRWhdrxGKLn75kuCaA-iD-PNCaWicXCgbBiKiWpXPdbHYNOGS-kgwPO_TIjT_JNQQ',
  'Electricity and Energy':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAuamkwueplMzdyfVyVcevqYRlu16KSZ1ZAO40ibKqaiozk83dTUwBjtfTAqVCJa2rFwrCdeqVo7RyRHegHV5q7CX2VSa7oTH8AvYNVpGafkyNtQDtKEbxvfkdUKH2iJgtsl4nDJU8sGqxvhnFDZdXMwb8N6_bJAaPIUv5FniBk939zWdvsPuS1gHRWhdrxGKLn75kuCaA-iD-PNCaWicXCgbBiKiWpXPdbHYNOGS-kgwPO_TIjT_JNQQ'
};
const DEFAULT_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCHLgpa6w9Mc0xb0uRDCltnA57316hNCEx8m2gsDYU9dYGL8jHTe1Fx_VJe0ofiXkjfDINb8H6KhvIOUGi0CE2-F2bEf-JEP-k-mjv4lJBZ_CIkhP-SZZvBh1QIMMy9thuAXqS9HmskDhdKjrzsbeBEQ7rV5-C__8tiu2AAp0E_nbY8ixzoMvebKxizup9W0CieQrAGS8iIsY73h5sgK3k5lhJlWRischfnoQRJUVOAKbagxw8ui-0oXw';

const getTimeAgo = (dateStr) => {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  } catch {
    return 'Recently';
  }
};

const getSeverityColor = (sev = 'MEDIUM') => {
  const s = (sev || 'MEDIUM').toUpperCase();
  if (s === 'CRITICAL' || s === 'HIGH') return { dot: '#ef4444', text: '#b91c1c', label: s };
  if (s === 'LOW') return { dot: '#22c55e', text: '#15803d', label: 'LOW' };
  return { dot: '#f59e0b', text: '#b45309', label: 'MEDIUM' };
};

const getStatusBadge = (status = 'SUBMITTED') => {
  const norm = (status || 'SUBMITTED').toUpperCase();
  if (norm === 'RESOLVED' || norm === 'COMPLETED') {
    return { bg: '#f0fdf4', text: '#15803d', border: 'rgba(22, 163, 74, 0.2)', icon: 'check_circle', label: 'Resolved' };
  }
  if (norm === 'IN_PROGRESS' || norm === 'IN_REVIEW' || norm === 'ACTION_INITIATED') {
    return { bg: '#fffbeb', text: '#b45309', border: 'rgba(245, 158, 11, 0.2)', icon: 'pending', label: 'In Progress' };
  }
  if (norm === 'REJECTED' || norm === 'FLAGGED_DUPLICATE') {
    return { bg: '#fef2f2', text: '#b91c1c', border: 'rgba(239, 68, 68, 0.2)', icon: 'info', label: norm === 'FLAGGED_DUPLICATE' ? 'Duplicate' : 'Declined' };
  }
  return { bg: '#eff6ff', text: '#1d4ed8', border: 'rgba(29, 78, 216, 0.2)', icon: 'verified_user', label: 'Submitted' };
};

/* ─────────────────────────────────────────────
 *  Full-Screen Media Lightbox Modal
 * ───────────────────────────────────────────── */
const MediaLightboxModal = ({ isOpen, mediaList = [], initialIndex = 0, title = '', onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((p) => (p < mediaList.length - 1 ? p + 1 : 0));
      if (e.key === 'ArrowLeft') setCurrentIndex((p) => (p > 0 ? p - 1 : mediaList.length - 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, currentIndex, mediaList.length, onClose]);

  if (!isOpen || mediaList.length === 0) return null;

  const currentMedia = mediaList[currentIndex] || mediaList[0];
  const isVideo =
    currentMedia?.type === 'video' ||
    currentMedia?.url?.includes('video') ||
    currentMedia?.url?.endsWith('.mp4') ||
    currentMedia?.url?.endsWith('.webm');

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          // Swipe left -> next
          setCurrentIndex((p) => (p < mediaList.length - 1 ? p + 1 : 0));
        } else {
          // Swipe right -> prev
          setCurrentIndex((p) => (p > 0 ? p - 1 : mediaList.length - 1));
        }
      }
    }
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999999,
        backgroundColor: 'rgba(0, 0, 0, 0.94)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#ffffff',
        animation: 'applePop 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Header - '1 of 2' and Heading removed */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          zIndex: 10
        }}
      >
        <button
          onClick={onClose}
          className="apple-tap"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.18)',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Close"
        >
          <GoogleIcon name="close" size={22} color="#ffffff" />
        </button>
      </div>

      {/* Main Viewport with Swipe Support - Chevron buttons < > removed */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          overflow: 'hidden',
          touchAction: 'pan-y'
        }}
      >
        <div
          style={{
            maxWidth: '92vw',
            maxHeight: '75vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px',
            overflow: 'hidden'
          }}
        >
          {isVideo ? (
            <video
              src={currentMedia.url}
              controls
              autoPlay
              playsInline
              style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '16px', outline: 'none', backgroundColor: '#000' }}
            />
          ) : (
            <img
              src={currentMedia.url}
              alt="Evidence"
              style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 12px 48px rgba(0,0,0,0.6)' }}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
            />
          )}
        </div>
      </div>

      {/* Thumbnail Film Strip */}
      {mediaList.length > 1 && (
        <div
          style={{
            padding: '16px 20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            overflowX: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {mediaList.map((m, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="apple-tap"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: idx === currentIndex ? '2.5px solid #0071e3' : '2px solid transparent',
                opacity: idx === currentIndex ? 1 : 0.6,
                transform: idx === currentIndex ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                backgroundColor: '#1c1c1e',
                position: 'relative'
              }}
            >
              <img
                src={m.url}
                alt={`Thumb ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_IMAGE;
                }}
              />
              {(m.type === 'video' || m.url?.includes('video')) && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <GoogleIcon name="play_arrow" size={16} color="#ffffff" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
};

/* ─────────────────────────────────────────────
 *  16:9 Swappable Media Carousel (Explore-Style with Inline Video Playback)
 * ───────────────────────────────────────────── */
const SubmissionMediaCarousel = ({ mediaList, onOpenPreview, title, fallbackImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [playingMap, setPlayingMap] = useState({});

  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isSwipingRef = useRef(false);
  const isHorizontalGestureRef = useRef(null);
  const hasMovedRef = useRef(false);

  if (!mediaList || mediaList.length === 0) return null;

  const total = mediaList.length;

  const pauseAllVideos = () => {
    Object.values(videoRefs.current).forEach((v) => {
      if (v) {
        try {
          v.pause();
        } catch (_) {}
      }
    });
    setPlayingMap({});
  };

  const handlePrev = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    pauseAllVideos();
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    pauseAllVideos();
    setCurrentIndex((prev) => Math.min(total - 1, prev + 1));
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

      // Apple rubber-banding at edges
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
    const containerWidth = containerRef.current?.offsetWidth || 360;
    const threshold = Math.max(40, containerWidth * 0.16);

    if ((dragOffset < -threshold || (dragOffset < -20 && velocity > 0.32)) && currentIndex < total - 1) {
      pauseAllVideos();
      setCurrentIndex((prev) => prev + 1);
    } else if ((dragOffset > threshold || (dragOffset > 20 && velocity > 0.32)) && currentIndex > 0) {
      pauseAllVideos();
      setCurrentIndex((prev) => prev - 1);
    }

    setDragOffset(0);
    isHorizontalGestureRef.current = null;
  };

  const togglePlayVideo = (idx, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (hasMovedRef.current) return;
    const vid = videoRefs.current[idx];
    if (!vid) return;

    if (vid.paused) {
      pauseAllVideos();
      vid
        .play()
        .then(() => {
          setPlayingMap((p) => ({ ...p, [idx]: true }));
        })
        .catch((err) => {
          console.warn('Video playback error:', err);
        });
    } else {
      vid.pause();
      setPlayingMap((p) => ({ ...p, [idx]: false }));
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isSwipingRef.current) handleEnd();
      }}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY, e)}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY, e)}
      onMouseUp={handleEnd}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        backgroundColor: '#e5e7eb',
        touchAction: 'pan-y',
        userSelect: 'none',
        cursor: total > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
      }}
    >
      {/* Sliding media track */}
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
        {mediaList.map((m, idx) => {
          const isItemVid =
            m.type === 'video' ||
            m.url?.includes('video') ||
            m.url?.endsWith('.mp4') ||
            m.url?.endsWith('.webm') ||
            m.url?.startsWith('data:video');
          const isPlaying = Boolean(playingMap[idx]);

          return (
            <div
              key={idx}
              style={{
                width: `${100 / total}%`,
                height: '100%',
                position: 'relative',
                flexShrink: 0,
                backgroundColor: '#111827'
              }}
            >
              {isItemVid ? (
                <div
                  style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}
                  onClick={(e) => togglePlayVideo(idx, e)}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={m.url}
                    playsInline
                    loop
                    preload="metadata"
                    onEnded={() => setPlayingMap((p) => ({ ...p, [idx]: false }))}
                    onError={(e) => {
                      console.warn('Video failed to load:', m.url);
                      if (fallbackImage) {
                        e.currentTarget.style.display = 'none';
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  {!isPlaying && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.32)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none'
                      }}
                    >
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.94)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <GoogleIcon name="play_arrow" size={28} color="#000000" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={m.url}
                  alt={title || 'Grievance Evidence'}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage || DEFAULT_IMAGE;
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Counter Tag (Top Right) */}
      {total > 1 && (
        <div
          className="apple-glossy-tag"
          style={{
            position: 'absolute',
            top: '0.625rem',
            right: '0.625rem',
            fontSize: '0.6875rem',
            fontWeight: '600',
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            zIndex: 10,
            pointerEvents: 'none',
            letterSpacing: '0.03em',
            border: 'none',
            boxShadow: 'none'
          }}
        >
          {currentIndex + 1}/{total}
        </div>
      )}

      {/* Pagination Dots (Bottom Center) */}
      {total > 1 && (
        <div
          className="apple-glossy-tag"
          style={{
            position: 'absolute',
            bottom: '0.625rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            zIndex: 10,
            padding: '0.2rem 0.5rem',
            borderRadius: '9999px',
            border: 'none',
            boxShadow: 'none'
          }}
        >
          {mediaList.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                pauseAllVideos();
                setCurrentIndex(idx);
              }}
              style={{
                width: idx === currentIndex ? '12px' : '5px',
                height: '5px',
                borderRadius: '9999px',
                backgroundColor: idx === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                boxShadow: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Preview Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          pauseAllVideos();
          if (onOpenPreview) onOpenPreview(mediaList, currentIndex, title);
        }}
        className="apple-glossy-black"
        style={{
          position: 'absolute',
          bottom: '0.625rem',
          right: '0.625rem',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          border: 'none',
          boxShadow: 'none',
          opacity: isHovered ? 1 : 0.82
        }}
        title="View Fullscreen"
        aria-label="View Fullscreen"
      >
        <GoogleIcon name="fullscreen" size={17} color="#ffffff" />
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────
 *  Explore-Style Submission Card Component
 *  (Exact Explore Feed design, WITHOUT upvote/share/bookmark)
 * ───────────────────────────────────────────── */
const SubmissionCard = React.forwardRef(({ sub, isHighlighted, onOpenMediaPreview, onDelete }, ref) => {
  const { t } = useLanguage();
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const timeAgo = getTimeAgo(sub.created_at || sub.createdAt);
  const location = sub.villageCity || sub.district || sub.address || 'Ranchi, Jharkhand';
  const severityInfo = getSeverityColor(sub.severity);
  const fallbackImage = CATEGORY_FALLBACK_IMAGES[sub.category] || DEFAULT_IMAGE;

  // Parse evidence media list
  const mediaList = useMemo(() => {
    const list = [];
    const rawUrls = sub.evidenceUrls || sub.mediaList || sub.images || [];
    if (Array.isArray(rawUrls) && rawUrls.length > 0) {
      rawUrls.forEach((u) => {
        if (typeof u === 'string' && u.trim()) {
          const isVid =
            u.includes('video') ||
            u.endsWith('.mp4') ||
            u.endsWith('.webm') ||
            u.startsWith('data:video');
          list.push({ url: u, type: isVid ? 'video' : 'image' });
        } else if (u && typeof u === 'object' && u.url) {
          const isVid =
            u.type === 'video' ||
            u.url?.includes('video') ||
            u.url?.endsWith('.mp4') ||
            u.url?.endsWith('.webm') ||
            u.url?.startsWith('data:video');
          list.push({ ...u, type: isVid ? 'video' : 'image' });
        }
      });
    }
    if (list.length === 0) {
      const fallbackUrl = sub.thumbnail || sub.image;
      if (fallbackUrl) {
        list.push({
          url: fallbackUrl,
          type:
            fallbackUrl.includes('video') ||
            fallbackUrl.endsWith('.mp4') ||
            fallbackUrl.endsWith('.webm') ||
            fallbackUrl.startsWith('data:video')
              ? 'video'
              : 'image'
        });
      }
    }
    // High-quality category imagery fallback
    if (list.length === 0) {
      list.push({
        url: fallbackImage,
        type: 'image'
      });
    }
    return list;
  }, [sub, fallbackImage]);

  // Description & character limit handling
  const rawDesc = sub.description || '';
  const isLongDesc = rawDesc.length > 170;
  const displayDesc = expandedDesc || !isLongDesc ? rawDesc : `${rawDesc.slice(0, 170)}...`;

  // Resolved title formatting
  const displayTitle =
    sub.title === 'Unverified Media Evidence Submitted'
      ? t('unverified_media_title', 'Unverified Media Evidence Submitted')
      : sub.title === 'Visual civic problem reported by citizen.' || sub.title === 'Visual civic problem reported by citizen'
      ? t('visual_problem_reported_title', 'Visual civic problem reported by citizen.')
      : sub.title || 'Civic Grievance Report';

  return (
    <article
      ref={ref}
      id={`submission-${sub.id}`}
      style={{
        backgroundColor: '#ffffff',
        border: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: 0,
        padding: '1.25rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: isHighlighted ? 'inset 0 0 0 2px #0071e3' : 'none',
        transition: 'box-shadow 0.35s ease',
        animation: isHighlighted ? 'cardPulse 1.5s ease-out' : 'none'
      }}
    >
      {/* ─── 1. Header Row (Timestamp, Location & '...' Contextual Menu) ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ fontSize: '0.75rem', color: '#7e7576', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>{timeAgo}</span>
          <span>•</span>
          <GoogleIcon name="location_on" size={13} color="#7e7576" />
          <span style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {location}
          </span>
        </div>

        {/* '...' Button with Contextual Menu */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            className="apple-tap"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#7e7576',
              padding: '4px 6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease'
            }}
            aria-label="More options"
          >
            <GoogleIcon name="more_horiz" size={20} color="#7e7576" />
          </button>

          {isMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.14), 0 1px 4px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '4px',
                zIndex: 40,
                minWidth: '100px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  if (onDelete) onDelete(sub);
                }}
                className="apple-tap"
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'block'
                }}
              >
                {t('delete', 'Delete')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── 2. Headline Title ─── */}
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: '#1a1c1c',
          margin: 0,
          lineHeight: 1.35,
          letterSpacing: '-0.01em'
        }}
      >
        {displayTitle}
      </h3>

      {/* ─── 3. Content Description with Black '...more' ─── */}
      {rawDesc && (
        <div style={{ fontSize: '0.875rem', color: '#1a1c1c', lineHeight: 1.55 }}>
          <span>{displayDesc}</span>
          {isLongDesc && (
            <button
              type="button"
              onClick={() => setExpandedDesc((p) => !p)}
              style={{
                background: 'none',
                border: 'none',
                color: '#000000',
                fontSize: '0.875rem',
                fontWeight: '700',
                padding: '0 0 0 4px',
                cursor: 'pointer',
                display: 'inline',
                fontFamily: 'inherit'
              }}
            >
              {expandedDesc ? t('show_less', 'Show less') : '...more'}
            </button>
          )}
        </div>
      )}

      {/* ─── 4. Topic Tags (DHTE Nodal tag removed) ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
        {sub.category && (
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: '600',
              color: '#4c4546',
              backgroundColor: '#f3f3f3',
              padding: '0.2rem 0.5rem',
              borderRadius: '0.25rem'
            }}
          >
            {sub.category}
          </span>
        )}

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.6875rem',
            fontWeight: '600',
            color: severityInfo.text,
            backgroundColor: '#f3f3f3',
            padding: '0.2rem 0.5rem',
            borderRadius: '0.25rem'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: severityInfo.dot }} />
          {severityInfo.label}
        </span>

        {(sub.impactCount || sub.impactDescription) && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.6875rem',
              fontWeight: '600',
              color: '#15803d',
              backgroundColor: '#f0fdf4',
              padding: '0.2rem 0.5rem',
              borderRadius: '0.25rem'
            }}
          >
            <GoogleIcon name="groups" size={13} color="#15803d" />
            <span>{sub.impactCount || 'Community Impact'}</span>
          </span>
        )}
      </div>

      {/* ─── 5. Media Carousel (16:9 Aspect Ratio with Inline Video Playback) ─── */}
      <SubmissionMediaCarousel
        mediaList={mediaList}
        onOpenPreview={onOpenMediaPreview}
        title={displayTitle}
        fallbackImage={fallbackImage}
      />

      {/* ─── 6. Action / Grievance Strip (Official Record Tag Removed) ─── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.25rem',
          paddingTop: '0.625rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#4b5563',
              letterSpacing: '0.02em',
              backgroundColor: '#f3f4f6',
              padding: '3px 8px',
              borderRadius: '6px'
            }}
          >
            #{sub.id}
          </span>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>
          {sub.created_at
            ? new Date(sub.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            : 'Logged'}
        </div>
      </div>
    </article>
  );
});

SubmissionCard.displayName = 'SubmissionCard';

/* ─────────────────────────────────────────────
 *  Main My Submissions Page Component
 * ───────────────────────────────────────────── */
export const MySubmissionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);
  const cardRefs = useRef({});

  // Delete feedback state
  const [toastMessage, setToastMessage] = useState(null);

  // Lightbox modal state
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    mediaList: [],
    initialIndex: 0,
    title: ''
  });

  // Route safeguard: onboarding check
  useEffect(() => {
    const isOnboarded = localStorage.getItem('setu_onboarded') === 'true';
    const hasUserData = Boolean(localStorage.getItem('setu_user') || localStorage.getItem('sih_user_data'));
    if (!isOnboarded || !hasUserData) {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate]);

  // Read highlight query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hId = params.get('highlight');
    if (hId) {
      setHighlightedId(hId);
      window.history.replaceState({}, '', '/my-submissions');
    }
  }, [location.search]);

  // Fetch from database + sync local storage
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        // 1. Read local storage cache
        let localSubmissions = [];
        try {
          localSubmissions = JSON.parse(localStorage.getItem('setu_user_submissions') || '[]');
        } catch (e) {
          localSubmissions = [];
        }

        // 2. Fetch problems from database
        let dbSubmissions = [];
        try {
          const resp = await fetch(`${API_BASE_URL}/problems`);
          if (resp.ok) {
            const json = await resp.json();
            dbSubmissions = (json.data || []).filter(
              (p) => p.safetyStatus !== 'FLAGGED_POLICY_VIOLATION' && p.safety_status !== 'FLAGGED_POLICY_VIOLATION'
            );
          }
        } catch (err) {
          console.warn('Network error fetching from DB:', err);
        }

        // 3. Auto-sync any unsaved local reports to SQLite database
        const dbIds = new Set(dbSubmissions.map((p) => p.id));
        const unsynced = localSubmissions.filter((p) => !dbIds.has(p.id));
        if (unsynced.length > 0) {
          unsynced.forEach(async (report) => {
            try {
              await fetch(`${API_BASE_URL}/problems`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
              });
            } catch (syncErr) {
              console.warn('Failed to sync report to database:', report.id, syncErr);
            }
          });
        }

        // 4. Merge DB and local submissions (deduplicating by ID)
        const combinedMap = new Map();
        dbSubmissions.forEach((p) => combinedMap.set(p.id, p));
        localSubmissions.forEach((p) => {
          if (!combinedMap.has(p.id)) {
            combinedMap.set(p.id, p);
          }
        });

        const merged = Array.from(combinedMap.values()).sort((a, b) => {
          const timeA = new Date(a.created_at || a.createdAt || 0).getTime();
          const timeB = new Date(b.created_at || b.createdAt || 0).getTime();
          return timeB - timeA;
        });

        setSubmissions(merged);
      } catch (err) {
        console.warn('Failed to load user submissions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Scroll to highlighted card if specified
  useEffect(() => {
    if (!highlightedId || loading || submissions.length === 0) return;
    const timeout = setTimeout(() => {
      const el = cardRefs.current[highlightedId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => setHighlightedId(null), 2500);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [highlightedId, loading, submissions]);

  const handleOpenMediaPreview = (mediaList, initialIndex, title) => {
    setLightboxState({ isOpen: true, mediaList, initialIndex, title });
  };

  const handleDeleteReport = async (report) => {
    if (!report) return;
    const targetId = report.id;

    try {
      // 1. Delete from SQLite DB via API
      await fetch(`${API_BASE_URL}/problems/${targetId}`, {
        method: 'DELETE'
      });

      // 2. Remove from local storage
      try {
        const local = JSON.parse(localStorage.getItem('setu_user_submissions') || '[]');
        const updated = local.filter((p) => p.id !== targetId);
        localStorage.setItem('setu_user_submissions', JSON.stringify(updated));
      } catch (e) {}

      // 3. Dispatch global event for other components
      window.dispatchEvent(new CustomEvent('setu_problem_deleted', { detail: { id: targetId } }));

      // 4. Remove from active state in page
      setSubmissions((prev) => prev.filter((p) => p.id !== targetId));

      // 5. Toast notification
      setToastMessage(`Report #${targetId} deleted successfully.`);
      setTimeout(() => setToastMessage(null), 3200);
    } catch (err) {
      console.error('Error deleting report:', err);
    }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/citizen/home', { replace: true });
    }
  };

  return (
    <div
      className="apple-page-enter"
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
        overflowX: 'hidden'
      }}
    >
      {/* Pulse keyframe animation for highlighted card */}
      <style>{`
        @keyframes cardPulse {
          0% { box-shadow: inset 0 0 0 2px rgba(0, 113, 227, 0.4); }
          50% { box-shadow: inset 0 0 0 4px rgba(0, 113, 227, 0.2); }
          100% { box-shadow: inset 0 0 0 2px rgba(0, 113, 227, 0.3); }
        }
      `}</style>

      {/* ─── Top Frosted Navigation Bar ─── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <button
          onClick={handleBack}
          className="apple-tap"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
          aria-label="Back"
        >
          <GoogleIcon name="chevron_left" size={24} color="#1a1c1c" />
        </button>
        <h1
          style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#1a1c1c',
            margin: 0,
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif'
          }}
        >
          {t('my_submissions', 'My Submissions')}
        </h1>
      </header>

      {/* ─── Feed Content Container (Touching Corners of Screen) ─── */}
      <main
        style={{
          maxWidth: '560px',
          width: '100%',
          margin: '0 auto',
          padding: '0 0 60px 0',
          boxSizing: 'border-box'
        }}
      >
        {loading ? (
          <div style={{ padding: '80px 20px', textAlign: 'center', color: '#8e8e93', fontSize: '0.9375rem' }}>
            {t('loading_submissions', 'Loading your submissions...')}
          </div>
        ) : submissions.length === 0 ? (
          <div
            style={{
              padding: '64px 24px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              border: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              margin: '20px 16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#f2f2f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GoogleIcon name="assignment" size={28} color="#8e8e93" />
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', margin: 0, color: '#1c1c1e' }}>
              {t('no_submissions_yet', 'No Submissions Yet')}
            </h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {submissions.map((sub) => (
              <SubmissionCard
                key={sub.id}
                ref={(el) => {
                  cardRefs.current[sub.id] = el;
                }}
                sub={sub}
                isHighlighted={highlightedId === sub.id}
                onOpenMediaPreview={handleOpenMediaPreview}
                onDelete={handleDeleteReport}
              />
            ))}
          </div>
        )}
      </main>

      {/* Full-screen Media Lightbox */}
      <MediaLightboxModal
        isOpen={lightboxState.isOpen}
        mediaList={lightboxState.mediaList}
        initialIndex={lightboxState.initialIndex}
        title={lightboxState.title}
        onClose={() => setLightboxState((p) => ({ ...p, isOpen: false }))}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999999,
            backgroundColor: '#1c1c1e',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
            animation: 'applePop 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <GoogleIcon name="check_circle" size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
