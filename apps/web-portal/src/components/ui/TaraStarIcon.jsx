import React from 'react';

export const TaraStarIcon = ({ size = 24, color = '#ffffff', style = {}, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    className={className}
    aria-hidden="true"
  >
    <path
      d="M 12 2 L 14.5 9.5 L 22 12 L 14.5 14.5 L 12 22 L 9.5 14.5 L 2 12 L 9.5 9.5 Z"
      stroke={color}
      strokeWidth="0.4"
      strokeLinejoin="miter"
      strokeMiterlimit="4"
    />
  </svg>
);
