import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useLanguage } from '../../../context/LanguageContext';

const API_BASE = 'http://localhost:5000';

// 7 Dummy Prototype Accounts (excludes 3 reserved dev accounts)
const CITIZEN_ACCOUNTS = [
  {
    id: 'cit-001',
    aadhaarParts: ['5678', '9012', '3456'],
    aadhaar: '567890123456',
    name: 'Rahul Verma',
    mobile: '+91 98123 45670',
    dob: '1998-05-14',
    gender: 'Male',
    address: 'Morabadi Ground Road, Ward 4',
    district: 'Ranchi',
    state: 'Jharkhand',
    pincode: '834008',
    lastOtp: '742918'
  },
  {
    id: 'cit-002',
    aadhaarParts: ['6789', '0123', '4567'],
    aadhaar: '678901234567',
    name: 'Anjali Soren',
    mobile: '+91 98123 45671',
    dob: '2001-09-18',
    gender: 'Female',
    address: 'Jail Road, Ward 12',
    district: 'Dumka',
    state: 'Jharkhand',
    pincode: '814101',
    lastOtp: '319482'
  },
  {
    id: 'cit-003',
    aadhaarParts: ['7890', '1234', '5678'],
    aadhaar: '789012345678',
    name: 'Amit Kumar Singh',
    mobile: '+91 98123 45672',
    dob: '1995-12-03',
    gender: 'Male',
    address: 'Korrah Road, Ward 8',
    district: 'Hazaribagh',
    state: 'Jharkhand',
    pincode: '825301',
    lastOtp: '852147'
  },
  {
    id: 'cit-004',
    aadhaarParts: ['8901', '2345', '6789'],
    aadhaar: '890123456789',
    name: 'Pooja Kumari',
    mobile: '+91 98123 45673',
    dob: '2000-03-27',
    gender: 'Female',
    address: 'Sector 4, Bokaro Steel City',
    district: 'Bokaro',
    state: 'Jharkhand',
    pincode: '827004',
    lastOtp: '963258'
  },
  {
    id: 'cit-005',
    aadhaarParts: ['9012', '3456', '7890'],
    aadhaar: '901234567890',
    name: 'Birsa Munda Jr.',
    mobile: '+91 98123 45674',
    dob: '1999-07-11',
    gender: 'Male',
    address: 'Main Bazar, Ulihatu Link Road',
    district: 'Khunti',
    state: 'Jharkhand',
    pincode: '835210',
    lastOtp: '147258'
  },
  {
    id: 'cit-006',
    aadhaarParts: ['1234', '5678', '9012'],
    aadhaar: '123456789012',
    name: 'Sunita Devi',
    mobile: '+91 98123 45675',
    dob: '1992-10-05',
    gender: 'Female',
    address: 'Castairs Town, Near Tower Chowk',
    district: 'Deoghar',
    state: 'Jharkhand',
    pincode: '814112',
    lastOtp: '369258'
  },
  {
    id: 'cit-007',
    aadhaarParts: ['9876', '5432', '1098'],
    aadhaar: '987654321098',
    name: 'Vikash Oraon',
    mobile: '+91 98123 45676',
    dob: '1997-01-30',
    gender: 'Male',
    address: 'Sisai Road, Ward 3',
    district: 'Gumla',
    state: 'Jharkhand',
    pincode: '835207',
    lastOtp: '258147'
  }
];

/* --------------------------------------------------------------------------
   Vector SVG Emblems (Ashoka Stambh, Govt of India Tricolor, Aadhaar Sun)
   -------------------------------------------------------------------------- */
