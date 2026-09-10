import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

export const LanguageSelectionStep = ({ onContinue, isDesktop = false }) => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();

  return (
    <div
      className="apple-fade-enter"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        position: 'relative',
        paddingTop: isDesktop ? '1.5rem' : '1.25rem',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Centered Title */}
      <div style={{ textAlign: 'center', marginBottom: isDesktop ? '0.875rem' : '0.85rem', flexShrink: 0 }}>
        <h1
          style={{
            fontSize: isDesktop ? '1.875rem' : '1.5rem',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            color: '#111111',
            margin: 0,
            lineHeight: 1.2
          }}
        >
          {t('select_language_title', 'Select a language')}
        </h1>
      </div>

      {/* Grid of Circular Language Cards - 8 columns on desktop, 3 columns on mobile */}
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: isDesktop ? 'hidden' : 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: isDesktop ? '0.25rem 0.75rem 0.5rem' : '0.25rem 0.35rem 6.5rem',
          display: 'grid',
          gridTemplateColumns: isDesktop ? 'repeat(8, 1fr)' : 'repeat(3, 1fr)',
          columnGap: isDesktop ? '0.75rem' : '0.75rem',
          rowGap: isDesktop ? '0.75rem' : '1.25rem',
          alignContent: isDesktop ? 'center' : 'start',
          justifyItems: 'center',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {languages.map((lang, idx) => {
          const isSelected = currentLanguage === lang.id;
          // Center the 6 items of Row 3 under the 8 columns on desktop
          const isRow3FirstItem = isDesktop && idx === 16;

          return (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className="apple-language-circle-btn"
              style={{
                gridColumnStart: isRow3FirstItem ? 2 : 'auto',
                background: 'none',
                border: 'none',
                padding: '0.15rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                outline: 'none',
                transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                userSelect: 'none',
                position: 'relative'
              }}
            >
              {/* Outer Circular Ring matching screenshot style */}
              <div
                style={{
                  width: isDesktop ? '66px' : '74px',
                  height: isDesktop ? '66px' : '74px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: isSelected
                    ? '3px solid #000000'
                    : `2.2px solid ${lang.ringColor}`,
                  boxShadow: isSelected
                    ? '0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 3.5px rgba(0, 0, 0, 0.08)'
                    : '0 2px 6px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: isDesktop ? '0.35rem' : '0.55rem',
                  position: 'relative',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Large Script Character / Glyph */}
                <span
                  style={{
                    fontSize: isDesktop ? '1.5rem' : '1.65rem',
                    fontWeight: '700',
                    color: '#0A0A0A',
                    lineHeight: 1,
                    fontFamily:
                      lang.script === 'Latin'
                        ? "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif"
                        : "system-ui, -apple-system, 'Noto Sans', sans-serif"
                  }}
                >
                  {lang.glyph}
                </span>
              </div>

              {/* Native Language Name Below Circle */}
              <span
                style={{
                  fontSize: isDesktop ? '0.8125rem' : '0.8125rem',
                  fontWeight: isSelected ? '700' : '600',
                  color: isSelected ? '#000000' : '#2c2c2e',
                  lineHeight: 1.2,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {lang.nativeName}
              </span>

              {/* Sub-label for English name if different */}
              {lang.id !== 'en' && (
                <span
                  style={{
                    fontSize: isDesktop ? '0.6875rem' : '0.6875rem',
                    color: '#8E8E93',
                    marginTop: '1px',
                    fontWeight: '400',
                    lineHeight: 1.2
                  }}
                >
                  {lang.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Apple Action Pill (Continue) with Fade Boundary */}
      <div
        style={{
          position: isDesktop ? 'relative' : 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexShrink: 0,
          padding: isDesktop ? '0.75rem 0 1.25rem' : '3.5rem 1.25rem 1.25rem',
          background: isDesktop
            ? 'transparent'
            : 'linear-gradient(to top, #FCFCFD 55%, rgba(252, 252, 253, 0.92) 75%, rgba(252, 252, 253, 0) 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 20,
          pointerEvents: isDesktop ? 'auto' : 'none',
          border: 'none',
          borderTop: 'none'
        }}
      >
        <button
          onClick={onContinue}
          className="apple-primary-btn"
          style={{
            width: isDesktop ? 'auto' : '100%',
            maxWidth: isDesktop ? 'none' : '380px',
            minWidth: isDesktop ? '320px' : 'auto',
            padding: '0.875rem 2rem',
            borderRadius: '9999px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: 'none',
            outline: 'none',
            fontSize: '0.9375rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.16)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'auto'
          }}
        >
          <span>{t('continue', 'Continue')}</span>
        </button>
      </div>
    </div>
  );
};
