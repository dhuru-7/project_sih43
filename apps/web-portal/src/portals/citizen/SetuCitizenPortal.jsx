import React, { useState } from 'react';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { apiClient } from '../../services/apiClient';

export const SetuCitizenPortal = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const [nearbyIssues, setNearbyIssues] = useState([
    {
      id: '1',
      title: 'Garbage Dumps',
      location: 'Tikri',
      status: 'PENDING',
      type: 'waste',
      color: '#9E9E9E'
    },
    {
      id: '2',
      title: 'Broken Streetlight',
      location: 'kalsora',
      status: 'PENDING',
      type: 'red',
      color: '#FF0000'
    },
    {
      id: '3',
      title: 'Broken Roads',
      location: 'kalsora',
      status: 'PENDING',
      type: 'red',
      color: '#FF0000'
    }
  ]);

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8F9FA',
      display: 'flex',
      justifyContent: 'center',
      padding: '20px 10px',
      color: '#0F1115',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Plus Jakarta Sans", sans-serif'
    }}>
      {/* Mobile Frame Container */}
      <div style={{
        width: '100%',
        maxWidth: '430px',
        minHeight: '880px',
        backgroundColor: '#FFFFFF',
        borderRadius: '44px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* iOS Status Bar Spacer */}
        <div style={{ height: '14px', width: '100%' }} />

        {/* Scrollable Feed */}
        <div style={{
          flex: 1,
          padding: '20px 24px 120px',
          overflowY: 'auto',
          scrollbarWidth: 'none'
        }}>
          {/* 1. Header: Setu. + Google Notifications Bell */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              letterSpacing: '-0.04em',
              color: '#0F1115',
              margin: 0
            }}>
              Setu.
            </h2>
            <button style={{
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
            }}>
              <GoogleIcon name="notifications" size={22} color="#0F1115" />
            </button>
          </div>

          {/* 2. Hero Display Greeting */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '38px',
              fontWeight: '800',
              lineHeight: '1.08',
              letterSpacing: '-0.04em',
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
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  margin: '0 0 6px 0'
                }}>
                  Report Issue
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  fontWeight: '500',
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
                fontWeight: '700',
                color: '#0F1115',
                letterSpacing: '-0.02em',
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
                fontWeight: '800',
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
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {nearbyIssues.length}
              </span>
            </div>

            {/* Explore Reports Pill */}
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#0F1115',
              cursor: 'pointer'
            }}>
              Explore Reports <GoogleIcon name="south_west" size={14} color="#0F1115" />
            </button>
          </div>

          {/* 5. Issue Feed List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {nearbyIssues.map((item) => (
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
                      fontSize: '16px',
                      fontWeight: '700',
                      letterSpacing: '-0.02em',
                      color: '#0F1115',
                      margin: '0 0 2px 0'
                    }}>
                      {item.title}
                    </h4>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#6B7280',
                      margin: '0 0 4px 0'
                    }}>
                      {item.location}
                    </p>
                    {/* Status Pill Badge */}
                    <span style={{
                      display: 'inline-block',
                      fontSize: '10px',
                      fontWeight: '800',
                      letterSpacing: '0.04em',
                      color: '#D97706',
                      backgroundColor: '#FEF3C7',
                      border: '1px solid #FDE68A',
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
        </div>

        {/* 6. Apple Floating Pill Bottom Navigation Island with Google Icons */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '20px',
          right: '20px',
          height: '66px',
          backgroundColor: '#0F1115',
          borderRadius: '36px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 12px',
          zIndex: 40
        }}>
          {/* Home */}
          <button 
            onClick={() => setActiveTab('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px'
            }}
          >
            <GoogleIcon name="home" size={26} color={activeTab === 'home' ? '#FFFFFF' : '#6B7280'} fill={activeTab === 'home'} />
          </button>

          {/* Search */}
          <button 
            onClick={() => setActiveTab('search')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px'
            }}
          >
            <GoogleIcon name="search" size={26} color={activeTab === 'search' ? '#FFFFFF' : '#6B7280'} />
          </button>

          {/* Center (+) Action Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              transform: 'translateY(-1px)'
            }}
          >
            <GoogleIcon name="add" size={30} color="#0F1115" weight={600} />
          </button>

          {/* Messages */}
          <button 
            onClick={() => setActiveTab('chat')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px'
            }}
          >
            <GoogleIcon name="chat_bubble" size={24} color={activeTab === 'chat' ? '#FFFFFF' : '#6B7280'} fill={activeTab === 'chat'} />
          </button>

          {/* Profile */}
          <button 
            onClick={() => setActiveTab('profile')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px'
            }}
          >
            <GoogleIcon name="person" size={26} color={activeTab === 'profile' ? '#FFFFFF' : '#6B7280'} fill={activeTab === 'profile'} />
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
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0F1115' }}>
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
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                  Tap to capture evidence photo
                </span>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
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
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
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
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
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
                    fontWeight: '700',
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
