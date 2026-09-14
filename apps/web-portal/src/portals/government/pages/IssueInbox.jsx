import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/governmentDashboard.css';

// 5 Detailed Issue Reports directly from Stitch Screen 0880a62941244f0b803d9e84d2b9f9e1
const INITIAL_ISSUES = [
  {
    id: '#SETU-8421',
    category: 'Water & Sanitation',
    district: 'Ranchi',
    ward: 'Ward 4, Namkum',
    title: 'Water Contamination (Fluoride & Heavy Iron Contamination in Village Tubewells)',
    citizenCount: 228,
    photoBadge: '4 Photos',
    photosCount: 4,
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&auto=format&fit=crop&q=80'
    ],
    desc: 'Groundwater extraction from three municipal handpumps in Ward 4 showing orange-tinted sediment and high chemical odor. Multiple households reporting skin irritation and turbidity. Water tanker emergency deployment delayed; BIT Mesra Water Tech lab requested for rapid chemical testing and field verification.',
    urgency: 'HIGH',
    taraScore: 4.8,
    status: 'Requires Triage',
    authority: 'PHED Drinking Water Wing / BIT Mesra Water Tech Lab',
    transcript: 'The water coming out of the Namkum village handpump is completely yellow-brown with heavy iron residue. Three children in our tola have fallen sick with stomach cramps. Please send testing kits and clean drinking tankers immediately.',
    suggestedDepts: ['BIT Mesra Water Tech Lab', 'PHED Drinking Water Wing', 'Ranchi Municipal Corporation (RMC)']
  },
  {
    id: '#SETU-8390',
    category: 'Roads & Infrastructure',
    district: 'Dhanbad',
    ward: 'Govindpur Market / NH-32 Connector',
    title: 'Pothole & Road Collapse on Culvert Edge (NH-32 Connector)',
    citizenCount: 89,
    photoBadge: '2 Photos',
    photosCount: 2,
    images: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=600&auto=format&fit=crop&q=80'
    ],
    desc: 'Heavy monsoon drainage runoff cracked the asphalt substructure on the western culvert approach near Govindpur market intersection. Exposed gravel and severe depression causing heavy transport vehicle blockages. Road barricading and rapid patch team deployed on-site.',
    urgency: 'CRITICAL',
    taraScore: 4.9,
    status: 'Field Team Assigned',
    authority: 'PWD District Road Wing / IIT (ISM) Dhanbad Infrastructure Cell',
    transcript: 'The edge of the culvert bridge on NH-32 connector has caved in over 2 feet deep after yesterday evening cloudburst. Trucks and two-wheelers are skidding and almost toppling over.',
    suggestedDepts: ['PWD Highway Division Dhanbad', 'IIT (ISM) Dhanbad Civil Engineering Cell']
  },
  {
    id: '#SETU-8314',
    category: 'Energy & Micro-Grids',
    district: 'Khunti',
    ward: 'Torpa Block, Ashram Campus',
    title: 'Solar Micro-Grid Inverter & Battery Bank Breakdown (Tribal Ashram Residential School)',
    citizenCount: 65,
    photoBadge: '3 Photos',
    photosCount: 3,
    images: [
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&auto=format&fit=crop&q=80'
    ],
    desc: '5kVA hybrid solar inverter tripping continuously under baseline load. Battery water level depleted and charge controller circuit burnt due to voltage spike. IIT Dhanbad research team assigned for low-cost controller repair and local technician skill transfer.',
    urgency: 'MEDIUM',
    taraScore: 3.9,
    status: 'Under Lab R&D',
    authority: 'JRED / Clean Power Innovation Lab, NIT Jamshedpur',
    transcript: 'The residential tribal school hostel has been in darkness for four nights because the solar battery controller blew out after thunder. The hostel cooks and study rooms have no backup power.',
    suggestedDepts: ['Clean Power Lab, NIT Jamshedpur', 'Jharkhand Renewable Energy Dev Agency (JREDA)']
  },
  {
    id: '#SETU-8277',
    category: 'Municipal Solid Waste',
    district: 'East Singhbhum',
    ward: 'Sakchi Central Wholesale Lane, Ward 14',
    title: 'Waste Accumulation & Stormwater Drainage Clog (Sakchi Central Wholesale Lane)',
    citizenCount: 112,
    photoBadge: '5 Photos + 1 Video',
    photosCount: 6,
    images: [
      'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600&auto=format&fit=crop&q=80'
    ],
    desc: 'Plastic waste debris, rotten produce cartons, and silt blocking main 36-inch stormwater culvert channel. Foul odor spreading and standing sewage water flooding pedestrian walkway. JNAC municipal vacuum suction unit scheduled for night clearance.',
    urgency: 'MEDIUM',
    taraScore: 3.6,
    status: 'Scheduled Clearance',
    authority: 'JNAC Municipal Sanitation Taskforce',
    transcript: 'Sakchi market drainage lane is choked completely with rotten vegetable packaging boxes and plastic bottles. Black drainage water is spilling onto the footpath and market shops.',
    suggestedDepts: ['Jamshedpur Notified Area Committee (JNAC)', 'Urban Solid Waste Cell']
  },
  {
    id: '#SETU-8192',
    category: 'Agriculture & Agritech',
    district: 'Ranchi',
    ward: 'Kanke Block, Mandar Village',
    title: 'Paddy Leaf Blight Outbreak Requiring Low-Cost Sensor Diagnostics',
    citizenCount: 215,
    photoBadge: '6 Photos',
    photosCount: 6,
    images: [
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80'
    ],
    desc: 'Bacterial leaf blight spreading rapidly after unseasonal rainfall. Farmers reporting yellow lesions and drying grains. Birsa Agricultural University Agritech lab deploying multispectral camera drones and optical soil sensors to isolate infected clusters before harvesting season.',
    urgency: 'HIGH',
    taraScore: 4.4,
    status: 'Agritech Team Deployed',
    authority: 'Birsa Agricultural University (BAU) Agritech Center',
    transcript: 'Over 40 acres of standing paddy crop in Mandar cluster is developing yellow water-soaked stripes on leaf margins. We need testing and bio-fungicide drone dispersion before the whole harvest is lost.',
    suggestedDepts: ['Birsa Agricultural University (BAU)', 'Jharkhand State Seed & Agriculture Directorate']
  }
];

