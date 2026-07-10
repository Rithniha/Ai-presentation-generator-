import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Volume2, 
  Users, 
  Layers, 
  Palette,
  Check,
  Lightbulb,
  MessageSquareCode
} from 'lucide-react';

const SAMPLE_PROMPTS = [
  {
    title: "Green Energy Seed Pitch",
    text: "A pitch deck for a green energy startup focusing on localized microgrids and solar distribution, looking for a $2M seed round investment."
  },
  {
    title: "AI Product Roadmap",
    text: "Q3 Product Roadmap presentation detailing our expansion into agentic AI assistants, covering timeline, technology stack, and business impact."
  },
  {
    title: "Quantum Physics for Teens",
    text: "An educational presentation designed for high school juniors explaining quantum superposition and entanglement using visual analogies."
  },
  {
    title: "WebGPU Tech Proposal",
    text: "A highly technical proposal for a developer conference detailing how WebGPU improves in-browser 3D rendering speeds by 4x over WebGL."
  }
];

const AUDIENCES = [
  { id: "executives", name: "Executive Board", desc: "Decision makers, investors, high-level summaries", icon: Users },
  { id: "general", name: "General Public", desc: "Clear explanations, engaging visuals, low jargon", icon: Users },
  { id: "students", name: "Students & Learners", desc: "Interactive analogies, educational, pacing-focused", icon: Users },
  { id: "technical", name: "Technical Experts", desc: "Deep architectural details, code examples, data charts", icon: Users }
];

const TONES = [
  { id: "professional", name: "Professional", emoji: "💼" },
  { id: "inspiring", name: "Inspiring", emoji: "🚀" },
  { id: "casual", name: "Casual", emoji: "👋" },
  { id: "persuasive", name: "Persuasive", emoji: "🎯" },
  { id: "academic", name: "Academic", emoji: "🎓" }
];

const DURATIONS = [
  { id: "5min", name: "5 mins (Elevator Pitch)", slides: "5-8 slides" },
  { id: "10min", name: "10 mins (Standard Pitch)", slides: "9-12 slides" },
  { id: "20min", name: "20 mins (Detailed Keynote)", slides: "13-18 slides" },
  { id: "45min", name: "45 mins (Comprehensive Brief)", slides: "19-30 slides" }
];

const THEMES = [
  {
    id: "sleek-dark",
    name: "Sleek Dark",
    desc: "Modern & high-tech look with neon accents.",
    swatches: ["#0b0c10", "#8b5cf6", "#d946ef", "#f3f4f6"],
    bg: "#0b0c10",
    text: "#f3f4f6",
    accent: "#8b5cf6",
    subAccent: "#d946ef",
    previewStyle: {
      backgroundColor: '#0b0c10',
      color: '#f3f4f6'
    }
  },
  {
    id: "academic-teal",
    name: "Academic Teal",
    desc: "Clean teal and sand palette for educational topics.",
    swatches: ["#0f172a", "#115e59", "#2dd4bf", "#f5f5f4"],
    bg: "#0f172a",
    text: "#f5f5f4",
    accent: "#2dd4bf",
    subAccent: "#115e59",
    previewStyle: {
      backgroundColor: '#0f172a',
      color: '#f5f5f4'
    }
  },
  {
    id: "pastel-dream",
    name: "Pastel Dream",
    desc: "Warm lavender and peach tones for a friendly vibe.",
    swatches: ["#fef08a", "#fbcfe8", "#f0fdf4", "#312e81"],
    bg: "#faf5ff",
    text: "#1e1b4b",
    accent: "#a78bfa",
    subAccent: "#fbcfe8",
    previewStyle: {
      backgroundColor: '#fbf7ff',
      color: '#1e1b4b'
    }
  },
  {
    id: "neon-sunset",
    name: "Neon Sunset",
    desc: "Vibrant sunset gradients for high energy.",
    swatches: ["#1e1b4b", "#f43f5e", "#fb923c", "#ffffff"],
    bg: "#110b29",
    text: "#ffffff",
    accent: "#fb923c",
    subAccent: "#f43f5e",
    previewStyle: {
      backgroundColor: '#110b29',
      color: '#ffffff'
    }
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    desc: "Trustworthy professional blue and slate theme.",
    swatches: ["#ffffff", "#1e3a8a", "#3b82f6", "#1e293b"],
    bg: "#ffffff",
    text: "#1e293b",
    accent: "#3b82f6",
    subAccent: "#1e3a8a",
    previewStyle: {
      backgroundColor: '#ffffff',
      color: '#1e293b'
    }
  }
];

