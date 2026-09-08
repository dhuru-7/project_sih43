import React from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const MobileProfileView = ({
  userName = 'Alex Chen',
  setActiveNav
}) => {
  return (
    <div
      className="apple-page-enter"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
    >
      {/* Mobile TopAppBar (Exact Stitch) */}
      <header
        style={{
          backgroundColor: '#ffffff',
          color: '#000000',
          width: '100%',
          position: 'sticky',
          top: 0,
          borderBottom: '1px solid #cfc4c5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 20px',
          zIndex: 40,
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            fontSize: '20px',
            lineHeight: '28px',
            fontWeight: '600',
            color: '#000000',
            letterSpacing: '-0.01em'
          }}
        >
          Profile
        </div>
      </header>

      {/* Main Content (Exact Stitch) */}
      <main
        style={{
          flexGrow: 1,
          padding: '20px',
          paddingBottom: '80px',
          boxSizing: 'border-box'
        }}
      >
        {/* Profile Summary */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '32px'
          }}
        >
          <div
            style={{
              width: '8rem',
              height: '8rem',
              borderRadius: '50%',
              overflow: 'hidden',
              marginBottom: '16px',
              border: '2px solid #cfc4c5'
            }}
          >
            <img
              alt="User Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd7Q5nXugqNrYH6tTlJ1gPhmYZQXQu98rd1Gm0GQOQwZIIlWY3ahiBUR3xLqWmW1JX_WhXWMnVWsSz1JWolSZiNoJMwZmxt4lVKcxxS2eHBcIDyaojSejOSrMf_hpe606-2aDFO52eADSwwES5Br1PuGAi9WlzrGHNGnyTdJmFarDE4Tee6eC354TkyYqo6mmnoYg-JRWfVhxKz4e1mt0Sq1LOhgZ-1E1AE-Z-T6v-Vs3xQivPctWkCQ"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <h1
            style={{
              fontSize: '24px',
              lineHeight: '32px',
              letterSpacing: '-0.01em',
              fontWeight: '600',
              color: '#1a1c1c',
              marginBottom: '4px',
              margin: 0
            }}
          >
            {userName || 'Alex Chen'}
          </h1>
        </section>

        {/* Bento Grid for Stats/Actions */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          {/* Personal Details Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cfc4c5',
              borderRadius: '0.75rem',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxSizing: 'border-box'
            }}
          >
            <h2
              style={{
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '0.05em',
                fontWeight: '500',
                color: '#5e5e5e',
                textTransform: 'uppercase',
                marginBottom: '8px',
                margin: 0
              }}
            >
              Personal Details
            </h2>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#eeeeee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <GoogleIcon name="call" size={24} color="#1a1c1c" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '500', color: '#5e5e5e' }}>
                    Phone
                  </span>
                  <span style={{ fontSize: '20px', lineHeight: '28px', fontWeight: '600', color: '#1a1c1c' }}>
                    +91 98765 43210
                  </span>
                </div>
              </div>

              {/* Aadhar Number */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#eeeeee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1a1c1c',
                    flexShrink: 0
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                  >
                    <path d="M560-440h200v-80H560v80Zm0-120h200v-80H560v80ZM200-320h320v-22q0-45-44-71.5T360-440q-72 0-116 26.5T200-342v22Zm216.5-183.5Q440-527 440-560t-23.5-56.5Q393-640 360-640t-56.5 23.5Q280-593 280-560t23.5 56.5Q327-480 360-480t56.5-23.5ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '500', color: '#5e5e5e' }}>
                    Aadhar Number
                  </span>
                  <span style={{ fontSize: '20px', lineHeight: '28px', fontWeight: '600', color: '#1a1c1c' }}>
                    XXXX XXXX 1234
                  </span>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#eeeeee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <GoogleIcon name="location_on" size={24} color="#1a1c1c" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '500', color: '#5e5e5e' }}>
                    Location
                  </span>
                  <span style={{ fontSize: '20px', lineHeight: '28px', fontWeight: '600', color: '#1a1c1c' }}>
                    Pattikalyana
                  </span>
                </div>
              </div>

              {/* Date of Birth */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#eeeeee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <GoogleIcon name="calendar_today" size={24} color="#1a1c1c" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '500', color: '#5e5e5e' }}>
                    Date of Birth
                  </span>
                  <span style={{ fontSize: '20px', lineHeight: '28px', fontWeight: '600', color: '#1a1c1c' }}>
                    26 years old
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Settings List (Exact Stitch) */}
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cfc4c5',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              lineHeight: '28px',
              fontWeight: '600',
              color: '#1a1c1c',
              padding: '16px',
              borderBottom: '1px solid #cfc4c5',
              backgroundColor: '#f9f9f9',
              margin: 0
            }}
          >
            Account Settings
          </h3>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
            {/* My Reports */}
            <li style={{ borderBottom: '1px solid #cfc4c5' }}>
              <button
                onClick={() => setActiveNav && setActiveNav('explore')}
                className="apple-tap"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <GoogleIcon name="assignment" size={24} color="#5e5e5e" />
                  <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: '400', color: '#1a1c1c' }}>
                    My Reports
                  </span>
                </div>
                <GoogleIcon name="chevron_right" size={24} color="#5e5e5e" />
              </button>
            </li>

            {/* Personal Information */}
            <li style={{ borderBottom: '1px solid #cfc4c5' }}>
              <button
                className="apple-tap"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <GoogleIcon name="person_outline" size={24} color="#5e5e5e" />
                  <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: '400', color: '#1a1c1c' }}>
                    Personal Information
                  </span>
                </div>
                <GoogleIcon name="chevron_right" size={24} color="#5e5e5e" />
              </button>
            </li>

            {/* Notification Preferences */}
            <li style={{ borderBottom: '1px solid #cfc4c5' }}>
              <button
                className="apple-tap"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <GoogleIcon name="notifications_none" size={24} color="#5e5e5e" />
                  <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: '400', color: '#1a1c1c' }}>
                    Notification Preferences
                  </span>
                </div>
                <GoogleIcon name="chevron_right" size={24} color="#5e5e5e" />
              </button>
            </li>

            {/* Privacy & Security */}
            <li style={{ borderBottom: 'none' }}>
              <button
                className="apple-tap"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <GoogleIcon name="lock_outline" size={24} color="#5e5e5e" />
                  <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: '400', color: '#1a1c1c' }}>
                    Privacy & Security
                  </span>
                </div>
                <GoogleIcon name="chevron_right" size={24} color="#5e5e5e" />
              </button>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};
