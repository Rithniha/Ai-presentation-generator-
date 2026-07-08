import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getGuestSessionId } from '../services/auth';
import { 
  Sparkles, Trash2, Plus, ArrowRight, CornerDownRight, 
  ChevronLeft, ChevronRight, GripVertical, FileText, 
  Layout, List, Columns, TrendingUp, Clock, Check
} from 'lucide-react';
import '../styles/OutlineEditor.css';

// Helper to convert DB content list array to structured bullet state object list
const parseBullets = (contentArray) => {
  if (!contentArray || !Array.isArray(contentArray)) return [];
  return contentArray.map((bulletStr, index) => {
    const match = bulletStr.match(/^ */);
    const leadingSpaces = match ? match[0].length : 0;
    const indent = Math.min(2, Math.floor(leadingSpaces / 2));
    return {
      id: `bullet-${Date.now()}-${index}-${Math.random()}`,
      text: bulletStr.trim(),
      indent
    };
  });
};

// Helper to serialize bullet state objects back to DB space-prefixed strings
const serializeBullets = (bullets) => {
  if (!bullets || !Array.isArray(bullets)) return [];
  return bullets.map(b => {
    const spaces = '  '.repeat(b.indent);
    return spaces + b.text;
  });
};

const LAYOUT_TEMPLATES = [
  { id: 'title', title: 'Title Slide', desc: 'Main title and subtitle layout', category: 'basic', icon: Layout, bestFor: 'Intro & agenda' },
  { id: 'bullets', title: 'Standard Bullet List', desc: 'Vertical list with custom bullet nodes', category: 'basic', icon: List, bestFor: 'Key points' },
  { id: 'columns', title: '3-Column Grid', desc: 'Three side-by-side content containers', category: 'business', icon: Columns, bestFor: 'Comparisons & pillars' },
  { id: 'stats', title: 'Large Stats Display', desc: 'Callout text and statistics numbers', category: 'data', icon: TrendingUp, bestFor: 'Performance metrics' },
  { id: 'timeline', title: 'Horizontal Timeline', desc: 'Process phases along a horizontal axis', category: 'startup', icon: Clock, bestFor: 'Milestones & roadmaps' }
];

