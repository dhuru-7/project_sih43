import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useAuth } from '../../../context/AuthContext';

const INITIAL_ISSUES = [
  {
    id: '#SETU-8821',
    title: 'High fluoride & iron contamination in village tubewells',
    status: 'pending',
    statusBadge: 'Pending',
    time: '25 mins ago',
    location: 'Bero Block, Ranchi District',
    author: 'R. Oraon',
    assignee: 'Water Quality & Filtration Lab, BIT Mesra',
    upvotes: 42,
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1Wpl1YDWIe9-OQF9mOpMVkvg7jFIVPX855BQ4SA8mlBN4v_5MihUTCEvZ0ctPYj0loAhhXz35Tk8r3NGMZd44cZkwuVWSYd5VGMH7KYlUoM4aj2Bk3Jn32CQtC6v4A-IA_LdpSHMtD8z95qQzEUVU3j-SxLAlUf-B7Uq2L6P6Xkcdgg5NNLQhFWReSRwUsJyu1Cxxtdcqwb1Evrvpws4zVx4lhaiABnw-3ipYTpB6UbzM6fi4Pv9wIpB7Mk',
    description:
      'Groundwater from deep borewells in 3 tolas is yielding yellowish water with high fluoride precipitate, causing dental fluorosis in schoolchildren.'
  },
  {
    id: '#SETU-8819',
    title: 'Frequent solar micro-grid inverter breakdown at tribal school',
    status: 'reviewed',
    statusBadge: 'Reviewed',
    time: '2 hours ago',
    location: 'Govindpur Block, Dhanbad',
    author: 'A. Sharma',
    assignee: 'Clean Energy Lab, IIT ISM Dhanbad',
    upvotes: 18,
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1VUEs9qn2Iil82vGxYYMhSyA1RfKXfXZ_GmBbcoZiASw2Mg6cMJ8wAhEh3aenSngPwO4y8lWY10dUUUH3m8DbUB4peZcH9ZbQfWL6daASXdWrlca0EPgpZzYHdizjZsAYWXeQ_VfJwHFTuUOuxS3xSEN4B4ZVlRxs0iVUNq5yzpE-yWgTpTZFJBN-itG7BwCXnRFGp3debdzabJbnb69mB0Fcmy4V0-8W4PjCJrkWrP4uhF1QXAGxkw2YE5',
    description:
      'The community solar micro-grid inverter trips repeatedly during peak sunlight hours, leaving the residential school without power for computer lab and water pumping.'
  },
  {
    id: '#SETU-8790',
    title: 'Low-cost biomass briquetting unit deployed for crop residue',
    status: 'resolved',
    statusBadge: 'Resolved',
    time: 'Yesterday',
    location: 'Ormanjhi Block, Ranchi',
    author: 'S. Munda',
    assignee: 'Birsa Agricultural University Tech Team',
    upvotes: 63,
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1VWaLlkyPvD1vyDKs0va6U9buDzSDUlwo0MvizG610Bg5ZCE_-zQxG52r-HsySXLfTkjC5o5KK7pmWpcS2dmQ4pCCmIgeu_ZgR9D8hCbs9laGxi9wN0pC7fM9HsXIWLlBDdKut3c3ob53x8X7NT3vGp6q4CkOjPsVEJjwF2zjrqBY4e05KNfeWCjjvelZVeguWrnuu74d4SFxz4IgKWwzaF-1PJ1nHyp2pmK4OGnN1x-OKVkgHi8yfbW2wP',
    description:
      'Field testing of decentralized briquette press completed; converting paddy straw into smokeless cooking fuel for 40 local households.'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'Status Update',
    time: '10m ago',
    message: 'Status updated for Water Quality report #SETU-8821 to Under Nodal Review.',
    isNew: true
  },
  {
    id: 2,
    type: 'Research Team Response',
    time: '45m ago',
    message: 'Birsa Agricultural University submitted a field verification report for soil salinity issue.',
    isNew: true
  },
  {
    id: 3,
    type: 'Nodal Advisory',
    time: '2h ago',
    message: 'DHTE Nodal Cell approved seed grant allocation for community water filtration pilot.',
    isNew: true
  },
  {
    id: 4,
    type: 'Community Upvote',
    time: 'Yesterday',
    message: '14 residents validated and confirmed your Street Light report.',
    isNew: false
  }
];

export const CitizenHomePage = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [upvotedSet, setUpvotedSet] = useState(new Set());
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(
    location.pathname.includes('messages')
      ? 'messages'
      : location.pathname.includes('explore')
      ? 'explore'
      : location.pathname.includes('profile')
      ? 'profile'
      : 'home'
  );

  useEffect(() => {
    if (location.pathname.includes('messages')) {
      setActiveNav('messages');
    } else if (location.pathname.includes('explore')) {
      setActiveNav('explore');
    } else if (location.pathname.includes('profile')) {
      setActiveNav('profile');
    } else if (location.pathname.includes('home') || location.pathname === '/citizen' || location.pathname === '/report') {
      setActiveNav('home');
    }
  }, [location.pathname]);

  // Modals
  const [isTaraOpen, setIsTaraOpen] = useState(false);
  const [isReportingOpen, setIsReportingOpen] = useState(false);
  const [detailIssue, setDetailIssue] = useState(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === '/report' || location.pathname === '/citizen/report') {
      setIsReportingOpen(true);
    }
  }, [location.pathname]);

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
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          userName={userName}
        />
      ) : activeNav === 'explore' ? (
        <DesktopExploreView
          key="desktop-explore"
          onOpenTara={() => setIsTaraOpen(true)}
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
    </div>
  );
};
