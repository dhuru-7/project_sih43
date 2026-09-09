import React from 'react';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';

export const IssueDetailModal = ({ issue, isOpen, onClose, onUpvote, isUpvoted }) => {
  if (!isOpen || !issue) return null;

  const statusColors = {
    pending: { bg: '#f3f3f3', text: '#1a1c1c', border: '#cfc4c5', label: 'Pending' },
    reviewed: { bg: '#e8e8e8', text: '#1a1c1c', border: '#cfc4c5', label: 'Reviewed' },
    resolved: { bg: '#000000', text: '#ffffff', border: '#000000', label: 'Resolved' }
  };

  const currentStatus = statusColors[issue.status] || statusColors.pending;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="apple-modal-content"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.25rem 0.65rem',
                borderRadius: '0.375rem',
                backgroundColor: currentStatus.bg,
                color: currentStatus.text
              }}
            >
              {currentStatus.label}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#5e5e5e' }}>
              {issue.id}
            </span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#cfc4c5' }}></span>
            <span style={{ fontSize: '0.8125rem', color: '#7e7576' }}>{issue.time}</span>
          </div>
          <button
            onClick={onClose}
            className="apple-tap"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f3f3f3',
              color: '#5e5e5e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <GoogleIcon name="close" size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Issue Title & Image */}
          <div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: '700', color: '#1a1c1c', lineHeight: 1.3, letterSpacing: '-0.015em' }}>
              {issue.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', color: '#5e5e5e', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <GoogleIcon name="location_on" size={16} color="#7e7576" />
                {issue.location}
              </span>
              {issue.author && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <GoogleIcon name={issue.reporterType && issue.reporterType !== 'Individual Citizen' ? 'groups' : 'person'} size={16} color="#7e7576" />
                  {issue.groupName ? `${issue.author} • ${issue.groupName}` : issue.author}
                </span>
              )}
            </div>
          </div>

          {/* Photo Evidence */}
          {issue.image && (
            <div
              style={{
                width: '100%',
                height: '240px',
                borderRadius: '0.875rem',
                overflow: 'hidden',
                backgroundColor: '#f3f3f3'
              }}
            >
              <img
                src={issue.image}
                alt={issue.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Description */}
          <div style={{ backgroundColor: '#f9f9f9', padding: '1rem 1.25rem', borderRadius: '0.875rem', border: '1px solid rgba(0, 0, 0, 0.04)' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1a1c1c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Citizen Evidence & Details
            </h4>
            <p style={{ fontSize: '0.9375rem', color: '#4c4546', lineHeight: 1.5 }}>
              {issue.description || 'Verified grassroots community report submitted through Setu portal with geolocation coordinates and photographic evidence.'}
            </p>
          </div>

          {/* Department / Academic Assignment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', backgroundColor: '#f3f3f3', borderRadius: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GoogleIcon name="engineering" size={20} color="#ffffff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#5e5e5e', fontWeight: '600' }}>Assigned Resolution Authority</div>
              <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1a1c1c' }}>
                {issue.assignee || 'Assigned Research Team / Nodal Desk'}
              </div>
            </div>
          </div>

          {/* Lifecycle Progress Timeline */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1a1c1c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              Lifecycle Status Tracker
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '2px solid #e8e8e8' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '6px', marginLeft: '-5px' }}></div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1a1c1c' }}>1. Problem Reported by Citizen</div>
                  <div style={{ fontSize: '0.75rem', color: '#7e7576' }}>GPS tag captured · Photos validated</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '6px', marginLeft: '-5px' }}></div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1a1c1c' }}>2. AI Triage & Deduplication Passed</div>
                  <div style={{ fontSize: '0.75rem', color: '#7e7576' }}>TARA AI classified domain · Urgency score verified</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: issue.status === 'pending' ? '#cfc4c5' : '#000000', marginTop: '6px', marginLeft: '-5px' }}></div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: issue.status === 'pending' ? '#7e7576' : '#1a1c1c' }}>
                    3. Action & Assignment
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#7e7576' }}>
                    {issue.status === 'pending' ? 'Awaiting nodal evaluation & research allocation' : 'Assigned to technical team for solution prototype'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Upvote & Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            backgroundColor: '#f9f9f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <button
            onClick={() => onUpvote(issue.id)}
            className="apple-metric-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              borderRadius: '0.625rem',
              backgroundColor: isUpvoted ? '#000000' : '#eeeeee',
              color: isUpvoted ? '#ffffff' : '#1a1c1c',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            <span className="apple-icon-push">
              <GoogleIcon name="thumb_up" size={18} fill={isUpvoted} />
            </span>
            <span>{isUpvoted ? 'Endorsed' : 'Upvote Challenge'}</span>
            <span style={{ fontWeight: '700', marginLeft: '0.25rem' }}>{issue.upvotes}</span>
          </button>
          <button
            onClick={onClose}
            className="apple-tap"
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.625rem',
              backgroundColor: '#1a1c1c',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
