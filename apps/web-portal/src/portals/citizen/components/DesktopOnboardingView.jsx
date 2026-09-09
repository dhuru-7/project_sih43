import React from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

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
  onSkip
}) => {
  const isSlideshow = currentStep < 3;
  const slide = slides[currentStep] || slides[0];
  const currentRoleObj = roles.find((r) => r.id === selectedRole) || roles[0];

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        color: '#1a1c1c',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxSizing: 'border-box',
        userSelect: 'none',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Valley Sans', sans-serif"
      }}
    >
      {/* Top Header: Clean Setu. Logo on left, Minimal Skip on right (NO signup, NO mobile view) */}
      <header
        style={{
          width: '100%',
          maxWidth: '1160px',
          margin: '0 auto',
          padding: '2rem 2.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              letterSpacing: '-0.035em',
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
              color: '#71717a',
              background: 'none',
              border: 'none',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#111111')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
          >
            Skip
          </button>
        )}
      </header>

      {/* Main Apple Bento Presentation Canvas */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1160px',
          margin: '0 auto',
          padding: '1rem 2.5rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '2rem',
            border: '1px solid rgba(0, 0, 0, 0.07)',
            boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: isSlideshow ? '1.1fr 1fr' : '1fr',
            minHeight: '580px',
            alignItems: 'center'
          }}
        >
          {isSlideshow ? (
            /* ===================================================================
               SLIDESHOW STAGE: Dual-pane balanced layout with Artwork & Headline
               =================================================================== */
            <>
              {/* Left Pane: Artwork in generous soft frame */}
              <div
                style={{
                  height: '100%',
                  minHeight: '520px',
                  backgroundColor: '#f6f7f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3rem',
                  borderRight: '1px solid rgba(0, 0, 0, 0.05)',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '460px',
                    aspectRatio: '4 / 3',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Right Pane: Large bold headline and controls */}
              <div
                style={{
                  height: '100%',
                  padding: '3.5rem 3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* Headline Section */}
                <div style={{ margin: 'auto 0' }}>
                  <h1
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      letterSpacing: '-0.035em',
                      color: '#111111',
                      lineHeight: 1.2,
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
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {/* 3 Dots: Active is 32px pill, inactives are 8px dots */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          padding: 0
                        }}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Actions: Back & Continue/Get Started (NO ARROWS) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {currentStep > 0 && (
                      <button
                        onClick={onPrev}
                        style={{
                          height: '48px',
                          padding: '0 1.25rem',
                          backgroundColor: '#ffffff',
                          color: '#555555',
                          borderRadius: '1rem',
                          border: '1px solid #e5e7eb',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Back
                      </button>
                    )}

                    <button
                      onClick={onNext}
                      style={{
                        height: '48px',
                        padding: '0 2rem',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        borderRadius: '1rem',
                        fontSize: '0.9375rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {currentStep === 2 ? 'Get Started' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : currentStep === 3 ? (
            /* ===================================================================
               STAGE 2: Intent Selection Screen (NO 3 DOTS)
               =================================================================== */
            <div
              style={{
                padding: '3.5rem 4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                maxWidth: '860px',
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: '2.25rem',
                    fontWeight: '800',
                    letterSpacing: '-0.03em',
                    color: '#111111',
                    lineHeight: 1.2,
                    margin: '0 0 0.5rem'
                  }}
                >
                  What brings you to Setu?
                </h1>
                <p style={{ fontSize: '0.9375rem', color: '#71717a', margin: 0, fontWeight: '500' }}>
                  Select your primary focus area to access the right portal workflow.
                </p>
              </div>

              {/* 4 Intent Bento Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem'
                }}
              >
                {intents.map((intent) => {
                  const isSelected = selectedIntent === intent.id;
                  return (
                    <div
                      key={intent.id}
                      onClick={() => setSelectedIntent(intent.id)}
                      style={{
                        padding: '1.5rem',
                        borderRadius: '1.25rem',
                        border: isSelected ? '2px solid #000000' : '1px solid #e5e7eb',
                        backgroundColor: isSelected ? '#fafafa' : '#ffffff',
                        cursor: 'pointer',
                        boxShadow: isSelected
                          ? '0 6px 20px rgba(0, 0, 0, 0.05)'
                          : '0 2px 6px rgba(0, 0, 0, 0.02)',
                        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '130px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: isSelected ? '#000000' : '#f4f4f5',
                            color: isSelected ? '#ffffff' : '#111111',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.75rem'
                          }}
                        >
                          <GoogleIcon name={intent.icon} size={22} />
                        </div>

                        {/* Radio Checkmark */}
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: isSelected ? '2px solid #000000' : '1.5px solid #d1d5db',
                            backgroundColor: isSelected ? '#000000' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isSelected && (
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                          )}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#111111', lineHeight: 1.3 }}>
                          {intent.title}
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: '#71717a', margin: '0.25rem 0 0', lineHeight: 1.4 }}>
                          {intent.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar (NO 3 DOTS, NO ARROW) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                }}
              >
                <button
                  onClick={onPrev}
                  style={{
                    height: '48px',
                    padding: '0 1.25rem',
                    backgroundColor: '#ffffff',
                    color: '#555555',
                    borderRadius: '1rem',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>

                <button
                  onClick={onNext}
                  style={{
                    height: '48px',
                    padding: '0 2.25rem',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    borderRadius: '1rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)'
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            /* ===================================================================
               STAGE 3: Reporting Portal Sub-Role Selection (NO 3 DOTS)
               =================================================================== */
            <div
              style={{
                padding: '3.5rem 4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                maxWidth: '680px',
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: '2.25rem',
                    fontWeight: '800',
                    letterSpacing: '-0.03em',
                    color: '#111111',
                    lineHeight: 1.2,
                    margin: '0 0 0.5rem'
                  }}
                >
                  I'm an {currentRoleObj.title}
                </h1>
                <p style={{ fontSize: '0.9375rem', color: '#71717a', margin: 0, fontWeight: '500' }}>
                  Choose how you will represent issues in the Reporting Portal.
                </p>
              </div>

              {/* 2 Stitch Sub-Roles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {roles.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <article
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      style={{
                        padding: '1.5rem',
                        borderRadius: '1.25rem',
                        border: isSelected ? '2px solid #000000' : '1px solid #e5e7eb',
                        backgroundColor: isSelected ? '#fafafa' : '#ffffff',
                        cursor: 'pointer',
                        boxShadow: isSelected
                          ? '0 6px 20px rgba(0, 0, 0, 0.05)'
                          : '0 2px 6px rgba(0, 0, 0, 0.02)',
                        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            backgroundColor: isSelected ? '#ffffff' : '#f4f4f5',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#111111'
                          }}
                        >
                          <GoogleIcon name={role.icon} size={24} />
                        </div>
                        <div>
                          <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111111' }}>
                            {role.title}
                          </div>
                          <span style={{ fontSize: '0.8125rem', color: '#71717a', fontWeight: '500' }}>
                            {role.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* Radio Indicator */}
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #000000' : '1.5px solid #d1d5db',
                          backgroundColor: isSelected ? '#000000' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isSelected && (
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Action Bar (NO 3 DOTS, NO ARROWS) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                }}
              >
                <button
                  onClick={onPrev}
                  style={{
                    height: '48px',
                    padding: '0 1.25rem',
                    backgroundColor: '#ffffff',
                    color: '#555555',
                    borderRadius: '1rem',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>

                <button
                  onClick={onNext}
                  style={{
                    height: '52px',
                    padding: '0 2.25rem',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    borderRadius: '1rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)'
                  }}
                >
                  Continue as {currentRoleObj.title}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Clean Footer */}
      <footer
        style={{
          width: '100%',
          maxWidth: '1160px',
          margin: '0 auto',
          padding: '1rem 2.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8125rem',
          color: '#8e8e93'
        }}
      >
        <span>Setu · Societal Innovation Collaboration Portal</span>
        <span>Jharkhand Department of Higher & Technical Education</span>
      </footer>
    </div>
  );
};
