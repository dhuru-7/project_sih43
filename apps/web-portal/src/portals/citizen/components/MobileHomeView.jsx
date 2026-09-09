import React from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const MobileHomeView = ({
  issues,
  upvotedSet,
  handleUpvote,
  onOpenTara,
  onOpenReport,
  onOpenIssueDetail,
  activeNav,
  setActiveNav,
  userName = 'Rampal',
  hideNav = false
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        color: '#1a1c1c',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* 1. Top App Bar */}
      <header
        className="apple-frosted-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem'
        }}
      >
        <button
          onClick={() => setActiveNav('home')}
          className="apple-tap"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <span style={{ fontSize: '1.375rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#000000' }}>
            Setu.
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <button
            className="apple-tap"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid #e8e8e8',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Notifications"
          >
            <GoogleIcon name="notifications" size={20} />
          </button>
        </div>
      </header>

      {/* 2. Main Content Canvas */}
      <main className="apple-page-enter" style={{ flex: 1, padding: '1.25rem 1.25rem 6.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Greeting Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <div
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#5e5e5e',
              letterSpacing: '-0.01em'
            }}
          >
            Namaste,
          </div>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: '800',
              color: '#000000',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: 0
            }}
          >
            {userName || 'Rampal'}.
          </h1>
        </section>

        {/* Primary Action Card: Bento Style */}
        <section>
          <div
            style={{
              backgroundColor: '#111214',
              color: '#ffffff',
              padding: '1.5rem',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '2.75rem',
              overflow: 'hidden'
            }}
          >
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
                aria-label="Report Issue"
              >
                <GoogleIcon name="north_east" size={20} color="#ffffff" />
              </button>
            </div>

            {/* Single Prominent Action Button: Record Video */}
            <button
              onClick={onOpenReport || onOpenTara}
              className="apple-tap"
              style={{
                position: 'relative',
                zIndex: 1,
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
              <GoogleIcon name="videocam" size={20} color="#000000" />
              <span>Record Video</span>
            </button>
          </div>
        </section>

        {/* My Submissions Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#000000', letterSpacing: '-0.01em' }}>
              My Submissions
            </h2>
            <button
              className="apple-tap"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                color: '#5e5e5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label="View all submissions"
            >
              <GoogleIcon name="chevron_right" size={22} />
            </button>
          </div>

          {/* Issues List Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {issues.map((issue) => {
              const isUpvoted = upvotedSet.has(issue.id);

              // Status chip styles matching Stitch design
              const getBadgeStyle = () => {
                if (issue.status === 'pending') {
                  return { bg: '#fef3c7', text: '#92400e', label: 'Pending' };
                }
                if (issue.status === 'reviewed') {
                  return { bg: '#e0f2fe', text: '#0369a1', label: 'Reviewed' };
                }
                return { bg: '#dcfce7', text: '#15803d', label: 'Resolved' };
              };

              const badge = getBadgeStyle();

              return (
                <div
                  key={issue.id}
                  onClick={() => onOpenIssueDetail(issue)}
                  className="apple-tap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.875rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '0.875rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                    cursor: 'pointer',
                    gap: '0.875rem'
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '0.625rem',
                      overflow: 'hidden',
                      backgroundColor: '#eeeeee',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={issue.image}
                      alt={issue.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Title & Time */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: '#000000',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {issue.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#5e5e5e', marginTop: '0.15rem' }}>
                      Reported {issue.time}
                    </p>
                  </div>

                  {/* Status Chip */}
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: '700',
                      backgroundColor: badge.bg,
                      color: badge.text,
                      padding: '0.25rem 0.55rem',
                      borderRadius: '0.375rem',
                      flexShrink: 0
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 3. Bottom Navigation Bar (Fixed with Safe Area) */}
      {!hideNav && (
        <nav
          className="apple-frosted-nav"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              margin: '0 auto',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              position: 'relative',
              padding: '0 0.5rem'
            }}
          >
            {/* Home Button (Active) */}
            <button
              onClick={() => setActiveNav('home')}
              className="apple-tap"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeNav === 'home' ? '#000000' : '#5e5e5e',
                backgroundColor: activeNav === 'home' ? '#eeeeee' : 'transparent',
                borderRadius: '0.625rem',
                padding: '0.5rem',
                minWidth: '52px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <GoogleIcon name="home" size={22} fill={activeNav === 'home'} />
            </button>

            {/* Explore Button */}
            <button
              onClick={() => setActiveNav('explore')}
              className="apple-tap"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeNav === 'explore' ? '#000000' : '#5e5e5e',
                backgroundColor: activeNav === 'explore' ? '#eeeeee' : 'transparent',
                borderRadius: '0.625rem',
                padding: '0.5rem',
                minWidth: '52px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <GoogleIcon name="explore" size={22} fill={activeNav === 'explore'} />
            </button>

            {/* Center Elevated FAB (+) */}
            <button
              onClick={onOpenTara}
              className="apple-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000000',
                color: '#ffffff',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                marginTop: '-24px',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.28)',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label="Create report"
            >
              <GoogleIcon name="add" size={28} color="#ffffff" />
            </button>

            {/* Messages Button */}
            <button
              onClick={() => setActiveNav('messages')}
              className="apple-tap"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeNav === 'messages' ? '#000000' : '#5e5e5e',
                backgroundColor: activeNav === 'messages' ? '#eeeeee' : 'transparent',
                borderRadius: '0.625rem',
                padding: '0.5rem',
                minWidth: '52px',
                border: 'none',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <GoogleIcon name="chat" size={22} fill={activeNav === 'messages'} />
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '10px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#000000'
                }}
              />
            </button>

            {/* Profile Button */}
            <button
              onClick={() => setActiveNav('profile')}
              className="apple-tap"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeNav === 'profile' ? '#000000' : '#5e5e5e',
                backgroundColor: activeNav === 'profile' ? '#eeeeee' : 'transparent',
                borderRadius: '0.625rem',
                padding: '0.5rem',
                minWidth: '52px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <GoogleIcon name="person" size={22} fill={activeNav === 'profile'} />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};
