import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const MobileOnboardingView = ({
  currentStep,
  setCurrentStep,
  totalSteps,
  slides,
  selectedRole,
  setSelectedRole,
  roles,
  onComplete
}) => {
  const navigate = useNavigate();
  const slide = slides[currentStep] || slides[0];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(totalSteps - 1);
  };

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
        userSelect: 'none'
      }}
    >
      {/* Top Navigation Bar: Setu. on left, Skip on right (NO DHTE tag) */}
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
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                color: '#111111',
                cursor: 'pointer',
                marginRight: '0.4rem',
                padding: 0
              }}
              aria-label="Back"
            >
              <GoogleIcon name="arrow_back" size={20} />
            </button>
          )}
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

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={handleSkip}
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#71717a',
              background: 'none',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              cursor: 'pointer'
            }}
          >
            Skip
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#71717a',
              background: 'none',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              cursor: 'pointer'
            }}
          >
            Sign In
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
        {currentStep < 3 ? (
          /* Steps 1, 2, 3: Pure Stitch Editorial Slides (No tags, no paragraphs, no stat badges) */
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
        ) : (
          /* Step 4: Role Selection (Faithful to Stitch Setu - Role Selection) */
          <div
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
                I'm an {currentRoleObj.title}
              </h1>
            </div>

            {/* Bento Role Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {roles.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <article
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    style={{
                      padding: '1.15rem 1.25rem',
                      borderRadius: '20px',
                      border: isSelected ? '2px solid #000000' : '1px solid #e5e7eb',
                      backgroundColor: isSelected ? 'rgba(250, 250, 250, 0.8)' : '#ffffff',
                      cursor: 'pointer',
                      boxShadow: isSelected
                        ? '0 4px 16px rgba(0, 0, 0, 0.05)'
                        : '0 1px 3px rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            backgroundColor: isSelected ? '#ffffff' : '#f4f4f5',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#111111'
                          }}
                        >
                          <GoogleIcon name={role.icon} size={22} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#111111' }}>
                            {role.title}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: '500' }}>
                            {role.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* Radio Indicator */}
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #000000' : '1.5px solid #d1d5db',
                          backgroundColor: isSelected ? '#000000' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#ffffff'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Interactive Safe Area & Navigation Controls */}
      <footer
        style={{
          padding: '1rem 1.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}
      >
        {/* Animated Apple Pill Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {Array.from({ length: totalSteps }).map((_, idx) => (
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
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            height: '54px',
            backgroundColor: '#000000',
            color: '#ffffff',
            borderRadius: '16px',
            fontWeight: '600',
            fontSize: '0.9375rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>
            {currentStep === totalSteps - 1
              ? `Continue as ${currentRoleObj.title}`
              : currentStep === totalSteps - 2
              ? 'Get Started'
              : 'Continue'}
          </span>
          <GoogleIcon name="arrow_forward" size={18} />
        </button>

        {/* iOS Home Indicator */}
        <div
          style={{
            width: '128px',
            height: '4px',
            backgroundColor: '#d1d5db',
            borderRadius: '9999px',
            marginTop: '0.25rem'
          }}
        />
      </footer>
    </div>
  );
};
