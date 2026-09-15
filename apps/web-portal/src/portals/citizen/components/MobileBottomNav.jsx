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
  // Implements Apple Design WWDC fluid display-synced motion using requestAnimationFrame
  useEffect(() => {
    let rafId = null;
    let resetTimeout = null;

    const handleUploadStart = async (e) => {
      const detail = e.detail || {};
      const { reviewData, tempProblem, isNsfwFlagged } = detail;
      if (!reviewData) return;

      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(0);

      const startTime = performance.now();
      let currentVal = 0;
      let targetVal = 20;

      // Continuous 60fps/120fps display-synced frame loop using Apple deceleration easing
      const animateFrame = (time) => {
        const elapsed = (time - startTime) / 1000; // seconds

        // Dynamic targets simulating fluid upload phases:
        // Immediate response: 0s-0.35s -> reaches ~32%
        // Network stream: 0.35s-1.1s -> reaches ~68%
        // Settle near top: 1.1s-1.9s -> reaches ~88-92%
        if (targetVal < 99) {
          if (elapsed < 0.35) {
            targetVal = 8 + (elapsed / 0.35) * 24;
          } else if (elapsed < 1.1) {
            targetVal = 32 + ((elapsed - 0.35) / 0.75) * 36;
          } else if (elapsed < 1.9) {
            targetVal = 68 + ((elapsed - 1.1) / 0.8) * 22;
          } else {
            targetVal = 90 + Math.min(4, (elapsed - 1.9) * 1.5);
          }
        }

        // Apple critically damped exponential smoothing: advances continuously with zero stutter
        const diff = targetVal - currentVal;
        currentVal += diff * 0.12;

        setUploadProgress(Math.min(100, Math.max(0, currentVal)));

        if (targetVal >= 100 && currentVal >= 99.4) {
          setUploadProgress(100);
          setUploadStatus('complete');
        } else {
          rafId = requestAnimationFrame(animateFrame);
        }
      };

      rafId = requestAnimationFrame(animateFrame);

      try {
        let createdProblem = tempProblem;
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
        }

        // Ensure smooth Apple pacing so user perceives continuous progression (~1.5s total)
        const elapsed = performance.now() - startTime;
        if (elapsed < 1400) {
          await new Promise((r) => setTimeout(r, 1400 - elapsed));
        }

        // Accelerate smoothly to 100% on completion
        targetVal = 100;
        await new Promise((r) => setTimeout(r, 220));

        // 1. Save locally to setu_user_submissions
        try {
          const existing = JSON.parse(localStorage.getItem('setu_user_submissions') || '[]');
          const updated = [createdProblem, ...existing.filter((p) => p.id !== createdProblem.id)];
          localStorage.setItem('setu_user_submissions', JSON.stringify(updated));
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

        // Hold completed state for 1.4s then return nav bar smoothly to normal
        resetTimeout = setTimeout(() => {
          setIsUploading(false);
          setUploadStatus('idle');
          setUploadProgress(0);
          if (rafId) cancelAnimationFrame(rafId);
        }, 1400);

      } catch (err) {
        console.error('Error during upload flow:', err);
        targetVal = 100;
        resetTimeout = setTimeout(() => {
          setIsUploading(false);
          setUploadStatus('idle');
          setUploadProgress(0);
          if (rafId) cancelAnimationFrame(rafId);
        }, 1400);
      }
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
          onClick={isHome ? (onOpenReport || onOpenTara) : (onOpenTara || onOpenReport)}
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
          aria-label={isHome ? "Report Issue" : "Tara AI Copilot"}
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
