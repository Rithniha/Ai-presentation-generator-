import React from 'react';

export default function AIValidationCenter({ showToast }) {
  const handleReferenceClick = (name) => {
    showToast(`Navigating to ${name} reference…`);
  };

  return (
    <section>
      <div className="section-head">
        <h2>AI Content Verification & Health</h2>
      </div>
      <div className="split-row">
        {/* Left Column (Quality & Verification) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
          
          {/* Presentation Quality Score Card */}
          <div className="glass feature-card">
            <div className="feature-card-header">
              <h3>Presentation Quality</h3>
              <div className="circular-svg-wrap large">
                <svg width="86" height="86" viewBox="0 0 86 86">
                  <circle cx="43" cy="43" r="38" stroke="var(--border)" strokeWidth="5.5" fill="none" />
                  <circle 
                    cx="43" 
                    cy="43" 
                    r="38" 
                    stroke="url(#gscore-verify)" 
                    strokeWidth="5.5" 
                    fill="none"
                    strokeLinecap="round" 
                    strokeDasharray="238.7" 
                    strokeDashoffset="19.1" 
                  />
                  <defs>
                    <linearGradient id="gscore-verify" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#0891B2" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="pct-text">
                  92<span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500 }}>/100</span>
                </div>
              </div>
            </div>
            
            <div className="quality-bars-container">
              {[
                { label: 'Readability', value: 94 },
                { label: 'Content Flow', value: 90 },
                { label: 'Visual Balance', value: 88 },
                { label: 'Audience Suitability', value: 95 },
                { label: 'Presentation Duration', value: 93 }
              ].map((item, idx) => (
                <div key={idx} className="quality-bar-row">
                  <div className="quality-bar-header">
                    <span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '12px', height: '12px', marginRight: '4px', verticalAlign: 'middle', display: 'inline-block' }}>
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      {item.label}
                    </span>
                    <b>{item.value}%</b>
                  </div>
                  <div className="quality-bar-bg">
                    <div className="quality-bar-fill" style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Content Verification Panel */}
          <div className="glass feature-card">
            <div className="feature-card-header">
              <h3>AI Content Verification</h3>
              <div className="verification-badge-container">
                <span className="verified-text">Verified</span>
                <div className="verified-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="verification-layout">
              <div className="verification-stats">
                <div className="verify-row">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '12px', height: '12px', marginRight: '4px' }}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Verified Sources
                  </span>
                  <b>8</b>
                </div>
                <div className="verify-row">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '12px', height: '12px', marginRight: '4px' }}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Fact Accuracy
                  </span>
                  <b>96%</b>
                </div>
                <div className="verify-row">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '12px', height: '12px', marginRight: '4px' }}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Confidence Score
                  </span>
                  <b>94%</b>
                </div>
              </div>
              <div className="circular-progress-box">
                <div className="circular-svg-wrap">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="30" stroke="var(--border)" strokeWidth="4.5" fill="none" />
                    <circle 
                      cx="36" 
                      cy="36" 
                      r="30" 
                      stroke="var(--success)" 
                      strokeWidth="4.5" 
                      fill="none"
                      strokeLinecap="round" 
                      strokeDasharray="188.5" 
                      strokeDashoffset="11.3" 
                    />
                  </svg>
                  <div className="pct-text" style={{ color: 'var(--success)' }}>94%</div>
                </div>
                <div className="circular-progress-label">Confidence Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Health & Sources) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
          
          {/* AI Health Card */}
          <div className="glass feature-card">
            <div className="feature-card-header">
              <h3>AI Health Analysis</h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', color: 'var(--accent)' }}>
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div className="health-grid">
              {[
                { label: 'Content Originality', val: '95%', width: '95%', color: 'success' },
                { label: 'Grammar Check', val: '98%', width: '98%', color: 'success' },
                { label: 'Plagiarism Index', val: '2%', width: '2%', color: 'warning' },
                { label: 'Estimated Reading Time', val: '8 min', width: '80%', color: 'accent' },
                { label: 'Visual Design Quality', val: '91%', width: '91%', color: 'success' }
              ].map((item, idx) => (
                <div key={idx} className="health-item">
                  <div className="health-item-header">
                    <span>{item.label}</span>
                    <b>{item.val}</b>
                  </div>
                  <div className="quality-bar-bg">
                    <div className={`health-bar-fill ${item.color}`} style={{ width: item.width }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sources Used Card */}
          <div className="glass feature-card">
            <div className="feature-card-header">
              <h3>Verified References</h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', color: 'var(--success)' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="references-list">
              {[
                { name: 'IEEE Database' },
                { name: 'WHO Health Data' },
                { name: 'NASA Technical Reports' },
                { name: 'Research Paper (JSTOR)' },
                { name: 'Official Website Source' }
              ].map((ref, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="reference-item" 
                  onClick={(e) => { e.preventDefault(); handleReferenceClick(ref.name); }}
                >
                  <div className="ref-left">
                    <svg className="verify-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>{ref.name}</span>
                    <span className="ref-trusted-badge">Trusted</span>
                  </div>
                  <div className="ref-right">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
