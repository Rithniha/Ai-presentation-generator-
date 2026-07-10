import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function HeroSection({ showToast }) {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [audience, setAudience] = useState('Executives');
  const [tone, setTone] = useState('Confident');
  const [slideCount, setSlideCount] = useState(12);
  const [theme, setTheme] = useState('Daylight');
  const [loading, setLoading] = useState(false);
  const [warmingUp, setWarmingUp] = useState(false);
  const [warmupTimer, setWarmupTimer] = useState(0);

  const fillPrompt = (text) => {
    setPrompt(text);
    const textarea = document.getElementById('aiPrompt');
    if (textarea) {
      textarea.focus();
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showToast('Please enter a presentation topic');
      return;
    }

    // Ripple effect animation trigger
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left - 6) + 'px';
    ripple.style.top = (e.clientY - rect.top - 6) + 'px';
    ripple.style.width = ripple.style.height = '12px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);

    if (loading) return;
    setLoading(true);
    setWarmingUp(true);

    let timerInterval = setInterval(() => {
      setWarmupTimer(prev => prev + 1);
    }, 1000);

    try {
      showToast('AI presentation generation started...');
      
      const response = await api.post('/api/generation/outline', {
        prompt: `${prompt.trim()} (Audience: ${audience}, Tone: ${tone}, Theme: ${theme})`,
        slideCount: Math.min(slideCount, 12) // Keep outline api within limits if it caps at 12
      });

      clearInterval(timerInterval);
      setLoading(false);
      setWarmingUp(false);
      showToast('Presentation generated successfully');

      // Navigate to outline editor
      navigate('/outline-editor', {
        state: {
          generatedDeck: response.data,
          originalPrompt: prompt
        }
      });
    } catch (err) {
      clearInterval(timerInterval);
      setLoading(false);
      setWarmingUp(false);
      showToast(err.message || 'Generation failed. Please try again.');
    }
  };

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="eyebrow">
          <span className="ring-dot"></span>AI Presentation Studio
        </div>
        <h1>Create <span className="grad">professional presentations</span> with AI</h1>
        <p className="sub">
          Generate beautiful, audience-specific presentations in minutes. Describe your
          idea — PresentAI Pro handles structure, design, and narrative.
        </p>

        <div className="ai-input-box">
          <div className="ai-input-inner">
            <textarea 
              id="aiPrompt" 
              rows="2"
              placeholder="What presentation do you want to create today?..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            ></textarea>
            <div className="ai-input-toolbar">
              <label className="select-chip">
                <svg className="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                  <circle cx="10" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Audience: <b>{audience}</b>
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
                <select value={audience} onChange={(e) => setAudience(e.target.value)} disabled={loading}>
                  <option value="Executives">Executives</option>
                  <option value="Investors">Investors</option>
                  <option value="Students">Students</option>
                  <option value="General public">General public</option>
                </select>
              </label>

              <label className="select-chip">
                <svg className="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Tone: <b>{tone}</b>
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
                <select value={tone} onChange={(e) => setTone(e.target.value)} disabled={loading}>
                  <option value="Confident">Confident</option>
                  <option value="Formal">Formal</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Persuasive">Persuasive</option>
                </select>
              </label>

              <label className="select-chip">
                <svg className="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <path d="M3 9h18" />
                </svg>
                Slides: <b>{slideCount}</b>
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
                <select value={slideCount} onChange={(e) => setSlideCount(parseInt(e.target.value))} disabled={loading}>
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                  <option value={20}>20</option>
                </select>
              </label>

              <label className="select-chip">
                <svg className="lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="13.5" cy="6.5" r=".5" />
                  <circle cx="17.5" cy="10.5" r=".5" />
                  <circle cx="8.5" cy="7.5" r=".5" />
                  <circle cx="6.5" cy="12.5" r=".5" />
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-4 4 4 0 0 1-5-6z" />
                </svg>
                Theme: <b>{theme}</b>
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
                <select value={theme} onChange={(e) => setTheme(e.target.value)} disabled={loading}>
                  <option value="Daylight">Daylight</option>
                  <option value="Aurora">Aurora</option>
                  <option value="Slate">Slate</option>
                  <option value="Mono">Mono</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="hero-bottom-row">
          <div className="hero-hints">
            <button 
              type="button" 
              className="hint-pill"
              onClick={() => fillPrompt('Series A pitch deck for a fintech startup')}
            >
              💡 Series A pitch deck
            </button>
            <button 
              type="button" 
              className="hint-pill"
              onClick={() => fillPrompt('Q3 marketing performance review for leadership')}
            >
              📊 Quarterly marketing review
            </button>
            <button 
              type="button" 
              className="hint-pill"
              onClick={() => fillPrompt('Onboarding guide for new engineering hires')}
            >
              🚀 Onboarding guide
            </button>
          </div>
          <button 
            type="button" 
            className={`btn-generate ${loading ? 'loading' : ''}`} 
            id="generateBtn" 
            onClick={handleGenerate}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.5 15.5l2.9 2.9M5.6 18.4l2.8-2.8M15.5 8.5l2.9-2.9" />
            </svg>
            <span>{loading ? 'Generating...' : 'Generate Presentation'}</span>
            <div className="spinner"></div>
          </button>
        </div>

        {warmingUp && warmupTimer > 3 && (
          <div className="warmup-indicator" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="spinner"></div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>
              Warming up backend container... (elapsed: {warmupTimer}s)
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
