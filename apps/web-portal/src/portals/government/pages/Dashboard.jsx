import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { JharkhandMap } from '../components/JharkhandMap';
import '../styles/governmentDashboard.css';

export const GovernmentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDistrict, setSelectedDistrict] = useState('All 24 Districts');
  const [zoomAction, setZoomAction] = useState(null);
  const [timeFilter, setTimeFilter] = useState('7 Days');
  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Dynamic Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  // Active tickets table data strictly matching Stitch screen
  const [tickets] = useState([
    {
      id: '#SETU-9842',
      title: 'Water Contamination (Fluoride & Iron)',
      desc: 'Direct pipeline rust reported by 42 families',
      district: 'Ranchi',
      ward: 'Bero Block, W-4',
      status: 'Pending',
      statusClass: 'gov-status-pending',
      authority: 'BIT Mesra Lab',
      urgency: 'HIGH',
      taraScore: 4.8,
      transcript: 'हमार गांव बेड़ो में नल से लाल गंदा पानी आ रहा है। 42 घरों में बच्चे बीमार पड़ रहे हैं। पाइपलाइन जंग लग गया है।',
      suggestedDepts: ['Dept. of Environmental Engineering', 'Water Quality R&D Wing, BIT Mesra']
    },
    {
      id: '#SETU-9841',
      title: 'Pothole & Road Collapse on Culvert',
      desc: 'NH-32 connector edge cracked after heavy rain',
      district: 'Dhanbad',
      ward: 'Govindpur Main',
      status: 'In Progress',
      statusClass: 'gov-status-progress',
      authority: 'PWD Division 2',
      urgency: 'CRITICAL',
      taraScore: 4.6,
      transcript: 'Govindpur main NH-32 connector road has caved in near the culvert. Buses and trucks are getting stuck.',
      suggestedDepts: ['Structural Engineering, IIT (ISM) Dhanbad', 'PWD District Road Wing']
    },
    {
      id: '#SETU-9839',
      title: 'Solar Micro-Grid Inverter Shutdown',
      desc: 'Tribal Residential Ashram School backup failure',
      district: 'Khunti',
      ward: 'Torpa Rural School',
      status: 'Escalated',
      statusClass: 'gov-status-escalated',
      authority: 'IIT (ISM) Dhanbad',
      urgency: 'MEDIUM',
      taraScore: 3.9,
      transcript: 'Ashram school solar inverter has tripped and batteries are overheated. Power outage for last 3 days.',
      suggestedDepts: ['Renewable Energy Innovation Centre, NIT Jamshedpur', 'Clean Power Lab']
    },
    {
      id: '#SETU-9836',
      title: 'Waste Accumulation & Drainage Clog',
      desc: 'Solid municipal waste blocking stormwater culvert',
      district: 'Jamshedpur',
      ward: 'Sakchi Market, W-14',
      status: 'Resolved',
      statusClass: 'gov-status-resolved',
      authority: 'JNAC Sanitation',
      urgency: 'LOW',
      taraScore: 2.5,
      transcript: 'Stormwater drain is completely clogged with vegetable market waste. Water is overflowing into shops.',
      suggestedDepts: ['Municipal Waste Treatment Cell', 'Urban Sanitation Taskforce']
    }
  ]);

  // Alerts data
  const [alerts, setAlerts] = useState([
    {
      id: 'alert-1',
      tag: 'Critical SLA Breach (+36h)',
      time: '10m ago',
      body: 'Water tanker deployment delayed in Bero Block, Ranchi. Drought distress recorded.',
      primaryBtn: 'Dispatch Emergency',
      secondaryBtn: 'Escalate',
      isRed: true,
      dispatched: false
    },
    {
      id: 'alert-2',
      tag: 'High Voltage Snap Hazard',
      time: '45m ago',
      body: 'Live 11kV wire fallen across pathway near Torpa School, Khunti.',
      primaryBtn: 'Track Lineman',
      secondaryBtn: 'Verify Trip',
      isRed: true,
      dispatched: false
    },
    {
      id: 'alert-3',
      tag: 'Cluster Spike: Drainage Overflow',
      time: '1h ago',
      body: '18 complaints clustered in Dhanbad Sector 4. Municipal vacuum team dispatched.',
      primaryBtn: 'Dispatch Vacuum',
      secondaryBtn: 'Verify Status',
      isRed: true,
      dispatched: false
    }
  ]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAlertAction = (alertId, actionName) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, dispatched: true } : a))
    );
    triggerToast(`✓ Executed: ${actionName} for alert [${alertId}]`);
  };

  const handleExportCSV = (e) => {
    e.preventDefault();
    const headers = 'Ticket ID,Title,Category,District,Ward,Status,Assigned Authority\n';
    const rows = tickets
      .map((t) => `"${t.id}","${t.title}","${t.title}","${t.district}","${t.ward}","${t.status}","${t.authority}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SETU_Civic_Audit_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('✓ Downloaded Setu Civic Audit CSV (14,820 Records)');
  };

  return (
    <div className="gov-main-inner" data-purpose="dashboard-content">
      {/* Dynamic Toast Pill */}
      {toastMessage && (
        <div className="gov-toast-banner">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar: Header & Controls (Strictly Matching Stitch - NO Added Subheadings) */}
      <header className="gov-header" data-purpose="page-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 className="gov-header-title">Namaste, Administrator</h1>
              </div>
            </div>

            <div className="gov-header-controls">
              {/* Language Selector */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="gov-pill-btn"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                >
                  <span className="material-symbols-outlined text-[16px] text-neutral-500">language</span>
                  <span style={{ fontWeight: '600', color: '#171717' }}>{selectedLang}</span>
                  <span className="material-symbols-outlined text-[16px] text-neutral-400">expand_more</span>
                </button>

                {isLangOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      right: 0,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                      zIndex: 50,
                      width: '130px',
                      overflow: 'hidden',
                      padding: '0.25rem'
                    }}
                  >
                    {['English', 'हिन्दी', 'संथाली', 'বাংলা'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLang(lang);
                          setIsLangOpen(false);
                          triggerToast(`Interface language set to ${lang}`);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.45rem 0.65rem',
                          fontSize: '0.75rem',
                          fontWeight: selectedLang === lang ? '700' : '500',
                          color: selectedLang === lang ? '#000' : '#4b5563',
                          backgroundColor: selectedLang === lang ? '#f3f4f6' : 'transparent',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications Button */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="gov-icon-btn"
                  title="Notifications"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="gov-notification-ping"></span>
                </button>

                {isNotifOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '1rem',
                      boxShadow: '0 20px 30px rgba(0,0,0,0.12)',
                      zIndex: 50,
                      width: '320px',
                      padding: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#111827' }}>Live System Alerts</span>
                      <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>3 new</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', padding: '0.5rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
                        <strong style={{ color: '#b91c1c' }}>SLA Escalation:</strong> Ranchi Ward 4 water tanker dispatch overdue.
                      </div>
                      <div style={{ fontSize: '0.75rem', padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe' }}>
                        <strong style={{ color: '#1d4ed8' }}>BIT Mesra:</strong> Lab submitted test report for Fluoride water sample.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ==============================================================================
              TOP KPI METRICS BAR (6 Cards Matching SCREEN_13 Aesthetic - Flat, No Lifts)
              ============================================================================== */}
          <section className="gov-metrics-grid" data-purpose="kpi-metrics-bar">
            {/* Total Reports */}
            <div className="gov-kpi-card">
              <div className="gov-kpi-header">
                <span className="gov-kpi-label">Total Reports</span>
                <span className="material-symbols-outlined text-neutral-400 text-[18px]">receipt_long</span>
              </div>
              <div className="gov-kpi-value">14,820</div>
              <div className="gov-kpi-footer">
                <span className="gov-trend-up">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +8.4% this week
                </span>
              </div>
            </div>

            {/* Pending */}
            <div className="gov-kpi-card">
              <div className="gov-kpi-header">
                <span className="gov-kpi-label">Pending</span>
                <span className="gov-dot-amber"></span>
              </div>
              <div className="gov-kpi-value">1,432</div>
              <div className="gov-kpi-footer">
                <span className="gov-kpi-subtext">Requires triage</span>
              </div>
            </div>

            {/* In Progress */}
            <div className="gov-kpi-card">
              <div className="gov-kpi-header">
                <span className="gov-kpi-label">In Progress</span>
                <span className="gov-dot-blue"></span>
              </div>
              <div className="gov-kpi-value">2,890</div>
              <div className="gov-kpi-footer">
                <span className="gov-kpi-subtext">Field verification</span>
              </div>
            </div>

            {/* Resolved */}
            <div className="gov-kpi-card">
              <div className="gov-kpi-header">
                <span className="gov-kpi-label">Resolved</span>
                <span className="gov-dot-emerald"></span>
              </div>
              <div className="gov-kpi-value">10,128</div>
              <div className="gov-kpi-footer">
                <span style={{ color: '#059669', fontWeight: '500' }}>91.2% SLA compliance</span>
              </div>
            </div>

            {/* Assigned Labs */}
            <div className="gov-kpi-card">
              <div className="gov-kpi-header">
                <span className="gov-kpi-label">Assigned Labs</span>
                <span className="gov-dot-purple"></span>
              </div>
              <div className="gov-kpi-value">370</div>
              <div className="gov-kpi-footer">
                <span className="gov-kpi-subtext">BIT, IIT ISM, BAU</span>
              </div>
            </div>

            {/* Avg. Res. Time */}
            <div className="gov-kpi-card">
              <div className="gov-kpi-header">
                <span className="gov-kpi-label">Avg. Res. Time</span>
                <span className="material-symbols-outlined text-neutral-400 text-[18px]">schedule</span>
              </div>
              <div className="gov-kpi-value">
                4.2 <span className="gov-kpi-unit">Days</span>
              </div>
              <div className="gov-kpi-footer">
                <span style={{ color: '#059669', fontWeight: '500' }}>-18% vs last month</span>
              </div>
            </div>
          </section>

          {/* ==============================================================================
              TOP GRID SECTION (Heatmap & Category Breakdown)
              ============================================================================== */}
          <section className="gov-grid-12">
            {/* Section 1: Mini District Heatmap - Jharkhand (7 cols) */}
            <div
              className="gov-card"
              style={{ gridColumn: 'span 7' }}
              data-purpose="district-heatmap"
            >
              <div className="gov-card-header">
                <div>
                  <h2 className="gov-card-title">Mini District Heatmap - Jharkhand</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      triggerToast(`Focused map view on: ${e.target.value}`);
                    }}
                    style={{
                      fontSize: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      padding: '0.35rem 0.65rem',
                      backgroundColor: '#fafafa',
                      color: '#374151',
                      fontWeight: '500',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option>All 24 Districts</option>
                    <option>Ranchi Urban & Rural</option>
                    <option>Dhanbad Coal Belt</option>
                    <option>Kolhan Division</option>
                    <option>Santhal Pargana</option>
                  </select>

                  <div style={{ display: 'inline-flex', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <button
                      type="button"
                      onClick={() => setZoomAction('in')}
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#fafafa', border: 'none', borderRight: '1px solid #e5e7eb', cursor: 'pointer' }}
                      title="Zoom In"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomAction('out')}
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#fafafa', border: 'none', cursor: 'pointer' }}
                      title="Zoom Out"
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>

              {/* Real Leaflet Map of Jharkhand Container */}
              <div className="gov-heatmap-container">
                <JharkhandMap
                  selectedDistrict={selectedDistrict}
                  zoomAction={zoomAction}
                  onSelectDistrict={(dist) => triggerToast(`Selected ${dist} district cluster on map`)}
                />

              </div>

              {/* Bottom GIS Legend matching Stitch */}
              <div className="gov-map-legend">
                <span style={{ fontSize: '11px' }}>
                  GIS Layer: <strong style={{ color: '#404040', fontWeight: '600' }}>Survey of Jharkhand WMS 2025</strong>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#a3a3a3' }}>Heat Intensity:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '11px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#fecaca', border: '1px solid #fca5a5' }}></span> Low (&lt;1k)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#f87171' }}></span> Mod
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#dc2626' }}></span> High
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#991b1b' }}></span>
                      <strong style={{ color: '#7f1d1d' }}>Critical (3k+)</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Category Breakdown (5 cols) */}
            <div
              className="gov-card"
              style={{ gridColumn: 'span 5' }}
              data-purpose="category-breakdown-chart"
            >
              <div className="gov-card-header">
                <h2 className="gov-card-title">Category Breakdown</h2>

                {/* 7 Days dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsTimeFilterOpen(!isTimeFilterOpen)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{timeFilter}</span>
                    <span className="material-symbols-outlined text-[16px] text-neutral-500">expand_more</span>
                  </button>

                  {isTimeFilterOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 4px)',
                        width: '120px',
                        backgroundColor: '#ffffff',
                        borderRadius: '0.75rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                        zIndex: 30,
                        padding: '0.25rem'
                      }}
                    >
                      {['7 Days', 'Monthly', 'YTD'].map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTimeFilter(t);
                            setIsTimeFilterOpen(false);
                            triggerToast(`Category filter updated to: ${t}`);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.75rem',
                            fontWeight: timeFilter === t ? '700' : '500',
                            backgroundColor: timeFilter === t ? '#f3f4f6' : 'transparent',
                            color: '#111827',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <span>{t}</span>
                          {timeFilter === t && <span className="material-symbols-outlined text-[14px]">check</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Category Progress Bars */}
              <div className="gov-category-list">
                {/* Item 1 */}
                <div>
                  <div className="gov-category-meta">
                    <span className="gov-category-name">
                      <span style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: '#000000' }}></span>
                      Water & Drinking Sanitation
                    </span>
                    <span><strong style={{ color: '#171717' }}>34%</strong> <span style={{ color: '#a3a3a3' }}>· 5,038</span></span>
                  </div>
                  <div className="gov-category-bar-bg">
                    <div className="gov-category-bar-fill" style={{ width: '34%', backgroundColor: '#000000' }}></div>
                  </div>
                </div>

                {/* Item 2 */}
                <div>
                  <div className="gov-category-meta">
                    <span className="gov-category-name">
                      <span style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: '#404040' }}></span>
                      Roads, Potholes & Infrastructure
                    </span>
                    <span><strong style={{ color: '#171717' }}>28%</strong> <span style={{ color: '#a3a3a3' }}>· 4,150</span></span>
                  </div>
                  <div className="gov-category-bar-bg">
                    <div className="gov-category-bar-fill" style={{ width: '28%', backgroundColor: '#404040' }}></div>
                  </div>
                </div>

                {/* Item 3 */}
                <div>
                  <div className="gov-category-meta">
                    <span className="gov-category-name">
                      <span style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: '#737373' }}></span>
                      Electricity & Tribal Solar Micro-Grids
                    </span>
                    <span><strong style={{ color: '#171717' }}>18%</strong> <span style={{ color: '#a3a3a3' }}>· 2,668</span></span>
                  </div>
                  <div className="gov-category-bar-bg">
                    <div className="gov-category-bar-fill" style={{ width: '18%', backgroundColor: '#737373' }}></div>
                  </div>
                </div>

                {/* Item 4 */}
                <div>
                  <div className="gov-category-meta">
                    <span className="gov-category-name">
                      <span style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: '#a3a3a3' }}></span>
                      Health Sub-Centres & Medicine Stocks
                    </span>
                    <span><strong style={{ color: '#171717' }}>12%</strong> <span style={{ color: '#a3a3a3' }}>· 1,778</span></span>
                  </div>
                  <div className="gov-category-bar-bg">
                    <div className="gov-category-bar-fill" style={{ width: '12%', backgroundColor: '#a3a3a3' }}></div>
                  </div>
                </div>

                {/* Item 5 */}
                <div>
                  <div className="gov-category-meta">
                    <span className="gov-category-name">
                      <span style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: '#d4d4d4' }}></span>
                      Agriculture & Irrigation
                    </span>
                    <span><strong style={{ color: '#171717' }}>8%</strong> <span style={{ color: '#a3a3a3' }}>· 1,186</span></span>
                  </div>
                  <div className="gov-category-bar-bg">
                    <div className="gov-category-bar-fill" style={{ width: '8%', backgroundColor: '#d4d4d4' }}></div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6', fontSize: '0.75rem', color: '#a3a3a3' }}>
                <span>14,820 Reports</span>
                <button
                  onClick={handleExportCSV}
                  style={{ background: 'none', border: 'none', color: '#000000', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  Download CSV Audit
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>

          {/* ==============================================================================
              BOTTOM GRID SECTION (Recent Reported Problems & Alerts Panel)
              ============================================================================== */}
          <section className="gov-grid-12" style={{ marginBottom: '1rem' }}>
            {/* Section 3: Recent Reported Problems (8 cols) */}
            <div
              className="gov-card"
              style={{ gridColumn: 'span 8' }}
              data-purpose="recent-issues-table-container"
            >
              <div>
                <div className="gov-card-header">
                  <h2 className="gov-card-title">Recent Reported Problems</h2>
                  <button
                    type="button"
                    onClick={() => triggerToast('Filters: All 24 Districts · Active SLA')}
                    className="gov-pill-btn"
                  >
                    <span>Filters</span>
                    <span className="material-symbols-outlined text-[16px] text-neutral-400">expand_more</span>
                  </button>
                </div>

                {/* Clean Table List matching SCREEN_13 */}
                <div className="gov-table-container">
                  <table className="gov-table" data-purpose="tickets-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Category & Problem</th>
                        <th>District / Ward</th>
                        <th>Status</th>
                        <th>Assigned Authority</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t) => (
                        <tr
                          key={t.id}
                          className="gov-table-row"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate('/government/reports/' + t.id.replace('#', ''))}
                        >
                          <td className="gov-ticket-id">{t.id}</td>
                          <td>
                            <div className="gov-problem-title">{t.title}</div>
                            <div className="gov-problem-desc">{t.desc}</div>
                          </td>
                          <td>
                            <span style={{ fontWeight: '600', color: '#171717' }}>{t.district}</span>
                            <span style={{ display: 'block', fontSize: '10px', color: '#a3a3a3' }}>{t.ward}</span>
                          </td>
                          <td>
                            <span className={`gov-status-pill ${t.statusClass}`}>
                              {t.status}
                            </span>
                          </td>
                          <td style={{ fontWeight: '500', color: '#525252' }}>
                            {t.authority}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="gov-view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/government/reports/' + t.id.replace('#', ''));
                              }}
                            >
                              View <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table Footer Pagination */}
              <div className="gov-pagination">
                <span>Showing <strong>4</strong> of 1,432 actionable tickets</span>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <button className="gov-page-btn active">1</button>
                  <button className="gov-page-btn" onClick={() => triggerToast('Viewing Page 2')}>2</button>
                  <button className="gov-page-btn" onClick={() => triggerToast('Viewing Page 3')}>3</button>
                  <button className="gov-page-btn" onClick={() => triggerToast('Next page')}><span className="material-symbols-outlined text-[16px]">chevron_right</span></button>
                </div>
              </div>
            </div>

            {/* Section 4: Alerts Panel (4 cols) */}
            <div
              className="gov-card"
              style={{ gridColumn: 'span 4' }}
              data-purpose="alerts-panel"
            >
              <div>
                <div className="gov-card-header">
                  <h2 className="gov-card-title">Alerts Panel</h2>
                </div>

                <div className="gov-alerts-list">
                  {alerts.map((al) => (
                    <div key={al.id} className="gov-alert-card">
                      <div className="gov-alert-header">
                        <span className="gov-alert-tag">
                          {al.tag}
                        </span>
                        <span className="gov-alert-time">{al.time}</span>
                      </div>
                      <p className="gov-alert-body">{al.body}</p>

                      <div className="gov-alert-actions">
                        {al.dispatched ? (
                          <div style={{ padding: '0.45rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: '700', textAlign: 'center' }}>
                            ✓ Dispatched / In Progress
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              className={al.isRed && al.primaryBtn === 'Dispatch Emergency' ? 'gov-btn-emergency' : 'gov-btn-black'}
                              onClick={() => handleAlertAction(al.id, al.primaryBtn)}
                            >
                              {al.primaryBtn}
                            </button>
                            <button
                              type="button"
                              className="gov-btn-outline"
                              onClick={() => handleAlertAction(al.id, al.secondaryBtn)}
                            >
                              {al.secondaryBtn}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
    </div>
  );
};

