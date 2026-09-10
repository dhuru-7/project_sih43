import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleIcon } from '../ui/GoogleIcon';

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
      case 'GOVERNMENT': return '/government/dashboard';
      case 'UNIVERSITY': return '/university/dashboard';
      case 'INDUSTRY': return '/industry/dashboard';
      default: return '/citizen';
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

  return (
    <header className="glass-nav" style={{
      height: '76px',
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
      zIndex: 60,
      transition: 'all 0.3s ease'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'baseline', textDecoration: 'none', gap: '2px' }} className="group">
          <span style={{
            fontSize: '1.875rem',
            fontWeight: '800',
            letterSpacing: '-0.04em',
            color: '#0A0A0A',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            Setu
          </span>
          <span style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#0A0A0A',
            marginLeft: '2px',
            marginBottom: '1px'
          }} />
        </Link>
        {user && getRoleBadge(user.role)}
      </div>

      {/* Center Landing Navigation Links */}
      {isLandingPage && (
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#525252'
        }} className="d-none d-lg-flex">
          <a href="#philosophy" style={{ color: '#525252', textDecoration: 'none', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'} onMouseLeave={e => e.currentTarget.style.color = '#525252'}>
            Philosophy
          </a>
          <a href="#pillars" style={{ color: '#525252', textDecoration: 'none', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'} onMouseLeave={e => e.currentTarget.style.color = '#525252'}>
            Stakeholders
          </a>
          <a href="#pipeline" style={{ color: '#525252', textDecoration: 'none', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'} onMouseLeave={e => e.currentTarget.style.color = '#525252'}>
            How It Works
          </a>
          <a href="#specs" style={{ color: '#525252', textDecoration: 'none', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'} onMouseLeave={e => e.currentTarget.style.color = '#525252'}>
            Built for Bharat
          </a>
        </nav>
      )}

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
            to="/citizen"
            className="setu-btn-primary"
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.75rem',
              background: '#0A0A0A',
              color: '#FFFFFF'
            }}
          >
            <span>Get Started</span>
            <GoogleIcon name="arrow_forward" size={14} color="#FFFFFF" />
          </Link>
        )}
      </div>
    </header>
  );
};
