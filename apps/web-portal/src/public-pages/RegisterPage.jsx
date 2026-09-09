import React from 'react';
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
  return (
    <div className="card" style={{ width: '100%', maxWidth: '440px', textAlign: 'center', padding: '2.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Institutional Registration</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Government agencies, universities, and industry CSR entities are verified via institutional onboarding.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Link to="/onboarding" className="btn btn-primary" style={{ width: '100%' }}>
          Start Interactive Onboarding
        </Link>
        <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
};
