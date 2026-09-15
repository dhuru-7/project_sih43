import React from 'react';

/**
 * MorphingActionIcon
 * Smooth, clean spin & morph transition (non-bouncy):
 * - On 'home': displays the Plus (+) icon with 0deg rotation
 * - On other tabs ('explore', 'messages', 'profile'): smoothly spins 180deg and morphs into the Star icon
 * - On returning to 'home': smoothly spins back to 0deg and morphs back into the Plus icon
 */
export const MorphingActionIcon = ({
  isHome = true,
  size = 24,
  color = '#ffffff',
  className = '',
  style = {}
}) => {
  const transitionTiming = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease';

  return (
    <div
      className={`morphing-action-icon-wrap ${className}`}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isHome ? 'rotate(0deg)' : 'rotate(180deg)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
        flexShrink: 0,
        ...style
      }}
    >
      {/* 1. Plus Icon (+) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isHome ? 1 : 0,
          transform: isHome ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-90deg)',
          transition: transitionTiming,
          pointerEvents: 'none'
        }}
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>

      {/* 2. User-Provided Star Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isHome ? 0 : 1,
          transform: isHome ? 'scale(0.5) rotate(90deg)' : 'scale(1) rotate(0deg)',
          transition: transitionTiming,
          pointerEvents: 'none'
        }}
      >
        <path
          d="M 12 2 L 14.5 9.5 L 22 12 L 14.5 14.5 L 12 22 L 9.5 14.5 L 2 12 L 9.5 9.5 Z"
          stroke={color}
          strokeWidth="0.4"
          strokeLinejoin="miter"
          strokeMiterlimit="4"
        />
      </svg>
    </div>
  );
};
