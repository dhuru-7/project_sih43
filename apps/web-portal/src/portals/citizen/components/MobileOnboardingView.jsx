import React from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { AadhaarOnboardingStep } from './AadhaarOnboardingStep';

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
  const isSlideshow = currentStep < 3;
  const slide = slides[currentStep] || slides[0];
  const currentRoleObj = roles.find((r) => r.id === selectedRole) || roles[0];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '430px',
        minHeight: '100vh',
        margin: '0 auto',
        backgroundColor: '#FCFCFD',
        color: '#111111',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxSizing: 'border-box',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.06)',
        userSelect: 'none',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Valley Sans', sans-serif"
      }}
    >
      {/* Top Navigation Bar: Clean Setu. Logo on left (NO back button), Skip on right */}
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
            Skip
          </button>
        )}
      </header>

      {/* Main Viewport Content */}
      <main
        style={{
          flex: 1,
          padding: '0.5rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {isSlideshow ? (
          /* ===================================================================
             SLIDESHOW STAGE: Pure Stitch Editorial Slides
             =================================================================== */
          <div
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
        ) : currentStep === 3 ? (
          /* ===================================================================
             STAGE 2: Mobile Intent Selection Screen (NO 3 DOTS, NO Back Before Setu)
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
                  margin: '0 0 0.35rem'
                }}
              >
                What brings you to Setu?
              </h1>
              <p style={{ fontSize: '0.8125rem', color: '#636366', margin: 0, fontWeight: '500' }}>
                Select your focus area to access the right portal workflow.
              </p>
            </div>

            {/* 4 Intent Cards with Apple Spacing & Uncrowded Squircles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {intents.map((intent) => {
                const isSelected = selectedIntent === intent.id;
                return (
                  <div
                    key={intent.id}
                    onClick={() => setSelectedIntent(intent.id)}
                    className="apple-select-card"
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: '18px',
                      border: isSelected ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: '#ffffff',
                      boxShadow: isSelected
                        ? '0 4px 16px rgba(0, 0, 0, 0.06)'
                        : '0 1px 3px rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          minWidth: '44px',
                          borderRadius: '12px',
                          backgroundColor: isSelected ? '#000000' : '#f2f2f7',
                          color: isSelected ? '#ffffff' : '#1c1c1e',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <GoogleIcon name={intent.icon} size={22} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#111111', lineHeight: 1.3 }}>
                          {intent.title}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#636366', fontWeight: '400', display: 'block', marginTop: '0.2rem', lineHeight: 1.35 }}>
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
        ) : currentStep === 4 ? (
          /* ===================================================================
             STAGE 3: Mobile Reporting Portal Sub-Role Selection (Static Heading, Concise)
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
                  fontSize: '1.625rem',
                  fontWeight: '800',
                  letterSpacing: '-0.025em',
                  color: '#111111',
                  lineHeight: 1.25,
                  margin: 0
                }}
              >
                Choose your role
              </h1>
              <p style={{ fontSize: '0.8125rem', color: '#636366', margin: '0.35rem 0 0', fontWeight: '500' }}>
                Select how you will participate in the Reporting Portal.
              </p>
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
                      padding: '1.15rem 1.25rem',
                      borderRadius: '18px',
                      border: isSelected ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: '#ffffff',
                      boxShadow: isSelected
                        ? '0 4px 16px rgba(0, 0, 0, 0.06)'
                        : '0 1px 3px rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
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
                        <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#111111' }}>
                          {role.title}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#636366', fontWeight: '400', display: 'block', marginTop: '0.2rem' }}>
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
             STAGE 4: Mobile Aadhaar Verification & OTP Screen (Step 5)
             =================================================================== */
          <AadhaarOnboardingStep
            isMobile={true}
            onPrev={onPrev}
            onSuccess={onAadhaarSuccess}
          />
        )}
      </main>

      {/* Bottom Interactive Safe Area & Navigation Controls (Only for Steps 0-4) */}
      {currentStep < 5 && (
        <footer
          style={{
            padding: '1rem 1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          {/* 3 Animated Apple Pill Indicators - ONLY during Slideshow */}
          {isSlideshow && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  style={{
                    height: '8px',
                    width: idx === currentStep ? '32px' : '8px',
                    backgroundColor: idx === currentStep ? '#000000' : '#d1d5db',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    padding: 0
                  }}
                  aria-label={`Slide ${idx + 1}`}
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
              gap: currentStep >= 3 ? '0.75rem' : '0px',
              transition: 'gap 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Back Button on Left: Smoothly Expands and Slides in, Squeezing Continue Button */}
            <button
              onClick={onPrev}
              className="apple-btn-secondary"
              aria-hidden={currentStep < 3}
              tabIndex={currentStep < 3 ? -1 : 0}
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
                width: currentStep >= 3 ? '100px' : '0px',
                minWidth: currentStep >= 3 ? '100px' : '0px',
                maxWidth: currentStep >= 3 ? '100px' : '0px',
                opacity: currentStep >= 3 ? 1 : 0,
                padding: currentStep >= 3 ? '0 1rem' : '0px',
                border: currentStep >= 3 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
                pointerEvents: currentStep >= 3 ? 'auto' : 'none',
                transform: currentStep >= 3 ? 'translateX(0) scale(1)' : 'translateX(-16px) scale(0.9)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                boxSizing: 'border-box'
              }}
            >
              Back
            </button>

            {/* Primary Action Button (Smoothly Squeezes to Accommodate Back Button) */}
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
                {currentStep === 2
                  ? 'Get Started'
                  : 'Continue'}
              </span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};
