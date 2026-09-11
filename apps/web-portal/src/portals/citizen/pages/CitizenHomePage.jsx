import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DesktopHomeView } from '../components/DesktopHomeView';
import { MobileHomeView } from '../components/MobileHomeView';
import { DesktopExploreView } from '../components/DesktopExploreView';
import { MobileExploreView } from '../components/MobileExploreView';
import { DesktopMessagesView } from '../components/DesktopMessagesView';
import { MobileMessagesView } from '../components/MobileMessagesView';
import { DesktopProfileView } from '../components/DesktopProfileView';
import { MobileProfileView } from '../components/MobileProfileView';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { TaraCopilotModal } from '../components/TaraCopilotModal';
import { IssueDetailModal } from '../components/IssueDetailModal';
import { MobileReportingModal } from '../components/MobileReportingModal';
import { DesktopReportingModal } from '../components/DesktopReportingModal';
import { AadhaarWelcomeModal } from '../components/AadhaarWelcomeModal';
import { NotificationSidebar } from '../components/NotificationSidebar';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useAuth } from '../../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-welcome',
    type: 'Status Update',
    time: '10m ago',
    message: 'Nodal Cell reviewing recently submitted civic grievances in your area.',
    isNew: false
  }
];

export const CitizenHomePage = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const [issues, setIssues] = useState([]);
  const [upvotedSet, setUpvotedSet] = useState(new Set());

  // Notifications State & Persistence
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('setu_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
  const [submitToast, setSubmitToast] = useState(null);
  const [unreadCount, setUnreadCount] = useState(() => {
    try {
      const saved = localStorage.getItem('setu_notifications');
      const list = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
      return list.filter((n) => n.isNew).length;
    } catch {
      return 0;
    }
  });

  // Load real submissions from persistent database
  useEffect(() => {
    const fetchLiveIssues = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/problems`);
        if (resp.ok) {
          const json = await resp.json();
          const formatted = (json.data || []).map((p) => ({
            id: p.id,
            title: p.title,
            status: p.status || 'pending',
            statusBadge: p.status === 'RESOLVED' ? 'Resolved' : p.status === 'VERIFIED' ? 'Reviewed' : 'Pending',
            time: 'Recently',
            location: p.address || p.villageCity || p.district || 'Ranchi District',
            author: p.author || 'Citizen',
            assignee: p.department || 'Nodal Technical Evaluation Desk',
            upvotes: p.upvotes || 1,
            safetyStatus: p.safetyStatus || 'SAFE',
            image: p.thumbnail || (p.evidenceUrls && p.evidenceUrls[0]) || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80',
            description: p.description
          }));
          setIssues(formatted);
        }
      } catch (e) {
        console.warn('Could not fetch problems from database:', e);
      }
    };
    fetchLiveIssues();

    // Listen for realtime notifications and deleted problems (e.g. 10s policy violation cleanup)
    const handleNewNotif = (e) => {
      const newNotif = e.detail;
      if (newNotif) {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    };
    const handleProblemDeleted = (e) => {
      const delId = e.detail?.id;
      if (delId) {
        setIssues((prev) => prev.filter((p) => p.id !== delId));
      }
    };

    window.addEventListener('setu-new-notification', handleNewNotif);
    window.addEventListener('setu-problem-deleted', handleProblemDeleted);
    return () => {
      window.removeEventListener('setu-new-notification', handleNewNotif);
      window.removeEventListener('setu-problem-deleted', handleProblemDeleted);
    };
  }, []);

  const handleOpenNotifications = () => {
    setIsNotificationSidebarOpen(true);
    setUnreadCount(0);
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isNew: false }));
      try { localStorage.setItem('setu_notifications', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const handleClearNotification = (id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      try { localStorage.setItem('setu_notifications', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    try { localStorage.setItem('setu_notifications', JSON.stringify([])); } catch (e) {}
  };
  const location = useLocation();
  const navigate = useNavigate();

  const getNavFromPath = (pathname, search) => {
    const params = new URLSearchParams(search);
    if (pathname.includes('profile') || params.get('tab') === 'profile') return 'profile';
    if (pathname.includes('messages') || params.get('tab') === 'messages') return 'messages';
    if (pathname.includes('explore') || params.get('tab') === 'explore') return 'explore';
    if (pathname.includes('home')) return 'home';
    const saved = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('setu_citizen_active_tab')) ||
                  (typeof localStorage !== 'undefined' && localStorage.getItem('setu_citizen_active_tab'));
    if (saved && ['home', 'explore', 'messages', 'profile'].includes(saved)) {
      return saved;
    }
    return 'home';
  };

  const [activeNav, setActiveNavState] = useState(() => getNavFromPath(location.pathname, location.search));

  useEffect(() => {
    const resolved = getNavFromPath(location.pathname, location.search);
    setActiveNavState(resolved);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('setu_citizen_active_tab', resolved);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('setu_citizen_active_tab', resolved);
    }
    if (resolved === 'profile') {
      setIsReportingOpen(false);
    }
  }, [location.pathname, location.search]);

  const setActiveNav = (newNav) => {
    setActiveNavState(newNav);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('setu_citizen_active_tab', newNav);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('setu_citizen_active_tab', newNav);
    }
    const targetPath = newNav === 'home' ? '/citizen/home' : `/citizen/${newNav}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  };

  // Always reset scroll to top when changing views/tabs in the citizen portal
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [activeNav]);

  // Strict route safeguard: unverified visitors cannot access citizen portal
  useEffect(() => {
    const isOnboarded = localStorage.getItem('setu_onboarded') === 'true';
    const hasUserData = Boolean(
      localStorage.getItem('setu_user') || localStorage.getItem('sih_user_data')
    );
    if (!isOnboarded || !hasUserData) {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate]);

  // Modals
  const [isTaraOpen, setIsTaraOpen] = useState(false);
  const [isReportingOpen, setIsReportingOpen] = useState(false);
  const [detailIssue, setDetailIssue] = useState(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  useEffect(() => {
    const shouldShow = localStorage.getItem('setu_show_pfp_prompt') === 'true';
    if (shouldShow) {
      setIsWelcomeModalOpen(true);
    }
  }, []);

  const handleSetPfpAction = () => {
    localStorage.removeItem('setu_show_pfp_prompt');
    setIsWelcomeModalOpen(false);
    sessionStorage.setItem('setu_auto_open_pfp_picker', 'true');
    setActiveNav('profile');
  };

  const handleCloseWelcomeModal = () => {
    localStorage.removeItem('setu_show_pfp_prompt');
    setIsWelcomeModalOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const wantsProfile = location.pathname.includes('profile') || params.get('tab') === 'profile';
    if (!wantsProfile && (location.pathname === '/report' || location.pathname === '/citizen/report')) {
      setIsReportingOpen(true);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (activeNav !== 'messages') {
      setIsMobileChatOpen(false);
    }
  }, [activeNav]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine current active mode automatically: screens < 1024px show mobile, >= 1024px show desktop
  const isViewportMobile = windowWidth < 1024;

  const handleUpvote = (id) => {
    setUpvotedSet((prev) => {
      const next = new Set(prev);
      const isCurrentlyUpvoted = next.has(id);
      if (isCurrentlyUpvoted) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    setIssues((prevIssues) =>
      prevIssues.map((item) => {
        if (item.id === id) {
          const isUpvoted = upvotedSet.has(id);
          return {
            ...item,
            upvotes: isUpvoted ? item.upvotes - 1 : item.upvotes + 1
          };
        }
        return item;
      })
    );

    // Call backend upvote endpoint
    fetch(`${API_BASE_URL}/problems/${id}/upvote`, { method: 'POST' }).catch((e) => {
      console.warn('Backend upvote error:', e);
    });
  };

  const handleDraftFromTara = (draftText) => {
    if (!draftText.trim()) return;
    const newIssue = {
      id: `#SETU-${Math.floor(1000 + Math.random() * 9000)}`,
      title: draftText.length > 50 ? draftText.substring(0, 50) + '...' : draftText,
      status: 'pending',
      statusBadge: 'Pending',
      time: 'Just now',
      location: 'Bero Block, Ranchi District',
      author: 'Citizen (You)',
      assignee: 'Nodal Technical Evaluation Desk',
      upvotes: 1,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDnrUDL7d0ON9wyKgWfj_1EJZtxdUvYoiVmPLOIUYIvRzrCkyDMn5Q1OdqCE7EX0XNQlIT1bd0KLoV3R9PTTMVT2gty9KKDQZ6dOyOM0Ag5WUU3EEfiEfXhAU9k4pp5vK6Dc-lX6YgOWVwO2Xod-L4kzPsMtWq5bH4fZBZd49Xy0p8mcO3F81qxQlzHrtvP8o54ZU9DSiZnNNYho7an6m-RzHyuV8fkSAEQpzUk7WVpX049aMYLTu-thQ',
      description: draftText
    };
    setIssues((prev) => [newIssue, ...prev]);
    setUpvotedSet((prev) => new Set(prev).add(newIssue.id));
  };

  const handleReportSubmitted = (newProblem) => {
    if (!newProblem) return;
    const formatted = {
      id: newProblem.id || `#SETU-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newProblem.title,
      status: 'pending',
      statusBadge: 'Pending',
      time: 'Just now',
      location: newProblem.address || 'Bero Block, Ranchi District',
      author: userName || 'Citizen (You)',
      assignee: 'Nodal Technical Evaluation Desk',
      upvotes: 1,
      image: (newProblem.evidenceUrls && newProblem.evidenceUrls[0]) || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80',
      description: newProblem.description
    };
    setIssues((prev) => [formatted, ...prev]);
    setUpvotedSet((prev) => new Set(prev).add(formatted.id));
    setSubmitToast(`Report #${formatted.id.replace('#', '')} submitted successfully.`);
    setTimeout(() => setSubmitToast(null), 3500);
  };

  // Single-session concurrency validation heartbeat
  useEffect(() => {
    const isLocalhost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
    if (!isLocalhost && !import.meta.env.VITE_API_BASE_URL) return;

    const checkSession = async () => {
      const sessionId = localStorage.getItem('setu_session_id');
      const userStr = localStorage.getItem('setu_user');
      if (!sessionId || !userStr) return;

      try {
        const u = JSON.parse(userStr);
        const rawAadhaar = u.aadhaar ? u.aadhaar.replace(/\D/g, '') : null;
        if (!rawAadhaar) return;

        const res = await fetch('http://localhost:5000/api/v1/auth/aadhaar/validate-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aadhaarNumber: rawAadhaar, sessionId })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.valid === false) {
            alert(
              '⚠️ Session Terminated: This Aadhaar account was signed into from another device or window. Setu enforces strict single-session concurrency.'
            );
            localStorage.removeItem('setu_user');
            localStorage.removeItem('setu_session_id');
            localStorage.removeItem('setu_token');
            localStorage.removeItem('sih_auth_token');
            localStorage.removeItem('sih_user_data');
            window.location.href = '/onboarding';
          }
        }
      } catch (e) {
        // Silent catch for network hiccups
      }
    };

    const interval = setInterval(checkSession, 8000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const { user } = useAuth();
  const storedSetuUser = React.useMemo(() => {
    try {
      const u = localStorage.getItem('setu_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  }, []);
  const userName = storedSetuUser?.name || user?.name || user?.full_name || user?.username || 'Rahul Verma';

  return (
    <div className="setu-portal" style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* RENDER VIEW: Automatic Responsive Switch based on Viewport and activeNav */}
      {isViewportMobile ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            paddingBottom: activeNav === 'messages' && isMobileChatOpen ? '0' : '96px'
          }}
        >
          {activeNav === 'messages' ? (
            <MobileMessagesView
              key="mobile-messages"
              onOpenTara={() => setIsTaraOpen(true)}
              onOpenReport={() => setIsReportingOpen(true)}
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              userName={userName}
              hideNav={true}
              onChatOpenChange={setIsMobileChatOpen}
            />
          ) : activeNav === 'explore' ? (
            <MobileExploreView
              key="mobile-explore"
              onOpenTara={() => setIsTaraOpen(true)}
              onOpenReport={() => setIsReportingOpen(true)}
              onOpenIssueDetail={(issue) => setDetailIssue(issue)}
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              userName={userName}
              hideNav={true}
            />
          ) : activeNav === 'profile' ? (
            <MobileProfileView
              key="mobile-profile"
              userName={userName}
              setActiveNav={setActiveNav}
              onOpenTara={() => setIsTaraOpen(true)}
              onOpenReport={() => setIsReportingOpen(true)}
              onOpenReportDetail={(report) => setDetailIssue(report)}
            />
          ) : (
            <MobileHomeView
              key="mobile-home"
              issues={issues}
              upvotedSet={upvotedSet}
              handleUpvote={handleUpvote}
              onOpenTara={() => setIsTaraOpen(true)}
              onOpenReport={() => setIsReportingOpen(true)}
              onOpenIssueDetail={(issue) => setDetailIssue(issue)}
              onOpenNotifications={handleOpenNotifications}
              unreadCount={unreadCount}
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              userName={userName}
              hideNav={true}
            />
          )}

          {/* Persistent Rock-Solid Bottom Nav (Hidden when chat is opened on mobile) */}
          {!(activeNav === 'messages' && isMobileChatOpen) && (
            <MobileBottomNav
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              onOpenTara={() => setIsTaraOpen(true)}
              onOpenReport={() => setIsReportingOpen(true)}
            />
          )}
        </div>
      ) : activeNav === 'messages' ? (
        <DesktopMessagesView
          key="desktop-messages"
          onOpenTara={() => setIsTaraOpen(true)}
          onOpenReport={() => setIsReportingOpen(true)}
          onOpenNotifications={handleOpenNotifications}
          unreadCount={unreadCount}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          userName={userName}
        />
      ) : activeNav === 'explore' ? (
        <DesktopExploreView
          key="desktop-explore"
          onOpenTara={() => setIsTaraOpen(true)}
          onOpenReport={() => setIsReportingOpen(true)}
          onOpenIssueDetail={(issue) => setDetailIssue(issue)}
          onOpenNotifications={handleOpenNotifications}
          unreadCount={unreadCount}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          userName={userName}
        />
      ) : activeNav === 'profile' ? (
        <DesktopProfileView
          key="desktop-profile"
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          userName={userName}
          onOpenTara={() => setIsTaraOpen(true)}
          onOpenReport={() => setIsReportingOpen(true)}
          onOpenReportDetail={(report) => setDetailIssue(report)}
          onOpenNotifications={handleOpenNotifications}
          unreadCount={unreadCount}
        />
      ) : (
        <DesktopHomeView
          key="desktop-home"
          issues={issues}
          onOpenTara={() => setIsTaraOpen(true)}
          onOpenReport={() => setIsReportingOpen(true)}
          onOpenIssueDetail={(issue) => setDetailIssue(issue)}
          onOpenNotifications={handleOpenNotifications}
          unreadCount={unreadCount}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          userName={userName}
        />
      )}

      {/* 📱 Mobile Reporting Modal (In-App Camera, Gallery, Swipe Preview, Saaras + Gemini Description) */}
      <MobileReportingModal
        isOpen={isReportingOpen && isViewportMobile}
        onClose={() => setIsReportingOpen(false)}
        onReportSubmitted={handleReportSubmitted}
        userName={userName}
      />

      {/* 💻 Desktop Reporting Modal (Multi-File Select, + Add More, Saaras + Gemini Description) */}
      <DesktopReportingModal
        isOpen={isReportingOpen && !isViewportMobile}
        onClose={() => setIsReportingOpen(false)}
        onReportSubmitted={handleReportSubmitted}
        userName={userName}
      />

      {/* TARA AI Civic Assistant Modal */}
      <TaraCopilotModal
        isOpen={isTaraOpen}
        onClose={() => setIsTaraOpen(false)}
        onDraftReport={handleDraftFromTara}
      />

      {/* Issue Detail Timeline Modal */}
      <IssueDetailModal
        issue={detailIssue}
        isOpen={!!detailIssue}
        onClose={() => setDetailIssue(null)}
        onUpvote={handleUpvote}
        isUpvoted={detailIssue ? upvotedSet.has(detailIssue.id) : false}
      />

      {/* Aadhaar Welcome Note & Profile Picture Prompt Modal */}
      <AadhaarWelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={handleCloseWelcomeModal}
        onSetPfp={handleSetPfpAction}
        userData={storedSetuUser}
      />

      {/* 🔔 Apple-Style Notification Sidebar */}
      <NotificationSidebar
        isOpen={isNotificationSidebarOpen}
        onClose={() => setIsNotificationSidebarOpen(false)}
        notifications={notifications}
        onClearNotification={handleClearNotification}
        onClearAll={handleClearAllNotifications}
      />

      {/* Floating Success Pill Toast */}
      {submitToast && (
        <div
          style={{
            position: 'fixed',
            bottom: isViewportMobile ? '80px' : '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#111827',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'applePop 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <GoogleIcon name="check_circle" size={18} color="#22c55e" />
          <span>{submitToast}</span>
        </div>
      )}
    </div>
  );
};
