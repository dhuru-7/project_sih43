import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileOnboardingView } from '../components/MobileOnboardingView';
import { DesktopOnboardingView } from '../components/DesktopOnboardingView';

const ONBOARDING_SLIDES = [
  {
    stepLabel: '01. Voice Intake',
    stepName: 'Frictionless Reporting',
    title: 'See a problem?',
    highlight: 'Just record or speak.',
    subtitle:
      'Report drinking water issues, power cuts, or infrastructure bottlenecks in your village or town in simple words. TARA AI structures the challenge instantly—no bureaucratic paperwork needed.',
    image: '/illustrations/onboarding-step-1.png',
    tags: ['🎙️ Voice-First', '⚡ Instant AI Intake', '📍 Auto-GPS Tag'],
    stat: 'Average voice report intake: 40 seconds',
    floatingBadge: 'TARA AI Voice Active',
    highlightIcon: '🎙️',
    features: [
      {
        icon: 'mic',
        title: 'Multi-Lingual Voice',
        desc: 'Speak naturally in Hindi, Santhali, Kurukh, or English without typing.'
      },
      {
        icon: 'my_location',
        title: 'Zero-Friction GPS',
        desc: 'Automatic block & panchayat geotagging without complex ward codes.'
      },
      {
        icon: 'psychology',
        title: 'TARA AI Triage',
        desc: 'Transforms spoken complaints into structured engineering challenge statements.'
      }
    ]
  },
  {
    stepLabel: '02. Academic R&D',
    stepName: 'University Solving',
    title: 'Jharkhand’s brightest youth',
    highlight: 'will solve it.',
    subtitle:
      'Your reported issue is matched with engineering colleges and research labs at IIT ISM Dhanbad, BIT Mesra, and Birsa Agricultural University to build physical and digital prototypes.',
    image: '/illustrations/onboarding-step-2.png',
    tags: ['🎓 120+ HEI Labs', '🔬 Prototyping Teams', '🌱 Local Tech Solutions'],
    stat: 'Over 320 prototypes built across Jharkhand districts',
    floatingBadge: 'Academic R&D Bridge',
    highlightIcon: '🎓',
    features: [
      {
        icon: 'school',
        title: 'HEI Matchmaking',
        desc: 'Assigned to university engineering teams with domain expertise.'
      },
      {
        icon: 'handyman',
        title: 'Real Prototyping',
        desc: 'Water filtration, solar telemetry, and agritech hardware built for the ground.'
      },
      {
        icon: 'verified',
        title: 'Academic Credits',
        desc: 'Students and faculty earn SIH curriculum credits for societal impact.'
      }
    ]
  },
  {
    stepLabel: '03. Funding & Delivery',
    stepName: 'State & CSR Backing',
    title: 'Funded by Industry.',
    highlight: 'Delivered to you.',
    subtitle:
      'Sanctioned by the Department of Higher & Technical Education (DHTE) and sponsored via industry CSR partnerships. Track milestones live on your phone until field testing is completed.',
    image: '/illustrations/onboarding-step-3.png',
    tags: ['🤝 CSR Co-Funding', '🏛️ State Nodal Grants', '✅ Field Verification'],
    stat: '₹4.2 Cr sanctioned in prototyping grants',
    floatingBadge: 'Verified Field Delivery',
    highlightIcon: '🤝',
    features: [
      {
        icon: 'payments',
        title: 'Direct Seed Grants',
        desc: 'Milestone-based funding released straight to student lab teams.'
      },
      {
        icon: 'policy',
        title: 'DHTE Nodal Oversight',
        desc: 'Government technical cells monitor quality and approve field trials.'
      },
      {
        icon: 'task_alt',
        title: 'Citizen Sign-Off',
        desc: 'The citizen who reported the problem confirms resolution on the ground.'
      }
    ]
  },
  {
    stepLabel: '04. Stakeholder Role',
    stepName: 'Personalization',
    title: 'Choose your identity on',
    highlight: 'Setu.',
    subtitle:
      'Select how you will participate in Jharkhand’s societal innovation ecosystem to access tailored dashboards and workflows.',
    image: '/illustrations/onboarding-step-1.png',
    tags: ['👤 Citizen', '🏢 Local SPOC', '🎓 University', '🏛️ Govt Nodal'],
    stat: 'Active across all 24 districts of Jharkhand',
    floatingBadge: 'Identity Setup',
    highlightIcon: '🏛️',
    features: []
  }
];

