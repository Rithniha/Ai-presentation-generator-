import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Presentation, CheckCircle, ArrowRight, Eye, X } from 'lucide-react';
import '../styles/TemplateSelector.css';

/* ════════════════════════════════════════════════
   THEME DEFINITIONS  (10 Professional Themes)
════════════════════════════════════════════════ */
const TEMPLATES = [
  {
    id: 'corporate',
    name: 'Corporate',
    category: 'Business',
    tags: ['Business', 'Executive'],
    desc: 'Clean, navy-driven layouts built for boardrooms and stakeholder reports.',
    users: 'Executives, Consultants, Analysts',
    philosophy: 'Precision, authority, trust',
    bg: '#1e3a5f',
    accent: '#3b82f6',
    text: '#ffffff',
    secondary: 'rgba(255,255,255,0.12)',
    card: 'rgba(255,255,255,0.1)',
    font: 'Sora',
  },
  {
    id: 'startup',
    name: 'Startup Pitch',
    category: 'Pitch',
    tags: ['Startup', 'Investor'],
    desc: 'Energetic gradients and bold typography to capture investor attention instantly.',
    users: 'Founders, VCs, Product Teams',
    philosophy: 'Energy, momentum, boldness',
    bg: '#0f0f1a',
    accent: '#6366f1',
    text: '#ffffff',
    secondary: 'rgba(99,102,241,0.15)',
    card: 'rgba(99,102,241,0.12)',
    font: 'Outfit',
  },
  {
    id: 'academic',
    name: 'Academic',
    category: 'Education',
    tags: ['Academic', 'Research'],
    desc: 'Structured, serif-anchored layout ideal for papers, theses and seminar talks.',
    users: 'Professors, Students, Researchers',
    philosophy: 'Structure, depth, credibility',
    bg: '#f5f0e8',
    accent: '#92400e',
    text: '#1c1917',
    secondary: 'rgba(146,64,14,0.1)',
    card: 'rgba(146,64,14,0.07)',
    font: 'Merriweather',
  },
  {
    id: 'technology',
    name: 'Technology',
    category: 'Tech',
    tags: ['Tech', 'Engineering'],
    desc: 'Dark terminal aesthetic with cyan accents — built for product demos and tech talks.',
    users: 'Engineers, CTOs, Developers',
    philosophy: 'Precision, innovation, clarity',
    bg: '#0a0f1e',
    accent: '#06b6d4',
    text: '#e0f2fe',
    secondary: 'rgba(6,182,212,0.1)',
    card: 'rgba(6,182,212,0.08)',
    font: 'Fira Code',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    category: 'Marketing',
    tags: ['Marketing', 'Campaign'],
    desc: 'Vibrant coral and magenta palette designed to make campaigns pop and convert.',
    users: 'Marketers, Brand Managers, Agencies',
    philosophy: 'Emotion, attention, brand identity',
    bg: '#fff0f5',
    accent: '#e11d74',
    text: '#1a0010',
    secondary: 'rgba(225,29,116,0.08)',
    card: 'rgba(225,29,116,0.06)',
    font: 'Inter',
  },
  {
    id: 'finance',
    name: 'Finance',
    category: 'Business',
    tags: ['Finance', 'Banking'],
    desc: 'Conservative emerald palette conveying reliability for financial models and reports.',
    users: 'CFOs, Accountants, Analysts',
    philosophy: 'Trust, stability, data clarity',
    bg: '#0d2818',
    accent: '#10b981',
    text: '#ecfdf5',
    secondary: 'rgba(16,185,129,0.1)',
    card: 'rgba(16,185,129,0.08)',
    font: 'Inter',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    category: 'Healthcare',
    tags: ['Medical', 'Healthcare'],
    desc: 'Soft sky blues and clean whites for medical research, clinical and health presentations.',
    users: 'Doctors, Researchers, Hospitals',
    philosophy: 'Calm, compassion, clarity',
    bg: '#f0f9ff',
    accent: '#0284c7',
    text: '#0c1e2e',
    secondary: 'rgba(2,132,199,0.08)',
    card: 'rgba(2,132,199,0.06)',
    font: 'Inter',
  },
  {
    id: 'creative',
    name: 'Creative',
    category: 'Creative',
    tags: ['Design', 'Portfolio'],
    desc: 'Warm amber and bold asymmetric blocks for designers, portfolios and creative agencies.',
    users: 'Designers, Artists, Agencies',
    philosophy: 'Expression, boldness, personality',
    bg: '#fef3c7',
    accent: '#d97706',
    text: '#1c0d00',
    secondary: 'rgba(217,119,6,0.1)',
    card: 'rgba(217,119,6,0.08)',
    font: 'Outfit',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    category: 'General',
    tags: ['Clean', 'Minimal'],
    desc: 'Pure white canvas with soft grey accents. Maximum focus on content, zero distraction.',
    users: 'All professionals, Universal',
    philosophy: 'Less is more — content first',
    bg: '#ffffff',
    accent: '#334155',
    text: '#0f172a',
    secondary: 'rgba(51,65,85,0.06)',
    card: 'rgba(51,65,85,0.04)',
    font: 'Inter',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    category: 'Tech',
    tags: ['Dark', 'Modern'],
    desc: 'Deep charcoal with violet highlights — sleek, modern and easy on the eyes.',
    users: 'Tech teams, Product managers, Developers',
    philosophy: 'Sophistication, modernity, depth',
    bg: '#0f0f14',
    accent: '#a78bfa',
    text: '#e2e8f0',
    secondary: 'rgba(167,139,250,0.1)',
    card: 'rgba(167,139,250,0.08)',
    font: 'Inter',
  },
];

