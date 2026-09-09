import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const DesktopHomeView = ({
  issues,
  onOpenTara,
  onOpenReport,
  onOpenIssueDetail,
  activeNav,
  setActiveNav,
  userName = 'Rahul'
}) => {
  const navigate = useNavigate();
  const firstName = (userName || 'Rahul').trim().split(/\s+/)[0];

  // Limit home screen submissions to latest 3
  const displayedIssues = issues.slice(0, 3);
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f9f9f9', color: '#1a1c1c' }}>
      {/* 1. Left Persistent Expanded Sidemenu */}
      <aside
        className="apple-frosted-sidebar"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '256px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 14px',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '44px',
              padding: '0 10px',
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                color: '#000000',
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
                lineHeight: 1
              }}
            >
              Setu.
            </span>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>
            {[
              { id: 'home', label: 'Home', icon: 'home', badge: null },
              { id: 'explore', label: 'Explore', icon: 'explore', badge: null },
              { id: 'report', label: 'Report Issue', icon: 'add_circle', badge: null, highlight: true },
              { id: 'messages', label: 'Messages', icon: 'chat', badge: '3' }
            ].map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.id === 'report') {
                      if (onOpenReport) onOpenReport();
                      else onOpenTara();
                    }
                  }}
                  className="apple-tap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '44px',
                    minHeight: '44px',
                    maxHeight: '44px',
                    boxSizing: 'border-box',
                    padding: '0 10px',
                    borderRadius: '0.75rem',
                    backgroundColor: isActive ? '#eeeeee' : 'transparent',
                    color: isActive ? '#000000' : '#4c4546',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <GoogleIcon
                      name={item.icon}
                      size={20}
                      fill={isActive}
                      color={isActive ? '#000000' : '#5e5e5e'}
                    />
                    {item.id === 'messages' && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-1px',
                          right: '-1px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#ff3b30',
                          border: '1.5px solid #ffffff',
                          boxSizing: 'border-box',
                          pointerEvents: 'none'
                        }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      marginLeft: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '9999px',
                        backgroundColor: '#ff3b30',
                        color: '#ffffff',
                        fontSize: '0.6875rem',
                        fontWeight: '700',
                        lineHeight: 1,
                        flexShrink: 0
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <div
            onClick={() => setActiveNav('profile')}
            className="apple-tap"
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '44px',
              minHeight: '44px',
              maxHeight: '44px',
              boxSizing: 'border-box',
              padding: '0 5px',
              borderRadius: '0.75rem',
              backgroundColor: activeNav === 'profile' ? '#eeeeee' : 'transparent',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'background-color 0.15s ease'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#000000',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <GoogleIcon name="person" size={18} color="#ffffff" />
            </div>
            <div
              style={{
                marginLeft: '10px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1a1c1c', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {userName || 'Rahul Verma'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#5e5e5e', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                Ward 4
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Canvas */}
      <div style={{ flex: 1, marginLeft: '256px', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: 'calc(100% - 256px)' }}>
        {/* Main Content Body */}
        <main className="apple-page-enter" style={{ padding: '2.5rem 3.5rem 4rem 3.5rem', width: '100%', maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
          {/* Greeting Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#5e5e5e',
                letterSpacing: '-0.01em'
              }}
            >
              Namaste,
            </div>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#1a1c1c',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: 0
              }}
            >
              {firstName}.
            </h1>
          </section>

          {/* Primary Action Card: Hero Bento (styled exactly as in screenshot) */}
          <section>
            <div
              style={{
                position: 'relative',
                backgroundColor: '#111214',
                color: '#ffffff',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2.75rem',
                maxWidth: '380px',
                width: '100%'
              }}
            >
              {/* Card Header */}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
                    Report Issue
                  </h2>
                  <p style={{ fontSize: '0.9375rem', color: '#8e8e93', marginTop: '0.35rem', margin: '0.35rem 0 0 0', fontWeight: '500' }}>
                    Make your city better.
                  </p>
                </div>

                <button
                  onClick={onOpenReport || onOpenTara}
                  className="apple-tap"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  aria-label="Open issue reporter"
                >
                  <GoogleIcon name="north_east" size={20} color="#ffffff" />
                </button>
              </div>

              {/* Single White Action Button: Upload Media */}
              <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                <button
                  onClick={onOpenReport || onOpenTara}
                  className="apple-tap"
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '0.875rem',
                    fontWeight: '700',
                    fontSize: '0.9375rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <GoogleIcon name="attach_file" size={20} color="#000000" />
                  <span>Upload Media</span>
                </button>
              </div>
            </div>
          </section>

          {/* My Submissions Feed Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.125rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a1c1c', letterSpacing: '-0.015em', margin: 0, lineHeight: 1.2 }}>
                My Submissions
              </h2>

              <a
                onClick={(e) => { e.preventDefault(); navigate('/my-submissions'); }}
                href="/my-submissions"
                className="apple-tap"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1a1c1c',
                  textDecoration: 'none',
                  lineHeight: 1,
                  cursor: 'pointer'
                }}
              >
                <span>View all</span>
                <GoogleIcon name="chevron_right" size={18} />
              </a>
            </div>

            {/* Issues Cards List without upvotes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {displayedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="apple-stitch-card apple-tap"
                  onClick={() => navigate(`/my-submissions?highlight=${encodeURIComponent(issue.id)}`)}
                  style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {/* Thumbnail & Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.125rem', flex: 1, minWidth: 0 }}>
                    <img
                      src={issue.image}
                      alt={issue.title}
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '0.75rem',
                        objectFit: 'cover',
                        backgroundColor: '#eeeeee',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem', minWidth: 0, flex: 1 }}>
                      <h3
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: '700',
                          color: '#1a1c1c',
                          lineHeight: 1.35,
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {issue.title}
                      </h3>

                      {/* Location & Time */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', color: '#5e5e5e', fontSize: '0.8125rem', lineHeight: 1 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <GoogleIcon name="location_on" size={15} color="#7e7576" />
                          <span>{issue.location}</span>
                        </span>
                        <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#cfc4c5', flexShrink: 0 }}></span>
                        <span style={{ color: '#7e7576' }}>
                          {issue.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Minimal forward chevron */}
                  <GoogleIcon name="chevron_right" size={20} color="#c7c7cc" />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
