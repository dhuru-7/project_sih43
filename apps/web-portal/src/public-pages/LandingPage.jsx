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

    const size = (2 + r1 * 4).toFixed(2);
    const distance = (6 + r2 * 4).toFixed(2);
    const position = (-5 + r3 * 110).toFixed(2);
    const time = (2 + r4 * 2).toFixed(2);
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
      icon: 'record_voice_over',
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
      icon: 'account_balance',
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
      icon: 'school',
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
      icon: 'corporate_fare',
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
  // Unified Performant Scroll & Render Loop (Hardware-Accelerated 120 FPS)
  useEffect(() => {
    let rafId = null;
    let userHasScrolled = false;

    // Helper to smoothly scroll to a specific stack card index (0 to 4)
    const scrollToCard = (idx) => {
      const stackEl = stackContainerRef.current;
      if (!stackEl) return;
      const rect = stackEl.getBoundingClientRect();
      const windowH = window.innerHeight;
      const containerDocTop = window.pageYOffset + rect.top;
      const targetY = containerDocTop + idx * windowH;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
      triggerHaptic('snap');
    };

    // Helper to smoothly scroll into the next section (#reporting-flow)
    const scrollToNextSection = () => {
      const nextSection = document.getElementById('reporting-flow');
      if (nextSection) {
        window.scrollTo({
          top: window.pageYOffset + nextSection.getBoundingClientRect().top,
          behavior: 'smooth'
        });
        triggerHaptic('snap');
      }
    };

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

      // 1. Fullscreen Stack Cards Pull & Dynamic Un-rounding
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

          if (userHasScrolled && !snappedState.current[idx]) {
            snappedState.current[idx] = true;
            triggerHaptic('snap');
          }
        } else {
          // Pulling up from below
          if (userHasScrolled && snappedState.current[idx]) {
            snappedState.current[idx] = false;
            triggerHaptic('hover');
          }

          const fraction = Math.min(1, Math.max(0, top / unroundThreshold));
          // Eased smoothstep curve (Apple fluid mechanics)
          const ease = fraction * fraction * (3 - 2 * fraction);

          const maxRadius = isMobile ? 20 : 36;
          const radius = Math.round(ease * maxRadius);
          const maxInsetRem = isMobile ? 0.75 : 1.75;
          const inset = (ease * maxInsetRem).toFixed(2);
          const scale = (1 - (ease * 0.035)).toFixed(4);

          // Tactile haptic feedback when card first enters un-rounding pull zone
          if (userHasScrolled) {
            if (fraction < 0.95 && !pullingState.current[idx]) {
              pullingState.current[idx] = true;
              triggerHaptic('hover');
            } else if (fraction >= 0.95) {
              pullingState.current[idx] = false;
            }
          }

          cardEl.style.borderRadius = `${radius}px`;
          cardEl.style.width = inset > 0.02 ? `calc(100% - ${inset * 2}rem)` : '100%';
          cardEl.style.transform = `scale(${scale})`;
          cardEl.style.boxShadow = '0 -16px 44px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.05)';
        }
      });

      // 3. Apple 5G Walkthrough Step & 3D Phone Gyro Transform (Zero React Re-render Thrashing)
      const wtEl = walkthroughRef.current;
      if (wtEl) {
        const wtRect = wtEl.getBoundingClientRect();
        const totalScrollable = wtRect.height - windowH;
        if (totalScrollable > 0) {
          const rawProgress = -wtRect.top / totalScrollable;
          const progress = Math.max(0, Math.min(1, rawProgress));

          // Each step gets an equal slice for deliberate one-by-one progression
          const exactStep = progress * WALKTHROUGH_STEPS.length;
          const stepIdx = Math.min(WALKTHROUGH_STEPS.length - 1, Math.floor(exactStep));

          if (stepIdx !== activeStepRef.current) {
            activeStepRef.current = stepIdx;
            setActiveStep(stepIdx);
            triggerHaptic('snap');
          }

          // Direct DOM transform without triggering React re-renders!
          if (phoneFrameRef.current) {
            const spinAngleY = (Math.sin(progress * Math.PI * 2) * 12).toFixed(2);
            const spinAngleX = (Math.cos(progress * Math.PI * 1.5) * 4).toFixed(2);
            const spinAngleZ = ((progress - 0.5) * 4).toFixed(2);
            phoneFrameRef.current.style.transform = `perspective(1200px) rotateY(${spinAngleY}deg) rotateX(${spinAngleX}deg) rotateZ(${spinAngleZ}deg)`;
          }
        }
      }
    };

    let lastScrollY = typeof window !== 'undefined' ? (window.pageYOffset || document.documentElement.scrollTop || 0) : 0;
    let scrollAccumulator = 0;

    const onScroll = () => {
      userHasScrolled = true;
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      scrollAccumulator += delta;
      // Responsive tactile rotary jog-dial haptic feedback on scroll
      if (scrollAccumulator >= 75) {
        scrollAccumulator = 0;
        triggerHaptic('scroll');
      }

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScrollEffects);
    };

    // Rate-Limited 1-Card-at-a-time Touch Gesture Controller (0.8s cooldown)
    let touchStartY = 0;
    let touchStartX = 0;
    let isTouchActive = false;

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isTouchActive = true;
    };

    const onTouchMove = (e) => {
      if (!isTouchActive || e.touches.length !== 1) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = touchStartY - currentY; // positive = swipe up = scroll down
      const deltaX = touchStartX - currentX;

      // Only handle clear vertical gestures
      if (Math.abs(deltaY) < 28 || Math.abs(deltaY) < Math.abs(deltaX) * 1.25) {
        return;
      }

      const now = Date.now();

      // Check Stack Cards Section
      const stackEl = stackContainerRef.current;
      if (stackEl) {
        const stackRect = stackEl.getBoundingClientRect();
        const windowH = window.innerHeight;
        // Inside stack cards view: top has arrived and bottom has not scrolled away
        const isInsideStack = stackRect.top <= 60 && stackRect.bottom >= windowH - 60;

        if (isInsideStack) {
          // If within the 0.8s gap: lock scroll so mobile inertia doesn't skip cards
          if (now - lastSlideTransitionTime.current < 800) {
            if (e.cancelable) e.preventDefault();
            return;
          }

          const scrolledInside = -stackRect.top;
          const currentIdx = Math.max(
            0,
            Math.min(STACK_CARDS.length - 1, Math.round(scrolledInside / windowH))
          );

          if (deltaY > 28) {
            // User swipes up -> wants to slide to next card
            if (currentIdx < STACK_CARDS.length - 1) {
              if (e.cancelable) e.preventDefault();
              lastSlideTransitionTime.current = now;
              isTouchActive = false;
              scrollToCard(currentIdx + 1);
              return;
            } else {
              // At card 4 (Research becomes prototypes): slide cleanly into #reporting-flow
              if (e.cancelable) e.preventDefault();
              lastSlideTransitionTime.current = now;
              isTouchActive = false;
              scrollToNextSection();
              return;
            }
          } else if (deltaY < -28) {
            // User swipes down -> wants to slide to previous card
            if (currentIdx > 0) {
              if (e.cancelable) e.preventDefault();
              lastSlideTransitionTime.current = now;
              isTouchActive = false;
              scrollToCard(currentIdx - 1);
              return;
            }
          }
        }
      }

      // Check Walkthrough Section
      const wtEl = walkthroughRef.current;
      if (wtEl) {
        const wtRect = wtEl.getBoundingClientRect();
        const windowH = window.innerHeight;
        const isInsideWt = wtRect.top <= 75 && wtRect.bottom >= windowH + 100;

        if (isInsideWt) {
          if (now - lastSlideTransitionTime.current < 800) {
            if (e.cancelable) e.preventDefault();
            return;
          }

          const curStep = activeStepRef.current;
          if (deltaY > 28 && curStep < WALKTHROUGH_STEPS.length - 1) {
            if (e.cancelable) e.preventDefault();
            lastSlideTransitionTime.current = now;
            isTouchActive = false;
            scrollToStep(curStep + 1);
            return;
          } else if (deltaY < -28 && curStep > 0) {
            if (e.cancelable) e.preventDefault();
            lastSlideTransitionTime.current = now;
            isTouchActive = false;
            scrollToStep(curStep - 1);
            return;
          }
        }
      }
    };

    const onTouchEnd = () => {
      isTouchActive = false;
    };

    // Desktop/Trackpad Wheel 1-Card Rate Limiter (0.8s gap)
    const onWheel = (e) => {
      const stackEl = stackContainerRef.current;
      if (!stackEl) return;
      const stackRect = stackEl.getBoundingClientRect();
      const windowH = window.innerHeight;
      const isInsideStack = stackRect.top <= 60 && stackRect.bottom >= windowH - 60;

      if (isInsideStack) {
        const now = Date.now();
        if (now - lastSlideTransitionTime.current < 800) {
          if (e.cancelable) e.preventDefault();
          return;
        }

        if (Math.abs(e.deltaY) > 20) {
          const scrolledInside = -stackRect.top;
          const currentIdx = Math.max(
            0,
            Math.min(STACK_CARDS.length - 1, Math.round(scrolledInside / windowH))
          );

          if (e.deltaY > 0) {
            if (currentIdx < STACK_CARDS.length - 1) {
              if (e.cancelable) e.preventDefault();
              lastSlideTransitionTime.current = now;
              scrollToCard(currentIdx + 1);
            } else {
              if (e.cancelable) e.preventDefault();
              lastSlideTransitionTime.current = now;
              scrollToNextSection();
            }
          } else if (e.deltaY < 0 && currentIdx > 0) {
            if (e.cancelable) e.preventDefault();
            lastSlideTransitionTime.current = now;
            scrollToCard(currentIdx - 1);
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    handleScrollEffects();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('wheel', onWheel);
      if (rafId) cancelAnimationFrame(rafId);
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
                  <img
                    key={WALKTHROUGH_STEPS[activeStep].screenshot}
                    src={WALKTHROUGH_STEPS[activeStep].screenshot}
                    alt={WALKTHROUGH_STEPS[activeStep].heading}
                    className="setu-phone-ss-img"
                  />
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
                    <GoogleIcon name={portal.icon} size={18} color={portal.accentColor} />
                  </div>
                  <div className="setu-footer-portal-name">
                    <span>{portal.name}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                      — {portal.title}
                    </span>
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