export default function OutlineEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const guestSessionId = getGuestSessionId();

  const [title, setTitle] = useState('');
  const [slides, setSlides] = useState([]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Drag and Drop
  const [draggedBullet, setDraggedBullet] = useState(null); // { slideIdx, bulletIdx }

  // Layout Library
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Live AI Terminal
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [terminalStats, setTerminalStats] = useState({ cpu: 12, tokens: 0 });
  const terminalEndRef = useRef(null);

  // Loading Optimizer Overlay
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [completedStages, setCompletedStages] = useState([]); // indices of completed stages
  const [activeStage, setActiveStage] = useState(0);

  // Fetch outline on mount
  useEffect(() => {
    const loadOutline = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/presentations/${id}?guestSessionId=${guestSessionId}`);
        const deck = response.data;
        setTitle(deck.title);
        
        const enriched = (deck.slides || []).map(s => ({
          ...s,
          bullets: parseBullets(s.content)
        }));
        setSlides(enriched);

        // Compute total word tokens
        const wordCount = enriched.reduce((sum, s) => {
          const bulletCount = s.bullets.reduce((bSum, b) => bSum + b.text.split(' ').length, 0);
          return sum + s.title.split(' ').length + bulletCount;
        }, 0);
        setTerminalStats({ cpu: 8, tokens: wordCount * 4 });

        setTerminalLogs([
          { tag: 'info', text: 'Cognitive parser cluster initialized.' },
          { tag: 'success', text: 'Gemini semantic text link verified (latency: 18ms).' },
          { tag: 'info', text: `Loaded presentation outline model for "${deck.title}".` },
          { tag: 'predict', text: 'Select or drag nodes. AI layout analyzer listening...' }
        ]);
      } catch (err) {
        alert('Failed to load presentation: ' + err.message);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadOutline();
  }, [id]);

  // Terminal autoscroll helper
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Real-time AI prediction log output on slide changes/typing
  useEffect(() => {
    if (loading || !slides || slides.length === 0) return;
    const activeSlide = slides[activeSlideIdx];
    if (!activeSlide) return;

    // Word count calculation
    const activeWords = activeSlide.title.split(' ').length + 
      activeSlide.bullets.reduce((sum, b) => sum + b.text.split(' ').length, 0);

    setTerminalStats(prev => ({
      cpu: Math.floor(Math.random() * 25) + 15,
      tokens: prev.tokens
    }));

    // Generate simulated AI log events
    const logsToAppend = [
      { tag: 'info', text: `Analyzing slide node #${activeSlideIdx + 1} ("${activeSlide.title || 'Untitled Outline'}")` },
      { tag: 'info', text: `Structural components: ${activeSlide.bullets.length} nodes, ${activeWords} semantic tokens.` }
    ];

    // Predict Layout
    let predictedLayout = 'bullets';
    if (activeSlideIdx === 0) {
      predictedLayout = 'title';
    } else {
      const hasStats = activeSlide.bullets.some(b => /%|\d+\s*(?:percent|million|billion|usd|eur|gbp)/i.test(b.text));
      const hasTimeline = activeSlide.bullets.some(b => /phase|step|milestone|roadmap|year|stage|quarter/i.test(b.text));
      
      if (hasStats) {
        predictedLayout = 'stats';
      } else if (hasTimeline) {
        predictedLayout = 'timeline';
      } else if (activeSlide.bullets.length === 3) {
        predictedLayout = 'columns';
      }
    }

    logsToAppend.push({
      tag: 'predict',
      text: `[LAYOUT FIT PREDICTION] Optimal layout suggested: "${predictedLayout.toUpperCase()}"`
    });

    // Topic expansion suggest text
    let suggestedExpansion = `Detail visual metrics or strategic directions supporting "${activeSlide.title || 'this point'}"`;
    if (/intro/i.test(activeSlide.title)) {
      suggestedExpansion = 'Provide high-level structural goals, focus groups, and session agenda.';
    } else if (/problem/i.test(activeSlide.title)) {
      suggestedExpansion = 'Add detailed bullet illustrating customer friction metrics and scale of impact.';
    } else if (/solution|feature/i.test(activeSlide.title)) {
      suggestedExpansion = 'Detail cloud deployment speeds, redundancy loops, and UI response metrics.';
    }

    logsToAppend.push({
      tag: 'success',
      text: `[EXPANSION RECOMMENDATION] Suggested item: "${suggestedExpansion}"`
    });

    setTerminalLogs(prev => {
      const systems = prev.filter(l => l.tag === 'info' && l.text.startsWith('SYSTEM:'));
      return [...systems, ...logsToAppend].slice(-40);
    });

  }, [activeSlideIdx, slides ? slides[activeSlideIdx]?.title : null, slides ? slides[activeSlideIdx]?.bullets?.length : null]);

  // Edits Handlers
  const handleTitleChange = (slideIdx, value) => {
    setSlides(prev => {
      const updated = [...prev];
      updated[slideIdx].title = value;
      return updated;
    });
  };

  const handleBulletChange = (slideIdx, bulletIdx, value) => {
    setSlides(prev => {
      const updated = [...prev];
      const slide = { ...updated[slideIdx] };
      const bullets = [...(slide.bullets || [])];
      bullets[bulletIdx] = { ...bullets[bulletIdx], text: value };
      slide.bullets = bullets;
      updated[slideIdx] = slide;
      return updated;
    });
  };

  const indentBullet = (slideIdx, bulletIdx) => {
    setSlides(prev => {
      const updated = [...prev];
      const slide = { ...updated[slideIdx] };
      const bullets = [...(slide.bullets || [])];
      bullets[bulletIdx] = { ...bullets[bulletIdx], indent: Math.min(2, bullets[bulletIdx].indent + 1) };
      slide.bullets = bullets;
      updated[slideIdx] = slide;
      return updated;
    });
  };

  const outdentBullet = (slideIdx, bulletIdx) => {
    setSlides(prev => {
      const updated = [...prev];
      const slide = { ...updated[slideIdx] };
      const bullets = [...(slide.bullets || [])];
      bullets[bulletIdx] = { ...bullets[bulletIdx], indent: Math.max(0, bullets[bulletIdx].indent - 1) };
      slide.bullets = bullets;
      updated[slideIdx] = slide;
      return updated;
    });
  };

  const addBullet = (slideIdx, afterBulletIdx = -1) => {
    setSlides(prev => {
      const updated = [...prev];
      const slide = { ...updated[slideIdx] };
      const bullets = [...(slide.bullets || [])];
      const newB = {
        id: `bullet-${Date.now()}-${Math.random()}`,
        text: '',
        indent: afterBulletIdx >= 0 ? bullets[afterBulletIdx].indent : 0
      };
      if (afterBulletIdx >= 0) {
        bullets.splice(afterBulletIdx + 1, 0, newB);
      } else {
        bullets.push(newB);
      }
      slide.bullets = bullets;
      updated[slideIdx] = slide;
      return updated;
    });

    setTimeout(() => {
      const inputEl = document.getElementById(`bullet-input-${slideIdx}-${afterBulletIdx + 1}`);
      if (inputEl) inputEl.focus();
    }, 50);
  };

  const removeBullet = (slideIdx, bulletIdx) => {
    setSlides(prev => {
      const updated = [...prev];
      const slide = { ...updated[slideIdx] };
      const bullets = [...(slide.bullets || [])];
      bullets.splice(bulletIdx, 1);
      slide.bullets = bullets;
      updated[slideIdx] = slide;
      return updated;
    });
  };

  const addSlide = () => {
    const newS = {
      title: 'New Slide Node',
      bullets: parseBullets(['Key insight bullet node.']),
      layout: 'bullets',
      icon: 'Presentation',
      note: 'Speaker detail prompts.'
    };
    setSlides(prev => [...prev, newS]);
    setActiveSlideIdx(slides.length);
  };

  const deleteSlide = (slideIdx) => {
    if (slides.length <= 1) {
      alert('Decks require at least 1 slide.');
      return;
    }
    setSlides(prev => prev.filter((_, idx) => idx !== slideIdx));
    setActiveSlideIdx(0);
  };

  // Keyboard Navigation inside bullets input fields
  const handleKeyDown = (e, slideIdx, bulletIdx) => {
    const slide = slides[slideIdx];
    const bullets = slide.bullets || [];

    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        outdentBullet(slideIdx, bulletIdx);
      } else {
        indentBullet(slideIdx, bulletIdx);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      addBullet(slideIdx, bulletIdx);
    } else if (e.key === 'Backspace' && bullets[bulletIdx]?.text === '') {
      e.preventDefault();
      removeBullet(slideIdx, bulletIdx);
      setTimeout(() => {
        const prevInput = document.getElementById(`bullet-input-${slideIdx}-${bulletIdx - 1}`);
        if (prevInput) {
          prevInput.focus();
        } else {
          const titleInput = document.getElementById(`slide-title-input-${slideIdx}`);
          if (titleInput) titleInput.focus();
        }
      }, 50);
    }
  };

  // Drag and Drop
  const handleDragStart = (e, slideIdx, bulletIdx) => {
    setDraggedBullet({ slideIdx, bulletIdx });
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedBullet(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSlideIdx, targetBulletIdx) => {
    e.preventDefault();
    if (!draggedBullet) return;

    const { slideIdx: sourceSlideIdx, bulletIdx: sourceBulletIdx } = draggedBullet;

    setSlides(prev => {
      const updated = [...prev];
      const sourceSlide = { ...updated[sourceSlideIdx] };
      const sourceBullets = [...(sourceSlide.bullets || [])];
      const [moved] = sourceBullets.splice(sourceBulletIdx, 1);

      if (sourceSlideIdx === targetSlideIdx) {
        sourceBullets.splice(targetBulletIdx, 0, moved);
        sourceSlide.bullets = sourceBullets;
        updated[sourceSlideIdx] = sourceSlide;
      } else {
        const targetSlide = { ...updated[targetSlideIdx] };
        const targetBullets = [...(targetSlide.bullets || [])];
        targetBullets.splice(targetBulletIdx, 0, moved);
        
        targetSlide.bullets = targetBullets;
        sourceSlide.bullets = sourceBullets;
        
        updated[sourceSlideIdx] = sourceSlide;
        updated[targetSlideIdx] = targetSlide;
      }
      return updated;
    });

    setDraggedBullet(null);
  };

  // Filtering Templates by Library Tab
  const filteredTemplates = LAYOUT_TEMPLATES.filter(t => 
    selectedCategory === 'all' || t.category === selectedCategory
  );

  // Apply layout template to currently active slide
  const applyLayoutTemplate = (layoutId) => {
    setSlides(prev => {
      const updated = [...prev];
      updated[activeSlideIdx].layout = layoutId;
      return updated;
    });
    setTerminalLogs(prev => [
      ...prev,
      { tag: 'success', text: `[LAYOUT COMMAND] User applied "${layoutId.toUpperCase()}" design template to Slide ${activeSlideIdx + 1}.` }
    ]);
  };

  // Trigger loading screen animation sequence
  const startLayoutSynthesis = () => {
    setIsOptimizing(true);
    setLoadingPercent(0);
    setCompletedStages([]);
    setActiveStage(0);

    // Percentage timer
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setLoadingPercent(progress);
      
      // Complete stages progressively based on percentage
      if (progress === 20) {
        setCompletedStages(prev => [...prev, 0]);
        setActiveStage(1);
      } else if (progress === 40) {
        setCompletedStages(prev => [...prev, 1]);
        setActiveStage(2);
      } else if (progress === 60) {
        setCompletedStages(prev => [...prev, 2]);
        setActiveStage(3);
      } else if (progress === 80) {
        setCompletedStages(prev => [...prev, 3]);
        setActiveStage(4);
      } else if (progress === 100) {
        setCompletedStages(prev => [...prev, 4]);
        clearInterval(interval);
        
        // Make preview grid visible at 100%
        setTimeout(() => {
          const previewGrid = document.getElementById('layout-preview-grid');
          const btnDone = document.getElementById('btn-loading-done');
          if (previewGrid) previewGrid.classList.add('visible');
          if (btnDone) btnDone.style.display = 'block';
        }, 150);
      }
    }, 40); // 40ms * 100 = 4 seconds total duration
  };

  // Complete layout optimization and transition
  const handleDone = async () => {
    setSaving(true);
    try {
      const serialized = slides.map(s => ({
        title: s.title,
        layout: s.layout,
        icon: s.icon || 'Presentation',
        note: s.note || '',
        content: serializeBullets(s.bullets)
      }));

      await api.put(`/api/presentations/${id}`, {
        title,
        slides: serialized,
        guestSessionId
      });

      // Redirect to main editor
      navigate(`/editor/${id}`);
    } catch (err) {
      alert('Failed to save layout coordinates: ' + err.message);
      setIsOptimizing(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="landing-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#080b13' }}>
        <div className="spinner"></div>
        <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>Parsing outline workspace...</span>
      </div>
    );
  }

  return (
    <div className="outline-workspace">
      
      {/* Header */}
      <header className="outline-workspace-header">
        <div className="header-left">
          <div className="logo-badge">AI PRESENTATION GENERATOR</div>
          <div className="breadcrumb">
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Projects</span>
            <span className="breadcrumb-separator">/</span>
            <span className="active">Outline Editor (/editor/:id/outline)</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-generate" id="btn-generate-layouts" onClick={startLayoutSynthesis}>
            <svg viewBox="0 0 24 24">
              <path
                d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-3.3l-.85-.6C8.25 11.3 7 9.8 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 .8-.9 2.3-1.15 3.1z" />
            </svg>
            Generate Design Layouts
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="main-container">

        {/* Left Pane: Tree View Outline Editor */}
        <section className="pane-left" aria-label="Slide Outline Editor">
          <div className="left-pane-header">
            <h1 className="left-pane-title">Structuring Content</h1>
            <button className="btn-add-slide" id="btn-add-slide" onClick={addSlide}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Slide
            </button>
          </div>

          {/* Outline Slides Tree Container */}
          <div className="outline-tree" id="outline-tree">
            {slides.map((slide, sIdx) => (
              <div 
                key={sIdx} 
                className={`slide-card ${activeSlideIdx === sIdx ? 'active' : ''}`}
                onClick={() => setActiveSlideIdx(sIdx)}
              >
                <div className="slide-card-header-bar">
                  <div className="drag-handle">
                    <GripVertical size={16} />
                  </div>
                  <span className="slide-number">SLIDE {sIdx + 1}</span>
                  <div className="slide-layout-badge">
                    {slide.layout.toUpperCase()}
                  </div>
                  <input 
                    id={`slide-title-input-${sIdx}`}
                    type="text" 
                    className="slide-title-input" 
                    value={slide.title} 
                    onChange={(e) => handleTitleChange(sIdx, e.target.value)} 
                    placeholder="Enter Slide Title..."
                  />
                  <button className="btn-delete" title="Delete Slide" onClick={(e) => { e.stopPropagation(); deleteSlide(sIdx); }}>
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Bullets List */}
                <div className="bullets-list">
                  {(slide.bullets || []).map((bullet, bIdx) => (
                    <div 
                      key={bullet.id} 
                      className={`bullet-node bullet-indent-${bullet.indent}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, sIdx, bIdx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, sIdx, bIdx)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="bullet-dot"></div>
                      <input 
                        id={`bullet-input-${sIdx}-${bIdx}`}
                        type="text" 
                        className="bullet-input" 
                        value={bullet.text} 
                        onChange={(e) => handleBulletChange(sIdx, bIdx, e.target.value)} 
                        onKeyDown={(e) => handleKeyDown(e, sIdx, bIdx)}
                        placeholder="Type bullet content..."
                      />
                      
                      {/* Bullet Actions Overlay */}
                      <div className="bullet-actions">
                        <button className="btn-indent-adjust" title="Outdent" onClick={() => outdentBullet(sIdx, bIdx)} disabled={bullet.indent === 0}>
                          <ChevronLeft size={14} />
                        </button>
                        <button className="btn-indent-adjust" title="Indent" onClick={() => indentBullet(sIdx, bIdx)} disabled={bullet.indent === 2}>
                          <ChevronRight size={14} />
                        </button>
                        <button className="btn-indent-adjust" style={{ color: '#ff4a4a' }} title="Delete Bullet" onClick={() => removeBullet(sIdx, bIdx)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="add-bullet-row">
                  <button className="btn-add-bullet" onClick={() => addBullet(sIdx)}>
                    <Plus size={14} />
                    Add Bullet
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Layout Library Panel */}
          <div className="layout-library-container">
            <div className="library-header">
              <div className="library-header-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="9"></rect>
                  <rect x="14" y="3" width="7" height="5"></rect>
                  <rect x="14" y="12" width="7" height="9"></rect>
                  <rect x="3" y="16" width="7" height="5"></rect>
                </svg>
                LAYOUT TEMPLATES
              </div>
              <div className="library-header-sub">Select layout for current active slide (SLIDE {activeSlideIdx + 1})</div>
            </div>
            
            <div className="library-tabs">
              {['all', 'basic', 'image', 'data', 'business', 'startup'].map(cat => (
                <button 
                  key={cat}
                  className={`lib-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="library-grid" id="library-grid">
              {filteredTemplates.map(t => {
                const IconComp = t.icon;
                const isActive = slides[activeSlideIdx]?.layout === t.id;
                
                return (
                  <div 
                    key={t.id} 
                    className={`layout-card ${isActive ? 'active' : ''}`}
                    onClick={() => applyLayoutTemplate(t.id)}
                  >
                    <div className="layout-card-header">
                      <span className="layout-card-title">
                        <IconComp size={14} style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)' }} />
                        {t.title}
                      </span>
                      <span className="layout-card-badge">{t.category.toUpperCase()}</span>
                    </div>
                    <p className="layout-card-desc">{t.desc}</p>
                    <div className="layout-card-footer">
                      <span className="layout-card-bestfor">Best for: {t.bestFor}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Pane: Live AI Terminal */}
        <section className="pane-right" aria-label="AI Design Prediction Terminal">
          <div className="terminal-header">
            <div className="terminal-title-container">
              <div className="terminal-dot"></div>
              <span className="terminal-title">LIVE AI CO-PILOT TERMINAL</span>
            </div>
            <div className="terminal-stats">
              <span>CPU: <span>{terminalStats.cpu}%</span></span>
              <span>TOKENS: <span>{terminalStats.tokens}</span></span>
            </div>
          </div>
          
          <div className="terminal-body" id="terminal-body">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="term-line">
                <span className={`term-tag ${log.tag}`}>&gt; </span>
                {log.text}
              </div>
            ))}
            <div className="term-cursor"></div>
            <div ref={terminalEndRef}></div>
          </div>
        </section>

      </main>

      {/* Layout Engine Loading Screen Overlay */}
      <div className={`loading-overlay ${isOptimizing ? 'visible' : ''}`} id="loading-overlay">
        <div className="loading-container">

          {/* Ring Loader */}
          <div className="ring-loader">
            <div className="ring-loader-circle"></div>
            <div className="ring-loader-inner"></div>
            <div className="ring-percent" id="loading-percent">{loadingPercent}%</div>
          </div>

          <h2 className="loading-title">Synthesizing Design Layouts</h2>
          <p className="loading-subtitle">Applying design tokens, grids, and visual balance metrics to your outline structure...</p>

          {/* Multi-stage logs list */}
          <div className="loading-steps" id="loading-steps">
            <div className={`loading-step ${completedStages.includes(0) ? 'completed' : activeStage === 0 ? 'active' : ''}`} id="step-0">
              <div className="loading-step-icon">{completedStages.includes(0) ? '✓' : '○'}</div>
              <div className="loading-step-text">Parsing outline hierarchy and semantic relationships...</div>
            </div>
            <div className={`loading-step ${completedStages.includes(1) ? 'completed' : activeStage === 1 ? 'active' : ''}`} id="step-1">
              <div className="loading-step-icon">{completedStages.includes(1) ? '✓' : '○'}</div>
              <div className="loading-step-text">Determining ideal layouts for Slide text nodes...</div>
            </div>
            <div className={`loading-step ${completedStages.includes(2) ? 'completed' : activeStage === 2 ? 'active' : ''}`} id="step-2">
              <div className="loading-step-icon">{completedStages.includes(2) ? '✓' : '○'}</div>
              <div className="loading-step-text">Executing layout predictions & generating visual assets...</div>
            </div>
            <div className={`loading-step ${completedStages.includes(3) ? 'completed' : activeStage === 3 ? 'active' : ''}`} id="step-3">
              <div className="loading-step-icon">{completedStages.includes(3) ? '✓' : '○'}</div>
              <div className="loading-step-text">Synthesizing color palette configurations...</div>
            </div>
            <div className={`loading-step ${completedStages.includes(4) ? 'completed' : activeStage === 4 ? 'active' : ''}`} id="step-4">
              <div className="loading-step-icon">{completedStages.includes(4) ? '✓' : '○'}</div>
              <div className="loading-step-text">Rendering layout mocks for edit view...</div>
            </div>
          </div>

          {/* Generated Layout Preview Cards */}
          <div className="layout-preview-grid" id="layout-preview-grid">
            <div className="preview-card">
              <div className="preview-thumb">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <div className="preview-title">Split-Screen Layout</div>
            </div>
            <div className="preview-card">
              <div className="preview-thumb">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
              </div>
              <div className="preview-title">3-Column Grid</div>
            </div>
            <div className="preview-card">
              <div className="preview-thumb">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="12" cy="12" r="4"></circle>
                </svg>
              </div>
              <div className="preview-title">Hero Accent</div>
            </div>
          </div>

          <button 
            className="btn-done" 
            id="btn-loading-done" 
            style={{ display: 'none' }}
            onClick={handleDone}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Continue to Layout Editor'}
          </button>
        </div>
      </div>
    </div>
  );
}
