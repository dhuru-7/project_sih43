import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoogleIcon } from '../components/ui/GoogleIcon';
import { triggerHaptic } from '../utils/haptics';
import '../styles/landing.css';

export const LandingPage = () => {
  // Walkthrough Scroll Progress & Step State (Ref-optimized for 120 FPS with zero scroll jank)
  const walkthroughRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0); // 0, 1, 2, 3
  const activeStepRef = useRef(0);
  const phoneFrameRef = useRef(null);

  // Refs for Smooth Card Pull, Expanding/Un-rounding & Haptic Snap
  const slideSlotRefs = useRef([]);
  const slideCardRefs = useRef([]);
  const snappedState = useRef({});
  const pullingState = useRef({});
  const stackContainerRef = useRef(null);
  const lastSlideTransitionTime = useRef(0);

  // Refs for Curved SVG Separator
  const curvePathRef = useRef(null);
  const curveStrokeRef = useRef(null);

  // The 5 Ground-Truth Stacking Cards (Clean Fullscreen Showcase)
  const STACK_CARDS = [
    {
      id: 'rural',
      caption: 'Rural infrastructure & development',
      description: 'Damaged culverts, unpaved village roads, and severed supply chains that isolate communities during monsoons.',
      image: '/issues/rural-infrastructure.png'
    },
    {
      id: 'water',
      caption: 'Water pollution & sanitation',
      description: 'Contaminated community water sources, broken handpumps, and industrial runoff documented by local residents.',
      image: '/issues/water-pollution.png'
    },
    {
      id: 'crop',
      caption: 'Crop health & livelihoods',
      description: 'Severe agricultural pest blights and unseasonal crop damage clustered into unified regional priority matrices.',
      image: '/issues/crop-health.png'
    },
    {
      id: 'research',
      caption: 'Ideas become research',
      description: 'Engineering colleges and university labs adopting vetted citizen problems as funded capstone R&D challenges.',
      image: '/issues/ideas-research.png'
    },
    {
      id: 'prototypes',
      caption: 'Research becomes prototypes',
      description: 'Field-tested physical prototypes validated by municipal departments and scaled with corporate CSR funding.',
      image: '/issues/research-prototypes.png'
    }
  ];

  // The 4 Reporting Flow Pages mapped to User's authentic Screenshots
  const WALKTHROUGH_STEPS = [
    {
      id: 'lang',
      chip: 'Language',
      heading: 'Speak in the language you live in.',
      screenshot: '/screenshots/mobile-language.png',
      bullets: [
        "Multilingual by design — choose the language you're most comfortable with.",
        'Speak naturally — no need to translate or write formal complaints.',
        'Built for local voices — designed for Indian languages and dialects.'
      ]
    },
    {
      id: 'report',
      chip: 'Report / Capture',
      heading: 'See a problem. Report it in seconds.',
      screenshot: '/screenshots/mobile-home.png',
      bullets: [
        'Capture what you see — record a video, take a photo or upload evidence.',
        'Tell us what happened — speak or write in your own words.',
        'No complicated forms — Setu handles the structure for you.'
      ]
    },
    {
      id: 'review',
      chip: 'Review / Triage',
      heading: 'Tara turns your words into a complete report.',
      screenshot: '/screenshots/mobile-review.png',
      bullets: [
        'Understands the submission — text, voice, images and video.',
        'Structures the challenge — title, category, severity, urgency and description.',
        'You stay in control — review the generated report before submitting.'
      ]
    },
    {
      id: 'explore',
      chip: 'Explore',
      heading: 'Discover local initiatives and solutions.',
      screenshot: '/screenshots/mobile-explore.png',
      bullets: [
        'Discover local initiatives — projects, innovations and community work.',
        'Learn & stay informed — awareness campaigns, useful information and civic updates.',
        'Share solutions, not just problems — government and universities can showcase ideas and progress.'
      ]
    }
  ];

  // Deterministic 64-bubble generation for CodePen Gooey Rising Bubbles Footer
  const FOOTER_BUBBLES = Array.from({ length: 64 }, (_, i) => {
    const seed1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    const r1 = seed1 - Math.floor(seed1);
    const seed2 = Math.sin((i + 1) * 93.9898 + 67.345) * 24634.6345;
    const r2 = seed2 - Math.floor(seed2);
    const seed3 = Math.sin((i + 2) * 54.3421 + 12.876) * 65342.1245;
    const r3 = seed3 - Math.floor(seed3);
    const seed4 = Math.sin((i + 3) * 76.1234 + 43.123) * 31245.9876;
    const r4 = seed4 - Math.floor(seed4);
    const seed5 = Math.sin((i + 4) * 33.4567 + 91.234) * 87654.3211;
    const r5 = seed5 - Math.floor(seed5);

    // Calibrated smaller size and gentle distance so bubbles shimmer gracefully at footer top
    const size = (0.9 + r1 * 1.1).toFixed(2);
    const distance = (1.2 + r2 * 1.2).toFixed(2);
    const position = (-2 + r3 * 104).toFixed(2);
    const time = (2.4 + r4 * 2.2).toFixed(2);
    const delay = (-1 * (2 + r5 * 2)).toFixed(2);

    return {
      key: i,
      style: {
        '--size': `${size}rem`,
        '--distance': `${distance}rem`,
        '--position': `${position}%`,
        '--time': `${time}s`,
        '--delay': `${delay}s`
      }
    };
  });

  // Setu Ecosystem Portals (Colors from COLORS_LIBRARY.md)
  const SETU_PORTALS = [
    {
      name: '\\grass',
      title: 'Reporting Portal',
      svgIcon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      ),
      status: 'Live',
      path: '/grass',
      isLive: true,
      accentColor: '#34D399',      // Emerald / Green
      bgColor: 'rgba(52, 211, 153, 0.12)',
      badgeBg: '#064E3B',         // Deep Green
      badgeColor: '#34D399'
    },
    {
      name: '\\oak',
      title: 'Government Portal',
      svgIcon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" x2="21" y1="22" y2="22" />
          <line x1="6" x2="6" y1="11" y2="18" />
          <line x1="10" x2="10" y1="11" y2="18" />
          <line x1="14" x2="14" y1="11" y2="18" />
          <line x1="18" x2="18" y1="11" y2="18" />
          <polygon points="12 2 20 7 4 7" />
          <line x1="2" x2="22" y1="11" y2="11" />
        </svg>
      ),
      status: 'Under Development',
      path: '#',
      isLive: false,
      accentColor: '#60A5FA',      // Blue
      bgColor: 'rgba(96, 165, 250, 0.12)',
      badgeBg: 'rgba(96, 165, 250, 0.16)',
      badgeColor: '#93C5FD'
    },
    {
      name: '\\saplings',
      title: 'University Portal',
      svgIcon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      status: 'Under Development',
      path: '#',
      isLive: false,
      accentColor: '#C084FC',      // Purple
      bgColor: 'rgba(192, 132, 252, 0.12)',
      badgeBg: 'rgba(192, 132, 252, 0.16)',
      badgeColor: '#E9D5FF'
    },
    {
      name: '\\grove',
      title: 'Industry Portal',
      svgIcon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
        </svg>
      ),
      status: 'Under Development',
      path: '#',
      isLive: false,
      accentColor: '#FB923C',      // Amber / Orange
      bgColor: 'rgba(251, 146, 60, 0.12)',
      badgeBg: 'rgba(251, 146, 60, 0.16)',
      badgeColor: '#FED7AA'
    }
  ];

  const scrollToStep = (idx) => {
    setActiveStep(idx);
    triggerHaptic('click');
    if (!walkthroughRef.current) return;
    const rect = walkthroughRef.current.getBoundingClientRect();
    const totalScrollable = rect.height - window.innerHeight;
    const targetOffset = (totalScrollable * (idx + 0.1)) / WALKTHROUGH_STEPS.length;
    window.scrollTo({
      top: window.pageYOffset + rect.top + targetOffset,
      behavior: 'smooth'
    });
  };

  // Scroll Listener for Apple 5G Inspired 3D Phone Spin & Step Progression
  // High-Performance 120 FPS Compositor-Friendly VSYNC Scroll Loop
  useEffect(() => {
    let ticking = false;
    let lastScrollY = typeof window !== 'undefined' ? (window.pageYOffset || document.documentElement.scrollTop || 0) : 0;
    let scrollAccumulator = 0;

    const handleScrollEffects = () => {
      const windowH = window.innerHeight;
      const isMobile = window.innerWidth < 640;
      const unroundThreshold = Math.min(320, windowH * 0.42);

      // 0. Dynamic Curved Section Separator (Scroll-reactive flex - expanded bottom)
      if (curvePathRef.current) {
        const scrollPos = window.scrollY;
        const defaultCurveValue = 510;
        const curveRate = 3.0;
        const curveValue = Math.max(400, defaultCurveValue - scrollPos / curveRate);
        curvePathRef.current.setAttribute(
          'd',
          `M 800 460 Q 400 ${curveValue.toFixed(1)} 0 460 L 0 0 L 800 0 L 800 460 Z`
        );
        if (curveStrokeRef.current) {
          curveStrokeRef.current.setAttribute(
            'd',
            `M 0 460 Q 400 ${curveValue.toFixed(1)} 800 460`
          );
        }
      }

      // 1. Fullscreen Stack Cards Pull & Dynamic Un-rounding (Instantaneous 1:1, zero lag)
      slideSlotRefs.current.forEach((slotEl, idx) => {
        if (!slotEl) return;
        const cardEl = slideCardRefs.current[idx];
        if (!cardEl) return;

        const rect = slotEl.getBoundingClientRect();
        const top = rect.top;

        if (top <= 2) {
          // Fully covering the screen -> un-rounded (0px), 100% width, scale 1.0
          cardEl.style.borderRadius = '0px';
          cardEl.style.width = '100%';
          cardEl.style.transform = 'scale(1)';
          cardEl.style.boxShadow = 'none';

          if (!snappedState.current[idx]) {
            snappedState.current[idx] = true;
            triggerHaptic('snap');
          }
        } else {
          if (snappedState.current[idx]) {
            snappedState.current[idx] = false;
          }

          const fraction = Math.min(1, Math.max(0, top / unroundThreshold));
          const ease = fraction * fraction * (3 - 2 * fraction);

          const maxRadius = isMobile ? 20 : 36;
          const radius = Math.round(ease * maxRadius);
          const maxInsetRem = isMobile ? 0.75 : 1.75;
          const inset = (ease * maxInsetRem).toFixed(2);
          const scale = (1 - (ease * 0.035)).toFixed(4);

          // Tactile haptic feedback when card first enters un-rounding pull zone
          if (fraction < 0.95 && !pullingState.current[idx]) {
            pullingState.current[idx] = true;
            triggerHaptic('hover');
          } else if (fraction >= 0.95) {
            pullingState.current[idx] = false;
          }

          cardEl.style.borderRadius = `${radius}px`;
          cardEl.style.width = inset > 0.02 ? `calc(100% - ${inset * 2}rem)` : '100%';
          cardEl.style.transform = `scale(${scale})`;
          cardEl.style.boxShadow = '0 -16px 44px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.05)';
        }
      });

      // 2. Apple 5G Walkthrough Step & Gentle 3D Phone Gyro Transform
      const wtEl = walkthroughRef.current;
      if (wtEl) {
        const wtRect = wtEl.getBoundingClientRect();
        const totalScrollable = wtRect.height - windowH;
        if (totalScrollable > 0) {
          const rawProgress = -wtRect.top / totalScrollable;
          const progress = Math.max(0, Math.min(1, rawProgress));

          // Each step gets an equal slice for calm one-by-one progression
          const exactStep = progress * WALKTHROUGH_STEPS.length;
          const stepIdx = Math.min(WALKTHROUGH_STEPS.length - 1, Math.floor(exactStep));

          if (stepIdx !== activeStepRef.current) {
            activeStepRef.current = stepIdx;
            setActiveStep(stepIdx);
            triggerHaptic('snap');
          }

          // Gentle, natural gyro motion (subtle Apple keynote aesthetic)
          if (phoneFrameRef.current) {
            const spinAngleY = (Math.sin(progress * Math.PI * 2) * 4.5).toFixed(2);
            const spinAngleX = (Math.cos(progress * Math.PI * 1.5) * 2.0).toFixed(2);
            const spinAngleZ = ((progress - 0.5) * 1.2).toFixed(2);
            phoneFrameRef.current.style.transform = `perspective(1200px) rotateY(${spinAngleY}deg) rotateX(${spinAngleX}deg) rotateZ(${spinAngleZ}deg)`;
          }
        }
      }
    };

    const onScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      scrollAccumulator += delta;
      // Rotary jog-dial haptic feedback on scroll
      if (scrollAccumulator >= 85) {
        scrollAccumulator = 0;
        triggerHaptic('scroll');
      }

      if (!ticking) {
        requestAnimationFrame(() => {
          handleScrollEffects();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScrollEffects();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="setu-canvas setu-grid-texture">
      {/* ================================================================= */}
      {/* 1. HERO SECTION: DUAL PHOTOREALISTIC HARDWARE SHOWCASE             */}
      {/* ================================================================= */}
      <section className="setu-section setu-hero-section">
        {/* Dynamic Curved SVG Section Separator (CodePen Inspired Flexing Curve - Expanded Bottom) */}
        <div className="setu-hero-curve-container">
          <svg
            viewBox="0 0 800 520"
            preserveAspectRatio="none"
            className="setu-hero-curve-svg"
          >
            <defs>
              <linearGradient id="setuHeroCurveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0F7FA" />
                <stop offset="45%" stopColor="#E3F2FD" />
                <stop offset="100%" stopColor="#EDE7F6" />
              </linearGradient>
            </defs>
            {/* Seamless Gradient Fill from top:0 down past curve */}
            <path
              ref={curvePathRef}
              id="curve"
              fill="url(#setuHeroCurveGrad)"
              d="M 800 460 Q 400 510 0 460 L 0 0 L 800 0 L 800 460 Z"
            />
            {/* Curved bottom separator outline only (zero top/side line artifacts) */}
            <path
              ref={curveStrokeRef}
              id="curve-stroke"
              fill="none"
              stroke="rgba(34, 211, 238, 0.45)"
              strokeWidth="1.5"
              d="M 0 460 Q 400 510 800 460"
            />
          </svg>
        </div>

        <div className="setu-hero-layout">
          {/* Left Column: Punchy, Concise & Accurate Headline with Single Get Started CTA */}
          <div className="setu-hero-text-col">
            <h1 className="setu-hero-title">
              Real Problems.<br className="setu-hero-title-break" />Engineered Solutions.
            </h1>

            <p className="setu-hero-desc">
              Setu turns community challenges into university R&amp;D, government action, and working prototypes.
            </p>

            <div className="setu-hero-cta-group">
              <Link
                to="/grass"
                className="setu-btn setu-btn-primary"
                onMouseEnter={() => triggerHaptic('hover')}
                onMouseDown={() => triggerHaptic('click')}
              >
                <span>Get Started</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Dual Hardware Frame Showcase with Pixel-Perfect Aspect Ratios */}
          <div className="setu-hero-devices-col">
            <div className="setu-device-stage">
              {/* Photorealistic MacBook Pro Frame (Exact 1918x1078 Screen Ratio) */}
              <div className="setu-macbook-pro">
                <div className="setu-macbook-bezel-top">
                  <div className="setu-macbook-cam" />
                </div>
                <div className="setu-macbook-display">
                  <img
                    src="/screenshots/desktop-onboarding.png"
                    alt="Setu Web Portal Desktop"
                    className="setu-macbook-img"
                  />
                </div>
                <div className="setu-macbook-hinge" />
                <div className="setu-macbook-base">
                  <div className="setu-macbook-notch-scoop" />
                </div>
              </div>

              {/* Overlapping Smartphone Hardware Frame (Exact 385x825 Mobile Screen Ratio) */}
              <div className="setu-iphone-hero-overlap">
                <div className="setu-iphone-body">
                  <div className="setu-iphone-display">
                    <img
                      src="/screenshots/mobile-home.png"
                      alt="Setu Mobile App View"
                      className="setu-iphone-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Downsided >> Double Chevron Scroll Down Indicator */}
        <a
          href="#stack-showcase"
          className="setu-scroll-down-indicator"
          onClick={(e) => {
            e.preventDefault();
            triggerHaptic('click');
            const target = document.getElementById('stack-showcase');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          aria-label="Scroll down to explore"
        >
          <span className="setu-scroll-down-label">Scroll to explore</span>
          <div className="setu-scroll-down-chevron-wrap">
            <svg
              className="setu-scroll-down-chevron-svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="7 6 12 11 17 6" />
              <polyline points="7 13 12 18 17 13" />
            </svg>
          </div>
        </a>
      </section>

      {/* ================================================================= */}
      {/* 2. SCROLL-STACKING PHOTO SHOWCASE                                  */}
      {/* ================================================================= */}
      <div className="setu-fullscreen-stack-container" id="stack-showcase" ref={stackContainerRef}>
        {STACK_CARDS.map((card, idx) => (
          <div
            key={card.id}
            id={`stack-slide-${idx}`}
            ref={(el) => (slideSlotRefs.current[idx] = el)}
            className="setu-fullscreen-slide-slot"
            style={{
              zIndex: 10 + idx
            }}
          >
            <div
              ref={(el) => (slideCardRefs.current[idx] = el)}
              className="setu-fullscreen-slide-card"
            >
              <img
                src={card.image}
                alt={card.caption}
                className="setu-fullscreen-img"
                loading={idx === 0 ? "eager" : "lazy"}
              />

              <div className="setu-fullscreen-scrim-top" />
              <div className="setu-fullscreen-scrim-bottom" />

              <div className="setu-fullscreen-overlay">
                <div className="setu-fullscreen-text-block">
                  <h3 className="setu-fullscreen-title">
                    {card.caption}
                  </h3>
                  <p className="setu-fullscreen-desc">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================================================================= */}
      {/* 3. APPLE 5G INSPIRATION: 3D SPINNING PHONE & SLIDING UI           */}
      {/* ================================================================= */}
      <section
        className="setu-section setu-walkthrough-scroll-section"
        id="reporting-flow"
        ref={walkthroughRef}
      >
        <div className="setu-walkthrough-sticky-viewport">
          <div className="setu-walkthrough-stage-layout">
            {/* Left Column: Narrative & Bullet Points changing with scroll */}
            {/* Left Column: Narrative & Staggered Animated Bullet Points */}
            <div className="setu-walkthrough-left-col">
              <h3 className="setu-walkthrough-heading" key={`h-${activeStep}`}>
                {WALKTHROUGH_STEPS[activeStep].heading}
              </h3>

              <ul className="setu-walkthrough-bullets" key={`b-${activeStep}`}>
                {WALKTHROUGH_STEPS[activeStep].bullets.map((b, i) => {
                  const parts = b.split(' — ');
                  return (
                    <li key={i} className="setu-walkthrough-bullet-item">
                      <span className="setu-walkthrough-bullet-dot" />
                      <span>
                        {parts.length > 1 ? (
                          <>
                            <strong style={{ color: '#09090b', fontWeight: 650 }}>{parts[0]}</strong>
                            {' — '}
                            <span style={{ color: '#4b5563' }}>{parts[1]}</span>
                          </>
                        ) : (
                          b
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right Column: 3D Spinning Phone with Apple 5G Animated UI Transition */}
            <div className="setu-walkthrough-phone-col">
              <div
                ref={phoneFrameRef}
                className="setu-spinning-phone-frame"
                style={{
                  transform: 'perspective(1200px) rotateY(-4deg) rotateX(3deg) rotateZ(-1deg)'
                }}
              >
                <div className="setu-spinning-phone-screen">
                  {WALKTHROUGH_STEPS.map((step, idx) => (
                    <img
                      key={step.id}
                      src={step.screenshot}
                      alt={step.heading}
                      className={`setu-phone-ss-img ${activeStep === idx ? 'active' : ''}`}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: activeStep === idx ? 1 : 0,
                        transform: activeStep === idx ? 'scale(1)' : 'scale(1.03)',
                        transition: 'opacity 0.4s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                        pointerEvents: 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. CODEPEN GOOEY RISING BUBBLES FOOTER (PITCH BLACK)              */}
      {/* ================================================================= */}
      <footer className="setu-bubbles-footer">
        <div className="setu-footer-bubbles bubbles">
          {FOOTER_BUBBLES.map((b) => (
            <div key={b.key} className="setu-footer-bubble bubble" style={b.style} />
          ))}
        </div>

        <div className="setu-footer-content">
          {/* Brand Info Column: strictly App Name & Subheading (no SIH badge, nothing else) */}
          <div className="setu-footer-brand-col">
            <h3 className="setu-footer-title">Setu.</h3>
            <p className="setu-footer-sub">
              Bridging citizen realities to engineering solutions and government action.
            </p>
          </div>

          {/* Portals Column: no subheadings, \grass is Reporting Portal, other portals under development */}
          <div className="setu-footer-portals-col">
            <span className="setu-footer-portals-heading">Ecosystem Portals</span>
            {SETU_PORTALS.map((portal) => (
              <Link
                key={portal.name}
                to={portal.path}
                className="setu-footer-portal-item"
                onMouseEnter={() => triggerHaptic('hover')}
                onMouseDown={() => triggerHaptic('click')}
              >
                <div className="setu-footer-portal-left">
                  <div
                    className="setu-footer-portal-icon"
                    style={{
                      backgroundColor: portal.bgColor,
                      border: `1px solid ${portal.accentColor}33`
                    }}
                  >
                    {portal.svgIcon}
                  </div>
                  <div className="setu-footer-portal-text-wrap">
                    <span className="setu-footer-portal-name">{portal.name}</span>
                    <span className="setu-footer-portal-sep">—</span>
                    <span className="setu-footer-portal-role">{portal.title}</span>
                  </div>
                </div>

                <span
                  className="setu-footer-status-pill"
                  style={{
                    backgroundColor: portal.badgeBg,
                    color: portal.badgeColor,
                    border: `1px solid ${portal.badgeColor}40`
                  }}
                >
                  {portal.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* SVG Filter for Gooey Liquid Bubbles Melting Effect */}
      <svg style={{ position: 'fixed', top: '100vh', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="blob">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="blob"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
