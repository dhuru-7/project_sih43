import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useLanguage } from '../../../context/LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// High-quality category fallback imagery
const CATEGORY_FALLBACK_IMAGES = {
  'Urban Development and Infrastructure': 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80',
  'Sanitation and Waste Management': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80',
  'Water Resources and Sanitation': 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&q=80',
  'Roads and Public Works': 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80',
  'Public Administration and Governance': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  'Electricity and Energy': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
  'Environment and Pollution': 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80',
  'Public Safety and Law Enforcement': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80'
};
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80';

/* ─────────────────────────────────────────────
 *  Full-Screen Media Lightbox
 * ───────────────────────────────────────────── */
const MediaLightboxModal = ({ isOpen, mediaList = [], initialIndex = 0, title = '', onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => { setCurrentIndex(initialIndex); }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((p) => (p < mediaList.length - 1 ? p + 1 : 0));
      if (e.key === 'ArrowLeft') setCurrentIndex((p) => (p > 0 ? p - 1 : mediaList.length - 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, currentIndex, mediaList.length]);

  if (!isOpen || mediaList.length === 0) return null;

  const currentMedia = mediaList[currentIndex] || mediaList[0];
  const isVideo =
    currentMedia?.type === 'video' ||
    currentMedia?.url?.includes('video') ||
    currentMedia?.url?.endsWith('.mp4') ||
    currentMedia?.url?.endsWith('.webm');

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999999,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        color: '#ffffff', animation: 'applePop 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Header */}
      <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.12)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: '700', padding: '4px 10px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.18)', color: '#fff', letterSpacing: '0.02em' }}>
            {currentIndex + 1} of {mediaList.length}
          </span>
          <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#e5e5ea', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </span>
        </div>
        <button onClick={onClose} className="apple-tap" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Close">
          <GoogleIcon name="close" size={22} color="#ffffff" />
        </button>
      </div>

      {/* Viewport */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflow: 'hidden' }}>
        {mediaList.length > 1 && (
          <button onClick={() => setCurrentIndex((p) => (p > 0 ? p - 1 : mediaList.length - 1))} className="apple-tap" style={{ position: 'absolute', left: '20px', zIndex: 20, width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Previous">
            <GoogleIcon name="chevron_left" size={28} color="#ffffff" />
          </button>
        )}

        <div style={{ maxWidth: '92vw', maxHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', overflow: 'hidden' }}>
          {isVideo ? (
            <video src={currentMedia.url} controls autoPlay playsInline style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '16px', outline: 'none', backgroundColor: '#000' }} />
          ) : (
            <img src={currentMedia.url} alt="Evidence" style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 12px 48px rgba(0,0,0,0.6)' }} onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }} />
          )}
        </div>

        {mediaList.length > 1 && (
          <button onClick={() => setCurrentIndex((p) => (p < mediaList.length - 1 ? p + 1 : 0))} className="apple-tap" style={{ position: 'absolute', right: '20px', zIndex: 20, width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Next">
            <GoogleIcon name="chevron_right" size={28} color="#ffffff" />
          </button>
        )}
      </div>

      {/* Thumbnail Film Strip */}
      {mediaList.length > 1 && (
        <div style={{ padding: '16px 24px 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', overflowX: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {mediaList.map((m, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="apple-tap"
              style={{
                width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                border: idx === currentIndex ? '2.5px solid #0071e3' : '2px solid transparent',
                opacity: idx === currentIndex ? 1 : 0.6,
                transform: idx === currentIndex ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.2s ease', flexShrink: 0, backgroundColor: '#1c1c1e', position: 'relative'
              }}
            >
              <img src={m.url} alt={`Thumb ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }} />
              {(m.type === 'video' || m.url?.includes('video')) && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GoogleIcon name="play_arrow" size={16} color="#ffffff" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
};

/* ─────────────────────────────────────────────
 *  Apple‑Grade Submission Card
 * ───────────────────────────────────────────── */
const SubmissionCard = React.forwardRef(({ sub, isHighlighted, onOpenMediaPreview }, ref) => {
  const { t } = useLanguage();
  const [expandedDesc, setExpandedDesc] = useState(false);

  const mediaList = useMemo(() => {
    const list = [];
    if (Array.isArray(sub.evidenceUrls) && sub.evidenceUrls.length > 0) {
      sub.evidenceUrls.forEach((u) => {
        if (typeof u === 'string' && u.trim()) {
          list.push({ url: u, type: u.includes('video') || u.endsWith('.mp4') || u.endsWith('.webm') ? 'video' : 'image' });
        } else if (u && typeof u === 'object' && u.url) {
          list.push(u);
        }
      });
    }
    if (list.length === 0) {
      const fallback = sub.thumbnail || sub.image;
      if (fallback) {
        list.push({ url: fallback, type: fallback.includes('video') || fallback.endsWith('.mp4') || fallback.endsWith('.webm') ? 'video' : 'image' });
      }
    }
    return list;
  }, [sub]);

  const fallbackImage = CATEGORY_FALLBACK_IMAGES[sub.category] || DEFAULT_IMAGE;

  const formattedDate = useMemo(() => {
    if (!sub.created_at) return t('recently', 'Recently');
    try {
      const d = new Date(sub.created_at);
      if (isNaN(d.getTime())) return sub.created_at;
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return sub.created_at; }
  }, [sub.created_at, t]);

  const severityColor = useMemo(() => {
    const sev = (sub.severity || 'MEDIUM').toUpperCase();
    if (sev === 'CRITICAL' || sev === 'HIGH') return { dot: '#ef4444', text: '#b91c1c', label: sev };
    if (sev === 'LOW') return { dot: '#22c55e', text: '#15803d', label: 'LOW' };
    return { dot: '#f59e0b', text: '#b45309', label: 'MEDIUM' };
  }, [sub.severity]);

  const desc = sub.description || '';
  const isLongDesc = desc.length > 200;
  const displayDesc = expandedDesc || !isLongDesc ? desc : `${desc.slice(0, 200)}...`;

  return (
    <div
      ref={ref}
      id={`submission-${sub.id}`}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: isHighlighted ? '2px solid #0071e3' : '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: isHighlighted
          ? '0 0 0 4px rgba(0, 113, 227, 0.12), 0 8px 32px rgba(0, 0, 0, 0.08)'
          : '0 2px 12px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        animation: isHighlighted ? 'cardPulse 1.5s ease-out' : 'none'
      }}
    >
      {/* ─── Media Section ─── */}
      {mediaList.length > 0 && (
        <div style={{ position: 'relative' }}>
          {mediaList.length === 1 ? (
            <div
              onClick={() => onOpenMediaPreview(mediaList, 0, sub.title)}
              className="apple-tap"
              style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#f2f2f7' }}
            >
              {mediaList[0].type === 'video' ? (
                <>
                  <video src={mediaList[0].url} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
                      <GoogleIcon name="play_arrow" size={28} color="#000000" />
                    </div>
                  </div>
                </>
              ) : (
                <img src={mediaList[0].url} alt={sub.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = fallbackImage; }} />
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '2px', overflow: 'hidden', height: '200px' }}>
              {/* Large hero image */}
              <div
                onClick={() => onOpenMediaPreview(mediaList, 0, sub.title)}
                className="apple-tap"
                style={{ flex: '1 1 60%', position: 'relative', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#f2f2f7' }}
              >
                {mediaList[0].type === 'video' ? (
                  <>
                    <video src={mediaList[0].url} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <GoogleIcon name="play_arrow" size={22} color="#000" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img src={mediaList[0].url} alt={sub.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = fallbackImage; }} />
                )}
              </div>
              {/* Side thumbnails */}
              <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {mediaList.slice(1, 3).map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => onOpenMediaPreview(mediaList, idx + 1, sub.title)}
                    className="apple-tap"
                    style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#f2f2f7' }}
                  >
                    {m.type === 'video' ? (
                      <>
                        <video src={m.url} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <GoogleIcon name="play_arrow" size={18} color="#fff" />
                        </div>
                      </>
                    ) : (
                      <img src={m.url} alt={`Evidence ${idx + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = fallbackImage; }} />
                    )}
                    {/* "+N more" badge on last visible thumbnail */}
                    {idx === 1 && mediaList.length > 3 && (
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: '1rem', fontWeight: '700' }}>+{mediaList.length - 3}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Content Body ─── */}
      <div style={{ padding: '20px 22px 18px' }}>
        {/* Title */}
        <h2 style={{
          fontSize: '1.125rem', fontWeight: '700', color: '#000000', margin: '0 0 8px 0',
          lineHeight: 1.35, letterSpacing: '-0.02em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif'
        }}>
          {sub.title === 'Unverified Media Evidence Submitted'
            ? t('unverified_media_title', 'Unverified Media Evidence Submitted')
            : sub.title === 'Visual civic problem reported by citizen.' || sub.title === 'Visual civic problem reported by citizen'
            ? t('visual_problem_reported_title', 'Visual civic problem reported by citizen.')
            : (sub.title || t('unverified_media_title', 'Unverified Media Evidence Submitted'))}
        </h2>

        {/* Meta row: Category · Severity · Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {sub.category && (
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1d4ed8', backgroundColor: '#eff6ff', padding: '3px 10px', borderRadius: '9999px' }}>
              {sub.category}
            </span>
          )}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', fontWeight: '700', color: severityColor.text }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: severityColor.dot }} />
            {severityColor.label}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#8e8e93' }}>·</span>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{formattedDate}</span>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8125rem', color: '#374151', marginBottom: '12px' }}>
          <GoogleIcon name="location_on" size={15} color="#e11d48" />
          <span style={{ fontWeight: '500' }}>{sub.villageCity || sub.district || sub.address || 'Ranchi, Jharkhand'}</span>
        </div>

        {/* Description */}
        {desc && (
          <div style={{ marginBottom: '14px' }}>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#4b5563', margin: 0, whiteSpace: 'pre-wrap' }}>
              {displayDesc}
            </p>
            {isLongDesc && (
              <button
                onClick={() => setExpandedDesc((p) => !p)}
                style={{ marginTop: '4px', padding: 0, background: 'none', border: 'none', color: '#0071e3', fontSize: '0.8125rem', fontWeight: '600', cursor: 'pointer' }}
              >
                {expandedDesc ? t('show_less', 'Show less') : t('read_more', 'Read more')}
              </button>
            )}
          </div>
        )}

        {/* Impact strip */}
        {(sub.impactCount || sub.impactDescription) && (
          <div style={{
            padding: '10px 14px', borderRadius: '12px', backgroundColor: '#f0fdf4',
            border: '1px solid rgba(22, 163, 74, 0.12)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'
          }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GoogleIcon name="groups" size={16} color="#15803d" />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#15803d' }}>{sub.impactCount || 'Community Impact'}</div>
              {sub.impactDescription && <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '1px' }}>{sub.impactDescription}</div>}
            </div>
          </div>
        )}
      </div>

      {/* ─── Footer: ID + Status ─── */}
      <div style={{
        padding: '12px 22px', borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fafafa',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{
          fontSize: '0.75rem', fontWeight: '700', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          color: '#6b7280', letterSpacing: '0.01em'
        }}>
          {sub.id}
        </span>
        <span style={{
          fontSize: '0.6875rem', fontWeight: '600', color: '#6e6e73',
          display: 'inline-flex', alignItems: 'center', gap: '4px'
        }}>
          <GoogleIcon name="verified_user" size={13} color="#10b981" />
          <span>{sub.status || 'SUBMITTED'}</span>
        </span>
      </div>
    </div>
  );
});

SubmissionCard.displayName = 'SubmissionCard';

/* ─────────────────────────────────────────────
 *  My Submissions Page
 * ───────────────────────────────────────────── */
export const MySubmissionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const cardRefs = useRef({});

  // Lightbox state
  const [lightboxState, setLightboxState] = useState({ isOpen: false, mediaList: [], initialIndex: 0, title: '' });

  // Route safeguard: unverified visitors cannot access submissions
  useEffect(() => {
    const isOnboarded = localStorage.getItem('setu_onboarded') === 'true';
    const hasUserData = Boolean(
      localStorage.getItem('setu_user') || localStorage.getItem('sih_user_data')
    );
    if (!isOnboarded || !hasUserData) {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate]);

  // Read highlight param from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hId = params.get('highlight');
    if (hId) {
      setHighlightedId(hId);
      // Clean up the URL without re-rendering
      window.history.replaceState({}, '', '/my-submissions');
    }
  }, [location.search]);

  // Fetch data
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const resp = await fetch(`${API_BASE_URL}/problems`);
        if (resp.ok) {
          const json = await resp.json();
          setSubmissions(json.data || []);
        }
      } catch (err) {
        console.warn('Failed to load user submissions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  // Scroll to highlighted card after data loads
  useEffect(() => {
    if (!highlightedId || loading || submissions.length === 0) return;
    const timeout = setTimeout(() => {
      const el = cardRefs.current[highlightedId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Auto-clear highlight after animation
        setTimeout(() => setHighlightedId(null), 2500);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [highlightedId, loading, submissions]);

  const handleOpenMediaPreview = (mediaList, initialIndex, title) => {
    setLightboxState({ isOpen: true, mediaList, initialIndex, title });
  };

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => {
      navigate(-1);
    }, 280);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        animation: isClosing
          ? 'appleSlideOutRight 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          : 'appleSlideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
        overflowX: 'hidden'
      }}
    >
      {/* Inject highlight animation keyframes */}
      <style>{`
        @keyframes cardPulse {
          0% { box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.25), 0 8px 32px rgba(0, 0, 0, 0.08); }
          50% { box-shadow: 0 0 0 8px rgba(0, 113, 227, 0.15), 0 8px 32px rgba(0, 0, 0, 0.08); }
          100% { box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.12), 0 8px 32px rgba(0, 0, 0, 0.08); }
        }
      `}</style>

      {/* ─── Header ─── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <button
          onClick={handleBack}
          className="apple-tap"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
          aria-label="Back"
        >
          <GoogleIcon name="chevron_left" size={24} color="#1a1c1c" />
        </button>
        <h1
          style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#1a1c1c',
            margin: 0,
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif'
          }}
        >
          {t('my_submissions', 'My Submissions')}
        </h1>
      </header>

      {/* ─── Content ─── */}
      <main style={{
        maxWidth: '680px', width: '100%', margin: '0 auto',
        padding: '20px 16px 60px 16px', boxSizing: 'border-box'
      }}>
        {loading ? (
          <div style={{ padding: '80px 20px', textAlign: 'center', color: '#8e8e93', fontSize: '0.9375rem' }}>
            {t('loading_submissions', 'Loading your submissions...')}
          </div>
        ) : submissions.length === 0 ? (
          <div style={{
            padding: '64px 24px', textAlign: 'center', backgroundColor: '#fff',
            borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
            marginTop: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f2f2f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GoogleIcon name="assignment" size={28} color="#8e8e93" />
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', margin: 0, color: '#1c1c1e' }}>{t('no_submissions_yet', 'No Submissions Yet')}</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {submissions.map((sub) => (
              <SubmissionCard
                key={sub.id}
                ref={(el) => { cardRefs.current[sub.id] = el; }}
                sub={sub}
                isHighlighted={highlightedId === sub.id}
                onOpenMediaPreview={handleOpenMediaPreview}
              />
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      <MediaLightboxModal
        isOpen={lightboxState.isOpen}
        mediaList={lightboxState.mediaList}
        initialIndex={lightboxState.initialIndex}
        title={lightboxState.title}
        onClose={() => setLightboxState((p) => ({ ...p, isOpen: false }))}
      />
    </div>
  );
};
