import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { compressImage } from '../../../utils/imageCompressor';
import { GeneralSettingsDrawer } from './GeneralSettingsDrawer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const MobileProfileView = ({
  userName: propUserName,
  setActiveNav
}) => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  const storedUser = useMemo(() => {
    try {
      const u = localStorage.getItem('setu_user') || localStorage.getItem('sih_user_data');
      return u ? JSON.parse(u) : {};
    } catch (e) {
      return {};
    }
  }, []);

  // Fetch real submissions from database (no dummy items)
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoadingSubmissions(true);
        const resp = await fetch(`${API_BASE_URL}/problems`);
        if (resp.ok) {
          const json = await resp.json();
          setSubmissions(json.data || []);
        }
      } catch (err) {
        console.warn('Could not fetch submissions from DB:', err);
      } finally {
        setLoadingSubmissions(false);
      }
    };
    fetchSubmissions();
  }, []);

  const displayName = storedUser.name || propUserName || 'Rahul Verma';
  const displayPhone = storedUser.mobile || '+91 98123 45670';
  const displayAadhaar = storedUser.maskedAadhaar || (storedUser.aadhaar ? `XXXX XXXX ${storedUser.aadhaar.replace(/\s+/g, '').slice(-4)}` : 'XXXX XXXX 3456');
  const displayLocation = storedUser.district ? `${storedUser.district}, ${storedUser.state || 'Jharkhand'}` : 'Ranchi, Jharkhand';
  const displayDob = storedUser.dob || '15/08/1996';
  const isDev = !!storedUser.isDevAccount;

  // General Settings Drawer State
  const [isGeneralOpen, setIsGeneralOpen] = useState(false);

  // Profile Picture Upload & Compression
  const fileInputRef = useRef(null);
  const [pfpUrl, setPfpUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('setu_user_pfp') || null;
    }
    return null;
  });

  useEffect(() => {
    const handlePfpUpdate = () => {
      setPfpUrl(localStorage.getItem('setu_user_pfp') || null);
    };
    window.addEventListener('setu-pfp-updated', handlePfpUpdate);

    // Auto-open picker if guided from Welcome modal
    if (sessionStorage.getItem('setu_auto_open_pfp_picker') === 'true') {
      sessionStorage.removeItem('setu_auto_open_pfp_picker');
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 350);
    }

    return () => window.removeEventListener('setu-pfp-updated', handlePfpUpdate);
  }, []);

  const handlePfpFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUrl = await compressImage(file, { maxWidth: 256, maxHeight: 256, quality: 0.8 });
      localStorage.setItem('setu_user_pfp', compressedDataUrl);
      setPfpUrl(compressedDataUrl);
      window.dispatchEvent(new Event('setu-pfp-updated'));
    } catch (err) {
      console.error('Failed to compress profile picture:', err);
    }
  };

  // Swipe / Tap to toggle between Date of Birth and Age with smooth fade animation
  const [showAge, setShowAge] = useState(false);
  const touchStartX = useRef(null);

  const calculatedAge = useMemo(() => {
    if (!storedUser?.dob) return '25 years old';
    const dobStr = String(storedUser.dob).trim();
    if (dobStr.includes('-')) {
      const parts = dobStr.split('-');
      const y = parseInt(parts[0], 10);
      if (y > 1920 && y < 2026) {
        return `${2026 - y} years old`;
      }
    }
    if (dobStr.includes('/')) {
      const parts = dobStr.split('/');
      const y = parseInt(parts[parts.length - 1], 10);
      if (y > 1920 && y < 2026) {
        return `${2026 - y} years old`;
      }
    }
    return '25 years old';
  }, [storedUser?.dob]);

  const handleDobTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleDobTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = Math.abs(touchEndX - touchStartX.current);
    if (diff > 20) {
      setShowAge((prev) => !prev);
    }
    touchStartX.current = null;
  };

  const handleDobClick = () => {
    setShowAge((prev) => !prev);
  };

  const handleLogout = () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('setu_user') || '{}');
      const sessionId = localStorage.getItem('setu_session_id') || '';
      if (savedUser?.aadhaar) {
        fetch('http://localhost:5000/api/v1/auth/aadhaar/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aadhaarNumber: savedUser.aadhaar, sessionId })
        }).catch(() => {});
      }
    } catch (e) {}

    localStorage.removeItem('setu_user');
    localStorage.removeItem('setu_session_id');
    localStorage.removeItem('setu_token');
    localStorage.removeItem('setu_onboarded');
    localStorage.removeItem('setu_user_role');
    localStorage.removeItem('sih_auth_token');
    localStorage.removeItem('sih_user_data');
    navigate('/onboarding');
  };

  return (
    <div
      className="apple-page-enter"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        color: '#1a1c1c',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Top App Bar - Exact height, frosted styling & typography matching Explore and Messages */}
      <header
        className="apple-frosted-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '1rem 1.25rem',
          boxSizing: 'border-box'
        }}
      >
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: '#000000',
            margin: 0
          }}
        >
          Profile
        </h1>
      </header>

      {/* 2. Main Content Canvas */}
      <main
        style={{
          flex: 1,
          padding: '1.5rem 1.25rem 6.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxSizing: 'border-box'
        }}
      >
        {/* Profile Summary */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.25rem 0',
            gap: '0.75rem'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePfpFileChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="apple-tap"
            title="Tap to change profile picture"
            style={{
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: '5.5rem',
                height: '5.5rem',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 0 0 3px #ffffff, 0 0 0 4px rgba(0, 0, 0, 0.06)',
                flexShrink: 0,
                backgroundColor: '#e5e7eb'
              }}
            >
              <img
                alt="User Avatar"
                src={
                  pfpUrl ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAd7Q5nXugqNrYH6tTlJ1gPhmYZQXQu98rd1Gm0GQOQwZIIlWY3ahiBUR3xLqWmW1JX_WhXWMnVWsSz1JWolSZiNoJMwZmxt4lVKcxxS2eHBcIDyaojSejOSrMf_hpe606-2aDFO52eADSwwES5Br1PuGAi9WlzrGHNGnyTdJmFarDE4Tee6eC354TkyYqo6mmnoYg-JRWfVhxKz4e1mt0Sq1LOhgZ-1E1AE-Z-T6v-Vs3xQivPctWkCQ"
                }
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Edit / Pen Icon Pill */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#000000',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                border: '2px solid #ffffff'
              }}
            >
              <GoogleIcon name="edit" size={14} color="#ffffff" />
            </div>
          </div>
          <h2
            style={{
              fontSize: '1.375rem',
              lineHeight: '1.75rem',
              letterSpacing: '-0.02em',
              fontWeight: '700',
              color: '#000000',
              margin: 0,
              textAlign: 'center'
            }}
          >
            {displayName}
          </h2>
          {isDev && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.02em'
              }}
            >
              <GoogleIcon name="terminal" size={14} color="#ffffff" />
              <span>Developer Team</span>
            </div>
          )}
        </section>

        {/* Personal Details Section (Apple Inset Grouped) */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: '600',
              letterSpacing: '0.04em',
              color: '#6e6e73',
              textTransform: 'uppercase',
              margin: 0,
              paddingLeft: '0.25rem'
            }}
          >
            Personal Details
          </h2>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              overflow: 'hidden'
            }}
          >
            {/* Phone */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.875rem 1rem',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#f2f2f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <GoogleIcon name="call" size={18} color="#1c1c1e" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#8e8e93', letterSpacing: '0.01em' }}>
                  Phone
                </span>
                <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1c1c1e', letterSpacing: '-0.01em' }}>
                  {displayPhone}
                </span>
              </div>
            </div>

            {/* Aadhar Number */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.875rem 1rem',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#f2f2f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <GoogleIcon name="badge" size={18} color="#1c1c1e" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#8e8e93', letterSpacing: '0.01em' }}>
                  Aadhaar Number
                </span>
                <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1c1c1e', letterSpacing: '-0.01em' }}>
                  {displayAadhaar}
                </span>
              </div>
            </div>

            {/* Location */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.875rem 1rem',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#f2f2f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <GoogleIcon name="location_on" size={18} color="#1c1c1e" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#8e8e93', letterSpacing: '0.01em' }}>
                  Location
                </span>
                <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1c1c1e', letterSpacing: '-0.01em' }}>
                  {displayLocation}
                </span>
              </div>
            </div>

            {/* Date of Birth / Age Swipe Toggle */}
            <div
              onTouchStart={handleDobTouchStart}
              onTouchEnd={handleDobTouchEnd}
              onClick={handleDobClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.875rem 1rem',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#f2f2f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <GoogleIcon name="calendar_today" size={18} color="#1c1c1e" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                <span
                  key={showAge ? 'age-lbl' : 'dob-lbl'}
                  className="apple-fade-enter"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#8e8e93',
                    letterSpacing: '0.01em',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {showAge ? 'Age' : 'Date of Birth'}
                </span>
                <span
                  key={showAge ? 'age-val' : 'dob-val'}
                  className="apple-fade-enter"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    color: '#1c1c1e',
                    letterSpacing: '-0.01em',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {showAge ? calculatedAge : displayDob}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Account Settings Section (Apple Inset Grouped) */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginTop: '0.5rem'
          }}
        >
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: '600',
              letterSpacing: '0.04em',
              color: '#6e6e73',
              textTransform: 'uppercase',
              margin: 0,
              paddingLeft: '0.25rem'
            }}
          >
            Account Settings
          </h2>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              overflow: 'hidden'
            }}
          >
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
              {/* General (Language, Preferences, Full-Screen Sidebar) */}
              <li style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                <button
                  onClick={() => setIsGeneralOpen(true)}
                  className="apple-tap"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#f2f2f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <GoogleIcon name="tune" size={18} color="#1c1c1e" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1c1c1e' }}>
                        General
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#8e8e93' }}>
                        Language, App Preferences & Session
                      </span>
                    </div>
                  </div>
                  <GoogleIcon name="chevron_right" size={18} color="#c7c7cc" />
                </button>
              </li>

              {/* My Submissions */}
              <li style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                <button
                  onClick={() => navigate('/my-submissions')}
                  className="apple-tap"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#f2f2f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <GoogleIcon name="assignment" size={18} color="#1c1c1e" />
                    </div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#1c1c1e' }}>
                      My Submissions
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {submissions.length > 0 && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: '#f2f2f7',
                          color: '#3a3a3c'
                        }}
                      >
                        {submissions.length}
                      </span>
                    )}
                    <GoogleIcon name="chevron_right" size={18} color="#c7c7cc" />
                  </div>
                </button>
              </li>

              {/* Personal Information */}
              <li style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                <button
                  className="apple-tap"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#f2f2f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <GoogleIcon name="person_outline" size={18} color="#1c1c1e" />
                    </div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#1c1c1e' }}>
                      Personal Information
                    </span>
                  </div>
                  <GoogleIcon name="chevron_right" size={18} color="#c7c7cc" />
                </button>
              </li>

              {/* Notification Preferences */}
              <li style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                <button
                  className="apple-tap"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#f2f2f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <GoogleIcon name="notifications_none" size={18} color="#1c1c1e" />
                    </div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#1c1c1e' }}>
                      Notification Preferences
                    </span>
                  </div>
                  <GoogleIcon name="chevron_right" size={18} color="#c7c7cc" />
                </button>
              </li>

              {/* Privacy & Security */}
              <li>
                <button
                  className="apple-tap"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#f2f2f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <GoogleIcon name="lock_outline" size={18} color="#1c1c1e" />
                    </div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#1c1c1e' }}>
                      Privacy & Security
                    </span>
                  </div>
                  <GoogleIcon name="chevron_right" size={18} color="#c7c7cc" />
                </button>
              </li>
            </ul>
          </div>
        </section>

      </main>

      {/* Full-Screen Apple General Settings Drawer */}
      <GeneralSettingsDrawer
        isOpen={isGeneralOpen}
        onClose={() => setIsGeneralOpen(false)}
        userData={storedUser}
      />
    </div>
  );
};
