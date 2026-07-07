import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getGuestSessionId } from '../services/auth';
import { exportToPptx } from '../services/pptxExporter';
import { 
  Sparkles, Save, Download, Layout, Palette, Plus, Trash2, 
  ChevronLeft, FileText, Columns, TrendingUp, Clock, HelpCircle 
} from 'lucide-react';
import '../styles/Editor.css';

export default function MainEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const guestSessionId = getGuestSessionId();

  const [presentation, setPresentation] = useState(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Floating AI rewrite assistant states
  const [rewriteTarget, setRewriteTarget] = useState(null); // { slideIdx, bulletIdx, text }
  const [rewriteLoading, setRewriteLoading] = useState(false);

  // Fetch presentation from database
  const loadPresentation = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/presentations/${id}?guestSessionId=${guestSessionId}`);
      setPresentation(response.data);
    } catch (err) {
      alert('Could not open presentation. Redirecting to dashboard.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresentation();
  }, [id]);

  // Sync state modifications to MongoDB
  const handleSave = async () => {
    if (!presentation) return;
    setSaving(true);
    try {
      await api.put(`/api/presentations/${id}`, {
        ...presentation,
        guestSessionId
      });
      alert('Presentation progress saved successfully.');
    } catch (err) {
      alert(err.message || 'Saving failed.');
    } finally {
      setSaving(false);
    }
  };

  // Export to PowerPoint
  const handleDownload = () => {
    if (!presentation) return;
    exportToPptx(presentation);
  };

  // Change Theme Color Scheme variables
  const handleThemeChange = (themeName) => {
    setPresentation(prev => ({
      ...prev,
      theme: themeName
    }));
  };

  // Change active slide layout template
  const handleLayoutChange = (layoutName) => {
    setPresentation(prev => {
      const updated = { ...prev };
      updated.slides[activeSlideIdx].layout = layoutName;
      
      // Enforce data dimensions depending on selected layout
      const content = updated.slides[activeSlideIdx].content;
      if (layoutName === 'stats' && content.length < 2) {
        updated.slides[activeSlideIdx].content = ['85%', 'Stat description label', 'Audited status details'];
      } else if (layoutName === 'columns' && content.length < 3) {
        updated.slides[activeSlideIdx].content = ['Column Point A details', 'Column Point B details', 'Column Point C details'];
      } else if (layoutName === 'timeline' && content.length < 3) {
        updated.slides[activeSlideIdx].content = ['Phase 1 Roadmap', 'Phase 2 Execution', 'Phase 3 Scaling'];
      }
      return updated;
    });
  };

  // Update slide title content onBlur (WYSIWYG edit)
  const handleTitleBlur = (e) => {
    const text = e.target.innerText;
    setPresentation(prev => {
      const updated = { ...prev };
      updated.slides[activeSlideIdx].title = text;
      return updated;
    });
  };

  // Update bullet point text line onBlur
  const handleBulletBlur = (bulletIdx, text) => {
    setPresentation(prev => {
      const updated = { ...prev };
      updated.slides[activeSlideIdx].content[bulletIdx] = text;
      return updated;
    });
  };

  // Trigger inline AI rewrite
  const handleAiRewrite = async (bulletIdx, text, command) => {
    setRewriteLoading(true);
    try {
      const response = await api.post('/api/generation/rewrite', { text, command });
      
      // Update local state with rewritten response text
      setPresentation(prev => {
        const updated = { ...prev };
        updated.slides[activeSlideIdx].content[bulletIdx] = response.data;
        return updated;
      });
      setRewriteTarget(null);
    } catch (err) {
      alert('AI Rewrite request failed: ' + err.message);
    } finally {
      setRewriteLoading(false);
    }
  };

  // Append slide
  const handleAddSlide = () => {
    setPresentation(prev => {
      const updated = { ...prev };
      updated.slides.push({
        title: 'New Slide Title',
        content: ['First bullet point detail line'],
        layout: 'bullets',
        icon: 'Presentation',
        note: 'Presenter slide notes details.'
      });
      return updated;
    });
    setActiveSlideIdx(presentation.slides.length);
  };

  // Delete slide
  const handleDeleteSlide = (index) => {
    if (presentation.slides.length <= 1) {
      alert('Cannot delete the last slide.');
      return;
    }
    setPresentation(prev => {
      const updated = { ...prev };
      updated.slides = updated.slides.filter((_, idx) => idx !== index);
      return updated;
    });
    setActiveSlideIdx(0);
  };

  if (loading) {
    return (
      <div className="landing-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <span style={{ marginLeft: '1rem', color: 'hsl(var(--text-secondary))' }}>Loading presentation workspace...</span>
      </div>
    );
  }

  const activeSlide = presentation.slides[activeSlideIdx] || presentation.slides[0];

  return (
    <div className="editor-layout" data-theme={presentation.theme}>
      
      {/* 1. Left Thumbnail list panel */}
      <aside className="editor-sidebar">
        <div className="sidebar-title">
          <button onClick={() => navigate('/dashboard')} className="deck-action-btn" style={{ padding: '0.25rem' }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Outline Slides</span>
        </div>

        <div className="slide-thumbnails-list">
          {presentation.slides.map((slide, idx) => (
            <div 
              key={idx} 
              className={`thumbnail-card ${activeSlideIdx === idx ? 'active' : ''}`}
              onClick={() => setActiveSlideIdx(idx)}
            >
              <span className="thumbnail-num">{idx + 1}</span>
              <div style={{ marginTop: '1rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {slide.title || 'Untitled Slide'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.55rem', opacity: 0.7 }}>{slide.layout}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSlide(idx);
                  }}
                  className="deck-action-btn"
                  style={{ padding: 0 }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          <button onClick={handleAddSlide} className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
            <Plus size={14} />
            Add Slide
          </button>
        </div>
      </aside>

      {/* 2. Central canvas area */}
      <main className="canvas-viewport">
        {/* Top actions bar */}
        <div className="editor-topbar" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'hsl(var(--text-primary))' }}>
            {presentation.title}
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} disabled={saving}>
              <Save size={14} />
              {saving ? 'Saving...' : 'Save progress'}
            </button>
            <button onClick={handleDownload} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <Download size={14} />
              Download PPTX
            </button>
          </div>
        </div>

        {/* 16:9 Widescreen slide viewport */}
        <div className={`slide-frame layout-${activeSlide.layout}`} style={{ borderLeft: `8px solid hsl(var(--primary))` }}>
          
          {/* Header */}
          {activeSlide.layout !== 'title' && (
            <h2 
              className="slide-header"
              contentEditable="true"
              suppressContentEditableWarning={true}
              onBlur={handleTitleBlur}
            >
              {activeSlide.title}
            </h2>
          )}

          {/* Slide Layout Body Renders */}
          <div className="slide-content-body">
            
            {activeSlide.layout === 'title' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={handleTitleBlur}
                  style={{ fontSize: '3rem', fontWeight: 800, color: 'hsl(var(--primary))' }}
                >
                  {activeSlide.title}
                </h2>
                <p 
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleBulletBlur(0, e.target.innerText)}
                  style={{ fontSize: '1.25rem' }}
                >
                  {activeSlide.content[0] || 'AI Presentation Subtitle'}
                </p>
              </div>
            )}

            {activeSlide.layout === 'bullets' && (
              <ul>
                {activeSlide.content.map((bullet, bIdx) => (
                  <li key={bIdx} style={{ position: 'relative' }}>
                    <div
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleBulletBlur(bIdx, e.target.innerText)}
                      style={{ display: 'inline-block', width: '90%' }}
                    >
                      {bullet}
                    </div>

                    {/* Floating AI helper controls */}
                    <button 
                      onClick={() => setRewriteTarget({ slideIdx: activeSlideIdx, bulletIdx: bIdx, text: bullet })}
                      className="deck-action-btn"
                      style={{ position: 'absolute', right: 0, top: 0, padding: '0.2rem' }}
                      title="AI Rewrite"
                    >
                      <Sparkles size={12} style={{ color: 'hsl(var(--accent))' }} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {activeSlide.layout === 'columns' && (
              <div className="layout-columns">
                {activeSlide.content.slice(0, 3).map((colText, colIdx) => (
                  <div key={colIdx} className="column-card">
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--accent))', display: 'block', marginBottom: '0.5rem' }}>
                      Pillar 0{colIdx + 1}
                    </span>
                    <div
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleBulletBlur(colIdx, e.target.innerText)}
                    >
                      {colText}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSlide.layout === 'stats' && (
              <div className="layout-stats">
                <div 
                  className="stat-number"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleBulletBlur(0, e.target.innerText)}
                >
                  {activeSlide.content[0] || '85%'}
                </div>
                
                <div className="stat-details">
                  <div 
                    className="stat-label"
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBulletBlur(1, e.target.innerText)}
                  >
                    {activeSlide.content[1] || 'Satisfied Users'}
                  </div>
                  <div 
                    className="stat-sublabel"
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBulletBlur(2, e.target.innerText)}
                  >
                    {activeSlide.content[2] || 'Based on quarterly user survey indexes.'}
                  </div>
                </div>
              </div>
            )}

            {activeSlide.layout === 'timeline' && (
              <div className="layout-timeline">
                {activeSlide.content.slice(0, 3).map((timeText, tIdx) => (
                  <div key={tIdx} className="timeline-node">
                    <div className="timeline-dot"></div>
                    <div 
                      className="timeline-card"
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleBulletBlur(tIdx, e.target.innerText)}
                    >
                      {timeText}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Speaker notes preview indicator */}
          <div style={{ position: 'absolute', bottom: '0.5rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FileText size={12} style={{ color: 'hsl(var(--text-muted))' }} />
            <span style={{ fontSize: '0.65rem', color: 'hsl(var(--text-muted))' }}>Active Speaker Notes</span>
          </div>

        </div>

        {/* AI Rewrite assistant popup modal */}
        {rewriteTarget && (
          <div className="glass-panel" style={{ position: 'absolute', bottom: '2rem', padding: '1.5rem', width: '100%', maxWidth: '500px', zIndex: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
                <Sparkles size={16} style={{ color: 'hsl(var(--accent))' }} />
                AI Assistant Rewrite
              </div>
              <button onClick={() => setRewriteTarget(null)} className="deck-action-btn" style={{ fontSize: '0.75rem', marginLeft: 'auto' }}>Close</button>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '1rem', fontStyle: 'italic' }}>
              "{rewriteTarget.text}"
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} disabled={rewriteLoading}>
              <button onClick={() => handleAiRewrite(rewriteTarget.bulletIdx, rewriteTarget.text, 'shorter')} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                Make Shorter
              </button>
              <button onClick={() => handleAiRewrite(rewriteTarget.bulletIdx, rewriteTarget.text, 'more professional')} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                Make Professional
              </button>
              <button onClick={() => handleAiRewrite(rewriteTarget.bulletIdx, rewriteTarget.text, 'more enthusiastic')} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                Enthusiastic Tone
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. Right configuration side panel */}
      <aside className="edit-panel">
        
        {/* Theme swapper selection */}
        <div className="panel-section">
          <h4 className="panel-section-title">Color Themes</h4>
          <div className="theme-grid">
            {['classic', 'sunset', 'forest', 'cyberpunk'].map(themeName => (
              <div 
                key={themeName} 
                className={`theme-card ${presentation.theme === themeName ? 'active' : ''}`}
                onClick={() => handleThemeChange(themeName)}
              >
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Layout templates selector */}
        <div className="panel-section">
          <h4 className="panel-section-title">Slide Layouts</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={() => handleLayoutChange('title')} className={`btn btn-secondary`} style={{ justifyContent: 'flex-start', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <Layout size={14} style={{ marginRight: '0.5rem' }} />
              Title Layout
            </button>
            <button onClick={() => handleLayoutChange('bullets')} className={`btn btn-secondary`} style={{ justifyContent: 'flex-start', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <FileText size={14} style={{ marginRight: '0.5rem' }} />
              Standard Bullet List
            </button>
            <button onClick={() => handleLayoutChange('columns')} className={`btn btn-secondary`} style={{ justifyContent: 'flex-start', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <Columns size={14} style={{ marginRight: '0.5rem' }} />
              3 Column Grid
            </button>
            <button onClick={() => handleLayoutChange('stats')} className={`btn btn-secondary`} style={{ justifyContent: 'flex-start', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <TrendingUp size={14} style={{ marginRight: '0.5rem' }} />
              Large Stats Display
            </button>
            <button onClick={() => handleLayoutChange('timeline')} className={`btn btn-secondary`} style={{ justifyContent: 'flex-start', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <Clock size={14} style={{ marginRight: '0.5rem' }} />
              Horizontal Timeline
            </button>
          </div>
        </div>

        {/* Speaker notes input field */}
        <div className="panel-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h4 className="panel-section-title">Speaker Slide Notes</h4>
          <textarea 
            className="form-input" 
            style={{ width: '100%', flex: 1, resize: 'none', fontSize: '0.85rem' }}
            value={activeSlide.note || ''}
            onChange={(e) => {
              const text = e.target.value;
              setPresentation(prev => {
                const updated = { ...prev };
                updated.slides[activeSlideIdx].note = text;
                return updated;
              });
            }}
            placeholder="Add speaking script or memory triggers..."
          />
        </div>

      </aside>

    </div>
  );
}
