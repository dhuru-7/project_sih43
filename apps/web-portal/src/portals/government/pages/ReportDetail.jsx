import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getReportById } from '../data/reportsData';
import '../styles/governmentDashboard.css';

export const GovernmentReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const report = getReportById(id);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [status, setStatus] = useState(report?.status || 'Requires Triage');
  const [toastMessage, setToastMessage] = useState(null);
  const [assignedLab, setAssignedLab] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!report) {
    return (
      <div className="gov-main-inner" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Report Not Found</h2>
        <p style={{ color: '#6b7280', margin: '1rem 0' }}>The requested grievance ID could not be loaded.</p>
        <button
          type="button"
          onClick={() => navigate('/government/inbox')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#111827',
            color: '#ffffff',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Back to Issue Inbox
        </button>
      </div>
    );
  }

  const handleAssignLab = (lab) => {
    setAssignedLab(lab.labName);
    setStatus(`Assigned to ${lab.university}`);
    triggerToast(`✓ Successfully assigned to ${lab.university} (${lab.labName}). Escrow grant initiated.`);
  };

  const handleDispatch = () => {
    setStatus('Field Team Dispatched');
    triggerToast(`✓ Emergency Quick Response Team dispatched to ${report.ward}`);
  };

  const handleEscalate = () => {
    setStatus('Escalated to District Magistrate');
    triggerToast(`✓ Escalated ticket ${report.id} to Ranchi DC / Ward Admin (+24h SLA)`);
  };

  const handleResolve = () => {
    setStatus('Resolved');
    triggerToast(`✓ Marked ticket ${report.id} as Resolved. Notification dispatched to citizens.`);
  };

  return (
    <div className="gov-main-inner" data-purpose="report-detail-page">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="gov-toast">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs & Top Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/government/inbox')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#4b5563',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '8px',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Issue Inbox</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#111827',
              color: '#ffffff'
            }}
          >
            {report.id}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor:
                status.includes('Resolved')
                  ? '#ecfdf5'
                  : status.includes('Dispatched')
                  ? '#eff6ff'
                  : '#fef3c7',
              color:
                status.includes('Resolved')
                  ? '#065f46'
                  : status.includes('Dispatched')
                  ? '#1e40af'
                  : '#92400e',
              border: '1px solid currentColor'
            }}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Main Header Title & Key Badges */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          padding: '1.75rem 2rem',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          marginBottom: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                {report.category}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor:
                    report.urgency === 'CRITICAL'
                      ? '#fee2e2'
                      : report.urgency === 'HIGH'
                      ? '#ffedd5'
                      : '#dbeafe',
                  color:
                    report.urgency === 'CRITICAL'
                      ? '#991b1b'
                      : report.urgency === 'HIGH'
                      ? '#9a3412'
                      : '#1e40af',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                {report.urgency} URGENCY
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: '#ecfdf5',
                  color: '#065f46',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span className="material-symbols-outlined text-[13px]">group</span>
                Reported by {report.citizenCount} verified citizens
              </span>
            </div>

            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.025em',
                lineHeight: 1.3,
                margin: '0 0 10px 0'
              }}
            >
              {report.title}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', fontSize: '0.8125rem', color: '#4b5563' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-outlined text-[16px] text-neutral-400">location_on</span>
                <strong>{report.ward}</strong>
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-outlined text-[16px] text-neutral-400">schedule</span>
                {report.reportedAt}
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#047857', fontWeight: 600 }}>
                <span className="material-symbols-outlined text-[16px]">verified</span>
                GPS & Geofence Verified
              </span>
            </div>
          </div>

          {/* Administrative Actions Quick Strip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
            <button
              type="button"
              onClick={handleDispatch}
              style={{
                padding: '10px 16px',
                backgroundColor: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              Dispatch Taskforce
            </button>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={handleEscalate}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                  borderRadius: '0.625rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Escalate (+24h)
              </button>
              <button
                type="button"
                onClick={handleResolve}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: '#ecfdf5',
                  color: '#065f46',
                  border: '1px solid #a7f3d0',
                  borderRadius: '0.625rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left (Media & Insights) + Right (Citizen Profile Tag & Lab Recommendations) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* =========================================================================
            LEFT COLUMN (7 Columns): MEDIA GALLERY & DETAILED INSIGHTS
            ========================================================================= */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* SECTION: CITIZEN EVIDENCE MEDIA */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              padding: '1.5rem',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined text-[20px] text-neutral-800">photo_library</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Citizen Photo & Video Evidence
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>
                {report.media.length} Uploaded Files
              </span>
            </div>

            {/* Featured Big Media View */}
            <div
              style={{
                width: '100%',
                height: '360px',
                borderRadius: '1rem',
                overflow: 'hidden',
                backgroundColor: '#111827',
                position: 'relative',
                marginBottom: '1rem',
                border: '1px solid #e5e7eb'
              }}
            >
              <img
                src={report.media[activeMediaIndex]?.url || report.media[0].url}
                alt="Main evidence view"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1rem 1.25rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                  color: '#ffffff'
                }}
              >
                <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600 }}>
                  {report.media[activeMediaIndex]?.caption || report.desc}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#d1d5db' }}>
                  GPS: {report.gps.lat}° N, {report.gps.lng}° E · {report.gps.locationName}
                </p>
              </div>
            </div>

            {/* Thumbnails Filmstrip */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {report.media.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMediaIndex(idx)}
                  style={{
                    width: '90px',
                    height: '65px',
                    borderRadius: '0.625rem',
                    overflow: 'hidden',
                    border: activeMediaIndex === idx ? '2.5px solid #111827' : '1px solid #e5e7eb',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0,
                    opacity: activeMediaIndex === idx ? 1 : 0.75,
                    transition: 'opacity 0.15s ease, border-color 0.15s ease'
                  }}
                >
                  <img
                    src={item.url}
                    alt={`Thumb ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* SECTION: TARA MULTIMODAL INSIGHTS & AUDIO TRANSCRIPT */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              padding: '1.5rem',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined text-[22px] text-indigo-600">psychology</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  TARA AI Multimodal Triage Insights
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Priority Index:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#047857' }}>
                  {report.insights.taraScore} / 5.0
                </span>
              </div>
            </div>

            {/* Description & Impact Summary */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Field Diagnostic Summary
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
                {report.desc}
              </p>
            </div>

            {/* Health & Population Impact */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.875rem',
                border: '1px solid #e5e7eb',
                marginBottom: '1.25rem'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                  Critical Health / Infrastructure Risk
                </span>
                <p style={{ fontSize: '0.8125rem', color: '#1f2937', fontWeight: 600, margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  {report.insights.healthHazard}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>
                  Estimated Affected Population
                </span>
                <p style={{ fontSize: '0.8125rem', color: '#1f2937', fontWeight: 600, margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  {report.insights.affectedPopulation}
                </p>
              </div>
            </div>

            {/* Saaras V3 Voice Note & Speech-to-Text Transcript */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: '#fffbeb',
                borderRadius: '0.875rem',
                border: '1px solid #fef3c7',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined text-[18px] text-amber-700">mic</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                    Citizen Voice Audio Transcript ({report.insights.languageModel})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlayingAudio(!isPlayingAudio);
                    triggerToast(isPlayingAudio ? 'Paused voice note' : 'Playing simulated citizen audio recording...');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    backgroundColor: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isPlayingAudio ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isPlayingAudio ? 'Pause Voice' : 'Play Voice Note'}</span>
                </button>
              </div>

              {/* Spoken Original */}
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#b45309' }}>Original Spoken Voice:</span>
                <p style={{ fontSize: '0.8125rem', color: '#1f2937', fontStyle: 'italic', margin: '2px 0 0 0', lineHeight: 1.5 }}>
                  "{report.insights.transcriptOriginal}"
                </p>
              </div>

              {/* English Translation */}
              <div style={{ borderTop: '1px solid #fde68a', paddingTop: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#b45309' }}>Verified English Translation:</span>
                <p style={{ fontSize: '0.8125rem', color: '#4b5563', margin: '2px 0 0 0', lineHeight: 1.5 }}>
                  "{report.insights.transcriptEnglish}"
                </p>
              </div>
            </div>

            {/* Clustering & Cost Estimate */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
              <span>{report.insights.clusteringNote}</span>
              <span style={{ fontWeight: 700, color: '#111827' }}>
                Est. Escrow Budget: {report.insights.costEstimate}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (5 Columns): PROFILE TAG OF UPLOADER & SUGGESTED UNI LABS
            ========================================================================= */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* SECTION: PROFILE TAG OF THE USER WHO UPLOADED THAT */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              padding: '1.5rem',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <span className="material-symbols-outlined text-[20px] text-neutral-800">account_circle</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                Citizen Uploader Profile Tag
              </h3>
            </div>

            {/* Citizen Identity Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                marginBottom: '1.25rem'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: report.userProfile.avatarBg,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  flexShrink: 0
                }}
              >
                {report.userProfile.avatarText}
              </div>

              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    {report.userProfile.name}
                  </h4>
                  <span className="material-symbols-outlined text-[16px] text-emerald-600" title="Aadhaar Verified">
                    verified
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: '2px 0 0 0', fontWeight: 500 }}>
                  {report.userProfile.roleTag}
                </p>
                <p style={{ fontSize: '0.6875rem', color: '#047857', margin: '2px 0 0 0', fontWeight: 700 }}>
                  {report.userProfile.aadhaarStatus} ({report.userProfile.aadhaarMasked})
                </p>
              </div>
            </div>

            {/* Civic Karma & Reputation Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                  {report.userProfile.trustScore}%
                </span>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0', fontWeight: 600 }}>Civic Trust Score</p>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                  {report.userProfile.submissionsCount}
                </span>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0', fontWeight: 600 }}>Verified Reports</p>
              </div>
            </div>

            {/* Citizen Direct Contact Options */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => triggerToast(`Initiating secure TARA voice call to ${report.userProfile.name}...`)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#374151',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                Audio Call
              </button>
              <button
                type="button"
                onClick={() => triggerToast(`Sent status SMS confirmation to ${report.userProfile.name}`)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#374151',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span className="material-symbols-outlined text-[16px]">sms</span>
                SMS Notify
              </button>
            </div>
          </div>

          {/* SECTION: SUGGESTED UNIVERSITIES & UNIVERSITY LABS */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              padding: '1.5rem',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined text-[20px] text-amber-600">school</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Suggested University Labs
                </h3>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                Jharkhand Innovation Grid · Matched by equipment & proximity
              </p>
            </div>

            {/* University Labs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {report.suggestedUniLabs.map((lab) => {
                const isThisAssigned = assignedLab === lab.labName;
                return (
                  <div
                    key={lab.id}
                    style={{
                      padding: '1.125rem',
                      borderRadius: '1rem',
                      border: isThisAssigned ? '2px solid #059669' : '1px solid #e5e7eb',
                      backgroundColor: isThisAssigned ? '#ecfdf5' : '#fafafa',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Uni Header & Match Score */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                      <div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            color: '#1e40af',
                            backgroundColor: '#dbeafe',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            display: 'inline-block',
                            marginBottom: '4px'
                          }}
                        >
                          {lab.university}
                        </span>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                          {lab.labName}
                        </h4>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          border: '1px solid #a7f3d0',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {lab.matchScore}% Match
                      </span>
                    </div>

                    {/* SPOC and Distance */}
                    <div style={{ fontSize: '0.75rem', color: '#4b5563', marginBottom: '8px' }}>
                      <p style={{ margin: '2px 0' }}>
                        <strong>SPOC:</strong> {lab.headName} ({lab.headRole})
                      </p>
                      <p style={{ margin: '2px 0', color: '#6b7280' }}>
                        📍 {lab.location} · SLA: {lab.turnaround}
                      </p>
                    </div>

                    {/* Capabilities Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                      {lab.capabilities.map((cap, cIdx) => (
                        <span
                          key={cIdx}
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '2px 6px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                            color: '#374151'
                          }}
                        >
                          {cap}
                        </span>
                      ))}
                    </div>

                    {/* Escrow Grant & Action Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>
                        Grant: {lab.grantBudget}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAssignLab(lab)}
                        style={{
                          padding: '6px 14px',
                          backgroundColor: isThisAssigned ? '#059669' : '#111827',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isThisAssigned ? (
                          <>
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            Assigned
                          </>
                        ) : (
                          'Assign Lab & Escrow'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
