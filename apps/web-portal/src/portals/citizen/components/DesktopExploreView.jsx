import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { useLanguage } from '../../../context/LanguageContext';
import { getExplorePosts } from '../data/explorePosts';

const BookmarkIcon = ({ isBookmarked, size = 22 }) => {
  if (isBookmarked) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={`${size}px`}
        viewBox="0 -960 960 960"
        width={`${size}px`}
        fill="#000000"
      >
        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={`${size}px`}
      viewBox="0 -960 960 960"
      width={`${size}px`}
      fill="#7e7576"
    >
      <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
    </svg>
  );
};

const PostMediaCarousel = ({ images, isPostHovered }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isSwipingRef = useRef(false);
  const isHorizontalGestureRef = useRef(null);
  const hasMovedRef = useRef(false);

  if (!images || images.length === 0) return null;

  const total = images.length;
  const currentImg = images[currentIndex];

  const handlePrev = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCurrentIndex((prev) => Math.min(total - 1, prev + 1));
  };

  // 1:1 Finger and Mouse Drag Handlers
  const handleStart = (clientX, clientY) => {
    if (total <= 1) return;
    touchStartRef.current = {
      x: clientX,
      y: clientY,
      time: Date.now()
    };
    isSwipingRef.current = true;
    isHorizontalGestureRef.current = null;
    hasMovedRef.current = false;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMove = (clientX, clientY, e) => {
    if (!isSwipingRef.current || total <= 1) return;

    const deltaX = clientX - touchStartRef.current.x;
    const deltaY = clientY - touchStartRef.current.y;

    if (isHorizontalGestureRef.current === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isHorizontalGestureRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalGestureRef.current) {
      if (e && e.cancelable && e.preventDefault) {
        e.preventDefault();
      }
      hasMovedRef.current = true;

      // Apple rubber-banding resistance at boundaries
      let effective = deltaX;
      if (currentIndex === 0 && deltaX > 0) {
        effective = deltaX * 0.32;
      } else if (currentIndex === total - 1 && deltaX < 0) {
        effective = deltaX * 0.32;
      }
      setDragOffset(effective);
    }
  };

  const handleEnd = () => {
    if (!isSwipingRef.current) return;
    isSwipingRef.current = false;
    setIsDragging(false);

    const elapsed = Date.now() - touchStartRef.current.time;
    const velocity = Math.abs(dragOffset) / (elapsed || 1);
    const containerWidth = containerRef.current?.offsetWidth || 400;
    const threshold = Math.max(45, containerWidth * 0.16);

    if ((dragOffset < -threshold || (dragOffset < -20 && velocity > 0.32)) && currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if ((dragOffset > threshold || (dragOffset > 20 && velocity > 0.32)) && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }

    setDragOffset(0);
    isHorizontalGestureRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY, e)}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY, e)}
      onMouseUp={handleEnd}
      onMouseLeave={() => {
        if (isSwipingRef.current) handleEnd();
      }}
      onClickCapture={(e) => {
        if (hasMovedRef.current) {
          e.stopPropagation();
        }
      }}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        backgroundColor: '#eeeeee',
        marginTop: '0.25rem',
        touchAction: 'pan-y',
        userSelect: 'none',
        cursor: total > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
      }}
    >
      {/* Sliding image strip directly tracks finger / mouse */}
      <div
        style={{
          display: 'flex',
          width: `${total * 100}%`,
          height: '100%',
          transform: `translateX(calc(-${(currentIndex * 100) / total}% + ${dragOffset}px))`,
          transition: isDragging ? 'none' : 'transform 0.32s cubic-bezier(0.23, 1, 0.32, 1)',
          willChange: 'transform'
        }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={img.caption || ''}
            draggable={false}
            style={{
              width: `${100 / total}%`,
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              flexShrink: 0,
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          />
        ))}
      </div>

      {total > 1 && (
        <>
          {/* Counter Badge: 2D Flat */}
          <div
            className="apple-glossy-tag"
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              zIndex: 10,
              pointerEvents: 'none',
              letterSpacing: '0.03em',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            {currentIndex + 1}/{total}
          </div>

          {/* Left "<" Button - only if not on first image */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="apple-glossy-black"
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                opacity: isPostHovered ? 1 : 0,
                pointerEvents: isPostHovered ? 'auto' : 'none',
                border: 'none',
                boxShadow: 'none'
              }}
              aria-label="Previous image"
            >
              <GoogleIcon name="chevron_left" size={22} color="#ffffff" />
            </button>
          )}

          {/* Right ">" Button - only if not on last image */}
          {currentIndex < total - 1 && (
            <button
              onClick={handleNext}
              className="apple-glossy-black"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                opacity: isPostHovered ? 1 : 0,
                pointerEvents: isPostHovered ? 'auto' : 'none',
                border: 'none',
                boxShadow: 'none'
              }}
              aria-label="Next image"
            >
              <GoogleIcon name="chevron_right" size={22} color="#ffffff" />
            </button>
          )}

          {/* Pagination Dots - 2D Flat */}
          <div
            className="apple-glossy-tag"
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              zIndex: 10,
              padding: '0.25rem 0.55rem',
              borderRadius: '9999px',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                style={{
                  width: idx === currentIndex ? '14px' : '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor: idx === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  boxShadow: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Caption Tag - Aligned strictly to bottom-left of the image, 2D Flat */}
      {currentImg.caption && (
        <div
          className="apple-glossy-tag"
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.75rem',
            padding: '0.3rem 0.65rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            letterSpacing: '0.01em',
            zIndex: 9,
            border: 'none',
            boxShadow: 'none'
          }}
        >
          {currentImg.caption}
        </div>
      )}
    </div>
  );
};

