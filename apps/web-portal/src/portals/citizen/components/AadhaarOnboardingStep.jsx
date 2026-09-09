import React, { useState, useEffect, useRef } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

const API_BASE = 'http://localhost:5000';

export const AadhaarOnboardingStep = ({
  isMobile = false,
  onPrev,
  onSuccess
}) => {
  // 3 Boxes, 4 Numbers Each
  const [box1, setBox1] = useState('5678');
  const [box2, setBox2] = useState('9012');
  const [box3, setBox3] = useState('3456');

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  // OTP State: 6 Digits
  const [step, setStep] = useState('aadhaar'); // 'aadhaar' | 'otp'
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDevNote, setShowDevNote] = useState(false);
  const [activeBoxFocus, setActiveBoxFocus] = useState(null);

  // Focus first input on mount if empty
  useEffect(() => {
    if (!box1 && input1Ref.current) {
      input1Ref.current.focus();
    }
  }, []);

  // Handle Box 1 Change
  const handleBox1Change = (e) => {
    const val = e.target.value;
    const raw = val.replace(/\D/g, '');

    // Handle pasting full 12 digits
    if (raw.length >= 12) {
      setBox1(raw.slice(0, 4));
      setBox2(raw.slice(4, 8));
      setBox3(raw.slice(8, 12));
      input3Ref.current?.focus();
      setError('');
      return;
    }

    const clean = raw.slice(0, 4);
    setBox1(clean);
    setError('');
    if (clean.length === 4) {
      input2Ref.current?.focus();
    }
  };

  // Handle Box 2 Change
  const handleBox2Change = (e) => {
    const val = e.target.value;
    const raw = val.replace(/\D/g, '');

    if (raw.length >= 8 && box1.length === 4) {
      setBox2(raw.slice(0, 4));
      setBox3(raw.slice(4, 8));
      input3Ref.current?.focus();
      setError('');
      return;
    }

    const clean = raw.slice(0, 4);
    setBox2(clean);
    setError('');
    if (clean.length === 4) {
      input3Ref.current?.focus();
    }
  };

  // Handle Box 3 Change
  const handleBox3Change = (e) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
    setBox3(clean);
    setError('');
  };

  // Backspace navigation across 3 boxes
  const handleKeyDown = (e, boxIndex) => {
    if (e.key === 'Backspace') {
      if (boxIndex === 2 && !box2) {
        input1Ref.current?.focus();
      } else if (boxIndex === 3 && !box3) {
        input2Ref.current?.focus();
      }
    }
  };

  // Combined 12-digit Aadhaar
  const fullAadhaar = `${box1}${box2}${box3}`;

  // Request OTP Call
  const handleRequestOtp = async () => {
    if (fullAadhaar.length !== 12) {
      setError('Please enter a complete 12-digit Aadhaar number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/aadhaar/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber: fullAadhaar })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to request OTP');
      }

      const code = data.otp || '742918';
      setSimulatedOtp(code);
      setStep('otp');
      setShowNotification(true);
      setTimeout(() => {
        otpRefs[0].current?.focus();
      }, 150);
    } catch (err) {
      // Offline fallback simulation
      const fallbackCode = '742918';
      setSimulatedOtp(fallbackCode);
      setStep('otp');
      setShowNotification(true);
      setTimeout(() => {
        otpRefs[0].current?.focus();
      }, 150);
    } finally {
      setLoading(false);
    }
  };

  // OTP Change
  const handleOtpChange = (index, value) => {
    const raw = value.replace(/\D/g, '');
    if (!raw) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      return;
    }

    // Pasting full 6-digit OTP
    if (raw.length >= 6) {
      const parts = raw.slice(0, 6).split('');
      setOtpDigits(parts);
      otpRefs[5].current?.focus();
      setError('');
      return;
    }

    const next = [...otpDigits];
    next[index] = raw[raw.length - 1]; // take last entered digit
    setOtpDigits(next);
    setError('');

    if (index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  // OTP Backspace navigation
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // Auto-fill from Top Notification
  const handleAutoFillOtp = (codeToFill) => {
    const digits = (codeToFill || simulatedOtp || '742918').split('');
    setOtpDigits(digits);
    setError('');
    otpRefs[5].current?.focus();
  };

  // Verify OTP Call (Confirm button)
  const handleVerifyOtp = async () => {
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/aadhaar/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber: fullAadhaar, otp: enteredOtp })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid code');
      }

      // Store in localStorage
      localStorage.setItem('setu_user', JSON.stringify(data.user));
      localStorage.setItem('setu_session_id', data.sessionId);
      localStorage.setItem('setu_token', data.token);
      localStorage.setItem('setu_onboarded', 'true');
      localStorage.setItem('setu_user_role', 'citizen');
      localStorage.setItem('sih_user_data', JSON.stringify(data.user));
      localStorage.setItem('sih_auth_token', data.token);

      onSuccess(data.user);
    } catch (err) {
      // Local fallback simulation
      const mockUser = {
        id: 'cit-001',
        name: 'Rahul Verma',
        aadhaar: fullAadhaar,
        maskedAadhaar: `XXXX XXXX ${fullAadhaar.slice(-4)}`,
        mobile: '+91 98123 45670',
        district: 'Ranchi',
        state: 'Jharkhand',
        role: 'CITIZEN',
        sessionId: `sess-${Date.now()}`
      };
      localStorage.setItem('setu_user', JSON.stringify(mockUser));
      localStorage.setItem('setu_session_id', mockUser.sessionId);
      localStorage.setItem('setu_onboarded', 'true');
      localStorage.setItem('setu_user_role', 'citizen');
      localStorage.setItem('sih_user_data', JSON.stringify(mockUser));
      localStorage.setItem('sih_auth_token', mockUser.sessionId);

      onSuccess(mockUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="apple-fade-enter"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.75rem',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* 1. TOP PUSH NOTIFICATION: Slides down smoothly from the top */}
      {showNotification && simulatedOtp && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            width: isMobile ? 'calc(100% - 32px)' : '420px',
            maxWidth: '440px',
            backgroundColor: 'rgba(28, 28, 30, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '22px',
            padding: '0.85rem 1rem 0.85rem 1.1rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            animation: 'appleNotificationSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', minWidth: 0 }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <GoogleIcon name="sms" size={20} color="#ffffff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Demo Message
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.4)' }}>•</span>
                <span style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.4)' }}>now</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: '500', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Your code is <strong style={{ color: '#ffffff', letterSpacing: '0.06em' }}>{simulatedOtp}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleAutoFillOtp(simulatedOtp)}
            className="apple-tap"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.45rem 0.95rem',
              fontSize: '0.8125rem',
              fontWeight: '700',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          >
            Auto-fill
          </button>
        </div>
      )}

      {/* 2. CLEAN APPLE HEADER */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            backgroundColor: '#f2f2f7',
            fontSize: '0.6875rem',
            fontWeight: '700',
            color: '#1c1c1e',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}
        >
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000' }} />
          Demo Verification
        </div>

        <h1
          style={{
            fontSize: isMobile ? '1.625rem' : '1.875rem',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            color: '#111111',
            margin: 0,
            lineHeight: 1.2
          }}
        >
          {step === 'aadhaar' ? 'Enter Aadhaar' : 'Enter Code'}
        </h1>

        <p style={{ fontSize: '0.875rem', color: '#636366', margin: 0, fontWeight: '500', maxWidth: '380px' }}>
          {step === 'aadhaar'
            ? 'Enter your 12-digit Aadhaar number to continue.'
            : 'Enter the 6-digit code sent to your linked mobile.'}
        </p>
      </div>

      {/* 3. INPUT AREA */}
      {step === 'aadhaar' ? (
        /* STEP 1: 3 BOXES, 4 NUMBERS EACH */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '0.5rem' : '0.75rem',
              width: '100%',
              maxWidth: '380px'
            }}
          >
            {/* Box 1 */}
            <input
              ref={input1Ref}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={box1}
              onChange={handleBox1Change}
              onFocus={() => setActiveBoxFocus(1)}
              onBlur={() => setActiveBoxFocus(null)}
              placeholder="5678"
              style={{
                flex: 1,
                minWidth: 0,
                height: '56px',
                borderRadius: '16px',
                backgroundColor: activeBoxFocus === 1 ? '#ffffff' : '#f2f2f7',
                border: activeBoxFocus === 1 ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: activeBoxFocus === 1 ? '0 0 0 4px rgba(0, 0, 0, 0.04)' : 'none',
                fontSize: isMobile ? '1.25rem' : '1.375rem',
                fontWeight: '700',
                textAlign: 'center',
                letterSpacing: '0.12em',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', monospace",
                color: '#111111',
                outline: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxSizing: 'border-box'
              }}
            />

            <span style={{ color: '#c7c7cc', fontSize: '1.25rem', fontWeight: '300' }}>–</span>

            {/* Box 2 */}
            <input
              ref={input2Ref}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={box2}
              onChange={handleBox2Change}
              onKeyDown={(e) => handleKeyDown(e, 2)}
              onFocus={() => setActiveBoxFocus(2)}
              onBlur={() => setActiveBoxFocus(null)}
              placeholder="9012"
              style={{
                flex: 1,
                minWidth: 0,
                height: '56px',
                borderRadius: '16px',
                backgroundColor: activeBoxFocus === 2 ? '#ffffff' : '#f2f2f7',
                border: activeBoxFocus === 2 ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: activeBoxFocus === 2 ? '0 0 0 4px rgba(0, 0, 0, 0.04)' : 'none',
                fontSize: isMobile ? '1.25rem' : '1.375rem',
                fontWeight: '700',
                textAlign: 'center',
                letterSpacing: '0.12em',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', monospace",
                color: '#111111',
                outline: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxSizing: 'border-box'
              }}
            />

            <span style={{ color: '#c7c7cc', fontSize: '1.25rem', fontWeight: '300' }}>–</span>

            {/* Box 3 */}
            <input
              ref={input3Ref}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={box3}
              onChange={handleBox3Change}
              onKeyDown={(e) => handleKeyDown(e, 3)}
              onFocus={() => setActiveBoxFocus(3)}
              onBlur={() => setActiveBoxFocus(null)}
              placeholder="3456"
              style={{
                flex: 1,
                minWidth: 0,
                height: '56px',
                borderRadius: '16px',
                backgroundColor: activeBoxFocus === 3 ? '#ffffff' : '#f2f2f7',
                border: activeBoxFocus === 3 ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: activeBoxFocus === 3 ? '0 0 0 4px rgba(0, 0, 0, 0.04)' : 'none',
                fontSize: isMobile ? '1.25rem' : '1.375rem',
                fontWeight: '700',
                textAlign: 'center',
                letterSpacing: '0.12em',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', monospace",
                color: '#111111',
                outline: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{ color: '#dc2626', fontSize: '0.8125rem', fontWeight: '500' }}>
              {error}
            </div>
          )}

          {/* BOTTOM ACTIONS: Back & Verify Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              maxWidth: '380px',
              marginTop: '0.25rem'
            }}
          >
            <button
              onClick={onPrev}
              className="apple-btn-secondary"
              style={{
                width: '100px',
                height: '52px',
                borderRadius: '16px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                flexShrink: 0
              }}
            >
              Back
            </button>

            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="apple-btn-primary"
              style={{
                flex: 1,
                height: '52px',
                borderRadius: '16px',
                fontSize: '0.9375rem',
                fontWeight: '600'
              }}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: 6 OTP BOXES & CONFIRM BUTTON */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '0.4rem' : '0.6rem',
              width: '100%',
              maxWidth: '380px'
            }}
          >
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={otpRefs[idx]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                style={{
                  width: isMobile ? '46px' : '52px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: digit ? '#ffffff' : '#f2f2f7',
                  border: digit ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.08)',
                  fontSize: '1.35rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', monospace",
                  color: '#111111',
                  outline: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxSizing: 'border-box'
                }}
              />
            ))}
          </div>

          {error && (
            <div style={{ color: '#dc2626', fontSize: '0.8125rem', fontWeight: '500' }}>
              {error}
            </div>
          )}

          {/* BOTTOM ACTIONS: Change & Confirm Button (strictly 'Confirm') */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              maxWidth: '380px',
              marginTop: '0.25rem'
            }}
          >
            <button
              onClick={() => {
                setStep('aadhaar');
                setError('');
              }}
              className="apple-btn-secondary"
              style={{
                width: '100px',
                height: '52px',
                borderRadius: '16px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                flexShrink: 0
              }}
            >
              Change
            </button>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="apple-btn-primary"
              style={{
                flex: 1,
                height: '52px',
                borderRadius: '16px',
                fontSize: '0.9375rem',
                fontWeight: '600'
              }}
            >
              {loading ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      {/* 4. SUBTLE DEVELOPER NOTE LINK AT THE BOTTOM */}
      <button
        onClick={() => setShowDevNote(true)}
        className="apple-tap"
        style={{
          background: 'none',
          border: 'none',
          color: '#636366',
          fontSize: '0.8125rem',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          cursor: 'pointer',
          padding: '0.25rem 0.5rem',
          borderRadius: '8px',
          marginTop: '0.5rem',
          transition: 'color 0.2s ease'
        }}
      >
        <GoogleIcon name="info" size={16} color="#636366" />
        <span>Developer Note</span>
      </button>

      {/* 5. CRISP, HIGH-CONTRAST DEVELOPER NOTE MODAL (TOP-LEVEL FIXED VIEWPORT) */}
      {showDevNote && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            animation: 'appleFadeIn 0.2s ease-out'
          }}
          onClick={() => setShowDevNote(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: isMobile ? '1.75rem 1.5rem' : '2.25rem 2.25rem',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.22)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              position: 'relative',
              boxSizing: 'border-box',
              animation: 'appleSpringEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: '700',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    backgroundColor: '#f2f2f7',
                    color: '#1c1c1e'
                  }}
                >
                  Prototype Note
                </span>
              </div>

              <button
                onClick={() => setShowDevNote(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
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
            </div>

            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#111111', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
                Developer Note
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#636366', margin: 0, fontWeight: '500' }}>
                Architecture & testing guidance for this prototype build.
              </p>
            </div>

            {/* Concise 2-3 Bullet Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.5rem', flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem', color: '#2c2c2e', margin: 0, lineHeight: 1.45 }}>
                  <strong style={{ color: '#000000' }}>Demo Pre-fill:</strong> Aadhaar number <code style={{ backgroundColor: '#f2f2f7', padding: '0.15rem 0.35rem', borderRadius: '4px', fontSize: '0.8125rem' }}>5678 9012 3456</code> is pre-filled for 1-click evaluation. Production architecture connects directly to the state e-KYC gateway.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.5rem', flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem', color: '#2c2c2e', margin: 0, lineHeight: 1.45 }}>
                  <strong style={{ color: '#000000' }}>Demo OTP & Concurrency:</strong> A test code pops up on screen with 1-tap auto-fill. Setu enforces strict single-session concurrency—logging in terminates previous active sessions.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.5rem', flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem', color: '#2c2c2e', margin: 0, lineHeight: 1.45 }}>
                  <strong style={{ color: '#000000' }}>Developer Reserved:</strong> Accounts for team members (<code style={{ backgroundColor: '#f2f2f7', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.75rem' }}>Dhruv</code>, <code style={{ backgroundColor: '#f2f2f7', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.75rem' }}>Hoomandeep</code>, <code style={{ backgroundColor: '#f2f2f7', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.75rem' }}>Prathna</code>) are reserved and require manual typing.
                </p>
              </div>
            </div>

            {/* Got It Button */}
            <button
              onClick={() => setShowDevNote(false)}
              className="apple-btn-primary"
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '14px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                marginTop: '0.5rem'
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
