import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../services/apiClient';
import { Building2, DollarSign, Handshake, Award } from 'lucide-react';

export const IndustryDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiClient('/industry/overview')
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '0.25rem' }}>
          🏢 Corporate CSR & Innovation Alliance Center
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Co-sponsor national challenges, deploy CSR grants, provide engineering mentorship, and adopt student IP.
        </p>
      </div>

      {/* Industry Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Sponsored Challenges</span>
            <Building2 size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{data?.stats?.sponsored_challenges || 6}</div>
          <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Across 4 Ministries</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Committed CSR Funds</span>
            <DollarSign size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>₹{(data?.stats?.allocated_csr_funds || 1300000).toLocaleString('en-IN')}</div>
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Tax Exempted (Sec 135)</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Active Mentorships</span>
            <Handshake size={20} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{data?.stats?.active_mentorships || 14}</div>
          <span style={{ fontSize: '0.75rem', color: '#60a5fa' }}>Corporate Mentors</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>IP Ready for Adoption</span>
            <Award size={20} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{data?.stats?.ip_licensed || 2}</div>
          <span style={{ fontSize: '0.75rem', color: '#a78bfa' }}>Commercial Licensing</span>
        </div>
      </div>
    </div>
  );
};
