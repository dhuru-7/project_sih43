import React, { useState, useMemo } from 'react';
import { GoogleIcon } from './GoogleIcon';
import { REPORTER_CATEGORIES, getReporterMeta } from '../../constants/reporterTypes';

export const ReporterPickerSheet = ({
  isOpen,
  onClose,
  selectedReporter,
  onSelectReporter,
  groupName,
  onGroupNameChange,
  isAnonymous,
  onAnonymousChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  if (!isOpen) return null;

  const currentMeta = getReporterMeta(selectedReporter);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return REPORTER_CATEGORIES.map((cat) => {
      if (activeCategory !== 'All' && cat.name !== activeCategory) {
        return { ...cat, items: [] };
      }
      const items = cat.items.filter((item) => {
        if (!q) return true;
        return (
          item.label.toLowerCase().includes(q) ||
          item.hindi.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q)
        );
      });
      return { ...cat, items };
    }).filter((cat) => cat.items.length > 0);
  }, [searchQuery, activeCategory]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: 'appleFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '85vh',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -20px 40px -15px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'appleSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Grabber Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '6px' }}>
          <div style={{ width: '36px', height: '5px', borderRadius: '3px', backgroundColor: '#d1d1d6' }} />
        </div>

        {/* Header */}
        <div
          style={{
            padding: '12px 20px 16px 20px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.1875rem', fontWeight: '800', color: '#000000', margin: 0, letterSpacing: '-0.02em' }}>
              Reported By
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#6e6e73', margin: '2px 0 0 0' }}>
              Select whether you are reporting as an individual or community entity
            </p>
          </div>
          <button
            onClick={onClose}
            className="apple-tap"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f2f2f7',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <GoogleIcon name="close" size={18} color="#1c1c1e" />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '12px 20px 8px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f2f2f7',
              borderRadius: '12px',
              padding: '8px 12px'
            }}
          >
            <GoogleIcon name="search" size={18} color="#8e8e93" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search group (e.g. SHG, RWA, NGO, Youth, Farmer)..."
              style={{
                flex: 1,
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.875rem',
                outline: 'none',
                color: '#000000'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
              >
                <GoogleIcon name="cancel" size={16} color="#8e8e93" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '4px 20px 12px 20px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {['All', ...REPORTER_CATEGORIES.map((c) => c.name)].map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="apple-tap"
                style={{
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: isSelected ? '1.5px solid #0071e3' : '1px solid rgba(0, 0, 0, 0.08)',
                  backgroundColor: isSelected ? '#0071e3' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#3a3a3c',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {cat === 'All' ? 'All Groups' : cat.split('&')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Scrollable Groups List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 20px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {filteredCategories.map((cat) => (
            <div key={cat.name}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#8e8e93',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{cat.name}</span>
                <span style={{ color: '#aeaeb2', fontWeight: '500' }}>· {cat.hindi}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {cat.items.map((item) => {
                  const isSelected = selectedReporter === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectReporter(item.id);
                      }}
                      className="apple-tap"
                      style={{
                        padding: '12px 14px',
                        borderRadius: '16px',
                        backgroundColor: isSelected ? '#eff6ff' : '#f9f9fb',
                        border: isSelected ? '1.5px solid #0071e3' : '1px solid rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            backgroundColor: isSelected ? '#0071e3' : '#ffffff',
                            color: isSelected ? '#ffffff' : '#0071e3',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <GoogleIcon name={item.icon} size={20} color={isSelected ? '#ffffff' : '#0071e3'} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1c1c1e' }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6e6e73', marginTop: '1px' }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: '#0071e3',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <GoogleIcon name="check" size={14} color="#ffffff" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Group / Organization Name Input (if applicable) */}
          {currentMeta?.requiresGroupName && (
            <div
              style={{
                marginTop: '12px',
                padding: '14px',
                borderRadius: '16px',
                backgroundColor: '#f8fafc',
                border: '1.5px solid #cbd5e1'
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '6px'
                }}
              >
                Group / Organization Name
              </label>
              <input
                type="text"
                value={groupName || ''}
                onChange={(e) => onGroupNameChange && onGroupNameChange(e.target.value)}
                placeholder={currentMeta.placeholder || 'e.g. Name of your group or committee'}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '6px 0 0 0' }}>
                This will appear alongside the official grievance record.
              </p>
            </div>
          )}

          {/* Anonymous Option for Citizens */}
          {!currentMeta?.requiresGroupName && onAnonymousChange && (
            <div
              style={{
                marginTop: '8px',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: '#f9f9fb',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1c1c1e' }}>
                  File with Aadhaar Privacy Protection
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8e8e93', marginTop: '1px' }}>
                  Mask personal identity while retaining verified citizen standing
                </div>
              </div>
              <input
                type="checkbox"
                checked={!!isAnonymous}
                onChange={(e) => onAnonymousChange(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0071e3' }}
              />
            </div>
          )}
        </div>

        {/* Footer Done Button */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(0, 0, 0, 0.08)', backgroundColor: '#ffffff' }}>
          <button
            onClick={onClose}
            className="apple-tap"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: '0.9375rem',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <span>Confirm & Continue Writing</span>
            <GoogleIcon name="check" size={18} color="#ffffff" />
          </button>
        </div>
      </div>
    </div>
  );
};
