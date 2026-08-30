import React from 'react';
import { Link } from 'react-router-dom';
import { GoogleIcon } from '../components/ui/GoogleIcon';

export const LandingPage = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div className="badge badge-gov" style={{ marginBottom: '1.5rem' }}>
          🇮🇳 Smart India Hackathon 2026 Innovation Platform
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          From Citizen Grievance to <br />
          <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Academic Innovation & Industry Scale
          </span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
          An AI-orchestrated multi-stakeholder ecosystem connecting citizen problem reports with academic research teams, government funding, and corporate CSR sponsorship.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/setu" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem', background: 'linear-gradient(135deg, #121417, #262930)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            📱 Launch Setu Citizen App <GoogleIcon name="arrow_forward" size={18} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
            Access Institutional Portals
          </Link>
        </div>
      </div>

      {/* Portals Grid */}
      <div id="portals" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
        {/* Government Card */}
        <div className="card" style={{ borderTop: '4px solid var(--gov-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.75rem', borderRadius: '0.5rem', color: '#60a5fa', display: 'flex' }}>
              <GoogleIcon name="verified_user" size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Government Portal</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ministries & Municipal Bodies</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '60px' }}>
            Review AI-verified citizen grievances, convert severe issues into funded academic innovation challenges, and track live project milestones.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#3b82f6" /> AI-powered duplicate filtering</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#3b82f6" /> Challenge budgeting & grant sanctions</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#3b82f6" /> Certificate issuance upon deployment</li>
          </ul>
          <Link to="/login" className="btn btn-outline" style={{ width: '100%' }}>Login as Government</Link>
        </div>

        {/* University Card */}
        <div className="card" style={{ borderTop: '4px solid var(--uni-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '0.5rem', color: '#34d399', display: 'flex' }}>
              <GoogleIcon name="school" size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>University Portal</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Faculty, Students & Labs</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '60px' }}>
            Adopt government challenges matching your department's R&D focus, form student-faculty teams, and receive verified government grants.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#10b981" /> AI Department-to-Challenge matching</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#10b981" /> Milestone-based grant disbursements</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#10b981" /> Direct industry mentor guidance</li>
          </ul>
          <Link to="/login" className="btn btn-outline" style={{ width: '100%' }}>Login as University</Link>
        </div>

        {/* Industry Card */}
        <div className="card" style={{ borderTop: '4px solid var(--ind-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.75rem', borderRadius: '0.5rem', color: '#fbbf24', display: 'flex' }}>
              <GoogleIcon name="apartment" size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Industry Portal</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Corporates & CSR Leaders</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '60px' }}>
            Co-sponsor national priority challenges using CSR funds, assign technical mentors, and license validated academic IP for commercial rollout.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#f59e0b" /> CSR grant allocation tracking</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#f59e0b" /> Intellectual Property licensing pipeline</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#f59e0b" /> Joint pilot deployment monitoring</li>
          </ul>
          <Link to="/login" className="btn btn-outline" style={{ width: '100%' }}>Login as Industry</Link>
        </div>

        {/* Setu Citizen Mobile App Card */}
        <div className="card" style={{ borderTop: '4px solid #121417', background: 'linear-gradient(180deg, rgba(18, 20, 23, 0.95), rgba(11, 15, 25, 0.95))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', color: '#FFFFFF', display: 'flex' }}>
              <GoogleIcon name="smartphone" size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF' }}>Setu. Citizen App</h3>
              <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Public & Civic Reporting</span>
            </div>
          </div>
          <p style={{ color: '#D1D5DB', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '60px' }}>
            Report civic problems with photo evidence, automatic GPS geo-tagging, voice notes, and live resolution tracking.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#9CA3AF' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#FFFFFF" /> 1-Tap Camera & Photo Capture</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#FFFFFF" /> Real-time status & milestone tracking</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#FFFFFF" /> Apple fluid interface & design system</li>
          </ul>
          <Link to="/setu" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#FFFFFF', color: '#0F1115' }}>
            Open Setu Citizen App <GoogleIcon name="arrow_forward" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
