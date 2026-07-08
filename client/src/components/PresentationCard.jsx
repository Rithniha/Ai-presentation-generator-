import React from 'react';

export default function PresentationCard({ deck, index, onNavigate, onDelete }) {
  // Cycle through premium thumbnail classes (t1 to t4)
  const thumbClass = `thumb-t${(index % 4) + 1}`;
  
  // Dynamic progress ring calculations (radius: 15, circumference: 94.2)
  const progress = deck.progress || (index === 0 ? 80 : index === 1 ? 50 : index === 2 ? 25 : 90);
  const strokeDasharray = 94.2;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progress) / 100;

  // Format date helper
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const diffMs = new Date() - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 60) return `${diffMins || 1}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'recently';
    }
  };

  const displayDate = deck.createdAt ? formatDate(deck.createdAt) : 'recently';
  const displayAudience = deck.audience || (index === 0 ? 'Investors' : index === 1 ? 'Leadership' : index === 2 ? 'Stakeholders' : 'Academic');
  const displayTheme = deck.theme || (index === 0 ? 'Aurora theme' : index === 1 ? 'Slate theme' : index === 2 ? 'Sunrise theme' : 'Mono theme');
  const displaySlides = deck.slides?.length || deck.slideCount || (index === 0 ? 14 : index === 1 ? 18 : index === 2 ? 10 : 22);

  // Get first tag name
  const themeTagName = displayTheme.split(' ')[0] || 'Modern';

  return (
    <div 
      className="glass pcard"
      onClick={() => onNavigate(deck._id)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {/* Premium Trash Button (Visible on hover via CSS or pointer) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(deck._id);
        }}
        className="icon-btn pcard-delete-btn"
        title="Delete presentation"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          opacity: 0,
          transition: 'opacity 0.2s, transform 0.2s',
          width: '28px',
          height: '28px',
          borderRadius: '8px'
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style={{ width: '14px', height: '14px' }}>
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
        </svg>
      </button>

      <div className={`pcard-thumb ${thumbClass}`}>
        <div className="bars">
          <i></i>
          <i></i>
          <i></i>
        </div>
        <div className="progress-ring-wrap">
          <svg width="38" height="38">
            <circle className="bg-ring" cx="19" cy="19" r="15" strokeWidth="3" fill="none" />
            <circle 
              className="fg-ring" 
              cx="19" 
              cy="19" 
              r="15" 
              strokeWidth="3" 
              fill="none" 
              strokeDasharray={strokeDasharray} 
              strokeDashoffset={strokeDashoffset} 
            />
          </svg>
          <div className="pct">{progress}%</div>
        </div>
      </div>
      <div className="pcard-body">
        <h4>{deck.title}</h4>
        <div className="pcard-meta">
          <span>Edited {displayDate}</span>
          <span className="dot-sep"></span>
          <span>{displayAudience}</span>
        </div>
        <div className="pcard-tags">
          <span className="tag">{displayAudience}</span>
          <span className="tag">{themeTagName} theme</span>
        </div>
        <div className="pcard-footer">
          <span className="slides">{displaySlides} slides</span>
          <a className="btn-continue">
            Continue 
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