const AshokaEmblem = () => (
  <svg width="26" height="34" viewBox="0 0 100 130" fill="#2C3E50" style={{ flexShrink: 0 }}>
    <rect x="15" y="112" width="70" height="8" rx="2" fill="#2C3E50" />
    <rect x="10" y="122" width="80" height="6" rx="2" fill="#2C3E50" />
    <circle cx="50" cy="104" r="7" fill="none" stroke="#2C3E50" strokeWidth="2.5" />
    <circle cx="50" cy="104" r="2" fill="#2C3E50" />
    <ellipse cx="28" cy="104" rx="8" ry="4" fill="#4B5563" />
    <ellipse cx="72" cy="104" rx="8" ry="4" fill="#4B5563" />
    <path d="M50 18 C44 18 36 24 36 34 C36 44 42 50 42 60 L42 94 L58 94 L58 60 C58 50 64 44 64 34 C64 24 56 18 50 18 Z" fill="#2C3E50" />
    <path d="M26 36 C22 36 18 42 18 50 C18 62 26 70 34 74 L38 94 L44 94 L40 68 C34 64 30 56 30 48 Z" fill="#4B5563" />
    <path d="M74 36 C78 36 82 42 82 50 C82 62 74 70 66 74 L62 94 L56 94 L60 68 C66 64 70 56 70 48 Z" fill="#4B5563" />
    <circle cx="46" cy="30" r="2" fill="#FFFFFF" />
    <circle cx="54" cy="30" r="2" fill="#FFFFFF" />
    <path d="M47 38 Q50 42 53 38" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GovtOfIndiaBanner = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '130px',
      position: 'relative',
      padding: '0 0.5rem'
    }}
  >
    {/* Saffron Top Stripe */}
    <div
      style={{
        width: '100%',
        height: '3px',
        borderRadius: '3px 3px 0 0',
        background: 'linear-gradient(90deg, #FF9933 0%, #FFB366 100%)'
      }}
    />
    {/* Bilingual Center */}
    <div style={{ padding: '0.15rem 0.5rem', textAlign: 'center' }}>
      <div
        style={{
          fontSize: '0.6875rem',
          fontWeight: '700',
          color: '#111827',
          lineHeight: 1.15,
          letterSpacing: '0.01em'
        }}
      >
        भारत सरकार
      </div>
      <div
        style={{
          fontSize: '0.5625rem',
          fontWeight: '600',
          color: '#4B5563',
          lineHeight: 1.15,
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}
      >
        Government of India
      </div>
    </div>
    {/* Green Bottom Stripe */}
    <div
      style={{
        width: '100%',
        height: '3px',
        borderRadius: '0 0 3px 3px',
        background: 'linear-gradient(90deg, #138808 0%, #2ECC71 100%)'
      }}
    />
  </div>
);

const AadhaarLogo = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
    <svg width="42" height="28" viewBox="0 0 100 70">
      <circle cx="50" cy="55" r="46" fill="none" stroke="#EA580C" strokeWidth="3.5" strokeDasharray="3 6" />
      <circle cx="50" cy="55" r="38" fill="none" stroke="#DC2626" strokeWidth="3" strokeDasharray="4 4" />
      <path d="M22 55 A28 28 0 0 1 78 55 Z" fill="#DC2626" opacity="0.12" />
      <path d="M30 55 A20 20 0 0 1 70 55" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M36 55 A14 14 0 0 1 64 55" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 55 A8 8 0 0 1 58 55" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M47 55 A3 3 0 0 1 53 55" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
    <span
      style={{
        fontSize: '0.5625rem',
        fontWeight: '800',
        color: '#DC2626',
        letterSpacing: '0.08em',
        marginTop: '-2px'
      }}
    >
      AADHAAR
    </span>
  </div>
);

