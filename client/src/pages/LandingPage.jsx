import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Presentation 
} from 'lucide-react';
import '../styles/Landing.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
      {/* Sleek Navigation Header */}
      <header className="landing-header">
        <a href="/" className="landing-logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <div className="landing-logo-icon">
            <Presentation size={18} />
          </div>
          <span>DeckFlow</span>
        </a>
        <div className="landing-header-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => navigate('/dashboard')} className="landing-btn landing-btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Dashboard
          </button>
          <button onClick={() => navigate('/signin')} className="landing-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} className="landing-btn landing-btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto' }}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Simplified Hero Panel with only the Generate Button */}
      <div className="landing-hero" style={{ margin: 'auto', padding: '2rem 1rem', textAlign: 'center' }}>
        <div className="landing-badge" style={{ display: 'inline-flex', alignSelf: 'center', margin: '0 auto 1.5rem' }}>
          <Sparkles size={13} />
          AI Presentation Engine Active
        </div>
        
        <h1 className="landing-title" style={{ fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '1.5rem' }}>
          Stunning Slide Decks, <br /><span>Written by AI</span> in Seconds
        </h1>
        
        <p className="landing-subtitle" style={{ fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2.5rem', color: '#64748b' }}>
          Instantly structure, layout, and build professional presentations. Click below to begin generating.
        </p>

        <button 
          onClick={() => navigate('/create-deck')} 
          className="landing-btn landing-btn-primary" 
          style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2.5rem', 
            width: 'auto', 
            margin: '0 auto', 
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          Generate Presentation
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Footer */}
      <footer className="landing-footer" style={{ padding: '2rem 1rem', textAlign: 'center', borderTop: '1px solid rgba(15, 23, 42, 0.05)' }}>
        <p>&copy; {new Date().getFullYear()} DeckFlow AI. Built with precision and clarity.</p>
      </footer>
    </div>
  );
}
