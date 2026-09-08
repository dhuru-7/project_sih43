import React, { useState, useEffect } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const TaraCopilotModal = ({ isOpen, onClose, onDraftReport }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [activeVoicePromptIndex, setActiveVoicePromptIndex] = useState(0);

  const sampleVoicePrompts = [
    'हमार गांव के मुख्य चापाकल से गंदा और फ्लोराइड युक्त पानी आ रहा है...',
    'Sudden leaf blight disease destroying standing paddy crops in Govindpur...',
    'Primary Health Centre lacks cold-chain power backup for essential vaccines...',
    'Erratic high voltage fluctuation damaged community solar water pump...'
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate speech-to-text intake
      const timer = setTimeout(() => {
        setInputText(sampleVoicePrompts[activeVoicePromptIndex % sampleVoicePrompts.length]);
        setActiveVoicePromptIndex((prev) => prev + 1);
        setIsRecording(false);
      }, 2200);
      return () => clearTimeout(timer);
    } else {
      setIsRecording(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInputText(promptText);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="apple-modal-content"
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.24), 0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '0.75rem',
                backgroundColor: '#000000',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <GoogleIcon name="auto_awesome" size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1a1c1c', letterSpacing: '-0.01em' }}>
                  TARA AI Civic Assistant
                </h3>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: '#eeeeee',
                    color: '#1a1c1c',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px'
                  }}
                >
                  Intelligent Intake
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#5e5e5e', marginTop: '0.125rem' }}>
                Natural language & multilingual civic grievance transcription
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="apple-tap"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              backgroundColor: '#f3f3f3',
              color: '#5e5e5e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
            aria-label="Close modal"
          >
            <GoogleIcon name="close" size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Language Selection */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#4c4546' }}>
              Select Audio / Input Language:
            </span>
            <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: '#f3f3f3', padding: '0.25rem', borderRadius: '0.625rem' }}>
              {[
                { id: 'hi', label: 'हिन्दी' },
                { id: 'sat', label: 'ᱥᱟᱱᱛᱟᱲᱤ' },
                { id: 'en', label: 'English' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className="apple-pill-tap"
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: selectedLanguage === lang.id ? '700' : '500',
                    backgroundColor: selectedLanguage === lang.id ? '#ffffff' : 'transparent',
                    color: selectedLanguage === lang.id ? '#000000' : '#5e5e5e',
                    boxShadow: selectedLanguage === lang.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Assistant Interaction Card */}
          <div
            style={{
              backgroundColor: '#1b1b1b',
              color: '#ffffff',
              borderRadius: '1rem',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <button
                onClick={toggleRecording}
                className="apple-tap"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '9999px',
                  backgroundColor: isRecording ? '#ba1a1a' : '#ffffff',
                  color: isRecording ? '#ffffff' : '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: isRecording ? '0 0 20px rgba(186, 26, 26, 0.6)' : '0 4px 14px rgba(255, 255, 255, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                aria-label={isRecording ? 'Stop listening' : 'Start speaking with TARA AI'}
              >
                <GoogleIcon name={isRecording ? 'graphic_eq' : 'mic'} size={26} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: '700' }}>
                    {isRecording ? 'Listening to your voice...' : 'Tap Mic to Speak with TARA'}
                  </span>
                  {isRecording && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '14px' }}>
                      <span className="tara-wave-bar" style={{ animationDelay: '0.1s', height: '14px' }}></span>
                      <span className="tara-wave-bar" style={{ animationDelay: '0.3s', height: '18px' }}></span>
                      <span className="tara-wave-bar" style={{ animationDelay: '0.2s', height: '12px' }}></span>
                      <span className="tara-wave-bar" style={{ animationDelay: '0.4s', height: '16px' }}></span>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#848484', marginTop: '0.15rem' }}>
                  TARA automatically transcribes in Hindi, Santhali, or English
                </p>
              </div>
            </div>
          </div>

          {/* Text Input Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#1a1c1c' }}>
              Describe what happened in your community:
            </label>
            <div
              style={{
                backgroundColor: '#f3f3f3',
                borderRadius: '0.875rem',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '0.875rem 1rem',
                transition: 'border-color 0.2s ease'
              }}
            >
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. Drinking tubewell water turning muddy with high fluoride in Bero block, or sudden leaf blight in crops..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '0.9375rem',
                  color: '#1a1c1c',
                  lineHeight: '1.45',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Quick Issue Example Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#7e7576', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Templates:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {[
                '💧 Fluoride in drinking tubewell',
                '⚡ Solar pump inverter tripping',
                '🌾 Paddy crop pest infestation',
                '🏥 Vaccine cold-storage power drop'
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(item)}
                  className="apple-pill-tap"
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: '#eeeeee',
                    color: '#1a1c1c',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    border: '1px solid rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer'
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#f9f9f9',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#5e5e5e', fontSize: '0.75rem' }}>
            <GoogleIcon name="lock" size={14} />
            <span>Encrypted Civic Intake</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={onClose}
              className="apple-tap"
              style={{
                padding: '0.625rem 1rem',
                borderRadius: '0.625rem',
                backgroundColor: 'transparent',
                color: '#1a1c1c',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onDraftReport) onDraftReport(inputText);
                onClose();
              }}
              className="apple-tap"
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.625rem',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              <span>Draft Report</span>
              <GoogleIcon name="arrow_forward" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
