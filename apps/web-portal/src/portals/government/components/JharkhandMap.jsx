import React, { useState } from 'react';
import jharkhandData from '../data/jharkhand_real_districts.json';

const { viewBox, districts: REAL_DISTRICTS } = jharkhandData;

export const JharkhandMap = ({
  selectedDistrict,
  zoomAction,
  onSelectDistrict,
  maxHeight = '260px',
  minHeight = '260px',
  containerStyle = {}
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);

  // Handle external zoom actions (+ / -)
  React.useEffect(() => {
    if (!zoomAction) return;
    if (zoomAction === 'in') {
      setZoomScale((z) => Math.min(z + 0.2, 2.0));
    } else if (zoomAction === 'out') {
      setZoomScale((z) => Math.max(z - 0.2, 0.75));
    } else if (zoomAction === 'reset') {
      setZoomScale(1);
    }
  }, [zoomAction]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight,
        backgroundColor: '#fafafa',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
        ...containerStyle
      }}
    >
      {/* 100% Real Official Geographical Map of Jharkhand (All 24 Districts) */}
      <svg
        viewBox={viewBox || '0 0 640 440'}
        style={{
          width: '100%',
          height: '100%',
          maxHeight,
          transform: `scale(${zoomScale})`,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))'
        }}
      >
        <defs>
          <filter id="jharkhand-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Real District Boundaries with Pitch Black (#000000) Borders & Distinct Colors */}
        <g id="jharkhand-real-districts">
          {REAL_DISTRICTS.map((dist) => {
            const isHovered = hoveredDistrict?.id === dist.id;
            const isSelected =
              selectedDistrict === 'All 24 Districts'
                ? false
                : selectedDistrict.toLowerCase().includes(dist.id) ||
                  selectedDistrict.toLowerCase().includes(dist.name.toLowerCase());

            return (
              <path
                key={dist.id}
                d={dist.path}
                fill={dist.fill}
                stroke="#000000" /* Pitch-black boundary line */
                strokeWidth={isHovered || isSelected ? '2.5' : '1.8'}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                  cursor: 'pointer',
                  opacity: hoveredDistrict && !isHovered ? 0.85 : 1,
                  filter: isHovered ? 'brightness(1.06)' : 'none',
                  transition: 'opacity 0.15s ease, filter 0.15s ease, stroke-width 0.15s ease'
                }}
                onMouseEnter={() => setHoveredDistrict(dist)}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => {
                  if (onSelectDistrict) onSelectDistrict(dist.name);
                }}
              />
            );
          })}
        </g>

        {/* Real District Name Labels */}
        <g id="district-labels" style={{ pointerEvents: 'none' }}>
          {REAL_DISTRICTS.map((dist) => {
            const isHighlighted = dist.name === 'Ranchi' || dist.name === 'Dhanbad' || dist.name.includes('Singhbhum');
            return (
              <text
                key={`label-${dist.id}`}
                x={dist.center[0]}
                y={dist.center[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: isHighlighted ? '9.5px' : '7.5px',
                  fontWeight: isHighlighted ? '800' : '600',
                  fill: '#000000',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.02em',
                  userSelect: 'none',
                  paintOrder: 'stroke',
                  stroke: '#ffffff',
                  strokeWidth: '2px',
                  strokeLinejoin: 'round'
                }}
              >
                {dist.name}
              </text>
            );
          })}
        </g>

      </svg>

      {/* Hover Info Tooltip */}
      {hoveredDistrict && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #111827',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: '600',
            color: '#111827',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            pointerEvents: 'none',
            zIndex: 30
          }}
        >
          {hoveredDistrict.name}: <strong>{hoveredDistrict.reports} Reports</strong>
        </div>
      )}
    </div>
  );
};
