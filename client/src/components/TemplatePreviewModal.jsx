import React, { useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function TemplatePreviewModal({ t, onClose, onSelect, compatibilityScore, slideCount }) {
  // Dismiss via Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="ts-preview-overlay" onClick={onClose}>
      <div className="ts-preview-modal" onClick={e => e.stopPropagation()}>
        {/* Large simulated slide */}
        <div className="ts-preview-slide" style={{ background: t.bg, position: 'relative' }}>
          {/* Accent bar */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: 6, height: '100%', background: t.accent }} />

          {/* Close Button inside slide preview (top right) */}
          <button 
            onClick={onClose} 
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.15)',
              border: `1px solid ${t.accent}30`,
              color: t.text,
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              backdropFilter: 'blur(4px)',
            }}
            aria-label="Close Preview"
          >
            <X size={18} />
          </button>

          <div style={{ paddingLeft: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: t.accent, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {t.category} THEME
            </div>
            <div className="ts-preview-slide-title" style={{ color: t.text }}>{t.name}</div>
            <div className="ts-preview-slide-sub" style={{ color: t.text }}>{t.philosophy}</div>
          </div>

          {/* 3 simulated content cards */}
          <div className="ts-preview-slide-content" style={{ paddingLeft: '1rem' }}>
            {['Key Points', 'Data Insights', 'Next Steps'].map((label, i) => (
              <div key={i} className="ts-preview-card" style={{ background: t.card, color: t.text, border: `1px solid ${t.accent}30` }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: t.accent, marginBottom: '0.4rem', opacity: 0.7 }} />
                <div style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.25rem' }}>{label}</div>
                <div style={{ height: 3, background: t.accent, borderRadius: 2, opacity: 0.3, marginBottom: 4 }} />
                <div style={{ height: 3, width: '70%', background: t.accent, borderRadius: 2, opacity: 0.2 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="ts-preview-footer">
          <div style={{ flex: 1, marginRight: '1.5rem' }}>
            <div className="ts-preview-name">{t.name}</div>
            <div className="ts-preview-desc">
              {t.desc}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                <span className="ts-card-tag" style={{ background: '#f1f5f9', color: '#475569' }}>
                  📊 {slideCount} slides
                </span>
                <span className="ts-card-tag" style={{ background: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5', fontWeight: 700 }}>
                  ⚡ {compatibilityScore}% match
                </span>
                <span className="ts-card-tag" style={{ background: '#f1f5f9', color: '#475569' }}>
                  📂 {t.category}
                </span>
              </div>
              <div style={{ marginTop: '0.6rem', fontSize: '0.75rem' }}>
                <b style={{ color: '#475569' }}>Best for:</b> {t.users}
              </div>
            </div>
          </div>
          <div className="ts-preview-actions">
            <button className="ts-preview-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="ts-preview-select" onClick={onSelect}>
              <CheckCircle size={14} style={{ display: 'inline', marginRight: 4 }} />Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
