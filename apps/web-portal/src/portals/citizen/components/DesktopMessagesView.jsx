import React, { useState, useRef, useEffect } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useLanguage } from '../../../context/LanguageContext';

const INITIAL_CHATS = [
  {
    id: 'city-maintenance',
    name: 'City Maintenance',
    department: 'Ward 4 Emergency Rapid Repair Unit',
    unreadCount: 1,
    time: '2h ago',
    avatarText: 'CM',
    avatarIcon: 'engineering',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7UefH6CCb0TAxi7bhPKBjNpxJvFHfeytCfxrrYeDhsJujtvIAyeaarhSNxPvrcXZFIf6ao0rN315I-nWyVig8I8v9SHI4hkG4cBRyNk63cZ0Wx2crQFep2kFUb0g2IuRIeQYnJkNm3FpMBWmaCMjZdwt8B_4quhjm34Up_0MUvUbwf6wy651MTgdDzKp9pdSTF6ZEhJg_m2bOo6z9CjTjWKUsYqxihqE_d-p8JqsSR2ERUj98Y3ADaQ',
    lastMessage: 'We have received your report and are assessing the site.',
    status: 'Online',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Reporting a severe road surface cavity near Main St & 4th Avenue junction. Water pipe leakage underneath seems to have eroded the pavement base. Traffic is being obstructed.',
        time: '11:18 AM',
        status: 'read'
      },
      {
        id: 'm2',
        sender: 'system',
        text: 'Your report has been logged and assigned to the Ward 4 Emergency Rapid Repair Unit.',
        time: '11:19 AM'
      },
      {
        id: 'm3',
        sender: 'official',
        officer: 'Officer S. Verma · Unit 04-B',
        text: 'We have received your report regarding the pothole on Main St. Unit 04-B has been dispatched (ETA 18 mins). A team is en route for inspection.',
        time: '11:42 AM'
      }
    ]
  },
  {
    id: 'aarav-lead',
    name: 'Aarav (Community Lead)',
    department: 'Ward 4 Resident Welfare Group',
    unreadCount: 0,
    time: 'Yesterday',
    avatarText: 'AL',
    avatarIcon: 'person',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_PC0kVFFD7tzTzyTbYVwYRDfhncQst7RfRpZdSV4avd997G6pJrRkxqQYIQZi6xppg7HLx3sCKuLmevGwLpGJ5Bzdsx9KG7JfTCr_2UtEyre55d_IwqGymRaXXvw4EmwuSj0EM2ITLcqe6tR4xufo-Ae7UyuV1Ywki_BOq1b86uJxlewf8J_D-Bg3C8xt3cW6vhOCju-_0cQtMCBizxTBRVlwSyZBvTuesJfOTiXguwvA1dqJIw1-Vw',
    lastMessage: 'See you at the meeting tomorrow!',
    status: 'Away',
    messages: [
      {
        id: 'a1',
        sender: 'official',
        officer: 'Aarav',
        text: 'Namaste Rampal ji! We are organizing the monthly civic coordination agenda for ward improvements.',
        time: 'Yesterday 4:15 PM'
      },
      {
        id: 'a2',
        sender: 'user',
        text: 'Namaste Aarav! I will join and present the solar streetlight status from our sector.',
        time: 'Yesterday 4:22 PM',
        status: 'read'
      },
      {
        id: 'a3',
        sender: 'official',
        officer: 'Aarav',
        text: 'See you at the meeting tomorrow!',
        time: 'Yesterday 4:25 PM'
      }
    ]
  },
  {
    id: 'setu-support',
    name: 'Setu Support',
    department: 'Jharkhand State Civic Helpdesk',
    unreadCount: 0,
    time: 'Oct 12',
    avatarText: 'SS',
    avatarIcon: 'support_agent',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoAIvJLgcXDt8RlWbeptkh8hFdiMCsN6el1-0es-uWZypvca715HytYiQMi4ip0TLXO52RXjtLv1I5VOzWfiVMyBgBSefB7JoZnPHTLqJbhSEdLHW9YG0R9i-WYS7R_hv-vsVlVVV7BAj7wrNkxvu5fRe6Kdsgwx3iYVYsCkCTfyofPwp4vACr5BQ_n622XLV1hp7M-gbbOFHSuOlB_PHZresTgj5hdK1XtzjPRBKipWRKx51chHwxTw',
    lastMessage: 'The streetlight on 5th Ave has been repaired.',
    status: 'Offline',
    messages: [
      {
        id: 's1',
        sender: 'system',
        incidentTag: 'Ticket #SETU-4409',
        riskLevel: 'Resolved',
        text: 'The streetlight on 5th Ave has been repaired and verified by the local municipal electrical team.',
        footer: 'Automated Status Notification',
        time: 'Oct 12, 10:30 AM'
      }
    ]
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    department: 'Clean Green Jharkhand Volunteer',
    unreadCount: 0,
    time: 'Oct 10',
    avatarText: 'PS',
    avatarIcon: 'nature_people',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfqgbzeu_k1j3Vp9tOEJWsApdJ8ovOKVGNQJpfEQKtKPx3Z78ybidfnRMmB_I8tSaYD2kiKSmTRu1Vn5LCTBO2K0yAKdUgZcAos-clT3OlVNmBbQ0Dd8Yo3WSzVDxJc0cKoEYd2Q8z9RooYiQGMlclY2W5ypA-IAArvyzo0BBJ6VkNnjJ0AcuVvZCNWgInN7OUaxyXLThjZqH2V3NRdUfkwdbaqALPsEtlV4X1RyWcFyV_eGVB41riLg',
    lastMessage: 'Are you still available for the clean-up drive?',
    status: 'Offline',
    messages: [
      {
        id: 'p1',
        sender: 'official',
        officer: 'Priya Sharma',
        text: 'Hello Rampal! We have scheduled a community park rejuvenation drive this weekend.',
        time: 'Oct 10, 09:12 AM'
      },
      {
        id: 'p2',
        sender: 'official',
        officer: 'Priya Sharma',
        text: 'Are you still available for the clean-up drive?',
        time: 'Oct 10, 09:15 AM'
      }
    ]
  }
];