const ROLES = [
  {
    id: 'citizen',
    title: 'Individual Citizen',
    subtitle: 'Resident, commuter, student, farmer',
    icon: 'person',
    detail: 'Report local community problems with voice or photo, upvote nearby issues, and track verified lab fixes.',
    route: '/citizen'
  },
  {
    id: 'spoc',
    title: 'Panchayat / Local Body SPOC',
    subtitle: 'Panchayat Mukhiya, Ward SPOC, NGO Coordinator',
    icon: 'corporate_fare',
    detail: 'Verify village issue clusters, coordinate field tests with university researchers, and endorse solutions.',
    route: '/citizen?role=spoc'
  },
  {
    id: 'university',
    title: 'University Research Lab',
    subtitle: 'Faculty PI, student innovator, HEI SPOC',
    icon: 'school',
    detail: 'Adopt accredited societal challenges, submit prototyping proposals, unlock seed grants, and deploy solutions.',
    route: '/university/dashboard'
  },
  {
    id: 'government',
    title: 'DHTE Government Nodal Officer',
    subtitle: 'Higher & Technical Education Directorate Admin',
    icon: 'shield_person',
    detail: 'Triage incoming problem statements, approve research seed funding, inspect deliverables, and monitor state metrics.',
    route: '/government/dashboard'
  }
];

const LANGUAGES = [
  { id: 'en', label: 'English', sub: 'Default' },
  { id: 'hi', label: 'हिन्दी', sub: 'Hindi' },
  { id: 'sat', label: 'ᱥᱟᱱᱛᱟᱲᱤ', sub: 'Santhali' },
  { id: 'kru', label: 'कुड़ुख़', sub: 'Kurukh' }
];

const DISTRICTS = [
  'Ranchi',
  'Dhanbad',
  'East Singhbhum (Jamshedpur)',
  'Bokaro',
  'Hazaribagh',
  'Deoghar',
  'Giridih',
  'Ramgarh',
  'Palamu',
  'Gumla',
  'Dumka',
  'West Singhbhum (Chaibasa)',
  'Latehar',
  'Simdega',
  'Koderma',
  'Khunti',
  'Garhwa',
  'Chatra',
  'Godda',
  'Sahebganj',
  'Pakur',
  'Jamtara',
  'Lohardaga',
  'Seraikela Kharsawan'
];

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedDistrict, setSelectedDistrict] = useState('Ranchi');
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [forceMobilePreview, setForceMobilePreview] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentStep < ONBOARDING_SLIDES.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      } else if (e.key === 'Enter') {
        if (currentStep < ONBOARDING_SLIDES.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          handleComplete();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, selectedRole, selectedLang, selectedDistrict]);

  const handleComplete = () => {
    try {
      localStorage.setItem('setu_onboarded', 'true');
      localStorage.setItem('setu_user_role', selectedRole);
      localStorage.setItem('setu_user_lang', selectedLang);
      localStorage.setItem('setu_user_district', selectedDistrict);
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }

    const matchedRole = ROLES.find((r) => r.id === selectedRole);
    navigate(matchedRole ? matchedRole.route : '/citizen');
  };

  const isMobile = windowWidth < 1024 || forceMobilePreview;

  if (isMobile) {
    return (
      <div className="w-full min-h-screen bg-neutral-100 flex items-center justify-center p-0 md:p-6">
        {/* If user explicitly toggled mobile preview on desktop, wrap in realistic iPhone frame */}
        {windowWidth >= 1024 ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-neutral-600">Simulating Mobile Viewport (390px)</span>
              <button
                onClick={() => setForceMobilePreview(false)}
                className="text-xs font-bold text-neutral-900 bg-white border border-neutral-300 px-3 py-1 rounded-full hover:bg-neutral-50 shadow-2xs"
              >
                Switch to Full Desktop View
              </button>
            </div>
            <div className="w-[412px] h-[860px] rounded-[48px] overflow-hidden border-8 border-neutral-900 shadow-2xl bg-white flex flex-col relative">
              <MobileOnboardingView
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                totalSteps={ONBOARDING_SLIDES.length}
                slides={ONBOARDING_SLIDES}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                roles={ROLES}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                languages={LANGUAGES}
                districts={DISTRICTS}
                onComplete={handleComplete}
              />
            </div>
          </div>
        ) : (
          <MobileOnboardingView
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            totalSteps={ONBOARDING_SLIDES.length}
            slides={ONBOARDING_SLIDES}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            roles={ROLES}
            selectedLang={selectedLang}
            setSelectedLang={setSelectedLang}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            languages={LANGUAGES}
            districts={DISTRICTS}
            onComplete={handleComplete}
          />
        )}
      </div>
    );
  }

  return (
    <DesktopOnboardingView
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      totalSteps={ONBOARDING_SLIDES.length}
      slides={ONBOARDING_SLIDES}
      selectedRole={selectedRole}
      setSelectedRole={setSelectedRole}
      roles={ROLES}
      selectedLang={selectedLang}
      setSelectedLang={setSelectedLang}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      languages={LANGUAGES}
      districts={DISTRICTS}
      onComplete={handleComplete}
      onSwitchToMobile={() => setForceMobilePreview(true)}
    />
  );
};
