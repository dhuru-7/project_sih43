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
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useAuth } from '../../../context/AuthContext';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'Status Update',
    time: '10m ago',
    message: 'Nodal Cell reviewing recently submitted civic grievances.',
    isNew: true
  }
];

export const CitizenHomePage = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const [issues, setIssues] = useState([]);
  const [upvotedSet, setUpvotedSet] = useState(new Set());

  // Load real submissions from persistent database
  useEffect(() => {
    const fetchLiveIssues = async () => {
      try {
        const resp = await fetch('http://localhost:5000/api/v1/problems');
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
            upvotes: 1,
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
  }, []);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isProfileInitial = location.pathname.includes('profile') || searchParams.get('tab') === 'profile';

  const [activeNav, setActiveNav] = useState(
    isProfileInitial
      ? 'profile'
      : location.pathname.includes('messages')
      ? 'messages'
      : location.pathname.includes('explore')
      ? 'explore'
      : 'home'
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.pathname.includes('profile') || params.get('tab') === 'profile') {
      setActiveNav('profile');
      setIsReportingOpen(false);
    } else if (location.pathname.includes('messages')) {
      setActiveNav('messages');
    } else if (location.pathname.includes('explore')) {
      setActiveNav('explore');
    } else if (location.pathname.includes('home') || location.pathname === '/citizen' || location.pathname === '/report') {
      setActiveNav('home');
    }
  }, [location.pathname, location.search]);

  const navigate = useNavigate();

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
        />
      ) : (
        <DesktopHomeView
          key="desktop-home"
          issues={issues}
          onOpenTara={() => setIsTaraOpen(true)}
          onOpenReport={() => setIsReportingOpen(true)}
          onOpenIssueDetail={(issue) => setDetailIssue(issue)}
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
    </div>
  );
};
