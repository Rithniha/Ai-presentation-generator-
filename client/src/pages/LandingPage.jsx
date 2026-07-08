import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { authService, getGuestSessionId } from '../services/auth';
import { Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import Auth from './Auth';
import '../styles/Landing.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [warmingUp, setWarmingUp] = useState(false);
  const [warmupTimer, setWarmupTimer] = useState(0);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load user session on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await authService.getMe();
        setUser(u);
      } catch (err) {
        console.log('No active session.');
      }
    };
    fetchUser();
  }, []);

  const handleAuthSuccess = async (success) => {
    setShowAuthModal(false);
    if (success) {
      try {
        const u = await authService.getMe();
        setUser(u);
      } catch (err) {
        console.log('Error reloading user:', err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setWarmingUp(true);

    // Warm-up timeout alert helper
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

      // 2. Navigate to Outline Editor, passing generated deck structure as router state
      navigate('/outline-editor', {
        state: {
          generatedDeck: response.data,
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
    <div className="landing-container" style={{ paddingTop: '5.5rem' }}>
      <header className="landing-header" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        zIndex: 10,
        borderBottom: '1px solid hsl(var(--border-color))',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Sparkles size={20} style={{ color: 'hsl(var(--primary))' }} />
          SlideGen AI
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                Hi, <strong style={{ color: 'hsl(var(--text-primary))' }}>{user.name}</strong>
              </span>
              <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Dashboard
              </button>
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowAuthModal(true)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Sign In / Sign Up
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Guest Dashboard
              </button>
            </>
          )}
        </div>
      </header>

      <div className="landing-hero">
        <div className="badge">
          <Sparkles size={14} />
          AI Presentation Engine Active
        </div>
        
        <h1 className="landing-title">
          Generate Stunning Slides in <span className="glow-text">Seconds</span>
        </h1>
        
        <p className="landing-subtitle">
          Input your topic and let our intelligence write outlines, structure layouts, assign icons, and compile perfect PowerPoint presentations instantly.
        </p>

        <form onSubmit={handleSubmit} className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">What is your presentation about?</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., Q3 Marketing Roadmap, SaaS Sales Pitch..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Number of Slides ({slideCount})</label>
            <input 
              type="range" 
              min="3" 
              max="12" 
              className="form-input" 
              style={{ padding: '0.25rem 0' }}
              value={slideCount}
              onChange={(e) => setSlideCount(parseInt(e.target.value))}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Presentation Outline...' : 'Generate Presentation Outline'}
            <ArrowRight size={18} />
          </button>
        </form>

        {warmingUp && warmupTimer > 3 && (
          <div className="warmup-indicator">
            <div className="spinner"></div>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>
              Warming up free-tier backend container... (elapsed: {warmupTimer}s / ~45s)
            </span>
          </div>
        )}

        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem' }}>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            {user ? 'View My Saved Decks' : 'View My Decks (Guest Dashboard)'}
          </button>
        </div>
      </div>
      {showAuthModal && <Auth onClose={handleAuthSuccess} />}
    </div>
  );
}
