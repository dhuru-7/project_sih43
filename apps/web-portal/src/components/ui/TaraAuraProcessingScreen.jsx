import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Apple Intelligence Style Glowing Aura Overlay
 * - Translucent overlay letting the background screen remain visible
 * - Luminous fluid aura wave covering the bottom ~20% of the screen
 * - Shimmering glowing chromatic corner curves & perimeter inset glow
 * - Minimal, distraction-free "Hold on..." text (no icons, no extra widgets)
 */
export const TaraAuraProcessingScreen = () => {
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999999,
        backgroundColor: 'rgba(0, 0, 0, 0.42)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        pointerEvents: 'all',
        // Shimmering Apple Intelligence perimeter corner glow
        boxShadow:
          'inset 0 0 100px rgba(99, 102, 241, 0.45), inset 0 0 60px rgba(244, 114, 182, 0.35), inset 0 0 30px rgba(56, 189, 248, 0.3)'
      }}
    >
      {/* Top Left Corner Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          left: '-60px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.6) 0%, rgba(56, 189, 248, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Right Corner Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.55) 0%, rgba(192, 132, 252, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      {/* Bottom 20% Chromatic Fluid Aura Wave */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15px',
          left: '-10%',
          width: '120%',
          height: '24vh',
          minHeight: '160px',
          maxHeight: '260px',
          background: `conic-gradient(
            from 180deg at 50% 100%,
            #38bdf8 0deg,
            #818cf8 60deg,
            #c084fc 120deg,
            #f472b6 180deg,
            #34d399 240deg,
            #38bdf8 360deg
          )`,
          borderRadius: '50% 50% 0 0',
          filter: 'blur(55px)',
          opacity: 0.82,
          animation: 'taraAuraShift 8s ease-in-out infinite alternate',
          pointerEvents: 'none'
        }}
      />

      {/* Bottom Glow Shimmer Horizon */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '18vh',
          background: 'linear-gradient(to top, rgba(99, 102, 241, 0.4) 0%, rgba(244, 114, 182, 0.2) 50%, transparent 100%)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />

      {/* Minimal "Hold on..." Message */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          animation: 'applePop 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <span
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.375rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            color: '#ffffff',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 255, 255, 0.35)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif'
          }}
        >
          Hold on
        </span>
      </div>
    </div>,
    document.body
  );
};
