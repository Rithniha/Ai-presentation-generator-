import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getGuestSessionId } from '../services/auth';
import { Sparkles, Trash2, Plus, ArrowRight, CornerDownRight } from 'lucide-react';
import '../styles/Editor.css';

export default function OutlineEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const guestSessionId = getGuestSessionId();

  // Load generated deck data from Landing wizard redirect state
  const initialDeck = location.state?.generatedDeck || {
    title: 'AI Presentation Topic',
    slides: [
      { title: 'Introduction', content: ['First key bullet', 'Second key bullet'], layout: 'bullets' }
    ]
  };

  const [title, setTitle] = useState(initialDeck.title);
  const [slides, setSlides] = useState(initialDeck.slides);
  const [saving, setSaving] = useState(false);

  // Edit slide title
  const handleSlideTitleChange = (index, value) => {
    setSlides(prev => {
      const updated = [...prev];
      updated[index].title = value;
      return updated;
    });
  };

  // Edit bullet list
  const handleBulletChange = (slideIdx, bulletIdx, value) => {
    setSlides(prev => {
      const updated = [...prev];
      updated[slideIdx].content[bulletIdx] = value;
      return updated;
    });
  };

  // Add bullet line to slide
  const addBullet = (slideIdx) => {
    setSlides(prev => {
      const updated = [...prev];
      updated[slideIdx].content.push('New bullet detail');
      return updated;
    });
  };

  // Delete bullet line
  const removeBullet = (slideIdx, bulletIdx) => {
    setSlides(prev => {
      const updated = [...prev];
      updated[slideIdx].content.splice(bulletIdx, 1);
      return updated;
    });
  };

  // Add new blank slide card
  const addSlide = () => {
    setSlides(prev => [
      ...prev,
      {
        title: 'New Slide Title',
        content: ['First bullet point detail'],
        layout: 'bullets',
        icon: 'Presentation',
        note: 'Speaker detail notes.'
      }
    ]);
  };

  // Delete slide card
  const deleteSlide = (index) => {
    if (slides.length <= 1) {
      alert('Your presentation must contain at least 1 slide.');
      return;
    }
    setSlides(prev => prev.filter((_, idx) => idx !== index));
  };

  // Save outline to Database and transition to Visual Editor
  const handleRenderPresentation = async () => {
    setSaving(true);
    try {
      const response = await api.post('/api/presentations', {
        title,
        slides,
        guestSessionId,
        theme: 'classic'
      });

      // Navigate to the visual slide editor
      navigate(`/editor/${response.data._id}`);
    } catch (err) {
      alert(err.message || 'Failed to initialize presentation in editor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="landing-container" style={{ padding: '3rem 1.5rem', overflowY: 'auto' }}>
      <div className="outline-gate-container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <span className="badge">
              <Sparkles size={14} />
              Step 1: The Outline Gate
            </span>
            <h2 className="section-title" style={{ marginTop: '0.5rem' }}>Review & Edit Outline</h2>
            <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '0.25rem', fontSize: '0.95rem' }}>
              Confirm titles and content before rendering visual layout themes.
            </p>
          </div>
          
          <button 
            onClick={handleRenderPresentation} 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Rendering Canvas...' : 'Render Presentation'}
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Global Deck Title Field */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Presentation Title</label>
            <input 
              type="text" 
              className="form-input" 
              style={{ fontSize: '1.25rem', fontWeight: 700 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        {/* Slides list editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {slides.map((slide, sIdx) => (
            <div key={sIdx} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>
                  SLIDE {sIdx + 1} ({slide.layout.toUpperCase()})
                </span>
                
                <button 
                  onClick={() => deleteSlide(sIdx)}
                  className="deck-action-btn"
                  title="Delete slide"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Title input */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ fontWeight: 600, fontSize: '1.1rem' }}
                  value={slide.title}
                  onChange={(e) => handleSlideTitleChange(sIdx, e.target.value)}
                  placeholder="Slide Title"
                />
              </div>

              {/* Bullet points outline list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                {slide.content.map((bullet, bIdx) => (
                  <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CornerDownRight size={14} style={{ color: 'hsl(var(--text-muted))' }} />
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.9rem', backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.05)' }}
                      value={bullet}
                      onChange={(e) => handleBulletChange(sIdx, bIdx, e.target.value)}
                      placeholder="Enter slide detail bullet line..."
                    />
                    <button 
                      onClick={() => removeBullet(sIdx, bIdx)} 
                      className="deck-action-btn"
                      style={{ padding: '0.25rem' }}
                      title="Remove bullet line"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                <button 
                  onClick={() => addBullet(sIdx)}
                  className="btn btn-secondary"
                  style={{ alignSelf: 'flex-start', marginTop: '0.5rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                >
                  <Plus size={12} />
                  Add Bullet Line
                </button>
              </div>

            </div>
          ))}

          <button 
            onClick={addSlide}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '1.25rem', borderStyle: 'dashed', borderRadius: 'var(--radius-lg)' }}
          >
            <Plus size={16} />
            Append New Slide
          </button>
        </div>

      </div>
    </div>
  );
}
