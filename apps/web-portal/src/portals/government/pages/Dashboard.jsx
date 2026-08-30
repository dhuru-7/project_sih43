import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../services/apiClient';
import { AlertCircle, FolderGit2, DollarSign, Award, CheckCircle } from 'lucide-react';

export const GovernmentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient('/government/overview')
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '0.25rem' }}>
          🏛️ Ministry & Municipal Command Center
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Monitor live citizen grievance flow, AI classification matrix, and academic innovation challenges.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Grievances</span>
            <AlertCircle size={20} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{data?.stats?.total_grievances || 248}</div>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>↑ 12% this week</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Critical Issues</span>
            <AlertCircle size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444' }}>{data?.stats?.critical_issues || 14}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require immediate SLA</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Active R&D Projects</span>
            <FolderGit2 size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{data?.stats?.active_rd_projects || 18}</div>
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Across 8 Universities</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Sanctioned Grants</span>
            <DollarSign size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>₹{(data?.stats?.total_budget_sanctioned || 4500000).toLocaleString('en-IN')}</div>
          <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Co-funded with CSR</span>
        </div>
      </div>

      {/* Recent Problems Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>
          Recent High-Severity Grievances
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Title</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Severity</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recent_problems || [
                { id: 'prob-001', title: 'Severe sewage pipeline overflow near Main Market', category: 'WATER_SANITATION', severity: 'HIGH', status: 'CONVERTED_TO_CHALLENGE' },
                { id: 'prob-002', title: 'High voltage transformer sparks on 5th Avenue', category: 'ENERGY_ELECTRICITY', severity: 'CRITICAL', status: 'VERIFIED' }
              ]).map((prob) => (
                <tr key={prob.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{prob.id}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{prob.title}</td>
                  <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-gov">{prob.category}</span></td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ color: prob.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b', fontWeight: '700' }}>
                      {prob.severity}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{prob.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
