import React from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const AadhaarWelcomeModal = ({
  isOpen,
  onClose,
  onSetPfp,
  userData = {}
}) => {
  if (!isOpen) return null;

  const displayName = userData?.name || 'Rahul Verma';
  const displayPhone = userData?.mobile || '+91 98123 45670';
  const displayDob = userData?.dob || '15/08/1996';
  const displayLocation = userData?.district
    ? `${userData.district}, ${userData.state || 'Jharkhand'}`
    : 'Ranchi, Jharkhand';
  const displayAadhaar = userData?.maskedAadhaar || (userData?.aadhaar ? `•••• •••• ${userData.aadhaar.slice(-4)}` : '•••• •••• 3456');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        animation: 'appleFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="apple-card-elevated"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'applePop 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1.75rem 1.5rem 1.25rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #f8fbf9 0%, #ffffff 100%)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2
            style={{
              fontSize: '1.375rem',
              lineHeight: '1.75rem',
              fontWeight: '800',
              letterSpacing: '-0.025em',
              color: '#1a1c1c',
              margin: '0 0 0.5rem 0'
            }}
          >
            UIDAI Aadhaar Verified
          </h2>

          <p
            style={{
              fontSize: '0.875rem',
              lineHeight: '1.35',
              color: '#555555',
              margin: 0,
              maxWidth: '380px'
            }}
          >
            All details like your <strong>Full Name</strong>, <strong>Mobile Number</strong>, and <strong>Date of Birth</strong> have been securely fetched from your Aadhaar card.
          </p>
        </div>

        {/* Fetched Information Summary Box */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              backgroundColor: '#f9f9fb',
              borderRadius: '1rem',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              padding: '0.875rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
          >
            {/* Name */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ color: '#6e6e73', fontWeight: '500' }}>Full Name</span>
              <span style={{ color: '#1c1c1e', fontWeight: '700' }}>{displayName}</span>
            </div>

            {/* Mobile */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ color: '#6e6e73', fontWeight: '500' }}>Registered Mobile</span>
              <span style={{ color: '#1c1c1e', fontWeight: '600', fontFamily: 'monospace' }}>{displayPhone}</span>
            </div>

            {/* DOB */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ color: '#6e6e73', fontWeight: '500' }}>Date of Birth</span>
              <span style={{ color: '#1c1c1e', fontWeight: '600' }}>{displayDob}</span>
            </div>

            {/* Aadhaar Number */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ color: '#6e6e73', fontWeight: '500' }}>Aadhaar Card</span>
              <span style={{ color: '#1c1c1e', fontWeight: '600', fontFamily: 'monospace' }}>{displayAadhaar}</span>
            </div>

            {/* Address */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ color: '#6e6e73', fontWeight: '500' }}>Address</span>
              <span style={{ color: '#1c1c1e', fontWeight: '600' }}>{displayLocation}</span>
            </div>
          </div>

          <p
            style={{
              fontSize: '0.8125rem',
              lineHeight: '1.4',
              color: '#6e6e73',
              textAlign: 'center',
              margin: '0.25rem 0 0 0'
            }}
          >
            Personalize your citizen presence by uploading your profile picture.
          </p>
        </div>

        {/* Bottom Actions (Apple style) */}
        <div
          style={{
            padding: '0.75rem 1.5rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <button
            onClick={onSetPfp}
            className="apple-tap"
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '9999px',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: '0.9375rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.1s ease-out'
            }}
          >
            <GoogleIcon name="add_a_photo" size={20} color="#ffffff" />
            <span>Set Profile Picture</span>
          </button>

          <button
            onClick={onClose}
            className="apple-tap"
            style={{
              width: '100%',
              height: '40px',
              borderRadius: '9999px',
              backgroundColor: 'transparent',
              color: '#6e6e73',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.15s ease'
            }}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
