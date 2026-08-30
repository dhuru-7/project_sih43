import React from 'react';
import { Target, Plus } from 'lucide-react';

export const GovernmentChallenges = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Active Academic R&D Challenges</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Publish problem statements for universities and research labs to solve.</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> Create New Challenge</button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '0.5rem', color: '#60a5fa' }}>
            <Target size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <span className="badge badge-gov" style={{ marginBottom: '0.5rem' }}>Ministry of Jal Shakti</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Acoustic Sensor IoT Pipeline for Urban Leakage Detection</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Budget: ₹5,00,000 • 3 University Proposals Submitted</p>
          </div>
          <button className="btn btn-outline">Manage Challenge</button>
        </div>
      </div>
    </div>
  );
};
