import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JharkhandMap } from '../components/JharkhandMap';
import '../styles/governmentDashboard.css';

// Rich District Dataset for Jharkhand Map View matching Stitch Screen 097b6c64fda845e1bbc8ee81b5957fe1
const DISTRICT_DATA = {
  Ranchi: {
    id: 'ranchi',
    name: 'Ranchi District',
    shortName: 'Ranchi',
    hq: 'Nodal HQ · Ward 1 to 55',
    slaTag: 'Critical SLA',
    slaBg: '#fef2f2',
    slaColor: '#991b1b',
    totalReports: '4,120',
    trend: '+14% vs last week',
    pending: '482',
    pendingDetail: '42 Critical SLA',
    percentage: '27.8%',
    dotColor: '#dc2626',
    wards: [
      {
        id: 'w-bero',
        name: 'Bero Block (Ward 4)',
        status: 'Pending Triage',
        statusBg: '#fef3c7',
        statusColor: '#92400e',
        desc: 'Water Contamination (Fluoride & Iron) · 42 families affected near tube-wells.',
        authority: 'Assigned: BIT Mesra Lab',
        reportId: 'SETU-8421'
      },
      {
        id: 'w-ormanjhi',
        name: 'Ormanjhi Cluster',
        status: 'In Progress',
        statusBg: '#eff6ff',
        statusColor: '#1e40af',
        desc: 'Paddy Leaf Blight Outbreak · Birsa Agricultural University deploying field sensors.',
        authority: 'Assigned: BAU AgriTech',
        reportId: 'SETU-8192'
      },
      {
        id: 'w-kanke',
        name: 'Kanke Dam Sector 2',
        status: 'Resolved',
        statusBg: '#ecfdf5',
        statusColor: '#065f46',
        desc: 'Canal overflow & silt clearing completed by municipal vacuum units.',
        authority: 'Assigned: RMC Sanitation',
        reportId: 'SETU-8277'
      }
    ]
  },
  Dhanbad: {
    id: 'dhanbad',
    name: 'Dhanbad District',
    shortName: 'Dhanbad',
    hq: 'Colliery & Urban Belt · Zone 1 to 32',
    slaTag: 'High Priority',
    slaBg: '#ffedd5',
    slaColor: '#9a3412',
    totalReports: '2,840',
    trend: '+8% vs last week',
    pending: '315',
    pendingDetail: '28 Critical SLA',
    percentage: '19.1%',
    dotColor: '#ef4444',
    wards: [
      {
        id: 'w-govindpur',
        name: 'Govindpur Market / NH-32 Connector',
        status: 'Field Team Assigned',
        statusBg: '#fee2e2',
        statusColor: '#991b1b',
        desc: 'Pothole & Road Collapse on Culvert Edge (NH-32 Connector) · Approach cracked.',
        authority: 'Assigned: PWD / IIT (ISM) Dhanbad',
        reportId: 'SETU-8390'
      },
      {
        id: 'w-jharia',
        name: 'Jharia Coalfield Sector 4',
        status: 'Under R&D Lab',
        statusBg: '#f3e8ff',
        statusColor: '#6b21a8',
        desc: 'Sub-surface ground temperature telemetry & ventilation shaft monitoring.',
        authority: 'Assigned: CIMFR / IIT (ISM)',
        reportId: 'SETU-8314'
      },
      {
        id: 'w-sindri',
        name: 'Sindri Industrial Colony',
        status: 'Resolved',
        statusBg: '#ecfdf5',
        statusColor: '#065f46',
        desc: 'Effluent canal chemical neutralization completed by municipal bio-filters.',
        authority: 'Assigned: Pollution Control Board',
        reportId: 'SETU-8421'
      }
    ]
  },
  'East Singhbhum': {
    id: 'east-singhbhum',
    name: 'East Singhbhum (Jamshedpur)',
    shortName: 'Jamshedpur (E. Singhbhum)',
    hq: 'Industrial & Sub-urban Belt · JNAC',
    slaTag: 'Moderate SLA',
    slaBg: '#eff6ff',
    slaColor: '#1e40af',
    totalReports: '2,120',
    trend: '-3% vs last week',
    pending: '198',
    pendingDetail: '14 Critical SLA',
    percentage: '14.3%',
    dotColor: '#f97316',
    wards: [
      {
        id: 'w-sakchi',
        name: 'Sakchi Central Wholesale Lane, Ward 14',
        status: 'Scheduled Clearance',
        statusBg: '#fef3c7',
        statusColor: '#92400e',
        desc: 'Waste Accumulation & Stormwater Drainage Clog · Footpath sewage overflow.',
        authority: 'Assigned: JNAC Taskforce',
        reportId: 'SETU-8277'
      },
      {
        id: 'w-adityapur',
        name: 'Adityapur Phase 3 Ancillary Lane',
        status: 'In Progress',
        statusBg: '#eff6ff',
        statusColor: '#1e40af',
        desc: 'Solar Micro-Grid Inverter replacement for primary healthcare sub-centre.',
        authority: 'Assigned: NIT Jamshedpur Clean Power Lab',
        reportId: 'SETU-8314'
      }
    ]
  },
  Bokaro: {
    id: 'bokaro',
    name: 'Bokaro District',
    shortName: 'Bokaro',
    hq: 'Steel City & Chas Municipality',
    slaTag: 'Normal SLA',
    slaBg: '#f3f4f6',
    slaColor: '#374151',
    totalReports: '1,430',
    trend: '+4% vs last week',
    pending: '112',
    pendingDetail: '6 Critical SLA',
    percentage: '9.6%',
    dotColor: '#fb923c',
    wards: [
      {
        id: 'w-chas',
        name: 'Sector 4 / Chas Border',
        status: 'In Progress',
        statusBg: '#eff6ff',
        statusColor: '#1e40af',
        desc: 'Main distribution pipeline valve leakage repaired with sensor monitoring.',
        authority: 'Assigned: Bokaro Steel Civic Wing',
        reportId: 'SETU-8421'
      },
      {
        id: 'w-bermo',
        name: 'Bermo Coal Washery Route',
        status: 'Field Team Assigned',
        statusBg: '#fee2e2',
        statusColor: '#991b1b',
        desc: 'Heavy coal transport road corrugation and bridge girder inspection.',
        authority: 'Assigned: PWD Highway Wing',
        reportId: 'SETU-8390'
      }
    ]
  },
  Khunti: {
    id: 'khunti',
    name: 'Khunti District',
    shortName: 'Khunti',
    hq: 'Tribal Sub-Plan Area · Torpa Nodal',
    slaTag: 'High Priority',
    slaBg: '#ffedd5',
    slaColor: '#9a3412',
    totalReports: '890',
    trend: '+12% vs last week',
    pending: '94',
    pendingDetail: '18 Critical SLA',
    percentage: '6.0%',
    dotColor: '#fbbf24',
    wards: [
      {
        id: 'w-torpa',
        name: 'Torpa Block Ashram Campus',
        status: 'Under Lab R&D',
        statusBg: '#fef3c7',
        statusColor: '#92400e',
        desc: 'Solar Micro-Grid Inverter & Battery Bank Breakdown · Residential school in dark.',
        authority: 'Assigned: JREDA / NIT Jamshedpur',
        reportId: 'SETU-8314'
      }
    ]
  }
};

