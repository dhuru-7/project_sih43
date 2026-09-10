import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Apple Intelligence Style Glowing Aura Overlay
 * - Translucent overlay letting the background screen remain visible (low blur)
 * - Zero center spinning artifacts
 * - Shimmering soft chromatic perimeter & edge glow
 * - Minimal, distraction-free "Hold on" text
 * - Supports inline mode to constrain to parent card container
 */
export const TaraAuraProcessingScreen = ({ inline = false }) => {
  const content = (
    <div
      style={{
        position: inline ? 'absolute' : 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: inline ? 50 : 99999999,
        borderRadius: inline ? 'inherit' : 0,
        backgroundColor: 'rgba(0, 0, 0, 0.24)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        pointerEvents: 'all',
        boxShadow:
          'inset 0 0 60px rgba(99, 102, 241, 0.3), inset 0 0 30px rgba(244, 114, 182, 0.25), inset 0 0 15px rgba(56, 189, 248, 0.2)'
      }}
    >
      {/* Top Left Corner Soft Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          left: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.45) 0%, rgba(56, 189, 248, 0) 70%)',
          filter: 'blur(25px)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Right Corner Soft Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.4) 0%, rgba(192, 132, 252, 0) 70%)',
          filter: 'blur(25px)',
          pointerEvents: 'none'
        }}
      />

      {/* Bottom Gentle Horizon Chromatic Aura (No Center Spinning) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10px',
          left: 0,
          right: 0,
          height: '100px',
          background:
            'linear-gradient(90deg, rgba(56, 189, 248, 0.35) 0%, rgba(129, 140, 248, 0.45) 35%, rgba(192, 132, 252, 0.4) 70%, rgba(244, 114, 182, 0.35) 100%)',
          filter: 'blur(25px)',
          borderRadius: '40% 40% 0 0',
          animation: 'taraAuraShift 4s ease-in-out infinite alternate',
          pointerEvents: 'none'
        }}
      />

      {/* Minimal Apple Intelligence "Hold on" Message */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          animation: 'appleSlideUpDock 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <span
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.125rem)',
            fontWeight: '800',
            letterSpacing: '-0.025em',
            color: '#ffffff',
            textShadow: '0 2px 16px rgba(0, 0, 0, 0.5), 0 0 24px rgba(255, 255, 255, 0.25)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif'
          }}
        >
          Hold on
        </span>
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return typeof document !== 'undefined'
    ? ReactDOM.createPortal(content, document.body)
    : content;
};
