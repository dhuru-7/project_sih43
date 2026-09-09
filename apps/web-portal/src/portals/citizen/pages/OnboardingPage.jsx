import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/onboarding.css';
import { MobileOnboardingView } from '../components/MobileOnboardingView';
import { DesktopOnboardingView } from '../components/DesktopOnboardingView';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

const ONBOARDING_SLIDES = [
  {
    title: 'See a problem?',
    highlight: 'Just record or speak.',
    image: '/illustrations/onboarding-step-1.png'
  },
  {
    title: 'Jharkhand’s brightest youth',
    highlight: 'will solve it.',
    image: '/illustrations/onboarding-step-2.png'
  },
  {
    title: 'Funded by Industry.',
    highlight: 'Delivered to you.',
    image: '/illustrations/onboarding-step-3.png'
  }
];

const INTENTS = [
  {
    id: 'report',
    title: 'Report Issue',
    subtitle: 'Fix civic, road & water problems',
    icon: 'campaign'
  },
  {
    id: 'university',
    title: 'Student Projects',
    subtitle: 'Universities solving real challenges',
    icon: 'school'
  },
  {
    id: 'government',
    title: 'Govt Grants',
    subtitle: 'DHTE review & funding approvals',
    icon: 'account_balance'
  },
  {
    id: 'industry',
    title: 'CSR Funding',
    subtitle: 'Corporate sponsorship & adoption',
    icon: 'apartment'
  }
];

const REPORTING_ROLES = [
  {
    id: 'citizen',
    title: 'Individual Citizen',
    subtitle: 'Resident, commuter, student',
    icon: 'person',
    route: '/report'
  },
  {
    id: 'spoc',
    title: 'Organisation / NGO',
    subtitle: 'Panchayat, NGO or Local SPOC',
    icon: 'corporate_fare',
    route: '/report?role=spoc'
  }
];

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIntent, setSelectedIntent] = useState('report');
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [underDevModal, setUnderDevModal] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectIntent = (intentId) => {
    if (intentId !== 'report') {
      setUnderDevModal({
        title: 'Under Development',
        badge: 'Coming Soon',
        message: 'This portal workflow is currently under active development. Please select "Report or track a problem" to test the citizen portal.'
      });
      return;
    }
    setSelectedIntent('report');
  };

  const handleSelectRole = (roleId) => {
    if (roleId !== 'citizen') {
      setUnderDevModal({
        title: 'Under Development',
        badge: 'Coming Soon',
        message: 'Organization and Local Body onboarding is currently under active development. Please proceed as an Individual Citizen to evaluate the prototype.'
      });
      return;
    }
    setSelectedRole('citizen');
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 2) {
      // Finished slideshow, move to Intent Selection
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Intent chosen
      if (selectedIntent === 'report') {
        setCurrentStep(4);
      } else {
        setUnderDevModal({
          title: 'Under Development',
          badge: 'Coming Soon',
          message: 'This portal workflow is currently under active development. Please select "Report or track a problem" to test the citizen portal.'
        });
      }
    } else if (currentStep === 4) {
      // Reporting role chosen
      if (selectedRole === 'citizen') {
        localStorage.setItem('setu_onboarded', 'true');
        localStorage.setItem('setu_user_role', selectedRole);
        setCurrentStep(5);
      } else {
        setUnderDevModal({
          title: 'Under Development',
          badge: 'Coming Soon',
          message: 'Organization and Local Body onboarding is currently under active development. Please proceed as an Individual Citizen to evaluate the prototype.'
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    // Jump straight to Intent Selection
    setCurrentStep(3);
  };

  const handleAadhaarSuccess = (user) => {
    localStorage.setItem('setu_onboarded', 'true');
    localStorage.setItem('setu_user_role', 'citizen');
    navigate('/report?tab=profile');
  };

  const isMobile = windowWidth < 1024;

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        boxSizing: 'border-box'
      }}
    >
      {isMobile ? (
        <MobileOnboardingView
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          slides={ONBOARDING_SLIDES}
          selectedIntent={selectedIntent}
          setSelectedIntent={handleSelectIntent}
          intents={INTENTS}
          selectedRole={selectedRole}
          setSelectedRole={handleSelectRole}
          roles={REPORTING_ROLES}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          onAadhaarSuccess={handleAadhaarSuccess}
        />
      ) : (
        <DesktopOnboardingView
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          slides={ONBOARDING_SLIDES}
          selectedIntent={selectedIntent}
          setSelectedIntent={handleSelectIntent}
          intents={INTENTS}
          selectedRole={selectedRole}
          setSelectedRole={handleSelectRole}
          roles={REPORTING_ROLES}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          onAadhaarSuccess={handleAadhaarSuccess}
        />
      )}

      {/* Under Development Modal: Portalled to document.body with Frosted Glass Backdrop */}
      {underDevModal && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          onClick={() => setUnderDevModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            animation: 'appleFadeEnter 0.2s ease-out'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '1.75rem',
              maxWidth: '380px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.16), 0 0 1px rgba(0, 0, 0, 0.12)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              position: 'relative',
              boxSizing: 'border-box',
              animation: 'appleSpringEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setUnderDevModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                borderRadius: '50%',
                color: '#8e8e93',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GoogleIcon name="close" size={20} color="#8e8e93" />
            </button>

            {/* Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#f2f2f7',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '0.25rem'
              }}
            >
              <GoogleIcon name="engineering" size={28} color="#111111" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  backgroundColor: '#f2f2f7',
                  color: '#636366'
                }}
              >
                {underDevModal.badge || 'Prototype Notice'}
              </span>

              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: '800',
                  color: '#111111',
                  margin: '0.25rem 0 0',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}
              >
                {underDevModal.title || 'Under Development'}
              </h2>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#636366',
                  margin: '0.35rem 0 0',
                  lineHeight: 1.45,
                  fontWeight: '400'
                }}
              >
                {underDevModal.message}
              </p>
            </div>

            {/* Got It Button */}
            <button
              onClick={() => setUnderDevModal(null)}
              className="apple-btn-primary"
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '14px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                marginTop: '0.25rem'
              }}
            >
              Got It
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