export default function SetupWizard({ onGenerate }) {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [audience, setAudience] = useState('executives');
  const [tone, setTone] = useState('professional');
  const [duration, setDuration] = useState('10min');
  const [slideCount, setSlideCount] = useState(12);
  const [theme, setTheme] = useState('sleek-dark');

  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const selectedThemeObj = THEMES.find(t => t.id === theme);
    onGenerate({
      prompt,
      audience,
      tone,
      duration,
      slideCount,
      theme: selectedThemeObj
    });
  };

  // Helper to prefill prompts
  const selectSamplePrompt = (text) => {
    setPrompt(text);
  };

  return (
    <div 
      className="container" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '60px',
        paddingBottom: '80px',
        minHeight: 'calc(100vh - 80px)'
      }}
    >
      {/* Header Info */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-slide-up">
        <div 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(139, 92, 246, 0.1)', 
            padding: '6px 14px', 
            borderRadius: '20px', 
            border: '1px solid rgba(139, 92, 246, 0.2)',
            color: '#c084fc',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '16px'
          }}
        >
          <Sparkles size={14} /> AI Presentation Workspace
        </div>
        <h1 
          style={{ 
            fontSize: '44px', 
            fontWeight: 800, 
            letterSpacing: '-1.5px', 
            marginBottom: '10px',
            background: 'var(--grad-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Let's design your presentation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Configure target options, visual themes, and presentational details to outline a compelling flow.
        </p>
      </div>

      {/* Progress Indicator Dots */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}
      >
        {[1, 2, 3].map((num) => (
          <div key={num} style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                border: '1px solid',
                transition: 'all 0.3s ease',
                backgroundColor: step === num ? 'var(--accent-solid)' : step > num ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                borderColor: step >= num ? 'var(--accent-solid)' : 'var(--border-color)',
                color: step >= num ? '#ffffff' : 'var(--text-muted)',
                boxShadow: step === num ? '0 0 15px rgba(139, 92, 246, 0.4)' : 'none'
              }}
            >
              {step > num ? <Check size={14} /> : num}
            </div>
            {num < 3 && (
              <div 
                style={{
                  width: '60px',
                  height: '2px',
                  backgroundColor: step > num ? 'var(--accent-solid)' : 'var(--border-color)',
                  marginLeft: '12px',
                  transition: 'all 0.3s ease'
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progressive Glass Modal Box */}
      <div 
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '780px', 
          padding: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Step 1: Prompt Entry */}
        {step === 1 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <MessageSquareCode size={18} style={{ color: '#8b5cf6' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  What is the topic of your presentation?
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Provide a prompt describing your objective, core messages, and structure. Our AI will outline the slide cards.
              </p>
              
              <div className="text-area-container">
                <textarea 
                  className="textarea-custom" 
                  placeholder="Describe your presentation goal here (e.g. 'An investor pitch deck for a SaaS platform automating invoices...')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, 1000))}
                  maxLength={1000}
                />
                <span className="char-counter">{prompt.length} / 1000</span>
              </div>
            </div>

            {/* Sample Prompts Grid */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#c084fc' }}>
                <Lightbulb size={16} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Sample Prompts</span>
              </div>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '12px' 
                }}
              >
                {SAMPLE_PROMPTS.map((sp, idx) => (
                  <div 
                    key={idx}
                    onClick={() => selectSamplePrompt(sp.text)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '12px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }}
                  >
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                      {sp.title}
                    </strong>
                    <span style={{ color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                      {sp.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Target Parameters */}
        {step === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', textAlign: 'left' }}>
            {/* Target Audience */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                1. Target Audience
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {AUDIENCES.map((aud) => {
                  const AudIcon = aud.icon;
                  const isSelected = audience === aud.id;
                  return (
                    <div
                      key={aud.id}
                      onClick={() => setAudience(aud.id)}
                      style={{
                        background: isSelected ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--accent-solid)' : 'var(--border-color)',
                        borderRadius: '10px',
                        padding: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div 
                        style={{ 
                          background: isSelected ? 'var(--accent-solid)' : 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '6px',
                          padding: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}
                      >
                        <AudIcon size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                          {aud.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                          {aud.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tone & Duration Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Tone selection */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  2. Presentation Tone
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {TONES.map((t) => {
                    const isSelected = tone === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className="btn"
                        style={{
                          padding: '8px 12px',
                          fontSize: '12px',
                          borderRadius: '20px',
                          backgroundColor: isSelected ? 'var(--accent-solid)' : 'rgba(255, 255, 255, 0.02)',
                          borderColor: isSelected ? 'var(--accent-solid)' : 'var(--border-color)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>{t.emoji}</span>
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration picker */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  3. Session Duration
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {DURATIONS.map((dur) => {
                    const isSelected = duration === dur.id;
                    return (
                      <div
                        key={dur.id}
                        onClick={() => setDuration(dur.id)}
                        style={{
                          background: isSelected ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--accent-solid)' : 'var(--border-color)',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '12px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{dur.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{dur.slides}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Custom Slide Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  4. Slide Count Target
                </h3>
                <span 
                  style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '15px', 
                    fontWeight: 700, 
                    color: 'var(--accent-pink)',
                    backgroundColor: 'rgba(217, 70, 239, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {slideCount} slides
                </span>
              </div>
              <div className="range-container">
                <input 
                  type="range" 
                  min={5} 
                  max={30} 
                  value={slideCount}
                  onChange={(e) => setSlideCount(parseInt(e.target.value))}
                  className="range-slider"
                  style={{
                    background: `linear-gradient(to right, var(--accent-solid) 0%, var(--accent-solid) ${((slideCount - 5) / 25) * 100}%, rgba(255, 255, 255, 0.1) ${((slideCount - 5) / 25) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>5 slides (Brief)</span>
                  <span>15 slides (Standard)</span>
                  <span>30 slides (In-depth)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Themes Palette cards */}
        {step === 3 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Select Global Theme Palette
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                Pick a core style for color and text structures. You can dynamically adjust it later.
              </p>
            </div>

            <div className="theme-palette-grid">
              {THEMES.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`theme-palette-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {t.name}
                      </span>
                      {isSelected && (
                        <div 
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-solid)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff'
                          }}
                        >
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', minHeight: '30px' }}>
                      {t.desc}
                    </p>

                    {/* Swatch dots */}
                    <div className="swatch-group">
                      {t.swatches.map((color, cIdx) => (
                        <div 
                          key={cIdx} 
                          className="swatch-dot" 
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Miniature slide mockup representation */}
                    <div 
                      className="mock-slide-preview" 
                      style={{
                        backgroundColor: t.previewStyle.backgroundColor,
                        color: t.previewStyle.color
                      }}
                    >
                      <div>
                        {/* Slide Title Mock */}
                        <div 
                          className="mock-slide-title" 
                          style={{ backgroundColor: t.accent }}
                        />
                        {/* Slide Bullet Mock */}
                        <div 
                          className="mock-slide-body" 
                          style={{ backgroundColor: t.text, opacity: 0.5 }}
                        />
                        <div 
                          className="mock-slide-body-2" 
                          style={{ backgroundColor: t.text, opacity: 0.5 }}
                        />
                      </div>
                      
                      {/* Slide Badge Mock */}
                      <div 
                        className="mock-slide-badge"
                        style={{ backgroundColor: t.subAccent }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Navigation Footer */}
        <div 
          style={{
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Back / Left button */}
          {step > 1 ? (
            <button 
              className="btn btn-secondary" 
              onClick={handleBack}
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div style={{ width: '10px' }} /> /* Spacer */
          )}

          {/* Right button: Next or Generate Outline */}
          {step < 3 ? (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={step === 1 && !prompt.trim()}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              style={{
                background: 'var(--grad-primary)'
              }}
            >
              <Sparkles size={16} /> Generate Outline
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
