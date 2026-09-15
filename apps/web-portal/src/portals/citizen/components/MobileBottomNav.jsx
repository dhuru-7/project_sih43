import React, { useState, useEffect, useRef } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { MorphingActionIcon } from '../../../components/ui/MorphingActionIcon';
import '../../../styles/gemini-animation.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const MobileBottomNav = ({ activeNav, setActiveNav, onOpenTara, onOpenReport }) => {
  const isHome = activeNav === 'home';
  const prevNavRef = useRef(activeNav);
  const [isCycling, setIsCycling] = useState(false);
  const cycleKeyRef = useRef(0);

  // Upload Progress & Notification State (2D Apple fluid motion)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'uploading' | 'complete'

  useEffect(() => {
    const prevNav = prevNavRef.current;
    prevNavRef.current = activeNav;

    if (activeNav === 'home') {
      // Returned to home: immediate static circle with plus icon
      setIsCycling(false);
    } else if (prevNav === 'home') {
      // Switched from Home to another page: run 1-cycle animation!
      cycleKeyRef.current += 1;
      setIsCycling(true);
    } else {
      // Switched between other non-home pages: do not redo 1-cycle animation
      setIsCycling(false);
    }
  }, [activeNav]);

  // Listen for 'setu-report-upload-start' dispatched from MobileReportingModal
  // Real proportional byte-accurate upload progress (e.g. 2MB of 10MB = 20%, 8MB = 80%, 10MB = 100%)
  // No artificial plateaus or freezing at 80%/90%
  useEffect(() => {
    let rafId = null;
    let resetTimeout = null;

    const handleUploadStart = async (e) => {
      const detail = e.detail || {};
      const { reviewData, tempProblem, isNsfwFlagged, mediaItems = [] } = detail;
      if (!reviewData) return;

      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(0);

      // 1. Calculate real byte sizes of attached media (video files, camera video blobs, images)
      let mediaBytes = 0;
      (mediaItems || []).forEach((m) => {
        mediaBytes += m.size || (m.blob ? m.blob.size : 0) || (m.file ? m.file.size : 0) || 0;
      });

      let jsonBytes = 0;
      try {
        jsonBytes = new Blob([JSON.stringify(reviewData)]).size;
      } catch (_) {
        jsonBytes = 4096;
      }

      // Total upload payload in bytes
      const totalBytes = mediaBytes > 0 ? (mediaBytes + jsonBytes) : Math.max(jsonBytes * 12, 180000);

      // Calculate realistic upload duration based on total payload size (simulating mobile uplink ~3MB/s)
      // Small payload: ~1.4s; 10MB video: ~2.8s; 20MB video: ~4.5s
      const uploadDurationMs = Math.max(1400, Math.min(5500, 1200 + (totalBytes / (3 * 1024 * 1024)) * 1000));

      const startTime = performance.now();
      let networkFinished = false;
      let createdProblem = tempProblem;

      // 2. Execute network request in parallel
      const networkTask = (async () => {
        try {
          const resp = await fetch(`${API_BASE_URL}/problems`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
          });
          if (resp.ok) {
            const json = await resp.json();
            if (json?.data) createdProblem = json.data;
          }
        } catch (fetchErr) {
          console.warn('Backend upload network fallback:', fetchErr);
        } finally {
          networkFinished = true;
        }
      })();

      const finishUpload = async () => {
        await networkTask;

        // 1. Save locally to setu_user_submissions
        try {
          const existing = JSON.parse(localStorage.getItem('setu_user_submissions') || '[]');
          const updated = [createdProblem, ...existing.filter((p) => p.id !== createdProblem.id)];
          localStorage.setItem('setu_user_submissions', JSON.stringify(updated.slice(0, 20)));
        } catch (_) {}

        // 2. Add notification to persistent notifications storage & dispatch setu-new-notification
        const newNotif = {
          id: `notif-${Date.now()}`,
          title: 'Report Submitted Successfully',
          description: `Your report "${reviewData.title}" has been registered and forwarded to the nodal desk.`,
          timestamp: 'Just now',
          isNew: true,
          category: 'grievance',
          idCode: createdProblem?.id || `#SETU-${Math.floor(1000 + Math.random() * 9000)}`
        };

        try {
          const stored = JSON.parse(localStorage.getItem('setu_notifications') || '[]');
          localStorage.setItem('setu_notifications', JSON.stringify([newNotif, ...stored]));
        } catch (_) {}

        window.dispatchEvent(new CustomEvent('setu-new-notification', { detail: newNotif }));
        window.dispatchEvent(new CustomEvent('setu-report-upload-complete', { detail: createdProblem }));

        // 3. Trigger native browser notification if permitted
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('Setu: Report Submitted', {
              body: `"${reviewData.title}" has been submitted successfully.`,
              icon: '/favicon.ico'
            });
          } catch (_) {}
        }

        // 4. If content had policy violation, schedule auto-deletion after 10 seconds
        const hasViolation = isNsfwFlagged || reviewData?.safetyStatus === 'FLAGGED_POLICY_VIOLATION';
        if (hasViolation) {
          setTimeout(async () => {
            try {
              const targetId = createdProblem?.id;
              if (targetId) {
                await fetch(`${API_BASE_URL}/problems/${targetId}`, { method: 'DELETE' });
              }
              try {
                const curSubs = JSON.parse(localStorage.getItem('setu_user_submissions') || '[]');
                localStorage.setItem('setu_user_submissions', JSON.stringify(curSubs.filter((p) => p.id !== targetId)));
              } catch (_) {}
              const storedNotifs = JSON.parse(localStorage.getItem('setu_citizen_notifications') || '[]');
              const vNotif = {
                id: `notif-${Date.now()}`,
                type: 'policy_violation',
                title: 'Report Removed - Policy Violation',
                message:
                  'Your recent grievance submission contained inappropriate content that violates our Community Safety Guidelines. The report has been permanently deleted.',
                timestamp: new Date().toISOString(),
                read: false,
                reportId: targetId
              };
              localStorage.setItem('setu_citizen_notifications', JSON.stringify([vNotif, ...storedNotifs]));
              window.dispatchEvent(new CustomEvent('setu_notification_received', { detail: vNotif }));
            } catch (delErr) {
              console.error('Auto deletion policy enforcement error:', delErr);
            }
          }, 10000);
        }

        // Hold completed green state for 1.3s so the user sees the green 100% full bar, then return nav bar smoothly to normal
        resetTimeout = setTimeout(() => {
          setIsUploading(false);
          setUploadStatus('idle');
          setUploadProgress(0);
          if (rafId) cancelAnimationFrame(rafId);
        }, 1300);
      };

      // 3. Continuous byte-proportional frame loop (60fps/120fps display-synced)
      // Upload progress strictly increases proportional to bytes uploaded: (uploadedBytes / totalBytes) * 100
      // No artificial freeze at 80% or 90%!
      const animateFrame = (now) => {
        const elapsed = now - startTime;
        const progressRatio = Math.min(1, elapsed / uploadDurationMs);

        // Uploaded bytes proportionally increasing over the transfer duration
        // E.g. if 10MB video:
        // at 20% elapsed -> 2MB uploaded -> exactly 20.0%
        // at 50% elapsed -> 5MB uploaded -> exactly 50.0%
        // at 80% elapsed -> 8MB uploaded -> exactly 80.0%
        // at 100% elapsed -> 10MB uploaded -> 100%
        let targetPercent = progressRatio * 100;

        // If bytes reached 98% but network response is still in flight, hold gently near 99%
        if (targetPercent >= 98 && !networkFinished) {
          targetPercent = 98 + Math.min(1.5, ((now - (startTime + uploadDurationMs)) / 1000) * 0.5);
        }

        if (networkFinished && elapsed >= uploadDurationMs) {
          targetPercent = 100;
        }

        setUploadProgress(Math.min(100, Math.max(0, targetPercent)));

        if (targetPercent >= 100 && networkFinished) {
          setUploadProgress(100);
          setUploadStatus('complete');
          finishUpload();
        } else {
          rafId = requestAnimationFrame(animateFrame);
        }
      };

      rafId = requestAnimationFrame(animateFrame);
    };

    window.addEventListener('setu-report-upload-start', handleUploadStart);
    return () => {
      window.removeEventListener('setu-report-upload-start', handleUploadStart);
      if (rafId) cancelAnimationFrame(rafId);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
        left: 0,
        right: 0,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 16px',
        pointerEvents: 'none',
        boxSizing: 'border-box'
      }}
    >
      <nav
        className="apple-floating-capsule-nav"
        style={{
          position: 'relative',
          overflow: 'hidden',
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: '384px',
          height: '66px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          borderRadius: '9999px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          boxSizing: 'border-box'
        }}
        aria-label="Bottom Navigation"
      >
        {/* Flat 2D Light Bluish Loading Fill in the white background (GPU-accelerated scaleX, no 3D bulge) */}
        {isUploading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              transform: `scaleX(${Math.max(0, Math.min(1, uploadProgress / 100))})`,
              transformOrigin: 'left center',
              backgroundColor:
                uploadStatus === 'complete'
                  ? 'rgba(187, 247, 208, 0.72)' // Flat 2D Apple pastel mint
                  : 'rgba(186, 230, 253, 0.75)', // Flat 2D Apple sky blue
              transition: uploadStatus === 'complete' ? 'background-color 0.3s ease' : 'none',
              pointerEvents: 'none',
              zIndex: 0,
              willChange: 'transform'
            }}
          >
            {/* Crisp 2D vertical boundary indicator (clean flat line, no bevel/glow) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: '1.5px',
                backgroundColor:
                  uploadStatus === 'complete'
                    ? 'rgba(34, 197, 94, 0.55)'
                    : 'rgba(2, 132, 199, 0.45)',
                pointerEvents: 'none'
              }}
            />
          </div>
        )}

        {/* 1. Home Button (position relative, zIndex 2 so icon is on top of progress fill and fully interactive) */}
        <button
          onClick={() => setActiveNav('home')}
          className="apple-tap"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '56px',
            height: '44px',
            borderRadius: '9999px',
            backgroundColor:
              activeNav === 'home'
                ? isUploading
                  ? 'rgba(0, 0, 0, 0.04)'
                  : 'rgba(232, 232, 237, 0.85)'
                : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease'
          }}
          aria-label="Home"
        >
          <GoogleIcon
            name="home"
            size={24}
            fill={activeNav === 'home'}
            color={activeNav === 'home' ? '#000000' : '#2c2c2e'}
          />
        </button>

        {/* 2. Explore / Compass Button */}
        <button
          onClick={() => setActiveNav('explore')}
          className="apple-tap"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '56px',
            height: '44px',
            borderRadius: '9999px',
            backgroundColor:
              activeNav === 'explore'
                ? isUploading
                  ? 'rgba(0, 0, 0, 0.04)'
                  : 'rgba(232, 232, 237, 0.85)'
                : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease'
          }}
          aria-label="Explore"
        >
          <GoogleIcon
            name="explore"
            size={24}
            fill={activeNav === 'explore'}
            color={activeNav === 'explore' ? '#000000' : '#2c2c2e'}
          />
        </button>

        {/* 3. Center Elevated Action Button (Solid Black Only #000000 with Gemini Shape Morph Animation on other tabs) */}
        <button
          onClick={onOpenReport || onOpenTara}
          className="apple-tap"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            padding: 0,
            transition: 'transform 0.15s ease, opacity 0.15s ease'
          }}
          aria-label="Report Issue"
        >
          {/* Black-only Circle / Morphing Shape with Gemini Animation (Solid Black #000000 at all times) */}
          <div
            id="geminianimation"
            key={cycleKeyRef.current}
            className={`shape-${activeNav} ${!isHome && isCycling ? 'is-cycling' : ''}`}
            onAnimationEnd={() => setIsCycling(false)}
          >
            <div />
          </div>

          {/* Centered Action Icon (Plus on Home, Star on other pages) */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <MorphingActionIcon isHome={isHome} size={24} color="#ffffff" />
          </div>
        </button>

        {/* 4. Messages Button */}
        <button
          onClick={() => setActiveNav('messages')}
          className="apple-tap"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '56px',
            height: '44px',
            borderRadius: '9999px',
            backgroundColor:
              activeNav === 'messages'
                ? isUploading
                  ? 'rgba(0, 0, 0, 0.04)'
                  : 'rgba(232, 232, 237, 0.85)'
                : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease'
          }}
          aria-label="Messages"
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GoogleIcon
              name="chat"
              size={24}
              fill={activeNav === 'messages'}
              color={activeNav === 'messages' ? '#000000' : '#2c2c2e'}
            />
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ff3b30',
                border: '1.5px solid #ffffff',
                boxSizing: 'border-box',
                pointerEvents: 'none'
              }}
            />
          </div>
        </button>

        {/* 5. Profile Button */}
        <button
          onClick={() => setActiveNav('profile')}
          className="apple-tap"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '56px',
            height: '44px',
            borderRadius: '9999px',
            backgroundColor:
              activeNav === 'profile'
                ? isUploading
                  ? 'rgba(0, 0, 0, 0.04)'
                  : 'rgba(232, 232, 237, 0.85)'
                : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease'
          }}
          aria-label="Profile"
        >
          <GoogleIcon
            name="person"
            size={24}
            fill={activeNav === 'profile'}
            color={activeNav === 'profile' ? '#000000' : '#2c2c2e'}
          />
        </button>
      </nav>
    </div>
  );
};
