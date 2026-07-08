import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getGuestSessionId } from '../services/auth';
import { exportToPptx } from '../services/pptxExporter';
import { 
  Sparkles, Save, Download, Layout, Palette, Plus, Trash2, 
  ChevronLeft, FileText, Columns, TrendingUp, Clock, Type, Image as ImageIcon, 
  Shapes, Move, Type as TextIcon, Undo, Redo, Play, Settings, Grid,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline
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
  
  // Advanced Editor States
  const [activeSidebarTab, setActiveSidebarTab] = useState('templates');
  const [selectedElement, setSelectedElement] = useState(null);

  // Floating AI rewrite assistant states
  const [rewriteTarget, setRewriteTarget] = useState(null);
  const [rewriteLoading, setRewriteLoading] = useState(false);

  // Mock fetching for now, assuming temp-id if not found
  const loadPresentation = async () => {
    try {
      setLoading(true);
      if (id.startsWith('pres_')) {
         // Mock created presentation
         setPresentation({
           title: 'Generated Presentation',
           theme: 'classic',
           slides: [
             { layout: 'title', title: 'Welcome to DeckFlow AI', content: ['Your intelligent presentation assistant'] },
             { layout: 'bullets', title: 'Key Features', content: ['Auto Generation', 'Smart Formatting', 'Export to PPTX'] },
           ]
         });
      } else {
        const response = await api.get(`/api/presentations/${id}?guestSessionId=${guestSessionId}`);
        setPresentation(response.data);
      }
    } catch (err) {
      alert('Could not open presentation. Redirecting to home.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresentation();
  }, [id]);

  const handleSave = async () => {
    if (!presentation) return;
    setSaving(true);
    try {
      if (!id.startsWith('pres_')) {
        await api.put(`/api/presentations/${id}`, {
          ...presentation,
          guestSessionId
        });
      }
      setTimeout(() => {
        alert('Presentation progress saved successfully.');
        setSaving(false);
      }, 800);
    } catch (err) {
      alert(err.message || 'Saving failed.');
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!presentation) return;
    exportToPptx(presentation);
  };

  const handleThemeChange = (themeName) => {
    setPresentation(prev => ({ ...prev, theme: themeName }));
  };

  const handleLayoutChange = (layoutName) => {
    setPresentation(prev => {
      const updated = { ...prev };
      updated.slides[activeSlideIdx].layout = layoutName;
      return updated;
    });
  };

  const handleTitleBlur = (e) => {
    const text = e.target.innerText;
    setPresentation(prev => {
      const updated = { ...prev };
      updated.slides[activeSlideIdx].title = text;
      return updated;
    });
  };

  const handleBulletBlur = (bulletIdx, text) => {
    setPresentation(prev => {
      const updated = { ...prev };
      updated.slides[activeSlideIdx].content[bulletIdx] = text;
      return updated;
    });
  };

  const handleAddSlide = () => {
    setPresentation(prev => {
      const updated = { ...prev };
      updated.slides.push({
        title: 'New Slide Title',
        content: ['First point'],
        layout: 'bullets',
      });
      return updated;
    });
    setActiveSlideIdx(presentation.slides.length);
  };

  const handleDeleteSlide = (index) => {
    if (presentation.slides.length <= 1) return alert('Cannot delete the last slide.');
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
        <span style={{ marginLeft: '1rem', color: 'hsl(var(--text-secondary))' }}>Loading editor workspace...</span>
      </div>
    );
  }

  const activeSlide = presentation.slides[activeSlideIdx] || presentation.slides[0];

  return (
    <div className="adv-editor-layout" data-theme={presentation.theme}>
      {/* Top Navbar: PowerPoint/Canva Style */}
      <header className="adv-topbar">
        <div className="adv-topbar-left">
          <button onClick={() => navigate('/')} className="adv-icon-btn"><ChevronLeft size={20} /></button>
          <div className="adv-file-menu">
            <span className="adv-doc-title">{presentation.title}</span>
            <div className="adv-menu-links">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Insert</span>
              <span>Format</span>
              <span>Slide</span>
              <span>Arrange</span>
              <span>Tools</span>
              <span>Help</span>
            </div>
          </div>
        </div>
        
        <div className="adv-topbar-center">
          <button className="adv-tool-btn" title="Undo"><Undo size={16} /></button>
          <button className="adv-tool-btn" title="Redo"><Redo size={16} /></button>
          <div className="adv-divider" />
          <button className="adv-tool-btn" title="Present"><Play size={16} /> Present</button>
        </div>

        <div className="adv-topbar-right">
          <button onClick={handleSave} className="adv-btn adv-btn-secondary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleDownload} className="adv-btn adv-btn-primary">
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      {/* Formatting Toolbar */}
      <div className="adv-format-toolbar">
        <select className="adv-font-select">
          <option>Inter</option>
          <option>Roboto</option>
          <option>Playfair Display</option>
          <option>Montserrat</option>
        </select>
        <div className="adv-font-size-control">
          <button>-</button>
          <span>24</span>
          <button>+</button>
        </div>
        <div className="adv-divider" />
        <button className="adv-format-btn"><Bold size={16} /></button>
        <button className="adv-format-btn"><Italic size={16} /></button>
        <button className="adv-format-btn"><Underline size={16} /></button>
        <div className="adv-color-picker" style={{ backgroundColor: '#ffffff' }} />
        <div className="adv-divider" />
        <button className="adv-format-btn"><AlignLeft size={16} /></button>
        <button className="adv-format-btn"><AlignCenter size={16} /></button>
        <button className="adv-format-btn"><AlignRight size={16} /></button>
        <div className="adv-divider" />
        <button className="adv-format-btn" title="AI Magic"><Sparkles size={16} color="#8b5cf6" /></button>
      </div>

      <div className="adv-workspace">
        {/* Extreme Left Toolbar (Canva style) */}
        <nav className="adv-side-nav">
          {[
            { id: 'templates', icon: Layout, label: 'Design' },
            { id: 'elements', icon: Shapes, label: 'Elements' },
            { id: 'text', icon: Type, label: 'Text' },
            { id: 'uploads', icon: ImageIcon, label: 'Uploads' },
            { id: 'draw', icon: Palette, label: 'Draw' },
            { id: 'apps', icon: Grid, label: 'Apps' }
          ].map(tab => (
            <button 
              key={tab.id}
              className={`adv-nav-item ${activeSidebarTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveSidebarTab(tab.id)}
            >
              <tab.icon size={24} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Left Drawer (Contextual based on Side Nav) */}
        <aside className="adv-drawer">
          {activeSidebarTab === 'templates' && (
            <div className="adv-drawer-content">
              <h3>Templates</h3>
              <div className="adv-layout-grid">
                {['title', 'bullets', 'columns', 'stats', 'timeline'].map(l => (
                  <div key={l} className="adv-layout-thumb" onClick={() => handleLayoutChange(l)}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </div>
                ))}
              </div>
              <h3 style={{ marginTop: '2rem' }}>Themes</h3>
              <div className="adv-theme-grid">
                {['classic', 'sunset', 'forest', 'cyberpunk'].map(t => (
                  <div key={t} className={`adv-theme-thumb ${presentation.theme === t ? 'active' : ''}`} onClick={() => handleThemeChange(t)}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSidebarTab === 'text' && (
            <div className="adv-drawer-content">
              <h3>Text Elements</h3>
              <button className="adv-add-text-btn h1">Add a heading</button>
              <button className="adv-add-text-btn h2">Add a subheading</button>
              <button className="adv-add-text-btn body">Add a little bit of body text</button>
            </div>
          )}
        </aside>

        {/* Central Canvas Area */}
        <main className="adv-canvas-area">
          <div className="adv-canvas-wrapper">
            <div className={`slide-frame layout-${activeSlide.layout}`} onClick={() => setSelectedElement('background')}>
              
              {activeSlide.layout !== 'title' && (
                <h2 
                  className={`slide-header ${selectedElement === 'title' ? 'selected' : ''}`}
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={handleTitleBlur}
                  onClick={(e) => { e.stopPropagation(); setSelectedElement('title'); }}
                >
                  {activeSlide.title}
                </h2>
              )}

              <div className="slide-content-body">
                {activeSlide.layout === 'title' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
                    <h2 
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={handleTitleBlur}
                      style={{ fontSize: '4rem', fontWeight: 800, color: 'hsl(var(--primary))' }}
                    >
                      {activeSlide.title}
                    </h2>
                    <p 
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleBulletBlur(0, e.target.innerText)}
                      style={{ fontSize: '1.5rem', color: 'hsl(var(--text-secondary))' }}
                    >
                      {activeSlide.content[0] || 'Subtitle'}
                    </p>
                  </div>
                )}

                {activeSlide.layout === 'bullets' && (
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {activeSlide.content.map((bullet, bIdx) => (
                      <li key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem', fontSize: '1.5rem' }}>
                        <span style={{ color: 'hsl(var(--primary))', marginTop: '0.2rem' }}>✦</span>
                        <div
                          contentEditable="true"
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleBulletBlur(bIdx, e.target.innerText)}
                          style={{ flex: 1, outline: 'none' }}
                        >
                          {bullet}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
                {/* Fallback for other layouts */}
                {['columns', 'stats', 'timeline'].includes(activeSlide.layout) && (
                   <div style={{ fontSize: '1.5rem', color: 'gray' }}>
                     [ {activeSlide.layout.toUpperCase()} Layout Preview ]<br/>
                     Editable components populate here based on data.
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Thumbnail Filmstrip (PowerPoint style) */}
          <div className="adv-filmstrip">
            {presentation.slides.map((slide, idx) => (
              <div 
                key={idx}
                className={`adv-strip-thumb ${activeSlideIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveSlideIdx(idx)}
              >
                <div className="adv-strip-num">{idx + 1}</div>
                <div className="adv-strip-preview">
                   {slide.title.substring(0, 15)}...
                </div>
                <button 
                  className="adv-strip-del"
                  onClick={(e) => { e.stopPropagation(); handleDeleteSlide(idx); }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button className="adv-add-slide-btn" onClick={handleAddSlide}>
              <Plus size={20} />
            </button>
          </div>
        </main>

        {/* Right Properties Panel */}
        <aside className="adv-properties-panel">
          <div className="adv-prop-header">
            <h3>Properties</h3>
          </div>
          <div className="adv-prop-body">
            {selectedElement ? (
               <div className="adv-prop-section">
                 <label>Element Setup</label>
                 <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.9rem' }}>
                   Editing <b>{selectedElement}</b>
                 </div>
                 
                 <label style={{ marginTop: '1.5rem' }}>Animations</label>
                 <select className="adv-select-full">
                   <option>None</option>
                   <option>Fade In</option>
                   <option>Slide Up</option>
                   <option>Pop</option>
                 </select>
                 
                 <label style={{ marginTop: '1.5rem' }}>Opacity</label>
                 <input type="range" min="0" max="100" defaultValue="100" style={{ width: '100%' }} />
               </div>
            ) : (
               <div className="adv-prop-section" style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', marginTop: '2rem' }}>
                 Select an element on the canvas to edit properties.
               </div>
            )}
            
            <div className="adv-prop-section" style={{ marginTop: 'auto', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1.5rem' }}>
              <label>Speaker Notes</label>
              <textarea 
                className="adv-notes-input"
                placeholder="Add speaker notes here..."
                value={activeSlide.note || ''}
                onChange={(e) => {
                  setPresentation(prev => {
                    const updated = { ...prev };
                    updated.slides[activeSlideIdx].note = e.target.value;
                    return updated;
                  });
                }}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