const DesktopPostCard = ({ post, isLiked, isBookmarked, onToggleLike, onToggleBookmark }) => {
  const [isHovered, setIsHovered] = useState(false);
  const currentLikes = post.likes + (isLiked ? 1 : 0);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'box-shadow 0.2s ease'
      }}
    >
      {/* Author Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#e8e8e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '0.875rem',
              flexShrink: 0,
              overflow: 'hidden'
            }}
          >
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ color: '#1a1c1c' }}>{post.authorInitials}</span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1a1c1c' }}>
              {post.authorName}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#5e5e5e' }}>
              {post.timeAgo}
            </span>
          </div>
        </div>

        <button
          className="apple-tap"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#7e7576',
            padding: '0.25rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <GoogleIcon name="more_horiz" size={20} color="#7e7576" />
        </button>
      </div>

      {/* Post Content */}
      <p style={{ fontSize: '0.9375rem', color: '#1a1c1c', lineHeight: 1.55, margin: 0 }}>
        {post.content}
      </p>

      {/* Topic Tags */}
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '0.375rem',
                backgroundColor: '#eeeeee',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#4c4546'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Media Carousel with hover '<' '>' and dots */}
      <PostMediaCarousel images={post.images} isPostHovered={isHovered} />

      {/* Metric Bar / Card Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => onToggleLike(post.id)}
            className="apple-metric-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: isLiked ? '#000000' : '#4c4546',
              fontWeight: isLiked ? '700' : '500',
              fontSize: '0.75rem',
              padding: '0.25rem 0.35rem',
              borderRadius: '0.375rem'
            }}
          >
            <span className="apple-icon-push">
              <GoogleIcon
                name="thumb_up"
                size={20}
                fill={isLiked}
                color={isLiked ? '#000000' : '#4c4546'}
              />
            </span>
            <span>{currentLikes}</span>
          </button>

          <button
            className="apple-metric-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#4c4546',
              fontWeight: '500',
              fontSize: '0.75rem',
              padding: '0.25rem 0.35rem',
              borderRadius: '0.375rem'
            }}
          >
            <span className="apple-icon-push">
              <GoogleIcon name="share" size={20} color="#4c4546" />
            </span>
            <span>{post.shares}</span>
          </button>
        </div>

        {/* Custom Bookmark Icon */}
        <button
          onClick={() => onToggleBookmark(post.id)}
          className="apple-metric-btn"
          title="Bookmark"
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span className="apple-icon-push">
            <BookmarkIcon isBookmarked={isBookmarked} size={22} />
          </span>
        </button>
      </div>
    </article>
  );
};

