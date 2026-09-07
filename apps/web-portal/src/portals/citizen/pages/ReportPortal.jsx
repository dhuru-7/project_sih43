import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

// Thematic Domains aligned with SIH 26043 & NEP 2020
const THEMATIC_DOMAINS = [
  {
    id: 'water',
    title: 'Clean Water & Sanitation R&D',
    icon: 'water_drop',
    color: '#0284c7',
    bg: 'rgba(2, 132, 199, 0.08)',
    border: 'rgba(2, 132, 199, 0.25)',
    description: 'Fluoride/arsenic filtration, smart rural metering, rainwater harvesting.',
    sampleMatchedUni: 'BIT Mesra (Environmental Engineering Lab)'
  },
  {
    id: 'agriculture',
    title: 'Agriculture & Crop Health Tech',
    icon: 'psychiatry',
    color: '#16a34a',
    bg: 'rgba(22, 163, 74, 0.08)',
    border: 'rgba(22, 163, 74, 0.25)',
    description: 'Early pest/blight sensors, solar grain dehydrators, soil salinity R&D.',
    sampleMatchedUni: 'Birsa Agricultural University (Ranchi)'
  },
  {
    id: 'energy',
    title: 'Renewable Energy & Micro-Grids',
    icon: 'solar_power',
    color: '#ea580c',
    bg: 'rgba(234, 88, 12, 0.08)',
    border: 'rgba(234, 88, 12, 0.25)',
    description: 'Off-grid tribal school solar power, biomass briquetting, micro-hydro.',
    sampleMatchedUni: 'IIT (ISM) Dhanbad (Clean Energy Center)'
  },
  {
    id: 'healthcare',
    title: 'Rural Health & Tribal Nutrition',
    icon: 'medical_services',
    color: '#e11d48',
    bg: 'rgba(225, 29, 72, 0.08)',
    border: 'rgba(225, 29, 72, 0.25)',
    description: 'Non-invasive sickle-cell screening, vaccine cold-chain carriers, telemedicine.',
    sampleMatchedUni: 'RIMS Ranchi & BIT Mesra Bio-Engineering'
  },
  {
    id: 'education',
    title: 'Smart Education Tech (NEP 2020)',
    icon: 'school',
    color: '#7c3aed',
    bg: 'rgba(124, 58, 237, 0.08)',
    border: 'rgba(124, 58, 237, 0.25)',
    description: 'Vernacular e-learning for Santhali/Kurukh, off-grid lab kits for schools.',
    sampleMatchedUni: 'Ranchi University & NIT Jamshedpur'
  },
  {
    id: 'forest',
    title: 'Forest Produce & Livelihood Tech',
    icon: 'forest',
    color: '#059669',
    bg: 'rgba(5, 150, 105, 0.08)',
    border: 'rgba(5, 150, 105, 0.25)',
    description: 'Mechanized Mahua flower processing, lac culture temp monitors, tussar silk.',
    sampleMatchedUni: 'Indian Institute of Natural Resins & Gums (IINRG Ranchi)'
  }
];

// Jharkhand 24 Districts
const JHARKHAND_DISTRICTS = [
  'Ranchi', 'Dhanbad', 'East Singhbhum (Jamshedpur)', 'Bokaro', 'Hazaribagh',
  'Deoghar', 'Giridih', 'Dumka', 'Palamu', 'Ramgarh', 'Gumla', 'West Singhbhum (Chaibasa)',
  'Garhwa', 'Chatra', 'Koderma', 'Godda', 'Sahebganj', 'Pakur', 'Jamtara', 'Lohardaga',
  'Latehar', 'Khunti', 'Seraikela Kharsawan', 'Simdega'
];