export const AadhaarOnboardingStep = ({
  isMobile = false,
  onPrev,
  onSuccess
}) => {
  const { t, currentLanguage } = useLanguage();

  // State for citizen accounts and selection (picks non-logged-in account to avoid collision logouts)
  const [selectedAccount, setSelectedAccount] = useState(() => CITIZEN_ACCOUNTS[0]);
  const [accountsList, setAccountsList] = useState(CITIZEN_ACCOUNTS);

  // 3 Boxes, 4 Numbers Each
  const [box1, setBox1] = useState(CITIZEN_ACCOUNTS[0].aadhaarParts[0]);
  const [box2, setBox2] = useState(CITIZEN_ACCOUNTS[0].aadhaarParts[1]);
  const [box3, setBox3] = useState(CITIZEN_ACCOUNTS[0].aadhaarParts[2]);

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
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [activeBoxFocus, setActiveBoxFocus] = useState(null);

  // Automatically fetch an account that is NOT logged in by anyone else
  useEffect(() => {
    let isMounted = true;
    const fetchAvailableAccount = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/aadhaar/available-account`);
        if (res.ok) {
          const data = await res.json();
          if (data?.account && isMounted) {
            const acc = data.account;
            setSelectedAccount(acc);
            setBox1(acc.aadhaarParts[0]);
            setBox2(acc.aadhaarParts[1]);
            setBox3(acc.aadhaarParts[2]);
            if (acc.lastOtp) {
              setSimulatedOtp(acc.lastOtp);
            }
          }
        }
      } catch (err) {
        // Fallback to local accounts
      }
    };
    fetchAvailableAccount();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch real-time active status of all accounts for Developer note modal
  const loadAccountsWithStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/aadhaar/accounts`);
      if (res.ok) {
        const data = await res.json();
        if (data?.accounts) {
          const mapped = data.accounts
            .filter((a) => !a.isDevAccount)
            .map((a) => ({
              ...a,
              aadhaarParts: [a.aadhaar.slice(0, 4), a.aadhaar.slice(4, 8), a.aadhaar.slice(8)]
            }));
          setAccountsList(mapped);
        }
      }
    } catch (e) {}
  };

  const handleSelectAccountFromModal = (acc) => {
    setSelectedAccount(acc);
    setBox1(acc.aadhaarParts[0]);
    setBox2(acc.aadhaarParts[1]);
    setBox3(acc.aadhaarParts[2]);
    if (acc.lastOtp) {
      setSimulatedOtp(acc.lastOtp);
    }
    setError('');
    setShowDevNote(false);
  };

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

    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');
    const shouldFetchBackend =
      isLocalhost || !!import.meta.env.VITE_API_BASE_URL;

    if (shouldFetchBackend) {
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/aadhaar/request-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aadhaarNumber: fullAadhaar })
        });
        const data = await res.json();
        if (res.ok) {
          const code = data.otp || '742918';
          setSimulatedOtp(code);
          setStep('otp');
          setShowNotification(true);
          setTimeout(() => {
            otpRefs[0].current?.focus();
          }, 150);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fall through to local simulation
      }
    }

    // Direct prototype simulation (Avoids any fetch to localhost on mobile/Vercel)
    const foundCitizen =
      CITIZEN_ACCOUNTS.find((a) => a.aadhaar === fullAadhaar) ||
      CITIZEN_ACCOUNTS[0];
    const fallbackCode = foundCitizen?.lastOtp || '742918';
    setSimulatedOtp(fallbackCode);
    setStep('otp');
    setShowNotification(true);
    setTimeout(() => {
      otpRefs[0].current?.focus();
    }, 150);
    setLoading(false);
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

    if (raw.length >= 6) {
      const parts = raw.slice(0, 6).split('');
      setOtpDigits(parts);
      otpRefs[5].current?.focus();
      setError('');
      return;
    }

    const next = [...otpDigits];
    next[index] = raw[raw.length - 1];
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

  // Verify OTP Call
  const handleVerifyOtp = async () => {
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');
    const shouldFetchBackend =
      isLocalhost || !!import.meta.env.VITE_API_BASE_URL;

    if (shouldFetchBackend) {
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/aadhaar/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aadhaarNumber: fullAadhaar, otp: enteredOtp })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('setu_user', JSON.stringify(data.user));
          localStorage.setItem('setu_session_id', data.sessionId);
          localStorage.setItem('setu_token', data.token);
          localStorage.setItem('setu_onboarded', 'true');
          localStorage.setItem('setu_user_role', 'citizen');
          localStorage.setItem('sih_user_data', JSON.stringify(data.user));
          localStorage.setItem('sih_auth_token', data.token);

          onSuccess(data.user);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fall through to local simulation
      }
    }

    // Direct prototype simulation
    const foundCitizen =
      CITIZEN_ACCOUNTS.find((a) => a.aadhaar === fullAadhaar) ||
      CITIZEN_ACCOUNTS[0];
    const mockUser = {
      id: foundCitizen.id || 'cit-001',
      name: foundCitizen.name || 'Rahul Verma',
      aadhaar: fullAadhaar,
      maskedAadhaar: `XXXX XXXX ${fullAadhaar.slice(-4)}`,
      mobile: foundCitizen.mobile || '+91 98123 45670',
      dob: '1998-05-14',
      gender: 'Male',
      address: 'Morabadi Ground Road, Ward 4',
      district: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834008',
      role: 'CITIZEN',
      sessionId: `sess-${Date.now()}`
    };
    localStorage.setItem('setu_user', JSON.stringify(mockUser));
    localStorage.setItem('setu_session_id', mockUser.sessionId);
    localStorage.setItem('setu_token', mockUser.sessionId);
    localStorage.setItem('setu_onboarded', 'true');
    localStorage.setItem('setu_user_role', 'citizen');
    localStorage.setItem('sih_user_data', JSON.stringify(mockUser));
    localStorage.setItem('sih_auth_token', mockUser.sessionId);

    onSuccess(mockUser);
    setLoading(false);
  };

  return (
    <div
      className="apple-fade-enter"
      style={{
        width: '100%',
        maxWidth: '430px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        minHeight: isMobile ? 'calc(100vh - 2.5rem)' : 'auto',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* 1. TOP PUSH NOTIFICATION: Pinned to top of screen */}
      {showNotification && simulatedOtp && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            top: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999999,
            width: 'calc(100% - 28px)',
            maxWidth: '390px',
            backgroundColor: 'rgba(28, 28, 30, 0.95)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            borderRadius: '20px',
            padding: '0.75rem 0.95rem',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            animation: 'appleNotificationSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textAlign: 'left', minWidth: 0 }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                backgroundColor: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <GoogleIcon name="sms" size={18} color="#ffffff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Demo Message
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.4)' }}>•</span>
                <span style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.4)' }}>now</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#ffffff', fontWeight: '500', marginTop: '0.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Your OTP is <strong style={{ color: '#ffffff', letterSpacing: '0.06em' }}>{simulatedOtp}</strong>
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
              padding: '0.4rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
            }}
          >
            Auto-fill
          </button>
        </div>,
        document.body
      )}

      {/* TOP CONTENT GROUP: Moved up with clean alignment */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: isMobile ? '0.75rem' : '1rem' }}>
        {/* 2. TOP HEADER ROW: ← Identity Verification and FAQs pill button (matching screenshot) */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.15rem 0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={step === 'otp' ? () => setStep('aadhaar') : onPrev}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.2rem',
                margin: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111827',
                borderRadius: '50%'
              }}
              aria-label="Back"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2
              style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.02em'
              }}
            >
              Identity Verification
            </h2>
          </div>

          <button
            onClick={() => setShowFaqModal(true)}
            style={{
              background: 'none',
              border: '1px solid #D1D5DB',
              borderRadius: '9999px',
              padding: '0.25rem 0.85rem',
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#4B5563',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            FAQs
          </button>
        </div>

        {/* 3. STEPPED PROGRESS TRACKER: (✔) Role - (2) Aadhar - (3) Complete (matching screenshot) */}
        <div
          style={{
            width: '100%',
            position: 'relative',
            margin: isMobile ? '0.4rem 0 0.85rem' : '0.6rem 0 1rem'
          }}
        >
          {/* Continuous Connecting Line Track (Centered vertically with the 26px circles at top: 13px) */}
          <div
            style={{
              position: 'absolute',
              top: '13px',
              left: '16%',
              right: '16%',
              height: '2px',
              backgroundColor: '#E5E7EB',
              zIndex: 1
            }}
          >
            <div
              style={{
                width: step === 'otp' ? '100%' : '50%',
                height: '100%',
                backgroundColor: '#5B3CE6',
                transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </div>

          {/* 3 Step Nodes */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Step 1: Role / Completed */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', width: '72px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#5B3CE6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 6px rgba(91, 60, 230, 0.3)'
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#111827' }}>
                Role
              </span>
            </div>

            {/* Step 2: Aadhar / Active */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', width: '72px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: step === 'otp' ? '#5B3CE6' : '#FFFFFF',
                  border: '2px solid #5B3CE6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: step === 'otp' ? '#FFFFFF' : '#5B3CE6',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  boxShadow: '0 2px 6px rgba(91, 60, 230, 0.15)'
                }}
              >
                {step === 'otp' ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  '2'
                )}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#111827' }}>
                Aadhar
              </span>
            </div>

            {/* Step 3: Complete / Upcoming */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', width: '72px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #D1D5DB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9CA3AF',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                3
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#9CA3AF' }}>
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* 4. THE AADHAAR CARD BOX: White rounded card with Ashoka emblem, Tricolor banner & Aadhaar logo */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            padding: isMobile ? '1.05rem 1.05rem 1.25rem' : '1.35rem 1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem',
            boxSizing: 'border-box'
          }}
        >
          {/* Card Header: 3 Emblem Logos */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.65rem',
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
            }}
          >
            <AshokaEmblem />
            <GovtOfIndiaBanner />
            <AadhaarLogo />
          </div>

          {step === 'aadhaar' ? (
            /* STEP 1: AADHAAR INPUT WITH 3 BOX SEPARATION */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', textAlign: 'left' }}>
              <label
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: 0
                }}
              >
                Enter 12 digit Aadhar Number
              </label>

              {/* 3 Box Separation (Requested: [ 5678 ] - [ 9012 ] - [ 3456 ]) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  marginTop: '0.2rem'
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
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: activeBoxFocus === 1 ? '2px solid #5B3CE6' : '1px solid #D1D5DB',
                    boxShadow: activeBoxFocus === 1 ? '0 0 0 3px rgba(91, 60, 230, 0.12)' : 'none',
                    fontSize: isMobile ? '1.15rem' : '1.25rem',
                    fontWeight: '700',
                    textAlign: 'center',
                    letterSpacing: '0.1em',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', monospace",
                    color: '#111827',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />

                <span style={{ color: '#9CA3AF', fontSize: '1.25rem', fontWeight: '300' }}>–</span>

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
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: activeBoxFocus === 2 ? '2px solid #5B3CE6' : '1px solid #D1D5DB',
                    boxShadow: activeBoxFocus === 2 ? '0 0 0 3px rgba(91, 60, 230, 0.12)' : 'none',
                    fontSize: isMobile ? '1.15rem' : '1.25rem',
                    fontWeight: '700',
                    textAlign: 'center',
                    letterSpacing: '0.1em',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', monospace",
                    color: '#111827',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />

                <span style={{ color: '#9CA3AF', fontSize: '1.25rem', fontWeight: '300' }}>–</span>

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
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: activeBoxFocus === 3 ? '2px solid #5B3CE6' : '1px solid #D1D5DB',
                    boxShadow: activeBoxFocus === 3 ? '0 0 0 3px rgba(91, 60, 230, 0.12)' : 'none',
                    fontSize: isMobile ? '1.15rem' : '1.25rem',
                    fontWeight: '700',
                    textAlign: 'center',
                    letterSpacing: '0.1em',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', monospace",
                    color: '#111827',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          ) : (
            /* STEP 2: 6 OTP BOXES */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'left' }}>
              <label
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: 0
                }}
              >
                Enter 6 digit OTP
              </label>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0 0 0.5rem' }}>
                Enter the 6-digit OTP sent to your Aadhaar-linked mobile.
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  width: '100%'
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
                      width: '46px',
                      height: '50px',
                      borderRadius: '12px',
                      backgroundColor: digit ? '#FFFFFF' : '#F9FAFB',
                      border: digit ? '2px solid #5B3CE6' : '1px solid #D1D5DB',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      textAlign: 'center',
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', monospace",
                      color: '#111827',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ color: '#DC2626', fontSize: '0.8125rem', fontWeight: '500', textAlign: 'left' }}>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ACTION GROUP: Placed gracefully at bottom matching screenshot */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginTop: isMobile ? 'auto' : '1.25rem',
          paddingTop: '0.85rem'
        }}
      >
        {/* DEVELOPER NOTE PILL: Placed over (above) the note and verify button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.1rem' }}>
          <button
            onClick={() => setShowDevNote(true)}
            className="apple-tap"
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: '#F3F4F6',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              color: '#6B7280',
              fontSize: '0.75rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <GoogleIcon name="code" size={14} color="#6B7280" />
            <span>Developer note</span>
          </button>
        </div>

        {/* 5. NOTE BEFORE ACTION BUTTON (Consent on Aadhaar, Auth disclaimer on OTP) */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#F9FAFB',
            borderRadius: '14px',
            border: '1px solid #F3F4F6',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxSizing: 'border-box',
            textAlign: 'left'
          }}
        >
          <div style={{ flexShrink: 0, color: '#5B3CE6', display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: '0.8125rem',
              color: '#374151',
              margin: 0,
              lineHeight: 1.45,
              fontWeight: '500'
            }}
          >
            {step === 'aadhaar'
              ? 'By Entering the details, you allow Setu to verify Aadhar on your behalf'
              : 'By confirming the OTP, you authenticate your identity securely through UIDAI'}
          </p>
        </div>

        {/* 6. VIBRANT PURPLE ACTION BUTTON (Verify Aadhar on Step 1, Confirm OTP on Step 2) */}
        <button
          onClick={step === 'aadhaar' ? handleRequestOtp : handleVerifyOtp}
          disabled={loading}
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '9999px',
            backgroundColor: '#5B3CE6',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(91, 60, 230, 0.28)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4F30D3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5B3CE6')}
        >
          {loading
            ? 'Verifying...'
            : step === 'aadhaar'
            ? 'Verify Aadhar'
            : 'Confirm OTP'}
        </button>
      </div>

      {/* 8. FAQS MODAL */}
      {showFaqModal && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
          onClick={() => setShowFaqModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.75rem',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                Aadhaar Verification FAQs
              </h3>
              <button
                onClick={() => setShowFaqModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
              >
                <GoogleIcon name="close" size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: '#4B5563' }}>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#111827' }}>Why is Aadhaar required?</strong><br />
                To prevent duplicate grievance submissions and ensure government DBT grants reach verified citizens.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#111827' }}>Is my biometric data stored?</strong><br />
                No biometric data is stored. Setu only performs a 1-time tokenized authentication with UIDAI.
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 9. DEVELOPER NOTE MODAL (Explaining purpose of autofilling Aadhaar) */}
      {showDevNote && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.32)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
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
              padding: isMobile ? '1.5rem 1.35rem' : '2rem',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.16), 0 0 1px rgba(0, 0, 0, 0.08)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
              position: 'relative',
              boxSizing: 'border-box',
              animation: 'appleSpringEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: '700',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '6px',
                  backgroundColor: '#f2f2f7',
                  color: '#1c1c1e'
                }}
              >
                Developer Note
              </span>

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
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111111', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
                Purpose of Autofilling Aadhaar
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                For evaluation and prototype testing purposes, an Aadhaar number is pre-filled automatically so evaluators can test the complete verification and OTP onboarding flow without manual typing.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#F9FAFB', padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <GoogleIcon name="touch_app" size={18} color="#5B3CE6" />
                <span style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.45 }}>
                  <strong style={{ color: '#111827' }}>Seamless Evaluation:</strong> Enables instant testing of UIDAI e-KYC authentication and simulated SMS OTP without memorizing test data.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <GoogleIcon name="group" size={18} color="#059669" />
                <span style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.45 }}>
                  <strong style={{ color: '#111827' }}>Collision Prevention:</strong> The system automatically selects an unoccupied sandbox account so concurrent testers don't kick each other out.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <GoogleIcon name="edit" size={18} color="#6B7280" />
                <span style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.45 }}>
                  <strong style={{ color: '#111827' }}>Manual Input Supported:</strong> You can clear the 3 boxes at any time and enter any custom test Aadhaar number.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowDevNote(false)}
              className="apple-primary-btn"
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                backgroundColor: '#111111',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                marginTop: '0.25rem'
              }}
            >
              Got it
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
