import React from 'react';

export default function EmptyState() {
  const handleScrollToStudio = () => {
    const textarea = document.getElementById('aiPrompt');
    if (textarea) {
      textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => textarea.focus(), 500);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="glass" style={{ padding: '4.5rem 2rem', textAlign: 'center', margin: '20px 0', borderRadius: 'var(--r-lg)' }}>
      <div 
        style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '16px', 
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(8, 145, 178, 0.1))',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--primary)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '32px', height: '32px' }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M21 9H3M21 15H3M12 3v18" />
        </svg>
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-0)' }}>No Presentations Found</h3>
      <p style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: 'var(--text-2)', maxWidth: '440px', margin: '0.5rem auto 1.5rem', lineWeight: 1.5 }}>
        You don't have any slide decks in your workspace yet. Enter a topic in the AI Presentation Studio above to compile your first professional slide deck!
      </p>
      <button 
        type="button" 
        onClick={handleScrollToStudio}
        className="btn btn-primary"
        style={{
          background: 'var(--grad-brand)',
          border: 'none',
          padding: '10px 22px',
          borderRadius: '11px',
          fontWeight: 600,
          color: '#fff',
          boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.35)',
          cursor: 'pointer'
        }}
      >
        Start Creating
      </button>
    </div>
  );
}
