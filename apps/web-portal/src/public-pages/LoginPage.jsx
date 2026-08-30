import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { GoogleIcon } from '../components/ui/GoogleIcon';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login(email, password);
      login(res.user, res.token, res.portalUrl);
      navigate(res.portalUrl);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Unified Portal Sign In</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Enter your institutional credentials to be directed to your portal.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Official / Institutional Email
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <GoogleIcon name="mail" size={18} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. officer@jalshakti.gov.in"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <GoogleIcon name="lock" size={18} />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
          {loading ? 'Authenticating...' : 'Sign In to Portal'} <GoogleIcon name="arrow_forward" size={18} />
        </button>
      </form>

      {/* Quick Demo Buttons for SIH Judges */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>
          ⚡ 1-Click Demo Accounts for Judges
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => handleQuickDemo('officer@jalshakti.gov.in', 'password123')}
            className="btn btn-outline"
            style={{ justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
          >
            <GoogleIcon name="verified_user" size={18} color="#3b82f6" /> 🏛️ Government Official (Ministry)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('dean@iitd.ac.in', 'password123')}
            className="btn btn-outline"
            style={{ justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
          >
            <GoogleIcon name="school" size={18} color="#10b981" /> 🎓 University Researcher (IIT Delhi)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('csr@tatacleantech.com', 'password123')}
            className="btn btn-outline"
            style={{ justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
          >
            <GoogleIcon name="apartment" size={18} color="#f59e0b" /> 🏢 Industry Partner (Tata CleanTech)
          </button>
        </div>
      </div>
    </div>
  );
};
