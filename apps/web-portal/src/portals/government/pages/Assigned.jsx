import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/governmentDashboard.css';

// 6 Comprehensive Assigned University Problem Statements from Stitch Screen 3d13ad36c0f64e8982230e4cbc9357a7
const ASSIGNED_PROBLEMS = [
  {
    id: 'SETU-8421',
    category: 'Water & Sanitation',
    categoryIcon: 'water_drop',
    categoryColor: '#0284c7',
    categoryBg: '#f0f9ff',
    categoryBorder: '#e0f2fe',
    status: 'Prototype Testing',
    statusDot: '#f59e0b',
    statusBg: '#fffbeb',
    statusColor: '#92400e',
    statusBorder: '#fef3c7',
    location: 'Bero Block, Ranchi',
    assignedDate: '14 Oct',
    title: 'Fluoride & Heavy Iron Contamination in Deep Borewells',
    desc: 'Groundwater across 42 tribal hamlets exhibits fluoride >3.8 ppm causing severe dental fluorosis and intestinal stress. Designing resilient nano-adsorption filtration arrays.',
    institution: {
      name: 'BIT Mesra',
      abbr: 'BM',
      tag: 'MoU Active',
      dept: 'Dept of Chemical Engg · Lead: Dr. Sanjeev Roy'
    },
    industry: {
      name: 'Tata Steel Rural Dev. Society (TSRDS)',
      grant: '₹18.5L',
      grantLabel: 'CSR Grant'
    },
    metrics: {
      primary: '42 Tribal Families',
      secondary: '3 Pilot Units Active'
    },
    reportId: 'SETU-8421'
  },
  {
    id: 'SETU-8314',
    category: 'Clean Energy',
    categoryIcon: 'solar_power',
    categoryColor: '#d97706',
    categoryBg: '#fffbeb',
    categoryBorder: '#fef3c7',
    status: 'Under Nodal Review',
    statusDot: '#3b82f6',
    statusBg: '#eff6ff',
    statusColor: '#1e40af',
    statusBorder: '#dbeafe',
    location: 'Govindpur & Torpa, Dhanbad',
    assignedDate: '08 Oct',
    title: 'Frequent Solar Micro-Grid Inverter Burnout at Ashram Schools',
    desc: 'Off-grid 5kVA solar stations fail due to humidity fluctuations and extreme surge spikes. Power electronics lab synthesizing solid-state surge suppressors.',
    institution: {
      name: 'IIT (ISM) Dhanbad',
      abbr: 'IIT',
      tag: 'MoU Active',
      dept: 'Power Electronics Centre · Lead: Prof. Alok Sharan'
    },
    industry: {
      name: 'Adani Solar / CleanMax Power',
      grant: '₹24L',
      grantLabel: 'Scale-Up & IP'
    },
    metrics: {
      primary: '89 State Projects',
      secondary: '₹14.2L Allocated'
    },
    reportId: 'SETU-8314'
  },
  {
    id: 'SETU-8192',
    category: 'Agritech & Crop',
    categoryIcon: 'psychiatry',
    categoryColor: '#059669',
    categoryBg: '#ecfdf5',
    categoryBorder: '#d1fae5',
    status: 'Field Trial Active',
    statusDot: '#10b981',
    statusBg: '#ecfdf5',
    statusColor: '#065f46',
    statusBorder: '#a7f3d0',
    location: 'Ormanjhi & Mandar, Ranchi',
    assignedDate: '22 Sep',
    title: 'Optical Multispectral Bacterial Leaf Blight Diagnostics',
    desc: 'Xanthomonas oryzae blight affecting 450+ hectares of paddy. Deploying low-cost smartphone lens adapters and drone optical sweep algorithms.',
    institution: {
      name: 'Birsa Agri University (BAU)',
      abbr: 'BAU',
      tag: 'CoE Node',
      dept: 'Dept of Plant Pathology · Lead: Dr. M. K. Soren'
    },
    industry: {
      name: 'ITC Agri Business & Bayer Crop Science',
      grant: '₹16L',
      grantLabel: 'Field Commercial'
    },
    metrics: {
      primary: '450 Hectares Tracked',
      secondary: '94.2% AI Accuracy'
    },
    reportId: 'SETU-9842'
  },
  {
    id: 'SETU-8045',
    category: 'Rural Healthcare',
    categoryIcon: 'vital_signs',
    categoryColor: '#e11d48',
    categoryBg: '#fff1f2',
    categoryBorder: '#ffe4e6',
    status: 'Clinical Ethics Review',
    statusDot: '#8b5cf6',
    statusBg: '#f5f3ff',
    statusColor: '#6d28d9',
    statusBorder: '#ede9fe',
    location: 'Khunti & Simdega Districts',
    assignedDate: '18 Sep',
    title: 'Microfluidic Point-of-Care Sickle Cell Anemia Screening',
    desc: 'Portable paper-based cartridge producing hemoglobin electrophoresis readouts in 12 minutes for remote Anganwadi health workers.',
    institution: {
      name: 'BIT Mesra & AIIMS Deoghar',
      abbr: 'AIIMS',
      tag: 'Joint CoE',
      dept: 'Biomedical Microfluidics Lab · Lead: Dr. P. Mishra'
    },
    industry: {
      name: 'Piramal Swasthya & Cipla Foundation',
      grant: '₹32L',
      grantLabel: 'Trial Grant'
    },
    metrics: {
      primary: '500 Hamlets Enrolled',
      secondary: '12 Min POC Assay'
    },
    reportId: 'SETU-8045'
  },
  {
    id: 'SETU-8390',
    category: 'Infrastructure & Roads',
    categoryIcon: 'construction',
    categoryColor: '#4b5563',
    categoryBg: '#f3f4f6',
    categoryBorder: '#e5e7eb',
    status: 'Sensor Telemetry Live',
    statusDot: '#10b981',
    statusBg: '#ecfdf5',
    statusColor: '#065f46',
    statusBorder: '#a7f3d0',
    location: 'NH-32 Connector, Jamshedpur',
    assignedDate: '02 Oct',
    title: 'Culvert Edge Subsidence Sensors Along Heavy Freight Corridors',
    desc: 'Severe asphalt depression from iron-ore transport. Fiber-optic strain gages & IoT accelerometers feeding automated alerts to PWD control room.',
    institution: {
      name: 'NIT Jamshedpur',
      abbr: 'NIT',
      tag: 'MoU Active',
      dept: 'Geotechnical IoT Lab · Lead: Prof. R. N. Gupta'
    },
    industry: {
      name: 'Larsen & Toubro (L&T Infra) & Jindal',
      grant: '₹28L',
      grantLabel: 'Highway Deploy'
    },
    metrics: {
      primary: '48 Sensor Nodes',
      secondary: '99.4% Ingest Uptime'
    },
    reportId: 'SETU-8390'
  },
  {
    id: 'SETU-8278',
    category: 'Environment & Forestry',
    categoryIcon: 'local_fire_department',
    categoryColor: '#ea580c',
    categoryBg: '#fff7ed',
    categoryBorder: '#ffedd5',
    status: 'LoRaWAN Mesh Pilot',
    statusDot: '#f59e0b',
    statusBg: '#fffbeb',
    statusColor: '#92400e',
    statusBorder: '#fef3c7',
    location: 'Saranda Forest Range',
    assignedDate: '28 Sep',
    title: 'Low-Power Acoustic & Thermal Canopy Wildfire Warning Mesh',
    desc: 'Solar-powered acoustic sensors detecting early crackle signatures & infrared spikes across dense sal tree canopies with zero mobile cellular coverage.',
    institution: {
      name: 'Ranchi University Innovation Cell',
      abbr: 'RU',
      tag: 'Incubated',
      dept: 'Embedded Systems Wing · Lead: Dr. Ananya Sen'
    },
    industry: {
      name: 'Hindalco Industries & Vedanta CSR',
      grant: '₹12.5L',
      grantLabel: 'Forest Pilot'
    },
    metrics: {
      primary: '16 LoRa Nodes',
      secondary: 'Range: 42 km² Covered'
    },
    reportId: 'SETU-8314'
  }
];

