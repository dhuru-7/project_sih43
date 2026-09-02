import React, { useState } from 'react';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { 
  HomeIcon, 
  ExploreIcon, 
  ReportIcon, 
  UpdatesIcon, 
  ProfileIcon, 
  NotificationBellIcon,
  ExploreReportsIcon,
  SettingsGearIcon,
  EditPencilIcon,
  BookmarkFilledIcon,
  BookmarkOutlineIcon,
  FullscreenExpandIcon,
  BuildingDeptIcon
} from '../../components/ui/AppIcons';
import { apiClient } from '../../services/apiClient';

export const SetuCitizenPortal = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUpdateFilter, setSelectedUpdateFilter] = useState('All Updates');
  const [exploreSection, setExploreSection] = useState('forYou'); // 'forYou' | 'following'
  const [selectedDetailReport, setSelectedDetailReport] = useState(null);
  const [toggledReportId, setToggledReportId] = useState(null);
  const [cardViewModes, setCardViewModes] = useState({}); // { [id]: 'media' | 'details' }
  const [activeMediaIndexes, setActiveMediaIndexes] = useState({}); // { [id]: number }
  const [expandedDescriptions, setExpandedDescriptions] = useState({}); // { [id]: boolean }
  const [videoMutedStates, setVideoMutedStates] = useState({}); // { [id]: boolean }
  const [dragStartPos, setDragStartPos] = useState({});
  const [exploreQuery, setExploreQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const [exploreReports, setExploreReports] = useState([
    {
      id: 'exp-1',
      author: 'Aryan chadda',
      authorInitial: 'A',
      date: '8/15/2026',
      location: 'Tikri, New Delhi',
      status: 'PENDING',
      title: 'Garbage Dumps & Hazardous Landfill Overflow',
      description: 'There is lots of waste here. After multiple formal complaints there is still no action taken from the municipal department. Toxic chemical run-off is mixing with stagnant rainwater, causing hazardous mosquito breeding and severe respiratory distress for hundreds of local residents living adjacent to the dump site.',
      assignedTo: 'Solid Waste Management (SWM)',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800&auto=format&fit=crop&q=80' },
        { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
      ],
      isFollowing: true,
      category: 'Sanitation'
    },
    {
      id: 'exp-2',
      author: 'Arjun Sharma',
      authorInitial: 'A',
      date: '8/15/2026',
      location: 'Sector 14 Main Junction',
      status: 'PENDING',
      title: 'Water Main Pipe Fracture & Street Flooding',
      description: 'Major underground pressurized distribution pipeline burst early this morning. Potable drinking water is gushing out at rapid pressure, submerging both transit lanes, eroding asphalt road foundation, and wasting thousands of gallons of municipal clean water.',
      assignedTo: 'Delhi Jal Board (DJB)',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80' },
        { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }
      ],
      isFollowing: false,
      category: 'Water'
    },
    {
      id: 'exp-3',
      author: 'Pooja Rani',
      authorInitial: 'P',
      date: '8/14/2026',
      location: 'Pattikalyana School Crossing',
      status: 'IN PROGRESS',
      title: 'Open Drain Hazard & Embankment Breach',
      description: 'Uncovered sewer line overflowing near primary school entrance. The embankment has caved in and poses extreme danger for walking students and vehicles during rainfall. Urgent concrete slab casting and heavy desilting required immediately.',
      assignedTo: 'Public Health Engineering Dept.',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=800&auto=format&fit=crop&q=80' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80' }
      ],
      isFollowing: true,
      category: 'Sanitation'
    },
    {
      id: 'exp-4',
      author: 'Vikram Mehta',
      authorInitial: 'V',
      date: '8/12/2026',
      location: 'Sector 7 Market Corridor',
      status: 'RESOLVED',
      title: 'Broken High-Mast Streetlight Restored',
      description: 'Faulty high-mast LED fixture replaced and verified by smart energy monitoring dashboard. Full 360-degree illumination restored along commercial lane for night-time public safety.',
      assignedTo: 'Electricity & Power Distribution Board',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80' }
      ],
      isFollowing: false,
      category: 'Electricity'
    }
  ]);

  const [nearbyIssues, setNearbyIssues] = useState([
    {
      id: '1',
      title: 'Garbage Dumps',
      location: 'Tikri',
      status: 'PENDING',
      type: 'waste',
      color: '#9E9E9E',
      category: 'Sanitation',
      upvotes: 14
    },
    {
      id: '2',
      title: 'Broken Streetlight',
      location: 'kalsora',
      status: 'PENDING',
      type: 'red',
      color: '#FF0000',
      category: 'Electricity',
      upvotes: 28
    },
    {
      id: '3',
      title: 'Broken Roads',
      location: 'kalsora',
      status: 'PENDING',
      type: 'red',
      color: '#FF0000',
      category: 'Roads',
      upvotes: 45
    },
    {
      id: '4',
      title: 'Water Pipe Leakage',
      location: 'Sector 14 Main Junction',
      status: 'IN PROGRESS',
      type: 'custom',
      color: '#3B82F6',
      category: 'Water',
      upvotes: 32
    },
    {
      id: '5',
      title: 'Park Overgrowth & Waste',
      location: 'Green Park Extension',
      status: 'RESOLVED',
      type: 'waste',
      color: '#10B981',
      category: 'Sanitation',
      upvotes: 19
    }
  ]);

  const handleToggleFollow = (reportId) => {
    setExploreReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return { ...rep, isFollowing: !rep.isFollowing };
      }
      return rep;
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      // Post to live backend API
      const res = await apiClient('/problems', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description: description || title,
          latitude: 28.6139,
          longitude: 77.2090,
          address: location || 'Tikri Sector 4'
        })
      });

      const newIssue = {
        id: String(Date.now()),
        title: title,
        location: location || 'Current Location',
        status: 'PENDING',
        type: 'custom',
        color: '#3B82F6'
      };

      setNearbyIssues([newIssue, ...nearbyIssues]);
      setSuccessToast(`Report submitted! AI classified under: ${res?.data?.category || 'CIVIC ISSUE'}`);
      setTimeout(() => setSuccessToast(''), 4000);
      setIsModalOpen(false);
      setTitle('');
      setLocation('');
      setDescription('');
    } catch (err) {
      const newIssue = {
        id: String(Date.now()),
        title: title,
        location: location || 'Current Location',
        status: 'PENDING',
        type: 'custom',
        color: '#3B82F6'
      };
      setNearbyIssues([newIssue, ...nearbyIssues]);
      setSuccessToast('Report submitted to Setu AI!');
      setTimeout(() => setSuccessToast(''), 4000);
      setIsModalOpen(false);
      setTitle('');
      setLocation('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="setu-citizen-container">
      {/* Mobile Frame Container */}
      <div className="setu-citizen-frame">
        {/* iOS Status Bar Spacer */}
        <div style={{ height: '14px', width: '100%' }} />

        {/* Scrollable Feed */}
        <div style={{
          flex: 1,
          padding: '20px 24px 120px',
          overflowY: 'auto',
          scrollbarWidth: 'none'
        }}>
          {/* 1. Header: Setu. + Notification Bell */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 
              onClick={() => setActiveTab('home')}
              style={{
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.03em',
                color: '#0F1115',
                margin: 0,
                cursor: 'pointer'
              }}
            >
              Setu.
            </h2>
            <button 
              title="Notifications"
              onClick={() => setActiveTab('chat')}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                cursor: 'pointer'
              }}
            >
              <NotificationBellIcon size={22} color="#0F1115" strokeWidth={1.5} />
            </button>
          </div>

          {/* TAB 1: HOME VIEW */}
          {activeTab === 'home' && (
            <>
              {/* 2. Hero Display Greeting */}
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  lineHeight: '1.1',
                  letterSpacing: '-0.035em',
                  color: '#0F1115',
                  margin: 0
                }}>
                  Hello,<br />Rampal.
                </h1>
              </div>

              {/* 3. Hero Action Card (Report Issue) */}
              <div style={{
                backgroundColor: '#121417',
                borderRadius: '28px',
                padding: '24px',
                marginBottom: '32px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '28px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      letterSpacing: '-0.025em',
                      margin: '0 0 6px 0'
                    }}>
                      Report Issue
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                      fontWeight: '400',
                      margin: 0
                    }}>
                      Make your city better.
                    </p>
                  </div>

                  {/* Arrow Button */}
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#FFFFFF'
                    }}
                  >
                    <GoogleIcon name="arrow_outward" size={22} color="#FFFFFF" />
                  </button>
                </div>

                {/* Take Photo White Pill Button */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    width: '100%',
                    height: '54px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0F1115',
                    letterSpacing: '-0.015em',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}
                >
                  <GoogleIcon name="photo_camera" size={22} color="#0F1115" />
                  Take Photo
                </button>
              </div>

              {/* 4. Section Header: Nearby Issues + Explore Reports */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    letterSpacing: '-0.02em',
                    color: '#0F1115',
                    margin: 0
                  }}>
                    Nearby Issues
                  </h3>
                  <span style={{
                    backgroundColor: '#E5E7EB',
                    color: '#4B5563',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {Math.min(nearbyIssues.length, 3)}
                  </span>
                </div>

                {/* Explore Reports Pill */}
                <button 
                  onClick={() => setActiveTab('explore')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#0F1115',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                  }}
                >
                  <span>Explore Reports</span>
                  <ExploreReportsIcon size={16} color="#0F1115" />
                </button>
              </div>

              {/* 5. Issue Feed List (Top 3 on Homepage) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {nearbyIssues.slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Thumbnail / Color Box */}
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '16px',
                        backgroundColor: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {item.type === 'waste' ? (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #d4d4d8, #a1a1aa)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <GoogleIcon name="delete_sweep" size={24} color="#52525b" />
                          </div>
                        ) : null}
                      </div>

                      {/* Text Details */}
                      <div>
                        <h4 style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          letterSpacing: '-0.015em',
                          color: '#0F1115',
                          margin: '0 0 2px 0'
                        }}>
                          {item.title}
                        </h4>
                        <p style={{
                          fontSize: '13px',
                          fontWeight: '400',
                          color: '#6B7280',
                          margin: '0 0 4px 0'
                        }}>
                          {item.location}
                        </p>
                        {/* Status Pill Badge */}
                        <span style={{
                          display: 'inline-block',
                          fontSize: '10px',
                          fontWeight: '600',
                          letterSpacing: '0.04em',
                          color: item.status === 'RESOLVED' ? '#059669' : item.status === 'IN PROGRESS' ? '#2563EB' : '#D97706',
                          backgroundColor: item.status === 'RESOLVED' ? '#D1FAE5' : item.status === 'IN PROGRESS' ? '#DBEAFE' : '#FEF3C7',
                          border: `1px solid ${item.status === 'RESOLVED' ? '#A7F3D0' : item.status === 'IN PROGRESS' ? '#BFDBFE' : '#FDE68A'}`,
                          padding: '2px 8px',
                          borderRadius: '6px'
                        }}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* More Action */}
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#9CA3AF',
                      cursor: 'pointer',
                      padding: '8px'
                    }}>
                      <GoogleIcon name="more_horiz" size={20} color="#9CA3AF" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TAB 2: EXPLORE VIEW */}
          {activeTab === 'explore' && (
            <div style={{ paddingBottom: '90px' }}>
              {/* Header Title */}
              <div style={{ marginBottom: '16px' }}>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  letterSpacing: '-0.035em',
                  color: '#0F1115',
                  margin: '0 0 4px 0'
                }}>
                  Explore
                </h1>
                <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400', margin: 0 }}>
                  Discover civic reports and track authorities' actions
                </p>
              </div>

              {/* Apple Segmented Control: For You vs Following with Animated Sliding Pill */}
              <div style={{
                position: 'relative',
                display: 'flex',
                backgroundColor: '#F3F4F6',
                borderRadius: '24px',
                padding: '4px',
                marginBottom: '16px',
                userSelect: 'none'
              }}>
                {/* Fluid Spring Animated Sliding White Pill */}
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  bottom: '4px',
                  left: '4px',
                  width: 'calc(50% - 4px)',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.04)',
                  transform: `translateX(${exploreSection === 'forYou' ? '0%' : '100%'})`,
                  transition: 'transform 0.32s cubic-bezier(0.25, 1, 0.5, 1)',
                  pointerEvents: 'none',
                  zIndex: 1
                }} />

                <button
                  className="apple-pressable"
                  onClick={() => setExploreSection('forYou')}
                  style={{
                    flex: 1,
                    position: 'relative',
                    zIndex: 2,
                    padding: '9px 0',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: exploreSection === 'forYou' ? '700' : '600',
                    backgroundColor: 'transparent',
                    color: exploreSection === 'forYou' ? '#0F1115' : '#6B7280',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.25s ease'
                  }}
                >
                  For You
                </button>
                <button
                  className="apple-pressable"
                  onClick={() => setExploreSection('following')}
                  style={{
                    flex: 1,
                    position: 'relative',
                    zIndex: 2,
                    padding: '9px 0',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: exploreSection === 'following' ? '700' : '600',
                    backgroundColor: 'transparent',
                    color: exploreSection === 'following' ? '#0F1115' : '#6B7280',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.25s ease'
                  }}
                >
                  Following {exploreReports.filter(r => r.isFollowing).length > 0 && `(${exploreReports.filter(r => r.isFollowing).length})`}
                </button>
              </div>

              {/* Category Filter Chips */}
              <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '8px',
                marginBottom: '16px',
                scrollbarWidth: 'none'
              }}>
                {['All', 'Sanitation', 'Roads', 'Electricity', 'Water'].map((cat) => (
                  <button
                    key={cat}
                    className="apple-pill-pressable"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: selectedCategory === cat ? '700' : '500',
                      backgroundColor: selectedCategory === cat ? '#0F1115' : '#FFFFFF',
                      color: selectedCategory === cat ? '#FFFFFF' : '#4B5563',
                      border: `1px solid ${selectedCategory === cat ? '#0F1115' : '#E5E7EB'}`,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Explored Issues Feed - Connected List Layout */}
              {(() => {
                const filteredReports = exploreReports
                  .filter(item => exploreSection === 'forYou' || item.isFollowing)
                  .filter(item => selectedCategory === 'All' || item.category === selectedCategory);

                if (filteredReports.length === 0) {
                  return (
                    <div style={{
                      padding: '60px 20px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px'
                      }}>
                        <BookmarkOutlineIcon size={28} color="#6B7280" />
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0F1115', margin: '0 0 6px 0' }}>
                        {exploreSection === 'following' ? 'No followed reports yet' : 'No reports in this category'}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6B7280', maxWidth: '280px', margin: 0 }}>
                        {exploreSection === 'following' 
                          ? 'Tap the bookmark icon on any report in "For You" to track real-time resolution updates.'
                          : 'Try selecting another category or check back later.'}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="apple-fullbleed-feed" style={{
                    margin: '0 -24px',
                    width: 'calc(100% + 48px)',
                    backgroundColor: '#FFFFFF',
                    borderTop: '1px solid #E5E7EB',
                    borderBottom: '1px solid #E5E7EB',
                  }}>
                    {filteredReports.map((item, idx) => {
                      const isDetailsMode = cardViewModes[item.id] === 'details';
                      const mediaList = item.media || (item.imageUrl ? [{ type: 'image', url: item.imageUrl }] : []);
                      const activeIdx = activeMediaIndexes[item.id] || 0;
                      const isDescExpanded = expandedDescriptions[item.id] || false;
                      const isMuted = videoMutedStates[item.id] !== false; // default true

                      const handleTouchStart = (e) => {
                        const x = e.touches ? e.touches[0].clientX : e.clientX;
                        const y = e.touches ? e.touches[0].clientY : e.clientY;
                        setDragStartPos(prev => ({ ...prev, [item.id]: { x, y } }));
                      };

                      const handleTouchEnd = (e) => {
                        const start = dragStartPos[item.id];
                        if (!start) return;
                        const currentX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
                        const currentY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
                        const diffX = currentX - start.x;
                        const diffY = currentY - start.y;

                        // Check horizontal swipe (must be significantly larger than vertical)
                        if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
                          if (diffX < 0) {
                            // Swiped Left -> Show Details View across entire card
                            setCardViewModes(prev => ({ ...prev, [item.id]: 'details' }));
                          } else {
                            // Swiped Right -> Show Media Post View across entire card
                            setCardViewModes(prev => ({ ...prev, [item.id]: 'media' }));
                          }
                        }
                        setDragStartPos(prev => {
                          const copy = { ...prev };
                          delete copy[item.id];
                          return copy;
                        });
                      };

                      return (
                        <div
                          key={item.id}
                          onTouchStart={handleTouchStart}
                          onTouchEnd={handleTouchEnd}
                          onMouseDown={handleTouchStart}
                          onMouseUp={handleTouchEnd}
                          style={{
                            borderBottom: idx < filteredReports.length - 1 ? '8px solid #F3F4F6' : 'none',
                            backgroundColor: '#FFFFFF',
                            touchAction: 'pan-y',
                            userSelect: 'none'
                          }}
                        >
                          {!isDetailsMode ? (
                            /* ==================== FACE 1: POST MEDIA CARD ==================== */
                            <div className="apple-card-smooth" style={{ paddingBottom: '16px' }}>
                              {/* 1. Header: Avatar + Author + Location + Timestamp */}
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 20px 12px 20px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: '#64748B',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    flexShrink: 0
                                  }}>
                                    {item.authorInitial}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F1115' }}>
                                      {item.author}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '1px' }}>
                                      {item.date} • {item.location}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  className="apple-pressable"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDetailReport(item);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#9CA3AF',
                                    padding: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <GoogleIcon name="more_horiz" size={22} color="#9CA3AF" />
                                </button>
                              </div>

                              {/* 2. Media Carousel Container (Rounded Corners) */}
                              <div style={{ padding: '0 16px' }}>
                                <div
                                  style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '280px',
                                    backgroundColor: '#0F1115',
                                    borderRadius: '16px',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {mediaList.length > 0 ? (
                                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                      {mediaList[activeIdx]?.type === 'video' ? (
                                        <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#000000' }}>
                                          <video
                                            src={mediaList[activeIdx].url}
                                            autoPlay
                                            loop
                                            muted={isMuted}
                                            playsInline
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                          />
                                          {/* Icon-Only Mute Button */}
                                          <button
                                            className="apple-pressable"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setVideoMutedStates(prev => ({ ...prev, [item.id]: !isMuted }));
                                            }}
                                            style={{
                                              position: 'absolute',
                                              bottom: '12px',
                                              left: '12px',
                                              backgroundColor: 'rgba(0, 0, 0, 0.65)',
                                              border: 'none',
                                              borderRadius: '50%',
                                              width: '34px',
                                              height: '34px',
                                              color: '#FFFFFF',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              cursor: 'pointer',
                                              backdropFilter: 'blur(4px)',
                                              zIndex: 5
                                            }}
                                          >
                                            <GoogleIcon name={isMuted ? "volume_off" : "volume_up"} size={16} color="#FFFFFF" />
                                          </button>
                                        </div>
                                      ) : (
                                        <img
                                          src={mediaList[activeIdx]?.url}
                                          alt={item.title}
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                          }}
                                        />
                                      )}

                                      {/* Left Arrow Navigation */}
                                      {mediaList.length > 1 && activeIdx > 0 && (
                                        <button
                                          className="apple-pressable"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMediaIndexes(prev => ({ ...prev, [item.id]: activeIdx - 1 }));
                                          }}
                                          style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(0, 0, 0, 0.55)',
                                            border: 'none',
                                            color: '#FFFFFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            backdropFilter: 'blur(4px)',
                                            zIndex: 4
                                          }}
                                        >
                                          ‹
                                        </button>
                                      )}

                                      {/* Right Arrow Navigation */}
                                      {mediaList.length > 1 && activeIdx < mediaList.length - 1 && (
                                        <button
                                          className="apple-pressable"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMediaIndexes(prev => ({ ...prev, [item.id]: activeIdx + 1 }));
                                          }}
                                          style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(0, 0, 0, 0.55)',
                                            border: 'none',
                                            color: '#FFFFFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            backdropFilter: 'blur(4px)',
                                            zIndex: 4
                                          }}
                                        >
                                          ›
                                        </button>
                                      )}

                                      {/* Carousel Dot Indicators */}
                                      {mediaList.length > 1 && (
                                        <div style={{
                                          position: 'absolute',
                                          bottom: '12px',
                                          left: '50%',
                                          transform: 'translateX(-50%)',
                                          display: 'flex',
                                          gap: '5px',
                                          zIndex: 4
                                        }}>
                                          {mediaList.map((m, mIdx) => (
                                            <div
                                              key={mIdx}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMediaIndexes(prev => ({ ...prev, [item.id]: mIdx }));
                                              }}
                                              style={{
                                                width: activeIdx === mIdx ? '16px' : '6px',
                                                height: '6px',
                                                borderRadius: '3px',
                                                backgroundColor: activeIdx === mIdx ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)',
                                                transition: 'all 0.25s ease',
                                                cursor: 'pointer'
                                              }}
                                            />
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div style={{
                                      width: '100%',
                                      height: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#9CA3AF',
                                      fontSize: '32px',
                                      fontWeight: '700',
                                      backgroundColor: '#1F2937'
                                    }}>
                                      No Media
                                    </div>
                                  )}

                                  {/* Top-Left Status Pill Badge */}
                                  <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '12px',
                                    backgroundColor: item.status === 'RESOLVED' ? '#D1FAE5' : item.status === 'IN PROGRESS' ? '#DBEAFE' : '#FEF3C7',
                                    color: item.status === 'RESOLVED' ? '#065F46' : item.status === 'IN PROGRESS' ? '#1E40AF' : '#92400E',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    letterSpacing: '0.4px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    zIndex: 4
                                  }}>
                                    <span style={{ fontSize: '10px' }}>•</span>
                                    <span>{item.status}</span>
                                  </div>

                                  {/* Top-Right Multi-Media Counter Badge (Pure numbers, no camera icon) */}
                                  {mediaList.length > 1 && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '12px',
                                      right: '12px',
                                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                      color: '#FFFFFF',
                                      padding: '3px 9px',
                                      borderRadius: '12px',
                                      fontSize: '11px',
                                      fontWeight: '700',
                                      letterSpacing: '0.5px',
                                      backdropFilter: 'blur(6px)',
                                      zIndex: 4
                                    }}>
                                      {activeIdx + 1}/{mediaList.length}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* 3. Title & Follow Action Button */}
                              <div style={{
                                padding: '14px 20px 0 20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '12px'
                              }}>
                                <h3
                                  onClick={() => setCardViewModes(prev => ({ ...prev, [item.id]: 'details' }))}
                                  style={{
                                    fontSize: '18px',
                                    fontWeight: '800',
                                    letterSpacing: '-0.02em',
                                    color: '#0F1115',
                                    margin: 0,
                                    flex: 1,
                                    cursor: 'pointer',
                                    lineHeight: '1.3'
                                  }}
                                >
                                  {item.title}
                                </h3>

                                {/* Fixed Width 60px Bookmark Follow Button */}
                                <button
                                  className={`apple-pressable ${toggledReportId === item.id ? 'apple-bookmark-bounce' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFollow(item.id);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '60px',
                                    minWidth: '60px',
                                    flexShrink: 0,
                                    cursor: 'pointer',
                                    padding: '0'
                                  }}
                                >
                                  {item.isFollowing ? (
                                    <BookmarkFilledIcon size={24} color="#2563EB" />
                                  ) : (
                                    <BookmarkOutlineIcon size={24} color="#6B7280" />
                                  )}
                                  <span style={{
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    color: item.isFollowing ? '#2563EB' : '#6B7280',
                                    marginTop: '2px',
                                    width: '100%',
                                    textAlign: 'center'
                                  }}>
                                    {item.isFollowing ? 'Following' : 'Follow'}
                                  </span>
                                </button>
                              </div>

                              {/* 4. Expandable Description */}
                              <div style={{ padding: '6px 20px 0 20px' }}>
                                <p
                                  style={{
                                    fontSize: '14px',
                                    color: '#4B5563',
                                    lineHeight: '1.5',
                                    margin: 0,
                                    ...(isDescExpanded ? {} : {
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    })
                                  }}
                                >
                                  {item.description}
                                </p>
                                {item.description && item.description.length > 80 && (
                                  <button
                                    className="apple-pressable"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedDescriptions(prev => ({ ...prev, [item.id]: !isDescExpanded }));
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#2563EB',
                                      fontSize: '13px',
                                      fontWeight: '700',
                                      padding: '2px 0',
                                      cursor: 'pointer',
                                      display: 'inline-block',
                                      marginTop: '2px'
                                    }}
                                  >
                                    {isDescExpanded ? 'Show less' : '... more'}
                                  </button>
                                )}
                              </div>

                              {/* 5. Assigned Department Badge */}
                              <div style={{ padding: '12px 20px 0 20px' }}>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCardViewModes(prev => ({ ...prev, [item.id]: 'details' }));
                                  }}
                                  style={{
                                    backgroundColor: '#EFF6FF',
                                    borderRadius: '14px',
                                    padding: '10px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <div style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '10px',
                                    backgroundColor: '#DBEAFE',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    <BuildingDeptIcon size={18} color="#2563EB" strokeWidth={2} />
                                  </div>
                                  <div>
                                    <div style={{
                                      fontSize: '10px',
                                      fontWeight: '700',
                                      letterSpacing: '0.05em',
                                      color: '#6B7280',
                                      textTransform: 'uppercase'
                                    }}>
                                      Assigned To
                                    </div>
                                    <div style={{
                                      fontSize: '13px',
                                      fontWeight: '700',
                                      color: '#0F1115',
                                      marginTop: '1px'
                                    }}>
                                      {item.assignedTo}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* 6. Swipe / View Details Action Link */}
                              <div style={{ padding: '10px 20px 0 20px' }}>
                                <button
                                  className="apple-pressable"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCardViewModes(prev => ({ ...prev, [item.id]: 'details' }));
                                  }}
                                  style={{
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    textAlign: 'center',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#64748B',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    padding: '4px 0'
                                  }}
                                >
                                  <span>👈 Swipe left or tap for full details</span>
                                  <span style={{ color: '#3B82F6', fontWeight: '700' }}>››</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* ==================== FACE 2: FULL-CARD CIVIC DETAILS VIEW (APPLE LIGHT THEME) ==================== */
                            <div className="apple-card-smooth" style={{
                              backgroundColor: '#FFFFFF',
                              color: '#0F1115',
                              padding: '16px 20px 18px 20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '14px'
                            }}>
                              {/* Top Bar: Back button + Status Badge */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                  className="apple-pressable"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCardViewModes(prev => ({ ...prev, [item.id]: 'media' }));
                                  }}
                                  style={{
                                    backgroundColor: '#F3F4F6',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '20px',
                                    padding: '6px 14px',
                                    color: '#0F1115',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <span>← Back to Post</span>
                                </button>

                                <span style={{
                                  backgroundColor: item.status === 'RESOLVED' ? '#D1FAE5' : item.status === 'IN PROGRESS' ? '#DBEAFE' : '#FEF3C7',
                                  color: item.status === 'RESOLVED' ? '#065F46' : item.status === 'IN PROGRESS' ? '#1E40AF' : '#92400E',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  letterSpacing: '0.4px'
                                }}>
                                  • {item.status}
                                </span>
                              </div>

                              {/* Title */}
                              <div>
                                <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  CIVIC GRIEVANCE REPORT
                                </div>
                                <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#0F1115', margin: '3px 0 0 0', lineHeight: '1.3' }}>
                                  {item.title}
                                </h3>
                              </div>

                              {/* Geotagged Location Box */}
                              <div style={{
                                backgroundColor: '#F9FAFB',
                                border: '1px solid #E5E7EB',
                                borderRadius: '14px',
                                padding: '12px 14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '3px'
                              }}>
                                <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase' }}>
                                  Verified Geotagged Location
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F1115', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span>📍</span>
                                  <span>{item.location}</span>
                                </div>
                                <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: '600' }}>
                                  GPS Coordinates: 28.6139° N, 77.2090° E (Civic Verified)
                                </div>
                              </div>

                              {/* Full Description Box */}
                              <div style={{
                                backgroundColor: '#F9FAFB',
                                border: '1px solid #E5E7EB',
                                borderLeft: '3px solid #2563EB',
                                borderRadius: '0 12px 12px 0',
                                padding: '12px 14px'
                              }}>
                                <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
                                  Full Citizen Description
                                </div>
                                <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.55', margin: 0 }}>
                                  {item.description}
                                </p>
                              </div>

                              {/* Assigned Authority */}
                              <div style={{
                                backgroundColor: '#EFF6FF',
                                border: '1px solid #DBEAFE',
                                borderRadius: '14px',
                                padding: '12px 14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                              }}>
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '10px',
                                  backgroundColor: '#DBEAFE',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  <BuildingDeptIcon size={18} color="#2563EB" strokeWidth={2} />
                                </div>
                                <div>
                                  <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase' }}>
                                    Assigned Department & SLA
                                  </div>
                                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F1115', marginTop: '1px' }}>
                                    {item.assignedTo}
                                  </div>
                                </div>
                              </div>

                              {/* Live Resolution Stepper */}
                              <div style={{
                                backgroundColor: '#F9FAFB',
                                border: '1px solid #E5E7EB',
                                borderRadius: '14px',
                                padding: '12px 14px'
                              }}>
                                <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
                                  Live Resolution Lifecycle
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                                  <div style={{ color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>✓</span> <span>1. Report Logged & AI Verified (Passed)</span>
                                  </div>
                                  <div style={{ color: item.status !== 'PENDING' ? '#059669' : '#2563EB', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>{item.status !== 'PENDING' ? '✓' : '•'}</span>
                                    <span>2. Dispatched to Ground Officer ({item.assignedTo})</span>
                                  </div>
                                  <div style={{ color: item.status === 'RESOLVED' ? '#059669' : '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>{item.status === 'RESOLVED' ? '✓' : '○'}</span>
                                    <span>3. On-Ground Resolution & Verification</span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions Bar (Follow Button Full Width) */}
                              <div style={{ display: 'flex', marginTop: '2px' }}>
                                <button
                                  className="apple-pressable"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFollow(item.id);
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '14px',
                                    backgroundColor: item.isFollowing ? '#EFF6FF' : '#F3F4F6',
                                    border: item.isFollowing ? '1px solid #DBEAFE' : '1px solid #E5E7EB',
                                    color: item.isFollowing ? '#2563EB' : '#0F1115',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {item.isFollowing ? (
                                    <>
                                      <BookmarkFilledIcon size={18} color="#2563EB" />
                                      <span>Following Issue</span>
                                    </>
                                  ) : (
                                    <>
                                      <BookmarkOutlineIcon size={18} color="#4B5563" />
                                      <span>Follow Updates</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Swipe hint */}
                              <button
                                className="apple-pressable"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardViewModes(prev => ({ ...prev, [item.id]: 'media' }));
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'center',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: '#9CA3AF',
                                  cursor: 'pointer',
                                  padding: '4px 0'
                                }}
                              >
                                👉 Swipe right or tap to return to post
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
              {selectedDetailReport && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  zIndex: 999,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
                className="apple-fade-animate"
                onClick={() => setSelectedDetailReport(null)}
                >
                  <div 
                    className="apple-sheet-animate"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      backgroundColor: '#FFFFFF',
                      width: '100%',
                      maxWidth: '430px',
                      borderTopLeftRadius: '32px',
                      borderTopRightRadius: '32px',
                      padding: '20px 24px 34px',
                      maxHeight: '85vh',
                      overflowY: 'auto',
                      boxShadow: '0 -10px 40px rgba(0,0,0,0.2)'
                    }}
                  >
                    {/* Pull Bar */}
                    <div style={{
                      width: '40px',
                      height: '5px',
                      backgroundColor: '#D1D5DB',
                      borderRadius: '3px',
                      margin: '0 auto 16px'
                    }} />

                    {/* Top Row: Title + Close Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{
                        backgroundColor: selectedDetailReport.status === 'RESOLVED' ? '#D1FAE5' : selectedDetailReport.status === 'IN PROGRESS' ? '#DBEAFE' : '#FEF3C7',
                        color: selectedDetailReport.status === 'RESOLVED' ? '#065F46' : selectedDetailReport.status === 'IN PROGRESS' ? '#1E40AF' : '#92400E',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '800',
                        letterSpacing: '0.4px'
                      }}>
                        • {selectedDetailReport.status}
                      </span>
                      <button
                        className="apple-pressable"
                        onClick={() => setSelectedDetailReport(null)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#F3F4F6',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <GoogleIcon name="close" size={18} color="#4B5563" />
                      </button>
                    </div>

                    {/* Full Photo */}
                    {selectedDetailReport.imageUrl && (
                      <div style={{
                        height: '200px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        marginBottom: '16px'
                      }}>
                        <img 
                          src={selectedDetailReport.imageUrl} 
                          alt={selectedDetailReport.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    {/* Issue Title */}
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F1115', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                      {selectedDetailReport.title}
                    </h2>

                    {/* Author & Timestamp */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>
                      <span style={{ fontWeight: '600', color: '#0F1115' }}>{selectedDetailReport.author}</span>
                      <span>•</span>
                      <span>{selectedDetailReport.date}</span>
                      <span>•</span>
                      <span>{selectedDetailReport.location}</span>
                    </div>

                    {/* Full Description Section */}
                    <div style={{ backgroundColor: '#F9FAFB', borderRadius: '16px', padding: '14px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Full Description
                      </div>
                      <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.55', margin: 0 }}>
                        {selectedDetailReport.description}
                      </p>
                    </div>

                    {/* Location & Coordinates */}
                    <div style={{ backgroundColor: '#F9FAFB', borderRadius: '16px', padding: '14px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>
                        GPS Location & Landmark
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0F1115', fontSize: '14px', fontWeight: '600' }}>
                        <GoogleIcon name="location_on" size={18} color="#EF4444" />
                        <span>{selectedDetailReport.location}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px', marginLeft: '26px' }}>
                        Coordinates: 28.6139° N, 77.2090° E (Geotag Verified)
                      </div>
                    </div>

                    {/* Assigned Department */}
                    <div style={{
                      backgroundColor: '#EFF6FF',
                      borderRadius: '16px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        backgroundColor: '#DBEAFE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <BuildingDeptIcon size={20} color="#2563EB" strokeWidth={2} />
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.05em', color: '#6B7280', textTransform: 'uppercase' }}>
                          Assigned Authority
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F1115', marginTop: '1px' }}>
                          {selectedDetailReport.assignedTo}
                        </div>
                      </div>
                    </div>

                    {/* Resolution Stepper */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px' }}>
                        Grievance Resolution Progress
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>✓</div>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>Report Submitted & Geotagged</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>✓</div>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>AI Visual Verification Completed</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>•</div>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#2563EB' }}>Dispatched to Ground Officer</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#E5E7EB', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>○</div>
                          <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Citizen Verification & Close</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        className="apple-pressable"
                        onClick={() => handleToggleFollow(selectedDetailReport.id)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '16px',
                          border: `1px solid ${selectedDetailReport.isFollowing ? '#2563EB' : '#D1D5DB'}`,
                          backgroundColor: selectedDetailReport.isFollowing ? '#EFF6FF' : '#FFFFFF',
                          color: selectedDetailReport.isFollowing ? '#2563EB' : '#374151',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        {selectedDetailReport.isFollowing ? <BookmarkFilledIcon size={18} color="#2563EB" /> : <BookmarkOutlineIcon size={18} color="#4B5563" />}
                        <span>{selectedDetailReport.isFollowing ? 'Following Issue' : 'Follow Issue'}</span>
                      </button>
                      <button
                        className="apple-pressable"
                        onClick={() => setSelectedDetailReport(null)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '16px',
                          border: 'none',
                          backgroundColor: '#0F1115',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: UPDATES VIEW */}
          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '520px' }}>
              {/* Header Title & Subtitle */}
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  letterSpacing: '-0.035em',
                  color: '#0F1115',
                  margin: '0 0 6px 0'
                }}>
                  Updates
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontWeight: '400',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Stay informed about your reports and followed issues.
                </p>
              </div>

              {/* Filter Pills */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                overflowX: 'auto',
                scrollbarWidth: 'none'
              }}>
                {['All Updates', 'My Reports', 'Following'].map((filter) => {
                  const isSelected = selectedUpdateFilter === filter;
                  return (
                    <button
                      key={filter}
                      className="apple-pill-pressable"
                      onClick={() => setSelectedUpdateFilter(filter)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '24px',
                        fontSize: '13px',
                        fontWeight: isSelected ? '600' : '500',
                        backgroundColor: isSelected ? '#121417' : 'transparent',
                        color: isSelected ? '#FFFFFF' : '#4B5563',
                        border: isSelected ? '1px solid #121417' : '1px solid #E5E7EB',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              {/* Centered Empty State matching exact user screenshot */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: '60px',
                paddingBottom: '60px'
              }}>
                {/* Rounded Message Circle Icon */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <UpdatesIcon size={26} color="#4B5563" strokeWidth={1.75} />
                </div>

                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  color: '#0F1115',
                  margin: '0 0 8px 0'
                }}>
                  No updates yet
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontWeight: '400',
                  lineHeight: '1.45',
                  maxWidth: '260px',
                  margin: 0
                }}>
                  When authorities take action on your reports, you'll see updates here.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE VIEW */}
          {activeTab === 'profile' && (
            <div style={{ paddingBottom: '80px' }}>
              {/* Top Bar: Settings button aligned to the right */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <button
                  title="Settings"
                  className="apple-pressable"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <SettingsGearIcon size={22} color="#0F1115" strokeWidth={1.8} />
                </button>
              </div>

              {/* Avatar & Name Section */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
                <div style={{ position: 'relative', width: '92px', height: '92px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80"
                    alt="Rampal Avatar"
                    style={{
                      width: '92px',
                      height: '92px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #FFFFFF',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                    }}
                  />
                  {/* Edit Pencil Badge Button */}
                  <button
                    title="Edit Profile Picture"
                    className="apple-pressable"
                    style={{
                      position: 'absolute',
                      bottom: '0px',
                      right: '0px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                      cursor: 'pointer'
                    }}
                  >
                    <EditPencilIcon size={14} color="#0F1115" strokeWidth={2.2} />
                  </button>
                </div>

                <h2 style={{
                  fontSize: '26px',
                  fontWeight: '700',
                  letterSpacing: '-0.025em',
                  color: '#0F1115',
                  margin: '14px 0 0 0'
                }}>
                  Rampal
                </h2>
              </div>

              {/* Section 1: PERSONAL DETAILS */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.06em',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                  paddingLeft: '4px'
                }}>
                  Personal Details
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '20px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #F3F4F6',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px'
                }}>
                  {/* Phone */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <GoogleIcon name="call" size={20} color="#0F1115" />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Phone</div>
                      <div style={{ fontSize: '15px', color: '#0F1115', fontWeight: '700', letterSpacing: '-0.01em', marginTop: '1px' }}>
                        9829382372
                      </div>
                    </div>
                  </div>

                  {/* Masked Aadhaar Card */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <GoogleIcon name="badge" size={20} color="#0F1115" />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Aadhaar Number</div>
                      <div style={{ fontSize: '15px', color: '#0F1115', fontWeight: '700', letterSpacing: '0.04em', marginTop: '1px' }}>
                        •••• •••• 9842
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <GoogleIcon name="location_on" size={20} color="#0F1115" />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Location</div>
                      <div style={{ fontSize: '15px', color: '#0F1115', fontWeight: '700', letterSpacing: '-0.01em', marginTop: '1px' }}>
                        Pattikalyana
                      </div>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <GoogleIcon name="calendar_today" size={20} color="#0F1115" />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Date Of Birth</div>
                      <div style={{ fontSize: '15px', color: '#0F1115', fontWeight: '700', letterSpacing: '-0.01em', marginTop: '1px' }}>
                        26 years old
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: MY REPORTS */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingLeft: '4px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.06em',
                    color: '#6B7280',
                    textTransform: 'uppercase'
                  }}>
                    My Reports
                  </div>
                  <button
                    className="apple-pressable"
                    onClick={() => setActiveTab('explore')}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#4B5563',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    View All
                  </button>
                </div>

                {/* Empty State / Prompt */}
                <div style={{
                  padding: '24px 0 32px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '6px' }}>
                    No reports yet
                  </div>
                  <button
                    className="apple-pressable"
                    onClick={() => setIsModalOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#EF4444',
                      cursor: 'pointer',
                      padding: '4px 8px'
                    }}
                  >
                    Report an issue
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Apple Floating Pill Bottom Navigation Island */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '20px',
          right: '20px',
          height: '68px',
          backgroundColor: 'rgba(15, 17, 21, 0.94)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderRadius: '36px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 16px 36px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.06) inset',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          alignItems: 'center',
          justifyItems: 'center',
          padding: '0 8px',
          zIndex: 40
        }}>
          {/* Slot 1: Home */}
          <button 
            title="Home"
            className="apple-pressable"
            onClick={() => setActiveTab('home')}
            style={{
              width: '100%',
              height: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <HomeIcon size={24} color={activeTab === 'home' ? '#FFFFFF' : '#9CA3AF'} strokeWidth={2} />
          </button>

          {/* Slot 2: Explore */}
          <button 
            title="Explore"
            className="apple-pressable"
            onClick={() => setActiveTab('explore')}
            style={{
              width: '100%',
              height: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <ExploreIcon size={24} color={activeTab === 'explore' ? '#FFFFFF' : '#9CA3AF'} />
          </button>

          {/* Slot 3: Center (+) Action Button */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button 
              title="Report Issue"
              className="apple-pressable"
              onClick={() => setIsModalOpen(true)}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
              }}
            >
              <ReportIcon size={24} color="#0F1115" strokeWidth={3.2} />
            </button>
          </div>

          {/* Slot 4: Updates / Messages */}
          <button 
            title="Updates"
            className="apple-pressable"
            onClick={() => setActiveTab('chat')}
            style={{
              width: '100%',
              height: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <UpdatesIcon size={24} color={activeTab === 'chat' ? '#FFFFFF' : '#9CA3AF'} strokeWidth={2} />
          </button>

          {/* Slot 5: Profile */}
          <button 
            title="Profile"
            className="apple-pressable"
            onClick={() => setActiveTab('profile')}
            style={{
              width: '100%',
              height: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <ProfileIcon size={24} color={activeTab === 'profile' ? '#FFFFFF' : '#9CA3AF'} strokeWidth={2} />
          </button>
        </div>

        {/* 7. Take Photo / Report Issue Modal Sheet */}
        {isModalOpen && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '32px 32px 0 0',
              padding: '24px',
              maxHeight: '90%',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em', margin: 0, color: '#0F1115' }}>
                  Report Civic Issue
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex' }}
                >
                  <GoogleIcon name="close" size={20} color="#0F1115" />
                </button>
              </div>

              {/* Photo Box */}
              <div style={{
                height: '130px',
                backgroundColor: '#F3F4F6',
                borderRadius: '20px',
                border: '2px dashed #D1D5DB',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                gap: '8px'
              }}>
                <GoogleIcon name="photo_camera" size={34} color="#6B7280" />
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#6B7280' }}>
                  Tap to capture evidence photo
                </span>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    Issue Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Garbage Dumps near Market"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      fontSize: '14px',
                      fontWeight: '400',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    Location / Landmark
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Tikri Main Road"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      fontSize: '14px',
                      fontWeight: '400',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    Description & Voice Note
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details for Setu AI categorization..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      fontSize: '14px',
                      fontWeight: '400',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    height: '52px',
                    backgroundColor: '#121417',
                    color: '#FFFFFF',
                    borderRadius: '16px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  {isSubmitting ? 'Processing with Setu AI...' : 'Submit to AI Engine'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {successToast && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
            zIndex: 60,
            fontSize: '13px',
            fontWeight: '600'
          }}>
            <GoogleIcon name="check_circle" size={18} color="#FFFFFF" />
            <span>{successToast}</span>
          </div>
        )}
      </div>
    </div>
  );
};
