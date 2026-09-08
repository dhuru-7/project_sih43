import React, { useState, useRef, useEffect } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { TaraStarIcon } from '../../../components/ui/TaraStarIcon';

export const TaraSidechat = ({ onDraftReport, onOpenIssueDetail, issues = [] }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'tara',
      text: 'Namaste! I am TARA, your grassroots AI copilot. Tell me what issue your village or town is facing, or ask about existing projects in your area.',
      time: 'Just now',
      suggestions: [
        '💧 Drinking tubewell water contaminated',
        '🌾 Paddy crop pest / blight in my field',
        '⚡ Solar micro-grid inverter tripping',
        '📊 Track status of #SETU-8821'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi / Regional');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // AI Response generation
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = '';
      let canDraft = false;
      let draftPayload = text;

      if (lower.includes('water') || lower.includes('tubewell') || lower.includes('पानी') || lower.includes('fluoride')) {
        replyText =
          'I understand you are facing a critical drinking water issue. This aligns with Clean Water & Sanitation R&D. BIT Mesra’s Water Quality & Filtration Lab actively investigates fluoride and heavy metals in Jharkhand borewells.';
        canDraft = true;
        draftPayload = 'High fluoride & iron contamination in village tubewells: ' + text;
      } else if (lower.includes('crop') || lower.includes('paddy') || lower.includes('pest') || lower.includes('फसल') || lower.includes('धान')) {
        replyText =
          'I have recorded the crop symptom details. Birsa Agricultural University (BAU) Agritech teams have field pilots for biological pest control and early fungal blight detection.';
        canDraft = true;
        draftPayload = 'Paddy crop disease & leaf pest infestation: ' + text;
      } else if (lower.includes('solar') || lower.includes('inverter') || lower.includes('बिजली') || lower.includes('power')) {
        replyText =
          'Solar micro-grid stability issues in rural hamlets are mapped to IIT ISM Dhanbad Clean Energy Lab for smart inverter diagnostics and battery storage.';
        canDraft = true;
        draftPayload = 'Solar micro-grid inverter breakdown at village facility: ' + text;
      } else if (lower.includes('8821') || lower.includes('status') || lower.includes('track')) {
        replyText =
          'Problem #SETU-8821 (Fluoride & Iron in Bero Block) is currently Under Nodal Review. BIT Mesra Water Lab has submitted a preliminary filtration prototype proposal with DHTE sanction.';
        canDraft = false;
      } else {
        replyText =
          'Thank you for reporting this issue. I have indexed the problem characteristics for Jharkhand technical review. Would you like me to register this as an official community report?';
        canDraft = true;
      }

      const taraReply = {
        id: Date.now() + 1,
        sender: 'tara',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        canDraft,
        draftPayload
      };

      setMessages((prev) => [...prev, taraReply]);
      setIsTyping(false);
    }, 750);
  };

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        const sampleSpoken = 'हमार गांव के मुख्य चापाकल से गंदा और फ्लोराइड युक्त पानी आ रहा है...';
        setInputValue(sampleSpoken);
        setIsRecording(false);
      }, 2200);
    } else {
      setIsRecording(false);
    }
  };

  const handleDraftAction = (payload) => {
    if (onDraftReport) {
      onDraftReport(payload);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tara',
          text: '✅ Your issue has been drafted and added to "My Submissions"! Nodal officers and university labs will review the problem details.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'tara',
        text: 'Chat reset. Namaste! How can I assist your village or community today?',
        time: 'Just now',
        suggestions: [
          '💧 Drinking tubewell water contaminated',
          '🌾 Paddy crop pest / blight in my field',
          '⚡ Solar micro-grid inverter tripping'
        ]
      }
    ]);
  };

  return (
    <aside
      aria-label="TARA AI Copilot"
      style={{
        width: '380px',
        minWidth: '340px',
        maxWidth: '420px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: '#ffffff',
        borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.02)',
        zIndex: 40,
        flexShrink: 0
      }}
    >
      {/* 1. Sidechat Header: Sidemenu Style */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* TARA Icon Avatar with user-provided Star SVG */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.18)',
              flexShrink: 0
            }}
          >
            <TaraStarIcon size={20} color="#ffffff" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#1a1c1c', letterSpacing: '-0.015em' }}>
                TARA Copilot
              </span>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px #10b981'
                }}
                title="Online & Ready"
              />
            </div>
            <span style={{ fontSize: '0.6875rem', color: '#7e7576', fontWeight: '500' }}>
              Grassroots AI · Voice & Dialects
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={handleResetChat}
            className="apple-tap"
            title="Reset conversation"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f4f4f5',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#5e5e5e'
            }}
          >
            <GoogleIcon name="refresh" size={17} />
          </button>
        </div>
      </div>

      {/* 2. Messages Stream */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: '#fafafa'
        }}
      >
        {messages.map((msg) => {
          const isTara = msg.sender === 'tara';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isTara ? 'flex-start' : 'flex-end',
                gap: '0.35rem',
                maxWidth: '92%',
                alignSelf: isTara ? 'flex-start' : 'flex-end'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  flexDirection: isTara ? 'row' : 'row-reverse'
                }}
              >
                {isTara && (
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                      flexShrink: 0
                    }}
                  >
                    <TaraStarIcon size={14} color="#ffffff" />
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: isTara ? '#ffffff' : '#000000',
                    color: isTara ? '#1a1c1c' : '#ffffff',
                    padding: '0.75rem 0.95rem',
                    borderRadius: isTara ? '0.25rem 1rem 1rem 1rem' : '1rem 0.25rem 1rem 1rem',
                    fontSize: '0.84375rem',
                    lineHeight: 1.45,
                    boxShadow: isTara ? '0 2px 8px rgba(0, 0, 0, 0.04)' : '0 2px 8px rgba(0, 0, 0, 0.12)',
                    border: isTara ? '1px solid rgba(0, 0, 0, 0.06)' : 'none'
                  }}
                >
                  <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{msg.text}</p>

                  {/* Optional Draft Action Button */}
                  {msg.canDraft && (
                    <button
                      onClick={() => handleDraftAction(msg.draftPayload)}
                      className="apple-tap"
                      style={{
                        marginTop: '0.625rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <GoogleIcon name="add_circle" size={14} color="#ffffff" />
                      <span>Draft as My Submission</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Suggestions Pills if present */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.35rem', width: '100%' }}>
                  <span style={{ fontSize: '0.6875rem', color: '#7e7576', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Suggested Prompts:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {msg.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(suggestion)}
                        className="apple-tap"
                        style={{
                          textAlign: 'left',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '0.625rem',
                          backgroundColor: '#ffffff',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          color: '#1a1c1c',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                          lineHeight: 1.3
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <span style={{ fontSize: '0.6875rem', color: '#a1a1aa', margin: '0 0.25rem' }}>
                {msg.time}
              </span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <TaraStarIcon size={14} color="#ffffff" />
            </div>
            <div
              style={{
                padding: '0.6rem 0.85rem',
                backgroundColor: '#ffffff',
                borderRadius: '0.25rem 1rem 1rem 1rem',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                gap: '0.3rem',
                alignItems: 'center'
              }}
            >
              <span className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#000000' }} />
              <span className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#000000', animationDelay: '0.2s' }} />
              <span className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#000000', animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Sidechat Input Area */}
      <div
        style={{
          padding: '0.875rem 1rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        {isRecording && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.35rem 0.75rem',
              backgroundColor: '#fee2e2',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              color: '#991b1b',
              fontWeight: '600'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626', animation: 'pulse 1s infinite' }} />
              Listening to voice in Hindi / Regional...
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#b91c1c' }}>Speak now</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#f4f4f5',
            borderRadius: '9999px',
            padding: '0.35rem 0.35rem 0.35rem 0.875rem',
            border: '1px solid rgba(0, 0, 0, 0.06)'
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask TARA or describe an issue..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.84375rem',
              color: '#1a1c1c',
              fontFamily: 'inherit'
            }}
          />

          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className="apple-tap"
            title={isRecording ? 'Stop recording' : 'Speak to TARA in your dialect'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isRecording ? '#dc2626' : '#ffffff',
              color: isRecording ? '#ffffff' : '#1a1c1c',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <GoogleIcon name={isRecording ? 'mic' : 'mic_none'} size={17} color={isRecording ? '#ffffff' : '#1a1c1c'} />
          </button>

          {/* Send Button with Star Icon Accent */}
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="apple-tap"
            title="Send to TARA"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: inputValue.trim() ? '#000000' : '#e4e4e7',
              color: inputValue.trim() ? '#ffffff' : '#a1a1aa',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputValue.trim() ? 'pointer' : 'default',
              flexShrink: 0,
              transition: 'background-color 0.15s ease'
            }}
          >
            <GoogleIcon name="arrow_upward" size={18} color={inputValue.trim() ? '#ffffff' : '#a1a1aa'} />
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
          <span style={{ fontSize: '0.6875rem', color: '#a1a1aa' }}>
            Hindi · Santhali · Kurukh · English
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#71717a', fontWeight: '500' }}>
            SETU AI Bridge
          </span>
        </div>
      </div>
    </aside>
  );
};
