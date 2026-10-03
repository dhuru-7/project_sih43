import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleIcon } from '../ui/GoogleIcon';
import { triggerHaptic } from '../../utils/haptics';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDashboardRoute = (role) => {
    switch (role) {
      case 'GOVERNMENT': return '/oak/dashboard';
      case 'UNIVERSITY': return '/saplings/dashboard';
      case 'INDUSTRY': return '/grove/dashboard';
      default: return '/grass';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'GOVERNMENT': return <span className="badge badge-gov">🏛️ Government Official</span>;
      case 'UNIVERSITY': return <span className="badge badge-uni">🎓 University R&D</span>;
      case 'INDUSTRY': return <span className="badge badge-ind">🏢 Industry Partner</span>;
      default: return <span className="badge">{role}</span>;
    }
  };

  // Clean Apple Header for Landing Page
  if (isLandingPage) {
    return (
      <header className="setu-apple-nav">
        <div className="setu-apple-nav-inner">
          <Link to="/" className="setu-apple-brand">
            Setu.
          </Link>
          <Link
            to="/grass"
            className="setu-apple-cta header-cta-desktop-only"
            onMouseEnter={() => triggerHaptic('hover')}
            onMouseDown={() => triggerHaptic('click')}
          >
            Get Started
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="glass-nav" style={{
      height: '64px',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(229, 229, 229, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 60
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '44px', padding: '0 10px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              color: '#000000',
              fontFamily: 'var(--font-sans)',
              whiteSpace: 'nowrap',
              lineHeight: 1
            }}>
              Setu.
            </span>
          </Link>
        </div>
        {user && getRoleBadge(user.role)}
      </div>

      {/* Right Action CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <>
            <Link
              to={getRoleDashboardRoute(user.role)}
              className="setu-btn-secondary"
              style={{
                fontSize: '0.8125rem',
                padding: '0.45rem 1rem',
                borderRadius: '0.75rem'
              }}
            >
              <GoogleIcon name="dashboard" size={16} />
              <span>Dashboard</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4B5563' }}>
              <GoogleIcon name="account_circle" size={20} />
              <span style={{ fontSize: '0.8125rem', fontWeight: '500' }}>{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '0.75rem' }}>
              <GoogleIcon name="logout" size={15} /> Logout
            </button>
          </>
        ) : (
          <Link
            to="/grass"
            className="setu-btn-primary header-cta-desktop-only"
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '0.625rem 1.25rem',
              borderRadius: '9999px',
              background: '#0A0A0A',
              color: '#FFFFFF'
            }}
          >
            <span>Get Started</span>
          </Link>
        )}
      </div>
    </header>
  );
};
