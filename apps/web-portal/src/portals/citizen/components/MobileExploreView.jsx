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

const STITCH_MOBILE_POSTS = [
  {
    id: 'mobile-post-1',
    authorName: 'Sarah Jenkins',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBctzw8sp_k8x45dON6iiZfMoBkhsSTrsItsDSl41PlSllQsb7D7Ua9ii12fvjgEDlgjpl0mJHZSnsMrBm8d1Wob4cqwVayGh20tOPHYguB4-SvqLou9IHmwgvdgKch-8k46KCNFmViaFgXbWoGT8nB0amtA2MPgxetmbRp_n3dWllHsAHicKMXw55ZYtMPwGeoxBnHUjZChhVWPIN5BDFaK387sjTCf0XStFXIlhkbpfYw-ZPv59qUHg',
    authorInitials: 'SJ',
    timeAgo: '2h ago',
    content:
      'The new community garden in Sector 4 is coming along nicely! Thanks to everyone who volunteered this weekend. 🌱',
    tags: ['#Sector4Garden', '#CleanCityInitiative'],
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHLgpa6w9Mc0xb0uRDCltnA57316hNCEx8m2gsDYU9dYGL8jHTe1Fx_VJe0ofiXkjfDINb8H6KhvIOUGi0CE2-F2bEf-JEP-k-mjv4lJBZ_CIkhP-SZZvBh1QIMMy9thuAXqS9HmskDhdKjrzsbeBEQ7rV5-C__8tiu2AAp0E_nbY8ixzoMvebKxizup9W0CieQrAGS8iIsY73h5sgK3k5lhJlWRischfnoQRJUVOAKbagxw8ui-0oXw',
        caption: 'Promenade Walk'
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwOdSVlaviBH80UBoIZxQyH09PA24NZxOtxaijvNTITzuIm0cnKHgJLKS7ZBN9CQ7GjrX9wNMj3Mxnelg9HY7Bg-jIlfORB-2N1cU4d7qC5N-VnAoz6KqeFnfA2aAOF56xWkBxkSM4KuNJxxCWi2qF9ryuZHg0jo2Gy2R8rM15m3mlKNBLRvXHXxgTkJSMdn9CQc-hYPWeKa5XvrnMhiQu0z1ZpkYEwndMeQ5w4xh5lW6rZ_3JHwVNqA',
        caption: 'Volunteer Drive'
      }
    ],
    likes: 124,
    shares: 9
  },
  {
    id: 'mobile-post-2',
    authorName: 'Mike Kumar',
    authorAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDc2UiFo6S9Napd9Pq1woWNpJ74ngdi76i5YdD6jNBTshxR_R3VmAzVywaJXsTXIN0QAfybNnDUZyGvkpKn2mRRei8QOj-Z4F5X_wvfBADG54xXO1dm1HttLGV48R18D3QD_XQaASjfadAfRP56yis0lS2n0ypXQCP6zYDrDc8YDmkm1qYAG6XD7MstLP5PlQSLFEXaAztc7eieG0wLADNm2LI80eB07B9dGhN1vbQNyWtLGFBjNJYQng',
    authorInitials: 'MK',
    timeAgo: '4h ago',
    content:
      'Just submitted a verification check on the deep asphalt depression near 7th Ave crosswalk. Road maintenance team came out at 9:00 AM and resurfaced the entire 12-meter stretch.',
    tags: ['#PotholeRepair', '#7thAvenue'],
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
    likes: 45,
    shares: 4
  },
  {
    id: 'mobile-post-3',
    authorName: 'City Parks Dept',
    authorAvatar: null,
    authorInitials: 'CP',
    timeAgo: '1d ago',
    content:
      'Update on the Riverside Park renovation project. Phase 1 is complete! Check out the new walkways and ambient solar seating areas.',
    tags: ['#RiversideRenovation', '#PublicSpaces'],
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida/AEtjO1XamjKI0u4wiLQqbdwIjka3AUunHLyO5VUGIt-_sfI6vEgqbtRUT49D8SONBV1ygAhoLHjL9GRocWXSlc32S88GvnNoVMoR4SKJ47C_k_Xr_mC-yUbq-2nJNfPFlS-UUMXp7gxVln36z80KYaQ7KFwvLEhJh-wD_DbEGL8qKyViXPOA45OyqWIttGNuY8Fw97uZ3m6LLPDGVv4A2bAsa5OwexUT4DBznN6OrpfjcPCDR0xRwjORXc13dqLz',
        caption: 'Riverside Walkway'
      }
    ],
    likes: 312,
    shares: 18
  }
];

const MobileMediaCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        backgroundColor: '#e2e2e2',
        marginTop: '0.35rem'
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
              top: '0.625rem',
              right: '0.625rem',
              fontSize: '0.6875rem',
              fontWeight: '600',
              padding: '0.2rem 0.55rem',
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
                left: '0.625rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                opacity: isHovered ? 1 : 0.88,
                border: 'none',
                boxShadow: 'none'
              }}
              aria-label="Previous"
            >
              <GoogleIcon name="chevron_left" size={20} color="#ffffff" />
            </button>
          )}

          {/* Right ">" Button - only if not on last image */}
          {currentIndex < total - 1 && (
            <button
              onClick={handleNext}
              className="apple-glossy-black"
              style={{
                position: 'absolute',
                right: '0.625rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                opacity: isHovered ? 1 : 0.88,
                border: 'none',
                boxShadow: 'none'
              }}
              aria-label="Next"
            >
              <GoogleIcon name="chevron_right" size={20} color="#ffffff" />
            </button>
          )}

          {/* Pagination Dots - 2D Flat */}
          <div
            className="apple-glossy-tag"
            style={{
              position: 'absolute',
              bottom: '0.625rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              zIndex: 10,
              padding: '0.2rem 0.5rem',
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
                  width: idx === currentIndex ? '12px' : '5px',
                  height: '5px',
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
            bottom: '0.625rem',
            left: '0.625rem',
            padding: '0.25rem 0.55rem',
            borderRadius: '0.375rem',
            fontSize: '0.6875rem',
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

export const MobileExploreView = ({
  onOpenTara,
  onOpenIssueDetail,
  activeNav,
  setActiveNav,
  userName = 'Rampal',
  hideNav = false
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
      {/* 1. Top App Bar - Strictly 'Explore', messages icon removed as requested */}
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
          justifyContent: 'flex-start',
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
          Explore
        </h1>
      </header>

      {/* 2. Community Feed of Posts */}
      <main
        className="apple-page-enter"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: hideNav ? '1rem' : '80px',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {STITCH_MOBILE_POSTS.map((post) => {
            const isLiked = likedPosts.has(post.id);
            const isBookmarked = bookmarkedPosts.has(post.id);
            const currentLikes = post.likes + (isLiked ? 1 : 0);

            return (
              <article
                key={post.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#e2e2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1a1c1c',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}
                    >
                      {post.authorAvatar ? (
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span>{post.authorInitials}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#1a1c1c' }}>
                        {post.authorName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7e7576' }}>{post.timeAgo}</div>
                    </div>
                  </div>

                  <button
                    className="apple-tap"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#7e7576',
                      padding: '0.25rem'
                    }}
                  >
                    <GoogleIcon name="more_horiz" size={20} color="#7e7576" />
                  </button>
                </div>

                {/* Content */}
                <p style={{ fontSize: '0.875rem', color: '#1a1c1c', lineHeight: 1.5, margin: 0 }}>
                  {post.content}
                </p>

                {/* Topic Tags */}
                {post.tags && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: '600',
                          color: '#4c4546',
                          backgroundColor: '#f3f3f3',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.25rem'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Media Carousel */}
                <MobileMediaCarousel images={post.images} />

                {/* Actions Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    marginTop: '0.375rem',
                    paddingTop: '0.625rem',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className="apple-metric-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: isLiked ? '#000000' : '#4c4546',
                      fontWeight: isLiked ? '700' : '500',
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.3rem',
                      borderRadius: '0.375rem'
                    }}
                  >
                    <span className="apple-icon-push">
                      <GoogleIcon
                        name="thumb_up"
                        size={18}
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
                      gap: '0.35rem',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#4c4546',
                      fontWeight: '500',
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.3rem',
                      borderRadius: '0.375rem'
                    }}
                  >
                    <span className="apple-icon-push">
                      <GoogleIcon name="share" size={18} color="#4c4546" />
                    </span>
                    <span>{post.shares}</span>
                  </button>

                  {/* Custom Bookmark Icon */}
                  <button
                    onClick={() => handleToggleBookmark(post.id)}
                    className="apple-metric-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: 'auto',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                  >
                    <span className="apple-icon-push">
                      <BookmarkIcon isBookmarked={isBookmarked} size={20} />
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* 3. Fallback standalone bottom nav if hideNav is false */}
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
            >
              <GoogleIcon name="add" size={28} color="#ffffff" />
            </button>

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
            </button>

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
