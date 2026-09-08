import React, { useState, useRef, useEffect } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

const INITIAL_CHATS = [
  {
    id: 'city-maintenance',
    name: 'City Maintenance',
    department: 'Ward 4 Emergency Rapid Repair Unit',
    unreadCount: 1,
    time: '2h ago',
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

export const MobileMessagesView = ({
  onOpenTara,
  activeNav,
  setActiveNav,
  userName = 'Rampal',
  hideNav = false,
  onChatOpenChange
}) => {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isDetailMenuOpen, setIsDetailMenuOpen] = useState(false);
  const [isListMenuOpen, setIsListMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeChat) {
      scrollToBottom();
    }
  }, [activeChat?.messages]);

  // When chat opens, automatically focus the keyboard input
  useEffect(() => {
    if (activeChatId) {
      inputRef.current?.focus();
    }
  }, [activeChatId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      onChatOpenChange?.(false);
    };
  }, [onChatOpenChange]);

  const handleOpenChat = (id) => {
    setActiveChatId(id);
    onChatOpenChange?.(true);
    // Mark as read
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
    // Synchronously / microtask focus input to trigger virtual keyboard on mobile devices
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleCloseChat = () => {
    setActiveChatId(null);
    setIsDetailMenuOpen(false);
    onChatOpenChange?.(false);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    const text = inputMessage.trim();
    if (!text || !activeChat) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: 'usr_mob_' + Date.now(),
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

    // Simulate automated response after 950ms
    if (activeChat.id === 'city-maintenance') {
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const autoReply = {
          id: 'ack_mob_' + Date.now(),
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

  // If a chat is active, render the Chat Detail view (Typing bar anchored at bottom, bottom nav hidden)
  if (activeChat) {
    return (
      <div
        className="apple-page-enter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: '#f9f9f9',
          color: '#1a1c1c',
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Sticky Detail Header: Green dot next to avatar, NO online text, outline on 3 dots click */}
        <header
          className="apple-frosted-nav"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <button
              onClick={handleCloseChat}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1a1c1c',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
              aria-label="Back to messages"
            >
              <GoogleIcon name="arrow_back" size={22} color="#1a1c1c" />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#e2e2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  {activeChat.avatarUrl ? (
                    <img
                      src={activeChat.avatarUrl}
                      alt={activeChat.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <GoogleIcon name={activeChat.avatarIcon || 'person'} size={20} color="#1a1c1c" />
                  )}
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '11px',
                    height: '11px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: activeChat.status === 'Online' ? '#15803d' : '#9ca3af'
                    }}
                  />
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1a1c1c', lineHeight: 1.2 }}>
                  {activeChat.name}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#5e5e5e' }}>
                  {activeChat.department}
                </span>
              </div>
            </div>
          </div>

          {/* 3-dots button with Apple touch */}
          <div style={{ position: 'relative' }}>
            <button
              title="Options"
              onClick={() => setIsDetailMenuOpen((prev) => !prev)}
              className="three-dots-btn"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: isDetailMenuOpen ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                cursor: 'pointer',
                color: isDetailMenuOpen ? '#1a1c1c' : '#5e5e5e',
                outline: 'none',
                boxShadow: 'none',
                WebkitTapHighlightColor: 'transparent',
                transition: 'background-color 0.15s ease, transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            >
              <GoogleIcon name="more_vert" size={20} color="currentColor" />
            </button>

            {/* Apple Contextual Menu Dropdown */}
            {isDetailMenuOpen && (
              <>
                <div
                  onClick={() => setIsDetailMenuOpen(false)}
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
                    onClick={() => setIsDetailMenuOpen(false)}
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
                    Case details
                  </button>
                  <div style={{ height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.06)', margin: '2px 0' }} />
                  <button
                    onClick={() => setIsDetailMenuOpen(false)}
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
        </header>

        {/* Scrollable Messages Stream */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))'
          }}
        >
          {/* Date Divider Pill */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.2rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: '#eeeeee',
                color: '#5e5e5e',
                fontSize: '0.6875rem',
                fontWeight: '600',
                letterSpacing: '0.03em'
              }}
            >
              <span>TODAY, MAY 14, 2025</span>
            </div>
          </div>

          {activeChat.messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    maxWidth: '85%',
                    alignSelf: 'flex-end'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      borderRadius: '1.125rem 1.125rem 0.2rem 1.125rem',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45, wordBreak: 'break-word' }}>
                      {msg.text}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.25rem',
                        color: 'rgba(255, 255, 255, 0.65)',
                        fontSize: '0.625rem',
                        marginTop: '0.15rem',
                        userSelect: 'none'
                      }}
                    >
                      <span>{msg.time}</span>
                      <GoogleIcon name="done_all" size={13} color="rgba(255, 255, 255, 0.75)" />
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
                  maxWidth: '88%',
                  alignSelf: 'flex-start'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#f3f3f3',
                    color: '#1a1c1c',
                    borderRadius: '1.125rem 1.125rem 1.125rem 0.2rem',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.45, wordBreak: 'break-word' }}>
                    {msg.text}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      color: '#7e7576',
                      fontSize: '0.625rem',
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
        </main>

        {/* Fixed Bottom Input Bar: Perfectly fitted to mobile screen with balanced cushion */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: '#ffffff',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            paddingLeft: '14px',
            paddingRight: '14px',
            paddingTop: '10px',
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
            boxSizing: 'border-box',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <form
            onSubmit={handleSendMessage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%'
            }}
          >
            {/* Typing Box */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f3f3f3',
                borderRadius: '24px',
                padding: '0 12px',
                minHeight: '44px',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <button
                type="button"
                onClick={() => onOpenTara()}
                title="Attach file"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5e5e5e',
                  padding: '0.25rem',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'opacity 0.15s ease'
                }}
              >
                <GoogleIcon name="attach_file" size={20} color="#5e5e5e" />
              </button>

              <input
                ref={inputRef}
                autoFocus
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.9375rem',
                  color: '#1a1c1c',
                  padding: '10px 0'
                }}
              />
            </div>

            {/* Circular Send Button OUTSIDE typing box */}
            <button
              type="submit"
              title="Send message"
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
      </div>
    );
  }

  // Default: Thread List matching Stitch Mobile screen (No click-to-push animations on chats or 3 dots)
  return (
    <div
      className="apple-page-enter"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        color: '#1a1c1c',
        width: '100%',
        position: 'relative'
      }}
    >
      {/* 1. Top App Bar - Strictly "Messages" matching Stitch */}
      <header
        className="apple-frosted-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem'
        }}
      >
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: '#000000',
            margin: 0
          }}
        >
          Messages
        </h1>
        {/* 3-dots button with Apple touch */}
        <div style={{ position: 'relative' }}>
          <button
            title="More options"
            onClick={() => setIsListMenuOpen((prev) => !prev)}
            className="three-dots-btn"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isListMenuOpen ? '#1a1c1c' : '#5e5e5e',
              border: 'none',
              background: isListMenuOpen ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
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
          {isListMenuOpen && (
            <>
              <div
                onClick={() => setIsListMenuOpen(false)}
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
                    setIsListMenuOpen(false);
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
                  Mark all as read
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* 2. Updates / Threads List (NO click to push animations) */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: hideNav ? '1rem' : '80px',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleOpenChat(chat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                backgroundColor: chat.unreadCount > 0 ? '#fbfbfb' : '#ffffff',
                textAlign: 'left',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                transition: 'background-color 0.15s ease'
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
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
                  <GoogleIcon name={chat.avatarIcon || 'person'} size={24} color="#1a1c1c" />
                )}
              </div>

              {/* Text Snippets */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: '600',
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
                      fontSize: '0.75rem',
                      fontWeight: chat.unreadCount > 0 ? '700' : '400',
                      color: chat.unreadCount > 0 ? '#000000' : '#7e7576',
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
                    fontWeight: chat.unreadCount > 0 ? '600' : '400',
                    color: chat.unreadCount > 0 ? '#1a1c1c' : '#5e5e5e',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {chat.lastMessage}
                </p>
              </div>

              {/* Unread Pill */}
              {chat.unreadCount > 0 && (
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '0.75rem',
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
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};
