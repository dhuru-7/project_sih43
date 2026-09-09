import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const DesktopOnboardingView = ({
  currentStep,
  setCurrentStep,
  totalSteps,
  slides,
  selectedRole,
  setSelectedRole,
  roles,
  onComplete,
  onSwitchToMobile
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
        minHeight: '100vh',
        backgroundColor: '#FCFCFD',
        color: '#111111',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxSizing: 'border-box',
        userSelect: 'none',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif"
      }}
    >
      {/* Top Header Navigation: Just Setu. on left (NO DHTE tag) */}
      <header
        style={{
          width: '100%',
          maxWidth: '1080px',
          margin: '0 auto',
          padding: '1.75rem 2rem 1rem',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onSwitchToMobile}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#444444',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              padding: '0.45rem 0.95rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
            }}
          >
            <GoogleIcon name="smartphone" size={16} />
            <span>Mobile View</span>
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleSkip}
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#71717a',
                background: 'none',
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
            >
              Skip
            </button>
          ) : null}

          <button
            onClick={() => navigate('/login')}
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#111111',
              backgroundColor: '#f1f3f5',
              border: '1px solid #e5e7eb',
              padding: '0.45rem 1.15rem',
              borderRadius: '9999px',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Centered Apple Presentation Canvas */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '820px',
          margin: '0 auto',
          padding: '1rem 2rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {currentStep < 3 ? (
          /* Steps 1, 2, 3: Pure Stitch Editorial Presentation */
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {/* Editorial Illustration Frame */}
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                aspectRatio: '4 / 3',
                borderRadius: '32px',
                overflow: 'hidden',
                backgroundColor: '#fafafa',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.04)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2.5rem'
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '24px'
                }}
              />
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: '800',
                letterSpacing: '-0.03em',
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
          /* Step 4: Role Selection (Clean Stitch Bento) */
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h1
                style={{
                  fontSize: '2.25rem',
                  fontWeight: '800',
                  letterSpacing: '-0.03em',
                  color: '#111111',
                  lineHeight: 1.25,
                  margin: 0
                }}
              >
                I'm an {currentRoleObj.title}
              </h1>
            </div>

            {/* Bento Role Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {roles.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <article
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '22px',
                      border: isSelected ? '2px solid #000000' : '1px solid #e5e7eb',
                      backgroundColor: isSelected ? 'rgba(250, 250, 250, 0.85)' : '#ffffff',
                      cursor: 'pointer',
                      boxShadow: isSelected
                        ? '0 6px 20px rgba(0, 0, 0, 0.05)'
                        : '0 2px 6px rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
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
                          <div style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#111111' }}>
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
          width: '100%',
          maxWidth: '820px',
          margin: '0 auto',
          padding: '1.5rem 2rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}
      >
        {/* Animated Apple Pill Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              style={{
                height: '8px',
                width: idx === currentStep ? '36px' : '8px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '420px' }}>
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              style={{
                height: '56px',
                padding: '0 1.5rem',
                backgroundColor: '#ffffff',
                color: '#333333',
                border: '1px solid #e5e7eb',
                borderRadius: '18px',
                fontWeight: '600',
                fontSize: '0.9375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <GoogleIcon name="arrow_back" size={18} />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={handleNext}
            style={{
              flex: 1,
              height: '56px',
              backgroundColor: '#000000',
              color: '#ffffff',
              borderRadius: '18px',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
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
        </div>
      </footer>
    </div>
  );
};
