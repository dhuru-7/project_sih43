import React from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { AadhaarOnboardingStep } from './AadhaarOnboardingStep';
import { LanguageSelectionStep } from './LanguageSelectionStep';
import { useLanguage } from '../../../context/LanguageContext';

export const MobileOnboardingView = ({
  currentStep,
  setCurrentStep,
  slides,
  selectedIntent,
  setSelectedIntent,
  intents,
  selectedRole,
  setSelectedRole,
  roles,
  onNext,
  onPrev,
  onSkip,
  onAadhaarSuccess
}) => {
  const { t, languageMeta } = useLanguage();

  // Step 0: Language Selection
  // Steps 1-3: Slideshow
  // Step 4: Intent Selection
  // Step 5: Role Selection
  // Step 6: Aadhaar Verification
  const isLanguageStep = currentStep === 0;
  const isSlideshow = currentStep >= 1 && currentStep <= 3;
  const slideIndex = isSlideshow ? currentStep - 1 : 0;
  const slide = slides[slideIndex] || slides[0];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '430px',
        height: isLanguageStep ? '100dvh' : 'auto',
        minHeight: isLanguageStep ? '100dvh' : '100vh',
        maxHeight: isLanguageStep ? '100dvh' : 'none',
        overflow: isLanguageStep ? 'hidden' : 'visible',
        margin: '0 auto',
        backgroundColor: '#FCFCFD',
        color: '#111111',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isLanguageStep ? 'flex-start' : 'space-between',
        position: 'relative',
        boxSizing: 'border-box',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.06)',
        userSelect: 'none',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Valley Sans', sans-serif"
      }}
    >
      {/* Top Navigation Bar: Clean Setu. Logo on left, Skip on right (Hidden on Language Step 0 & Aadhaar Step 6) */}
      {!isLanguageStep && currentStep !== 6 && (
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            padding: '1.25rem 1.5rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                color: '#000000',
                lineHeight: 1
              }}
            >
              Setu<span style={{ color: '#000000', fontWeight: '900' }}>.</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isSlideshow && (
              <button
                onClick={onSkip}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#8e8e93',
                  background: 'none',
                  border: 'none',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  cursor: 'pointer'
                }}
              >
                {t('skip', 'Skip')}
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Viewport Content */}
      <main
        style={{
          flex: 1,
          height: isLanguageStep ? '100%' : 'auto',
          maxHeight: isLanguageStep ? '100%' : 'none',
          overflow: isLanguageStep ? 'hidden' : 'visible',
          padding: isLanguageStep
            ? '0 1.25rem 0'
            : currentStep === 6
            ? '0.75rem 1.25rem 1.25rem'
            : '10% 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isLanguageStep || currentStep === 6 ? 'flex-start' : 'center',
          position: 'relative',
          boxSizing: 'border-box'
        }}
      >
        {isLanguageStep ? (
          /* ===================================================================
             STAGE 0: Language Selection Screen (Matching User's Screenshot)
             =================================================================== */
          <LanguageSelectionStep onContinue={onNext} isDesktop={false} />
        ) : isSlideshow ? (
          /* ===================================================================
             STAGE 1: Pure Stitch Editorial Slideshow (Steps 1, 2, 3)
             =================================================================== */
          <div
            className="apple-fade-enter"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              margin: 'auto 0'
            }}
          >
            {/* Editorial Illustration Container */}
            <div
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: '#fafafa',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.75rem'
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '18px'
                }}
              />
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: '1.625rem',
                fontWeight: '800',
                letterSpacing: '-0.025em',
                color: '#111111',
                lineHeight: 1.25,
                margin: 0
              }}
            >
              {slide.title} <br />
              <span style={{ color: '#000000' }}>{slide.highlight}</span>
            </h1>
          </div>
        ) : currentStep === 4 ? (
          /* ===================================================================
             STAGE 2: Mobile Intent Selection Screen (Step 4)
             =================================================================== */
          <div
            className="apple-fade-enter"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              margin: 'auto 0'
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  letterSpacing: '-0.025em',
                  color: '#111111',
                  lineHeight: 1.25,
                  margin: '0 0 0.5rem'
                }}
              >
                {t('intent_heading', 'What brings you to Setu?')}
              </h1>
            </div>

            {/* 4 Intent Cards with Apple Spacing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {intents.map((intent) => {
                const isSelected = selectedIntent === intent.id;
                return (
                  <div
                    key={intent.id}
                    onClick={() => setSelectedIntent(intent.id)}
                    className="apple-select-card"
                    style={{
                      padding: '0.85rem 1.15rem',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: '#ffffff',
                      boxShadow: isSelected
                        ? '0 4px 16px rgba(0, 0, 0, 0.06)'
                        : '0 1px 3px rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          minWidth: '40px',
                          borderRadius: '11px',
                          backgroundColor: isSelected ? '#000000' : '#f2f2f7',
                          color: isSelected ? '#ffffff' : '#1c1c1e',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <GoogleIcon name={intent.icon} size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#111111', lineHeight: 1.25 }}>
                          {intent.title}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#636366', fontWeight: '400', display: 'block', marginTop: '0.15rem', lineHeight: 1.3 }}>
                          {intent.subtitle}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        minWidth: '20px',
                        borderRadius: '50%',
                        border: isSelected ? '2px solid #000000' : '1.5px solid #d1d1d6',
                        backgroundColor: isSelected ? '#000000' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isSelected && (
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : currentStep === 5 ? (
          /* ===================================================================
             STAGE 3: Mobile Reporting Portal Sub-Role Selection (Step 5)
             =================================================================== */
          <div
            className="apple-fade-enter"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              margin: 'auto 0'
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  letterSpacing: '-0.025em',
                  color: '#111111',
                  lineHeight: 1.25,
                  margin: '0 0 0.5rem'
                }}
              >
                {t('role_sub', 'How will you be registering on Setu?')}
              </h1>
            </div>

            {/* Apple Role Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {roles.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <article
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className="apple-select-card"
                    style={{
                      padding: '0.95rem 1.15rem',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: '#ffffff',
                      boxShadow: isSelected
                        ? '0 4px 16px rgba(0, 0, 0, 0.06)'
                        : '0 1px 3px rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          minWidth: '40px',
                          borderRadius: '11px',
                          backgroundColor: isSelected ? '#000000' : '#f2f2f7',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? '#ffffff' : '#1c1c1e',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <GoogleIcon name={role.icon} size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#111111', lineHeight: 1.25 }}>
                          {role.title}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#636366', fontWeight: '400', display: 'block', marginTop: '0.15rem', lineHeight: 1.3 }}>
                          {role.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Radio Indicator */}
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        minWidth: '20px',
                        borderRadius: '50%',
                        border: isSelected ? '2px solid #000000' : '1.5px solid #d1d1d6',
                        backgroundColor: isSelected ? '#000000' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#ffffff'
                          }}
                        />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          /* ===================================================================
             STAGE 4: Mobile Aadhaar Verification & OTP Screen (Step 6)
             =================================================================== */
          <AadhaarOnboardingStep
            isMobile={true}
            onPrev={onPrev}
            onSuccess={onAadhaarSuccess}
          />
        )}
      </main>

      {/* Bottom Interactive Safe Area & Navigation Controls (Only for Steps 1-5) */}
      {!isLanguageStep && currentStep < 6 && (
        <footer
          style={{
            padding: '1rem 1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          {/* 3 Animated Apple Pill Indicators - ONLY during Slideshow (Steps 1, 2, 3) */}
          {isSlideshow && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              {[1, 2, 3].map((stepNum) => (
                <button
                  key={stepNum}
                  onClick={() => setCurrentStep(stepNum)}
                  style={{
                    height: '8px',
                    width: stepNum === currentStep ? '32px' : '8px',
                    backgroundColor: stepNum === currentStep ? '#000000' : '#d1d5db',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    padding: 0
                  }}
                  aria-label={`Slide ${stepNum}`}
                />
              ))}
            </div>
          )}

          {/* Action Buttons Row with Smooth Apple Squeeze Animation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: currentStep >= 4 ? '0.75rem' : '0px',
              transition: 'gap 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Back Button on Left: Smoothly Expands and Slides in */}
            <button
              onClick={onPrev}
              className="apple-btn-secondary"
              aria-hidden={currentStep < 2}
              tabIndex={currentStep < 2 ? -1 : 0}
              style={{
                height: '52px',
                borderRadius: '16px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: currentStep >= 2 ? '100px' : '0px',
                minWidth: currentStep >= 2 ? '100px' : '0px',
                maxWidth: currentStep >= 2 ? '100px' : '0px',
                opacity: currentStep >= 2 ? 1 : 0,
                padding: currentStep >= 2 ? '0 1rem' : '0px',
                border: currentStep >= 2 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
                pointerEvents: currentStep >= 2 ? 'auto' : 'none',
                transform: currentStep >= 2 ? 'translateX(0) scale(1)' : 'translateX(-16px) scale(0.9)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                boxSizing: 'border-box'
              }}
            >
              {t('back', 'Back')}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onNext}
              className="apple-btn-primary"
              style={{
                flex: 1,
                height: '52px',
                borderRadius: '16px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                boxSizing: 'border-box'
              }}
            >
              <span>
                {currentStep === 3
                  ? t('next', 'Get Started')
                  : t('next', 'Continue')}
              </span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};