export const GovernmentAssigned = () => {
  const navigate = useNavigate();

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniFilter, setSelectedUniFilter] = useState('All Universities');
  const [activeDomainFilter, setActiveDomainFilter] = useState('All Domains');
  const [sortBy, setSortBy] = useState('Newest First');
  const [viewMode, setViewMode] = useState('list'); // 'list' (1-col spacious) or 'grid' (2-col)
  const [toastMessage, setToastMessage] = useState(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Filtered problems computation
  const filteredProblems = useMemo(() => {
    return ASSIGNED_PROBLEMS.filter((p) => {
      // Search
      const matchSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      // University dropdown
      const matchUni =
        selectedUniFilter === 'All Universities' ||
        p.institution.name.toLowerCase().includes(selectedUniFilter.toLowerCase().replace(' (all)', ''));

      // Domain pill filter
      const matchDomain =
        activeDomainFilter === 'All Domains' ||
        (activeDomainFilter === 'Water' && p.category.includes('Water')) ||
        (activeDomainFilter === 'Agritech' && p.category.includes('Agri')) ||
        (activeDomainFilter === 'Clean Energy' && p.category.includes('Energy')) ||
        (activeDomainFilter === 'Healthcare' && p.category.includes('Healthcare'));

      return matchSearch && matchUni && matchDomain;
    });
  }, [searchQuery, selectedUniFilter, activeDomainFilter]);

  return (
    <div className="gov-assigned-container" data-purpose="assigned-web-layout">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="gov-toast">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==============================================================================
          TOP HEADER (Matching Stitch Screen 3d13ad36c0f64e8982230e4cbc9357a7)
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
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.025em',
              margin: 0
            }}
          >
            Assigned
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '4px 0 0 0' }}>
            State University Innovation Desk · 370 Active Civic Problem Assignments &amp; Escrow Grants
          </p>
        </div>

        {/* Controls & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span
              className="material-symbols-outlined text-[18px] text-neutral-400"
              style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search problems, labs or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.55rem 1rem 0.55rem 2.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                width: '250px',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            />
          </div>

          {/* University Dropdown - Fixed left padding so icon never overlaps text */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <span
              className="material-symbols-outlined text-[17px] text-neutral-500"
              style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
            >
              school
            </span>
            <select
              value={selectedUniFilter}
              onChange={(e) => {
                setSelectedUniFilter(e.target.value);
                triggerToast(`Filtered problems by: ${e.target.value}`);
              }}
              style={{
                appearance: 'none',
                padding: '0.55rem 2.25rem 0.55rem 2.6rem',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#1f2937',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <option value="All Universities">All Universities (370)</option>
              <option value="BIT Mesra">BIT Mesra (142)</option>
              <option value="IIT (ISM) Dhanbad">IIT (ISM) Dhanbad (89)</option>
              <option value="Birsa Agri">Birsa Agricultural University (215)</option>
              <option value="NIT Jamshedpur">NIT Jamshedpur (48)</option>
              <option value="Ranchi University">Ranchi University (34)</option>
            </select>
            <span
              className="material-symbols-outlined text-[16px] text-neutral-500"
              style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }}
            >
              expand_more
            </span>
          </div>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="gov-icon-btn"
              title="Notifications"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
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
                  <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#111827' }}>R&amp;D Escalations</span>
                  <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>2 new</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', padding: '0.5rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
                    <strong style={{ color: '#b91c1c' }}>BIT Mesra:</strong> Prototype batch water titration submitted for review.
                  </div>
                  <div style={{ fontSize: '0.75rem', padding: '0.5rem', backgroundColor: '#ecfdf5', borderRadius: '0.5rem', border: '1px solid #a7f3d0' }}>
                    <strong style={{ color: '#065f46' }}>BAU Drone Swarm:</strong> 450 ha crop sweep report verified.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ==============================================================================
          METRIC OVERVIEW CARDS (University Collaboration Snapshot)
          ============================================================================== */}
      <div className="gov-assigned-metrics-grid">
        {/* Card 1: Total Assigned */}
        <div className="gov-card" style={{ padding: '1.25rem', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
              Total Assigned Problems
            </span>
            <span className="material-symbols-outlined text-[18px] text-neutral-400">assignment_turned_in</span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827' }}>370</div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#059669', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined text-[15px]">trending_up</span>
            <span>+24 new problems this month</span>
          </div>
        </div>

        {/* Card 2: Universities */}
        <div className="gov-card" style={{ padding: '1.25rem', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
              Universities
            </span>
            <span className="material-symbols-outlined text-[18px] text-neutral-400">school</span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827' }}>
            6 <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>Institutions</span>
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
            18 Specialized Department Labs
          </div>
        </div>

        {/* Card 3: Field Trials & Prototypes */}
        <div className="gov-card" style={{ padding: '1.25rem', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
              Field Trials &amp; Prototypes
            </span>
            <span className="material-symbols-outlined text-[18px] text-neutral-400">science</span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827' }}>
            84 <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>Active</span>
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
            12 Ready for Municipal Handoff
          </div>
        </div>

        {/* Card 4: Avg Resolution Timeline */}
        <div className="gov-card" style={{ padding: '1.25rem', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
              Avg. Resolution Timeline
            </span>
            <span className="material-symbols-outlined text-[18px] text-neutral-400">timelapse</span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827' }}>
            28 <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>Days</span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#059669', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
            <span>-6 days vs manual tender</span>
          </div>
        </div>
      </div>

      {/* ==============================================================================
          MAIN WORKSPACE: ROBUST 2-COLUMN LAYOUT (Left Content + Right Rail)
          ============================================================================== */}
      <div className="gov-assigned-workspace">
        
        {/* PRIMARY AREA: LEFT COLUMN */}
        <div className="gov-assigned-main-col">
          
          {/* Controls & Filter Pills Row */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '0.75rem 1rem',
              borderRadius: '1rem',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            {/* Domain Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', flex: 1, minWidth: 0 }}>
              {[
                { label: 'All Domains (370)', key: 'All Domains' },
                { label: 'Water (142)', key: 'Water' },
                { label: 'Agritech (95)', key: 'Agritech' },
                { label: 'Clean Energy (89)', key: 'Clean Energy' },
                { label: 'Healthcare (44)', key: 'Healthcare' }
              ].map((filter) => {
                const isActive = activeDomainFilter === filter.key;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => {
                      setActiveDomainFilter(filter.key);
                      triggerToast(`Filtered domain view: ${filter.key}`);
                    }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: isActive ? 700 : 500,
                      backgroundColor: isActive ? '#111827' : '#f3f4f6',
                      color: isActive ? '#ffffff' : '#374151',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* View Switcher & Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {/* View Layout Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f6', padding: '2px', borderRadius: '8px' }}>
                <button
                  type="button"
                  title="Detailed View"
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewMode === 'list' ? '#ffffff' : 'transparent',
                    color: viewMode === 'list' ? '#111827' : '#6b7280',
                    cursor: 'pointer',
                    boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">view_stream</span>
                </button>
                <button
                  type="button"
                  title="Grid View (2-Column)"
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewMode === 'grid' ? '#ffffff' : 'transparent',
                    color: viewMode === 'grid' ? '#111827' : '#6b7280',
                    cursor: 'pointer',
                    boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                </button>
              </div>

              {/* Sort Dropdown */}
              <div style={{ position: 'relative' }}>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    triggerToast(`Sorted problems: ${e.target.value}`);
                  }}
                  style={{
                    appearance: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#4b5563',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '5px 22px 5px 10px',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option>Sort: Newest First</option>
                  <option>Sort: Phase Urgency</option>
                  <option>Sort: Target Population</option>
                  <option>Sort: Institution Name</option>
                </select>
                <span
                  className="material-symbols-outlined text-[14px] text-neutral-400"
                  style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                >
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Cards Grid Container (Adapts cleanly based on viewMode) */}
          <div className={`gov-assigned-cards-grid ${viewMode === 'grid' ? 'two-cols' : ''}`}>
            {filteredProblems.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                <span className="material-symbols-outlined text-[36px] text-neutral-400">search_off</span>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  No assigned problems match your active filter criteria.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveDomainFilter('All Domains');
                    setSelectedUniFilter('All Universities');
                  }}
                  style={{
                    marginTop: '0.5rem',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredProblems.map((problem) => (
                <div key={problem.id} className="gov-assigned-card">
                  <div>
                    {/* Top Row: Category tag + Status pill */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: problem.categoryBg,
                          color: problem.categoryColor,
                          fontSize: '11px',
                          fontWeight: 700,
                          border: `1px solid ${problem.categoryBorder}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span className="material-symbols-outlined text-[13px]">{problem.categoryIcon}</span>
                        <span>{problem.category}</span>
                      </span>

                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: '9999px',
                          backgroundColor: problem.statusBg,
                          color: problem.statusColor,
                          fontSize: '11px',
                          fontWeight: 700,
                          border: `1px solid ${problem.statusBorder}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: problem.statusDot
                          }}
                        />
                        <span>{problem.status}</span>
                      </span>
                    </div>

                    {/* Problem Statement Title & District */}
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#9ca3af', fontWeight: 500, marginBottom: '4px' }}>
                        <span className="material-symbols-outlined text-[13px] text-neutral-400">location_on</span>
                        <span>{problem.location}</span>
                        <span>•</span>
                        <span>Assigned {problem.assignedDate}</span>
                      </div>
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: '#111827',
                          lineHeight: 1.4,
                          margin: 0
                        }}
                      >
                        {problem.title}
                      </h3>
                    </div>

                    {/* Summary Description */}
                    <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.55, margin: '0 0 12px 0' }}>
                      {problem.desc}
                    </p>

                    {/* Assigned Institution Cardlet */}
                    <div
                      style={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #f3f4f6',
                        borderRadius: '0.75rem',
                        padding: '10px 12px',
                        marginBottom: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 800,
                              color: '#111827',
                              flexShrink: 0
                            }}
                          >
                            {problem.institution.abbr}
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {problem.institution.name}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#047857',
                            backgroundColor: '#ecfdf5',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid #a7f3d0',
                            flexShrink: 0
                          }}
                        >
                          {problem.institution.tag}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {problem.institution.dept}
                      </div>
                    </div>

                    {/* Industry Co-Investor Pill (Robust & Truncation-Proof) */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '8px 12px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        minWidth: 0
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: '#f5f5f4',
                            border: '1px solid #e7e5e4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#44403c',
                            flexShrink: 0
                          }}
                        >
                          <span className="material-symbols-outlined text-[13px]">handshake</span>
                        </div>
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#9ca3af' }}>
                            Industry Co-Investor
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {problem.industry.name}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>
                          {problem.industry.grant}
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#059669' }}>
                          {problem.industry.grantLabel}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics Footer & Action */}
                  <div
                    style={{
                      paddingTop: '10px',
                      borderTop: '1px solid #f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#111827' }}>{problem.metrics.primary}</div>
                      <div style={{ color: '#6b7280', fontSize: '10px' }}>{problem.metrics.secondary}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/government/reports/${problem.reportId}`)}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: '#111827',
                        color: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        flexShrink: 0
                      }}
                    >
                      <span>Lab Report</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Pagination Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb',
              fontSize: '12px',
              color: '#6b7280'
            }}
          >
            <div>
              Showing <span style={{ fontWeight: 700, color: '#111827' }}>1 – {filteredProblems.length}</span> of 370 assigned university problems
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                className="gov-page-btn"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(p - 1, 1));
                  triggerToast('Viewing previous page');
                }}
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <button
                type="button"
                className={`gov-page-btn ${currentPage === 1 ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(1);
                  triggerToast('Viewing Page 1 of Assigned R&D Projects');
                }}
              >
                1
              </button>
              <button
                type="button"
                className={`gov-page-btn ${currentPage === 2 ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(2);
                  triggerToast('Viewing Page 2 of Assigned R&D Projects');
                }}
              >
                2
              </button>
              <button
                type="button"
                className={`gov-page-btn ${currentPage === 3 ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(3);
                  triggerToast('Viewing Page 3 of Assigned R&D Projects');
                }}
              >
                3
              </button>
              <span style={{ padding: '0 4px', color: '#9ca3af' }}>...</span>
              <button
                type="button"
                className="gov-page-btn"
                onClick={() => triggerToast('Viewing Page 62')}
              >
                62
              </button>
              <button
                type="button"
                className="gov-page-btn"
                onClick={() => {
                  setCurrentPage((p) => Math.min(p + 1, 62));
                  triggerToast('Viewing next page');
                }}
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT RAIL PANEL: 4 COLS CONTEXTUAL SIDEBAR */}
        <div className="gov-assigned-right-rail">
          
          {/* Quick Actions Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              border: '1px solid rgba(0,0,0,0.08)',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <h4
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#111827',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>Admin Actions</span>
              <span className="material-symbols-outlined text-[18px] text-neutral-400">bolt</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => triggerToast('Initiating State R&D Desk Assignment Flow')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined text-[17px]">assignment_add</span>
                  <span>Delegate New Problem</span>
                </span>
                <span style={{ fontSize: '10px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                  R&amp;D Desk
                </span>
              </button>

              <button
                type="button"
                onClick={() => triggerToast('Generating Comprehensive State Academic R&D Brief (PDF / CSV)...')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#f9fafb',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined text-[17px] text-neutral-500">download</span>
                  <span>Download State R&amp;D Brief</span>
                </span>
                <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 800 }}>PDF / CSV</span>
              </button>
            </div>
          </div>

          {/* Partner University Hubs */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              border: '1px solid rgba(0,0,0,0.08)',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  Partner University Hubs
                </h4>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                  Empaneled state research institutions
                </p>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f3f4f6', color: '#374151', fontSize: '10px', fontWeight: 800 }}>
                6 Active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { abbr: 'BM', name: 'BIT Mesra', badge: 'MoU', badgeColor: '#047857', badgeBg: '#ecfdf5', dept: 'Chemical, Water & Biotech Labs', count: '142' },
                { abbr: 'IIT', name: 'IIT (ISM) Dhanbad', badge: 'IoE', badgeColor: '#6b21a8', badgeBg: '#f3e8ff', dept: 'Power Systems & Mineral Engg', count: '89' },
                { abbr: 'BAU', name: 'Birsa Agri University', badge: 'MoU', badgeColor: '#047857', badgeBg: '#ecfdf5', dept: 'Plant Pathology & Soil Drone Lab', count: '215' },
                { abbr: 'NIT', name: 'NIT Jamshedpur', badge: 'MoU', badgeColor: '#047857', badgeBg: '#ecfdf5', dept: 'Civil & Geotechnical IoT Labs', count: '48' }
              ].map((hub) => (
                <div
                  key={hub.name}
                  onClick={() => {
                    setSelectedUniFilter(hub.name);
                    triggerToast(`Showing active assignments for ${hub.name}`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px',
                    borderRadius: '0.75rem',
                    border: '1px solid #f3f4f6',
                    backgroundColor: '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '11px',
                        color: '#111827',
                        flexShrink: 0
                      }}
                    >
                      {hub.abbr}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hub.name}</span>
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            color: hub.badgeColor,
                            backgroundColor: hub.badgeBg,
                            padding: '1px 5px',
                            borderRadius: '4px',
                            flexShrink: 0
                          }}
                        >
                          {hub.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {hub.dept}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>{hub.count}</div>
                    <div style={{ fontSize: '9px', color: '#9ca3af' }}>Assigned</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => triggerToast('Opening State University Consortium Portal')}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '8px',
                border: '1px solid #e5e7eb',
                color: '#374151',
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>View All 6 Academic Hubs</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Upcoming Lab Milestones Timeline */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              border: '1px solid rgba(0,0,0,0.08)',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  Upcoming Lab Milestones
                </h4>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                  Critical review deadlines &amp; field tests
                </p>
              </div>
              <span className="material-symbols-outlined text-[18px] text-neutral-400">calendar_today</span>
            </div>

            {/* Timeline container */}
            <div style={{ position: 'relative', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Vertical line */}
              <div
                style={{
                  position: 'absolute',
                  left: '6px',
                  top: '6px',
                  bottom: '6px',
                  width: '2px',
                  backgroundColor: '#e5e7eb'
                }}
              />

              {/* Milestone 1 */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.25rem',
                    top: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#111827',
                    boxShadow: '0 0 0 3px #ffffff'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>Village Kisan Demo</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#059669' }}>Oct 30</span>
                </div>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>BAU Agritech Team · Mandar Block</p>
              </div>

              {/* Milestone 2 */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.25rem',
                    top: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#f59e0b',
                    boxShadow: '0 0 0 3px #ffffff'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>Lab Batch Chemical Test</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#d97706' }}>Nov 02</span>
                </div>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>BIT Mesra Nano-Filtration · Bero Water</p>
              </div>

              {/* Milestone 3 */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.25rem',
                    top: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    boxShadow: '0 0 0 3px #ffffff'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>Surge Suppressor Bench Test</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb' }}>Nov 07</span>
                </div>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>IIT ISM Clean Energy · Micro-grid Unit</p>
              </div>

              {/* Milestone 4 */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-1.25rem',
                    top: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#8b5cf6',
                    boxShadow: '0 0 0 3px #ffffff'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>500-Sample Sickle Cell Ethics</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#7c3aed' }}>Nov 12</span>
                </div>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>BIT Mesra &amp; AIIMS Deoghar joint board</p>
              </div>
            </div>

            <div
              style={{
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#6b7280'
              }}
            >
              <span>Next review: <strong>Friday, 10:00 AM</strong></span>
              <button
                type="button"
                onClick={() => triggerToast('iCal / Google Calendar sync file downloaded')}
                style={{
                  fontWeight: 700,
                  color: '#111827',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Sync Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentAssigned;
