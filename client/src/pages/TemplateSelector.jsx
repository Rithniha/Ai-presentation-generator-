import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Presentation, CheckCircle, ArrowRight, Eye, X, Search, Heart, Sparkles, Filter, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useTemplateFilters } from '../hooks/useTemplateFilters';
import TemplatePreviewModal from '../components/TemplatePreviewModal';
import UploadTemplateSection from '../components/UploadTemplateSection';
import TemplateCardPreview from '../components/TemplateCardPreview';
import { TEMPLATES } from '../data/templates';
import '../styles/TemplateSelector.css';

const CATEGORIES = ['All', 'Business', 'Pitch', 'Education', 'Tech', 'Marketing', 'Healthcare', 'Creative', 'General'];

const COLLECTIONS = [
  { name: '🔥 Trending', icon: '🔥' },
  { name: '🤖 AI Collection', icon: '🤖' },
  { name: '🚀 Startup Collection', icon: '🚀' },
  { name: '💼 Corporate Collection', icon: '💼' },
  { name: '📚 Academic Collection', icon: '📚' },
  { name: '🏥 Healthcare Collection', icon: '🏥' },
  { name: '🎨 Creative Collection', icon: '🎨' },
  { name: '💰 Finance Collection', icon: '💰' }
];

const INDUSTRIES = ['All', 'Corporate', 'Startup', 'Education', 'Tech', 'Marketing', 'Finance', 'Healthcare', 'Creative', 'General'];
const STYLES = ['All', 'Corporate', 'Modern', 'Classic', 'Minimal', 'Creative'];
const COLORS = ['All', 'Blue', 'Green', 'Yellow', 'Pink', 'Dark', 'Light'];

