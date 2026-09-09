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
  selectedLang,
  setSelectedLang,
  selectedDistrict,
  setSelectedDistrict,
  languages,
  districts,
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
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Top iOS Navigation Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          padding: '1rem 1.25rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
                color: '#333333',
                cursor: 'pointer',
                marginRight: '0.2rem'
              }}
            >
              <GoogleIcon name="arrow_back" size={20} />
            </button>
          )}
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#000000' }}>
            Setu<span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#000000', display: 'inline-block', marginLeft: '1px' }} />
          </span>
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: '#f1f3f5',
              color: '#555555',
              marginLeft: '0.35rem'
            }}
          >
            DHTE
          </span>
        </div>

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={handleSkip}
            style={{
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#666666',
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
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#111111',
              backgroundColor: '#f1f3f5',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        )}
      </header>

      {/* Main Viewport Content */}
      <main style={{ flex: 1, padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
        {currentStep < 3 ? (
          /* Step 1, 2, 3 */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: 'auto 0' }}>
            {/* Step Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: '#f1f3f5',
                border: '1px solid #e5e7eb',
                fontSize: '0.6875rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: '#444444',
                marginBottom: '1rem'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', display: 'inline-block' }} />
              Step {currentStep + 1} of {totalSteps}
            </div>

            {/* Illustration Container */}
            <div
              style={{
                width: '100%',
                maxWidth: '340px',
                aspectRatio: '4 / 3',
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }}
              />
            </div>

            {/* Tag Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
              {slide.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: '600',
                    color: '#333333',
                    backgroundColor: '#f1f3f5',
                    border: '1px solid #e5e7eb',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#111111', lineHeight: 1.25, margin: '0 0 0.5rem' }}>
              {slide.title} <br />
              <span style={{ color: '#000000' }}>{slide.highlight}</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: '0.8125rem', color: '#555555', lineHeight: 1.5, margin: '0 0 1rem', maxWidth: '320px' }}>
              {slide.subtitle}
            </p>

            {/* Stat Chip */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.6875rem',
                fontWeight: '600',
                color: '#444444',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                padding: '0.35rem 0.8rem',
                borderRadius: '9999px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <GoogleIcon name="verified" size={14} color="#10b981" />
              <span>{slide.stat}</span>
            </div>
          </div>
        ) : (
          /* Step 4: Role Selection & Preferences */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: '#f1f3f5',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.6875rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  color: '#444444'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', display: 'inline-block' }} />
                Step 4 of {totalSteps}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: '500' }}>Setup your identity</span>
            </div>

            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#111111', margin: '0 0 0.25rem' }}>
                How will you use Setu?
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#666666', margin: 0 }}>
                Choose your role to customize feeds and reporting permissions.
              </p>
            </div>

            {/* 4 Bento Role Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {roles.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <article
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #000000' : '1px solid #e5e7eb',
                      backgroundColor: isSelected ? '#fbfbfc' : '#ffffff',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 14px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            backgroundColor: isSelected ? '#000000' : '#f1f3f5',
                            color: isSelected ? '#ffffff' : '#333333',
                            border: isSelected ? 'none' : '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <GoogleIcon name={role.icon} size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#111111' }}>{role.title}</div>
                          <span style={{ fontSize: '0.6875rem', color: '#777777', fontWeight: '500' }}>{role.subtitle}</span>
                        </div>
                      </div>

                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '1.5px solid #000000' : '1.5px solid #cccccc',
                          backgroundColor: isSelected ? '#000000' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isSelected && (
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                        )}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.6875rem', color: '#555555', margin: '0.5rem 0 0', lineHeight: 1.35 }}>
                      {role.detail}
                    </p>
                  </article>
                );
              })}
            </div>

            {/* Language & District Card */}
            <div
              style={{
                borderRadius: '16px',
                padding: '1rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div>
                <label style={{ fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#333333', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                  <GoogleIcon name="translate" size={14} /> Language
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedLang(lang.id)}
                      style={{
                        padding: '0.45rem 0.65rem',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: selectedLang === lang.id ? '1px solid #000000' : '1px solid #e5e7eb',
                        backgroundColor: selectedLang === lang.id ? '#000000' : '#f9f9f9',
                        color: selectedLang === lang.id ? '#ffffff' : '#333333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{lang.label}</span>
                      <span style={{ fontSize: '0.5625rem', opacity: 0.7 }}>{lang.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #f1f3f5' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#333333', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                  <GoogleIcon name="location_on" size={14} /> Primary District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 0.75rem',
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#111111',
                    outline: 'none'
                  }}
                >
                  {districts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist} District
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Action Footer with Apple Capsule Indicator */}
      <footer
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 30,
          padding: '0.75rem 1.25rem 1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem'
        }}
      >
        {/* Animated Pill Dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              style={{
                height: '8px',
                width: idx === currentStep ? '28px' : '8px',
                backgroundColor: idx === currentStep ? '#000000' : '#d1d5db',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: '#000000',
            color: '#ffffff',
            borderRadius: '14px',
            fontWeight: '600',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <span>
            {currentStep === totalSteps - 1
              ? `Continue as ${roles.find((r) => r.id === selectedRole)?.title || 'Citizen'}`
              : 'Continue'}
          </span>
          <GoogleIcon name="arrow_forward" size={18} />
        </button>

        {/* iOS Home Indicator */}
        <div style={{ width: '120px', height: '4px', backgroundColor: '#d1d5db', borderRadius: '9999px', marginTop: '0.25rem' }} />
      </footer>
    </div>
  );
};
