import React, { useState, useEffect, useRef } from 'react';

function AnimateCounter({ target, suffix = '', duration = 1400, trigger }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Cubic ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(target * easedProgress);

      setCount(currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [target, duration, trigger]);

  const useComma = target > 999;
  const displayValue = useComma ? count.toLocaleString() : count;

  return <span>{displayValue}{suffix}</span>;
}

export default function AnalyticsCards() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldAnimate(true);
            observer.disconnect(); // Only animate once
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const stats = [
    {
      id: 'total-presentations',
      iconClass: 'i1',
      label: 'Total Presentations',
      target: 248,
      suffix: '',
      trend: '18.2%',
      trendUp: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 9h18M8 4v14" />
        </svg>
      ),
      sparkline: (
        <svg className="spark" viewBox="0 0 120 34" preserveAspectRatio="none">
          <path className="fill" d="M0,26 L10,22 L22,24 L34,15 L46,18 L58,10 L70,14 L82,6 L94,9 L106,3 L120,5 L120,34 L0,34 Z" fill="#4F46E5" />
          <path className="line" d="M0,26 L10,22 L22,24 L34,15 L46,18 L58,10 L70,14 L82,6 L94,9 L106,3 L120,5" stroke="#6366F1" />
        </svg>
      )
    },
    {
      id: 'quality-score',
      iconClass: 'i2',
      label: 'AI Quality Score',
      target: 94,
      suffix: '%',
      trend: '4.6%',
      trendUp: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 2l2.6 6.6L22 9l-5.6 4.5L18 22l-6-4-6 4 1.6-8.5L2 9l7.4-.4z" />
        </svg>
      ),
      sparkline: (
        <svg className="spark" viewBox="0 0 120 34" preserveAspectRatio="none">
          <path className="fill" d="M0,20 L10,18 L22,20 L34,12 L46,14 L58,8 L70,10 L82,5 L94,7 L106,4 L120,4 L120,34 L0,34 Z" fill="#7C3AED" />
          <path className="line" d="M0,20 L10,18 L22,20 L34,12 L46,14 L58,8 L70,10 L82,5 L94,7 L106,4 L120,4" stroke="#8B5CF6" />
        </svg>
      )
    },
    {
      id: 'downloads',
      iconClass: 'i3',
      label: 'Downloads',
      target: 1560,
      suffix: '',
      trend: '27.4%',
      trendUp: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 3v13m0 0l-4-4m4 4l4-4M4 21h16" />
        </svg>
      ),
      sparkline: (
        <svg className="spark" viewBox="0 0 120 34" preserveAspectRatio="none">
          <path className="fill" d="M0,28 L10,24 L22,26 L34,18 L46,20 L58,12 L70,16 L82,7 L94,10 L106,5 L120,2 L120,34 L0,34 Z" fill="#0891B2" />
          <path className="line" d="M0,28 L10,24 L22,26 L34,18 L46,20 L58,12 L70,16 L82,7 L94,10 L106,5 L120,2" stroke="#06B6D4" />
        </svg>
      )
    },
    {
      id: 'time-saved',
      iconClass: 'i4',
      label: 'Time Saved',
      target: 132,
      suffix: 'h',
      trend: '12.9%',
      trendUp: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      ),
      sparkline: (
        <svg className="spark" viewBox="0 0 120 34" preserveAspectRatio="none">
          <path className="fill" d="M0,24 L10,22 L22,23 L34,16 L46,17 L58,11 L70,13 L82,6 L94,8 L106,3 L120,6 L120,34 L0,34 Z" fill="#16A34A" />
          <path className="line" d="M0,24 L10,22 L22,23 L34,16 L46,17 L58,11 L70,13 L82,6 L94,8 L106,3 L120,6" stroke="#22C55E" />
        </svg>
      )
    }
  ];

  return (
    <section>
      <div className="section-head">
        <h2>Overview</h2>
        <a className="see-all" style={{ cursor: 'pointer' }}>
          Full analytics 
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </a>
      </div>
      <div className="stats-grid" ref={containerRef}>
        {stats.map((stat) => (
          <div key={stat.id} className="glass stat-card">
            <div className="stat-top">
              <div className={`stat-icon ${stat.iconClass}`}>
                <div className="pulse-ring"></div>
                {stat.icon}
              </div>
              <span className={`trend-chip ${stat.trendUp ? 'up' : 'down'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d={stat.trendUp ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
                </svg>
                {stat.trend}
              </span>
            </div>
            <div className="stat-value">
              <AnimateCounter 
                target={stat.target} 
                suffix={stat.suffix} 
                trigger={shouldAnimate} 
              />
            </div>
            <div className="stat-label">{stat.label}</div>
            {stat.sparkline}
          </div>
        ))}
      </div>
    </section>
  );
}
