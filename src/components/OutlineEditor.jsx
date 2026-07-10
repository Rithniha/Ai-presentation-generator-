import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Download, 
  Play, 
  RefreshCw, 
  Palette, 
  Check, 
  Sparkles, 
  Layout, 
  PlusCircle, 
  X,
  Share2
} from 'lucide-react';

const THEMES = [
  {
    id: "sleek-dark",
    name: "Sleek Dark",
    bg: "#0b0c10",
    text: "#f3f4f6",
    accent: "#8b5cf6",
    subAccent: "#d946ef",
    swatches: ["#0b0c10", "#8b5cf6", "#d946ef", "#f3f4f6"]
  },
  {
    id: "academic-teal",
    name: "Academic Teal",
    bg: "#0f172a",
    text: "#f5f5f4",
    accent: "#2dd4bf",
    subAccent: "#115e59",
    swatches: ["#0f172a", "#115e59", "#2dd4bf", "#f5f5f4"]
  },
  {
    id: "pastel-dream",
    name: "Pastel Dream",
    bg: "#faf5ff",
    text: "#1e1b4b",
    accent: "#a78bfa",
    subAccent: "#fbcfe8",
    swatches: ["#fef08a", "#fbcfe8", "#f0fdf4", "#312e81"]
  },
  {
    id: "neon-sunset",
    name: "Neon Sunset",
    bg: "#110b29",
    text: "#ffffff",
    accent: "#fb923c",
    subAccent: "#f43f5e",
    swatches: ["#1e1b4b", "#f43f5e", "#fb923c", "#ffffff"]
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    bg: "#ffffff",
    text: "#1e293b",
    accent: "#3b82f6",
    subAccent: "#1e3a8a",
    swatches: ["#ffffff", "#1e3a8a", "#3b82f6", "#1e293b"]
  }
];