const CATEGORIES = ['All', 'Business', 'Pitch', 'Education', 'Tech', 'Marketing', 'Healthcare', 'Creative', 'General'];

/* ════════════════════════════════════════════════
   THUMBNAIL  (mini slide preview for each card)
════════════════════════════════════════════════ */
function ThumbPreview({ t }) {
  return (
    <div className="ts-thumb" style={{ background: t.bg }}>
      {/* Decorative accent strip */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 4, bottom: 0, background: t.accent, opacity: 0.9 }} />

      <div className="ts-thumb-title" style={{ color: t.text }}>{t.name}</div>
      <div className="ts-thumb-sub" style={{ color: t.text }}>AI Presentation</div>

      <div className="ts-thumb-divider" />

      {/* Simulated content rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, justifyContent: 'center' }}>
        {[85, 65, 45, 30].map((w, i) => (
          <div key={i} style={{ height: 5, width: `${w}%`, background: t.accent, borderRadius: 2, opacity: 0.4 + i * 0.1 }} />
        ))}
      </div>

      {/* Mini bar chart simulation */}
      <div className="ts-thumb-bars">
        {[40, 60, 80, 50, 70, 55, 90].map((h, i) => (
          <div key={i} className="ts-thumb-bar" style={{ height: h * 0.4, background: t.accent }} />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MODAL PREVIEW  (full 16:9 simulated slide)
════════════════════════════════════════════════ */
function PreviewModal({ t, onClose, onSelect }) {
  return (
    <div className="ts-preview-overlay" onClick={onClose}>
      <div className="ts-preview-modal" onClick={e => e.stopPropagation()}>
        {/* Large simulated slide */}
        <div className="ts-preview-slide" style={{ background: t.bg, position: 'relative' }}>
          {/* Accent bar */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: 6, height: '100%', background: t.accent }} />

          <div style={{ paddingLeft: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: t.accent, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {t.category} THEME
            </div>
            <div className="ts-preview-slide-title" style={{ color: t.text }}>{t.name}</div>
            <div className="ts-preview-slide-sub" style={{ color: t.text }}>{t.philosophy}</div>
          </div>

          {/* 3 simulated content cards */}
          <div className="ts-preview-slide-content" style={{ paddingLeft: '1rem' }}>
            {['Key Points', 'Data Insights', 'Next Steps'].map((label, i) => (
              <div key={i} className="ts-preview-card" style={{ background: t.card, color: t.text, border: `1px solid ${t.accent}30` }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: t.accent, marginBottom: '0.4rem', opacity: 0.7 }} />
                <div style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.25rem' }}>{label}</div>
                <div style={{ height: 3, background: t.accent, borderRadius: 2, opacity: 0.3, marginBottom: 4 }} />
                <div style={{ height: 3, width: '70%', background: t.accent, borderRadius: 2, opacity: 0.2 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="ts-preview-footer">
          <div>
            <div className="ts-preview-name">{t.name}</div>
            <div className="ts-preview-desc">{t.desc}<br /><b style={{ color: '#475569' }}>Best for:</b> {t.users}</div>
          </div>
          <div className="ts-preview-actions">
            <button className="ts-preview-cancel" onClick={onClose}><X size={14} style={{ display: 'inline', marginRight: 4 }} />Close</button>
            <button className="ts-preview-select" onClick={onSelect}>
              <CheckCircle size={14} style={{ display: 'inline', marginRight: 4 }} />Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN PAGE COMPONENT
════════════════════════════════════════════════ */
export default function TemplateSelector() {
  const navigate = useNavigate();
  const location = useLocation();

  // Passed from CreatePresentation via location.state
  const presentationState = location.state || {};

  const [selectedId, setSelectedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const filtered = useMemo(() =>
    activeCategory === 'All'
      ? TEMPLATES
      : TEMPLATES.filter(t => t.category === activeCategory),
    [activeCategory]
  );

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId);

  const handleSelect = (t) => {
    setSelectedId(t.id);
    setPreviewTemplate(null);
  };

  const handleContinue = async () => {
    if (!selectedId) return;

    // Navigate to the generate page with both the
    // presentation config AND the chosen theme
    navigate('/generate', {
      state: {
        ...presentationState,
        selectedTheme: selectedId,
        selectedTemplate: TEMPLATES.find(t => t.id === selectedId),
      }
    });
  };

  return (
    <div className="ts-container">
      {/* ── Header ── */}
      <header className="ts-header">
        <Link to="/" className="ts-logo">
          <div className="ts-logo-icon"><Presentation size={15} /></div>
          DeckFlow
        </Link>

        {/* Progress steps */}
        <div className="ts-steps">
          <div className="ts-step done">
            <span className="ts-step-num">✓</span> Configure
          </div>
          <div className="ts-step-sep" />
          <div className="ts-step active">
            <span className="ts-step-num">2</span> Choose Template
          </div>
          <div className="ts-step-sep" />
          <div className="ts-step">
            <span className="ts-step-num">3</span> Generate
          </div>
        </div>

        <Link to="/create-deck" className="ts-preview-cancel" style={{ textDecoration: 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
          ← Back
        </Link>
      </header>

      {/* ── Body ── */}
      <div className="ts-body" style={{ paddingBottom: '5rem' }}>
        <h1 className="ts-page-title">Choose a Template</h1>
        <p className="ts-page-sub">Pick a visual theme. The AI will apply the layout, colors, and typography to your presentation automatically.</p>

        {/* Category filter */}
        <div className="ts-filter-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`ts-filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="ts-grid">
          {filtered.map(t => (
            <div
              key={t.id}
              className={`ts-card ${selectedId === t.id ? 'selected' : ''}`}
              onClick={() => handleSelect(t)}
            >
              {selectedId === t.id && (
                <div className="ts-selected-badge">✓</div>
              )}

              <ThumbPreview t={t} />

              <div className="ts-card-info">
                <div className="ts-card-name">{t.name}</div>
                <div className="ts-card-desc">{t.desc}</div>
                <div className="ts-card-tags">
                  {t.tags.map(tag => (
                    <span key={tag} className="ts-card-tag">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Preview hover button */}
              <button
                onClick={e => { e.stopPropagation(); setPreviewTemplate(t); }}
                style={{
                  position: 'absolute',
                  bottom: '4.5rem',
                  right: '0.75rem',
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: '#475569',
                  opacity: 0,
                  transition: 'opacity 0.15s',
                }}
                className="ts-card-preview-btn"
              >
                <Eye size={12} /> Preview
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sticky bottom bar ── */}
      <div className="ts-footer-bar">
        <div className="ts-footer-selected">
          {selectedTemplate ? (
            <>
              <div className="ts-footer-dot" style={{ background: selectedTemplate.accent }} />
              <span><b>{selectedTemplate.name}</b> selected</span>
              <span style={{ color: '#94a3b8', fontWeight: 400 }}>— {selectedTemplate.philosophy}</span>
            </>
          ) : (
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>No template selected yet</span>
          )}
        </div>
        <button
          className="ts-cta-btn"
          disabled={!selectedId}
          onClick={handleContinue}
        >
          Generate Presentation <ArrowRight size={16} />
        </button>
      </div>

      {/* ── Preview modal ── */}
      {previewTemplate && (
        <PreviewModal
          t={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => handleSelect(previewTemplate)}
        />
      )}

      {/* Hover-show preview button trick via CSS */}
      <style>{`
        .ts-card:hover .ts-card-preview-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
