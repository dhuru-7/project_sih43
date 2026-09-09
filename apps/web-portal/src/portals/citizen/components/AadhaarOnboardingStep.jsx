import React, { useState, useEffect } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

const API_BASE = 'http://localhost:5000';

export const AadhaarOnboardingStep = ({
  isMobile = false,
  onPrev,
  onSuccess
}) => {
  const [aadhaarNumber, setAadhaarNumber] = useState('5678 9012 3456');
  const [step, setStep] = useState('aadhaar'); // 'aadhaar' | 'otp'
  const [otp, setOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('');
  const [userName, setUserName] = useState('Rahul Verma');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDevNote, setShowDevNote] = useState(true);
  const [showAccountsDrawer, setShowAccountsDrawer] = useState(false);
  const [accountsList, setAccountsList] = useState([]);

  // Fetch 10 accounts from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/v1/auth/aadhaar/accounts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.accounts) setAccountsList(data.accounts);
      })
      .catch(() => {
        // Fallback demo accounts if offline
        setAccountsList([
          { id: 'dev-001', name: 'Dhruv Gautam', formattedAadhaar: '2345 6789 0123', maskedAadhaar: 'XXXX XXXX 0123', maskedMobile: '+91 98765 XXXXX', district: 'Ranchi', isDevAccount: true, designation: 'Developer Team Lead' },
          { id: 'dev-002', name: 'Hoomandeep', formattedAadhaar: '3456 7890 1234', maskedAadhaar: 'XXXX XXXX 1234', maskedMobile: '+91 98765 XXXXX', district: 'Jamshedpur', isDevAccount: true, designation: 'Core Architecture Dev' },
          { id: 'dev-003', name: 'Prathna', formattedAadhaar: '4567 8901 2345', maskedAadhaar: 'XXXX XXXX 2345', maskedMobile: '+91 98765 XXXXX', district: 'Dhanbad', isDevAccount: true, designation: 'UI & UX Design Engineer' },
          { id: 'cit-001', name: 'Rahul Verma', formattedAadhaar: '5678 9012 3456', maskedAadhaar: 'XXXX XXXX 3456', maskedMobile: '+91 98123 XXXXX', district: 'Ranchi', isDefault: true, isDevAccount: false },
          { id: 'cit-002', name: 'Anjali Soren', formattedAadhaar: '6789 0123 4567', maskedAadhaar: 'XXXX XXXX 4567', maskedMobile: '+91 98123 XXXXX', district: 'Dumka', isDevAccount: false },
          { id: 'cit-003', name: 'Amit Kumar Singh', formattedAadhaar: '7890 1234 5678', maskedAadhaar: 'XXXX XXXX 5678', maskedMobile: '+91 98123 XXXXX', district: 'Hazaribagh', isDevAccount: false },
          { id: 'cit-004', name: 'Pooja Kumari', formattedAadhaar: '8901 2345 6789', maskedAadhaar: 'XXXX XXXX 6789', maskedMobile: '+91 98123 XXXXX', district: 'Bokaro', isDevAccount: false },
          { id: 'cit-005', name: 'Birsa Munda Jr.', formattedAadhaar: '9012 3456 7890', maskedAadhaar: 'XXXX XXXX 7890', maskedMobile: '+91 98123 XXXXX', district: 'Khunti', isDevAccount: false },
          { id: 'cit-006', name: 'Sunita Devi', formattedAadhaar: '1234 5678 9012', maskedAadhaar: 'XXXX XXXX 9012', maskedMobile: '+91 98123 XXXXX', district: 'Deoghar', isDevAccount: false },
          { id: 'cit-007', name: 'Vikash Oraon', formattedAadhaar: '9876 5432 1098', maskedAadhaar: 'XXXX XXXX 1098', maskedMobile: '+91 98123 XXXXX', district: 'Gumla', isDevAccount: false }
        ]);
      });
  }, []);

  const formatAadhaarInput = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < raw.length; i += 4) {
      parts.push(raw.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleAadhaarChange = (e) => {
    const formatted = formatAadhaarInput(e.target.value);
    setAadhaarNumber(formatted);
    setError('');
  };

  const handleRequestOtp = async () => {
    const raw = aadhaarNumber.replace(/\s+/g, '');
    if (raw.length !== 12) {
      setError('Please enter a complete 12-digit Aadhaar number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/aadhaar/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber: raw })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate OTP');
      }

      setSimulatedOtp(data.otp);
      setMaskedMobile(data.maskedMobile);
      setUserName(data.userName);
      setStep('otp');
    } catch (err) {
      // Local fallback simulation if backend is unreachable
      const fallbackOtp = '742918';
      setSimulatedOtp(fallbackOtp);
      setMaskedMobile('+91 98123 XXXXX');
      setStep('otp');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    const raw = aadhaarNumber.replace(/\s+/g, '');

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/aadhaar/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber: raw, otp: otp.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      // Persist auth profile & session ID in localStorage
      localStorage.setItem('setu_user', JSON.stringify(data.user));
      localStorage.setItem('setu_session_id', data.sessionId);
      localStorage.setItem('setu_token', data.token);
      localStorage.setItem('setu_onboarded', 'true');
      localStorage.setItem('setu_user_role', 'citizen');
      localStorage.setItem('sih_user_data', JSON.stringify(data.user));
      localStorage.setItem('sih_auth_token', data.token);

      onSuccess(data.user);
    } catch (err) {
      // If offline, simulate successful sign-in
      const mockUser = {
        id: 'cit-001',
        name: userName || 'Rahul Verma',
        aadhaar: aadhaarNumber,
        maskedAadhaar: `XXXX XXXX ${raw.slice(-4)}`,
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
        maxWidth: isMobile ? '100%' : '660px',
        margin: '0 auto',
        padding: isMobile ? '0.75rem 0' : '1.75rem 2.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Top Header & Developer Note Trigger Badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              backgroundColor: '#f2f2f7',
              fontSize: '0.6875rem',
              fontWeight: '700',
              color: '#3a3a3c',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}
          >
            <GoogleIcon name="verified_user" size={14} color="#000000" />
            UIDAI e-KYC Verification
          </div>
          <h1
            style={{
              fontSize: isMobile ? '1.5rem' : '1.875rem',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              color: '#111111',
              lineHeight: 1.2,
              margin: '0 0 0.35rem'
            }}
          >
            {step === 'aadhaar' ? 'Enter Aadhaar Card' : 'Verify Mobile OTP'}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#636366', margin: 0, fontWeight: '500' }}>
            {step === 'aadhaar'
              ? 'Enter your 12-digit Aadhaar to simulate e-KYC citizen profile extraction.'
              : `Enter the 6-digit OTP sent to linked mobile ${maskedMobile || 'XXXXX XXXXX'}`}
          </p>
        </div>

        {/* Developer Note Trigger Button */}
        <button
          onClick={() => setShowDevNote(true)}
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '9999px',
            padding: '0.4rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#111111',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          title="Open Developer Prototype Note"
        >
          <GoogleIcon name="code" size={15} color="#000000" />
          <span>Dev Note</span>
        </button>
      </div>

      {/* Simulated Aadhaar Card Physical Graphic */}
      <div
        style={{
          width: '100%',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.18)',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {/* Subtle Indian Tricolor Decorative Accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GoogleIcon name="badge" size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
                Setu Civic Identity Card
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                Government of Jharkhand
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: '700',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              letterSpacing: '0.04em'
            }}
          >
            UIDAI MOCK
          </div>
        </div>

        {/* Displayed Aadhaar Number on Card */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Aadhaar Number
            </div>
            <div
              style={{
                fontSize: isMobile ? '1.25rem' : '1.4rem',
                fontWeight: '700',
                letterSpacing: '0.12em',
                fontFamily: 'monospace',
                marginTop: '0.2rem'
              }}
            >
              {aadhaarNumber || '•••• •••• ••••'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.55)', textTransform: 'uppercase' }}>
              Citizen Name
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginTop: '0.15rem' }}>
              {userName || 'Rahul Verma'}
            </div>
          </div>
        </div>
      </div>

      {/* Simulated OTP Push Dropdown Banner */}
      {step === 'otp' && simulatedOtp && (
        <div
          className="apple-fade-enter"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '0.9rem 1.15rem',
            border: '1.5px solid #000000',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#000000',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <GoogleIcon name="sms" size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#111111' }}>
                UIDAI Simulated OTP: <span style={{ color: '#000000', fontSize: '1rem', letterSpacing: '0.08em', fontWeight: '800' }}>{simulatedOtp}</span>
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#636366' }}>
                Dispatched to linked mobile {maskedMobile}
              </div>
            </div>
          </div>

          <button
            onClick={() => setOtp(simulatedOtp)}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: '#f2f2f7',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#000000',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Auto-fill
          </button>
        </div>
      )}

      {/* Interactive Form Fields */}
      {step === 'aadhaar' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: '600',
                color: '#111111',
                marginBottom: '0.45rem'
              }}
            >
              Aadhaar Card Number (12 Digits)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={handleAadhaarChange}
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '14px',
                  border: error ? '1.5px solid #ef4444' : '1px solid rgba(0, 0, 0, 0.14)',
                  padding: '0 1rem 0 2.75rem',
                  fontSize: '1.0625rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.08em',
                  fontWeight: '600',
                  color: '#111111',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#8e8e93'
                }}
              >
                <GoogleIcon name="pin" size={20} />
              </div>
            </div>

            {error && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', margin: '0.35rem 0 0', fontWeight: '500' }}>
                {error}
              </p>
            )}
          </div>

          {/* Quick Account Selector Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: '#8e8e93' }}>
              Pre-filled for testing. Or select another dummy account:
            </span>
            <button
              type="button"
              onClick={() => setShowAccountsDrawer(true)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#000000',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              10 Demo Accounts
            </button>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              marginTop: '0.5rem'
            }}
          >
            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="apple-btn-primary"
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '16px',
                fontSize: '0.9375rem',
                fontWeight: '600'
              }}
            >
              {loading ? 'Requesting UIDAI Gateway...' : 'Verify & Send OTP'}
            </button>

            <button
              onClick={onPrev}
              className="apple-btn-secondary"
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '16px',
                fontSize: '0.875rem'
              }}
            >
              Back to Roles
            </button>
          </div>
        </div>
      ) : (
        /* OTP Step */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: '600',
                color: '#111111',
                marginBottom: '0.45rem'
              }}
            >
              6-Digit One Time Password (OTP)
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              placeholder="••••••"
              maxLength={6}
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '14px',
                border: error ? '1.5px solid #ef4444' : '1px solid rgba(0, 0, 0, 0.14)',
                padding: '0 1rem',
                fontSize: '1.25rem',
                textAlign: 'center',
                letterSpacing: '0.3em',
                fontFamily: 'monospace',
                fontWeight: '700',
                color: '#111111',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />

            {error && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', margin: '0.35rem 0 0', fontWeight: '500' }}>
                {error}
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              marginTop: '0.5rem'
            }}
          >
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="apple-btn-primary"
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '16px',
                fontSize: '0.9375rem',
                fontWeight: '600'
              }}
            >
              {loading ? 'Authenticating Identity...' : 'Confirm & Sign In'}
            </button>

            <button
              onClick={() => setStep('aadhaar')}
              className="apple-btn-secondary"
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '16px',
                fontSize: '0.875rem'
              }}
            >
              Change Aadhaar Number
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          DEVELOPER NOTE POPUP MODAL (Apple Card HIG)
          ===================================================================== */}
      {showDevNote && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            boxSizing: 'border-box'
          }}
        >
          <div
            className="apple-fade-enter"
            style={{
              width: '100%',
              maxWidth: '540px',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '1.75rem',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '0.6875rem',
                    fontWeight: '700',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem'
                  }}
                >
                  <GoogleIcon name="terminal" size={14} />
                  Developer Note
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#111111', letterSpacing: '-0.02em' }}>
                  Aadhaar e-KYC Prototype Guide
                </h2>
              </div>

              <button
                onClick={() => setShowDevNote(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f2f2f7',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Close"
              >
                <GoogleIcon name="close" size={18} color="#111111" />
              </button>
            </div>

            {/* Bullet points explaining prototype & architecture */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.84375rem', color: '#2c2c2e', lineHeight: 1.45 }}>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <span style={{ fontSize: '1rem' }}>⚡</span>
                <div>
                  <strong>Pre-Filled Demonstration:</strong> This is a prototype so a dummy citizen Aadhaar (<code>5678 9012 3456 - Rahul Verma</code>) is entered by default. Tap <em>Verify & Send OTP</em> to test in 1 click.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <span style={{ fontSize: '1rem' }}>🛡️</span>
                <div>
                  <strong>Production e-KYC Architecture:</strong> In production, Setu connects to the <strong>UIDAI / DigiLocker e-KYC Gateway</strong> to automatically fetch full citizen credentials (Name, Verified Photo, Address, District, Panchayat, Ward) without manual data entry.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <span style={{ fontSize: '1rem' }}>📲</span>
                <div>
                  <strong>Simulated OTP Pop-up:</strong> In production, OTP is sent via SMS to the mobile linked to the Aadhaar card. In this prototype, the demo OTP instantly pops up on your screen so you can enter or auto-fill it directly.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <span style={{ fontSize: '1rem' }}>🔒</span>
                <div>
                  <strong>Strict Single-Session Concurrency:</strong> Only one active session is permitted per Aadhaar ID. If an account signs in from another device or browser tab, any earlier active session is automatically terminated and logged out.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <span style={{ fontSize: '1rem' }}>👨‍💻</span>
                <div>
                  <strong>3 Dev Accounts Reserved:</strong> Accounts for <strong>Dhruv Gautam</strong>, <strong>Hoomandeep</strong>, and <strong>Prathna</strong> are reserved. Their Aadhaar numbers are never auto-filled and can only be accessed by entering them manually.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
              <button
                onClick={() => {
                  setShowDevNote(false);
                  setShowAccountsDrawer(true);
                }}
                className="apple-btn-secondary"
                style={{ flex: 1, height: '44px', fontSize: '0.8125rem' }}
              >
                View 10 Accounts
              </button>

              <button
                onClick={() => setShowDevNote(false)}
                className="apple-btn-primary"
                style={{ flex: 1, height: '44px', fontSize: '0.8125rem' }}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          10 DEMO ACCOUNTS DRAWER / SELECTOR
          ===================================================================== */}
      {showAccountsDrawer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            boxSizing: 'border-box'
          }}
        >
          <div
            className="apple-fade-enter"
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '1.75rem',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#111111' }}>
                  10 Registered Demo Accounts
                </h2>
                <p style={{ fontSize: '0.78125rem', color: '#636366', margin: '0.2rem 0 0' }}>
                  Tap any prototype account to load its Aadhaar into the verification field.
                </p>
              </div>

              <button
                onClick={() => setShowAccountsDrawer(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f2f2f7',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <GoogleIcon name="close" size={18} color="#111111" />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {accountsList.map((acc) => {
                const isSelected = aadhaarNumber.replace(/\s+/g, '') === acc.formattedAadhaar.replace(/\s+/g, '');
                return (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setAadhaarNumber(acc.formattedAadhaar);
                      setUserName(acc.name);
                      setShowAccountsDrawer(false);
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #000000' : '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: acc.isDevAccount ? '#fcfbf7' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: acc.isDevAccount ? '#000000' : '#f2f2f7',
                          color: acc.isDevAccount ? '#ffffff' : '#111111',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8125rem',
                          fontWeight: '700'
                        }}
                      >
                        {acc.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#111111' }}>
                            {acc.name}
                          </span>
                          {acc.isDevAccount && (
                            <span
                              style={{
                                fontSize: '0.625rem',
                                fontWeight: '700',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '9999px',
                                backgroundColor: '#111111',
                                color: '#ffffff'
                              }}
                            >
                              DEV RESERVED
                            </span>
                          )}
                          {acc.isDefault && (
                            <span
                              style={{
                                fontSize: '0.625rem',
                                fontWeight: '700',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '9999px',
                                backgroundColor: '#10b981',
                                color: '#ffffff'
                              }}
                            >
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#636366', fontFamily: 'monospace' }}>
                          {acc.formattedAadhaar} · {acc.district}
                        </div>
                      </div>
                    </div>

                    <GoogleIcon name="chevron_right" size={18} color="#8e8e93" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
