import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const MobileProfileView = ({
  userName: propUserName,
  setActiveNav
}) => {
  const navigate = useNavigate();

  const storedUser = useMemo(() => {
    try {
      const u = localStorage.getItem('setu_user') || localStorage.getItem('sih_user_data');
      return u ? JSON.parse(u) : {};
    } catch (e) {
      return {};
    }
  }, []);

  const displayName = storedUser.name || propUserName || 'Rahul Verma';
  const displayPhone = storedUser.mobile || '+91 98123 45670';
  const displayAadhaar = storedUser.maskedAadhaar || (storedUser.aadhaar ? `XXXX XXXX ${storedUser.aadhaar.replace(/\s+/g, '').slice(-4)}` : 'XXXX XXXX 3456');
  const displayLocation = storedUser.district ? `${storedUser.district}, ${storedUser.state || 'Jharkhand'}` : 'Ranchi, Jharkhand';
  const displayDob = storedUser.dob || '15/08/1996';
  const isDev = !!storedUser.isDevAccount;
  const designation = storedUser.designation || (isDev ? 'Developer Team' : 'Verified Citizen');

  const handleLogout = () => {
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
          <div
            style={{
              width: '5.5rem',
              height: '5.5rem',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 0 0 3px #ffffff, 0 0 0 4px rgba(0, 0, 0, 0.06)',
              flexShrink: 0
            }}
          >
            <img
              alt="User Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd7Q5nXugqNrYH6tTlJ1gPhmYZQXQu98rd1Gm0GQOQwZIIlWY3ahiBUR3xLqWmW1JX_WhXWMnVWsSz1JWolSZiNoJMwZmxt4lVKcxxS2eHBcIDyaojSejOSrMf_hpe606-2aDFO52eADSwwES5Br1PuGAi9WlzrGHNGnyTdJmFarDE4Tee6eC354TkyYqo6mmnoYg-JRWfVhxKz4e1mt0Sq1LOhgZ-1E1AE-Z-T6v-Vs3xQivPctWkCQ"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
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
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: isDev ? '#000000' : 'rgba(0, 0, 0, 0.05)',
              color: isDev ? '#ffffff' : '#1c1c1e',
              fontSize: '0.75rem',
              fontWeight: '600',
              letterSpacing: '0.02em'
            }}
          >
            <GoogleIcon name={isDev ? 'terminal' : 'verified_user'} size={14} color={isDev ? '#ffffff' : '#000000'} />
            <span>{designation}</span>
          </div>
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

            {/* Date of Birth */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.875rem 1rem'
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
                <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#8e8e93', letterSpacing: '0.01em' }}>
                  Date of Birth
                </span>
                <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1c1c1e', letterSpacing: '-0.01em' }}>
                  {displayDob}
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
              {/* My Reports */}
              <li style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                <button
                  onClick={() => setActiveNav && setActiveNav('explore')}
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
                      My Reports
                    </span>
                  </div>
                  <GoogleIcon name="chevron_right" size={18} color="#c7c7cc" />
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

        {/* Sign Out Section */}
        <section style={{ marginTop: '0.5rem' }}>
          <button
            onClick={handleLogout}
            className="apple-tap"
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '14px',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#dc2626',
              fontSize: '0.9375rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              cursor: 'pointer'
            }}
          >
            <GoogleIcon name="logout" size={18} color="#dc2626" />
            <span>Sign Out</span>
          </button>
        </section>
      </main>
    </div>
  );
};