export const DesktopExploreView = ({
  onOpenTara,
  onOpenReport,
  onOpenIssueDetail,
  activeNav,
  setActiveNav,
  userName = 'Rampal'
}) => {
  const { t, currentLanguage } = useLanguage();
  const posts = useMemo(() => getExplorePosts(currentLanguage, false), [currentLanguage]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

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

  const handleToggleLike = (postId) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const handleToggleBookmark = (postId) => {
    setBookmarkedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f9f9f9', color: '#1a1c1c' }}>
      {/* 1. Left Persistent Expanded Sidemenu (Stitch Standard) */}
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
              { id: 'home', label: t('nav_home', 'Home'), icon: 'home', badge: null },
              { id: 'explore', label: t('nav_explore', 'Explore'), icon: 'explore', badge: null },
              { id: 'report', label: t('nav_report', 'Report Issue'), icon: 'add_circle', badge: null, highlight: true },
              { id: 'messages', label: t('nav_messages', 'Messages'), icon: 'chat', badge: '3' }
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
                overflow: 'hidden'
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

      {/* 2. Main Content Canvas */}
      <div style={{ flex: 1, marginLeft: '256px', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: 'calc(100% - 256px)' }}>
        <main className="apple-page-enter" style={{ padding: '2.5rem 3.5rem 4rem 3.5rem', width: '100%', maxWidth: '1160px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Header - Strictly "Explore" */}
          <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em', color: '#1a1c1c', margin: 0, lineHeight: 1.15 }}>
              {t('nav_explore', 'Explore')}
            </h1>
          </section>

          {/* Main Content Layout: Feed Column (Left) + Notifications Sidebar (Right) matching Stitch */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '2rem', alignItems: 'start' }}>
            
            {/* Feed Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {posts.map((post) => {
                const isLiked = likedPosts.has(post.id);
                const isBookmarked = bookmarkedPosts.has(post.id);

                return (
                  <DesktopPostCard
                    key={post.id}
                    post={post}
                    isLiked={isLiked}
                    isBookmarked={isBookmarked}
                    onToggleLike={handleToggleLike}
                    onToggleBookmark={handleToggleBookmark}
                  />
                );
              })}
            </div>

            {/* Right-Hand Desktop Sidebar matching Stitch */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 8px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a1c1c', margin: 0 }}>
                    {t('notifications', 'Notifications')}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div
                    style={{
                      padding: '0.875rem',
                      backgroundColor: '#f3f3f3',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.45rem', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1a1c1c' }}>Status Update</span>
                        <span style={{ fontSize: '0.75rem', color: '#5e5e5e' }}>10m ago</span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#4c4546', margin: 0 }}>
                        Status updated for report <span style={{ fontWeight: '600', color: '#1a1c1c' }}>#SETU-8821</span>
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '0.875rem',
                      backgroundColor: '#f3f3f3',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.45rem', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1a1c1c' }}>Team Response</span>
                        <span style={{ fontSize: '0.75rem', color: '#5e5e5e' }}>45m ago</span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#4c4546', margin: 0 }}>
                        Field team responded to your query regarding water sample analysis.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '0.875rem',
                      backgroundColor: '#f3f3f3',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.45rem', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1a1c1c' }}>Community Advisory</span>
                        <span style={{ fontSize: '0.75rem', color: '#5e5e5e' }}>2h ago</span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#4c4546', margin: 0 }}>
                        Scheduled solar microgrid maintenance scheduled tomorrow 9 AM - 1 PM.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '0.875rem',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e2e2e2', marginTop: '0.45rem', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4c4546' }}>Community Upvote</span>
                        <span style={{ fontSize: '0.75rem', color: '#5e5e5e' }}>Yesterday</span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#4c4546', margin: 0 }}>
                        14 residents confirmed and upvoted your recent submission.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveNav('messages')}
                  className="apple-tap"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.625rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#eeeeee',
                    color: '#1a1c1c',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    marginTop: '0.5rem'
                  }}
                >
                  View All Notifications
                </button>
              </div>
            </aside>

          </div>
        </main>
      </div>
    </div>
  );
};
