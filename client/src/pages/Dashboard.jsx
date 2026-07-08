import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getGuestSessionId } from '../services/auth';

// Component Imports
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AnalyticsCards from '../components/AnalyticsCards';
import PresentationCard from '../components/PresentationCard';
import AIValidationCenter from '../components/AIValidationCenter';
import AudienceAlignment from '../components/AudienceAlignment';
import QuickTemplates from '../components/QuickTemplates';
import RecentActivity from '../components/RecentActivity';
import FloatingAssistant from '../components/FloatingAssistant';
import EmptyState from '../components/EmptyState';

// Styles Import
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [toast, setToast] = useState({ visible: false, message: '' });
  
  const guestSessionId = getGuestSessionId();
  const toastTimerRef = useRef(null);

  // Dynamic toast show helper
  const showToast = (message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ visible: true, message });
    toastTimerRef.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2600);
  };

  // Load Decks matching guestSessionId from database
  const loadDecks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/presentations?guestSessionId=${guestSessionId}`);
      setDecks(response.data || []);
    } catch (err) {
      console.error('Failed to load decks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Handle deck deletion with API integration
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this deck?')) return;

    try {
      await api.delete(`/api/presentations/${id}?guestSessionId=${guestSessionId}`);
      setDecks(prev => prev.filter(deck => deck._id !== id));
      showToast('Presentation deleted successfully');
    } catch (err) {
      showToast(err.message || 'Deletion failed.');
    }
  };

  const handleNavigate = (id) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Ambient background blur elements */}
      <div className="ambient">
        <div className="mesh m1"></div>
        <div className="mesh m2"></div>
        <div className="mesh m3"></div>
        <div className="grid"></div>
      </div>

      <div className="shell">
        {/* PREMIUM COLLAPSIBLE SIDEBAR */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* MAIN BODY AREA */}
        <div className="main">
          {/* TOP NAVIGATION HEADER */}
          <Navbar 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            showToast={showToast}
          />

          {/* DYNAMIC SCROLLING DASHBOARD CONTENT */}
          <div className="content">
            
            {/* HERO AI PRESENTATION GENERATION WORKSPACE */}
            <HeroSection showToast={showToast} />

            {/* OVERVIEW STATS CARDS */}
            <AnalyticsCards />

            {/* CONTINUE EDITING PRESENTATION LIST & INSIGHTS ROW */}
            <section>
              <div className="split-row">
                <div style={{ flex: '1 1 0%', minWidth: '0' }}>
                  <div className="section-head">
                    <h2>Continue Editing</h2>
                    <a className="see-all" style={{ cursor: 'pointer' }}>
                      View all 
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </a>
                  </div>
                  
                  {loading ? (
                    <div className="cards-grid">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="glass shimmer" style={{ height: '220px', borderRadius: 'var(--r-lg)' }}></div>
                      ))}
                    </div>
                  ) : decks.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <div className="cards-grid">
                      {decks.map((deck, idx) => (
                        <PresentationCard 
                          key={deck._id} 
                          deck={deck} 
                          index={idx}
                          onNavigate={handleNavigate}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* PREMIUM AI INSIGHTS BLOCK */}
                <div className="glass insights-panel">
                  <div className="insights-head">
                    <div className="insights-orb">
                      <div className="ring"></div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 3a9 9 0 1 0 9 9" />
                        <path d="M12 3v9l6 3" />
                      </svg>
                    </div>
                    <div>
                      <b>AI Insights</b>
                      <small>Based on your presentations</small>
                    </div>
                  </div>

                  <div className="insight-item" style={{ transition: 'all 0.35s ease' }}>
                    <div className="itop">
                      <span className="idot warn"></span>
                      <div>
                        <p>Slide 6 has high text density — readability may drop for investors.</p>
                        <span className="isub">Suggested: split into two slides</span>
                      </div>
                    </div>
                    <div className="insight-actions">
                      <button className="btn-fix" onClick={() => showToast('Fix applied: slide density optimized!')}>Fix Now</button>
                      <button 
                        className="btn-ignore" 
                        onClick={(e) => {
                          const item = e.currentTarget.closest('.insight-item');
                          if (item) {
                            item.style.opacity = '0.35';
                            e.currentTarget.textContent = 'Ignored';
                            e.currentTarget.disabled = true;
                            showToast('Suggestion ignored');
                          }
                        }}
                      >
                        Ignore
                      </button>
                    </div>
                  </div>

                  <div className="insight-item" style={{ transition: 'all 0.35s ease' }}>
                    <div className="itop">
                      <span className="idot info"></span>
                      <div>
                        <p>Add more visuals to slides 8–9 to reinforce the market-sizing narrative.</p>
                        <span className="isub">2 chart suggestions available</span>
                      </div>
                    </div>
                    <div className="insight-actions">
                      <button className="btn-fix" onClick={() => showToast('Visual charts successfully added to slides 8 and 9!')}>Fix Now</button>
                      <button 
                        className="btn-ignore" 
                        onClick={(e) => {
                          const item = e.currentTarget.closest('.insight-item');
                          if (item) {
                            item.style.opacity = '0.35';
                            e.currentTarget.textContent = 'Ignored';
                            e.currentTarget.disabled = true;
                            showToast('Suggestion ignored');
                          }
                        }}
                      >
                        Ignore
                      </button>
                    </div>
                  </div>

                  <div className="insight-item" style={{ transition: 'all 0.35s ease' }}>
                    <div className="itop">
                      <span className="idot tip"></span>
                      <div>
                        <p>Reduce text density on the roadmap slide for a punchier delivery.</p>
                        <span className="isub">AI can rewrite in your tone</span>
                      </div>
                    </div>
                    <div className="insight-actions">
                      <button className="btn-fix" onClick={() => showToast('Roadmap text revised with focused bullets!')}>Fix Now</button>
                      <button 
                        className="btn-ignore" 
                        onClick={(e) => {
                          const item = e.currentTarget.closest('.insight-item');
                          if (item) {
                            item.style.opacity = '0.35';
                            e.currentTarget.textContent = 'Ignored';
                            e.currentTarget.disabled = true;
                            showToast('Suggestion ignored');
                          }
                        }}
                      >
                        Ignore
                      </button>
                    </div>
                  </div>

                  <div className="insights-summary">
                    <div>
                      <div className="score">
                        82<span style={{ fontSize: '13px', color: 'var(--text-3)' }}>/100</span>
                      </div>
                      <small>Presentation health score</small>
                    </div>
                    <svg width="46" height="46" viewBox="0 0 46 46">
                      <circle cx="23" cy="23" r="19" stroke="var(--border)" strokeWidth="4" fill="none" />
                      <circle 
                        cx="23" 
                        cy="23" 
                        r="19" 
                        stroke="url(#gscore)" 
                        strokeWidth="4" 
                        fill="none"
                        strokeLinecap="round" 
                        strokeDasharray="119.4" 
                        strokeDashoffset="21.5"
                        transform="rotate(-90 23 23)" 
                      />
                      <defs>
                        <linearGradient id="gscore" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" />
                          <stop offset="100%" stopColor="#0891B2" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </section>

            {/* AI VALIDATION CENTER (VERIFICATION, ACCURACY & HEALTH) */}
            <AIValidationCenter showToast={showToast} />

            {/* QUICK TEMPLATES SLIDER */}
            <QuickTemplates showToast={showToast} />

            {/* AUDIENCE ALIGNMENT & STRUCTURAL TIMELINE */}
            <AudienceAlignment showToast={showToast} />

            {/* TIMELINE LOGGER OF RECENT ACTIVITY */}
            <RecentActivity />
          </div>
        </div>
      </div>

      {/* INTERACTIVE CHATBOT HELPER */}
      <FloatingAssistant />

      {/* TOAST SYSTEM ALERTS */}
      <div className={`toast ${toast.visible ? 'show' : ''}`} id="toast">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span id="toastMsg">{toast.message}</span>
      </div>
    </div>
  );
}
