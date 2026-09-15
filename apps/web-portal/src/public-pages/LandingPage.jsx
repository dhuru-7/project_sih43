import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleIcon } from '../components/ui/GoogleIcon';
import '../styles/landing.css';

export const LandingPage = () => {
  // Hero Interactive Simulation State
  const [heroMode, setHeroMode] = useState('voice'); // 'voice' | 'video'
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(true);

  // 4 Stakeholders Tab State
  const [activePortal, setActivePortal] = useState('citizen'); // 'citizen' | 'govt' | 'university' | 'industry'

  const handleTriggerSimulation = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
    }, 1200);
  };

  // Portal Tab Details
  const PORTAL_DATA = {
    citizen: {
      title: 'Citizens, Schools, NGOs & Local Bodies',
      desc: 'Report community bottlenecks in seconds through voice or media. Receive real-time updates and communicate directly with municipal officers.',
      features: [
        '3-step intake: Speak or snap photos without manual typing',
        'Direct two-way messaging with assigned municipal engineers',
        'Explore feed: Official government awareness campaigns and civic updates',
        'Call Tara anytime for voice updates or hands-free in-app assistance'
      ],
      ctaText: 'Open Citizen Portal',
      ctaLink: '/citizen',
      mockupTitle: 'Citizen Active Grievance',
      mockupBadge: 'Under Review',
      mockupContent: {
        title: 'Drinking Water Contamination in Ward 8',
        meta1: 'Reported via Voice · 14 mins ago',
        meta2: 'Assigned to: Ranchi Municipal Corp · Public Health Desk',
        extra: 'Tara placed verification call to reporter · Confirmed turbidity'
      }
    },
    govt: {
      title: 'Government Administration & Nodal Officers',
      desc: 'Centralized command center that clusters identical grievances, automates citizen follow-ups through Tara, and delegates engineering challenges to universities.',
      features: [
        'AI deduplication clustering similar citizen complaints into single challenges',
        'Single-click automated Tara follow-up calls to gather status updates from citizens',
        'Intelligent routing to university departments with verified laboratory equipment',
        'Milestone validation, financial grant disbursement, and certificate issuance'
      ],
      ctaText: 'Access Government Dashboard',
      ctaLink: '/government/dashboard',
      mockupTitle: 'Nodal Command Desk',
      mockupBadge: '42 Issues Clustered',
      mockupContent: {
        title: 'Cluster #14: Subarnarekha Basin Fluoride Filtration',
        meta1: '18 citizen reports merged into 1 State Challenge',
        meta2: 'Recommended: BIT Mesra Environmental Lab',
        extra: 'Seed grant allocation: ₹4.5 Lakhs approved for prototype phase'
      }
    },
    university: {
      title: 'University SPOCs, Faculty & Student Innovators',
      desc: 'Turn state-forwarded challenges into funded academic projects. Form multi-disciplinary student squads and develop working physical prototypes.',
      features: [
        'SPOC console to review challenges forwarded by government departments',
        'Student team leads receive dedicated credentials to submit development milestones',
        'Verifiable milestone tracking unlocking tranche-based grant funding',
        'Dual institutional verification by university SPOC and state nodal officers'
      ],
      ctaText: 'University R&D Portal',
      ctaLink: '/university/dashboard',
      mockupTitle: 'Innovation Squad Console',
      mockupBadge: 'Milestone 2 Verified',
      mockupContent: {
        title: 'Low-Cost Arsenic Filter Cartridge (IIT ISM Dhanbad)',
        meta1: 'Mentor: Dr. S. K. Roy · 4 Student Engineers',
        meta2: 'Field Testing: Govindpur Ward · Lab Telemetry Verified',
        extra: 'Eligible for Phase 3 State Grant Disbursement'
      }
    },
    industry: {
      title: 'Industry, CSR Funds & Venture Capital',
      desc: 'Channel CSR capital directly into high-impact, verified student prototypes. Recruit vetted engineering talent and accelerate field deployments.',
      features: [
        'Domain-matching algorithm recommending projects tailored to corporate CSR mandates',
        'Full visibility into prototypes verified by both university SPOCs and government',
        'Direct co-funding options and joint industry-government certification',
        'High-impact showcase boosting credibility and deployment scale'
      ],
      ctaText: 'Industry & CSR Portal',
      ctaLink: '/industry/dashboard',
      mockupTitle: 'CSR Allocation Desk',
      mockupBadge: 'Match 94%',
      mockupContent: {
        title: 'Solar Micro-Grid Inverter Firmware Deployment',
        meta1: 'Domain: Renewable Energy & Rural Electrification',
        meta2: 'Co-funding Partner: Tata Steel CSR Initiative',
        extra: 'Impact: 3 Villages Powered · Joint Certification Issued'
      }
    }
  };

  return (
    <div className="setu-canvas setu-grid-texture">
      {/* ================================================================= */}
      {/* 1. HERO SECTION                                                   */}
      {/* ================================================================= */}
      <section className="setu-section">
        <div className="setu-hero-grid">
          {/* Left Hero Column */}
          <div>
            <h1 className="setu-hero-h1">
              Speak or record. Civic problems turned into working solutions.
            </h1>
            <p className="setu-hero-sub">
              Citizens report in seconds. Municipalities coordinate. University labs engineer the prototypes. Industry funds deployment.
            </p>

            <div className="setu-hero-actions">
              <Link to="/citizen" className="setu-btn setu-btn-primary">
                <span>Report an Issue</span>
                <GoogleIcon name="arrow_forward" size={16} color="#ffffff" />
              </Link>
              <a href="#portals" className="setu-btn setu-btn-secondary">
                <span>Explore Portals</span>
              </a>
            </div>

            <div className="setu-hero-meta-row">
              <div className="setu-hero-meta-item">
                <span className="setu-hero-meta-value">15s</span>
                <span className="setu-hero-meta-label">Average Voice Intake</span>
              </div>
              <div className="setu-hero-meta-item">
                <span className="setu-hero-meta-value">Sarvam 105B</span>
                <span className="setu-hero-meta-label">Cognitive Triage Brain</span>
              </div>
              <div className="setu-hero-meta-item">
                <span className="setu-hero-meta-value">100% Web</span>
                <span className="setu-hero-meta-label">Mobile &amp; Desktop Ready</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Interactive Tara Live Simulation */}
          <div>
            <div className="setu-tara-widget">
              <div className="setu-tara-titlebar">
                <div className="setu-mac-dots">
                  <span className="setu-mac-dot red" />
                  <span className="setu-mac-dot yellow" />
                  <span className="setu-mac-dot green" />
                </div>
                <div className="setu-widget-status">
                  <span className="setu-status-pulse" />
                  <span>Tara Live Engine</span>
                </div>
              </div>

              <div className="setu-tara-widget-body">
                {/* Mode Selector */}
                <div className="setu-widget-controls">
                  <button
                    type="button"
                    onClick={() => {
                      setHeroMode('voice');
                      handleTriggerSimulation();
                    }}
                    className={`setu-widget-control-btn ${heroMode === 'voice' ? 'active' : ''}`}
                  >
                    <GoogleIcon name="mic" size={16} />
                    <span>Voice Note (Saaras v3)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHeroMode('video');
                      handleTriggerSimulation();
                    }}
                    className={`setu-widget-control-btn ${heroMode === 'video' ? 'active' : ''}`}
                  >
                    <GoogleIcon name="videocam" size={16} />
                    <span>Video Evidence (Vision)</span>
                  </button>
                </div>

                {/* Input Simulation Display */}
                {heroMode === 'voice' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                      <span>Input: Audio (Ranchi Vernacular Hindi)</span>
                      <span>0:08s</span>
                    </div>
                    <div className="setu-audio-waveform">
                      <div className="setu-wave-bar" style={{ animationDelay: '0.1s' }} />
                      <div className="setu-wave-bar" style={{ animationDelay: '0.3s' }} />
                      <div className="setu-wave-bar" style={{ animationDelay: '0.15s' }} />
                      <div className="setu-wave-bar" style={{ animationDelay: '0.4s' }} />
                      <div className="setu-wave-bar" style={{ animationDelay: '0.2s' }} />
                      <div className="setu-wave-bar" style={{ animationDelay: '0.5s' }} />
                      <div className="setu-wave-bar" style={{ animationDelay: '0.25s' }} />
                      <div className="setu-wave-bar" style={{ animationDelay: '0.35s' }} />
                      <span style={{ fontSize: '0.75rem', color: '#4b5563', marginLeft: '0.5rem', fontStyle: 'italic' }}>
                        "Ward 4 mein main road par pipe phat gaya hai, do din se paani beh raha hai..."
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                      <span>Input: Camera Video Frame Analysis</span>
                      <span>1080p @ 30fps</span>
                    </div>
                    <div style={{
                      height: '42px',
                      background: '#f4f4f5',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 1rem',
                      gap: '8px',
                      fontSize: '0.75rem',
                      color: '#059669',
                      fontWeight: '600'
                    }}>
                      <GoogleIcon name="visibility" size={16} color="#059669" />
                      <span>Vision Model: 42cm pavement fracture &amp; high-pressure potable water leak detected</span>
                    </div>
                  </div>
                )}

                {/* Synthesis Output */}
                <div className="setu-synthesis-card">
                  <div className="setu-synthesis-header">
                    <div>
                      <span style={{ fontSize: '0.6875rem', color: '#059669', fontWeight: '700', textTransform: 'uppercase' }}>
                        {isSimulating ? 'Sarvam 105B Reasoning...' : 'Synthesized by Sarvam 105B'}
                      </span>
                      <h4 className="setu-synthesis-title">
                        {heroMode === 'voice'
                          ? 'Main Road Potable Water Pipeline Rupture & Localized Flooding'
                          : 'Severe Pavement Fracture and Potable Main Line Burst'}
                      </h4>
                    </div>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: '700',
                      background: '#fee2e2',
                      color: '#b91c1c',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap'
                    }}>
                      High Urgency
                    </span>
                  </div>

                  <div className="setu-synthesis-meta-grid">
                    <div className="setu-meta-row">
                      <span className="setu-meta-k">Category</span>
                      <span className="setu-meta-v">Water Resources &amp; Infrastructure</span>
                    </div>
                    <div className="setu-meta-row">
                      <span className="setu-meta-k">Location</span>
                      <span className="setu-meta-v">Ward 4, Ranchi District</span>
                    </div>
                    <div className="setu-meta-row">
                      <span className="setu-meta-k">Action Desk</span>
                      <span className="setu-meta-v">Ranchi Municipal Corp</span>
                    </div>
                    <div className="setu-meta-row">
                      <span className="setu-meta-k">Academic Match</span>
                      <span className="setu-meta-v">BIT Mesra Civil &amp; Hydro Lab</span>
                    </div>
                  </div>
                </div>

                {/* Action Trigger in Widget */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={handleTriggerSimulation}
                    disabled={isSimulating}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#2563eb',
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <GoogleIcon name="refresh" size={14} color="#2563eb" />
                    <span>{isSimulating ? 'Processing...' : 'Re-run Model Extraction'}</span>
                  </button>
                </div>

                {/* Subtle chromatic perimeter aura */}
                <div className="setu-tara-mini-aura" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="setu-divider" />

      {/* ================================================================= */}
      {/* 2. THE 3-STEP CITIZEN FLOW                                        */}
      {/* ================================================================= */}
      <section id="how-it-works" className="setu-section">
        <div className="setu-headline-block">
          <h2 className="setu-h2">Three steps from problem to verified dispatch.</h2>
          <p className="setu-sub">
            Designed for zero barrier to entry. No government forms, no complicated drop-down menus, no required typing.
          </p>
        </div>

        <div className="setu-steps-grid">
          {/* Step 1 */}
          <div className="setu-step-card">
            <div>
              <span className="setu-step-num">01 / INTAKE</span>
              <h3 className="setu-step-title">Record or Attach</h3>
              <p className="setu-step-desc">
                Tap the record button to speak naturally in your local dialect, or attach camera photos and videos directly from your mobile or desktop gallery.
              </p>
            </div>
            <div className="setu-step-footer">
              <GoogleIcon name="mic" size={16} color="#059669" />
              <span>Speech &amp; Gallery Evidence</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="setu-step-card">
            <div>
              <span className="setu-step-num">02 / ANALYSIS</span>
              <h3 className="setu-step-title">Autonomous Extraction</h3>
              <p className="setu-step-desc">
                Saaras v3 transcribes Indian accents. Sarvam 105B structures the title, category, severity, and urgency. Computer Vision inspects video frames for structural defects.
              </p>
            </div>
            <div className="setu-step-footer">
              <GoogleIcon name="neurology" size={16} color="#2563eb" />
              <span>Saaras v3 + Sarvam 105B</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="setu-step-card">
            <div>
              <span className="setu-step-num">03 / DISPATCH</span>
              <h3 className="setu-step-title">Instant Civic Routing</h3>
              <p className="setu-step-desc">
                The structured issue is published to the public grid, clustered with similar municipal reports, and forwarded to authorized government officers and university labs.
              </p>
            </div>
            <div className="setu-step-footer">
              <GoogleIcon name="check_circle" size={16} color="#059669" />
              <span>Verified &amp; Geotagged</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="setu-divider" />

      {/* ================================================================= */}
      {/* 3. MEET TARA - THE AGENT CONSTELLATION                            */}
      {/* ================================================================= */}
      <section id="tara-ai" className="setu-section">
        <div className="setu-headline-block">
          <h2 className="setu-h2">Meet Tara: The Agent Constellation.</h2>
          <p className="setu-sub">
            One unified conversational interface backed by specialized state-of-the-art models working in unison.
          </p>
        </div>

        <div className="setu-tara-bento">
          {/* Card 1: Saaras v3 Speech */}
          <div className="setu-bento-card">
            <div>
              <div className="setu-bento-icon">
                <GoogleIcon name="record_voice_over" size={24} />
              </div>
              <h3 className="setu-bento-title">Saaras v3 Speech Engine</h3>
              <p className="setu-bento-desc">
                Engineered specifically for Indian regional dialects, colloquial expressions, and state accents. Accurately understands spoken Hindi, Khortha, Santali, and Nagpuri even in noisy ambient environments.
              </p>
            </div>
            <span className="setu-bento-spec">STT Model: saaras:v3</span>
          </div>

          {/* Card 2: Sarvam 105B Reasoning */}
          <div className="setu-bento-card setu-bento-card-dark">
            <div>
              <div className="setu-bento-icon">
                <GoogleIcon name="psychology" size={24} />
              </div>
              <h3 className="setu-bento-title">Sarvam 105B Cognitive Brain</h3>
              <p className="setu-bento-desc">
                India's high-capacity foundation model for deep reasoning. Performs instantaneous duplicate clustering, urgency ranking, departmental triage, and academic laboratory matchmaking.
              </p>
            </div>
            <span className="setu-bento-spec">Reasoning Core: Sarvam 105B</span>
          </div>

          {/* Card 3: Computer Vision */}
          <div className="setu-bento-card">
            <div>
              <div className="setu-bento-icon">
                <GoogleIcon name="camera" size={24} />
              </div>
              <h3 className="setu-bento-title">Multimodal Computer Vision</h3>
              <p className="setu-bento-desc">
                Inspects uploaded videos and photos frame by frame. Captures physical nuances the citizen may not have verbalized, such as road crack depths, structural erosion, or electrical wire hazards.
              </p>
            </div>
            <span className="setu-bento-spec">Vision: Keyframe Semantic Classifier</span>
          </div>

          {/* Card 4: Voice Calling & App Takeover */}
          <div className="setu-bento-card">
            <div>
              <div className="setu-bento-icon">
                <GoogleIcon name="phone_in_talk" size={24} />
              </div>
              <h3 className="setu-bento-title">Autonomous Calling &amp; App Control</h3>
              <p className="setu-bento-desc">
                Citizens can voice-call Tara anytime for progress updates or hands-free app navigation (adjusting font size, reading messages). Government officers can command Tara to call all reporters of an issue to verify resolution status.
              </p>
            </div>
            <span className="setu-bento-spec">Voice Agent: Two-Way Telephony &amp; DOM Control</span>
          </div>
        </div>
      </section>

      <hr className="setu-divider" />

      {/* ================================================================= */}
      {/* 4. FOUR STAKEHOLDER PORTALS (TABBED SWITCHER)                     */}
      {/* ================================================================= */}
      <section id="portals" className="setu-section">
        <div className="setu-headline-block">
          <h2 className="setu-h2">A unified ecosystem for four stakeholders.</h2>
          <p className="setu-sub">
            Tailored consoles connecting grassroots citizens, public administrators, university researchers, and industry leaders.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="setu-tabs-container">
          <button
            type="button"
            onClick={() => setActivePortal('citizen')}
            className={`setu-tab-trigger ${activePortal === 'citizen' ? 'active' : ''}`}
          >
            <GoogleIcon name="person" size={18} />
            <span>Citizen Portal</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePortal('govt')}
            className={`setu-tab-trigger ${activePortal === 'govt' ? 'active' : ''}`}
          >
            <GoogleIcon name="account_balance" size={18} />
            <span>Government Officer</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePortal('university')}
            className={`setu-tab-trigger ${activePortal === 'university' ? 'active' : ''}`}
          >
            <GoogleIcon name="school" size={18} />
            <span>University R&amp;D</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePortal('industry')}
            className={`setu-tab-trigger ${activePortal === 'industry' ? 'active' : ''}`}
          >
            <GoogleIcon name="domain" size={18} />
            <span>Industry &amp; CSR</span>
          </button>
        </div>

        {/* Tab Details Box */}
        <div className="setu-portal-display-box">
          <div>
            <h3 className="setu-portal-title">{PORTAL_DATA[activePortal].title}</h3>
            <p className="setu-portal-desc">{PORTAL_DATA[activePortal].desc}</p>

            <ul className="setu-feature-list">
              {PORTAL_DATA[activePortal].features.map((feat, idx) => (
                <li key={idx} className="setu-feature-item">
                  <span className="setu-feature-check">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Link to={PORTAL_DATA[activePortal].ctaLink} className="setu-btn setu-btn-primary">
              <span>{PORTAL_DATA[activePortal].ctaText}</span>
              <GoogleIcon name="arrow_forward" size={16} color="#ffffff" />
            </Link>
          </div>

          {/* Right Mockup Preview Card */}
          <div>
            <div className="setu-mockup-card">
              <div className="setu-mockup-header">
                <span className="setu-mockup-title">{PORTAL_DATA[activePortal].mockupTitle}</span>
                <span className="setu-mockup-badge">{PORTAL_DATA[activePortal].mockupBadge}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                  {PORTAL_DATA[activePortal].mockupContent.title}
                </h4>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                  {PORTAL_DATA[activePortal].mockupContent.meta1}
                </p>
                <div style={{
                  padding: '0.75rem',
                  background: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  fontSize: '0.8125rem',
                  color: '#374151'
                }}>
                  <strong style={{ color: '#111827' }}>Status: </strong>
                  {PORTAL_DATA[activePortal].mockupContent.meta2}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600', margin: '0.25rem 0 0 0' }}>
                  ⚡ {PORTAL_DATA[activePortal].mockupContent.extra}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="setu-divider" />

      {/* ================================================================= */}
      {/* 5. EXPLORE FEED & COMMUNITY AWARENESS SHOWCASE                     */}
      {/* ================================================================= */}
      <section id="explore" className="setu-section">
        <div className="setu-headline-block">
          <h2 className="setu-h2">Explore Feed: Civic education &amp; progress spotlight.</h2>
          <p className="setu-sub">
            Government departments run official awareness campaigns, share educational advisories, and celebrate verified student solutions deployed across the state.
          </p>
        </div>

        <div className="setu-explore-grid">
          {/* Post 1 */}
          <div className="setu-explore-card">
            <div className="setu-explore-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&q=80"
                alt="Civic clean water initiative"
                className="setu-explore-img"
              />
            </div>
            <div className="setu-explore-content">
              <div>
                <span className="setu-explore-author">Drinking Water &amp; Sanitation Dept · Ranchi</span>
                <h4 className="setu-explore-card-title">Clean Groundwater Filtration Pilot Launched in Bero Block</h4>
                <p className="setu-explore-card-desc">
                  Following 42 clustered citizen reports on tubewell fluoride levels, BIT Mesra water researchers have deployed an autonomous testing unit.
                </p>
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                <span>Official Campaign</span>
                <span style={{ color: '#059669', fontWeight: '600' }}>Active Field Trial</span>
              </div>
            </div>
          </div>

          {/* Post 2 */}
          <div className="setu-explore-card">
            <div className="setu-explore-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80"
                alt="Solar energy and infrastructure"
                className="setu-explore-img"
              />
            </div>
            <div className="setu-explore-content">
              <div>
                <span className="setu-explore-author">Energy &amp; Renewable Resources · Dhanbad</span>
                <h4 className="setu-explore-card-title">Solar Micro-Grid Telemetry Handover to Govindpur Panchayat</h4>
                <p className="setu-explore-card-desc">
                  IIT ISM Dhanbad student innovators designed a modular inverter firmware repair, eliminating recurring blackout cycles for 120 households.
                </p>
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                <span>University Prototype</span>
                <span style={{ color: '#2563eb', fontWeight: '600' }}>Govt Certified</span>
              </div>
            </div>
          </div>

          {/* Post 3 */}
          <div className="setu-explore-card">
            <div className="setu-explore-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
                alt="Public health awareness"
                className="setu-explore-img"
              />
            </div>
            <div className="setu-explore-content">
              <div>
                <span className="setu-explore-author">Health &amp; Family Welfare · Jamshedpur</span>
                <h4 className="setu-explore-card-title">Vector-Borne Disease Containment Advisory</h4>
                <p className="setu-explore-card-desc">
                  Monsoon hygiene guidelines and ward-level drainage sanitization schedules issued for urban local bodies and rural health centres.
                </p>
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                <span>Public Health Advisory</span>
                <span style={{ color: '#059669', fontWeight: '600' }}>3.2k Engaged</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="setu-divider" />

      {/* ================================================================= */}
      {/* 6. END-TO-END WORKFLOW PIPELINE                                   */}
      {/* ================================================================= */}
      <section className="setu-section">
        <div className="setu-headline-block">
          <h2 className="setu-h2">The resolution lifecycle.</h2>
          <p className="setu-sub">
            How a 15-second voice note becomes an engineered public product with state-backed accountability.
          </p>
        </div>

        <div className="setu-pipeline-row">
          <div className="setu-pipeline-node">
            <span className="setu-pipeline-index">STAGE 01</span>
            <h4 className="setu-pipeline-node-title">Citizen Intake</h4>
            <p className="setu-pipeline-node-desc">
              Voice note or gallery video uploaded. Saaras v3 transcribes dialect; Sarvam 105B structures urgency and location.
            </p>
          </div>

          <div className="setu-pipeline-node">
            <span className="setu-pipeline-index">STAGE 02</span>
            <h4 className="setu-pipeline-node-title">Triage &amp; Cluster</h4>
            <p className="setu-pipeline-node-desc">
              Identical issues merged into unified problem statements. Nodal desk reviews severity and allocates seed grant budget.
            </p>
          </div>

          <div className="setu-pipeline-node">
            <span className="setu-pipeline-index">STAGE 03</span>
            <h4 className="setu-pipeline-node-title">University R&amp;D</h4>
            <p className="setu-pipeline-node-desc">
              Assigned to university department based on lab capability. Student &amp; mentor squad builds and submits milestone telemetry.
            </p>
          </div>

          <div className="setu-pipeline-node">
            <span className="setu-pipeline-index">STAGE 04</span>
            <h4 className="setu-pipeline-node-title">Field Deployment</h4>
            <p className="setu-pipeline-node-desc">
              Prototype installed in the community. Verified by university SPOC and government. Co-funded by industry CSR.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. BOTTOM GATEWAY & LAUNCHPAD                                     */}
      {/* ================================================================= */}
      <section className="setu-section setu-section-compact">
        <div className="setu-gateway-box">
          <h2 className="setu-gateway-title">
            Ready to solve civic challenges together?
          </h2>
          <p className="setu-gateway-sub">
            Access your dedicated portal to report issues, review state challenges, or build university prototypes.
          </p>

          <div className="setu-gateway-actions">
            <Link to="/citizen" className="setu-btn setu-btn-emerald">
              <span>Citizen Portal</span>
            </Link>
            <Link to="/government/dashboard" className="setu-btn setu-btn-secondary">
              <span>Government Nodal</span>
            </Link>
            <Link to="/university/dashboard" className="setu-btn setu-btn-secondary">
              <span>University Labs</span>
            </Link>
            <Link to="/industry/dashboard" className="setu-btn setu-btn-secondary">
              <span>Industry &amp; CSR</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. MINIMALIST FOOTER                                              */}
      {/* ================================================================= */}
      <footer className="setu-footer">
        <div className="setu-footer-inner">
          <div className="setu-footer-brand">
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#111827' }}>
              Setu.
            </span>
            <span style={{ color: '#d1d5db' }}>|</span>
            <span>Government of Jharkhand · Academic &amp; Civic Innovation Platform</span>
          </div>

          <div className="setu-footer-links">
            <Link to="/citizen" className="setu-footer-link">Citizen Intake</Link>
            <Link to="/government/dashboard" className="setu-footer-link">Government Desk</Link>
            <Link to="/university/dashboard" className="setu-footer-link">University R&amp;D</Link>
            <Link to="/industry/dashboard" className="setu-footer-link">Industry CSR</Link>
          </div>

          <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Built for Smart India Hackathon · Powered by Sarvam AI &amp; Saaras v3
          </div>
        </div>
      </footer>
    </div>
  );
};
