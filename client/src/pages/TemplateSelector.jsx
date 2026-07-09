import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Presentation, CheckCircle, ArrowRight, Eye, X, Search, Heart } from 'lucide-react';
import { useTemplateFilters } from '../hooks/useTemplateFilters';
import TemplatePreviewModal from '../components/TemplatePreviewModal';
import UploadTemplateSection from '../components/UploadTemplateSection';
import { TEMPLATES } from '../data/templates';
import '../styles/TemplateSelector.css';


const CATEGORIES = ['All', 'Business', 'Pitch', 'Education', 'Tech', 'Marketing', 'Healthcare', 'Creative', 'General'];

/* ════════════════════════════════════════════════
   THUMBNAIL  (mini slide preview for each card)
════════════════════════════════════════════════ */
function ThumbPreview({ t, isAiRecommended, isSelected, isFavorited, onToggleFavorite }) {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite(t.id);
  };

  return (
    <div className="ts-thumb" style={{ background: t.bg }}>
      {/* Decorative accent strip */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 4, bottom: 0, background: t.accent, opacity: 0.9 }} />

      {/* Heart Favorite Button */}
      <button
        className={`ts-favorite-btn ${isFavorited ? 'favorited' : ''}`}
        onClick={handleFavoriteClick}
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: isSelected ? '2.75rem' : '0.75rem',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: t.card,
          border: `1px solid ${t.accent}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isFavorited ? '#ef4444' : t.text,
          zIndex: 10,
          padding: 0,
          outline: 'none',
        }}
        aria-label={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
      >
        <Heart size={15} fill={isFavorited ? '#ef4444' : 'none'} stroke={isFavorited ? '#ef4444' : 'currentColor'} />
      </button>

      {isAiRecommended && (
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: isSelected ? '5.0rem' : '3.0rem',
          fontSize: '0.65rem',
          fontWeight: 700,
          color: t.text,
          opacity: 0.9,
          background: t.card,
          border: `1px solid ${t.accent}40`,
          padding: '0.15rem 0.5rem',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          zIndex: 5,
        }} className="ts-ai-badge">
          <span>🤖 AI Recommended</span>
        </div>
      )}

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


/* ════════════════════════════════════════════════
   MAIN PAGE COMPONENT
════════════════════════════════════════════════ */
export default function TemplateSelector() {
  const navigate = useNavigate();
  const location = useLocation();
  const presentationState = location.state || {};

  const [selectedId, setSelectedId] = useState(null);
  const [uploadedTemplate, setUploadedTemplate] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Favorites state management
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('deckflow_favorite_templates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const updated = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id];
      localStorage.setItem('deckflow_favorite_templates', JSON.stringify(updated));
      return updated;
    });
  };

  // Recently used templates state management
  const [recentIds, setRecentIds] = useState(() => {
    try {
      const saved = localStorage.getItem('deckflow_recent_templates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const addToRecentTemplates = (id) => {
    if (!id || id.startsWith('uploaded-')) return;
    try {
      const saved = localStorage.getItem('deckflow_recent_templates');
      let recents = saved ? JSON.parse(saved) : [];
      recents = [id, ...recents.filter(x => x !== id)];
      recents = recents.slice(0, 6);
      localStorage.setItem('deckflow_recent_templates', JSON.stringify(recents));
      setRecentIds(recents);
    } catch (e) {
      console.error(e);
    }
  };

  const { filteredTemplates, recommendedIds, compatibilityScores } = useTemplateFilters(
    TEMPLATES,
    activeCategory,
    searchQuery,
    presentationState
  );

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId) || uploadedTemplate;

  const handleSelect = (t) => {
    setSelectedId(t.id);
    setUploadedTemplate(null);
    setPreviewTemplate(null);
    if (t.id && !t.id.startsWith('uploaded-')) {
      addToRecentTemplates(t.id);
    }
  };

  const handleSelectUploadedTemplate = (customTemplate) => {
    setUploadedTemplate(customTemplate);
    setSelectedId(customTemplate.id);
  };

  const handleContinue = async () => {
    if (!selectedId) return;

    // Navigate to the generate page with both the
    // presentation config AND the chosen theme
    navigate('/generate', {
      state: {
        ...presentationState,
        selectedTheme: selectedId,
        selectedTemplate: selectedTemplate,
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

        {/* Search Bar */}
        <div className="ts-search-container">
          <Search size={16} className="ts-search-icon" />
          <input
            type="text"
            className="ts-search-input"
            placeholder="Search templates by name, category, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="ts-search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Recently Used Row */}
        {recentIds.length > 0 && (
          <div className="ts-recent-section">
            <h3 className="ts-recent-title">Recently Used</h3>
            <div className="ts-recent-row">
              {recentIds.map(id => {
                const template = TEMPLATES.find(t => t.id === id);
                if (!template) return null;
                return (
                  <div
                    key={id}
                    className={`ts-recent-card ${selectedId === id ? 'selected' : ''}`}
                    onClick={() => handleSelect(template)}
                  >
                    <div className="ts-recent-preview" style={{ background: template.bg }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, width: 3, bottom: 0, background: template.accent }} />
                      <span className="ts-recent-name" style={{ color: template.text }}>{template.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
        {filteredTemplates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', width: '100%' }}>
            <p className="ts-page-sub" style={{ margin: 0 }}>No templates found matching your search.</p>
          </div>
        ) : (
          <div className="ts-grid">
            {filteredTemplates.map(t => (
              <div
                key={t.id}
                className={`ts-card ${selectedId === t.id ? 'selected' : ''}`}
                onClick={() => handleSelect(t)}
              >
                {selectedId === t.id && (
                  <div className="ts-selected-badge">✓</div>
                )}

                <ThumbPreview
                  t={t}
                  isAiRecommended={recommendedIds.has(t.id)}
                  isSelected={selectedId === t.id}
                  isFavorited={favorites.includes(t.id)}
                  onToggleFavorite={toggleFavorite}
                />

                <div className="ts-card-info">
                  <div className="ts-card-name">{t.name}</div>
                  <div className="ts-card-desc">{t.desc}</div>
                  <div className="ts-card-tags">
                    {compatibilityScores[t.id] !== undefined && (
                      <span className="ts-card-tag ts-compatibility-tag">
                        ⚡ {compatibilityScores[t.id]}% Match
                      </span>
                    )}
                    {t.tags.map(tag => (
                      <span key={tag} className="ts-card-tag">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Hover Overlay Actions */}
                <div className="ts-card-overlay">
                  <button
                    className="ts-overlay-use-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(t);
                    }}
                  >
                    Use Template
                  </button>
                  <button
                    className="ts-overlay-prev-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(t);
                    }}
                  >
                    <Eye size={13} style={{ display: 'inline', marginRight: 2 }} /> Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Custom Template Section */}
        <UploadTemplateSection onSelectUploadedTemplate={handleSelectUploadedTemplate} />
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
        <TemplatePreviewModal
          t={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => handleSelect(previewTemplate)}
          compatibilityScore={compatibilityScores[previewTemplate.id]}
          slideCount={(previewTemplate.id.charCodeAt(0) % 7) + 6}
        />
      )}
    </div>
  );
}
