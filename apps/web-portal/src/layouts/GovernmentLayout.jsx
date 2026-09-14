import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../portals/government/styles/governmentDashboard.css';

export const GovernmentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const isDashboardActive =
    location.pathname === '/government' ||
    location.pathname === '/government/dashboard' ||
    location.pathname === '/civic-dashboard' ||
    location.pathname === '/admin' ||
    location.pathname === '/admin/dashboard';

  const isInboxActive =
    location.pathname.includes('inbox') ||
    location.pathname.includes('problems');

  const isMapActive =
    location.pathname === '/government/map' ||
    location.pathname === '/government/map-view' ||
    location.pathname === '/map';

  const isAssignedActive =
    location.pathname === '/government/assigned' ||
    location.pathname === '/assigned';

  return (
    <div className="gov-portal-wrapper" data-purpose="government-portal-root">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="gov-toast">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==============================================================================
          PERSISTENT LEFT SIDEBAR (100% Stable DOM - Zero Jitter on Route Transitions)
          Matching citizen/home desktop sizing (256px width, 44px tap targets, 0 scroll)
          ============================================================================== */}
      <aside className="gov-sidebar" data-purpose="sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          {/* Brand Logo (Matching citizen/home Desktop) */}
          <div className="gov-logo-container">
            <span className="gov-logo-text">
              Setu<span style={{ color: '#000000' }}>.</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="gov-sidebar-nav">
            {/* Dashboard */}
            <button
              type="button"
              onClick={() => navigate('/government/dashboard')}
              className={`gov-nav-btn ${isDashboardActive ? 'active' : ''}`}
            >
              <div className="gov-nav-icon-box">
                <span className="material-symbols-outlined">grid_view</span>
              </div>
              <span className="gov-nav-label">Dashboard</span>
              {isDashboardActive && <span className="gov-nav-active-dot"></span>}
            </button>

            {/* Issue Inbox */}
            <button
              type="button"
              onClick={() => navigate('/government/inbox')}
              className={`gov-nav-btn ${isInboxActive ? 'active' : ''}`}
            >
              <div className="gov-nav-icon-box">
                <span className="material-symbols-outlined">inbox</span>
              </div>
              <span className="gov-nav-label">Issue Inbox</span>
              <span
                className="gov-nav-badge"
                style={
                  isInboxActive
                    ? { backgroundColor: '#111827', color: '#ffffff', fontWeight: 700 }
                    : {}
                }
              >
                1.4k
              </span>
            </button>

            {/* Map View */}
            <button
              type="button"
              onClick={() => navigate('/government/map')}
              className={`gov-nav-btn ${isMapActive ? 'active' : ''}`}
            >
              <div className="gov-nav-icon-box">
                <span className="material-symbols-outlined">map</span>
              </div>
              <span className="gov-nav-label">Map View</span>
              {isMapActive && <span className="gov-nav-active-dot"></span>}
            </button>

            {/* Assigned */}
            <button
              type="button"
              onClick={() => navigate('/government/assigned')}
              className={`gov-nav-btn ${isAssignedActive ? 'active' : ''}`}
            >
              <div className="gov-nav-icon-box">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <span className="gov-nav-label">Assigned</span>
              <span
                className="gov-nav-badge"
                style={
                  isAssignedActive
                    ? { backgroundColor: '#111827', color: '#ffffff', fontWeight: 700 }
                    : {}
                }
              >
                370
              </span>
              {isAssignedActive && <span className="gov-nav-active-dot"></span>}
            </button>

            {/* Create Post */}
            <button
              type="button"
              onClick={() => triggerToast('Opening Public Citizen Awareness Campaign Builder')}
              className="gov-nav-btn"
            >
              <div className="gov-nav-icon-box">
                <span className="material-symbols-outlined">add</span>
              </div>
              <span className="gov-nav-label">Create Post</span>
            </button>

            {/* Leaderboard */}
            <button
              type="button"
              onClick={() => triggerToast('Viewing District SLA & Grievance Resolution Rankings')}
              className="gov-nav-btn"
            >
              <div className="gov-nav-icon-box">
                <span className="material-symbols-outlined">leaderboard</span>
              </div>
              <span className="gov-nav-label">Leaderboard</span>
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => triggerToast('Opened Government Portal Settings')}
              className="gov-nav-btn"
            >
              <div className="gov-nav-icon-box">
                <span className="material-symbols-outlined">settings</span>
              </div>
              <span className="gov-nav-label">Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Profile Bar (Identical Sizing & Style to citizen/home - NO Signout Button) */}
        <div className="gov-sidebar-footer" data-purpose="sidebar-footer">
          <div
            className="gov-user-card"
            onClick={() => triggerToast('Logged in as Dr. Arvind Kumar, IAS (Principal Secy)')}
          >
            <div className="gov-user-avatar">
              AK
            </div>
            <div className="gov-user-details">
              <span className="gov-user-name">Dr. Arvind Kumar, IAS</span>
              <span className="gov-user-role">Principal Secy · Ward HQ</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Persistent Canvas with Dynamic Page Content */}
      <div className="gov-main-canvas" data-purpose="dashboard-core">
        <Outlet context={{ triggerToast }} />
      </div>
    </div>
  );
};
