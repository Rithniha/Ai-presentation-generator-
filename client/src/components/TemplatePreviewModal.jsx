import React, { useEffect, useState, useRef } from 'react';
import { X, CheckCircle, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import TemplateCardPreview from './TemplateCardPreview';

const SLIDE_TYPES = ['cover', 'content', 'timeline', 'chart', 'closing'];
const SLIDE_LABELS = {
  cover: 'Cover Slide',
  content: 'Content Slide',
  timeline: 'Timeline Slide',
  chart: 'Chart Slide',
  closing: 'Closing Slide'
};

export default function TemplatePreviewModal({ t, onClose, onSelect, compatibilityScore, slideCount }) {
  const [activeSlide, setActiveSlide] = useState('cover');
  const [isPlaying, setIsPlaying] = useState(true);
  const playIntervalRef = useRef(null);

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

  // Autoplay slide rotation
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setActiveSlide((prev) => {
          const currentIndex = SLIDE_TYPES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % SLIDE_TYPES.length;
          return SLIDE_TYPES[nextIndex];
        });
      }, 2500);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setIsPlaying(false);
    setActiveSlide((prev) => {
      const currentIndex = SLIDE_TYPES.indexOf(prev);
      const prevIndex = (currentIndex - 1 + SLIDE_TYPES.length) % SLIDE_TYPES.length;
      return SLIDE_TYPES[prevIndex];
    });
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setIsPlaying(false);
    setActiveSlide((prev) => {
      const currentIndex = SLIDE_TYPES.indexOf(prev);
      const nextIndex = (currentIndex + 1) % SLIDE_TYPES.length;
      return SLIDE_TYPES[nextIndex];
    });
  };

  const selectSlide = (slide) => {
    setIsPlaying(false);
    setActiveSlide(slide);
  };

  return (
    <div className="ts-preview-overlay" onClick={onClose}>
      <div className="ts-preview-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '95%' }}>
        {/* Large simulated slide container */}
        <div className="ts-preview-slide" style={{ padding: 0, position: 'relative', overflow: 'hidden', width: '100%', height: 'auto' }}>
          
          {/* Main Slide Viewer */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
            <TemplateCardPreview t={t} slideType={activeSlide} />
            
            {/* Overlay Navigation Arrows */}
            <button 
              onClick={handlePrev}
              style={{
                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.8)', border: 'none', color: '#0f172a',
                borderRadius: '50%', width: '36px', height: '36px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)', transition: 'all 0.15s'
              }}
              aria-label="Previous Slide"
              className="ts-modal-nav-btn"
            >
              <ChevronLeft size={20} />
            </button>

            <button 
              onClick={handleNext}
              style={{
                position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.8)', border: 'none', color: '#0f172a',
                borderRadius: '50%', width: '36px', height: '36px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)', transition: 'all 0.15s'
              }}
              aria-label="Next Slide"
              className="ts-modal-nav-btn"
            >
              <ChevronRight size={20} />
            </button>

            {/* Play/Pause Autoplay overlay control */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
              style={{
                position: 'absolute', bottom: '1rem', right: '1rem',
                background: 'rgba(255, 255, 255, 0.85)', border: 'none', color: '#0f172a',
                borderRadius: '8px', padding: '0.4rem 0.8rem', display: 'flex',
                alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)'
              }}
            >
              {isPlaying ? <Pause size={12} fill="#0f172a" /> : <Play size={12} fill="#0f172a" />}
              <span>{isPlaying ? 'Autoplay On' : 'Autoplay Paused'}</span>
            </button>

            {/* Close Button inside slide preview (top right) */}
            <button 
              onClick={onClose} 
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'rgba(255, 255, 255, 0.85)', border: 'none', color: '#0f172a',
                borderRadius: '50%', width: '32px', height: '32px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)'
              }}
              aria-label="Close Preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal tabs selector for slide types */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '6px', background: '#f8fafc',
          padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap'
        }}>
          {SLIDE_TYPES.map((type) => {
            const isActive = activeSlide === type;
            return (
              <button
                key={type}
                onClick={() => selectSlide(type)}
                style={{
                  padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid',
                  borderColor: isActive ? t.accent : '#cbd5e1',
                  background: isActive ? t.accent : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                {SLIDE_LABELS[type]}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="ts-preview-footer" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ flex: 1, marginRight: '1.5rem' }}>
            <div className="ts-preview-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{t.name}</span>
              {t.badges?.map(badge => (
                <span key={badge} style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: '#f1f5f9', fontWeight: 700, border: '1px solid #cbd5e1' }}>
                  {badge}
                </span>
              ))}
            </div>
            <div className="ts-preview-desc" style={{ marginTop: '0.4rem' }}>
              {t.desc}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                <span className="ts-card-tag" style={{ background: '#f1f5f9', color: '#475569' }}>
                  📊 {slideCount || t.slideCount || 12} slides
                </span>
                <span className="ts-card-tag" style={{ background: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5', fontWeight: 700 }}>
                  ⚡ {compatibilityScore || 90}% match
                </span>
                <span className="ts-card-tag" style={{ background: '#f1f5f9', color: '#475569' }}>
                  📂 {t.category}
                </span>
                <span className="ts-card-tag" style={{ background: '#f1f5f9', color: '#475569' }}>
                  🎨 {t.style || 'Modern'}
                </span>
                <span className="ts-card-tag" style={{ background: '#f1f5f9', color: '#475569' }}>
                  ⚡ {t.animated ? 'Animated' : 'Static'}
                </span>
                <span className="ts-card-tag" style={{ background: '#f1f5f9', color: '#475569' }}>
                  📏 {t.aspectRatio || '16:9'}
                </span>
              </div>
              <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: '#64748b' }}>
                <b style={{ color: '#475569' }}>Best for:</b> {t.users} | <b style={{ color: '#475569' }}>Updated:</b> {t.lastUpdated || 'Recently'}
              </div>
            </div>
          </div>
          <div className="ts-preview-actions" style={{ flexShrink: 0 }}>
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
