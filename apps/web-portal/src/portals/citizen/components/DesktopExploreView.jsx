import React, { useState } from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

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

const STITCH_EXPLORE_POSTS = [
  {
    id: 'post-1',
    authorName: 'Sarah Jenkins',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBctzw8sp_k8x45dON6iiZfMoBkhsSTrsItsDSl41PlSllQsb7D7Ua9ii12fvjgEDlgjpl0mJHZSnsMrBm8d1Wob4cqwVayGh20tOPHYguB4-SvqLou9IHmwgvdgKch-8k46KCNFmViaFgXbWoGT8nB0amtA2MPgxetmbRp_n3dWllHsAHicKMXw55ZYtMPwGeoxBnHUjZChhVWPIN5BDFaK387sjTCf0XStFXIlhkbpfYw-ZPv59qUHg',
    authorInitials: 'SJ',
    timeAgo: '2h ago',
    content:
      'The revitalization of Sector 4 Central Promenade is now officially complete! We have installed 18 solar-powered luminaire bollards, replanted drought-resistant native hedges, and repaired the western walking trails. Thank you to the 142 neighborhood volunteers who assisted during weekend planting.',
    tags: ['#Sector4Garden', '#CleanCityInitiative', '#UrbanGreening'],
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHLgpa6w9Mc0xb0uRDCltnA57316hNCEx8m2gsDYU9dYGL8jHTe1Fx_VJe0ofiXkjfDINb8H6KhvIOUGi0CE2-F2bEf-JEP-k-mjv4lJBZ_CIkhP-SZZvBh1QIMMy9thuAXqS9HmskDhdKjrzsbeBEQ7rV5-C__8tiu2AAp0E_nbY8ixzoMvebKxizup9W0CieQrAGS8iIsY73h5sgK3k5lhJlWRischfnoQRJUVOAKbagxw8ui-0oXw',
        caption: 'After · Promenade Walk'
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwOdSVlaviBH80UBoIZxQyH09PA24NZxOtxaijvNTITzuIm0cnKHgJLKS7ZBN9CQ7GjrX9wNMj3Mxnelg9HY7Bg-jIlfORB-2N1cU4d7qC5N-VnAoz6KqeFnfA2aAOF56xWkBxkSM4KuNJxxCWi2qF9ryuZHg0jo2Gy2R8rM15m3mlKNBLRvXHXxgTkJSMdn9CQc-hYPWeKa5XvrnMhiQu0z1ZpkYEwndMeQ5w4xh5lW6rZ_3JHwVNqA',
        caption: 'Volunteer Drive'
      }
    ],
    likes: 248,
    shares: 19
  },
  {
    id: 'post-2',
    authorName: 'Mike Kumar',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDc2UiFo6S9Napd9Pq1woWNpJ74ngdi76i5YdD6jNBTshxR_R3VmAzVywaJXsTXIN0QAfybNnDUZyGvkpKn2mRRei8QOj-Z4F5X_wvfBADG54xXO1dm1HttLGV48R18D3QD_XQaASjfadAfRP56yis0lS2n0ypXQCP6zYDrDc8YDmkm1qYAG6XD7MstLP5PlQSLFEXaAztc7eieG0wLADNm2LI80eB07B9dGhN1vbQNyWtLGFBjNJYQng',
    authorInitials: 'MK',
    timeAgo: '4h ago',
    content:
      'Quick verification check on the deep asphalt depression near 7th Ave crosswalk. Road maintenance team came out at 9:00 AM and resurfaced the entire 12-meter stretch. Traffic is flowing smoothly again with safe pedestrian crossing lines repainted.',
    tags: ['#PotholeRepair', '#7thAvenue', '#RapidResponse'],
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChYMCFD76IfKpkc1oLApEVIAY0KrG3rOtAcom65byNUoZXXxE0A3nVB4xqv7oM3pgWz1H01WhWQmnPvAW9DYEXAxCxMOePMQwGkpwsQhMPiQxnM6O2gpPPbRFvV6D5pUSl769KU-WLOEmjcyDpUKCgklmbYugi8GNNo3mTVg-ee7MO9aBI4C3tCie_XxQ_t8Qrzg12xCdj0--yhugUwx0j7AjyuEE816vfwOfkJUESiLLTWqeROVr32Q',
        caption: 'Repaired Surface'
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnFhknnzKZ77MzM__18zi9CIQg_GZqe9Z6PzL3A1cLRHav_s_Oi96NIArTm4qPF3AWCuJ-fLos5M8DEYPGxQQbf96XnJn4JofBVB4EmRZ8wQijJiglIuOBSQ9jg1efg1HLBa2JxjB4aI0MyC_c0RCBA_xeliKoiMo_-jcJP3Rvmd7MUrOREH31T_bNReLQZWijcsZuKCL_hyH_QmDuCoe7JSHk0BZb4yYq7-e1pNLaS5S79urviGtK4A',
        caption: 'Crews at Work'
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuamkwueplMzdyfVyVcevqYRlu16KSZ1ZAO40ibKqaiozk83dTUwBjtfTAqVCJa2rFwrCdeqVo7RyRHegHV5q7CX2VSa7oTH8AvYNVpGafkyNtQDtKEbxvfkdUKH2iJgtsl4nDJU8sGqxvhnFDZdXMwb8N6_bJAaPIUv5FniBk939zWdvsPuS1gHRWhdrxGKLn75kuCaA-iD-PNCaWicXCgbBiKiWpXPdbHYNOGS-kgwPO_TIjT_JNQQ',
        caption: 'Pedestrian Line'
      }
    ],
    likes: 112,
    shares: 8
  },
  {
    id: 'post-3',
    authorName: 'City Parks Dept',
    authorAvatar: null,
    authorInitials: 'CP',
    timeAgo: '1d ago',
    content:
      'Update on the Riverside community renovation project. Phase 1 is officially complete! Check out the newly restored walkways, indigenous flora buffer zones, and ambient solar benches.',
    tags: ['#RiversideRevitalize', '#PublicSpaces', '#CivicPride'],
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida/AEtjO1XamjKI0u4wiLQqbdwIjka3AUunHLyO5VUGIt-_sfI6vEgqbtRUT49D8SONBV1ygAhoLHjL9GRocWXSlc32S88GvnNoVMoR4SKJ47C_k_Xr_mC-yUbq-2nJNfPFlS-UUMXp7gxVln36z80KYaQ7KFwvLEhJh-wD_DbEGL8qKyViXPOA45OyqWIttGNuY8Fw97uZ3m6LLPDGVv4A2bAsa5OwexUT4DBznN6OrpfjcPCDR0xRwjORXc13dqLz',
        caption: 'Riverside Walkway'
      }
    ],
    likes: 312,
    shares: 24
  }
];

