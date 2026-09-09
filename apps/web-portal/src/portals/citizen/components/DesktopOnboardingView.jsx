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
  selectedLang,
  setSelectedLang,
  selectedDistrict,
  setSelectedDistrict,
  languages,
  districts,
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

  return (
    <div className="setu-onboard-page">
      {/* Apple Ambient Gradients */}
      <div className="setu-ambient-glow-1" />
      <div className="setu-ambient-glow-2" />

      {/* Top Header Bar */}
      <header className="setu-onboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="setu-logo-text">
            Setu<span className="setu-logo-dot" />
          </span>
          <div style={{ width: '1px', height: '18px', backgroundColor: '#e5e7eb', margin: '0 0.25rem' }} />
          <span className="setu-header-badge">
            Govt. of Jharkhand · DHTE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Mobile Preview Toggle */}
          <button
            onClick={onSwitchToMobile}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#333333',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <GoogleIcon name="smartphone" size={16} />
            <span>Mobile Preview</span>
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleSkip}
              style={{
                fontSize: '0.8125rem',
                fontWeight: '600',
                color: '#666666',
                background: 'none',
                border: 'none',
                padding: '0.4rem 0.8rem',
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
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#000000',
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

      {/* Main Dual-Column Bento Canvas */}
      <main className="setu-onboard-main">
        <div className="setu-bento-canvas">
          
          {/* Left Column: Storytelling & Visual */}
          <div className="setu-story-col">
            {/* Step Tabs Row */}
            <div className="setu-tabs-row">
              {slides.map((s, idx) => {
                const isActive = idx === currentStep;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`setu-step-tab ${isActive ? 'active' : 'inactive'}`}
                  >
                    <span
                      className="setu-tab-indicator"
                      style={{ backgroundColor: isActive ? '#ffffff' : '#9ca3af' }}
                    />
                    <span>{s.stepLabel || `0${idx + 1}`}</span>
                  </button>
                );
              })}
            </div>

            {/* Illustration Frame */}
            <div className="setu-illus-frame">
              <img
                src={slide.image}
                alt={slide.title}
                className="setu-illus-img"
              />
              <div className="setu-illus-floating-badge">
                <span className="setu-pulse-dot" />
                <span>{slide.floatingBadge || 'DHTE Live Portal'}</span>
              </div>
            </div>

            {/* Proof Card */}
            <div className="setu-proof-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <GoogleIcon name="verified_user" size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#111111', margin: 0 }}>
                    Jharkhand Higher & Technical Education
                  </h4>
                  <p style={{ fontSize: '0.71875rem', color: '#666666', margin: '2px 0 0' }}>
                    Connecting 3.8M citizens with 120+ accredited HEI research labs
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right', paddingLeft: '1rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#000000', display: 'block' }}>
                  100% Free
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#888888' }}>
                  Public Portal
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Stage */}
          <div className="setu-stage-col">
            {currentStep < 3 ? (
              /* Steps 1, 2, 3: Overview */
              <div>
                <div className="setu-stage-badge">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', display: 'inline-block' }} />
                  Step {currentStep + 1} of {totalSteps} · {slide.stepName}
                </div>

                <h1 className="setu-headline-primary">
                  {slide.title} <br />
                  <span className="setu-headline-gradient">{slide.highlight}</span>
                </h1>

                <p className="setu-subtitle-text">
                  {slide.subtitle}
                </p>

                {/* 3 Feature Cards */}
                <div className="setu-feature-grid">
                  {slide.features.map((feat, idx) => (
                    <div key={idx} className="setu-feat-card">
                      <div className="setu-feat-icon">
                        <GoogleIcon name={feat.icon} size={18} />
                      </div>
                      <div className="setu-feat-title">{feat.title}</div>
                      <div className="setu-feat-desc">{feat.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Alignment Pill */}
                <div
                  style={{
                    padding: '0.875rem 1.15rem',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.35rem' }}>{slide.highlightIcon || '💡'}</span>
                    <div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#111111', display: 'block' }}>
                        SIH 26043 Framework Aligned
                      </span>
                      <span style={{ fontSize: '0.71875rem', color: '#666666' }}>
                        {slide.stat}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: '700',
                      color: '#047857',
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px'
                    }}
                  >
                    Active in Jharkhand
                  </span>
                </div>
              </div>
            ) : (
              /* Step 4: Role & Preferences */
              <div>
                <div className="setu-stage-badge">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', display: 'inline-block' }} />
                  Step 4 of {totalSteps} · Personalization
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#111111', margin: '0 0 0.35rem' }}>
                  How will you use Setu?
                </h1>
                <p style={{ fontSize: '0.8125rem', color: '#666666', margin: '0 0 1rem' }}>
                  Select your primary stakeholder profile to enter the customized portal workspace.
                </p>

                {/* 4 Role Bento Cards */}
                <div className="setu-roles-grid">
                  {roles.map((role) => {
                    const isSelected = selectedRole === role.id;
                    return (
                      <article
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`setu-role-card ${isSelected ? 'selected' : 'unselected'}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
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

                          <div className={`setu-role-radio ${isSelected ? 'checked' : 'unchecked'}`}>
                            {isSelected && (
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                            )}
                          </div>
                        </div>

                        <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#111111', marginTop: '0.65rem' }}>
                          {role.title}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#777777', fontWeight: '500', marginBottom: '0.35rem' }}>
                          {role.subtitle}
                        </div>
                        <p style={{ fontSize: '0.6875rem', color: '#555555', margin: 0, lineHeight: 1.35 }}>
                          {role.detail}
                        </p>
                      </article>
                    );
                  })}
                </div>

                {/* Preferences: Language & District */}
                <div className="setu-prefs-strip">
                  <div>
                    <label style={{ fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#333333', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      <GoogleIcon name="translate" size={14} /> Language
                    </label>
                    <div className="setu-lang-grid">
                      {languages.map((lang) => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => setSelectedLang(lang.id)}
                          className={`setu-lang-btn ${selectedLang === lang.id ? 'active' : 'inactive'}`}
                        >
                          <span>{lang.label}</span>
                          <span style={{ fontSize: '0.5625rem', opacity: 0.7 }}>{lang.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#333333', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      <GoogleIcon name="location_on" size={14} /> Focus District
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="setu-district-select"
                    >
                      {districts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist} District
                        </option>
                      ))}
                    </select>
                    <span style={{ fontSize: '0.625rem', color: '#888888', marginTop: '0.35rem', display: 'block' }}>
                      Prioritizes grassroots feeds in this district.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="setu-actions-bar">
              <div>
                {currentStep > 0 ? (
                  <button onClick={handlePrev} className="setu-secondary-pill">
                    <GoogleIcon name="arrow_back" size={16} />
                    <span>Back</span>
                  </button>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: '500' }}>
                    SIH Problem Statement 26043
                  </span>
                )}
              </div>

              <button onClick={handleNext} className="setu-primary-pill">
                <span>
                  {currentStep === totalSteps - 1
                    ? `Enter Setu as ${roles.find((r) => r.id === selectedRole)?.title || 'Citizen'}`
                    : 'Continue'}
                </span>
                <GoogleIcon name="arrow_forward" size={18} />
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          width: '100%',
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '1rem 2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#888888',
          borderTop: '1px solid rgba(0,0,0,0.06)'
        }}
      >
        <span>SETU — Societal Innovation Collaboration Portal · Govt. of Jharkhand</span>
        <span>Designed under Apple Human Interface Guidelines</span>
      </footer>
    </div>
  );
};