/* ════════════════════════════════════════════════
   THUMBNAIL  (mini slide preview for each card)
   Cycles through 3-5 preview slides on hover.
   Displays premium badges like Premium, Trending, AI.
════════════════════════════════════════════════ */
function ThumbPreview({ t, isAiRecommended, isSelected, isFavorited, onToggleFavorite }) {
  const [slideType, setSlideType] = useState('cover');
  const hoverIntervalRef = useRef(null);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite(t.id);
  };

  const handleMouseEnter = () => {
    let index = 0;
    const slides = ['cover', 'content', 'timeline', 'chart', 'closing'];
    hoverIntervalRef.current = setInterval(() => {
      index = (index + 1) % slides.length;
      setSlideType(slides[index]);
    }, 1500);
  };

  const handleMouseLeave = () => {
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
    setSlideType('cover');
  };

  useEffect(() => {
    return () => {
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
    };
  }, []);

  return (
    <div 
      className="ts-thumb" 
      style={{ background: t.bg, padding: 0 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Dynamic slide rendering based on hover state ── */}
      <TemplateCardPreview t={t} slideType={slideType} />

      {/* ── Subtle bottom gradient so badges stay readable ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
        background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* ── Premium / Status Badges ── */}
      <div style={{
        position: 'absolute',
        top: '0.6rem',
        left: '0.6rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 10
      }}>
        {t.badges?.map((badge) => {
          let bg = 'rgba(255, 255, 255, 0.92)';
          let color = '#0f172a';
          if (badge.includes('Premium')) {
            bg = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
            color = '#ffffff';
          } else if (badge.includes('Trending')) {
            bg = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            color = '#ffffff';
          } else if (badge.includes('AI Generated')) {
            bg = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
            color = '#ffffff';
          } else if (badge.includes('Pick') || badge.includes('Editor')) {
            bg = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
            color = '#ffffff';
          } else if (badge.includes('🆕')) {
            bg = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            color = '#ffffff';
          }
          return (
            <span key={badge} style={{
              fontSize: '0.58rem',
              fontWeight: 800,
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              color: color,
              background: bg,
              border: '0.5px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(4px)',
              letterSpacing: '0.3px',
              textTransform: 'uppercase'
            }}>
              {badge}
            </span>
          );
        })}
      </div>

      {/* ── Heart Favorite Button ── */}
      <button
        className={`ts-favorite-btn ${isFavorited ? 'favorited' : ''}`}
        onClick={handleFavoriteClick}
        style={{
          position: 'absolute',
          top: '0.6rem',
          right: isSelected ? '2.6rem' : '0.6rem',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.92)',
          border: '1px solid rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isFavorited ? '#ef4444' : '#374151',
          zIndex: 10,
          padding: 0,
          outline: 'none',
          backdropFilter: 'blur(4px)',
        }}
        aria-label={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
      >
        <Heart size={14} fill={isFavorited ? '#ef4444' : 'none'} stroke={isFavorited ? '#ef4444' : 'currentColor'} />
      </button>

      {/* ── AI Recommended badge ── */}
      {isAiRecommended && (
        <div style={{
          position: 'absolute',
          top: '0.6rem',
          right: isSelected ? '4.85rem' : '2.85rem',
          fontSize: '0.62rem',
          fontWeight: 700,
          color: '#ffffff',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '0.15rem 0.45rem',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          zIndex: 5,
          backdropFilter: 'blur(4px)',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }} className="ts-ai-badge">
          <span>🤖 AI Recommended</span>
        </div>
      )}
    </div>
  );
}

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
  const [activeCollection, setActiveCollection] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Advanced Filters State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    industry: 'All',
    style: 'All',
    color: 'All',
    themeMode: 'All',
    animated: false,
    minimal: false,
    glassmorphism: false,
    premium: false,
    aiGenerated: false
  });

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

  const handleClearRecents = () => {
    try {
      localStorage.removeItem('deckflow_recent_templates');
      setRecentIds([]);
    } catch (e) {
      console.error(e);
    }
  };

  // Advanced filters reset helper
  const handleResetFilters = () => {
    setAdvancedFilters({
      industry: 'All',
      style: 'All',
      color: 'All',
      themeMode: 'All',
      animated: false,
      minimal: false,
      glassmorphism: false,
      premium: false,
      aiGenerated: false
    });
    setActiveCategory('All');
    setActiveCollection(null);
    setSearchQuery('');
  };

  // Hook handles filtering, sorting, compatibility scoring
  const { filteredTemplates, recommendedIds, compatibilityScores } = useTemplateFilters(
    TEMPLATES,
    activeCategory,
    searchQuery,
    presentationState,
    activeCollection,
    advancedFilters
  );

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId) || uploadedTemplate;

  // Memoize similar templates
  const similarTemplates = useMemo(() => {
    if (!selectedId) return [];
    const selected = TEMPLATES.find(t => t.id === selectedId);
    if (!selected) return [];
    return TEMPLATES
      .filter(t => t.id !== selectedId)
      .map(t => {
        let score = 0;
        if (t.category === selected.category) score += 3;
        if (t.industry === selected.industry) score += 2;
        if (t.style === selected.style) score += 1;
        return { template: t, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.template);
  }, [selectedId]);

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
    navigate('/generate', {
      state: {
        ...presentationState,
        selectedTheme: selectedId,
        selectedTemplate: selectedTemplate,
      }
    });
  };

  const handleCollectionSelect = (colName) => {
    if (activeCollection === colName) {
      setActiveCollection(null);
    } else {
      setActiveCollection(colName);
      // Clear category when using collection, for cleaner workflow
      setActiveCategory('All');
    }
  };

  const handleAdvancedFilterChange = (key, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [key]: value
    }));
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

        {/* Search & Collapsible Filters Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <div className="ts-search-container" style={{ margin: 0, flex: 1, minWidth: '280px' }}>
            <Search size={16} className="ts-search-icon" />
            <input
              type="text"
              className="ts-search-input"
              placeholder="Search templates by name, industry, tags, style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="ts-search-clear" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem',
              borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff',
              fontSize: '0.82rem', fontWeight: 600, color: '#475569', cursor: 'pointer',
              height: '38px', transition: 'all 0.15s'
            }}
          >
            <Filter size={14} />
            <span>Advanced Filters</span>
            {showAdvancedFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {(searchQuery || activeCollection || activeCategory !== 'All' || Object.values(advancedFilters).some(v => v === true || (typeof v === 'string' && v !== 'All'))) && (
            <button
              onClick={handleResetFilters}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px', padding: '0.5rem 0.8rem',
                borderRadius: '10px', border: 'none', background: 'transparent',
                fontSize: '0.82rem', fontWeight: 600, color: '#ef4444', cursor: 'pointer',
                height: '38px'
              }}
            >
              <RefreshCw size={12} />
              <span>Reset All</span>
            </button>
          )}
        </div>

        {/* Collapsible Advanced Filters Section */}
        {showAdvancedFilters && (
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px',
            padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            animation: 'fadeInSlide 0.2s ease-out'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Industry</label>
                <select
                  value={advancedFilters.industry}
                  onChange={(e) => handleAdvancedFilterChange('industry', e.target.value)}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', color: '#1e293b', outline: 'none' }}
                >
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Style</label>
                <select
                  value={advancedFilters.style}
                  onChange={(e) => handleAdvancedFilterChange('style', e.target.value)}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', color: '#1e293b', outline: 'none' }}
                >
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Color</label>
                <select
                  value={advancedFilters.color}
                  onChange={(e) => handleAdvancedFilterChange('color', e.target.value)}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', color: '#1e293b', outline: 'none' }}
                >
                  {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Theme Mode</label>
                <select
                  value={advancedFilters.themeMode}
                  onChange={(e) => handleAdvancedFilterChange('themeMode', e.target.value)}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', color: '#1e293b', outline: 'none' }}
                >
                  <option value="All">All</option>
                  <option value="Light">Light Backgrounds</option>
                  <option value="Dark">Dark Backgrounds</option>
                </select>
              </div>
            </div>

            {/* Checkboxes Row */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              {[
                { label: '✨ Animated', key: 'animated' },
                { label: '🌿 Minimalist', key: 'minimal' },
                { label: '🔮 Glassmorphism', key: 'glassmorphism' },
                { label: '⭐ Premium Only', key: 'premium' },
                { label: '🤖 AI Generated Only', key: 'aiGenerated' }
              ].map(item => (
                <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={advancedFilters[item.key]}
                    onChange={(e) => handleAdvancedFilterChange(item.key, e.target.checked)}
                    style={{ width: '14px', height: '14px', accentColor: '#4f46e5', cursor: 'pointer' }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Horizontal Featured Collections Row */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 className="ts-recent-title" style={{ marginBottom: '0.6rem' }}>Featured Collections</h3>
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.6rem', scrollbarWidth: 'thin' }}>
            {COLLECTIONS.map(col => {
              const isActive = activeCollection === col.name;
              return (
                <button
                  key={col.name}
                  onClick={() => handleCollectionSelect(col.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '0.55rem 1rem',
                    borderRadius: '8px', border: '1px solid',
                    borderColor: isActive ? '#4f46e5' : '#e2e8f0',
                    background: isActive ? '#4f46e5' : '#ffffff',
                    color: isActive ? '#ffffff' : '#475569',
                    fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                    whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{col.icon}</span>
                  <span>{col.name.replace(' Collection', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="ts-recent-section">
            <h3 className="ts-recent-title">❤️ Favorites</h3>
            <div className="ts-recent-row">
              {favorites.map(id => {
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

        {/* Recently Used Row */}
        {recentIds.length > 0 && (
          <div className="ts-recent-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <h3 className="ts-recent-title" style={{ margin: 0 }}>Recently Used</h3>
              <button 
                onClick={handleClearRecents}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.3px' }}
              >
                Clear Recent
              </button>
            </div>
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
        <div className="ts-filter-bar" style={{ marginTop: '0.5rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`ts-filter-pill ${activeCategory === cat && !activeCollection ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat);
                setActiveCollection(null); // Clear collection filter when category is clicked
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        {filteredTemplates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', width: '100%' }}>
            <p className="ts-page-sub" style={{ margin: 0 }}>No templates found matching your filter criteria.</p>
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
                  <div className="ts-card-name" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{t.name}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                      {t.slideCount || 12} slides
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 8px 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '38px' }}>
                    {t.desc}
                  </p>
                  
                  {/* Rich details badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', fontSize: '0.65rem', color: '#475569', marginBottom: '8px' }}>
                    <span style={{ padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 600 }}>📂 {t.category}</span>
                    <span style={{ padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 600 }}>💼 {t.industry || 'General'}</span>
                    <span style={{ padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 600 }}>✨ {t.style || 'Modern'}</span>
                    <span style={{ padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 600 }}>⚡ {t.animated ? 'Animated' : 'Static'}</span>
                  </div>

                  <div className="ts-card-tags" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '8px' }}>
                    {compatibilityScores[t.id] !== undefined && (
                      <span className="ts-card-tag ts-compatibility-tag">
                        ⚡ {compatibilityScores[t.id]}% Match
                      </span>
                    )}
                    {t.tags.slice(0, 2).map(tag => (
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

        {/* You may also like - Similar templates section */}
        {selectedId && similarTemplates.length > 0 && (
          <div className="ts-similar-section" style={{ marginTop: '3.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Heart size={16} fill="#ef4444" stroke="#ef4444" />
              <h3 className="ts-recent-title" style={{ margin: 0 }}>You may also like</h3>
            </div>
            <div className="ts-grid">
              {similarTemplates.map(t => (
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
                    <div className="ts-card-name" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{t.name}</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                        {t.slideCount || 12} slides
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 8px 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '38px' }}>
                      {t.desc}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', fontSize: '0.65rem', color: '#475569', marginBottom: '8px' }}>
                      <span style={{ padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 600 }}>📂 {t.category}</span>
                      <span style={{ padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 600 }}>💼 {t.industry || 'General'}</span>
                    </div>

                    <div className="ts-card-tags" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '8px' }}>
                      {compatibilityScores[t.id] !== undefined && (
                        <span className="ts-card-tag ts-compatibility-tag">
                          ⚡ {compatibilityScores[t.id]}% Match
                        </span>
                      )}
                    </div>
                  </div>

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
          </div>
        )}

        {/* Upload Custom Template Section */}
        <UploadTemplateSection 
          onSelectUploadedTemplate={handleSelectUploadedTemplate} 
          presentationState={presentationState}
        />
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
          slideCount={previewTemplate.slideCount || 15}
        />
      )}
    </div>
  );
}