export const GovernmentMapView = () => {
  const navigate = useNavigate();

  // Active district selection
  const [selectedDistrictKey, setSelectedDistrictKey] = useState('Ranchi');
  const [activeDomainFilter, setActiveDomainFilter] = useState('All');
  const [zoomAction, setZoomAction] = useState(null);
  const [selectedLang, setSelectedLang] = useState('English');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const currentDistrict = DISTRICT_DATA[selectedDistrictKey] || DISTRICT_DATA['Ranchi'];

  const handleDistrictSelect = (name) => {
    // Match against keys
    const match = Object.keys(DISTRICT_DATA).find(
      (k) =>
        k.toLowerCase() === name.toLowerCase() ||
        name.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(name.toLowerCase())
    );
    if (match) {
      setSelectedDistrictKey(match);
      triggerToast(`Focused map & incident breakdown on ${match} District`);
    } else {
      triggerToast(`Focused geospatial coordinates on: ${name}`);
    }
  };

  return (
    <div className="gov-main-inner" data-purpose="map-view-page">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="gov-toast">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==============================================================================
          TOP HEADER BAR (Matching Stitch Screen 097b6c64fda845e1bbc8ee81b5957fe1)
          ============================================================================== */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '1.5rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.025em',
              margin: 0
            }}
          >
            Jharkhand District Heatmap &amp; Geospatial View
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '4px 0 0 0' }}>
            Official GIS WMS 2025 · 24 Administrative Districts · Real-time TARA Citizen Cluster Monitoring
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick District Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedDistrictKey}
              onChange={(e) => handleDistrictSelect(e.target.value)}
              style={{
                appearance: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#374151',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                padding: '0.5rem 2.25rem 0.5rem 0.85rem',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <option value="Ranchi">Ranchi (4,120 reports)</option>
              <option value="Dhanbad">Dhanbad (2,840 reports)</option>
              <option value="East Singhbhum">East Singhbhum / Jamshedpur (2,120 reports)</option>
              <option value="Bokaro">Bokaro (1,430 reports)</option>
              <option value="Khunti">Khunti (890 reports)</option>
            </select>
            <span
              className="material-symbols-outlined text-[16px] text-neutral-500"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            >
              expand_more
            </span>
          </div>

          {/* Language Picker Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#374151',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.85rem',
                cursor: 'pointer'
              }}
            >
              <span className="material-symbols-outlined text-[16px] text-neutral-600">language</span>
              <span>{selectedLang}</span>
              <span className="material-symbols-outlined text-[14px] text-neutral-400">expand_more</span>
            </button>

            {isLangOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                  zIndex: 50,
                  width: '130px',
                  padding: '0.25rem'
                }}
              >
                {['English', 'हिन्दी', 'संथाली', 'বাংলা'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setIsLangOpen(false);
                      triggerToast(`Map interface language set to ${lang}`);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.45rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: selectedLang === lang ? '700' : '500',
                      color: selectedLang === lang ? '#000000' : '#4b5563',
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

          {/* Notification Bell */}
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
                  <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#111827' }}>Geospatial Cluster Alerts</span>
                  <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>2 active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', padding: '0.5rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
                    <strong style={{ color: '#b91c1c' }}>Ranchi Namkum Cluster:</strong> 228 water reports merged. Tanker dispatched.
                  </div>
                  <div style={{ fontSize: '0.75rem', padding: '0.5rem', backgroundColor: '#fffbeb', borderRadius: '0.5rem', border: '1px solid #fef3c7' }}>
                    <strong style={{ color: '#b45309' }}>Dhanbad NH-32:</strong> Culvert approach depression barricaded.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ==============================================================================
          MAP & SIDEBAR CONTROLS CARD (Directly matching Stitch Screen 097b6c64fda845e1bbc8ee81b5957fe1)
          ============================================================================== */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}
      >
        {/* Controls Toolbar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            backgroundColor: '#fafafa'
          }}
        >
          {/* Filter By Issue Domain */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
              Filter By Issue Domain:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { label: 'All (14,820)', key: 'All', color: null },
                { label: 'Water & Sanitation (5,038)', key: 'Water', color: '#3b82f6' },
                { label: 'Roads & Potholes (4,150)', key: 'Roads', color: '#f59e0b' },
                { label: 'Solar & Power Grid (2,668)', key: 'Solar', color: '#8b5cf6' },
                { label: 'Health Sub-Centres (1,778)', key: 'Health', color: '#f43f5e' }
              ].map((filter) => {
                const isActive = activeDomainFilter === filter.key;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => {
                      setActiveDomainFilter(filter.key);
                      triggerToast(`Filtered map incidents by: ${filter.key}`);
                    }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: isActive ? 700 : 600,
                      backgroundColor: isActive ? '#111827' : '#ffffff',
                      color: isActive ? '#ffffff' : '#374151',
                      border: isActive ? '1px solid #111827' : '1px solid #d1d5db',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {filter.color && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: filter.color
                        }}
                      />
                    )}
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Heat Intensity Legend */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '11px',
              color: '#4b5563',
              backgroundColor: '#ffffff',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}
          >
            <span style={{ fontWeight: 600, color: '#6b7280' }}>Heat Intensity:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#fecdd3' }}></span>
              <span>Low (&lt;1k)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#fb7185' }}></span>
              <span>Moderate</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#e11d48' }}></span>
              <span>High</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#9f1239' }}></span>
              <strong style={{ color: '#9f1239' }}>Critical (3k+)</strong>
            </div>
          </div>
        </div>

        {/* Main Interactive Map Canvas + Floating Side Panel */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#f3f4f6',
            height: '620px',
            width: '100%',
            overflow: 'hidden',
            display: 'flex'
          }}
        >
          {/* Map Area */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              backgroundColor: '#fafafa'
            }}
          >
            {/* Real 24-District Geographic Vector Map */}
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <JharkhandMap
                selectedDistrict={currentDistrict.shortName}
                zoomAction={zoomAction}
                onSelectDistrict={handleDistrictSelect}
                maxHeight="520px"
                minHeight="480px"
                containerStyle={{
                  backgroundColor: 'transparent',
                  padding: 0
                }}
              />
            </div>

            {/* Map Zoom & Projection Tools Floating Overlay */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 20
              }}
            >
              <button
                type="button"
                onClick={() => setZoomAction('in')}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#374151'
                }}
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
              <div style={{ height: '1px', backgroundColor: '#e5e7eb', width: '100%' }} />
              <button
                type="button"
                onClick={() => setZoomAction('out')}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#374151'
                }}
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <div style={{ height: '1px', backgroundColor: '#e5e7eb', width: '100%' }} />
              <button
                type="button"
                onClick={() => {
                  setZoomAction('reset');
                  triggerToast('Reset map to default state view');
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#374151'
                }}
                title="Center Map"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
              </button>
            </div>
          </div>

          {/* Floating Inspector Drawer / District Incident Breakdown */}
          <div
            style={{
              width: '380px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              borderLeft: '1px solid #e5e7eb',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto',
              flexShrink: 0,
              zIndex: 10
            }}
          >
            <div>
              {/* Selected District Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid #e5e7eb'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: currentDistrict.dotColor
                      }}
                    />
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                      {currentDistrict.name}
                    </h3>
                  </div>
                  <p style={{ fontSize: '11px', color: '#6b7280', margin: '3px 0 0 0' }}>
                    {currentDistrict.hq}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: currentDistrict.slaBg,
                    color: currentDistrict.slaColor,
                    border: '1px solid currentColor'
                  }}
                >
                  {currentDistrict.slaTag}
                </span>
              </div>

              {/* Incident Quick Stats for District */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  margin: '1rem 0'
                }}
              >
                <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #f3f4f6' }}>
                  <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', margin: 0 }}>
                    Total In District
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '4px 0 0 0' }}>
                    {currentDistrict.totalReports}
                  </p>
                  <p style={{ fontSize: '10px', color: '#dc2626', fontWeight: 600, margin: '2px 0 0 0' }}>
                    {currentDistrict.trend}
                  </p>
                </div>

                <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #f3f4f6' }}>
                  <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', margin: 0 }}>
                    Action Pending
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '4px 0 0 0' }}>
                    {currentDistrict.pending}
                  </p>
                  <p style={{ fontSize: '10px', color: '#d97706', fontWeight: 600, margin: '2px 0 0 0' }}>
                    {currentDistrict.pendingDetail}
                  </p>
                </div>
              </div>

              {/* High Incident Clusters List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', margin: '0 0 4px 0' }}>
                  Active High-Density Wards
                </p>

                {currentDistrict.wards.map((ward) => (
                  <div
                    key={ward.id}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.75rem',
                      border: '1px solid #e5e7eb',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>
                        {ward.name}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: ward.statusBg,
                          color: ward.statusColor
                        }}
                      >
                        {ward.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#4b5563', lineHeight: 1.4, margin: 0 }}>
                      {ward.desc}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '6px',
                        paddingTop: '6px',
                        borderTop: '1px solid #f3f4f6',
                        fontSize: '10px',
                        color: '#6b7280'
                      }}
                    >
                      <span>{ward.authority}</span>
                      <button
                        type="button"
                        onClick={() => navigate(`/government/reports/${ward.reportId}`)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#111827',
                          fontWeight: 700,
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          padding: 0
                        }}
                      >
                        Inspect →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Actions */}
            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => triggerToast(`✓ Emergency Quick Response Unit dispatched to ${currentDistrict.name}`)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '12px',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <span className="material-symbols-outlined text-[16px]">emergency_share</span>
                Dispatch District Emergency Unit
              </button>
              <button
                type="button"
                onClick={() => navigate('/government/inbox')}
                style={{
                  width: '100%',
                  padding: '9px',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '12px',
                  borderRadius: '0.75rem',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                View All {currentDistrict.totalReports} {currentDistrict.shortName} Reports
              </button>
            </div>
          </div>
        </div>

        {/* Footer Stats Bar */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#6b7280'
          }}
        >
          <div>
            <strong style={{ color: '#111827' }}>14,820</strong> Verified Community Submissions Across 24 Districts
          </div>
          <button
            type="button"
            onClick={() => triggerToast('Exported Jharkhand State GIS GeoJSON Layer Audit (2025 WMS)')}
            style={{
              fontWeight: 700,
              color: '#111827',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Download GeoJSON / GIS Audit
            <span className="material-symbols-outlined text-[15px]">download</span>
          </button>
        </div>
      </div>

      {/* ==============================================================================
          DISTRICT COMPARISON & JURISDICTION TRIAGE GRID (3 COLUMNS MATCHING STITCH)
          ============================================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Column 1: Top Incident Districts */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #f3f4f6',
              marginBottom: '0.75rem'
            }}
          >
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              Top Incident Districts
            </h3>
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>Last 7 Days</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { key: 'Ranchi', name: 'Ranchi', subtitle: '55 Wards · 12 Nodal Teams', count: '4,120', share: '27.8% of state', dot: '#dc2626' },
              { key: 'Dhanbad', name: 'Dhanbad', subtitle: 'Colliery & Urban belt', count: '2,840', share: '19.1% of state', dot: '#ef4444' },
              { key: 'East Singhbhum', name: 'Jamshedpur (E. Singhbhum)', subtitle: 'Industrial & Sub-urban', count: '2,120', share: '14.3% of state', dot: '#f97316' },
              { key: 'Bokaro', name: 'Bokaro', subtitle: 'Steel City & Chas', count: '1,430', share: '9.6% of state', dot: '#fb923c' }
            ].map((d, index) => {
              const isSelected = selectedDistrictKey === d.key;
              return (
                <div
                  key={d.key}
                  onClick={() => handleDistrictSelect(d.key)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: index < 3 ? '1px solid #f3f4f6' : 'none',
                    cursor: 'pointer',
                    borderRadius: '0.5rem',
                    backgroundColor: isSelected ? '#f3f4f6' : 'transparent',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.dot }} />
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#111827', margin: 0 }}>
                        {d.name}
                      </p>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>
                        {d.subtitle}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: 800, color: '#111827', margin: 0 }}>
                      {d.count}
                    </p>
                    <p style={{ fontSize: '10px', color: '#6b7280', margin: '2px 0 0 0', fontWeight: 500 }}>
                      {d.share}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Geographic Domain Distribution */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #f3f4f6',
              marginBottom: '1rem'
            }}
          >
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              Geographic Domain Distribution
            </h3>
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>All Districts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Water & Drinking Sanitation', pct: '34%', count: '5,038', color: '#111827' },
              { label: 'Roads, Potholes & Bridges', pct: '28%', count: '4,150', color: '#374151' },
              { label: 'Electricity & Solar Micro-Grids', pct: '18%', count: '2,668', color: '#6b7280' },
              { label: 'Health Sub-Centres & Medicine', pct: '12%', count: '1,778', color: '#9ca3af' },
              { label: 'Agriculture & Irrigation', pct: '8%', count: '1,186', color: '#d1d5db' }
            ].map((cat) => (
              <div key={cat.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  <span style={{ color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: cat.color }} />
                    {cat.label}
                  </span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>
                    {cat.pct} · {cat.count}
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: cat.pct, height: '100%', backgroundColor: cat.color, borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Active University Field Labs */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #f3f4f6',
              marginBottom: '1rem'
            }}
          >
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              Active University Field Labs
            </h3>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#047857',
                backgroundColor: '#ecfdf5',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}
            >
              370 Assigned
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>BIT Mesra (Water Tech Lab)</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>142 Projects</span>
              </div>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 6px 0', lineHeight: 1.4 }}>
                Monitoring fluoride and heavy iron filtration in Bero Block &amp; Khunti.
              </p>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '84%', height: '100%', backgroundColor: '#111827', borderRadius: '9999px' }} />
              </div>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>IIT (ISM) Dhanbad (Energy Lab)</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>89 Projects</span>
              </div>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 6px 0', lineHeight: 1.4 }}>
                Deploying low-cost solar micro-grid charge controllers across ashram schools.
              </p>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '68%', height: '100%', backgroundColor: '#111827', borderRadius: '9999px' }} />
              </div>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>Birsa Agricultural University</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>215 Projects</span>
              </div>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 6px 0', lineHeight: 1.4 }}>
                Optical sensor drone diagnostics for paddy leaf blight triage.
              </p>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', backgroundColor: '#111827', borderRadius: '9999px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
