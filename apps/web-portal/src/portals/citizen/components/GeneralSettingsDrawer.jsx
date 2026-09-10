import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useLanguage } from '../../../context/LanguageContext';

export const GeneralSettingsDrawer = ({
  isOpen,
  onClose,
  userData = {}
}) => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage, languages, languageMeta, t } = useLanguage();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [selectedLangId, setSelectedLangId] = useState(currentLanguage);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Sync selected language when drawer opens or currentLanguage changes
  useEffect(() => {
    if (isOpen) {
      setSelectedLangId(currentLanguage);
      setSavedSuccess(false);
      setIsClosing(false);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, currentLanguage]);

  // Smooth Apple back transition
  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  };

  // Save changes handler - explicitly updates and persists language
  const handleSaveLanguage = () => {
    setLanguage(selectedLangId);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsLangDropdownOpen(false);
    }, 600);
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
    // Redirect cleanly to onboarding
    navigate('/onboarding');
  };

  if (!isOpen && !isClosing) return null;

  const hasUnsavedChanges = selectedLangId !== currentLanguage;
  const activeSelectedMeta = languages.find((l) => l.id === selectedLangId) || languageMeta;

  const drawerContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 9999999,
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        animation: isClosing
          ? 'appleSlideOutRight 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          : 'appleSlideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Bar with '<' Back button on Top-Left Corner */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.25rem',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* '<' Back Button on the Top Left Corner */}
        <button
          onClick={handleBack}
          className="apple-tap"
          title="Back"
          aria-label="Back"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.15s ease'
          }}
        >
          <GoogleIcon name="chevron_left" size={24} color="#1a1c1c" />
        </button>

        <span
          style={{
            fontSize: '1.0625rem',
            fontWeight: '700',
            color: '#1a1c1c',
            letterSpacing: '-0.01em'
          }}
        >
          {t('general', 'General')}
        </span>

        {/* Empty placeholder for symmetrical balance */}
        <div style={{ width: '36px' }} />
      </header>

      {/* Main Content Area - Consistent with Setu UI */}
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
          gap: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 1: Language Settings */}
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
              {t('language_region', 'Language & Region')}
            </span>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden'
              }}
            >
              {/* Language Selector Trigger Button */}
              <button
                onClick={() => setIsLangDropdownOpen((prev) => !prev)}
                className="apple-tap"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  {/* Neutral Icon Container (Not blue) */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#f2f2f7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1c1c1e',
                      flexShrink: 0
                    }}
                  >
                    <GoogleIcon name="translate" size={20} color="#1c1c1e" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1c1c1e' }}>
                      {t('language', 'Language')}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: '#6e6e73' }}>
                      {activeSelectedMeta?.nativeName} ({activeSelectedMeta?.name})
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#1a1c1c'
                    }}
                  >
                    {isLangDropdownOpen ? t('done', 'Done') : t('change', 'Change')}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isLangDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <GoogleIcon
                      name="expand_more"
                      size={20}
                      color="#8e8e93"
                    />
                  </div>
                </div>
              </button>

              {/* Smooth Apple Accordion Transition - No search bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: isLangDropdownOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                  borderTop: isLangDropdownOpen ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid transparent'
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      padding: '0.75rem 1rem 1rem 1rem',
                      backgroundColor: '#fafafc',
                      opacity: isLangDropdownOpen ? 1 : 0,
                      transform: isLangDropdownOpen ? 'translateY(0)' : 'translateY(-6px)',
                      transition: 'opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {/* All 22 Scheduled Indian Languages Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gap: '0.4rem',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        paddingRight: '4px'
                      }}
                    >
                      {(languages || []).map((l) => {
                        const isSelected = selectedLangId === l.id;
                        return (
                          <button
                            key={l.id}
                            onClick={() => {
                              setSelectedLangId(l.id);
                            }}
                            className="apple-tap"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.625rem 0.75rem',
                              borderRadius: '10px',
                              border: isSelected ? '1px solid rgba(0, 0, 0, 0.15)' : '1px solid rgba(0, 0, 0, 0.04)',
                              backgroundColor: isSelected ? '#1c1c1e' : '#ffffff',
                              color: isSelected ? '#ffffff' : '#1c1c1e',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.875rem', fontWeight: isSelected ? '700' : '600' }}>
                                {l.nativeName}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.6875rem',
                                  color: isSelected ? 'rgba(255, 255, 255, 0.7)' : '#8e8e93'
                                }}
                              >
                                {l.name}
                              </span>
                            </div>
                            {isSelected && (
                              <GoogleIcon name="check" size={16} color="#ffffff" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Aadhaar Identity Info */}
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
              {t('identity_status', 'Identity Status')}
            </span>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#e6f7ed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0d8042',
                      flexShrink: 0
                    }}
                  >
                    <GoogleIcon name="verified_user" size={20} color="#0d8042" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1c1c1e' }}>
                      {t('uidai_aadhaar', 'UIDAI Aadhaar')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#8e8e93' }}>
                      {t('government_identity_connected', 'Government Identity Connected')}
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#0d8042',
                    backgroundColor: '#e6f7ed',
                    padding: '3px 10px',
                    borderRadius: '9999px'
                  }}
                >
                  {t('verified', 'Verified')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Save Changes Pop-Up Button, Sign Out Button & Setu Version */}
        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', alignItems: 'center' }}>
          {/* Pop-Up Save Changes Button when a new language is selected */}
          {(hasUnsavedChanges || savedSuccess) && (
            <div
              style={{
                width: '100%',
                animation: 'applePop 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <button
                onClick={handleSaveLanguage}
                className="apple-tap"
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: savedSuccess ? '#0d8042' : '#000000',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: '700',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.625rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <GoogleIcon name={savedSuccess ? 'check_circle' : 'save'} size={20} color="#ffffff" />
                <span>
                  {savedSuccess
                    ? t('changes_saved', 'Language Saved!')
                    : `${t('save_changes', 'Save Changes')} (${activeSelectedMeta?.nativeName})`}
                </span>
              </button>
            </div>
          )}

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
              transition: 'all 0.15s ease'
            }}
          >
            <GoogleIcon name="logout" size={20} color="#dc2626" />
            <span>{isLoggingOut ? t('signing_out', 'Signing out...') : t('sign_out', 'Sign Out')}</span>
          </button>

          {/* Simple Setu version at bottom - no note under signout */}
          <span
            style={{
              fontSize: '0.75rem',
              color: '#8e8e93',
              fontWeight: '500',
              letterSpacing: '0.01em',
              paddingBottom: '0.5rem'
            }}
          >
            Setu v0.0.9
          </span>
        </div>
      </main>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(drawerContent, document.body)
    : drawerContent;
};
