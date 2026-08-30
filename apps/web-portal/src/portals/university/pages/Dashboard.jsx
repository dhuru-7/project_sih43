import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../services/apiClient';
import { Target, Users, FolderGit2, DollarSign, ArrowUpRight } from 'lucide-react';

export const UniversityDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiClient('/universities/overview')
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '0.25rem' }}>
          🎓 Academic Innovation & Research Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Explore ministry problem challenges, manage student research teams, and track milestone disbursements.
        </p>
      </div>

      {/* University Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Open Challenges</span>
            <Target size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{data?.stats?.active_challenges || 12}</div>
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Matched with your labs</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Submitted Proposals</span>
            <Users size={20} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{data?.stats?.submitted_proposals || 4}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 Under Review</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Ongoing Projects</span>
            <FolderGit2 size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{data?.stats?.ongoing_projects || 3}</div>
          <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Prototype stage</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Grants Received</span>
            <DollarSign size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>₹{(data?.stats?.total_grants_received || 250000).toLocaleString('en-IN')}</div>
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Tranche 1 & 2 Released</span>
        </div>
      </div>

      {/* Recommended Challenges */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>
          🤖 AI Recommended Challenges for Your Institution
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="badge badge-uni" style={{ marginBottom: '0.5rem' }}>96% AI Match (Civil & Environmental)</span>
              <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>Smart Acoustic Leak Detection for Water Lines</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Ministry of Jal Shakti • Grant: ₹5,00,000</p>
            </div>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Apply with Team <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