const PostMediaCarousel = ({ images, isPostHovered }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const total = images.length;
  const currentImg = images[currentIndex];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => Math.min(total - 1, prev + 1));
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        backgroundColor: '#eeeeee',
        marginTop: '0.25rem'
      }}
    >
      {/* Sliding image strip */}
      <div
        style={{
          display: 'flex',
          width: `${total * 100}%`,
          height: '100%',
          transform: `translateX(-${currentIndex * (100 / total)}%)`,
          transition: 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)',
          willChange: 'transform'
        }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={img.caption || ''}
            style={{
              width: `${100 / total}%`,
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              flexShrink: 0
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
  onOpenIssueDetail,
  activeNav,
  setActiveNav,
  userName = 'Rampal'
}) => {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

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
              { id: 'home', label: 'Home', icon: 'home', badge: null },
              { id: 'explore', label: 'Explore', icon: 'explore', badge: null },
              { id: 'report', label: 'Report Issue', icon: 'add_circle', badge: null, highlight: true },
              { id: 'messages', label: 'Messages', icon: 'chat', badge: '3' }
            ].map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.id === 'report') onOpenTara();
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
                flexShrink: 0
              }}
            >
              <GoogleIcon name="person" size={18} color="#ffffff" />
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
                Ward 4
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
              Explore
            </h1>
          </section>

          {/* Main Content Layout: Feed Column (Left) + Notifications Sidebar (Right) matching Stitch */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '2rem', alignItems: 'start' }}>
            
            {/* Feed Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {STITCH_EXPLORE_POSTS.map((post) => {
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
                    Notifications
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
