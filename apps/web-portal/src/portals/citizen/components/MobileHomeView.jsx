import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useLanguage } from '../../../context/LanguageContext';

export const MobileHomeView = ({
  issues,
  upvotedSet,
  handleUpvote,
  onOpenTara,
  onOpenReport,
  onOpenIssueDetail,
  onOpenNotifications,
  unreadCount = 0,
  activeNav,
  setActiveNav,
  userName = 'Rahul',
  hideNav = false
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const firstName = (userName || 'Rahul').trim().split(/\s+/)[0];

  // Limit home screen submissions to latest 3
  const displayedIssues = issues.slice(0, 3);
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
            onClick={onOpenNotifications}
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
              cursor: 'pointer',
              position: 'relative'
            }}
            aria-label="Notifications"
          >
            <GoogleIcon name="notifications" size={20} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '1px',
                  right: '1px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#ff3b30',
                  border: '2px solid #ffffff'
                }}
              />
            )}
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
            {t('greeting', 'Namaste')},
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
            {firstName}.
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
                  {t('report_issue', 'Report Issue')}
                </h2>
                <p style={{ fontSize: '0.9375rem', color: '#8e8e93', marginTop: '0.35rem', margin: '0.35rem 0 0 0', fontWeight: '500' }}>
                  {t('make_city_better', 'Make your city better.')}
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
              <span>{t('record_video', 'Record Video')}</span>
            </button>
          </div>
        </section>

        {/* My Submissions Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#000000', letterSpacing: '-0.01em' }}>
              {t('my_submissions', 'My Submissions')}
            </h2>
            <button
              className="apple-tap"
              onClick={() => navigate('/my-submissions')}
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
            {displayedIssues.map((issue) => {
              const displayTitle =
                issue.title === 'Unverified Media Evidence Submitted'
                  ? t('unverified_media_title', 'Unverified Media Evidence Submitted')
                  : issue.title === 'Visual civic problem reported by citizen.' || issue.title === 'Visual civic problem reported by citizen'
                  ? t('visual_problem_reported_title', 'Visual civic problem reported by citizen.')
                  : issue.title;

              return (
                <div
                  key={issue.id}
                  onClick={() => navigate(`/my-submissions?highlight=${encodeURIComponent(issue.id)}`)}
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
                      {displayTitle}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#5e5e5e', marginTop: '0.15rem' }}>
                      {t('reported', 'Reported')} {issue.time === 'Recently' ? t('recently', 'Recently') : issue.time}
                    </p>
                  </div>

                  {/* Minimal forward arrow */}
                  <GoogleIcon name="chevron_right" size={18} color="#c7c7cc" />
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
