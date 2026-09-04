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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href="/downloads/setu-citizen.apk"
            download="setu-citizen.apk"
            className="btn btn-primary"
            style={{
              padding: '0.875rem 2rem',
              fontSize: '1.05rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontWeight: '700',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}
          >
            <GoogleIcon name="download" size={20} /> Download Setu APK (v1.0.0)
          </a>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}>
            Access Portals
          </Link>
        </div>
        <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span>✓ Direct APK Download (~28 MB)</span>
          <span>✓ Android 8.0 to Android 16</span>
          <span>✓ Real-time NINA Voice AI</span>
          <span>✓ Auto-Updates Included</span>
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
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#10B981" /> 1-Tap Camera & Video Issue Capture</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#10B981" /> NINA Voice AI Assistant in Indian Languages</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GoogleIcon name="check_circle" size={18} color="#10B981" /> Apple-Fluid Motion & Live Status Tracking</li>
          </ul>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href="/downloads/setu-citizen.apk"
              download="setu-citizen.apk"
              className="btn btn-primary"
              style={{
                width: '100%',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: '700',
                textDecoration: 'none',
                padding: '0.875rem',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <GoogleIcon name="download" size={18} /> Download Android APK (v1.0.0)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
