import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoogleIcon } from '../components/ui/GoogleIcon';
import { triggerHaptic } from '../utils/haptics';
import '../styles/landing.css';

export const LandingPage = () => {
  // Walkthrough Scroll Progress & Step State
  const walkthroughRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0); // 0, 1, 2, 3
  const [stepProgress, setStepProgress] = useState(1);
  const [phoneTransform, setPhoneTransform] = useState({
    rotY: -4,
    rotX: 3,
    rotZ: -1
  });

  // State for Tara Voice Assistant Interactive Preview
  const [isTaraSpeaking, setIsTaraSpeaking] = useState(false);

  // Refs for Smooth Card Pull, Expanding/Un-rounding & Haptic Snap
  const slideSlotRefs = useRef([]);
  const slideCardRefs = useRef([]);
  const snappedState = useRef({});
  const pullingState = useRef({});

  // Refs for 3D Perspective Problem Statements Throw Animation
  const psTrackRef = useRef(null);
  const psWordRefs = useRef([]);

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
  useEffect(() => {
    const handleScroll = () => {
      if (!walkthroughRef.current) return;
      const rect = walkthroughRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      // Calculate progress between 0 and 1
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      // Calculate Step Index (0 to 3)
      const exactStep = progress * WALKTHROUGH_STEPS.length;
      const stepIdx = Math.min(WALKTHROUGH_STEPS.length - 1, Math.floor(exactStep));
      const subProgress = exactStep - stepIdx;

      setActiveStep(stepIdx);
      setStepProgress(subProgress);

      // 3D Phone Frame Rotation on Scroll (Dynamic Gyroscopic Spin inspired by Apple 5G)
      const spinAngleY = Math.sin(progress * Math.PI * 2) * 12;
      const spinAngleX = Math.cos(progress * Math.PI * 1.5) * 4;
      const spinAngleZ = (progress - 0.5) * 4;

      setPhoneTransform({
        rotY: parseFloat(spinAngleY.toFixed(2)),
        rotX: parseFloat(spinAngleX.toFixed(2)),
        rotZ: parseFloat(spinAngleZ.toFixed(2))
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Card Pull, Expanding / Un-rounding & 3D Perspective Word Throw
  useEffect(() => {
    let rafId = null;
    let userHasScrolled = false;

    const handleScrollEffects = () => {
      const windowH = window.innerHeight;
      const isMobile = window.innerWidth < 640;
      const unroundThreshold = Math.min(320, windowH * 0.42);

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
      <section className="setu-section">
        <div className="setu-hero-layout">
          {/* Left Column: Heading about Setu, live intake pulse, metrics & portal shortcuts */}
          <div className="setu-hero-text-col">
            <div className="setu-hero-badge">
              <span className="setu-badge-pulse" />
              <span>Active Civic Intake across 420+ Municipal Wards &amp; Panchayats</span>
            </div>

            <h1 className="setu-hero-title">
              Real problems. Real people. Working solutions.
            </h1>

            <p className="setu-hero-desc">
              Setu connects the challenges communities face with the people and institutions capable of solving them.
            </p>

            <div className="setu-hero-cta-group">
              <Link
                to="/grass"
                className="setu-btn setu-btn-primary"
                onMouseEnter={() => triggerHaptic('hover')}
                onMouseDown={() => triggerHaptic('click')}
              >
                <GoogleIcon name="record_voice_over" size={18} color="#ffffff" style={{ marginRight: '0.45rem' }} />
                <span>Report an Issue</span>
              </Link>
              <a
                href="#portals"
                className="setu-btn setu-btn-secondary"
                onMouseEnter={() => triggerHaptic('hover')}
                onMouseDown={() => triggerHaptic('click')}
              >
                <span>Explore Portals</span>
              </a>
            </div>

            {/* 3-Unit Live Metric Triad - Fills dead white space */}
            <div className="setu-hero-stats">
              <div className="setu-stat-unit">
                <span className="setu-stat-num">12+</span>
                <span className="setu-stat-txt">Indian Dialects</span>
              </div>
              <div className="setu-stat-unit">
                <span className="setu-stat-num">15s</span>
                <span className="setu-stat-txt">Voice &amp; Photo Intake</span>
              </div>
              <div className="setu-stat-unit">
                <span className="setu-stat-num">TRL 1–7</span>
                <span className="setu-stat-txt">Academic R&amp;D Squads</span>
              </div>
            </div>

            {/* Connected Stakeholders Gateways */}
            <div className="setu-hero-roles">
              <span className="setu-roles-label">Ecosystem:</span>
              <div className="setu-roles-pills">
                <Link to="/grass" className="setu-role-chip citizen">Citizen Voice</Link>
                <Link to="/oak" className="setu-role-chip govt">Nodal Desks</Link>
                <Link to="/saplings" className="setu-role-chip uni">R&amp;D Labs</Link>
                <Link to="/grove" className="setu-role-chip ind">CSR Capital</Link>
              </div>
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
      <section className="setu-realities-intro-bar" id="realities">
        <div className="setu-realities-intro-content">
          <h2 className="setu-realities-heading">
            From grassroots reality to working solutions.
          </h2>
          <p className="setu-realities-sub">
            Scroll down to see real problem statements emerge from citizen voices, leading directly into field-validated engineering challenges.
          </p>
        </div>
      </section>

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
                className="setu-spinning-phone-frame"
                style={{
                  transform: `perspective(1200px) rotateY(${phoneTransform.rotY}deg) rotateX(${phoneTransform.rotX}deg) rotateZ(${phoneTransform.rotZ}deg)`
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
      {/* 4. TARA AI VOICE COPILOT & MORPHING ORGANIC BLOB                  */}
      {/* ================================================================= */}
      <section className="setu-section">
        <div className="setu-tara-section-wrap" id="tara-ai">
          <div className="setu-tara-grid">
            {/* Left: Morphing Organic Audio Blob */}
            <div className="setu-blob-stage">
              <div className="setu-organic-blob">
                <div className="setu-organic-blob-core">
                  <div className="setu-wave-bars">
                    <div className="setu-wave-bar" />
                    <div className="setu-wave-bar" />
                    <div className="setu-wave-bar" />
                    <div className="setu-wave-bar" />
                    <div className="setu-wave-bar" />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                  className="setu-btn setu-btn-primary"
                  style={{
                    background: isTaraSpeaking ? '#059669' : 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(8px)'
                  }}
                  onClick={handleSimulateTara}
                  onMouseEnter={() => triggerHaptic('hover')}
                  onMouseDown={() => triggerHaptic('click')}
                >
                  <span>{isTaraSpeaking ? 'Tara is Speaking' : 'Listen to Tara Sample'}</span>
                </button>

                {isTaraSpeaking && (
                  <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#a5f3fc', maxWidth: '36ch', lineHeight: 1.5 }}>
                    "नमस्ते! मैंने आपकी शिकायत 'वार्ड 12 - जल प्रदूषण' के रूप में दर्ज कर ली है। जांच दल को सूचना भेज दी गई है।"
                  </div>
                )}
              </div>
            </div>

            {/* Right: Tara Capabilities */}
            <div className="setu-tara-features">
              <h2 className="setu-section-title" style={{ color: '#ffffff' }}>
                The civic assistant that never puts you on hold.
              </h2>

              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                Tara bridges the digital literacy barrier by allowing citizens to report problems and track resolutions through natural telephone calls or in-app voice notes.
              </p>

              <div className="setu-tara-feature-card">
                <div className="setu-tara-feat-icon">
                  <GoogleIcon name="call" size={22} color="#38bdf8" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', color: '#ffffff', fontWeight: 700 }}>
                    Conversational Phone Intake
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Citizens dial a toll-free number and describe their grievance naturally without filling any forms or using a computer.
                  </p>
                </div>
              </div>

              <div className="setu-tara-feature-card">
                <div className="setu-tara-feat-icon">
                  <GoogleIcon name="phone_callback" size={22} color="#38bdf8" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', color: '#ffffff', fontWeight: 700 }}>
                    Proactive Verification Calls
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Before an issue is marked resolved by the department, Tara places an automated callback to the citizen to verify quality.
                  </p>
                </div>
              </div>

              <div className="setu-tara-feature-card">
                <div className="setu-tara-feat-icon">
                  <GoogleIcon name="translate" size={22} color="#38bdf8" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', color: '#ffffff', fontWeight: 700 }}>
                    12+ Indian Dialects
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Converses fluidly in regional languages with cultural and dialect nuance, eliminating robotic menus.
                  </p>
                </div>
              </div>
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