export const ReportPortal = () => {
  const navigate = useNavigate();
  
  // Viewport mode toggle: 'responsive' (full width) or 'phone-simulator' (mobile frame)
  const [viewportMode, setViewportMode] = useState('responsive');
  
  // Multi-step state: 1: Evidence & Voice, 2: Challenge Details, 3: Location, 4: Review & Submit, 5: Success
  const [currentStep, setCurrentStep] = useState(1);

  // Form Data
  const [formData, setFormData] = useState({
    title: 'Excessive Fluoride and Arsenic in Village Drinking Wells',
    description: 'Over 14 tubewells in Bero Gram Panchayat are testing positive for high fluoride (>2.8 mg/L) and turbidity. Villagers, especially children, are developing dental mottling and joint pain. Needs low-cost decentralized membrane or nano-filtration prototype adapted for solar pumping.',
    domain: 'water',
    urgency: 'HIGH', // CRITICAL, HIGH, MODERATE
    district: 'Ranchi',
    block: 'Bero Block',
    panchayat: 'Karketta Gram Panchayat',
    impactCount: '650+ villagers & 2 primary schools',
    mediaFiles: [
      {
        id: '1',
        name: 'contaminated_well_water.jpg',
        size: '2.4 MB',
        preview: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f3?w=500&auto=format&fit=crop&q=60'
      }
    ]
  });

  // TARA AI Voice Recording Simulator
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hi'); // hi, sat, en

  // Live AI Triage State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const selectedDomainObj = THEMATIC_DOMAINS.find(d => d.id === formData.domain) || THEMATIC_DOMAINS[0];

  // Handle Voice Recording Simulation
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setVoiceTranscript('');
      setTimeout(() => {
        setVoiceTranscript(
          selectedLanguage === 'hi'
            ? '“हमारे गाँव के चापाकल में फ्लोराइड की भारी समस्या है, पानी पीने से बच्चों के दांत और घुटने खराब हो रहे हैं। कृपया कोई तकनीक समाधान दीजिए।”'
            : selectedLanguage === 'sat'
            ? '“ᱟᱞᱮ ᱟᱛᱳ ᱨᱮ ᱫᱟᱜ ᱨᱮᱱᱟᱜ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱢᱮᱱᱟᱜᱼᱟ, ᱯᱷᱞᱳᱨᱟᱭᱤᱰ ᱠᱷᱟᱹᱛᱤᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱠᱚᱥᱴᱚᱜ ᱠᱟᱱᱟ...”'
            : '“High fluoride levels detected in drinking tube wells across Bero block. We need an affordable solar filtration unit designed by engineering students.”'
        );
      }, 1600);
    } else {
      setIsRecording(false);
    }
  };

  // Add Demo Media
  const handleAddSampleImage = () => {
    if (formData.mediaFiles.length >= 3) return;
    setFormData(prev => ({
      ...prev,
      mediaFiles: [
        ...prev.mediaFiles,
        {
          id: Date.now().toString(),
          name: `field_sample_${prev.mediaFiles.length + 1}.jpg`,
          size: '3.1 MB',
          preview: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&auto=format&fit=crop&q=60'
        }
      ]
    }));
  };

  const handleRemoveMedia = (id) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter(m => m.id !== id)
    }));
  };

  // Handle Submission
  const handleSubmit = (e) => {
    e?.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setSubmittedTicket({
        id: `JH-SETU-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedLab: selectedDomainObj.sampleMatchedUni,
        status: 'SUBMITTED'
      });
      setCurrentStep(5);
    }, 1400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F3F4F6',
      color: '#111827',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* 1. Translucent Frosted Glass Apple Header */}
      <header className="apple-glass-nav" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.25s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            className="apple-pressable"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              color: '#111827'
            }}
            title="Back to Portal Home"
          >
            <GoogleIcon name="arrow_back" size={20} />
          </button>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#000000' }}>
                Setu.
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: '#E0E7FF',
                color: '#3730A3',
                letterSpacing: '0.02em'
              }}>
                SIH 26043
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
              Citizen Challenge Intake Portal • Govt. of Jharkhand
            </p>
          </div>
        </div>

        {/* Viewport / Device Switcher Simulator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.06)',
            padding: '3px',
            borderRadius: '10px'
          }}>
            <button
              onClick={() => setViewportMode('responsive')}
              className="apple-pressable"
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: '600',
                borderRadius: '8px',
                backgroundColor: viewportMode === 'responsive' ? '#FFFFFF' : 'transparent',
                color: viewportMode === 'responsive' ? '#000000' : '#4B5563',
                boxShadow: viewportMode === 'responsive' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <GoogleIcon name="desktop_windows" size={14} /> Desktop
            </button>
            <button
              onClick={() => setViewportMode('phone-simulator')}
              className="apple-pressable"
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: '600',
                borderRadius: '8px',
                backgroundColor: viewportMode === 'phone-simulator' ? '#FFFFFF' : 'transparent',
                color: viewportMode === 'phone-simulator' ? '#000000' : '#4B5563',
                boxShadow: viewportMode === 'phone-simulator' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <GoogleIcon name="smartphone" size={14} /> Mobile Phone
            </button>
          </div>
        </div>
      </header>

      {/* Main Wrapper: Responsive or Phone Frame */}
      <div style={{
        maxWidth: viewportMode === 'phone-simulator' ? '420px' : '1160px',
        margin: '0 auto',
        padding: viewportMode === 'phone-simulator' ? '1.5rem 0.5rem 3rem' : '2rem 1.5rem 4rem',
        transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
      }}>
        {viewportMode === 'phone-simulator' ? (
          /* Mobile Phone Frame Simulator */
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '40px',
            border: '8px solid #1F2937',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '820px'
          }}>
            {/* Dynamic Island / Top Notch */}
            <div style={{
              height: '28px',
              backgroundColor: '#1F2937',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ width: '88px', height: '14px', backgroundColor: '#000000', borderRadius: '12px' }}></div>
            </div>

            <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
              <ReportContent
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                formData={formData}
                setFormData={setFormData}
                isRecording={isRecording}
                toggleRecording={toggleRecording}
                voiceTranscript={voiceTranscript}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                handleAddSampleImage={handleAddSampleImage}
                handleRemoveMedia={handleRemoveMedia}
                handleSubmit={handleSubmit}
                isAnalyzing={isAnalyzing}
                submittedTicket={submittedTicket}
                selectedDomainObj={selectedDomainObj}
                isMobileFrame={true}
              />
            </div>
          </div>
        ) : (
          /* Full Desktop Layout (2-Column Hero + Interactive Card) */
          <div style={{ display: 'grid', gridTemplateColumns: currentStep === 5 ? '1fr' : '1fr 380px', gap: '2rem', alignItems: 'start' }}>
            <div style={{ width: '100%' }}>
              <ReportContent
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                formData={formData}
                setFormData={setFormData}
                isRecording={isRecording}
                toggleRecording={toggleRecording}
                voiceTranscript={voiceTranscript}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                handleAddSampleImage={handleAddSampleImage}
                handleRemoveMedia={handleRemoveMedia}
                handleSubmit={handleSubmit}
                isAnalyzing={isAnalyzing}
                submittedTicket={submittedTicket}
                selectedDomainObj={selectedDomainObj}
                isMobileFrame={false}
              />
            </div>

            {/* Desktop Real-Time Dynamic Blueprint Preview Card */}
            {currentStep !== 5 && (
              <aside style={{ position: 'sticky', top: '80px' }}>
                <div className="apple-glass-card" style={{
                  padding: '1.5rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#4B5563' }}>
                        Live Challenge Preview
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: selectedDomainObj.bg,
                      color: selectedDomainObj.color
                    }}>
                      Step {currentStep} of 4
                    </span>
                  </div>

                  {/* Thumbnail Banner */}
                  <div style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#E5E7EB',
                    position: 'relative',
                    marginBottom: '1rem'
                  }}>
                    {formData.mediaFiles[0] ? (
                      <img
                        src={formData.mediaFiles[0].preview}
                        alt="Evidence Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9CA3AF' }}>
                        <GoogleIcon name="photo_camera" size={32} />
                        <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>No media attached yet</span>
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      backdropFilter: 'blur(8px)'
                    }}>
                      {formData.mediaFiles.length} Evidence File(s)
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', lineHeight: 1.3, marginBottom: '0.35rem', color: '#111827' }}>
                      {formData.title || 'Untitled Grassroots Challenge'}
                    </h4>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#6B7280',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {formData.description || 'Describe the societal issue...'}
                    </p>
                  </div>

                  {/* Location & Impact Meta */}
                  <div style={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                      <GoogleIcon name="location_on" size={16} color="#4B5563" />
                      <span><strong>{formData.panchayat || 'Bero'}</strong>, {formData.block}, {formData.district}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                      <GoogleIcon name="groups" size={16} color="#4B5563" />
                      <span>Impact: <strong>{formData.impactCount}</strong></span>
                    </div>
                  </div>

                  {/* AI Matchmaker Box */}
                  <div style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    border: '1px dashed rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.35rem' }}>
                      <GoogleIcon name="smart_toy" size={16} color="#2563EB" />
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1D4ED8' }}>
                        AI Academic Matchmaker
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#374151', margin: 0 }}>
                      Based on NLP categorization, this issue will route to:
                    </p>
                    <div style={{
                      marginTop: '6px',
                      padding: '4px 8px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#1E40AF',
                      border: '1px solid #DBEAFE'
                    }}>
                      🎓 {selectedDomainObj.sampleMatchedUni}
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Subcomponent: The multi-step content container
const ReportContent = ({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  isRecording,
  toggleRecording,
  voiceTranscript,
  selectedLanguage,
  setSelectedLanguage,
  handleAddSampleImage,
  handleRemoveMedia,
  handleSubmit,
  isAnalyzing,
  submittedTicket,
  selectedDomainObj,
  isMobileFrame
}) => {
  return (
    <div>
      {/* 2. Apple Segmented Step Indicator */}
      {currentStep !== 5 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          backgroundColor: '#FFFFFF',
          padding: '0.6rem 1rem',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {[
            { num: 1, label: 'Evidence & Voice' },
            { num: 2, label: 'Details & Domain' },
            { num: 3, label: 'Geo Location' },
            { num: 4, label: 'AI Review' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => s.num < currentStep && setCurrentStep(s.num)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: 'none',
                background: 'transparent',
                cursor: s.num < currentStep ? 'pointer' : 'default',
                opacity: currentStep === s.num ? 1 : s.num < currentStep ? 0.8 : 0.4
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: currentStep === s.num ? '#000000' : s.num < currentStep ? '#10B981' : '#E5E7EB',
                color: currentStep === s.num || s.num < currentStep ? '#FFFFFF' : '#6B7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                {s.num < currentStep ? '✓' : s.num}
              </div>
              {!isMobileFrame && (
                <span style={{ fontSize: '0.8rem', fontWeight: currentStep === s.num ? '700' : '500', color: '#111827' }}>
                  {s.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* STEP 1: Evidence Capture & TARA Voice Assistant */}
      {currentStep === 1 && (
        <div className="apple-card-smooth" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: isMobileFrame ? '1.25rem' : '2rem',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Step 1 • Frictionless Intake
            </span>
            <h2 style={{ fontSize: isMobileFrame ? '1.4rem' : '1.8rem', fontWeight: '800', letterSpacing: '-0.02em', margin: '0.25rem 0' }}>
              Capture Evidence or Voice Your Challenge
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: 0 }}>
              Use your camera, drag-and-drop media, or speak to TARA in Hindi, Santhali, or Kurukh.
            </p>
          </div>

          {/* TARA AI Voice Assistant Interactive Widget */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A, #1E293B)',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #38BDF8, #818CF8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000'
                }}>
                  <GoogleIcon name="mic" size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0, color: '#FFFFFF' }}>
                    TARA AI Voice Assistant
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                    Regional Speech-to-Text • Low Digital Literacy Support
                  </span>
                </div>
              </div>

              {/* Language Selector */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'sat', label: 'ᱥᱟᱱᱛᱟᱲᱤ' },
                  { code: 'en', label: 'ENG' }
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setSelectedLanguage(l.code)}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: selectedLanguage === l.code ? '#38BDF8' : 'rgba(255,255,255,0.1)',
                      color: selectedLanguage === l.code ? '#0F172A' : '#E2E8F0',
                      border: 'none'
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mic Center Button with Audio Waves */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {isRecording && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <div className="tara-wave-bar tara-wave-1" style={{ width: '4px', backgroundColor: '#38BDF8', borderRadius: '4px' }}></div>
                    <div className="tara-wave-bar tara-wave-2" style={{ width: '4px', backgroundColor: '#38BDF8', borderRadius: '4px' }}></div>
                    <div className="tara-wave-bar tara-wave-3" style={{ width: '4px', backgroundColor: '#38BDF8', borderRadius: '4px' }}></div>
                  </div>
                )}

                <button
                  onClick={toggleRecording}
                  className="apple-pressable"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: isRecording ? '#EF4444' : '#38BDF8',
                    color: isRecording ? '#FFFFFF' : '#0F172A',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isRecording ? '0 0 24px rgba(239, 68, 68, 0.6)' : '0 4px 16px rgba(56, 189, 248, 0.4)'
                  }}
                >
                  <GoogleIcon name={isRecording ? 'stop' : 'mic'} size={28} />
                </button>

                {isRecording && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <div className="tara-wave-bar tara-wave-4" style={{ width: '4px', backgroundColor: '#38BDF8', borderRadius: '4px' }}></div>
                    <div className="tara-wave-bar tara-wave-5" style={{ width: '4px', backgroundColor: '#38BDF8', borderRadius: '4px' }}></div>
                    <div className="tara-wave-bar tara-wave-2" style={{ width: '4px', backgroundColor: '#38BDF8', borderRadius: '4px' }}></div>
                  </div>
                )}
              </div>

              <span style={{ fontSize: '0.8rem', color: isRecording ? '#FCA5A5' : '#CBD5E1', marginTop: '0.75rem', fontWeight: '500' }}>
                {isRecording ? 'Listening in real-time... tap to stop' : 'Tap to speak your community challenge'}
              </span>
            </div>

            {/* Real-time transcription box */}
            {voiceTranscript && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#38BDF8', fontWeight: '700' }}>LIVE SPEECH TRANSCRIPT</span>
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        title: 'Fluoride and Arsenic Contamination in Tubewells',
                        description: voiceTranscript
                      }));
                    }}
                    style={{
                      fontSize: '0.7rem',
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: 'none'
                    }}
                  >
                    Auto-Fill Challenge ➔
                  </button>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#F1F5F9', fontStyle: 'italic', margin: 0 }}>
                  {voiceTranscript}
                </p>
              </div>
            )}
          </div>

          {/* Photo & Video Evidence Upload Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827' }}>
                Field Photographs & Supporting Evidence ({formData.mediaFiles.length}/3)
              </label>
              <button
                onClick={handleAddSampleImage}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#2563EB',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                + Add Demo Sample Photo
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem' }}>
              {formData.mediaFiles.map((media) => (
                <div key={media.id} style={{
                  position: 'relative',
                  height: '110px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB'
                }}>
                  <img src={media.preview} alt={media.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => handleRemoveMedia(media.id)}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      color: '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '2px 4px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {media.name}
                  </div>
                </div>
              ))}

              {/* Upload Trigger Button */}
              {formData.mediaFiles.length < 3 && (
                <button
                  onClick={handleAddSampleImage}
                  className="apple-pressable"
                  style={{
                    height: '110px',
                    borderRadius: '12px',
                    border: '2px dashed #D1D5DB',
                    backgroundColor: '#F9FAFB',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <GoogleIcon name="add_a_photo" size={24} color="#6B7280" />
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: '600' }}>Add Photo</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setCurrentStep(2)}
              className="apple-pressable"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}
            >
              Continue to Details <GoogleIcon name="arrow_forward" size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Challenge Definition & Thematic Domains */}
      {currentStep === 2 && (
        <div className="apple-card-smooth" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: isMobileFrame ? '1.25rem' : '2rem',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Step 2 • Thematic Classification
            </span>
            <h2 style={{ fontSize: isMobileFrame ? '1.4rem' : '1.8rem', fontWeight: '800', letterSpacing: '-0.02em', margin: '0.25rem 0' }}>
              Define the Societal Challenge
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: 0 }}>
              Select the scientific or engineering domain to route this challenge to matched university labs.
            </p>
          </div>

          {/* Domain Cards Grid */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
              Thematic Domain (Aligned with NEP 2020 & SIH PS 26043)
            </label>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobileFrame ? '1fr' : 'repeat(2, 1fr)',
              gap: '0.75rem'
            }}>
              {THEMATIC_DOMAINS.map((domain) => {
                const isSelected = formData.domain === domain.id;
                return (
                  <div
                    key={domain.id}
                    onClick={() => setFormData(prev => ({ ...prev, domain: domain.id }))}
                    className="apple-pressable"
                    style={{
                      padding: '0.85rem',
                      borderRadius: '14px',
                      border: isSelected ? `2px solid ${domain.color}` : '1px solid #E5E7EB',
                      backgroundColor: isSelected ? domain.bg : '#F9FAFB',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? domain.color : 'rgba(0,0,0,0.06)',
                      color: isSelected ? '#FFFFFF' : domain.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <GoogleIcon name={domain.icon} size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
                        {domain.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px', lineHeight: 1.3 }}>
                        {domain.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Challenge Title */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '0.4rem' }}>
              Challenge Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Ground water fluoride contamination in rural tubewells"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid #D1D5DB',
                fontSize: '0.9rem',
                backgroundColor: '#F9FAFB',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Problem Statement Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '0.4rem' }}>
              Problem Description & Innovation Needed
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the current problem, existing failed attempts, and the kind of solution or research needed..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid #D1D5DB',
                fontSize: '0.9rem',
                backgroundColor: '#F9FAFB',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Urgency Gauge */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '0.4rem' }}>
              Urgency & Health/Economic Hazard
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'CRITICAL', label: '🔴 Critical Hazard', desc: 'Immediate risk to lives/drinking water' },
                { id: 'HIGH', label: '🟠 High Priority', desc: 'Severe seasonal / economic loss' },
                { id: 'MODERATE', label: '🟡 Moderate Need', desc: 'Long-term process improvement' }
              ].map((u) => (
                <button
                  key={u.id}
                  onClick={() => setFormData(prev => ({ ...prev, urgency: u.id }))}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '10px',
                    border: formData.urgency === u.id ? '2px solid #000000' : '1px solid #E5E7EB',
                    backgroundColor: formData.urgency === u.id ? '#111827' : '#F9FAFB',
                    color: formData.urgency === u.id ? '#FFFFFF' : '#374151',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => setCurrentStep(1)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="apple-pressable"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Set Location <GoogleIcon name="arrow_forward" size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Jharkhand Geo-Location & Demographics */}
      {currentStep === 3 && (
        <div className="apple-card-smooth" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: isMobileFrame ? '1.25rem' : '2rem',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Step 3 • Geographical Context
            </span>
            <h2 style={{ fontSize: isMobileFrame ? '1.4rem' : '1.8rem', fontWeight: '800', letterSpacing: '-0.02em', margin: '0.25rem 0' }}>
              Where is This Challenge Located?
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: 0 }}>
              Tag your Jharkhand district, block, and estimated beneficiary population.
            </p>
          </div>

          {/* 1-Click GPS Auto-Detection Card */}
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GoogleIcon name="my_location" size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#166534', display: 'block' }}>
                  GPS Coordinates Locked
                </span>
                <span style={{ fontSize: '0.75rem', color: '#15803D' }}>
                  23.3441° N, 85.3096° E (Accuracy: ±6m)
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                alert('GPS location updated: Ranchi District, Bero Block.');
              }}
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Re-scan GPS
            </button>
          </div>

          {/* District Dropdown */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '0.4rem' }}>
              Jharkhand District (24 Districts)
            </label>
            <select
              value={formData.district}
              onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid #D1D5DB',
                fontSize: '0.9rem',
                backgroundColor: '#F9FAFB'
              }}
            >
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Block and Panchayat Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobileFrame ? '1fr' : '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '0.4rem' }}>
                Block Name
              </label>
              <input
                type="text"
                value={formData.block}
                onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))}
                placeholder="e.g. Bero Block, Ormanjhi, Dumka Sadar"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #D1D5DB',
                  fontSize: '0.9rem',
                  backgroundColor: '#F9FAFB',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '0.4rem' }}>
                Gram Panchayat / Ward
              </label>
              <input
                type="text"
                value={formData.panchayat}
                onChange={(e) => setFormData(prev => ({ ...prev, panchayat: e.target.value }))}
                placeholder="e.g. Karketta Gram Panchayat"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #D1D5DB',
                  fontSize: '0.9rem',
                  backgroundColor: '#F9FAFB',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Estimated Community Impact */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '0.4rem' }}>
              Estimated Beneficiary Count
            </label>
            <input
              type="text"
              value={formData.impactCount}
              onChange={(e) => setFormData(prev => ({ ...prev, impactCount: e.target.value }))}
              placeholder="e.g. 500+ villagers, 140 farming families"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid #D1D5DB',
                fontSize: '0.9rem',
                backgroundColor: '#F9FAFB',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Navigation */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => setCurrentStep(2)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="apple-pressable"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: '700',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Review AI Triage <GoogleIcon name="arrow_forward" size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI Pre-Triage & University Allocation Preview */}
      {currentStep === 4 && (
        <div className="apple-card-smooth" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: isMobileFrame ? '1.25rem' : '2rem',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Step 4 • Final Validation & AI Routing
            </span>
            <h2 style={{ fontSize: isMobileFrame ? '1.4rem' : '1.8rem', fontWeight: '800', letterSpacing: '-0.02em', margin: '0.25rem 0' }}>
              Confirm & Submit to State Innovation Queue
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: 0 }}>
              Our AI engine has triaged the challenge, verified zero duplicates, and matched academic labs.
            </p>
          </div>

          {/* AI Intelligence Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobileFrame ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Deduplication Radar */}
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '16px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <GoogleIcon name="verified" size={18} color="#16A34A" />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#166534' }}>
                  AI Deduplication Check: PASSED
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#15803D', margin: 0 }}>
                Scanned 14,200+ state entries. Zero duplicate challenges in a 10km radius of {formData.block}.
              </p>
            </div>

            {/* University Matchmaker */}
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '16px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <GoogleIcon name="school" size={18} color="#2563EB" />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E40AF' }}>
                  Academic Routing Match
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#1E3A8A', margin: 0 }}>
                Matched to: <strong>{selectedDomainObj.sampleMatchedUni}</strong>
              </p>
            </div>
          </div>

          {/* Submission Summary Table */}
          <div style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#6B7280' }}>Challenge Domain</span>
              <span style={{ fontWeight: '700', color: '#111827' }}>{selectedDomainObj.title}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#6B7280' }}>Target Location</span>
              <span style={{ fontWeight: '600', color: '#111827' }}>{formData.panchayat}, {formData.block}, {formData.district}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#6B7280' }}>Urgency Rating</span>
              <span style={{ fontWeight: '700', color: formData.urgency === 'CRITICAL' ? '#DC2626' : '#D97706' }}>
                {formData.urgency}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Attached Evidence</span>
              <span style={{ fontWeight: '600', color: '#111827' }}>{formData.mediaFiles.length} file(s) attached</span>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentStep(3)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Back
            </button>

            <button
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="apple-pressable"
              style={{
                padding: '0.875rem 2.5rem',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: '800',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                opacity: isAnalyzing ? 0.7 : 1
              }}
            >
              {isAnalyzing ? (
                <>
                  <span className="material-symbols-rounded animate-spin" style={{ fontSize: '20px' }}>sync</span>
                  Transmitting to State Queue...
                </>
              ) : (
                <>
                  <GoogleIcon name="send" size={18} />
                  Submit Challenge
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Success & Live Tracking Sheet (Apple Receipt Style) */}
      {currentStep === 5 && submittedTicket && (
        <div className="apple-card-smooth" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: isMobileFrame ? '1.5rem' : '3rem',
          textAlign: 'center',
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            color: '#16A34A',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <GoogleIcon name="check_circle" size={40} />
          </div>

          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Official State Receipt Generated
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', margin: '0.5rem 0' }}>
            Societal Challenge Registered
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#6B7280', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
            Your grassroots problem has been officially accepted into the Jharkhand State Innovation Pipeline.
          </p>

          {/* Receipt Card */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px dashed #CBD5E1',
            borderRadius: '16px',
            padding: '1.25rem',
            maxWidth: '440px',
            margin: '0 auto 2rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Ticket Identifier</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F172A' }}>{submittedTicket.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Department</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#0F172A' }}>Dept. of Higher & Technical Education</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Assigned HEI Lab</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#2563EB' }}>{submittedTicket.matchedLab}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Status</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#16A34A' }}>Triaged ➔ Awaiting Nodal Sanction</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setCurrentStep(1);
                setSubmittedTicket(null);
              }}
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: '12px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Submit Another Challenge
            </button>
            <Link
              to="/"
              className="apple-pressable"
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '12px',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Back to Ecosystem Hub <GoogleIcon name="home" size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