export const DesktopMessagesView = ({
  onOpenTara,
  onOpenReport,
  activeNav,
  setActiveNav,
  userName = 'Rampal'
}) => {
  const { t } = useLanguage();
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState('city-maintenance');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isSqueezed, setIsSqueezed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isChatsMenuOpen, setIsChatsMenuOpen] = useState(false);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeChat = chats.find((c) => c.id === selectedChatId) || chats[0];

  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  // Smoothly squeeze the sidemenu upon arrival on the messages page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSqueezed(true);
    }, 40);
    return () => clearTimeout(timer);
  }, []);

  // Smooth Apple-style transition when leaving the messages page back to other views
  const handleNavigateAway = (targetNav) => {
    if (targetNav === activeNav && targetNav !== 'report') return;
    if (targetNav === 'report') {
      if (onOpenReport) onOpenReport();
      else onOpenTara();
      return;
    }
    // If the sidebar is already expanded (e.g. user hovered over it),
    // switch immediately without jitter because the sidebar is already at 256px!
    if (isSidemenuExpanded) {
      setActiveNav(targetNav);
      return;
    }
    // If it was squeezed, smoothly expand sidebar and fade out chat before switching
    setIsExiting(true);
    setTimeout(() => {
      setActiveNav(targetNav);
    }, 240);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      time: timeStr,
      status: 'sent'
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            lastMessage: text,
            time: 'Just now',
            messages: [...chat.messages, newMsg]
          };
        }
        return chat;
      })
    );

    setInputMessage('');

    // Simulate automated official response from dispatch desk after 950ms
    if (activeChat.id === 'city-maintenance') {
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const autoReply = {
          id: 'ack_' + Date.now(),
          sender: 'system',
          text: 'Your transmission has been forwarded to Unit 04-B field supervisor. Current status: In Progress.',
          time: replyTime
        };

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id === 'city-maintenance') {
              return {
                ...chat,
                lastMessage: autoReply.text,
                time: 'Just now',
                messages: [...chat.messages, autoReply]
              };
            }
            return chat;
          })
        );
      }, 950);
    }
  };

  const isSidemenuExpanded = !isSqueezed || isHovered || isExiting;
  const sidebarWidth = isSidemenuExpanded ? 256 : 72;
  const layoutMarginLeft = (!isSqueezed || isExiting) ? 256 : 72;

  const [pfpUrl, setPfpUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('setu_user_pfp') || null;
    }
    return null;
  });

  useEffect(() => {
    const handlePfpUpdate = () => {
      setPfpUrl(localStorage.getItem('setu_user_pfp') || null);
    };
    window.addEventListener('setu-pfp-updated', handlePfpUpdate);
    return () => window.removeEventListener('setu-pfp-updated', handlePfpUpdate);
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', backgroundColor: '#ffffff', color: '#1a1c1c', overflow: 'hidden' }}>
      {/* 1. Left Persistent Sidemenu: Squeezes on arrival, expands over chats on hover */}
      <aside
        className="apple-frosted-sidebar"
        onMouseEnter={() => {
          if (!isExiting) setIsHovered(true);
        }}
        onMouseLeave={() => {
          if (!isExiting) setIsHovered(false);
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${sidebarWidth}px`,
          zIndex: isHovered ? 70 : 50,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 14px',
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.96)' : '#ffffff',
          backdropFilter: isHovered ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isHovered ? 'blur(20px)' : 'none',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: isHovered
            ? '6px 0 28px rgba(0, 0, 0, 0.14), 16px 0 48px rgba(0, 0, 0, 0.10)'
            : '0 1px 8px rgba(0, 0, 0, 0.04)',
          overflowY: 'auto',
          overflowX: 'hidden',
          transition:
            'width 0.32s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease'
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
              {isSidemenuExpanded ? 'Setu.' : 'S.'}
            </span>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>
            {[
              { id: 'home', label: t('nav_home', 'Home'), icon: 'home', badge: null },
              { id: 'explore', label: t('nav_explore', 'Explore'), icon: 'explore', badge: null },
              { id: 'report', label: t('nav_report', 'Report Issue'), icon: 'add_circle', badge: null, highlight: true },
              { id: 'messages', label: t('nav_messages', 'Messages'), icon: 'chat', badge: '3' }
            ].map((item) => {
              const isActive = activeNav === item.id || item.id === 'messages';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigateAway(item.id)}
                  title={!isSidemenuExpanded ? item.label : undefined}
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
                  {/* Icon Box: 24px wide, centered at 10px padding in 44px square */}
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
                    {/* Red dot attached directly to icon */}
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

                  {/* Label: Smooth horizontal slide & fade, zero vertical/size distortion */}
                  <span
                    style={{
                      marginLeft: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      opacity: isSidemenuExpanded ? 1 : 0,
                      maxWidth: isSidemenuExpanded ? '140px' : '0px',
                      transform: isSidemenuExpanded ? 'translateX(0)' : 'translateX(-6px)',
                      transition:
                        'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                      pointerEvents: isSidemenuExpanded ? 'auto' : 'none'
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Badge: Appears cleanly on the right */}
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
                        flexShrink: 0,
                        opacity: isSidemenuExpanded ? 1 : 0,
                        transform: isSidemenuExpanded ? 'scale(1)' : 'scale(0.6)',
                        transition: 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        pointerEvents: 'none'
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
            onClick={() => handleNavigateAway('profile')}
            title={!isSidemenuExpanded ? (userName || 'Rampal') : undefined}
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
                flexShrink: 0,
                overflow: 'hidden'
              }}
            >
              {pfpUrl ? (
                <img src={pfpUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <GoogleIcon name="person" size={18} color="#ffffff" />
              )}
            </div>
            <div
              style={{
                marginLeft: '10px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                opacity: isSidemenuExpanded ? 1 : 0,
                maxWidth: isSidemenuExpanded ? '140px' : '0px',
                transform: isSidemenuExpanded ? 'translateX(0)' : 'translateX(-6px)',
                transition:
                  'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: isSidemenuExpanded ? 'auto' : 'none'
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1a1c1c', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {userName || 'Rampal'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#5e5e5e', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {t('ward_4', 'Ward 4')}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Canvas: Expands smoothly over chats on hover, smoothly adapts when leaving messages */}
      <div
        style={{
          flex: 1,
          marginLeft: `${layoutMarginLeft}px`,
          height: '100vh',
          display: 'flex',
          width: `calc(100% - ${layoutMarginLeft}px)`,
          overflow: 'hidden',
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'scale(0.995) translateY(4px)' : 'none',
          transition:
            'margin-left 0.32s cubic-bezier(0.16, 1, 0.3, 1), width 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Panel 1: Chats List (Preserves same 340px width) */}
        <section
          style={{
            width: '340px',
            height: '100vh',
            backgroundColor: '#ffffff',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
          }}
        >
          {/* Chats Header */}
          <div style={{ padding: '1.25rem 1.25rem 0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a1c1c', letterSpacing: '-0.01em' }}>{t('chats', 'Chats')}</span>
              <div style={{ position: 'relative' }}>
                <button
                  title="More options"
                  onClick={() => setIsChatsMenuOpen((prev) => !prev)}
                  className="three-dots-btn"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isChatsMenuOpen ? '#1a1c1c' : '#5e5e5e',
                    border: 'none',
                    background: isChatsMenuOpen ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'background-color 0.15s ease, transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                >
                  <GoogleIcon name="more_vert" size={20} color="currentColor" />
                </button>

                {/* Apple Contextual Menu Dropdown */}
                {isChatsMenuOpen && (
                  <>
                    <div
                      onClick={() => setIsChatsMenuOpen(false)}
                      style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 50
                      }}
                    />
                    <div
                      className="apple-popover-menu"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        right: 0,
                        zIndex: 51,
                        minWidth: '160px',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        boxShadow: '0 8px 24px -2px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
                        padding: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        boxSizing: 'border-box'
                      }}
                    >
                      <button
                        onClick={() => {
                          setChats((prev) => prev.map((c) => ({ ...c, unreadCount: 0 })));
                          setIsChatsMenuOpen(false);
                        }}
                        className="apple-tap"
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#1c1c1e',
                          textAlign: 'left',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {t('mark_all_read', 'Mark all as read')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#f3f3f3',
                borderRadius: '0.75rem',
                padding: '0.5rem 0.75rem'
              }}
            >
              <GoogleIcon name="search" size={18} color="#7e7576" />
              <input
                type="text"
                placeholder={t('search_placeholder', 'Search grievances...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.875rem',
                  color: '#1a1c1c',
                  width: '100%'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <GoogleIcon name="close" size={16} color="#7e7576" />
                </button>
              )}
            </div>
          </div>

          {/* Chat Threads List (No push-on-click scale animations) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              overflowY: 'auto',
              flex: 1,
              padding: '0 0.75rem 1rem 0.75rem'
            }}
          >
            {filteredChats.map((chat) => {
              const isSelected = chat.id === selectedChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '0.625rem',
                    backgroundColor: isSelected ? '#eeeeee' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#e2e2e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden'
                    }}
                  >
                    {chat.avatarUrl ? (
                      <img
                        src={chat.avatarUrl}
                        alt={chat.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <GoogleIcon name={chat.avatarIcon || 'person'} size={22} color="#1a1c1c" />
                    )}
                  </div>

                  {/* Content Info */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: isSelected ? '700' : '600',
                          color: '#1a1c1c',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {chat.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: chat.unreadCount > 0 ? '#000000' : '#7e7576',
                          fontWeight: chat.unreadCount > 0 ? '700' : '400',
                          marginLeft: '0.5rem',
                          flexShrink: 0
                        }}
                      >
                        {chat.time}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: chat.unreadCount > 0 ? '#1a1c1c' : '#5e5e5e',
                        fontWeight: chat.unreadCount > 0 ? '600' : '400',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {chat.lastMessage}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {chat.unreadCount > 0 && (
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        fontSize: '0.6875rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Panel 2: Active Conversation Canvas (Flush, Edge-to-Edge) */}
        <section
          style={{
            flex: 1,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            overflow: 'hidden'
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              height: '68px',
              padding: '0 1.75rem',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <GoogleIcon name={activeChat.avatarIcon || 'engineering'} size={22} color="#ffffff" />
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: activeChat.status === 'Online' ? '#15803d' : '#9ca3af'
                    }}
                  />
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#1a1c1c', margin: 0 }}>
                  {activeChat.name}
                </h2>
                <span style={{ fontSize: '0.75rem', color: '#5e5e5e' }}>
                  {activeChat.department}
                </span>
              </div>
            </div>

            {/* Header Actions - 3 dots with Apple touch */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                title="Options"
                onClick={() => setIsChatMenuOpen((prev) => !prev)}
                className="three-dots-btn"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: isChatMenuOpen ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                  cursor: 'pointer',
                  color: isChatMenuOpen ? '#1a1c1c' : '#7e7576',
                  outline: 'none',
                  boxShadow: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'background-color 0.15s ease, transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              >
                <GoogleIcon name="more_vert" size={20} color="currentColor" />
              </button>

              {/* Apple Contextual Menu Dropdown */}
              {isChatMenuOpen && (
                <>
                  <div
                    onClick={() => setIsChatMenuOpen(false)}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 50
                    }}
                  />
                  <div
                    className="apple-popover-menu"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      zIndex: 51,
                      minWidth: '150px',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 8px 24px -2px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
                      padding: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      boxSizing: 'border-box'
                    }}
                  >
                    <button
                      onClick={() => setIsChatMenuOpen(false)}
                      className="apple-tap"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#1c1c1e',
                        textAlign: 'left',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {t('case_details', 'Case details')}
                    </button>
                    <div style={{ height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.06)', margin: '2px 0' }} />
                    <button
                      onClick={() => setIsChatMenuOpen(false)}
                      className="apple-tap"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#ff3b30',
                        textAlign: 'left',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Report concern
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Messages History Stream */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              backgroundColor: '#fbfbfb'
            }}
          >
            {/* Date Divider Pill */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0.25rem 0' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#eeeeee',
                  color: '#5e5e5e',
                  fontSize: '0.6875rem',
                  fontWeight: '600',
                  letterSpacing: '0.04em'
                }}
              >
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#7e7576' }} />
                <span>TODAY, MAY 14, 2025</span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#7e7576' }} />
              </div>
            </div>

            {/* Message Bubbles (No Action Pills) */}
            {activeChat.messages.map((msg) => {
              if (msg.sender === 'user') {
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      maxWidth: '70%',
                      alignSelf: 'flex-end'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        borderRadius: '1.25rem 1.25rem 0.25rem 1.25rem',
                        padding: '0.875rem 1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem'
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.55, wordBreak: 'break-word' }}>
                        {msg.text}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '0.25rem',
                          color: 'rgba(255, 255, 255, 0.65)',
                          fontSize: '0.6875rem',
                          marginTop: '0.15rem',
                          userSelect: 'none'
                        }}
                      >
                        <span>{msg.time}</span>
                        <GoogleIcon name="done_all" size={14} color="rgba(255, 255, 255, 0.75)" />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    maxWidth: '70%',
                    alignSelf: 'flex-start'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#f3f3f3',
                      color: '#1a1c1c',
                      borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem',
                      padding: '0.875rem 1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.55, wordBreak: 'break-word' }}>
                      {msg.text}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        color: '#7e7576',
                        fontSize: '0.6875rem',
                        marginTop: '0.15rem',
                        userSelect: 'none'
                      }}
                    >
                      <span>{msg.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar: Circular Send Button Outside the Typing Box */}
          <div
            style={{
              padding: '1rem 1.75rem',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              backgroundColor: '#ffffff',
              flexShrink: 0
            }}
          >
            <form
              onSubmit={handleSendMessage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%'
              }}
            >
              {/* Typing Box */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f3f3f3',
                  borderRadius: '1.5rem',
                  padding: '0.45rem 0.6rem 0.45rem 0.85rem',
                  gap: '0.5rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => onOpenTara()}
                  title="Attach document or media"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#5e5e5e',
                    padding: '0.35rem',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease, opacity 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <GoogleIcon name="attach_file" size={20} color="#5e5e5e" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={t('type_message', 'Type your inquiry or update...')}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: '#1a1c1c',
                    padding: '0.35rem 0'
                  }}
                />
              </div>

              {/* Circular Send Button OUTSIDE the typing box */}
              <button
                type="submit"
                title="Send Message"
                className="apple-send-btn apple-tap"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                <span className="apple-icon-push">
                  <GoogleIcon name="send" size={18} color="#ffffff" />
                </span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
