import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleIcon } from '../ui/GoogleIcon';

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const govLinks = [
    { to: '/oak/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/oak/problems', label: 'Problems & Grievances', icon: 'report_problem' },
    { to: '/oak/departments', label: 'Departments', icon: 'account_balance' },
    { to: '/oak/universities', label: 'Universities', icon: 'school' },
    { to: '/oak/challenges', label: 'Active Challenges', icon: 'flag' },
    { to: '/oak/projects', label: 'R&D Projects', icon: 'folder_open' },
    { to: '/oak/funding', label: 'Funding & Grants', icon: 'payments' },
    { to: '/oak/certificates', label: 'Certificates', icon: 'verified' },
    { to: '/oak/analytics', label: 'AI Analytics', icon: 'analytics' },
  ];

  const uniLinks = [
    { to: '/saplings/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/saplings/challenges', label: 'Open Challenges', icon: 'flag' },
    { to: '/saplings/teams', label: 'Research Teams', icon: 'groups' },
    { to: '/saplings/projects', label: 'Our Projects', icon: 'folder_open' },
    { to: '/saplings/milestones', label: 'Milestones', icon: 'timeline' },
    { to: '/saplings/mentors', label: 'Industry Mentors', icon: 'handshake' },
    { to: '/saplings/funding', label: 'Grant Requests', icon: 'payments' },
    { to: '/saplings/communication', label: 'Govt Communication', icon: 'forum' },
  ];

  const indLinks = [
    { to: '/grove/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/grove/challenges', label: 'Explore Challenges', icon: 'flag' },
    { to: '/grove/projects', label: 'Sponsored Projects', icon: 'folder_open' },
    { to: '/grove/collaborations', label: 'University Alliances', icon: 'handshake' },
    { to: '/grove/funding', label: 'CSR Grant Portal', icon: 'payments' },
    { to: '/grove/mentorship', label: 'Mentorship Program', icon: 'work' },
    { to: '/grove/profile', label: 'CSR Profile', icon: 'apartment' },
  ];

  const links = user.role === 'GOVERNMENT' ? govLinks :
                user.role === 'UNIVERSITY' ? uniLinks :
                user.role === 'INDUSTRY' ? indLinks : [];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      minHeight: 'calc(100vh - 64px)'
    }}>
      <div style={{ padding: '0 0.75rem 1rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
        {user.role} Navigation
      </div>
      {links.map((link) => {
        return (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: isActive ? '600' : '500',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
              transition: 'all 0.15s ease'
            })}
          >
            <GoogleIcon name={link.icon} size={20} />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
};
