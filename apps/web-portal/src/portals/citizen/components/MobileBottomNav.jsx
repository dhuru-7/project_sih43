import React from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const MobileBottomNav = ({ activeNav, setActiveNav, onOpenTara, onOpenReport }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
        left: 0,
        right: 0,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 16px',
        pointerEvents: 'none',
        boxSizing: 'border-box'
      }}
    >
      <nav
        className="apple-floating-capsule-nav"
        style={{
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: '384px',
          height: '66px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          borderRadius: '9999px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          boxSizing: 'border-box'
        }}
        aria-label="Bottom Navigation"
      >
        {/* 1. Home Button */}
        <button
          onClick={() => setActiveNav('home')}
          className="apple-tap"
          style={{
            width: '56px',
            height: '44px',
            borderRadius: '9999px',
            backgroundColor: activeNav === 'home' ? '#e8e8ed' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease'
          }}
          aria-label="Home"
        >
          <GoogleIcon
            name="home"
            size={24}
            fill={activeNav === 'home'}
            color={activeNav === 'home' ? '#000000' : '#2c2c2e'}
          />
        </button>

        {/* 2. Explore / Compass Button */}
        <button
          onClick={() => setActiveNav('explore')}
          className="apple-tap"
          style={{
            width: '56px',
            height: '44px',
            borderRadius: '9999px',
            backgroundColor: activeNav === 'explore' ? '#e8e8ed' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease'
          }}
          aria-label="Explore"
        >
          <GoogleIcon
            name="explore"
            size={24}
            fill={activeNav === 'explore'}
            color={activeNav === 'explore' ? '#000000' : '#2c2c2e'}
          />
        </button>

        {/* 3. Center Elevated Action Button (+) */}
        <button
          onClick={onOpenReport || onOpenTara}
          className="apple-tap"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#000000',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.22)',
            flexShrink: 0,
            padding: 0,
            transition: 'transform 0.15s ease, opacity 0.15s ease'
          }}
          aria-label="Report Issue"
        >
          <GoogleIcon name="add" size={26} color="#ffffff" />
        </button>

        {/* 4. Messages Button */}
        <button
          onClick={() => setActiveNav('messages')}
          className="apple-tap"
          style={{
            width: '56px',
            height: '44px',
            borderRadius: '9999px',
            backgroundColor: activeNav === 'messages' ? '#e8e8ed' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: 0,
            transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease'
          }}
          aria-label="Messages"
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GoogleIcon
              name="chat"
              size={24}
              fill={activeNav === 'messages'}
              color={activeNav === 'messages' ? '#000000' : '#2c2c2e'}
            />
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ff3b30',
                border: '1.5px solid #ffffff',
                boxSizing: 'border-box',
                pointerEvents: 'none'
              }}
            />
          </div>
        </button>

        {/* 5. Profile Button */}
        <button
          onClick={() => setActiveNav('profile')}
          className="apple-tap"
          style={{
            width: '56px',
            height: '44px',
            borderRadius: '9999px',
            backgroundColor: activeNav === 'profile' ? '#e8e8ed' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease'
          }}
          aria-label="Profile"
        >
          <GoogleIcon
            name="person"
            size={24}
            fill={activeNav === 'profile'}
            color={activeNav === 'profile' ? '#000000' : '#2c2c2e'}
          />
        </button>
      </nav>
    </div>
  );
};
