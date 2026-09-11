import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const NotificationSidebar = ({ isOpen, onClose, notifications = [], onClearNotification, onClearAll }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef(null);

  // Sync prop changes
  useEffect(() => {
    if (isOpen) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender && !isClosing) {
      triggerClose();
    }
  }, [isOpen]);

  const triggerClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      if (onClose) onClose();
    }, 280); // Apple fluid sheet exit duration
  };

  useEffect(() => {
    if (!shouldRender) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        triggerClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, isClosing]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  if (!shouldRender) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: isClosing ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.38)',
        backdropFilter: isClosing ? 'blur(0px)' : 'blur(10px)',
        WebkitBackdropFilter: isClosing ? 'blur(0px)' : 'blur(10px)',
        opacity: isClosing ? 0 : 1,
        transition: isClosing
          ? 'opacity 0.28s cubic-bezier(0.25, 1, 0.5, 1), backdrop-filter 0.28s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.28s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.32s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={triggerClose}
    >
      <style>
        {`
          @keyframes appleSlideInRight {
            from {
              transform: translateX(100%);
              box-shadow: 0 0 0 rgba(0, 0, 0, 0);
            }
            to {
              transform: translateX(0);
              box-shadow: -12px 0 40px rgba(0, 0, 0, 0.16);
            }
          }
          @keyframes appleSlideOutRight {
            from {
              transform: translateX(0);
              box-shadow: -12px 0 40px rgba(0, 0, 0, 0.16);
            }
            to {
              transform: translateX(100%);
              box-shadow: 0 0 0 rgba(0, 0, 0, 0);
            }
          }
        `}
      </style>
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.16)',
          display: 'flex',
          flexDirection: 'column',
          animation: isClosing
            ? 'appleSlideOutRight 0.28s cubic-bezier(0.32, 0.72, 0, 1) forwards'
            : 'appleSlideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          willChange: 'transform'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #f0f0f2',
            backgroundColor: '#fafafb'
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
              Notifications
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {notifications.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
              >
                Clear all
              </button>
            )}
            <button
              onClick={triggerClose}
              className="apple-tap"
              style={{
                background: 'none',
                border: 'none',
                color: '#4b5563',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f3f4f6',
                transition: 'background-color 0.15s ease'
              }}
              aria-label="Close notification sidebar"
            >
              <GoogleIcon name="close" size={20} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {notifications.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                color: '#9ca3af',
                textAlign: 'center',
                gap: '0.75rem'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af'
                }}
              >
                <GoogleIcon name="notifications_off" size={28} />
              </div>
              <p style={{ margin: 0, fontWeight: '600', color: '#4b5563', fontSize: '0.95rem' }}>
                No notifications right now
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {notifications.map((n) => {
                const isViolation = n.type === 'Policy Violation' || n.isAlert;
                return (
                  <div
                    key={n.id}
                    style={{
                      padding: '1rem 1.1rem',
                      borderRadius: '14px',
                      backgroundColor: isViolation ? '#fff5f5' : '#ffffff',
                      border: isViolation ? '1px solid #fecaca' : '1px solid #e5e7eb',
                      boxShadow: isViolation
                        ? '0 2px 10px rgba(239, 68, 68, 0.08)'
                        : '0 1px 4px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      gap: '0.85rem',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: isViolation ? '#fee2e2' : '#f3f4f6',
                        color: isViolation ? '#dc2626' : '#4b5563',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <GoogleIcon
                        name={
                          n.type === 'Policy Violation'
                            ? 'warning'
                            : n.type === 'Status Update'
                            ? 'update'
                            : 'notifications'
                        }
                        size={20}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.2rem'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            color: isViolation ? '#b91c1c' : '#111827'
                          }}
                        >
                          {n.type || 'Notice'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{n.time || 'Recently'}</span>
                      </div>

                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.825rem',
                          color: isViolation ? '#991b1b' : '#4b5563',
                          lineHeight: 1.45
                        }}
                      >
                        {n.message}
                      </p>

                      {n.referenceId && (
                        <span
                          style={{
                            display: 'inline-block',
                            marginTop: '0.4rem',
                            fontSize: '0.72rem',
                            fontFamily: 'monospace',
                            backgroundColor: isViolation ? '#fee2e2' : '#f3f4f6',
                            color: isViolation ? '#991b1b' : '#6b7280',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}
                        >
                          Ref: {n.referenceId}
                        </span>
                      )}
                    </div>

                    {/* Dismiss single item */}
                    {onClearNotification && (
                      <button
                        onClick={() => onClearNotification(n.id)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          padding: '2px',
                          borderRadius: '4px'
                        }}
                        aria-label="Dismiss notification"
                      >
                        <GoogleIcon name="close" size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
