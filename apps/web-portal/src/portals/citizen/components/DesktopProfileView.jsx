import React, { useMemo, useState, useRef } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const DesktopProfileView = ({
  activeNav,
  setActiveNav,
  userName = 'Rahul Verma',
  onOpenTara,
  onOpenReportDetail
}) => {
  const storedUser = useMemo(() => {
    try {
      const u = localStorage.getItem('setu_user') || localStorage.getItem('sih_user_data');
      return u ? JSON.parse(u) : {};
    } catch (e) {
      return {};
    }
  }, []);

  const displayName = storedUser.name || userName || 'Rahul Verma';
  const displayPhone = storedUser.mobile || '+91 98123 45670';
  const displayAadhaar = storedUser.maskedAadhaar || (storedUser.aadhaar ? `XXXX XXXX ${storedUser.aadhaar.replace(/\s+/g, '').slice(-4)}` : '•••• •••• 3456');
  const displayLocation = storedUser.district ? `${storedUser.district}, ${storedUser.state || 'Jharkhand'}` : 'Ranchi, Jharkhand';
  const displayDob = storedUser.dob || '15/08/1996';

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
    if (Math.abs(touchEndX - touchStartX.current) > 20) {
      setShowAge((prev) => !prev);
    }
    touchStartX.current = null;
  };

  const handleDobClick = () => {
    setShowAge((prev) => !prev);
  };
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f9f9f9', color: '#1a1c1c' }}>
      {/* 1. Left Persistent Expanded Sidemenu (Identical to DesktopHomeView/DesktopExploreView) */}
      <aside
        className="apple-frosted-sidebar"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '256px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 14px',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '44px',
              padding: '0 10px',
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                color: '#000000',
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
                lineHeight: 1
              }}
            >
              Setu.
            </span>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>
            {[
              { id: 'home', label: 'Home', icon: 'home', badge: null },
              { id: 'explore', label: 'Explore', icon: 'explore', badge: null },
              { id: 'report', label: 'Report Issue', icon: 'add_circle', badge: null, highlight: true },
              { id: 'messages', label: 'Messages', icon: 'chat', badge: '3' }
            ].map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.id === 'report') onOpenTara();
                  }}
                  className="apple-tap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '44px',
                    minHeight: '44px',
                    maxHeight: '44px',
                    boxSizing: 'border-box',
                    padding: '0 10px',
                    borderRadius: '0.75rem',
                    backgroundColor: isActive ? '#eeeeee' : 'transparent',
                    color: isActive ? '#000000' : '#4c4546',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <GoogleIcon
                      name={item.icon}
                      size={20}
                      fill={isActive}
                      color={isActive ? '#000000' : '#5e5e5e'}
                    />
                    {item.id === 'messages' && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-1px',
                          right: '-1px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#ff3b30',
                          border: '1.5px solid #ffffff',
                          boxSizing: 'border-box',
                          pointerEvents: 'none'
                        }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      marginLeft: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '9999px',
                        backgroundColor: '#ff3b30',
                        color: '#ffffff',
                        fontSize: '0.6875rem',
                        fontWeight: '700',
                        lineHeight: 1,
                        flexShrink: 0
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <div
            onClick={() => setActiveNav('profile')}
            className="apple-tap"
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '44px',
              minHeight: '44px',
              maxHeight: '44px',
              boxSizing: 'border-box',
              padding: '0 5px',
              borderRadius: '0.75rem',
              backgroundColor: activeNav === 'profile' ? '#eeeeee' : 'transparent',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'background-color 0.15s ease'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#000000',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <GoogleIcon name="person" size={18} color="#ffffff" />
            </div>
            <div
              style={{
                marginLeft: '10px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1a1c1c', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {userName || 'Rahul Verma'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#5e5e5e', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                Ward 4
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Canvas */}
      <div style={{ flex: 1, marginLeft: '256px', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: 'calc(100% - 256px)' }}>
        <main
          className="apple-page-enter"
          style={{
            width: '100%',
            backgroundColor: '#f9f9f9',
            minHeight: '100vh',
            padding: '0 2rem 4rem 2rem',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '4rem' }}>
            {/* Header: Title */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <h1
                  style={{
                    fontSize: '1.5rem',
                    lineHeight: '2rem',
                    fontWeight: '600',
                    letterSpacing: '-0.01em',
                    color: '#1a1c1c',
                    margin: 0
                  }}
                >
                  Profile
                </h1>
              </div>
            </div>

            {/* 12-Column Grid matching Stitch */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '2rem',
                alignItems: 'start'
              }}
            >
              {/* Left Column (4 cols) */}
              <div
                style={{
                  gridColumn: 'span 4',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
              >
                {/* Profile Card */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6rem',
                      backgroundColor: '#f3f3f3'
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 10, marginTop: '1.5rem', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '7rem',
                        height: '7rem',
                        borderRadius: '50%',
                        backgroundColor: '#eeeeee',
                        padding: '0.25rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyCHP9GwCX-AKcq_nVkK-tjZy2rPHvI12nyIEeea4b_8n7AHcKf1IKjGJECP12zPi5wgh26yjFRZ5OWx339njztMER-PUBTdtJCYjHZPSNebaqZLk6UdNTW3oOiU95NfsDk4Eag0wt05sHBO7QuUw8vjElUnZ8gGMpGkY4D89jkeN00DrGZdn--wUlAq8yYhasElZSzeMqobYl2nk06uvjHB7pduWJdHEE_1n7x9_3QMziOaby5bHjfw"
                        alt={userName || 'Alex Chen'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    </div>
                    <span
                      title="Edit Photo"
                      style={{
                        position: 'absolute',
                        bottom: '0.25rem',
                        right: '0.25rem',
                        width: '1.5rem',
                        height: '1.5rem',
                        borderRadius: '50%',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <GoogleIcon name="edit" size={14} color="#ffffff" />
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', zIndex: 10, width: '100%' }}>
                    <h2
                      style={{
                        fontSize: '1.25rem',
                        lineHeight: '1.75rem',
                        fontWeight: '700',
                        color: '#1a1c1c',
                        margin: 0
                      }}
                    >
                      {displayName}
                    </h2>
                  </div>
                </div>

                {/* Personal Details Card */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          lineHeight: '1.75rem',
                          fontWeight: '600',
                          color: '#1a1c1c',
                          margin: 0
                        }}
                      >
                        Personal Details
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Mobile Number */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.875rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f3f3f3',
                        gap: '0.75rem'
                      }}
                    >
                      <div
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1a1c1c',
                          flexShrink: 0,
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <GoogleIcon name="call" size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '0.75rem', lineHeight: '1rem', color: '#5e5e5e', fontWeight: '500' }}>
                          Mobile Number
                        </span>
                        <span
                          style={{
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                            color: '#1a1c1c',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {displayPhone}
                        </span>
                      </div>
                    </div>

                    {/* Aadhaar Number */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.875rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f3f3f3',
                        gap: '0.75rem'
                      }}
                    >
                      <div
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1a1c1c',
                          flexShrink: 0,
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <GoogleIcon name="badge" size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '0.75rem', lineHeight: '1rem', color: '#5e5e5e', fontWeight: '500' }}>
                          Aadhaar Number
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', lineHeight: '1.25rem', color: '#1a1c1c', fontWeight: '600' }}>
                            {displayAadhaar}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ward & Location */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.875rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f3f3f3',
                        gap: '0.75rem'
                      }}
                    >
                      <div
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1a1c1c',
                          flexShrink: 0,
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <GoogleIcon name="location_on" size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '0.75rem', lineHeight: '1rem', color: '#5e5e5e', fontWeight: '500' }}>
                          Ward & Location
                        </span>
                        <span
                          style={{
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                            color: '#1a1c1c',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
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
                        padding: '0.875rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f3f3f3',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1a1c1c',
                          flexShrink: 0,
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <GoogleIcon name="calendar_today" size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span
                          key={showAge ? 'desktop-age-lbl' : 'desktop-dob-lbl'}
                          className="apple-fade-enter"
                          style={{ fontSize: '0.75rem', lineHeight: '1rem', color: '#5e5e5e', fontWeight: '500' }}
                        >
                          {showAge ? 'Age' : 'Date of Birth'}
                        </span>
                        <span
                          key={showAge ? 'desktop-age-val' : 'desktop-dob-val'}
                          className="apple-fade-enter"
                          style={{
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                            color: '#1a1c1c',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {showAge ? calculatedAge : displayDob}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (8 cols) */}
              <div
                style={{
                  gridColumn: 'span 8',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
              >
                {/* Account Settings Card */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          lineHeight: '1.75rem',
                          fontWeight: '600',
                          color: '#1a1c1c',
                          margin: 0
                        }}
                      >
                        Account Settings
                      </h3>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.75rem',
                      paddingTop: '0.5rem'
                    }}
                  >
                    {/* Personal Information */}
                    <div
                      className="apple-tap"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.875rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f3f3f3',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '2.25rem',
                            height: '2.25rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1a1c1c'
                          }}
                        >
                          <GoogleIcon name="contact_page" size={20} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: '600', color: '#1a1c1c' }}>
                            Personal Information
                          </span>
                        </div>
                      </div>
                      <GoogleIcon name="chevron_right" size={20} color="#5e5e5e" />
                    </div>

                    {/* Notification Preferences */}
                    <div
                      className="apple-tap"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.875rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f3f3f3',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '2.25rem',
                            height: '2.25rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1a1c1c'
                          }}
                        >
                          <GoogleIcon name="notifications_active" size={20} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: '600', color: '#1a1c1c' }}>
                            Notification Preferences
                          </span>
                        </div>
                      </div>
                      <GoogleIcon name="chevron_right" size={20} color="#5e5e5e" />
                    </div>

                    {/* Privacy & Security */}
                    <div
                      className="apple-tap"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.875rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f3f3f3',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '2.25rem',
                            height: '2.25rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1a1c1c'
                          }}
                        >
                          <GoogleIcon name="security" size={20} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: '600', color: '#1a1c1c' }}>
                            Privacy & Security
                          </span>
                        </div>
                      </div>
                      <GoogleIcon name="chevron_right" size={20} color="#5e5e5e" />
                    </div>
                  </div>
                </div>

                {/* My Reports Card */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          lineHeight: '1.75rem',
                          fontWeight: '600',
                          color: '#1a1c1c',
                          margin: 0
                        }}
                      >
                        My Reports
                      </h3>
                    </div>
                    <div
                      onClick={() => setActiveNav('explore')}
                      className="apple-tap"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#f3f3f3',
                        color: '#1a1c1c',
                        fontSize: '0.75rem',
                        lineHeight: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <span>View All</span>
                      <GoogleIcon name="arrow_forward" size={14} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
                    {/* Report 1 */}
                    <div
                      className="apple-tap"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f3f3f3',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                        <div
                          style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '0.75rem',
                            backgroundColor: '#e8e8e8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <GoogleIcon name="water_damage" size={24} color="#1a1c1c" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', lineHeight: '1rem', fontFamily: 'monospace', color: '#5e5e5e' }}>
                              #REP-4092
                            </span>
                            <span style={{ color: '#cfc4c5' }}>•</span>
                            <span style={{ fontSize: '0.75rem', lineHeight: '1rem', color: '#5e5e5e' }}>
                              Yesterday, 14:20
                            </span>
                          </div>
                          <h4
                            style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.25rem',
                              fontWeight: '600',
                              color: '#1a1c1c',
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            Broken water drainage pipe near Market Square
                          </h4>
                          <p
                            style={{
                              fontSize: '0.75rem',
                              lineHeight: '1rem',
                              color: '#5e5e5e',
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            Sector 3, Main Junction Road, Pattikalyana
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        <div
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1a1c1c'
                          }}
                        >
                          <GoogleIcon name="arrow_forward" size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Report 2 */}
                    <div
                      className="apple-tap"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f3f3f3',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                        <div
                          style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '0.75rem',
                            backgroundColor: '#e8e8e8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <GoogleIcon name="streetview" size={24} color="#1a1c1c" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', lineHeight: '1rem', fontFamily: 'monospace', color: '#5e5e5e' }}>
                              #REP-3981
                            </span>
                            <span style={{ color: '#cfc4c5' }}>•</span>
                            <span style={{ fontSize: '0.75rem', lineHeight: '1rem', color: '#5e5e5e' }}>
                              18 Apr 2024
                            </span>
                          </div>
                          <h4
                            style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.25rem',
                              fontWeight: '600',
                              color: '#1a1c1c',
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            Unlit streetlamp causing nighttime hazard
                          </h4>
                          <p
                            style={{
                              fontSize: '0.75rem',
                              lineHeight: '1rem',
                              color: '#5e5e5e',
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            North Outer Ring, Lane 4, Ward 4
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        <div
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1a1c1c'
                          }}
                        >
                          <GoogleIcon name="arrow_forward" size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Report 3 */}
                    <div
                      className="apple-tap"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f3f3f3',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                        <div
                          style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '0.75rem',
                            backgroundColor: '#e8e8e8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <GoogleIcon name="delete" size={24} color="#1a1c1c" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', lineHeight: '1rem', fontFamily: 'monospace', color: '#5e5e5e' }}>
                              #REP-3814
                            </span>
                            <span style={{ color: '#cfc4c5' }}>•</span>
                            <span style={{ fontSize: '0.75rem', lineHeight: '1rem', color: '#5e5e5e' }}>
                              02 Apr 2024
                            </span>
                          </div>
                          <h4
                            style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.25rem',
                              fontWeight: '600',
                              color: '#1a1c1c',
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            Illegal trash accumulation at Community Center park
                          </h4>
                          <p
                            style={{
                              fontSize: '0.75rem',
                              lineHeight: '1rem',
                              color: '#5e5e5e',
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            Parkway West, Pattikalyana
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        <div
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1a1c1c'
                          }}
                        >
                          <GoogleIcon name="arrow_forward" size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
