import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

export const LandingPage = () => {
  // Stakeholder interactive tab switcher
  const [activeTab, setActiveTab] = useState('students');

  // 4 Stakeholder Tab Details directly from Stitch
  const STAKEHOLDERS = {
    students: {
      tag: 'Pillar 01 · Learn by Solving',
      title: 'Real engineering challenges with backed government seed grants.',
      desc: 'University students and faculty researchers choose vetted societal issues uploaded by rural citizens and municipal wards, submit prototype proposals, and unlock direct tranche disbursements.',
      ctaText: 'Browse Active University Challenges',
      ctaRoute: '/login?role=university',
      points: [
        {
          title: 'Adopt State Challenges',
          sub: 'Tackle challenges matched to your lab’s capabilities (e.g., Clean Water at IIT ISM Dhanbad, Agritech at BAU Ranchi).'
        },
        {
          title: 'Secure Prototyping Grants',
          sub: 'Receive milestone-based government seed funding for lab components, PCB manufacturing, and field trials.'
        },
        {
          title: 'Industry Mentorship',
          sub: 'Direct technical reviews with senior engineers from Tata Steel, Coal India, and leading innovation hubs.'
        }
      ],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW7HaEVeaGwdUmDOsdZC_PHYb1HhwD5tue1WSRLJrs3acv44wWflqjLqLEDwFzrQamvjW8qf9FKKc9tWyjo5CX1M9wwHo9-D0JTIsroqo0Ku7n1DPCxPWvKx5H6o9iv8sisgKruNgYKKFfruga1rc2YixIm_4b7isAAhC0_KglOuSUAcr68rD_rSfwoHRLaXQW-NIBdbyhecnmsaMBh5quNsqWf48lnsX3BwWC5IOZgpHUxT4eYSAzlQ',
      imageAlt: 'Students collaborating in laboratory',
      badge: 'Stage: Prototype Testing',
      badgeClass: 'deployed'
    },
    govt: {
      tag: 'Pillar 02 · Mobilize Talent',
      title: 'Intelligent civic oversight and direct university lab delegation.',
      desc: 'District collectors and nodal officers gain a state-wide command dashboard to automatically categorize citizen issues, route technical challenges to accredited labs, and approve deliverables.',
      ctaText: 'Access Govt Nodal Dashboard',
      ctaRoute: '/government/dashboard',
      points: [
        {
          title: 'AI Problem Triage',
          sub: 'Automatic grouping of raw citizen reports by domain, district, urgency index, and feasibility.'
        },
        {
          title: 'One-Click University Routing',
          sub: 'Instant transfer of complex municipal problems to appropriate academic faculties with seed grant allocations.'
        },
        {
          title: 'Milestone Oversight',
          sub: 'Validate photo proof and laboratory test data before authorising next-phase funding tranches.'
        }
      ],
      customRight: (
        <div style={{ background: '#FFFFFF', borderRadius: '1rem', border: '1px solid #E5E5E5', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #F3F3F3', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#0A0A0A' }}>Nodal Command Desk</span>
            <span style={{ fontSize: '0.6875rem', background: '#F4F4F5', color: '#525252', padding: '0.2rem 0.55rem', borderRadius: '0.375rem', fontFamily: 'monospace' }}>
              24 Districts Synchronized
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.85rem', background: '#F9F9F9', borderRadius: '0.75rem', border: '1px solid #EBEBEB' }}>
              <span style={{ fontSize: '0.6875rem', color: '#737373', textTransform: 'uppercase', fontWeight: '600' }}>Pending Routing</span>
              <p style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0A0A0A', margin: '0.2rem 0 0' }}>42 Issues</p>
            </div>
            <div style={{ padding: '0.85rem', background: '#F9F9F9', borderRadius: '0.75rem', border: '1px solid #EBEBEB' }}>
              <span style={{ fontSize: '0.6875rem', color: '#737373', textTransform: 'uppercase', fontWeight: '600' }}>Active R&amp;D Squads</span>
              <p style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0A0A0A', margin: '0.2rem 0 0' }}>18 Universities</p>
            </div>
          </div>
          <div style={{ padding: '0.85rem', background: '#0A0A0A', color: '#FFFFFF', borderRadius: '0.75rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginBottom: '0.25rem' }}>
              <span>Tranche Release Verification</span>
              <span style={{ color: '#34D399' }}>Ready for Audit</span>
            </div>
            <p style={{ color: '#D4D4D4', fontSize: '0.6875rem', margin: 0 }}>IIT (ISM) Dhanbad · Solar Inverter Firmware Telemetry verified.</p>
          </div>
        </div>
      )
    },
    citizens: {
      tag: 'Pillar 03 · Grassroots Voice',
      title: 'Zero-paperwork voice intake in local languages and real-time tracking.',
      desc: 'Citizens, panchayat heads, and ward commuters report problems effortlessly via browser audio or video without filling forms or installing native apps.',
      ctaText: 'Try Voice Reporting in Browser',
      ctaRoute: '/citizen',
      points: [
        {
          title: 'Frictionless Web Intake',
          sub: '1-tap smartphone camera capture, automatic GPS geotagging, and TARA Voice AI in Hindi, Santali, and Nagpuri.'
        },
        {
          title: 'Transparent Solution Tracking',
          sub: 'Follow your issue as it moves from submission to student squad R&D to field deployment in your village.'
        },
        {
          title: 'Direct Community Feedback',
          sub: 'Local residents test and sign off on installed solutions before government closure approval.'
        }
      ],
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1ULUp0q1WvqXiM9FHe7R_3gbLsTEV0hjDW-y9BU3Nw6jBCpK9yFyQ6Orlq9elk1aonacjEsLwkPVw3EOqGhgo2BxFoyHgi9Mq-bGH1wdbYVhWgJQX5KPrpVBszwC997T5gGnK_8xESKBTLuHOAlNmSbaEu5rlu816_42MQnGQEbXs766hyYMyuQq3a7NCu5O4aBB7sUTUnu7DOOzpkaTJ7blq1m3HpV0HajFPX_9a-Kiq3WD4rFr0o3Nf0',
      imageAlt: 'Citizen reporting problem with voice',
      badge: 'TARA AI Auto-Transcribe ✓',
      badgeClass: 'deployed',
      subText: 'Intake Mode: Voice Audio (Santali / Hindi)'
    },
    industry: {
      tag: 'Pillar 04 · Scale & Incubate',
      title: 'Co-fund student prototypes and license state-tested IP.',
      desc: 'Industrial enterprises, mining firms, and tech leaders direct CSR capital directly into high-impact academic solutions, recruit verified engineering talent, and accelerate field deployments.',
      ctaText: 'Partner as CSR Investor',
      ctaRoute: '/industry/dashboard',
      points: [
        {
          title: 'Co-Fund University Projects',
          sub: 'Channel CSR capital into high-impact student prototypes with full milestone telemetry and audited accounting.'
        },
        {
          title: 'Tech Transfer & IP Licensing',
          sub: 'License validated university technologies and hire the student innovators who built and field-tested them.'
        },
        {
          title: 'Scalable Manufacturing',
          sub: 'Transition successful lab prototypes into mass-manufactured civic products for statewide deployment.'
        }
      ],
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1XycpRsjWoLHjTyyh94JygZfBKe0Q_37yfE0rT4dyEwkXS6DQSY9B9E7FpB2_m_50P3mjQzbrHOU5wyJa8CJpIeG9xfYqFAK7np3-YGBF97mTSbnsDamU0A4nXRDQCnpkrCnJdvftzHbjkN-XusJleqT27rM4taeM4vwoxY0h813jZZVkwNZDn2jzgoije-er98UucTZ42enmlCUA7MgeRuBbuX6JnSdoFlWpjXlj91jQZYNZm1ff1hWQps',
      imageAlt: 'Industry engineer collaborating with resident',
      badge: 'Clean Water Rollout Completed',
      badgeClass: 'deployed',
      subText: 'Corporate Partner: Tata Steel CSR Initiative'
    }
  };

  return (
    <div className="setu-landing-canvas setu-grid-pattern">
      {/* Ambient Lighting Layers */}
      <div className="setu-landing-glow-top" />
      <div className="setu-landing-glow-side" />

      {/* ================================================================= */}
      {/* 1. HERO SECTION                                                   */}
      {/* ================================================================= */}
      <section className="setu-landing-section setu-landing-section-hero">
        <div className="setu-hero-split-grid">
          
          {/* Left Column: Heading, Subtitle, CTA, Stats */}
          <div className="setu-hero-left">
            {/* Main Title */}
            <h1 className="setu-hero-title">
              Solving Real-World Challenges with{' '}
              <span className="setu-hero-underline">University Innovation</span>.
            </h1>

            {/* Sub-headline */}
            <p className="setu-hero-subtitle">
              The Government of Jharkhand’s digital bridge that turns community problems into funded university R&amp;D challenges—giving student innovators real-world problems to solve and the state grants to build them.
            </p>

            {/* Single Primary CTA matching Stitch */}
            <div style={{ width: '100%', marginBottom: '2.5rem' }}>
              <Link
                to="/citizen"
                className="setu-btn-primary"
                style={{
                  fontSize: '1rem',
                  padding: '1rem 2rem',
                  borderRadius: '0.85rem',
                  display: 'inline-flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <span>Get Started with Setu</span>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Key Stats / Value Proof Cards */}
            <div className="setu-hero-stats-strip">
              <div className="setu-hero-stat-col">
                <span className="setu-hero-stat-value">100% Web</span>
                <span className="setu-hero-stat-desc">Instant browser access, zero install</span>
              </div>
              <div className="setu-hero-stat-col">
                <span className="setu-hero-stat-value">Direct Grants</span>
                <span className="setu-hero-stat-desc">Milestone student prototype funds</span>
              </div>
              <div className="setu-hero-stat-col">
                <span className="setu-hero-stat-value">Field Deployed</span>
                <span className="setu-hero-stat-desc">Lab prototype to village rollout</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mac-Style Live Civic Bridge Card */}
          <div className="setu-hero-right">
            <div className="setu-hero-mac-card">
              
              {/* Window Header */}
              <div className="setu-mac-titlebar">
                <div className="setu-traffic-lights">
                  <span className="setu-traffic-dot dot-red" />
                  <span className="setu-traffic-dot dot-yellow" />
                  <span className="setu-traffic-dot dot-green" />
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#A3A3A3', marginLeft: '0.5rem' }}>
                    Setu. Live Civic Bridge
                  </span>
                </div>
              </div>

              {/* Authentic Editorial Illustration (University Lab & Students) */}
              <div className="setu-hero-image-box">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1WP8FP4pozsyhKFGV0B5QIN3WtM7-0lPUZHhK2q67Hn4oSYSRNoTz8e9VuM-QXnEcZaS7F9FNvwd9gkpcAAi9i4Ui70Mk-JcFWBeYvRqkPvgXG9GUCcv0xX7-VuEFjO_UCjebLOvNNUm2Uqay1v5MZvCdiRIFHGF9uQx0gTjx8OJxCWMmxkVVPAPu2Weg0EX84Wlj64qkkCUMcwv6gu-62uGuJ_cZbJVBHHLwOs_41SpAw8i9MUhWk0ncA"
                  alt="Jharkhand University students collaborating on real-world engineering challenges"
                  loading="eager"
                />
                
                {/* Overlay Card */}
                <div className="setu-image-overlay-pill">
                  <div>
                    <p className="setu-overlay-title">BIT Mesra · Water Tech Lab</p>
                    <p className="setu-overlay-subtitle">Working on Fluoride filtration for Bero Block</p>
                  </div>
                </div>
              </div>

              {/* Micro-Interaction Live Feed Items */}
              <div className="setu-hero-feed-list">
                <div className="setu-hero-feed-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="setu-feed-icon-badge">🌾</div>
                    <div>
                      <h4 className="setu-feed-item-title">Paddy Leaf Blight Diagnostics</h4>
                      <p className="setu-feed-item-sub">Ormanjhi, Ranchi · Birsa Agricultural University</p>
                    </div>
                  </div>
                  <span className="setu-feed-pill-stage">Field Trial</span>
                </div>

                <div className="setu-hero-feed-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="setu-feed-icon-badge">☀️</div>
                    <div>
                      <h4 className="setu-feed-item-title">Solar Micro-Grid Inverter Repair</h4>
                      <p className="setu-feed-item-sub">Govindpur, Dhanbad · IIT (ISM) Dhanbad</p>
                    </div>
                  </div>
                  <span className="setu-feed-pill-stage deployed">Deployed</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. CORE PHILOSOPHY SECTION ("Learning Through Real Impact")        */}
      {/* ================================================================= */}
      <section id="philosophy" className="setu-landing-section" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5' }}>
        <div className="setu-section-header">
          <span className="setu-eyebrow">The Core Philosophy</span>
          <h2 className="setu-section-title">"Learning Through Real Impact"</h2>
          <p className="setu-section-description">
            Why SETU is fundamentally different from traditional grievance portals. We replace endless bureaucratic queues with dynamic academic research squads and verified milestone funding.
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="setu-philosophy-grid">
          {/* Pillar 1: Academic Win */}
          <div className="setu-philosophy-card">
            <div>
              <div className="setu-card-icon-box">🎓</div>
              <span className="setu-card-beneficiary">For Students &amp; Faculty</span>
              <h3 className="setu-card-title">The Academic Win</h3>
              <p className="setu-card-body">
                Engineering and science students move beyond textbook assignments. They gain rigorous project-based problem solving experience, publish verifiable research credentials, file state patents, and build real hardware &amp; software prototypes with government funding.
              </p>
            </div>
            <div className="setu-card-footer-link">
              <span>Real CV credentials &amp; grants</span>
              <span>→</span>
            </div>
          </div>

          {/* Pillar 2: Governance Win */}
          <div className="setu-philosophy-card">
            <div>
              <div className="setu-card-icon-box">🏛️</div>
              <span className="setu-card-beneficiary">For State Departments</span>
              <h3 className="setu-card-title">The Governance Win</h3>
              <p className="setu-card-body">
                Government line departments (Drinking Water &amp; Sanitation, Agriculture, Renewable Energy, Health) get low-cost, hyper-localized R&amp;D solutions tailored to Jharkhand's geography without hiring expensive multi-crore external consultancies.
              </p>
            </div>
            <div className="setu-card-footer-link">
              <span>High-efficiency state savings</span>
              <span>→</span>
            </div>
          </div>

          {/* Pillar 3: Citizen Win */}
          <div className="setu-philosophy-card">
            <div>
              <div className="setu-card-icon-box">👥</div>
              <span className="setu-card-beneficiary">For Local Communities</span>
              <h3 className="setu-card-title">The Citizen Win</h3>
              <p className="setu-card-body">
                Grassroots community issues don't sit stagnant in an untracked complaints ledger. An elite state university laboratory takes direct, accountable ownership of creating and testing an engineered fix for their village or town.
              </p>
            </div>
            <div className="setu-card-footer-link">
              <span>Transparent resolution loop</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. INTERACTIVE PORTALS & STAKEHOLDER WALKTHROUGH                  */}
      {/* ================================================================= */}
      <section id="pillars" className="setu-landing-section" style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E5E5E5' }}>
        <div className="setu-section-header center">
          <span className="setu-eyebrow">Stakeholder Blueprint</span>
          <h2 className="setu-section-title">Unified Portals for Every Participant</h2>
          <p className="setu-section-description">
            Explore how Setu connects citizens, students, government nodal officers, and CSR partners in one synchronized ecosystem.
          </p>
        </div>

        {/* Stakeholder Interactive Switcher Tabs */}
        <div className="setu-tab-switcher-apple">
          <button
            onClick={() => setActiveTab('students')}
            className={`setu-tab-apple-btn ${activeTab === 'students' ? 'active' : ''}`}
          >
            <span>🎓</span>
            <span>Students &amp; Labs</span>
          </button>
          <button
            onClick={() => setActiveTab('govt')}
            className={`setu-tab-apple-btn ${activeTab === 'govt' ? 'active' : ''}`}
          >
            <span>🏛️</span>
            <span>Govt Nodal</span>
          </button>
          <button
            onClick={() => setActiveTab('citizens')}
            className={`setu-tab-apple-btn ${activeTab === 'citizens' ? 'active' : ''}`}
          >
            <span>📱</span>
            <span>Citizens &amp; Wards</span>
          </button>
          <button
            onClick={() => setActiveTab('industry')}
            className={`setu-tab-apple-btn ${activeTab === 'industry' ? 'active' : ''}`}
          >
            <span>🏢</span>
            <span>Industry &amp; CSR</span>
          </button>
        </div>

        {/* Active Tab Pane Showcase */}
        <div className="setu-tab-pane">
          <div className="setu-tab-split">
            {/* Left Column: Details & Benefits */}
            <div>
              <div className="setu-tab-tag">{STAKEHOLDERS[activeTab].tag}</div>
              <h3 className="setu-tab-heading">{STAKEHOLDERS[activeTab].title}</h3>
              <p className="setu-tab-desc">{STAKEHOLDERS[activeTab].desc}</p>

              <ul className="setu-checklist">
                {STAKEHOLDERS[activeTab].points.map((pt, i) => (
                  <li key={i} className="setu-check-item">
                    <span className="setu-check-circle">✓</span>
                    <div>
                      <strong className="setu-check-title">{pt.title}</strong>
                      <span className="setu-check-sub">{pt.sub}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div style={{ paddingTop: '0.5rem' }}>
                <Link
                  to={STAKEHOLDERS[activeTab].ctaRoute}
                  className="setu-btn-primary"
                  style={{ fontSize: '0.75rem', padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}
                >
                  <span>{STAKEHOLDERS[activeTab].ctaText}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Visual */}
            <div>
              {STAKEHOLDERS[activeTab].customRight ? (
                STAKEHOLDERS[activeTab].customRight
              ) : (
                <div className="setu-tab-visual-card">
                  <div className="setu-tab-visual-image-wrap">
                    <img src={STAKEHOLDERS[activeTab].image} alt={STAKEHOLDERS[activeTab].imageAlt} />
                  </div>
                  <div className="setu-tab-visual-footer">
                    <span>{STAKEHOLDERS[activeTab].subText || ''}</span>
                    <span className={`setu-feed-pill-stage ${STAKEHOLDERS[activeTab].badgeClass || ''}`}>
                      {STAKEHOLDERS[activeTab].badge}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. THE 4-STEP PROBLEM-TO-DEPLOYMENT PIPELINE                      */}
      {/* ================================================================= */}
      <section id="pipeline" className="setu-landing-section" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5' }}>
        <div className="setu-section-header">
          <span className="setu-eyebrow">Lifecycle Workflow</span>
          <h2 className="setu-section-title">The 4-Step Problem-to-Deployment Pipeline</h2>
          <p className="setu-section-description">
            A transparent, accountable bridge carrying every issue from grassroots discovery to certified public delivery.
          </p>
        </div>

        {/* 4 Steps Grid directly matching Stitch */}
        <div className="setu-pipeline-grid">
          {/* Step 1 */}
          <div className="setu-stage-card">
            <div>
              <div className="setu-stage-header">
                <span className="setu-stage-number">01</span>
                <span className="setu-stage-tag">Discovery</span>
              </div>
              <h3 className="setu-stage-title">Grassroots Intake</h3>
              <p className="setu-stage-desc">
                A citizen or ward councillor logs a local challenge (e.g. arsenic/fluoride in drinking tubewells, paddy blights, or micro-grid failures) using simple voice or photo capture.
              </p>
            </div>
            <div className="setu-stage-footer">
              <span>TARA AI Intake</span>
              <span style={{ fontWeight: '600', color: '#0A0A0A' }}>Geotagged ✓</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="setu-stage-card">
            <div>
              <div className="setu-stage-header">
                <span className="setu-stage-number">02</span>
                <span className="setu-stage-tag">Validation</span>
              </div>
              <h3 className="setu-stage-title">Govt State Challenge</h3>
              <p className="setu-stage-desc">
                The Department Nodal Desk reviews clustered reports, verifies the civic urgency, and officially creates a funded State R&amp;D Challenge with earmarked grant budgets.
              </p>
            </div>
            <div className="setu-stage-footer">
              <span>Grant Earmark</span>
              <span style={{ fontWeight: '600', color: '#0A0A0A' }}>Nodal Approved ✓</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="setu-stage-card">
            <div>
              <div className="setu-stage-header">
                <span className="setu-stage-number">03</span>
                <span className="setu-stage-tag">R&amp;D</span>
              </div>
              <h3 className="setu-stage-title">University Innovation</h3>
              <p className="setu-stage-desc">
                University SPOCs form student/faculty squads. The team designs, builds, and tests prototypes in university labs, uploading telemetry for milestone releases.
              </p>
            </div>
            <div className="setu-stage-footer">
              <span>Lab Prototyping</span>
              <span style={{ fontWeight: '600', color: '#0A0A0A' }}>Milestone Tranches ✓</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="setu-stage-card">
            <div>
              <div className="setu-stage-header">
                <span className="setu-stage-number">04</span>
                <span className="setu-stage-tag">Outcome</span>
              </div>
              <h3 className="setu-stage-title">Verified Deployment</h3>
              <p className="setu-stage-desc">
                The finished hardware or system is installed in the target village or ward, field-tested by residents, and signed off by district authorities with full public audit trails.
              </p>
            </div>
            <div className="setu-stage-footer">
              <span>Public Impact</span>
              <span style={{ fontWeight: '700', color: '#047857' }}>Certified Live ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. TECHNICAL HIGHLIGHTS (BUILT FOR BHARAT)                         */}
      {/* ================================================================= */}
      <section id="specs" className="setu-landing-section" style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #E5E5E5' }}>
        <div className="setu-section-header">
          <span className="setu-eyebrow">Engineering Architecture</span>
          <h2 className="setu-section-title">Built for Bharat: High-Performance Technical Stack</h2>
          <p className="setu-section-description">
            Designed specifically for rural connectivity constraints, diverse Indian dialects, and transparent grant stewardship.
          </p>
        </div>

        {/* 3 Tech Cards directly matching Stitch */}
        <div className="setu-specs-grid">
          {/* Tech Feature 1 */}
          <div className="setu-spec-card">
            <div>
              <div className="setu-spec-icon-box">⚡</div>
              <h3 className="setu-card-title">Zero-Install Web App</h3>
              <p className="setu-card-body">
                Functions seamlessly on low-cost Android 4G smartphones via standard Chrome or browser engines without requiring Google Play Store downloads or device storage overhead.
              </p>
            </div>
            <div className="setu-spec-tag-list">
              <span className="setu-spec-tag">PWA Offline Sync</span>
              <span className="setu-spec-tag">&lt; 1.2MB Bundle</span>
            </div>
          </div>

          {/* Tech Feature 2 */}
          <div className="setu-spec-card">
            <div>
              <div className="setu-spec-icon-box">🤖</div>
              <h3 className="setu-card-title">AI Matchmaking Engine</h3>
              <p className="setu-card-body">
                Natural Language Processing models match complex unstructured citizen descriptions (in Hindi, Santali, or Khortha) directly with university department faculty specializations and verified lab equipment.
              </p>
            </div>
            <div className="setu-spec-tag-list">
              <span className="setu-spec-tag">Bhashini AI Core</span>
              <span className="setu-spec-tag">Dialect Transcribe</span>
            </div>
          </div>

          {/* Tech Feature 3 */}
          <div className="setu-spec-card">
            <div>
              <div className="setu-spec-icon-box">🛡️</div>
              <h3 className="setu-card-title">Milestone Proof-of-Work</h3>
              <p className="setu-card-body">
                Cryptographic timestamping, GPS EXIF verification, and IoT sensor telemetry required for student grant tranches. Nodal review portals ensure verifiable delivery before state funds release.
              </p>
            </div>
            <div className="setu-spec-tag-list">
              <span className="setu-spec-tag">EXIF Tamper Check</span>
              <span className="setu-spec-tag">DBT Grant API</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. BOTTOM ACTION HERO / LAUNCH PORTALS                            */}
      {/* ================================================================= */}
      <section id="launch" className="setu-landing-section" style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          
          <h2 className="setu-launch-hero-title">
            Connect Your Community or Lab to Setu.
          </h2>

          <p className="setu-launch-hero-subtitle">
            Whether you are a citizen reporting an infrastructural bottleneck or a student researcher ready to build a state-funded solution, Setu bridges the gap today.
          </p>

          {/* Single "Let's go" Button directly matching Stitch */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/citizen"
              className="setu-launch-btn-primary"
            >
              Let's go
            </Link>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#737373', marginTop: '2.5rem', marginBottom: 0 }}>
            Government of Jharkhand · Supported by State Universities &amp; CSR Industry Partners
          </p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. FOOTER                                                         */}
      {/* ================================================================= */}
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E5E5', padding: '3rem 2rem', fontSize: '0.75rem', color: '#525252' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.04em', color: '#0A0A0A' }}>
                Setu.
              </span>
              <span style={{ color: '#D4D4D4' }}>|</span>
              <span style={{ fontSize: '0.75rem', color: '#737373' }}>
                Department of Higher &amp; Technical Education, Government of Jharkhand
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="#" style={{ color: '#525252', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: '#525252', textDecoration: 'none' }}>DBT Guidelines</a>
              <a href="#" style={{ color: '#525252', textDecoration: 'none' }}>University Accreditation</a>
              <a href="#" style={{ color: '#525252', textDecoration: 'none' }}>Support &amp; Help Desk</a>
            </div>

            <div style={{ color: '#A3A3A3', whiteSpace: 'nowrap' }}>
              © 2025 Setu Jharkhand. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