export const GovernmentIssueInbox = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Filter issues based on search and category
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'All' || issue.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [issues, searchQuery, selectedCategory]);

  const handleAction = (issueId, actionName) => {
    setIssues((prev) =>
      prev.map((item) =>
        item.id === issueId ? { ...item, status: actionName } : item
      )
    );
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) => ({ ...prev, status: actionName }));
    }
    triggerToast(`✓ ${actionName} applied to ${issueId}`);
  };

  return (
    <div className="gov-main-inner" data-purpose="issue-inbox-main">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="gov-toast">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}
        {/* Top Header Row Matching Stitch */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: '#111827',
                margin: 0
              }}
            >
              Issue Inbox
            </h1>
          </div>

          {/* Top Right Filter & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '18px',
                  pointerEvents: 'none'
                }}
              >
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search issues, ward, or keyword..."
                style={{
                  paddingLeft: '38px',
                  paddingRight: '14px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#1f2937',
                  outline: 'none',
                  width: '260px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'border-color 0.15s ease'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Filter Dropdown Button */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                backgroundColor: isFilterOpen ? '#f3f4f6' : '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#374151',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'background-color 0.15s ease'
              }}
            >
              <span className="material-symbols-outlined text-[18px] text-neutral-500">tune</span>
              <span>Filters</span>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor: selectedCategory !== 'All' ? '#ef4444' : '#111827'
                }}
              ></span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => triggerToast('3 New urgent cluster alerts in Dhanbad & Ranchi')}
              style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                color: '#374151',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'background-color 0.15s ease'
              }}
            >
              <span className="material-symbols-outlined text-[19px]">notifications</span>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: '#f43f5e',
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  border: '2px solid #ffffff'
                }}
              ></span>
            </button>
          </div>
        </div>

        {/* Filter Quick Chips (Active when filters are open or when category selected) */}
        {isFilterOpen && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.875rem',
              overflowX: 'auto'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginRight: '4px' }}>
              Category:
            </span>
            {['All', 'Water & Sanitation', 'Roads & Infrastructure', 'Energy & Micro-Grids', 'Municipal Solid Waste', 'Agriculture & Agritech'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  backgroundColor: selectedCategory === cat ? '#111827' : '#f3f4f6',
                  color: selectedCategory === cat ? '#ffffff' : '#374151',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                style={{
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  color: '#dc2626',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Reset
              </button>
            )}
          </div>
        )}

        {/* Issues Reports List */}
        <div className="inbox-container">
          {filteredIssues.length === 0 ? (
            <div
              style={{
                padding: '3rem',
                backgroundColor: '#ffffff',
                borderRadius: '1rem',
                textAlign: 'center',
                border: '1px solid #e5e7eb'
              }}
            >
              <span className="material-symbols-outlined text-[36px] text-neutral-400">inbox</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.5rem 0' }}>No issues found</h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                Try adjusting your search query or reset your category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                style={{
                  marginTop: '1rem',
                  padding: '6px 14px',
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="inbox-card"
                onClick={() => navigate(`/government/reports/${issue.id.replace('#', '')}`)}
                title="Click to view full report detail, photo evidence, citizen profile & suggested university labs"
              >
                {/* Left Media Card / Stacked Images (Directly from Stitch) */}
                <div className="inbox-media-stack">
                  {/* Layer 1 (Back rotated) */}
                  <div className="inbox-media-layer-back">
                    <img
                      src={issue.images[1] || issue.images[0]}
                      alt="Field inspection back sample"
                    />
                  </div>

                  {/* Layer 2 (Middle rotated) */}
                  {issue.images.length > 2 && (
                    <div className="inbox-media-layer-mid">
                      <img
                        src={issue.images[2] || issue.images[0]}
                        alt="Field inspection mid sample"
                      />
                    </div>
                  )}

                  {/* Layer 3 (Front main image) */}
                  <div className="inbox-media-layer-front">
                    <img
                      src={issue.images[0]}
                      alt={issue.title}
                    />
                    <div className="inbox-media-badge">
                      <span className="material-symbols-outlined text-[13px]">photo_library</span>
                      <span>{issue.photoBadge}</span>
                    </div>
                  </div>
                </div>

                {/* Right Content */}
                <div className="inbox-content">
                  <div>
                    <h2 className="inbox-title">{issue.title}</h2>
                    <div className="inbox-reported-badge">
                      <span className="material-symbols-outlined text-[14px]">group</span>
                      <span>Reported by {issue.citizenCount} citizens</span>
                      <span style={{ margin: '0 4px', color: '#9ca3af' }}>·</span>
                      <span style={{ color: '#4b5563', fontWeight: 600 }}>{issue.ward}, {issue.district}</span>
                      <span style={{ margin: '0 4px', color: '#9ca3af' }}>·</span>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            issue.urgency === 'CRITICAL'
                              ? '#dc2626'
                              : issue.urgency === 'HIGH'
                              ? '#ea580c'
                              : '#2563eb'
                        }}
                      >
                        {issue.urgency} URGENCY
                      </span>
                    </div>
                    <p className="inbox-desc">{issue.desc}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#f3f4f6',
                          color: '#374151'
                        }}
                      >
                        {issue.id}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0'
                        }}
                      >
                        {issue.status}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#111827',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      View Details
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer matching Setu Government Portal */}
        <div className="inbox-pagination">
          <div>
            Showing <span style={{ fontWeight: 700, color: '#111827' }}>1 – {filteredIssues.length}</span> of{' '}
            <span style={{ fontWeight: 700, color: '#111827' }}>1,432</span> reported issues
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className="inbox-page-btn"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                triggerToast('Navigating to previous page');
              }}
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button
              type="button"
              className={`inbox-page-btn ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button
              type="button"
              className={`inbox-page-btn ${currentPage === 2 ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage(2);
                triggerToast('Showing page 2 of verified civic issues');
              }}
            >
              2
            </button>
            <button
              type="button"
              className={`inbox-page-btn ${currentPage === 3 ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage(3);
                triggerToast('Showing page 3 of verified civic issues');
              }}
            >
              3
            </button>
            <span style={{ padding: '0 4px', color: '#9ca3af' }}>...</span>
            <button
              type="button"
              className="inbox-page-btn"
              onClick={() => {
                setCurrentPage(287);
                triggerToast('Showing page 287 (Archived verified issues)');
              }}
            >
              287
            </button>
            <button
              type="button"
              className="inbox-page-btn"
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, 287));
                triggerToast('Navigating to next page');
              }}
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
    </div>
  );
};

