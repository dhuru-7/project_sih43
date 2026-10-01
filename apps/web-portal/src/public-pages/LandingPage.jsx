import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoogleIcon } from '../components/ui/GoogleIcon';
import { TaraStarIcon } from '../components/ui/TaraStarIcon';
import { triggerHaptic } from '../utils/haptics';
import '../styles/landing.css';

export const LandingPage = () => {
  // Walkthrough Scroll Progress & Step State (Ref-optimized for 120 FPS with zero scroll jank)
  const walkthroughRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0); // 0, 1, 2, 3
  const activeStepRef = useRef(0);
  const phoneFrameRef = useRef(null);

  // State for Tara Voice Assistant Interactive Preview
  const [isTaraSpeaking, setIsTaraSpeaking] = useState(false);

  // Refs for Smooth Card Pull, Expanding/Un-rounding & Haptic Snap
  const slideSlotRefs = useRef([]);
  const slideCardRefs = useRef([]);
  const snappedState = useRef({});
  const pullingState = useRef({});

  // Refs for 3D Perspective Problem Statements Throw Animation & Curved SVG Separator
  const psTrackRef = useRef(null);
  const psWordRefs = useRef([]);
  const curvePathRef = useRef(null);
  const curveStrokeRef = useRef(null);

  // 50 Problem Statements Authentic to SIH / Setu Civic Realities (Mapped to User's 4x4 Grid & Ranges)
  const PS_ITEMS = [
    { id: 1, text: 'Contaminated Groundwater', range: [40, 50], area: '1 / 1' },
    { id: 2, text: 'Broken Village Culverts', range: [20, 30], area: '1 / 2' },
    { id: 3, text: 'Crop Pest Blight', range: [52, 62], area: '1 / 3' },
    { id: 4, text: 'Pothole Cluster Grid', range: [50, 60], area: '1 / 4' },
    { id: 5, text: 'Transformer Overload', range: [45, 55], area: '2 / 1' },
    { id: 6, text: 'Flash Flood Runoff', range: [10, 20], area: '2 / 2' },
    { id: 7, text: 'Industrial Effluents', range: [90, 100], area: '2 / 3' },
    { id: 8, text: 'Low Crop Yields', range: [30, 40], area: '2 / 4' },
    { id: 9, text: 'School Sanitation Gap', range: [80, 90], area: '3 / 1' },
    { id: 10, text: 'Arsenic Contamination', range: [70, 80], area: '3 / 2' },
    { id: 11, text: 'PROBLEM STATEMENTS', isSpecial: true, range: [-10, 50], area: 'special' },
    { id: 12, text: 'Primary Health Deficit', range: [52, 62], area: '3 / 4' },
    { id: 13, text: 'Severe Malnutrition', range: [15, 25], area: '4 / 1' },
    { id: 14, text: 'Submerged Rural Roads', range: [7, 17], area: '4 / 2' },
    { id: 15, text: 'Pesticide Residue Drift', range: [75, 85], area: '4 / 3' },
    { id: 16, text: 'Municipal Waste Overflow', range: [3, 13], area: '4 / 4' },
    { id: 17, text: 'Unlined Drainage Canal', range: [87, 97], area: '2 / 1' },
    { id: 18, text: 'Post-Harvest Crop Spoilage', range: [42, 52], area: '2 / 2' },
    { id: 19, text: 'Dry Borewell Depletion', range: [57, 67], area: '2 / 3' },
    { id: 20, text: 'Cold Storage Deficit', range: [37, 47], area: '2 / 4' },
    { id: 21, text: 'Stray Cattle Hazard', range: [12, 22], area: '3 / 1' },
    { id: 22, text: 'High Nitrate Seepage', range: [8, 18], area: '3 / 2' },
    { id: 23, text: 'E-Waste Dumping Yard', range: [84, 94], area: '3 / 3' },
    { id: 24, text: 'Human-Wildlife Conflict', range: [33, 43], area: '3 / 4' },
    { id: 25, text: 'Quarry Dust Dispersion', range: [48, 58], area: '1 / 1' },
    { id: 26, text: 'Saline Soil Ingress', range: [13, 23], area: '1 / 2' },
    { id: 27, text: 'Bridge Structural Flaws', range: [78, 88], area: '1 / 3' },
    { id: 28, text: 'Bio-Medical Waste Risk', range: [62, 72], area: '1 / 4' },
    { id: 29, text: 'Micro-Plastic Ingestion', range: [31, 41], area: '4 / 1' },
    { id: 30, text: 'Uncertified Seed Fraud', range: [8, 18], area: '4 / 2' },
    { id: 31, text: 'Urban Heat Island Effect', range: [4, 14], area: '4 / 3' },
    { id: 32, text: 'Stubble Smoke Inhalation', range: [74, 84], area: '4 / 4' },
    { id: 33, text: 'Pump Voltage Surges', range: [61, 71], area: '2 / 1' },
    { id: 34, text: 'River Sand Siltation', range: [26, 36], area: '2 / 2' },
    { id: 35, text: 'Defunct Solar Grids', range: [63, 73], area: '2 / 3' },
    { id: 36, text: 'Monsoon Waterlogging', range: [11, 21], area: '2 / 4' },
    { id: 37, text: 'Heavy Metal Soil Toxicity', range: [89, 99], area: '3 / 1' },
    { id: 38, text: 'Livestock Epidemic Spread', range: [33, 43], area: '3 / 2' },
    { id: 39, text: 'Illegal Water Siphoning', range: [88, 98], area: '3 / 3' },
    { id: 40, text: 'Defunct Handpumps', range: [22, 32], area: '3 / 4' },
    { id: 41, text: 'Sub-Standard Bitumen', range: [16, 26], area: '1 / 1' },
    { id: 42, text: 'High Fluoride Toxicity', range: [26, 36], area: '1 / 2' },
    { id: 43, text: 'Inadequate Grain Silos', range: [66, 76], area: '1 / 3' },
    { id: 44, text: 'Streetlight Blackouts', range: [3, 13], area: '1 / 4' },
    { id: 45, text: 'Untreated Sewage Nullahs', range: [44, 54], area: '4 / 1' },
    { id: 46, text: 'Maternal Telehealth Gap', range: [11, 21], area: '4 / 2' },
    { id: 47, text: 'Canal Breach Hazard', range: [23, 33], area: '4 / 3' },
    { id: 48, text: 'Fertilizer Eutrophication', range: [39, 49], area: '4 / 4' },
    { id: 49, text: 'Landslide Slope Risk', range: [59, 69], area: '3 / 1' },
    { id: 50, text: 'Coastal Mangrove Loss', range: [6, 16], area: '3 / 2' }
  ];

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

  // Scroll Listener for Apple 5G Inspired 3D Phone Spin & Step Progression
  // Unified Performant Scroll & Render Loop (Hardware-Accelerated 120 FPS)
  useEffect(() => {
    let rafId = null;
    let userHasScrolled = false;

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

      // 1. 3D Problem Statements Perspective Throw Animation
      const trackEl = psTrackRef.current;
      if (trackEl) {
        const trackRect = trackEl.getBoundingClientRect();
        const totalDist = trackRect.height - windowH;
        if (totalDist > 0) {
          const rawProgress = -trackRect.top / totalDist;
          const progress = Math.max(0, Math.min(1, rawProgress));

          PS_ITEMS.forEach((item, i) => {
            const el = psWordRefs.current[i];
            if (!el) return;

            const [startPct, endPct] = item.range;
            const start = startPct / 100;
            const end = endPct / 100;

            if (progress < start) {
              el.style.transform = 'translateZ(-1000px)';
              el.style.opacity = '0';
              el.style.filter = 'blur(6px)';
            } else if (progress > end) {
              el.style.transform = 'translateZ(1000px)';
              el.style.opacity = '0';
              el.style.filter = 'blur(6px)';
            } else {
              const local = (progress - start) / (end - start);
              const tz = -1000 + local * 2000;
              const op = local < 0.5 ? local * 2 : (1 - local) * 2;
              const blur = local < 0.5 ? (1 - local * 2) * 5 : ((local - 0.5) * 2) * 5;

              el.style.transform = `translateZ(${tz.toFixed(1)}px)`;
              el.style.opacity = Math.max(0, Math.min(1, op)).toFixed(3);
              el.style.filter = `blur(${Math.max(0, blur).toFixed(1)}px)`;
            }
          });
        }
      }

      // 2. Fullscreen Stack Cards Pull & Dynamic Un-rounding
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

    const onScroll = () => {
      userHasScrolled = true;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScrollEffects);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScrollEffects();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSimulateTara = () => {
    setIsTaraSpeaking(true);
    triggerHaptic('click');
    setTimeout(() => {
      setIsTaraSpeaking(false);
    }, 4500);
  };

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
      </section>

      {/* ================================================================= */}
      {/* 2. 3D PROBLEM STATEMENTS ZOOM & SCROLL-STACKING PHOTO SHOWCASE    */}
      {/* ================================================================= */}

      {/* 3D Perspective Word Throw Track - Throws 50 PS keywords as user scrolls till card 1 covers 50% */}
      <section className="setu-ps-words-track" ref={psTrackRef}>
        <div className="stuck-grid">
          {PS_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => (psWordRefs.current[idx] = el)}
              className={`grid-item ${item.isSpecial ? 'special' : ''}`}
              style={
                item.isSpecial
                  ? { gridRow: '2 / span 2', gridColumn: '2 / span 2' }
                  : { gridArea: item.area }
              }
            >
              {item.isSpecial ? <b>{item.text}</b> : item.text}
            </div>
          ))}
        </div>
      </section>

      <div className="setu-fullscreen-stack-container">
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
        {/* Extra scroll track so slide 5 stays pinned at full view before next section */}
        <div className="setu-fullscreen-stack-spacer" />
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
      {/* 4. TARA AI VOICE COPILOT & MORPHING ORGANIC STAR BLOB             */}
      {/* ================================================================= */}
      <section className="setu-section">
        <div className="setu-tara-section-wrap" id="tara-ai">
          <div className="setu-tara-grid">
            {/* Left: Morphing Organic Audio Blob with Center 4-Pointed Tara Star Icon */}
            <div className="setu-blob-stage">
              <div className={`setu-organic-blob ${isTaraSpeaking ? 'setu-organic-blob-active' : ''}`}>
                <div className="setu-tara-star-core">
                  <div className="setu-tara-star-icon-wrap">
                    <TaraStarIcon size={38} color="#ffffff" />
                  </div>
                  {isTaraSpeaking && (
                    <div className="setu-wave-bars" style={{ marginTop: '6px' }}>
                      <div className="setu-wave-bar" />
                      <div className="setu-wave-bar" />
                      <div className="setu-wave-bar" />
                      <div className="setu-wave-bar" />
                      <div className="setu-wave-bar" />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '2.25rem', textAlign: 'center' }}>
                <button
                  className="setu-btn setu-btn-primary"
                  style={{
                    background: isTaraSpeaking ? '#059669' : 'rgba(255, 255, 255, 0.12)',
                    borderColor: isTaraSpeaking ? '#10b981' : 'rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(10px)',
                    gap: '0.5rem',
                    color: '#ffffff'
                  }}
                  onClick={handleSimulateTara}
                  onMouseEnter={() => triggerHaptic('hover')}
                  onMouseDown={() => triggerHaptic('click')}
                >
                  <TaraStarIcon size={16} color="#ffffff" />
                  <span>{isTaraSpeaking ? 'Tara is Speaking (Hindi)...' : 'Listen to Tara Sample'}</span>
                </button>

                {isTaraSpeaking && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(129, 140, 248, 0.3)',
                      borderRadius: '16px',
                      padding: '1rem 1.25rem',
                      maxWidth: '42ch',
                      textAlign: 'left',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#c7d2fe', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      <TaraStarIcon size={12} color="#818CF8" />
                      <span>Live Voice Synthesis</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#ffffff', lineHeight: 1.5, fontWeight: 500 }}>
                      "नमस्ते! मैंने आपकी शिकायत 'वार्ड 12 - जल प्रदूषण' के रूप में दर्ज कर ली है। जांच दल को सूचना भेज दी गई है।"
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4, borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.4rem' }}>
                      Namaste! I have logged your grievance as 'Ward 12 - Water Contamination'. Notice dispatched to the field inspection squad.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Tara Models & Capabilities Showcase */}
            <div className="setu-tara-features">
              <div>
                <div className="setu-tara-badge">
                  <TaraStarIcon size={13} color="#818CF8" />
                  <span>TARA CIVIC INTELLIGENCE</span>
                </div>
                <h2 className="setu-section-title" style={{ color: '#ffffff', textAlign: 'left', margin: '0 0 0.85rem 0' }}>
                  The multilingual AI intelligence behind every resolution.
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
                  Tara translates unfiltered citizen voices from 12+ Indian dialects into verified civic engineering tickets and automated department actions.
                </p>
              </div>

              {/* 4 Models Working Under Tara (with Colors from Color Library) */}
              <div className="setu-tara-models-grid">
                {/* Model 1: Nina (Cyan #22D3EE / Soft Cyan) */}
                <div
                  className="setu-tara-model-card"
                  style={{
                    borderColor: 'rgba(34, 211, 238, 0.35)',
                    background: 'rgba(34, 211, 238, 0.04)'
                  }}
                >
                  <div className="setu-tara-model-header">
                    <span className="setu-tara-model-name" style={{ color: '#22d3ee' }}>
                      <TaraStarIcon size={14} color="#22D3EE" />
                      Nina
                    </span>
                    <span
                      className="setu-tara-model-tag"
                      style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#67e8f9' }}
                    >
                      Vision &amp; Acoustics
                    </span>
                  </div>
                  <p className="setu-tara-model-desc">
                    Multimodal spatial model that inspects video frames, photos, and sound patterns to detect broken culverts, water discoloration, and pipeline decibel anomalies.
                  </p>
                </div>

                {/* Model 2: Sarvam v4 (Amber #FB923C / Soft Orange) */}
                <div
                  className="setu-tara-model-card"
                  style={{
                    borderColor: 'rgba(251, 146, 60, 0.35)',
                    background: 'rgba(251, 146, 60, 0.04)'
                  }}
                >
                  <div className="setu-tara-model-header">
                    <span className="setu-tara-model-name" style={{ color: '#fb923c' }}>
                      <TaraStarIcon size={14} color="#FB923C" />
                      Sarvam v4
                    </span>
                    <span
                      className="setu-tara-model-tag"
                      style={{ background: 'rgba(251, 146, 60, 0.15)', color: '#fdba74' }}
                    >
                      12+ Dialects STT
                    </span>
                  </div>
                  <p className="setu-tara-model-desc">
                    Indic foundational speech-to-text engine with deep regional idiom understanding across Hindi, Bengali, Tamil, Telugu, Marathi, Santhali, and Bhojpuri.
                  </p>
                </div>

                {/* Model 3: Bulbul v3 (Emerald #34D399 / Soft Green) */}
                <div
                  className="setu-tara-model-card"
                  style={{
                    borderColor: 'rgba(52, 211, 153, 0.35)',
                    background: 'rgba(52, 211, 153, 0.04)'
                  }}
                >
                  <div className="setu-tara-model-header">
                    <span className="setu-tara-model-name" style={{ color: '#34d399' }}>
                      <TaraStarIcon size={14} color="#34D399" />
                      Bulbul v3
                    </span>
                    <span
                      className="setu-tara-model-tag"
                      style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#86efac' }}
                    >
                      Regional TTS
                    </span>
                  </div>
                  <p className="setu-tara-model-desc">
                    Hyper-natural conversational voice synthesis delivering local cadence and empathetic inflection for automated toll-free telephone callbacks.
                  </p>
                </div>

                {/* Model 4: Sarvam 105B (Indigo #818CF8 / Soft Purple) */}
                <div
                  className="setu-tara-model-card"
                  style={{
                    borderColor: 'rgba(129, 140, 248, 0.35)',
                    background: 'rgba(129, 140, 248, 0.04)'
                  }}
                >
                  <div className="setu-tara-model-header">
                    <span className="setu-tara-model-name" style={{ color: '#818cf8' }}>
                      <TaraStarIcon size={14} color="#818CF8" />
                      Sarvam 105B
                    </span>
                    <span
                      className="setu-tara-model-tag"
                      style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#c7d2fe' }}
                    >
                      Reasoning &amp; Triage
                    </span>
                  </div>
                  <p className="setu-tara-model-desc">
                    Advanced civic reasoning LLM that parses municipal codes, clusters duplicate grievances, verifies contractor completion photos, and writes capstone briefs.
                  </p>
                </div>
              </div>

              {/* Core Capabilities in Structured Bullet Points */}
              <ul className="setu-tara-capabilities-list">
                <li className="setu-tara-cap-item">
                  <span className="setu-tara-cap-dot" style={{ background: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }} />
                  <span className="setu-tara-cap-text">
                    <strong>Zero-Barrier Voice Intake</strong> — Citizens dial a toll-free helpline or tap the mic in-app to speak naturally in their dialect without filling complicated forms or typing.
                  </span>
                </li>
                <li className="setu-tara-cap-item">
                  <span className="setu-tara-cap-dot" style={{ background: '#fb923c', boxShadow: '0 0 8px #fb923c' }} />
                  <span className="setu-tara-cap-text">
                    <strong>Multimodal Ground-Truth Audit</strong> — Nina analyzes video frames, GPS coordinates, and acoustic decibels to eliminate spam and certify physical ground reality.
                  </span>
                </li>
                <li className="setu-tara-cap-item">
                  <span className="setu-tara-cap-dot" style={{ background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                  <span className="setu-tara-cap-text">
                    <strong>Autonomous Departmental Routing</strong> — Sarvam 105B cross-references municipal charters to immediately assign tickets to the exact nodal officer or panchayat engineer.
                  </span>
                </li>
                <li className="setu-tara-cap-item">
                  <span className="setu-tara-cap-dot" style={{ background: '#818cf8', boxShadow: '0 0 8px #818cf8' }} />
                  <span className="setu-tara-cap-text">
                    <strong>Proactive Citizen Verification Callbacks</strong> — Bulbul v3 places automated calls to citizens to confirm work quality before tickets can be closed, eliminating paper-only ghost resolutions.
                  </span>
                </li>
                <li className="setu-tara-cap-item">
                  <span className="setu-tara-cap-dot" style={{ background: '#c084fc', boxShadow: '0 0 8px #c084fc' }} />
                  <span className="setu-tara-cap-text">
                    <strong>University R&amp;D Problem Synthesis</strong> — Chronic recurring structural challenges are automatically packaged into funded capstone briefs for partner engineering universities.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <hr className="setu-divider" />

      {/* ================================================================= */}
      {/* 5. 4-STAKEHOLDER ECOSYSTEM BENTO GRID                             */}
      {/* ================================================================= */}
      <section className="setu-section" id="portals">
        <div className="setu-section-header">
          <h2 className="setu-section-title">
            How Setu bridges problems to physical solutions.
          </h2>
          <p className="setu-section-subtitle">
            Most grievance portals only log complaints into endless queues. Setu connects grassroots problems directly to university research and industry capital.
          </p>
        </div>

        <div className="setu-bento-grid">
          {/* Card 1: Citizen */}
          <div className="setu-ecosystem-card">
            <div>
              <div className="setu-card-header">
                <span className="setu-role-pill setu-role-citizen">
                  <GoogleIcon name="person" size={14} color="#047857" />
                  <span>Grassroots Citizen</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'var(--setu-mono)' }}>INTAKE</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: '#111827' }}>
                Voice &amp; Photo Intake in 15 Seconds
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Report water contamination, broken infrastructure, or power failures without filling forms. Receive transparent status updates directly on WhatsApp and SMS.
              </p>
            </div>
            <div style={{ marginTop: '1.75rem' }}>
              <Link
                to="/grass"
                className="setu-btn setu-btn-secondary"
                style={{ width: '100%', boxSizing: 'border-box' }}
                onMouseEnter={() => triggerHaptic('hover')}
                onMouseDown={() => triggerHaptic('click')}
              >
                <span>Access Citizen Portal</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Government */}
          <div className="setu-ecosystem-card">
            <div>
              <div className="setu-card-header">
                <span className="setu-role-pill setu-role-govt">
                  <GoogleIcon name="account_balance" size={14} color="#1d4ed8" />
                  <span>Government Administration</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'var(--setu-mono)' }}>TRIAGE &amp; CLUSTER</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: '#111827' }}>
                AI Deduplication &amp; Nodal Coordination
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Clusters duplicate citizen complaints into unified challenges. Nodal desks delegate stubborn engineering bottlenecks to vetted university laboratories.
              </p>
            </div>
            <div style={{ marginTop: '1.75rem' }}>
              <Link
                to="/oak"
                className="setu-btn setu-btn-secondary"
                style={{ width: '100%', boxSizing: 'border-box' }}
                onMouseEnter={() => triggerHaptic('hover')}
                onMouseDown={() => triggerHaptic('click')}
              >
                <span>Access Government Console</span>
              </Link>
            </div>
          </div>

          {/* Card 3: University */}
          <div className="setu-ecosystem-card">
            <div>
              <div className="setu-card-header">
                <span className="setu-role-pill setu-role-uni">
                  <GoogleIcon name="school" size={14} color="#7e22ce" />
                  <span>University &amp; Research</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'var(--setu-mono)' }}>R&amp;D LABS</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: '#111827' }}>
                Engineering Squads Building Prototypes
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Faculty mentors and student engineering squads adopt real municipal challenges as funded capstone projects, earning academic credits and grants.
              </p>
            </div>
            <div style={{ marginTop: '1.75rem' }}>
              <Link
                to="/saplings"
                className="setu-btn setu-btn-secondary"
                style={{ width: '100%', boxSizing: 'border-box' }}
                onMouseEnter={() => triggerHaptic('hover')}
                onMouseDown={() => triggerHaptic('click')}
              >
                <span>Access University Portal</span>
              </Link>
            </div>
          </div>

          {/* Card 4: Industry */}
          <div className="setu-ecosystem-card">
            <div>
              <div className="setu-card-header">
                <span className="setu-role-pill setu-role-ind">
                  <GoogleIcon name="corporate_fare" size={14} color="#c2410c" />
                  <span>Industry &amp; CSR</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'var(--setu-mono)' }}>DEPLOYMENT</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: '#111827' }}>
                CSR Capital Funding Verified Deployments
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Corporate CSR funds channel capital directly into verified, faculty-audited student prototypes to scale low-cost solutions across villages and towns.
              </p>
            </div>
            <div style={{ marginTop: '1.75rem' }}>
              <Link
                to="/grove"
                className="setu-btn setu-btn-secondary"
                style={{ width: '100%', boxSizing: 'border-box' }}
                onMouseEnter={() => triggerHaptic('hover')}
                onMouseDown={() => triggerHaptic('click')}
              >
                <span>Access Industry Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. HIGH-IMPACT FINAL CALL TO ACTION                               */}
      {/* ================================================================= */}
      <section className="setu-section">
        <div className="setu-cta-box">
          <h2 className="setu-cta-title">
            Have an issue in your locality?
          </h2>
          <p className="setu-cta-sub">
            Report it now with voice or camera. Let Setu connect your community's challenge to real engineers and working solutions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/grass"
              className="setu-btn setu-btn-primary"
              style={{ background: '#ffffff', color: '#000000', borderColor: '#ffffff' }}
              onMouseEnter={() => triggerHaptic('hover')}
              onMouseDown={() => triggerHaptic('click')}
            >
              <span>Get Started</span>
            </Link>
            <Link
              to="/login"
              className="setu-btn setu-btn-secondary"
              style={{ background: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
              onMouseEnter={() => triggerHaptic('hover')}
              onMouseDown={() => triggerHaptic('click')}
            >
              <span>Stakeholder Login</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
