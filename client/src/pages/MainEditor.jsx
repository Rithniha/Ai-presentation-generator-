import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getGuestSessionId } from '../services/auth';
import { exportToPptx } from '../services/pptxExporter';
import { TEMPLATES } from '../data/templates';
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
         // Mock fallback if template generator not triggered properly
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

  // Dynamic Google Fonts loading for templates
  useEffect(() => {
    const fontNames = Array.from(new Set(TEMPLATES.map(t => t.font))).filter(Boolean);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${fontNames.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700;800;900`).join('&')}&display=swap`;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

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
      }, 850);
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

  if (loading || !presentation) {
    return (
      <div className="landing-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <span style={{ marginLeft: '1rem', color: 'hsl(var(--text-secondary))' }}>Loading editor workspace...</span>
      </div>
    );
  }

  const activeSlide = presentation.slides[activeSlideIdx] || presentation.slides[0];
  const activeTemplate = TEMPLATES.find(t => t.id === presentation.theme) || TEMPLATES.find(t => t.id === 'classic') || TEMPLATES[0];

  // Helper parser for slide chart contents
  const parseChartContent = (content) => {
    if (!content || content.length < 3 || !content[0]?.startsWith('CHART:')) {
      return null;
    }
    const type = content[0].split(':')[1] || 'bar';
    const chartTitle = content[1] || 'Metrics';
    const rawData = content[2] || '';
    
    const parsed = rawData.split(',').map(item => {
      const [label, val] = item.split(':');
      return {
        label: label?.trim() || 'Label',
        value: parseFloat(val?.trim()) || 0
      };
    }).filter(d => !isNaN(d.value));

    const maxVal = parsed.length > 0 ? Math.max(...parsed.map(d => d.value)) : 100;
    return { type, chartTitle, parsed, maxVal };
  };

  const chartInfo = parseChartContent(activeSlide.content);

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
        <select className="adv-font-select" value={activeTemplate.font} readOnly>
          <option>{activeTemplate.font}</option>
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
        <div className="adv-color-picker" style={{ backgroundColor: activeTemplate.accent }} />
        <div className="adv-divider" />
        <button className="adv-format-btn"><AlignLeft size={16} /></button>
        <button className="adv-format-btn"><AlignCenter size={16} /></button>
        <button className="adv-format-btn"><AlignRight size={16} /></button>
        <div className="adv-divider" />
        <button className="adv-format-btn" title="AI Magic"><Sparkles size={16} color={activeTemplate.accent} /></button>
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
              <div className="adv-theme-grid" style={{ gridTemplateColumns: '1fr', gap: '0.4rem', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                {TEMPLATES.map(t => (
                  <div 
                    key={t.id} 
                    className={`adv-theme-thumb ${presentation.theme === t.id ? 'active' : ''}`} 
                    onClick={() => handleThemeChange(t.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: presentation.theme === t.id ? '2.5px solid #8b5cf6' : '1.5px solid #e2e8f0',
                      background: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#0f172a' }}>{t.name}</span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.bg, border: '1px solid rgba(0,0,0,0.1)' }}></span>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.accent }}></span>
                    </div>
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
            <div 
              className={`slide-frame layout-${activeSlide.layout}`} 
              onClick={() => setSelectedElement('background')}
              style={{
                fontFamily: activeTemplate.font || 'sans-serif',
                background: activeTemplate.bg,
                color: activeTemplate.text,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: activeSlide.layout === 'title' ? 'center' : 'flex-start',
                transition: 'all 0.25s ease'
              }}
            >
              
              {activeSlide.layout !== 'title' && (
                <h2 
                  className={`slide-header ${selectedElement === 'title' ? 'selected' : ''}`}
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={handleTitleBlur}
                  onClick={(e) => { e.stopPropagation(); setSelectedElement('title'); }}
                  style={{
                    color: activeTemplate.accent,
                    fontFamily: activeTemplate.font,
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    marginBottom: '1.5rem',
                    lineHeight: '1.2'
                  }}
                >
                  {activeSlide.title}
                </h2>
              )}

              <div className="slide-content-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {activeSlide.layout === 'title' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', margin: 'auto' }}>
                    <h2 
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={handleTitleBlur}
                      style={{ fontSize: '3.5rem', fontWeight: 900, color: activeTemplate.accent, fontFamily: activeTemplate.font, lineHeight: '1.2' }}
                    >
                      {activeSlide.title}
                    </h2>
                    <p 
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleBulletBlur(0, e.target.innerText)}
                      style={{ fontSize: '1.4rem', color: activeTemplate.text, opacity: 0.75, fontFamily: activeTemplate.font }}
                    >
                      {activeSlide.content[0] || 'Subtitle'}
                    </p>
                  </div>
                )}

                {activeSlide.layout === 'bullets' && (
                  <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '0.5rem' }}>
                    {activeSlide.content.map((bullet, bIdx) => (
                      <li key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.1rem', fontSize: '1.25rem', lineHeight: '1.5' }}>
                        <span style={{ color: activeTemplate.accent, marginTop: '0.15rem', fontSize: '1.3rem' }}>✦</span>
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
                
                {activeSlide.layout === 'stats' && (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {chartInfo ? (
                      /* Live visual interactive SVG chart inside the slide! */
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <h4 style={{ fontSize: '1.1rem', color: activeTemplate.accent, fontWeight: 700, margin: 0 }}>{chartInfo.chartTitle}</h4>
                        
                        {chartInfo.type === 'bar' && (
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '140px', paddingBottom: '10px', borderBottom: `2px solid ${activeTemplate.accent}40`, width: '80%', justifyContent: 'center' }}>
                            {chartInfo.parsed.map((d, i) => {
                              const pctHeight = (d.value / (chartInfo.maxVal || 1)) * 100;
                              return (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45px' }}>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: activeTemplate.accent, marginBottom: '4px' }}>{d.value}</span>
                                  <div style={{ width: '100%', height: `${pctHeight * 1.1}px`, background: activeTemplate.accent, borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                                  <span style={{ fontSize: '0.7rem', color: activeTemplate.text, opacity: 0.7, marginTop: '6px', whiteSpace: 'nowrap' }}>{d.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {chartInfo.type === 'line' && (
                          <svg width="80%" height="130" viewBox="0 0 400 130" style={{ overflow: 'visible' }}>
                            {(() => {
                              const step = 400 / (chartInfo.parsed.length - 1 || 1);
                              const pts = chartInfo.parsed.map((d, i) => ({
                                x: i * step,
                                y: 110 - (d.value / (chartInfo.maxVal || 1)) * 90,
                                label: d.label,
                                val: d.value
                              }));
                              const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                              return (
                                <>
                                  <path d={pathD} fill="none" stroke={activeTemplate.accent} strokeWidth="3" />
                                  {pts.map((p, i) => (
                                    <g key={i}>
                                      <circle cx={p.x} cy={p.y} r="5" fill={activeTemplate.bg} stroke={activeTemplate.accent} strokeWidth="3" />
                                      <text x={p.x} y={p.y - 12} textAnchor="middle" fill={activeTemplate.accent} fontSize="9.5" fontWeight="bold">{p.val}</text>
                                      <text x={p.x} y="130" textAnchor="middle" fill={activeTemplate.text} opacity="0.7" fontSize="9">{p.label}</text>
                                    </g>
                                  ))}
                                </>
                              );
                            })()}
                          </svg>
                        )}

                        {chartInfo.type === 'area' && (
                          <svg width="80%" height="130" viewBox="0 0 400 130" style={{ overflow: 'visible' }}>
                            <defs>
                              <linearGradient id={`area-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={activeTemplate.accent} stopOpacity="0.45" />
                                <stop offset="100%" stopColor={activeTemplate.accent} stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            {(() => {
                              const step = 400 / (chartInfo.parsed.length - 1 || 1);
                              const pts = chartInfo.parsed.map((d, i) => ({
                                x: i * step,
                                y: 110 - (d.value / (chartInfo.maxVal || 1)) * 90,
                                label: d.label,
                                val: d.value
                              }));
                              const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                              const fillD = `${pathD} L ${pts[pts.length-1].x} 110 L ${pts[0].x} 110 Z`;
                              return (
                                <>
                                  <path d={fillD} fill={`url(#area-grad-${id})`} />
                                  <path d={pathD} fill="none" stroke={activeTemplate.accent} strokeWidth="3" />
                                  {pts.map((p, i) => (
                                    <g key={i}>
                                      <circle cx={p.x} cy={p.y} r="5" fill={activeTemplate.bg} stroke={activeTemplate.accent} strokeWidth="3" />
                                      <text x={p.x} y={p.y - 12} textAnchor="middle" fill={activeTemplate.accent} fontSize="9.5" fontWeight="bold">{p.val}</text>
                                      <text x={p.x} y="130" textAnchor="middle" fill={activeTemplate.text} opacity="0.7" fontSize="9">{p.label}</text>
                                    </g>
                                  ))}
                                </>
                              );
                            })()}
                          </svg>
                        )}
                      </div>
                    ) : (
                      /* Standard statistics callout */
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', width: '90%' }}>
                        <div style={{ fontSize: '6rem', fontWeight: 900, color: activeTemplate.accent, lineHeight: '1', fontFamily: activeTemplate.font }}>
                          {activeSlide.content[0]}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: activeTemplate.text }}>
                            {activeSlide.content[1]}
                          </div>
                          {activeSlide.content[2] && (
                            <div style={{ fontSize: '1.1rem', color: activeTemplate.text, opacity: 0.65 }}>
                              {activeSlide.content[2]}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSlide.layout === 'columns' && (
                  <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', flex: 1, alignItems: 'center' }}>
                    {activeSlide.content.map((colText, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          flex: 1, 
                          padding: '1.25rem', 
                          borderRadius: '10px', 
                          background: activeTemplate.card || 'rgba(255,255,255,0.06)', 
                          border: `1px solid ${activeTemplate.accent}25`,
                          minHeight: '160px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ fontWeight: 800, color: activeTemplate.accent, fontSize: '1.1rem' }}>
                          0{idx + 1}
                        </div>
                        <div
                          contentEditable="true"
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleBulletBlur(idx, e.target.innerText)}
                          style={{ fontSize: '1rem', lineHeight: '1.5', outline: 'none' }}
                        >
                          {colText}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSlide.layout === 'timeline' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                    {/* Connecting line */}
                    <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '3px', background: activeTemplate.accent, opacity: 0.3 }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {activeSlide.content.map((msText, idx) => (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 0.5rem', position: 'relative' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: activeTemplate.bg, border: `3.5px solid ${activeTemplate.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, marginBottom: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: activeTemplate.accent }}>{idx + 1}</span>
                          </div>
                          
                          <div 
                            contentEditable="true"
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleBulletBlur(idx, e.target.innerText)}
                            style={{ fontSize: '0.95rem', fontWeight: 500, outline: 'none', lineHeight: '1.4' }}
                          >
                            {msText}
                          </div>
                        </div>
                      ))}
                    </div>
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
