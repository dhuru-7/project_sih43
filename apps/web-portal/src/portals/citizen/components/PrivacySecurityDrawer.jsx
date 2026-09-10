import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useLanguage } from '../../../context/LanguageContext';

export const PrivacySecurityDrawer = ({
  isOpen,
  onClose,
  userData = {}
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Smooth Apple back transition matching GeneralSettingsDrawer
  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const rawUser = localStorage.getItem('setu_user') || localStorage.getItem('sih_user_data');
      const sessionId = localStorage.getItem('setu_session_id');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        const rawAadhaar = u.aadhaar ? u.aadhaar.replace(/\D/g, '') : '';
        await fetch('http://localhost:5000/api/v1/auth/aadhaar/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            aadhaarNumber: rawAadhaar,
            sessionId: sessionId || ''
          })
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Logout network notice:', e);
    }

    // Thorough storage purge
    localStorage.removeItem('setu_user');
    localStorage.removeItem('setu_session_id');
    localStorage.removeItem('setu_token');
    localStorage.removeItem('setu_onboarded');
    localStorage.removeItem('setu_user_role');
    localStorage.removeItem('setu_show_pfp_prompt');
    localStorage.removeItem('sih_user_data');
    localStorage.removeItem('sih_auth_token');
    sessionStorage.clear();

    onClose();
    navigate('/onboarding');
  };

  if (!isOpen && !isClosing) return null;

  const drawerContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.36)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden'
      }}
    >
      {/* Background click dismiss */}
      <div
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1
        }}
      />

      {/* Main Drawer Surface */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          backgroundColor: '#f2f2f7',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 48px rgba(0, 0, 0, 0.2)',
          transform: isClosing ? 'translateY(100%)' : 'translateY(0)',
          animation: isClosing ? 'none' : 'appleDrawerSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          boxSizing: 'border-box'
        }}
      >
        {/* Navigation Bar - Apple Style */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Back Action Pill */}
          <button
            onClick={handleBack}
            className="apple-tap"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f2f2f7',
              border: 'none',
              cursor: 'pointer',
              color: '#1a1c1c',
              transition: 'background-color 0.15s ease'
            }}
            aria-label="Back"
          >
            <GoogleIcon name="arrow_back_ios_new" size={18} color="#1a1c1c" />
          </button>

          {/* Heading */}
          <h2
            style={{
              fontSize: '1.0625rem',
              fontWeight: '700',
              color: '#1a1c1c',
              letterSpacing: '-0.02em',
              margin: 0
            }}
          >
            {t('privacy_security', 'Privacy & Security')}
          </h2>

          {/* Right Spacer to balance the Back button and keep title centered */}
          <div style={{ width: '36px' }} />
        </header>

        {/* Content Body */}
        <main
          style={{
            flex: 1,
            width: '100%',
            maxWidth: '560px',
            margin: '0 auto',
            padding: '1.5rem 1.25rem 2rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            gap: '1.75rem',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Account & Session Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  letterSpacing: '0.06em',
                  color: '#6e6e73',
                  textTransform: 'uppercase',
                  paddingLeft: '0.5rem'
                }}
              >
                {t('account_session', 'Account & Session')}
              </span>

              {/* Card Container */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: '#fee2e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <GoogleIcon name="shield" size={24} color="#dc2626" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#1c1c1e', margin: '0 0 2px' }}>
                      {t('sign_out_of_setu', 'Sign out of Setu')}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#8e8e93', margin: 0, lineHeight: 1.35 }}>
                      {t('sign_out_desc', 'Disconnect your active session on this device securely.')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="apple-tap"
                  style={{
                    width: '100%',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(220, 38, 38, 0.25)',
                    color: '#dc2626',
                    fontSize: '1rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 1px 3px rgba(220, 38, 38, 0.05)',
                    cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                    opacity: isLoggingOut ? 0.7 : 1,
                    transition: 'all 0.15s ease',
                    marginTop: '0.25rem'
                  }}
                >
                  <span>{isLoggingOut ? t('signing_out', 'Signing out...') : t('sign_out', 'Sign Out')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Version */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#8e8e93',
                fontWeight: '500',
                letterSpacing: '0.01em'
              }}
            >
              Setu v0.0.9 • Privacy & Security
            </span>
          </div>
        </main>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(drawerContent, document.body)
    : drawerContent;
};