export default function OutlineEditor({ initialParams, onBackToNew }) {
  const [slides, setSlides] = useState([]);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [activeTheme, setActiveTheme] = useState(initialParams.theme || THEMES[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);

  // Generate mock slides based on prompt parameters
  useEffect(() => {
    const promptText = initialParams.prompt || "Workspace Project Presentation";
    const slideCount = initialParams.slideCount || 10;
    
    // Generate intelligent-looking slide outlines
    const generated = [];
    
    // 1. Introduction/Title Slide
    generated.push({
      id: "slide-1",
      title: "Title: " + (promptText.length > 50 ? promptText.slice(0, 50) + "..." : promptText),
      type: "title",
      bullets: [
        "Subtitle: Generated with Antigravity AI",
        "Target Audience: " + (initialParams.audience || "Executive Board"),
        "Presented Tone: " + (initialParams.tone || "Professional")
      ]
    });

    // 2. Executive Summary / Problem
    generated.push({
      id: "slide-2",
      title: "Executive Summary & Problem Statement",
      type: "problem",
      bullets: [
        "Core conflict or inefficiency identified in the current workflow.",
        "Key bottlenecks impacting overall team productivity.",
        "Resource constraints preventing scalability and organic growth."
      ]
    });

    // 3. The Solution
    generated.push({
      id: "slide-3",
      title: "Proposed Solution & Value Proposition",
      type: "solution",
      bullets: [
        "Unifying technology layers into a single responsive portal.",
        "High-performance operations designed to cut latency by 45%.",
        "Empowering end-users with contextual AI suggestions on-demand."
      ]
    });

    // Generate middle slides based on count
    const middleCount = Math.max(2, slideCount - 4);
    for (let i = 0; i < middleCount; i++) {
      generated.push({
        id: `slide-mid-${i}`,
        title: `Key Objective ${i + 1}: Strategic Execution`,
        type: "content",
        bullets: [
          `Phase ${i + 1} milestone: establishing secure datastores and caching.`,
          "Aligning cross-functional deliverables with weekly standup checks.",
          "Analyzing performance telemetry using modern tracking metrics."
        ]
      });
    }

    // Timeline or Tech Stack
    generated.push({
      id: "slide-timeline",
      title: "Project Timeline & Implementation Roadmap",
      type: "timeline",
      bullets: [
        "Month 1: Environment provisioning & core schema scaffolding.",
        "Month 2: Component integration & automated unit test validation.",
        "Month 3: Phased staging deployment & stress test evaluations."
      ]
    });

    // Conclusion / Call to Action
    generated.push({
      id: "slide-conclusion",
      title: "Future Milestones & Next Steps",
      type: "conclusion",
      bullets: [
        "Submit draft outline for feedback and stakeholder approval.",
        "Allocate budget and reserve critical engineering resources.",
        "Open channels for early feedback loops."
      ]
    });

    // Trim or expand to match slideCount target
    setSlides(generated.slice(0, slideCount));
    setSelectedSlideIndex(0);
    if (initialParams.theme) {
      setActiveTheme(initialParams.theme);
    }
  }, [initialParams]);

  // Handler to edit slide title
  const handleEditTitle = (index, value) => {
    setSlides((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], title: value };
      return copy;
    });
  };

  // Handler to edit bullet point
  const handleEditBullet = (slideIndex, bulletIndex, value) => {
    setSlides((prev) => {
      const copy = [...prev];
      const updatedBullets = [...copy[slideIndex].bullets];
      updatedBullets[bulletIndex] = value;
      copy[slideIndex] = { ...copy[slideIndex], bullets: updatedBullets };
      return copy;
    });
  };

  // Add bullet point
  const handleAddBullet = (slideIndex) => {
    setSlides((prev) => {
      const copy = [...prev];
      copy[slideIndex] = {
        ...copy[slideIndex],
        bullets: [...copy[slideIndex].bullets, "New key point..."]
      };
      return copy;
    });
  };

  // Delete bullet point
  const handleDeleteBullet = (slideIndex, bulletIndex) => {
    setSlides((prev) => {
      const copy = [...prev];
      const updatedBullets = copy[slideIndex].bullets.filter((_, idx) => idx !== bulletIndex);
      copy[slideIndex] = { ...copy[slideIndex], bullets: updatedBullets };
      return copy;
    });
  };

  // Move slide up
  const handleMoveUp = (index) => {
    if (index === 0) return;
    setSlides((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
    setSelectedSlideIndex(index - 1);
  };

  // Move slide down
  const handleMoveDown = (index) => {
    if (index === slides.length - 1) return;
    setSlides((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
    setSelectedSlideIndex(index + 1);
  };

  // Delete slide
  const handleDeleteSlide = (index) => {
    if (slides.length <= 1) return; // Keep at least one slide
    setSlides((prev) => prev.filter((_, idx) => idx !== index));
    setSelectedSlideIndex((prevIdx) => {
      if (prevIdx >= slides.length - 1) return slides.length - 2;
      return prevIdx;
    });
  };

  // Add new slide
  const handleAddSlide = (index) => {
    const newSlide = {
      id: "slide-new-" + Date.now(),
      title: "New Slide: Enter Title Here",
      type: "content",
      bullets: [
        "First key point.",
        "Second key point."
      ]
    };
    setSlides((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, newSlide);
      return copy;
    });
    setSelectedSlideIndex(index + 1);
  };

  // Simulate Export
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
    }, 2000);
  };

  // Selected slide details
  const currentSlide = slides[selectedSlideIndex] || { title: '', bullets: [] };

  return (
    <div className="container" style={{ paddingBottom: '80px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Actions */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '32px', 
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '20px'
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>Workspace</span>
            <span>&rarr;</span>
            <span>Presentation Outline</span>
            <span>&rarr;</span>
            <span style={{ color: 'var(--accent-pink)', fontFamily: 'var(--font-mono)' }}>{initialParams.id || 'pres-9a8b7c'}</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: '#ffffff' }}>
            AI Outline Editor
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onBackToNew}>
            <RefreshCw size={14} /> Start Over
          </button>
          
          <button className="btn btn-secondary" onClick={() => setIsPresenting(true)}>
            <Play size={14} /> Present Slides
          </button>

          <button className="btn btn-primary" onClick={handleExport}>
            <Download size={14} /> Export Deck
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'flex-start' }}>
        
        {/* Left Section: Editable Slides Outline List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Presentation Structure ({slides.length} slides)
            </span>
            <button 
              className="btn btn-secondary" 
              onClick={() => handleAddSlide(slides.length - 1)}
              style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '20px' }}
            >
              <Plus size={12} /> Add Slide at End
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {slides.map((slide, idx) => {
              const isSelected = selectedSlideIndex === idx;
              return (
                <div 
                  key={slide.id}
                  onClick={() => setSelectedSlideIndex(idx)}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-solid)' : 'var(--border-color)',
                    background: isSelected ? 'rgba(139, 92, 246, 0.05)' : 'var(--bg-surface)',
                    boxShadow: isSelected ? '0 8px 24px rgba(139, 92, 246, 0.15)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Card Header controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span 
                        style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          color: '#ffffff',
                          backgroundColor: isSelected ? 'var(--accent-solid)' : 'rgba(255, 255, 255, 0.1)',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        Slide {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        Type: {slide.type}
                      </span>
                    </div>

                    {/* Reordering and deleting toolbar */}
                    <div 
                      style={{ display: 'flex', gap: '6px' }}
                      onClick={(e) => e.stopPropagation()} // Prevent card selection changes
                    >
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleMoveUp(idx)} 
                        disabled={idx === 0}
                        style={{ padding: '4px', borderRadius: '4px' }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === slides.length - 1}
                        style={{ padding: '4px', borderRadius: '4px' }}
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleDeleteSlide(idx)}
                        disabled={slides.length <= 1}
                        style={{ padding: '4px', borderRadius: '4px', color: '#ef4444' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Title editor */}
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => handleEditTitle(idx, e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid transparent',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: 700,
                      width: '100%',
                      outline: 'none',
                      paddingBottom: '4px'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}
                  />

                  {/* Bullets editor */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {slide.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-pink)', flexShrink: 0 }} />
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleEditBullet(idx, bIdx, e.target.value)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid transparent',
                            color: 'var(--text-secondary)',
                            fontSize: '13px',
                            width: '100%',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)'}
                          onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}
                        />
                        <button
                          onClick={() => handleDeleteBullet(idx, bIdx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            opacity: 0,
                            transition: 'opacity 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                          className="bullet-delete-btn"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add slide spacer controls */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <button 
                      className="btn"
                      onClick={() => handleAddBullet(idx)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        padding: 0, 
                        color: 'var(--accent-solid)',
                        fontSize: '12px',
                        fontWeight: 600,
                        gap: '4px'
                      }}
                    >
                      <Plus size={12} /> Add Key Point
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Sticky Visual Mock Preview & Theme Config */}
        <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Selected Slide Visual Mockup
            </span>
          </div>

          {/* Visual Presentation Mock slide card */}
          <div 
            style={{
              aspectRatio: '16/9',
              width: '100%',
              backgroundColor: activeTheme.bg,
              color: activeTheme.text,
              borderRadius: '16px',
              padding: '36px',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textAlign: 'left',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Background design accents */}
            <div 
              style={{
                position: 'absolute',
                top: '-30%',
                right: '-20%',
                width: '60%',
                height: '80%',
                background: `radial-gradient(circle, ${activeTheme.accent}22 0%, transparent 70%)`,
                pointerEvents: 'none'
              }}
            />

            {/* Slide Header */}
            <div>
              <div 
                style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  letterSpacing: '1px',
                  color: activeTheme.subAccent,
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Layout size={10} /> Presentation Outline | Slide {String(selectedSlideIndex + 1).padStart(2, '0')}
              </div>
              <h3 
                style={{ 
                  fontSize: '24px', 
                  fontWeight: 800, 
                  lineHeight: 1.3,
                  letterSpacing: '-0.5px',
                  color: activeTheme.accent === '#ffffff' ? activeTheme.text : activeTheme.accent
                }}
              >
                {currentSlide.title || "Untitled Slide"}
              </h3>
            </div>

            {/* Slide Bullets content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
              {(currentSlide.bullets || []).map((bullet, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div 
                    style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: activeTheme.subAccent, 
                      marginTop: '8px', 
                      flexShrink: 0 
                    }} 
                  />
                  <p style={{ fontSize: '14px', opacity: 0.85, lineHeight: 1.4 }}>
                    {bullet}
                  </p>
                </div>
              ))}
            </div>

            {/* Slide Footer */}
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderTop: `1px solid ${activeTheme.text}1a`, 
                paddingTop: '12px',
                fontSize: '10px',
                opacity: 0.5
              }}
            >
              <span>{initialParams.prompt ? initialParams.prompt.slice(0, 30) + '...' : 'AI Workspace'}</span>
              <span>{selectedSlideIndex + 1} / {slides.length}</span>
            </div>
          </div>

          {/* Inline Theme Palette Changer */}
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={14} style={{ color: 'var(--accent-solid)' }} /> Adjust Theme Palette
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {THEMES.map((t) => {
                const isSelected = activeTheme.id === t.id;
                return (
                  <div 
                    key={t.id}
                    onClick={() => setActiveTheme(t)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      border: '1px solid',
                      borderColor: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: isSelected ? 600 : 400 }}>
                      {t.name}
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {t.swatches.map((color, idx) => (
                        <div key={idx} style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: color, border: '1px solid rgba(255,255,255,0.1)' }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Export loading modal */}
      {isExporting && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 5, 10, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}
        >
          <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', textAlign: 'center' }}>
            <RefreshCw className="spin-slow" size={40} style={{ color: 'var(--accent-solid)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Exporting Presentation...</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Compiling outline layouts and generating file bundles.</p>
          </div>
        </div>
      )}

      {/* Export Success Modal */}
      {exportSuccess && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 5, 10, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}
        >
          <div className="glass-panel" style={{ padding: '40px', maxWidth: '450px', textAlign: 'center', position: 'relative' }}>
            <button 
              onClick={() => setExportSuccess(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={16} />
            </button>
            <div 
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#10b981',
                margin: '0 auto 20px'
              }}
            >
              <Check size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px', color: '#ffffff' }}>Export Completed!</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              Your presentation outline has been successfully compiled into a professional presentation template format.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => setExportSuccess(false)}>
                Got it
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  alert("Shared link copied to clipboard!");
                  setExportSuccess(false);
                }}
              >
                <Share2 size={14} /> Share Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Present Mode Modal */}
      {isPresenting && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: activeTheme.bg,
            color: activeTheme.text,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 200,
            padding: '40px',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Close Present mode */}
          <button
            onClick={() => setIsPresenting(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              color: activeTheme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>

          {/* Presentation Content Box */}
          <div style={{ maxWidth: '900px', width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: activeTheme.subAccent, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '2px' }}>
                Slide {selectedSlideIndex + 1} of {slides.length}
              </div>
              <h2 style={{ fontSize: '42px', fontWeight: 800, color: activeTheme.accent === '#ffffff' ? activeTheme.text : activeTheme.accent }}>
                {currentSlide.title}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', margin: '40px 0' }}>
              {(currentSlide.bullets || []).map((bullet, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activeTheme.subAccent, marginTop: '12px' }} />
                  <p style={{ fontSize: '20px', opacity: 0.9, lineHeight: 1.5 }}>
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Present controls */}
          <div style={{ position: 'absolute', bottom: '40px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setSelectedSlideIndex((p) => Math.max(0, p - 1))}
              disabled={selectedSlideIndex === 0}
              style={{ color: activeTheme.text, borderColor: `${activeTheme.text}33` }}
            >
              Previous
            </button>
            <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
              {selectedSlideIndex + 1} / {slides.length}
            </span>
            <button 
              className="btn btn-secondary" 
              onClick={() => setSelectedSlideIndex((p) => Math.min(slides.length - 1, p + 1))}
              disabled={selectedSlideIndex === slides.length - 1}
              style={{ color: activeTheme.text, borderColor: `${activeTheme.text}33` }}
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
