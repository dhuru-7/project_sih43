import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/onboarding.css';
import { MobileOnboardingView } from '../components/MobileOnboardingView';
import { DesktopOnboardingView } from '../components/DesktopOnboardingView';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useLanguage } from '../../../context/LanguageContext';

class OnboardingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Onboarding ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', color: '#111', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Loading Onboarding...</h2>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{ padding: '0.6rem 1.4rem', borderRadius: '9999px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Refresh Screen
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();

  // Step 0: Language Selection
  // Step 1: Slide 1
  // Step 2: Slide 2
  // Step 3: Slide 3
  // Step 4: Intent Selection
  // Step 5: Role Selection
  // Step 6: Aadhaar Verification
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIntent, setSelectedIntent] = useState('report');
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [currentStep]);

  const showToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const isMobile = windowWidth < 1024;

  // On mobile view, skip the "What brings you to Setu?" workspace selection screen and default to report portal
  useEffect(() => {
    if (isMobile && currentStep === 4) {
      setSelectedIntent('report');
      setCurrentStep(5);
    }
  }, [isMobile, currentStep]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure body background is light during onboarding to eliminate black screen
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const prevBg = document.body.style.backgroundColor;
      document.body.style.backgroundColor = '#f9f9f9';
      return () => {
        document.body.style.backgroundColor = prevBg;
      };
    }
  }, []);

  // Dynamically translated slides using instantaneous synchronous i18n
  const slides = useMemo(() => [
    {
      title: t('slide_1_title', 'See a problem?'),
      highlight: t('slide_1_highlight', 'Just record or speak.'),
      image: '/illustrations/onboarding-step-1.png'
    },
    {
      title: t('slide_2_title', 'Jharkhand’s brightest youth'),
      highlight: t('slide_2_highlight', 'will solve it.'),
      image: '/illustrations/onboarding-step-2.png'
    },
    {
      title: t('slide_3_title', 'Funded by Industry.'),
      highlight: t('slide_3_highlight', 'Delivered to you.'),
      image: '/illustrations/onboarding-step-3.png'
    }
  ], [t, currentLanguage]);

  // Dynamically translated intents
  const intents = useMemo(() => [
    {
      id: 'report',
      title: t('intent_report_title', 'Report Issue'),
      subtitle: t('intent_report_sub', 'Fix civic, road & water problems'),
      icon: 'campaign'
    },
    {
      id: 'university',
      title: t('intent_uni_title', 'Student Projects'),
      subtitle: t('intent_uni_sub', 'Universities solving real challenges'),
      icon: 'school'
    },
    {
      id: 'government',
      title: t('intent_gov_title', 'Govt Grants'),
      subtitle: t('intent_gov_sub', 'DHTE review & funding approvals'),
      icon: 'account_balance'
    },
    {
      id: 'industry',
      title: t('intent_ind_title', 'CSR Funding'),
      subtitle: t('intent_ind_sub', 'Corporate sponsorship & adoption'),
      icon: 'apartment'
    }
  ], [t, currentLanguage]);

  // Dynamically translated roles
  const roles = useMemo(() => [
    {
      id: 'citizen',
      title: t('role_citizen_title', 'Individual Citizen'),
      subtitle: t('role_citizen_sub', 'Resident, commuter, student'),
      icon: 'person',
      route: '/report'
    },
    {
      id: 'spoc',
      title: t('role_spoc_title', 'Organisation / NGO'),
      subtitle: t('role_spoc_sub', 'Panchayat, NGO or Local SPOC'),
      icon: 'corporate_fare',
      route: '/report?role=spoc'
    }
  ], [t, currentLanguage]);

  const handleSelectIntent = (intentId) => {
    if (intentId !== 'report') {
      showToast(t('coming_soon_msg', 'This workflow is currently under development. Please select Report Issue.'));
      return;
    }
    setSelectedIntent('report');
  };

  const handleSelectRole = (roleId) => {
    if (roleId !== 'citizen') {
      showToast(t('coming_soon_msg', 'Organization onboarding is currently under development. Please proceed as Citizen.'));
      return;
    }
    setSelectedRole('citizen');
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Move from Language Selection to Slide 1
      setCurrentStep(1);
    } else if (currentStep < 3) {
      // Advance through slides (1 -> 2 -> 3)
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 3) {
      // Finished slideshow: on mobile skip "What brings you to Setu?" and default to report portal
      if (isMobile) {
        setSelectedIntent('report');
        setCurrentStep(5);
      } else {
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      // Intent chosen (Desktop)
      if (selectedIntent === 'report') {
        setCurrentStep(5);
      } else {
        showToast(t('coming_soon_msg', 'This workflow is currently under development. Please select Report Issue.'));
      }
    } else if (currentStep === 5) {
      // Reporting role chosen
      if (selectedRole === 'citizen') {
        localStorage.setItem('setu_onboarded', 'true');
        localStorage.setItem('setu_user_role', selectedRole);
        setCurrentStep(6);
      } else {
        showToast(t('coming_soon_msg', 'Organization onboarding is currently under development. Please proceed as Citizen.'));
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      if (isMobile && currentStep === 5) {
        // On mobile, going back from role selection returns directly to Slide 3
        setCurrentStep(3);
      } else {
        setCurrentStep((prev) => prev - 1);
      }
    }
  };

  const handleSkip = () => {
    // Jump straight past slideshow: on mobile skips intent screen directly to role selection
    if (isMobile) {
      setSelectedIntent('report');
      setCurrentStep(5);
    } else {
      setCurrentStep(4);
    }
  };

  const handleAadhaarSuccess = (user) => {
    localStorage.setItem('setu_onboarded', 'true');
    localStorage.setItem('setu_user_role', 'citizen');
    localStorage.setItem('setu_show_pfp_prompt', 'true');
    if (user) {
      localStorage.setItem('setu_user', JSON.stringify(user));
      localStorage.setItem('sih_user_data', JSON.stringify(user));
    }
    navigate('/citizen/home');
  };

  return (
    <OnboardingErrorBoundary>
      <div
        style={{
          width: '100%',
          height: isMobile && currentStep === 0 ? '100dvh' : 'auto',
          minHeight: isMobile && currentStep === 0 ? '100dvh' : '100vh',
          maxHeight: isMobile && currentStep === 0 ? '100dvh' : 'none',
          overflow: isMobile && currentStep === 0 ? 'hidden' : 'visible',
          backgroundColor: '#f9f9f9',
          boxSizing: 'border-box'
        }}
      >
      {isMobile ? (
        <MobileOnboardingView
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          slides={slides}
          selectedIntent={selectedIntent}
          setSelectedIntent={handleSelectIntent}
          intents={intents}
          selectedRole={selectedRole}
          setSelectedRole={handleSelectRole}
          roles={roles}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          onAadhaarSuccess={handleAadhaarSuccess}
        />
      ) : (
        <DesktopOnboardingView
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          slides={slides}
          selectedIntent={selectedIntent}
          setSelectedIntent={handleSelectIntent}
          intents={intents}
          selectedRole={selectedRole}
          setSelectedRole={handleSelectRole}
          roles={roles}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          onAadhaarSuccess={handleAadhaarSuccess}
        />
      )}

      {/* Floating Bottom Toast Pill ("a simple sentence inside a shape (rectangle or pill)") */}
      {toastMessage && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          onClick={() => setToastMessage(null)}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999999,
            maxWidth: 'calc(100% - 36px)',
            width: 'max-content',
            backgroundColor: 'rgba(28, 28, 30, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: '#FFFFFF',
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.55rem',
            fontSize: '0.84rem',
            fontWeight: '500',
            textAlign: 'center',
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            animation: 'appleToastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            userSelect: 'none'
          }}
        >
          <span>{toastMessage}</span>
        </div>,
        document.body
      )}
      </div>
    </OnboardingErrorBoundary>
  );
};
