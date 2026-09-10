import React, { useState } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { AadhaarOnboardingStep } from './AadhaarOnboardingStep';
import { LanguageSelectionStep } from './LanguageSelectionStep';
import { useLanguage } from '../../../context/LanguageContext';

export const DesktopOnboardingView = ({
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
        height: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#f9f9f9',
        transition: 'background-color 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        color: '#1a1c1c',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif"
      }}
    >
      {/* Top Header: Clean Setu. Logo on left, Minimal Skip on right (Hidden on Language Step 0 & Aadhaar Step 6) */}
      {!isLanguageStep && currentStep !== 6 && (
        <header
          style={{
            width: '100%',
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '1.25rem 2.5rem 0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 20,
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '1.625rem',
                fontWeight: '800',
                letterSpacing: '-0.035em',
                color: '#000000',
                lineHeight: 1
              }}
            >
              Setu<span style={{ color: '#000000', fontWeight: '900' }}>.</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {isSlideshow && (
              <button
                onClick={onSkip}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#8e8e93',
                  background: 'none',
                  border: 'none',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#111111')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8e8e93')}
              >
                {t('skip', 'Skip')}
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Apple Presentation Canvas - No card wrapper on language screen */}
      {isLanguageStep ? (
        <main
          style={{
            flex: 1,
            width: '100%',
            maxWidth: '1080px',
            margin: '0 auto',
            height: '100vh',
            maxHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          <LanguageSelectionStep onContinue={onNext} isDesktop={true} />
        </main>
      ) : (
        <main
          style={{
            flex: 1,
            width: '100%',
            maxWidth: currentStep === 6 ? '480px' : '1120px',
            margin: '0 auto',
            padding: currentStep === 6 ? '1.5rem 1.5rem' : '0.5rem 2rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '1.75rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
              overflow: currentStep === 6 ? 'visible' : 'hidden',
              display: currentStep === 6 ? 'block' : 'grid',
              gridTemplateColumns: isSlideshow ? '1.05fr 1fr' : '1fr',
              maxHeight: currentStep === 6 ? 'none' : 'calc(100vh - 90px)',
              alignItems: 'center',
              padding: currentStep === 6 ? '1.5rem 1.75rem 1.75rem' : '0'
            }}
          >
            {isSlideshow ? (
            /* ===================================================================
               STAGE 1: Slideshow Stage: Dual-pane layout
               =================================================================== */
            <>
              {/* Left Pane: Artwork in generous soft frame */}
              <div
                style={{
                  height: '100%',
                  minHeight: '440px',
                  maxHeight: '520px',
                  backgroundColor: '#f6f7f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2.5rem',
                  borderRight: '1px solid rgba(0, 0, 0, 0.05)',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '430px',
                    aspectRatio: '4 / 3',
                    borderRadius: '1.25rem',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    key={`slide-img-${slideIndex}`}
                    src={slide.image}
                    alt={slide.title}
                    className="apple-fade-enter"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {/* Right Pane: Large bold headline and Apple controls */}
              <div
                style={{
                  height: '100%',
                  padding: '3rem 2.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* Headline Section */}
                <div key={`slide-text-${slideIndex}`} className="apple-fade-enter" style={{ margin: 'auto 0' }}>
                  <h1
                    style={{
                      fontSize: '2.25rem',
                      fontWeight: '800',
                      letterSpacing: '-0.035em',
                      color: '#111111',
                      lineHeight: 1.22,
                      margin: 0
                    }}
                  >
                    {slide.title} <br />
                    <span style={{ color: '#000000' }}>{slide.highlight}</span>
                  </h1>
                </div>

                {/* Bottom Controls Bar: 3 Dots ONLY during Slideshow & Button with NO Arrow */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {/* 3 Dots: Active is 32px pill, inactives are 8px dots */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

                  {/* Actions: Back & Continue/Get Started */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={onPrev}
                      className="apple-btn-secondary"
                    >
                      {t('back', 'Back')}
                    </button>

                    <button
                      onClick={onNext}
                      className="apple-btn-primary"
                    >
                      {currentStep === 3 ? t('next', 'Get Started') : t('next', 'Continue')}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : currentStep === 4 ? (
            /* ===================================================================
               STAGE 2: Intent Selection Screen (Step 4)
               =================================================================== */
            <div
              className="apple-fade-enter"
              style={{
                padding: '2.25rem 3rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                maxWidth: '820px',
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: '1.875rem',
                    fontWeight: '800',
                    letterSpacing: '-0.03em',
                    color: '#111111',
                    lineHeight: 1.2,
                    margin: '0 0 0.5rem'
                  }}
                >
                  {t('intent_heading', 'What brings you to Setu?')}
                </h1>
              </div>

              {/* 4 Intent Bento Cards in compact 2x2 grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.875rem'
                }}
              >
                {intents.map((intent) => {
                  const isSelected = selectedIntent === intent.id;
                  return (
                    <div
                      key={intent.id}
                      onClick={() => setSelectedIntent(intent.id)}
                      className="apple-select-card"
                      style={{
                        padding: '1.15rem 1.25rem',
                        borderRadius: '16px',
                        border: isSelected ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.08)',
                        backgroundColor: '#ffffff',
                        boxShadow: isSelected
                          ? '0 4px 18px rgba(0, 0, 0, 0.06)'
                          : '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '110px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '11px',
                            backgroundColor: isSelected ? '#000000' : '#f2f2f7',
                            color: isSelected ? '#ffffff' : '#1c1c1e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.65rem',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        >
                          <GoogleIcon name={intent.icon} size={20} />
                        </div>

                        {/* Apple Radio Indicator */}
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
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

                      <div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#111111', lineHeight: 1.3 }}>
                          {intent.title}
                        </div>
                        <p style={{ fontSize: '0.78125rem', color: '#636366', margin: '0.2rem 0 0', lineHeight: 1.35 }}>
                          {intent.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                }}
              >
                <button
                  onClick={onPrev}
                  className="apple-btn-secondary"
                >
                  {t('back', 'Back')}
                </button>

                <button
                  onClick={onNext}
                  className="apple-btn-primary"
                >
                  {t('next', 'Continue')}
                </button>
              </div>
            </div>
          ) : currentStep === 5 ? (
            /* ===================================================================
               STAGE 3: Reporting Portal Sub-Role Selection (Step 5)
               =================================================================== */
            <div
              className="apple-fade-enter"
              style={{
                padding: '2.5rem 3rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxWidth: '620px',
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: '1.875rem',
                    fontWeight: '800',
                    letterSpacing: '-0.03em',
                    color: '#111111',
                    lineHeight: 1.2,
                    margin: '0 0 0.5rem'
                  }}
                >
                  {t('role_sub', 'How will you be registering on Setu?')}
                </h1>
              </div>

              {/* 2 Apple Sub-Roles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {roles.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <article
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className="apple-select-card"
                      style={{
                        padding: '1.2rem 1.35rem',
                        borderRadius: '16px',
                        border: isSelected ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.08)',
                        backgroundColor: '#ffffff',
                        boxShadow: isSelected
                          ? '0 4px 18px rgba(0, 0, 0, 0.06)'
                          : '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            minWidth: '44px',
                            borderRadius: '12px',
                            backgroundColor: isSelected ? '#000000' : '#f2f2f7',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isSelected ? '#ffffff' : '#1c1c1e',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        >
                          <GoogleIcon name={role.icon} size={22} />
                        </div>
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: '700', color: '#111111' }}>
                            {role.title}
                          </div>
                          <span style={{ fontSize: '0.8125rem', color: '#636366', fontWeight: '500' }}>
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
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                }}
              >
                <button
                  onClick={onPrev}
                  className="apple-btn-secondary"
                >
                  {t('back', 'Back')}
                </button>

                <button
                  onClick={onNext}
                  className="apple-btn-primary"
                >
                  {t('next', 'Continue')}
                </button>
              </div>
            </div>
          ) : (
            /* ===================================================================
               STAGE 4: Desktop Aadhaar Verification & OTP Screen (Step 6)
               =================================================================== */
            <AadhaarOnboardingStep
              isMobile={false}
              onPrev={onPrev}
              onSuccess={onAadhaarSuccess}
            />
          )}
        </div>
      </main>
      )}
    </div>
  );
};
