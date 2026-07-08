import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getGuestSessionId } from '../services/auth';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Presentation, 
  Download, 
  CheckCircle,
  Play,
  HelpCircle 
} from 'lucide-react';
import '../styles/Landing.css';

const SUGGESTIONS = [
  { label: '🚀 SaaS Pitch', prompt: 'SaaS Sales Pitch Deck for a new remote collaboration tool', slides: 8 },
  { label: '📊 Marketing Strategy', prompt: 'Q3 Marketing Growth Strategy and channel optimization plan', slides: 6 },
  { label: '🌱 Project Proposal', prompt: 'Eco-friendly urban rooftop garden project proposal', slides: 5 },
  { label: '👥 Team Onboarding', prompt: 'New employee onboarding guidelines and company values', slides: 7 }
];

const PREVIEW_SLIDES = [
  {
    num: '01',
    tabTitle: 'Executive Summary',
    layout: 'Title Slide',
    title: 'DeckFlow Presentation Engine',
    subtitle: 'Generate structured slide decks and outlines instantly using professional templates and AI-powered layout generation.'
  },
  {
    num: '02',
    tabTitle: 'The Problem Statement',
    layout: 'Split Layout',
    title: 'Why Presentation Design Fails',
    bullets: [
      'Formatting and design layout consume up to 4 hours per deck',
      'Inconsistent font styling and visual branding across departments',
      'Structuring complex textual narratives is difficult and slow'
    ]
  },
  {
    num: '03',
    tabTitle: 'Market Opportunity',
    layout: 'Metrics Grid',
    title: 'A Massive Addressable Market',
    bullets: [
      'Over 250M presentation tool users active globally today',
      'USD $45B Total Addressable Market for slide building software',
      '35% year-over-year growth in smart workspace and SaaS tooling'
    ]
  },
  {
    num: '04',
    tabTitle: 'Our AI Solution',
    layout: 'Key Features',
    title: 'The AI Deck Generation Engine',
    bullets: [
      'Instant outline models that arrange ideas in structured lists',
      'Smart layout selectors that choose card designs based on text density',
      'One-click PPTX exporting compatible with standard PowerPoint software'
    ]
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [warmingUp, setWarmingUp] = useState(false);
  const [warmupTimer, setWarmupTimer] = useState(0);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Ping backend to warm it up on page load (Render free tier cold starts)
  useEffect(() => {
    const pingServer = async () => {
      try {
        await api.get('/api/ping');
      } catch (err) {
        console.log('Server is warming up...');
      }
    };
    pingServer();
  }, []);

  // Handle countdown if warming up takes too long
  useEffect(() => {
    let interval;
    if (warmingUp) {
      interval = setInterval(() => {
        setWarmupTimer(prev => prev + 1);
      }, 1000);
    } else {
      setWarmupTimer(0);
    }
    return () => clearInterval(interval);
  }, [warmingUp]);

  const handleSelectSuggestion = (suggestion, index) => {
    if (loading) return;
    setPrompt(suggestion.prompt);
    setSlideCount(suggestion.slides);
    setSelectedSuggestionIndex(index);
  };

  const handleInputChange = (value) => {
    setPrompt(value);
    // Reset suggestion index if text doesn't match suggestion anymore
    const matchingIndex = SUGGESTIONS.findIndex(s => s.prompt === value);
    setSelectedSuggestionIndex(matchingIndex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setWarmingUp(true);

    const warmupAlert = setTimeout(() => {
      console.log('Still waiting... backend container might be booting up.');
    }, 5000);

    try {
      // 1. Send generation query to backend outline endpoint
      const response = await api.post('/api/generation/outline', {
        prompt: prompt.trim(),
        slideCount
      });

      clearTimeout(warmupAlert);
      setWarmingUp(false);
      setLoading(false);

      // 2. Save the generated outline as a draft presentation in the database immediately
      const draftResponse = await api.post('/api/presentations', {
        title: response.data.title,
        slides: response.data.slides,
        guestSessionId: getGuestSessionId(),
        theme: 'classic'
      });

      // 3. Navigate to the Outline Editor workspace with the draft ID
      navigate(`/editor/${draftResponse.data._id}/outline`, {
        state: {
          originalPrompt: prompt
        }
      });
    } catch (err) {
      clearTimeout(warmupAlert);
      setWarmingUp(false);
      setLoading(false);
      alert(err.message || 'Generation failed. Please try again.');
    }
  };

  return (
    <div className="landing-container">
      {/* Sleek Navigation Header */}
      <header className="landing-header">
        <a href="/" className="landing-logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <div className="landing-logo-icon">
            <Presentation size={18} />
          </div>
          <span>DeckFlow</span>
        </a>
        <nav className="landing-nav">
          <a href="#preview" className="landing-nav-link">Interactive Demo</a>
          <a href="#features" className="landing-nav-link">Features</a>
          <span className="landing-nav-link" style={{ cursor: 'help', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HelpCircle size={14} /> Help
          </span>
        </nav>
        <div className="landing-header-actions">
          <button onClick={() => navigate('/dashboard')} className="landing-btn landing-btn-secondary">
            View My Decks
          </button>
        </div>
      </header>

      {/* Main Hero & Input Section */}
      <div className="landing-hero">
        <div className="landing-badge">
          <Sparkles size={13} />
          AI Presentation Engine Active
        </div>
        
        <h1 className="landing-title">
          Stunning Slide Decks, <span>Written by AI</span> in Seconds
        </h1>
        
        <p className="landing-subtitle">
          Input your topic and let our intelligence write outlines, structures, layouts, and compile perfect presentations instantly.
        </p>

        {/* Action Card Container */}
        <form onSubmit={handleSubmit} className="landing-card">
          <div className="form-group">
            <label className="landing-form-label">What is your presentation about?</label>
            <div className="landing-input-wrapper">
              <input 
                type="text" 
                className="landing-input" 
                placeholder="e.g., Q3 Marketing Roadmap, SaaS Sales Pitch..."
                value={prompt}
                onChange={(e) => handleInputChange(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="landing-suggestions-container">
            <div className="landing-suggestions-label">Try these prompts:</div>
            <div className="landing-suggestions-grid">
              {SUGGESTIONS.map((suggestion, idx) => (
                <div
                  key={idx}
                  className={`landing-suggestion-chip ${selectedSuggestionIndex === idx ? 'active' : ''}`}
                  onClick={() => handleSelectSuggestion(suggestion, idx)}
                >
                  {suggestion.label}
                </div>
              ))}
            </div>
          </div>

          {/* Slide Count Range Selector */}
          <div className="landing-slider-container">
            <div className="landing-slider-header">
              <label className="landing-form-label">Number of Slides</label>
              <span className="landing-slider-count">{slideCount} Slides</span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="12" 
              className="landing-slider"
              value={slideCount}
              onChange={(e) => setSlideCount(parseInt(e.target.value))}
              disabled={loading}
            />
          </div>

          <button type="submit" className="landing-btn landing-btn-primary" disabled={loading}>
            {loading ? 'Creating Presentation Outline...' : 'Generate Presentation Outline'}
            <ArrowRight size={18} />
          </button>

          {/* Warmup Loader for Render Containers */}
          {warmingUp && warmupTimer > 3 && (
            <div className="landing-warmup">
              <div className="landing-spinner"></div>
              <span className="landing-warmup-text">
                Warming up backend container... (elapsed: {warmupTimer}s / ~45s)
              </span>
            </div>
          )}
        </form>

        {/* Small Statistics Banner */}
        <div className="landing-stats-row">
          <div className="landing-stat-item">
            <div className="landing-stat-val">12,000+</div>
            <div className="landing-stat-label">Decks Generated</div>
          </div>
          <div className="landing-stat-item">
            <div className="landing-stat-val">0.5s</div>
            <div className="landing-stat-label">Avg Generation Time</div>
          </div>
          <div className="landing-stat-item">
            <div className="landing-stat-val">100%</div>
            <div className="landing-stat-label">PowerPoint Exportable</div>
          </div>
        </div>
      </div>

      {/* Interactive Preview Slide Deck widget */}
      <section id="preview" className="landing-preview-section">
        <h2 className="landing-preview-title">Instant Structural Layouts</h2>
        <p className="landing-preview-subtitle">Click through the slides below to see the interactive outline structure created by the AI model.</p>
        
        <div className="landing-preview-container">
          {/* Tabs Sidebar */}
          <div className="landing-preview-sidebar">
            {PREVIEW_SLIDES.map((slide, idx) => (
              <div 
                key={idx}
                className={`landing-preview-tab ${activePreviewIndex === idx ? 'active' : ''}`}
                onClick={() => setActivePreviewIndex(idx)}
              >
                <span className="landing-preview-tab-num">{slide.num}</span>
                <span className="landing-preview-tab-title">{slide.tabTitle}</span>
              </div>
            ))}
          </div>

          {/* Canvas Slide Area */}
          <div className="landing-preview-content">
            <div className="landing-preview-slide-layout">
              <div className="landing-preview-slide-type">{PREVIEW_SLIDES[activePreviewIndex].layout}</div>
              <h3 className="landing-preview-slide-title">{PREVIEW_SLIDES[activePreviewIndex].title}</h3>
              
              {PREVIEW_SLIDES[activePreviewIndex].subtitle ? (
                <p className="landing-preview-slide-subtitle">{PREVIEW_SLIDES[activePreviewIndex].subtitle}</p>
              ) : (
                <ul className="landing-preview-bullets">
                  {PREVIEW_SLIDES[activePreviewIndex].bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="landing-preview-bullet-item">
                      <span className="landing-preview-bullet-dot"></span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="landing-features-grid">
        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <Layers size={20} />
          </div>
          <h3 className="landing-feature-title">Structure Instantly</h3>
          <p className="landing-feature-desc">AI constructs structured narrative cards. Reorder, add points, and update in our dedicated outline editor.</p>
        </div>
        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <Download size={20} />
          </div>
          <h3 className="landing-feature-title">PowerPoint Export</h3>
          <p className="landing-feature-desc">Export outlines directly into native PPTX files, fully editable with slides, bullets, and geometric card boxes.</p>
        </div>
        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <CheckCircle size={20} />
          </div>
          <h3 className="landing-feature-title">Audience-Aligned</h3>
          <p className="landing-feature-desc">Review slides based on professional delivery goals. Instantly adjust density, text structure, and tone.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} DeckFlow AI. Built with precision and clarity.</p>
      </footer>
    </div>
  );
}
