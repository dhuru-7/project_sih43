import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/onboarding.css';
import { MobileOnboardingView } from '../components/MobileOnboardingView';
import { DesktopOnboardingView } from '../components/DesktopOnboardingView';

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
    title: 'Report or track a problem',
    subtitle: 'Reporting Portal for civic, water, and local community issues',
    icon: 'campaign'
  },
  {
    id: 'university',
    title: 'Research & Student Innovation',
    subtitle: 'For universities, students & faculty prototyping solutions',
    icon: 'school'
  },
  {
    id: 'government',
    title: 'Review & Allocate Grants',
    subtitle: 'For DHTE state officers & administrative nodal cells',
    icon: 'account_balance'
  },
  {
    id: 'industry',
    title: 'Sponsor & Deploy via CSR',
    subtitle: 'For corporate industry partners & CSR funding heads',
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
    title: 'Organization / Local Body',
    subtitle: 'Panchayat, NGO, SPOC, Councillor',
    icon: 'corporate_fare',
    route: '/report?role=spoc'
  }
];

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIntent, setSelectedIntent] = useState('report');
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      } else if (selectedIntent === 'university') {
        localStorage.setItem('setu_user_intent', 'university');
        navigate('/university/dashboard');
      } else if (selectedIntent === 'government') {
        localStorage.setItem('setu_user_intent', 'government');
        navigate('/government/dashboard');
      } else if (selectedIntent === 'industry') {
        localStorage.setItem('setu_user_intent', 'industry');
        navigate('/industry/dashboard');
      }
    } else if (currentStep === 4) {
      // Reporting role chosen
      localStorage.setItem('setu_onboarded', 'true');
      localStorage.setItem('setu_user_role', selectedRole);
      if (selectedRole === 'citizen') {
        setCurrentStep(5);
      } else {
        const matched = REPORTING_ROLES.find((r) => r.id === selectedRole);
        navigate(matched ? matched.route : '/report?role=spoc');
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
          setSelectedIntent={setSelectedIntent}
          intents={INTENTS}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
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
          setSelectedIntent={setSelectedIntent}
          intents={INTENTS}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          roles={REPORTING_ROLES}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          onAadhaarSuccess={handleAadhaarSuccess}
        />
      )}
    </div>
  );
};
