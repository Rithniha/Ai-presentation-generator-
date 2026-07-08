import React, { useState } from 'react';

export default function AudienceAlignment({ showToast }) {
  // 1. Audience Optimization State
  const [currentAudience, setCurrentAudience] = useState('🎓 Student');
  const [audiencePreview, setAudiencePreview] = useState(
    'Select an audience to preview optimization changes. Click any button to see the preview.'
  );
  const [activeAudType, setActiveAudType] = useState('');

  const audienceOptions = [
    {
      id: 'Business',
      label: '💼 Business',
      preview: 'Presentation content optimized for Business audience. Focused on market size, financial growth, and strategic milestones.'
    },
    {
      id: 'Professor',
      label: '👨‍🏫 Professor',
      preview: 'Presentation content optimized for Professor audience. Focused on research methodology, academic references, and deep citations.'
    },
    {
      id: 'Investors',
      label: '📈 Investors',
      preview: 'Presentation content optimized for Investors audience. Focused on funding requirements, ROI projections, and scaling performance.'
    }
  ];

  const handleAudienceChange = (option) => {
    setActiveAudType(option.id);
    
    // Simulate fade transition
    const previewBox = document.getElementById('audiencePreviewText');
    if (previewBox) {
      previewBox.style.opacity = '0';
      previewBox.style.transform = 'translateY(4px)';
      
      setTimeout(() => {
        setCurrentAudience(option.label);
        setAudiencePreview(option.preview);
        previewBox.style.opacity = '1';
        previewBox.style.transform = 'translateY(0)';
        showToast(`Audience optimized: ${option.label}`);
      }, 200);
    }
  };

  // 2. Suggestions State
  const [suggestions, setSuggestions] = useState([
    {
      id: 'suggestionSlide5',
      title: 'Slide 5 contains too much text',
      detail: 'Slide 5 density is 84 words. Expected standard: <45 words.',
      successMsg: 'Slide 5 split and shortened!',
      dismissed: false,
      visible: true
    },
    {
      id: 'suggestionSlide8',
      title: 'Slide 8 has no visual',
      detail: 'Visual representations reinforce narrative recall by 65%.',
      successMsg: 'A relevant chart has been added to Slide 8!',
      dismissed: false,
      visible: true
    },
    {
      id: 'suggestionConclusion',
      title: 'Conclusion needs stronger summary',
      detail: 'Key takeaways need actionable phrasing for business alignment.',
      successMsg: 'Conclusion summary rewrote with dynamic metrics!',
      dismissed: false,
      visible: true
    }
  ]);

  const handleFixSuggestion = (id, successMsg) => {
    // Animate out card
    setSuggestions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, opacity: 0, transform: 'translateX(-12px)' };
      }
      return s;
    }));

    setTimeout(() => {
      setSuggestions(prev => prev.filter(s => s.id !== id));
      showToast(successMsg);
    }, 400);
  };

  const handleDismissSuggestion = (id) => {
    setSuggestions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, dismissed: true };
      }
      return s;
    }));
    showToast('Suggestion dismissed');
  };

  // 3. Optimize presentation trigger
  const handleOptimizePresentation = () => {
    showToast('AI Optimizer: Adding corporate visuals and restructuring slide layout…');
    setTimeout(() => {
      showToast('Presentation successfully optimized for Business Executives!');
    }, 1800);
  };

  // 4. Timeline step active selection
  const [activeStep, setActiveStep] = useState(0);
  const timelineSteps = [
    { title: 'Introduction', sub: 'Slide 1 — Overview' },
    { title: 'Problem Statement', sub: 'Slide 2 — Pain Points' },
    { title: 'Solution', sub: 'Slide 3 — Value Prop' },
    { title: 'Architecture', sub: 'Slide 4 — Tech Stack' },
    { title: 'Demo', sub: 'Slide 5 — User Flow' },
    { title: 'Results', sub: 'Slide 6 — Key Metrics' },
    { title: 'Conclusion', sub: 'Slide 7 — Next Steps' }
  ];

  return (
    <section>
      <div className="section-head">
        <h2>Audience Alignment & Optimization</h2>
      </div>
      <div className="split-row">
        
        {/* Left Column (Suggestions & Audience Preview) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
          
          {/* AI Improvement Suggestions */}
          <div className="glass feature-card">
            <div className="feature-card-header">
              <h3>AI Suggestions</h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', color: 'var(--warning)' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="suggestions-container" id="suggestionsContainer">
              {suggestions.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-3)', fontSize: '13px' }}>
                  🎉 All suggestion fixes applied!
                </div>
              ) : (
                suggestions.map((s) => (
                  <div 
                    key={s.id} 
                    className="suggestion-card" 
                    id={s.id}
                    style={{
                      opacity: s.opacity !== undefined ? s.opacity : (s.dismissed ? 0.35 : 1),
                      transform: s.transform || 'none',
                      transition: 'all 0.4s cubic-bezier(.22, 1, .36, 1)'
                    }}
                  >
                    <div className="suggestion-text-row">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <div>
                        <b style={{ color: 'var(--text-0)' }}>{s.title}</b>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginTop: '2px' }}>{s.detail}</div>
                      </div>
                    </div>
                    <div className="suggestion-actions">
                      <button 
                        className="btn-fix" 
                        onClick={() => handleFixSuggestion(s.id, s.successMsg)}
                        disabled={s.dismissed}
                        style={{ cursor: s.dismissed ? 'not-allowed' : 'pointer' }}
                      >
                        Fix Now
                      </button>
                      <button 
                        className="btn-ignore" 
                        onClick={() => handleDismissSuggestion(s.id)}
                        disabled={s.dismissed}
                        style={{ cursor: s.dismissed ? 'not-allowed' : 'pointer' }}
                      >
                        {s.dismissed ? 'Ignored' : 'Dismiss'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Audience Preview Card */}
          <div className="glass feature-card">
            <div className="feature-card-header">
              <h3>Audience Optimization</h3>
              <div className="current-audience-badge">
                <span>Current Audience:</span>
                <b>{currentAudience}</b>
              </div>
            </div>
            <div className="audience-controls">
              <div className="audience-btn-grid">
                {audienceOptions.map((opt) => (
                  <button 
                    key={opt.id}
                    className={`btn-aud ${activeAudType === opt.id ? 'active' : ''}`}
                    onClick={() => handleAudienceChange(opt)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div 
                className="audience-preview-container" 
                id="audiencePreviewText"
                style={{ transition: 'all 0.2s ease-out' }}
              >
                {audiencePreview}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Recommendation & Outline Preview) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
          
          {/* AI Recommendation Card */}
          <div className="glass feature-card recommendation-glow">
            <div className="feature-card-header">
              <h3 style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                AI Recommendation
              </h3>
            </div>
            <div className="rec-quote">
              "Your presentation is suitable for students but needs more visuals for business executives."
            </div>
            <button className="btn-optimize" onClick={handleOptimizePresentation}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '15px', height: '15px' }}>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Optimize Presentation
            </button>
          </div>

          {/* Outline Preview */}
          <div className="glass feature-card">
            <div className="feature-card-header">
              <h3>Presentation Structure</h3>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--text-3)' }}>
                {timelineSteps.length} Slides
              </span>
            </div>
            <div className="outline-timeline-wrap">
              {timelineSteps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`outline-step ${idx === activeStep ? 'active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="outline-step-title">{step.title}</div>
                  <div className="outline-step-sub">{step.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
