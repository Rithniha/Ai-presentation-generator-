import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const GENERATION_TIPS = [
  "Analyzing presentation prompt...",
  "Extracting core concepts and sub-topics...",
  "Structuring outline slide-by-slide...",
  "Synthesizing audience context and tone...",
  "Applying theme palette constraints...",
  "Generating engaging slide titles...",
  "Refining bullet point descriptions...",
  "Polishing final presentation architecture..."
];

export default function SkeletonLoader({ isVisible }) {
  if (!isVisible) return null;

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % GENERATION_TIPS.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 animate-fade-in"
      style={{
        background: 'rgba(5, 5, 10, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Background Pulsing Fake Layout to simulate work behind the scenes */}
      <div 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          opacity: 0.15,
          zIndex: -1,
          overflow: 'hidden',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div className="skeleton-box" style={{ width: '48px', height: '48px', borderRadius: '50%' }}></div>
          <div className="skeleton-box" style={{ width: '200px', height: '24px' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-box" style={{ height: '40px', width: '100%' }}></div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton-box" style={{ height: '60px', width: '70%' }}></div>
            <div className="skeleton-box" style={{ height: '200px', width: '100%' }}></div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="skeleton-box" style={{ height: '100px', flex: 1 }}></div>
              <div className="skeleton-box" style={{ height: '100px', flex: 1 }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Glass Spinner Box */}
      <div 
        className="glass-panel"
        style={{
          padding: '40px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '520px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          position: 'relative'
        }}
      >
        {/* Pulsing Gradient Circle behind Spinner */}
        <div 
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--grad-primary)',
            filter: 'blur(30px)',
            opacity: 0.4,
            top: '40px',
            zIndex: 0
          }}
        ></div>

        {/* Floating sparkles and loader */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '24px' }}>
          <Loader2 
            className="spin-slow" 
            size={56} 
            style={{ 
              color: '#8b5cf6',
              filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.6))'
            }} 
          />
          <Sparkles 
            size={20} 
            style={{ 
              position: 'absolute', 
              top: '-6px', 
              right: '-6px', 
              color: '#d946ef',
              animation: 'pulse 1s infinite alternate'
            }} 
          />
        </div>

        <h3 
          style={{ 
            fontSize: '22px', 
            fontWeight: 700, 
            letterSpacing: '-0.5px',
            marginBottom: '12px',
            background: 'var(--grad-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Generating Presentation
        </h3>
        
        <p 
          style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '14px',
            marginBottom: '32px',
            lineHeight: 1.5
          }}
        >
          Our AI is mapping structure, selecting layout themes, and drafting slide content. This will only take a moment.
        </p>

        {/* Custom Progress Bar Indicator */}
        <div 
          style={{ 
            width: '100%', 
            height: '6px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '24px'
          }}
        >
          <div 
            style={{ 
              height: '100%', 
              background: 'var(--grad-primary)', 
              borderRadius: '3px',
              animation: 'loading-shimmer 2s infinite linear',
              width: '100%'
            }}
          ></div>
        </div>

        {/* Rotating AI Loading Tip */}
        <div 
          style={{ 
            minHeight: '44px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
        >
          <p 
            key={tipIndex}
            className="animate-slide-up"
            style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '13px', 
              color: 'var(--accent-pink)',
              fontWeight: 500
            }}
          >
            {GENERATION_TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
