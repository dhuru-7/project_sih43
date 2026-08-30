import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../services/apiClient';

export const GovernmentProblems = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    apiClient('/problems')
      .then((res) => setProblems(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Grievance Management & AI Verification</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review citizen submissions, AI duplicate detection, and severity clustering.</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {problems.map((p) => (
            <div key={p.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-gov">{p.category}</span>
                  <span style={{ fontSize: '0.75rem', color: p.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b', fontWeight: '700' }}>
                    ● {p.severity} SEVERITY (Score: {p.score})
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{p.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{p.description}</p>
              </div>
              <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Convert to Challenge</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
