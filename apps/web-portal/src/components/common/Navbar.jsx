import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleIcon } from '../ui/GoogleIcon';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
    <header style={{
      height: '64px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SIH26043 Ecosystem
        </Link>
        {user && getRoleBadge(user.role)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <GoogleIcon name="account_circle" size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <GoogleIcon name="logout" size={16} /> Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/setu" className="btn btn-outline" style={{ border: '1px solid rgba(59, 130, 246, 0.4)', color: '#60a5fa' }}>
              📱 Open Setu Citizen App
            </Link>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        )}
      </div>
    </header>
  );
};
