import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getGuestSessionId } from '../services/auth';
import { exportToPptx } from '../services/pptxExporter';
import {
  Sparkles, Download, Layout, Plus, Trash2,
  ChevronLeft, Type, Image as ImageIcon, Shapes, Grid,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  Undo, Redo, Play, Check, Save, RefreshCw
} from 'lucide-react';
import '../styles/Editor.css';
import AIImagePanel from '../components/AIImagePanel';
import {
  fetchAllSlideImages,
  fetchSlideImages,
  markImageUsed,
  clearUsedImages,
} from '../services/imageSearch';

/* ════════════════════════════════════════════════
   8 PROFESSIONAL THEME DEFINITIONS
════════════════════════════════════════════════ */
const THEMES = {
  classic: {
    name: 'Classic',
    preview: { bg: '#ffffff', accent: '#1a56db', text: '#1e293b' },
    '--slide-bg': '#ffffff',
    '--slide-accent': '#1a56db',
    '--slide-text': '#1e293b',
    '--slide-text-secondary': '#64748b',
    '--slide-title-color': '#1e3a8a',
    '--slide-title-font': '"Inter", sans-serif',
    '--slide-body-font': '"Inter", sans-serif',
    '--slide-card-bg': 'rgba(26,86,219,0.06)',
    '--slide-border': 'rgba(26,86,219,0.18)',
    '--slide-bullet-color': '#1a56db',
  },
  sunset: {
    name: 'Sunset',
    preview: { bg: 'linear-gradient(135deg,#ff8c55 0%,#ffd6a5 100%)', accent: '#c2410c', text: '#3b1a08' },
    '--slide-bg': 'linear-gradient(135deg, #ff8c55 0%, #ffcd9c 55%, #fff3e0 100%)',
    '--slide-accent': '#c2410c',
    '--slide-text': '#3b1a08',
    '--slide-text-secondary': '#7c2d12',
    '--slide-title-color': '#1c0a00',
    '--slide-title-font': '"Playfair Display", serif',
    '--slide-body-font': '"Inter", sans-serif',
    '--slide-card-bg': 'rgba(194,65,12,0.1)',
    '--slide-border': 'rgba(194,65,12,0.25)',
    '--slide-bullet-color': '#c2410c',
  },
  forest: {
    name: 'Forest',
    preview: { bg: '#f0f7ee', accent: '#2d6a4f', text: '#1a3a2a' },
    '--slide-bg': '#f0f7ee',
    '--slide-accent': '#2d6a4f',
    '--slide-text': '#1a3a2a',
    '--slide-text-secondary': '#40916c',
    '--slide-title-color': '#1b4332',
    '--slide-title-font': '"Merriweather", serif',
    '--slide-body-font': '"Inter", sans-serif',
    '--slide-card-bg': 'rgba(45,106,79,0.09)',
    '--slide-border': 'rgba(45,106,79,0.2)',
    '--slide-bullet-color': '#2d6a4f',
  },
  cyberpunk: {
    name: 'Cyberpunk',
    preview: { bg: '#0a0f1e', accent: '#00f5ff', text: '#e2e8f0' },
    '--slide-bg': '#0a0f1e',
    '--slide-accent': '#00f5ff',
    '--slide-text': '#e2e8f0',
    '--slide-text-secondary': '#94a3b8',
    '--slide-title-color': '#00f5ff',
    '--slide-title-font': '"Fira Code", monospace',
    '--slide-body-font': '"Fira Code", monospace',
    '--slide-card-bg': 'rgba(0,245,255,0.07)',
    '--slide-border': 'rgba(0,245,255,0.28)',
    '--slide-bullet-color': '#a855f7',
  },
  corporate: {
    name: 'Corporate',
    preview: { bg: '#f8fafc', accent: '#1e40af', text: '#0f172a' },
    '--slide-bg': '#f8fafc',
    '--slide-accent': '#1e40af',
    '--slide-text': '#0f172a',
    '--slide-text-secondary': '#475569',
    '--slide-title-color': '#1e3a8a',
    '--slide-title-font': '"Inter", sans-serif',
    '--slide-body-font': '"Inter", sans-serif',
    '--slide-card-bg': 'rgba(30,64,175,0.05)',
    '--slide-border': 'rgba(30,64,175,0.14)',
    '--slide-bullet-color': '#1e40af',
  },
  academic: {
    name: 'Academic',
    preview: { bg: '#fafaf7', accent: '#92400e', text: '#1c1917' },
    '--slide-bg': '#fafaf7',
    '--slide-accent': '#92400e',
    '--slide-text': '#1c1917',
    '--slide-text-secondary': '#78716c',
    '--slide-title-color': '#78350f',
    '--slide-title-font': '"Merriweather", serif',
    '--slide-body-font': '"Merriweather", serif',
    '--slide-card-bg': 'rgba(146,64,14,0.06)',
    '--slide-border': 'rgba(146,64,14,0.2)',
    '--slide-bullet-color': '#92400e',
  },
  technology: {
    name: 'Technology',
    preview: { bg: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)', accent: '#38bdf8', text: '#e2e8f0' },
    '--slide-bg': 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
    '--slide-accent': '#38bdf8',
    '--slide-text': '#e2e8f0',
    '--slide-text-secondary': '#94a3b8',
    '--slide-title-color': '#7dd3fc',
    '--slide-title-font': '"Inter", sans-serif',
    '--slide-body-font': '"Inter", sans-serif',
    '--slide-card-bg': 'rgba(56,189,248,0.09)',
    '--slide-border': 'rgba(56,189,248,0.24)',
    '--slide-bullet-color': '#38bdf8',
  },
  marketing: {
    name: 'Marketing',
    preview: { bg: 'linear-gradient(135deg,#7c3aed 0%,#db2777 100%)', accent: '#fbbf24', text: '#ffffff' },
    '--slide-bg': 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    '--slide-accent': '#fbbf24',
    '--slide-text': '#ffffff',
    '--slide-text-secondary': 'rgba(255,255,255,0.78)',
    '--slide-title-color': '#ffffff',
    '--slide-title-font': '"Outfit", sans-serif',
    '--slide-body-font': '"Inter", sans-serif',
    '--slide-card-bg': 'rgba(255,255,255,0.14)',
    '--slide-border': 'rgba(255,255,255,0.32)',
    '--slide-bullet-color': '#fbbf24',
  },
};

/* ════════════════════════════════════════════════
   THEME DECORATIONS — unique SVG/div elements
════════════════════════════════════════════════ */
function SlideThemeDecor({ theme }) {
  const s = { position: 'absolute', pointerEvents: 'none' };

  if (theme === 'classic') return (
    <>
      <div style={{ ...s, left: 0, top: 0, width: 8, height: '100%', background: 'var(--slide-accent)', borderRadius: '4px 0 0 4px', opacity: 0.9 }} />
      <div style={{ ...s, top: -35, right: -35, width: 140, height: 140, borderRadius: '50%', border: '16px solid rgba(26,86,219,0.09)' }} />
      <div style={{ ...s, bottom: -18, right: 55, width: 60, height: 60, borderRadius: '50%', background: 'rgba(26,86,219,0.06)' }} />
      <div style={{ ...s, bottom: 28, left: 42, right: 42, height: 1, background: 'linear-gradient(90deg,var(--slide-accent),transparent)', opacity: 0.18 }} />
    </>
  );

  if (theme === 'sunset') return (
    <>
      <svg style={{ ...s, top: -55, left: -55, width: 260, height: 260, opacity: 0.22 }} viewBox="0 0 200 200">
        <path fill="#ff6b35" d="M47.3,-62.5C59.4,-53.6,66,-37.2,70.6,-19.9C75.1,-2.6,77.6,15.5,72.3,31.5C66.9,47.4,53.7,61.1,38.5,68.5C23.4,75.8,6.2,76.7,-10.7,73.3C-27.6,69.9,-44.1,62.1,-57.1,49.8C-70.1,37.4,-79.6,20.4,-79.2,3.6C-78.8,-13.2,-68.5,-29.9,-56.1,-43.1C-43.7,-56.3,-29.2,-66,-13.6,-69.3C2,-72.6,35.2,-71.4,47.3,-62.5Z" transform="translate(100 100)" />
      </svg>
      <svg style={{ ...s, bottom: 0, left: 0, width: '100%', height: '38%', opacity: 0.17 }} viewBox="0 0 960 200" preserveAspectRatio="none">
        <path fill="#c2410c" d="M0,80C160,150,320,20,480,80C640,150,800,20,960,80L960,200L0,200Z" />
      </svg>
      <div style={{ ...s, top: '42%', right: 22, width: 75, height: 75, borderRadius: '50%', background: 'rgba(194,65,12,0.13)', transform: 'translateY(-50%)' }} />
    </>
  );

  if (theme === 'forest') return (
    <>
      <svg style={{ ...s, top: -18, right: -18, width: 175, height: 175, opacity: 0.15 }} viewBox="0 0 200 200">
        <path fill="#2d6a4f" d="M100,10C150,10,190,50,190,100C190,140,160,175,120,185C100,190,80,185,100,10Z" />
        <path fill="#40916c" d="M100,10C50,10,10,50,10,100C10,140,40,175,80,185C100,190,120,185,100,10Z" opacity="0.55" />
      </svg>
      <svg style={{ ...s, bottom: -28, left: -28, width: 155, height: 155, opacity: 0.12 }} viewBox="0 0 200 200">
        <path fill="#1b4332" d="M47,-57.2C59.5,-48.7,67.5,-32.8,69.4,-16.8C71.3,-0.8,67.1,15.3,59.4,29.5C51.7,43.8,40.5,56.1,26.7,62.5C12.9,68.9,-3.5,69.3,-19.6,65.1C-35.7,60.8,-51.5,51.9,-60.8,38.4C-70.1,24.9,-72.9,6.8,-69,-9.5C-65.1,-25.8,-54.5,-40.3,-41.3,-49.1C-28.1,-57.8,-12.5,-60.8,3.5,-65.1C19.5,-69.4,34.5,-65.7,47,-57.2Z" transform="translate(100 100)" />
      </svg>
      <div style={{ ...s, left: 0, top: '18%', width: 5, height: '64%', background: 'var(--slide-accent)', borderRadius: 10, opacity: 0.55 }} />
    </>
  );

  if (theme === 'cyberpunk') return (
    <>
      <svg style={{ ...s, top: 0, left: 0, width: '100%', height: '100%', opacity: 0.07 }}>
        <defs>
          <pattern id="cp-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0L0 0 0 32" fill="none" stroke="#00f5ff" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cp-grid)" />
      </svg>
      <div style={{ ...s, left: 0, top: 0, width: 4, height: '100%', background: 'linear-gradient(180deg,#00f5ff,#a855f7)', boxShadow: '0 0 20px #00f5ff88' }} />
      <div style={{ ...s, top: 0, left: 4, right: 0, height: 3, background: 'linear-gradient(90deg,#00f5ff88,transparent)' }} />
      <div style={{ ...s, top: 20, right: 20, width: 58, height: 58, border: '2px solid rgba(0,245,255,0.45)', transform: 'rotate(45deg)', boxShadow: '0 0 14px rgba(0,245,255,0.25)' }} />
      <div style={{ ...s, bottom: -55, right: -55, width: 210, height: 210, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.2) 0%,transparent 70%)' }} />
    </>
  );

  if (theme === 'corporate') return (
    <>
      <div style={{ ...s, top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg,var(--slide-accent),#60a5fa,transparent)' }} />
      <div style={{ ...s, left: 30, top: 6, width: 3, height: '70%', background: 'var(--slide-accent)', opacity: 0.17 }} />
      <div style={{ ...s, bottom: -48, right: -48, width: 180, height: 180, borderRadius: '50%', border: '24px solid rgba(30,64,175,0.055)' }} />
      <svg style={{ ...s, top: 18, right: 18, width: 88, height: 88, opacity: 0.1 }} viewBox="0 0 88 88">
        {[0,1,2,3].map(r => [0,1,2,3].map(c => (
          <circle key={`${r}-${c}`} cx={c * 22 + 11} cy={r * 22 + 11} r={3.5} fill="var(--slide-accent)" />
        )))}
      </svg>
    </>
  );

  if (theme === 'academic') return (
    <>
      <div style={{ ...s, top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg,transparent,var(--slide-accent),transparent)', opacity: 0.28 }} />
      <svg style={{ ...s, bottom: 20, left: '50%', transform: 'translateX(-50%)', width: 140, height: 22, opacity: 0.18 }} viewBox="0 0 140 22">
        <path d="M0,11C23,0,47,22,70,11C93,0,117,22,140,11" stroke="var(--slide-accent)" strokeWidth="1.5" fill="none" />
      </svg>
      <svg style={{ ...s, top: 10, right: 10, width: 75, height: 75, opacity: 0.13 }} viewBox="0 0 75 75">
        <path d="M75,0C75,42,42,75,0,75" stroke="var(--slide-accent)" strokeWidth="2" fill="none" />
        <path d="M75,18C75,50,50,75,18,75" stroke="var(--slide-accent)" strokeWidth="1" fill="none" />
      </svg>
      <div style={{ ...s, bottom: 24, left: 34, right: 34, height: 1, background: 'var(--slide-accent)', opacity: 0.13 }} />
    </>
  );

  if (theme === 'technology') return (
    <>
      <svg style={{ ...s, top: 0, left: 0, width: '100%', height: '100%', opacity: 0.06 }} viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice">
        <path d="M0,100H220V200H440V100H620" stroke="#38bdf8" strokeWidth="1" fill="none" />
        <path d="M960,420H720V310H520V420H300" stroke="#38bdf8" strokeWidth="1" fill="none" />
        {[[220,100],[440,200],[620,100],[720,310],[520,420]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#38bdf8" />
        ))}
      </svg>
      <div style={{ ...s, top: 0, right: 0, width: '28%', height: '100%', background: 'linear-gradient(270deg,rgba(56,189,248,0.09),transparent)' }} />
      <div style={{ ...s, top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,transparent,#38bdf8,transparent)' }} />
      <svg style={{ ...s, bottom: 20, right: 38, width: 54, height: 62, opacity: 0.2 }} viewBox="0 0 54 62">
        <polygon points="27,2 52,16 52,46 27,60 2,46 2,16" stroke="#38bdf8" strokeWidth="2" fill="none" />
      </svg>
    </>
  );

  if (theme === 'marketing') return (
    <>
      <svg style={{ ...s, top: -24, right: -24, width: 220, height: 220, opacity: 0.19 }} viewBox="0 0 220 220">
        <polygon points="220,0 220,135 85,0" fill="#fbbf24" />
      </svg>
      <svg style={{ ...s, bottom: -24, left: -24, width: 200, height: 200, opacity: 0.17 }} viewBox="0 0 200 200">
        <polygon points="0,200 135,200 0,65" fill="rgba(255,255,255,0.38)" />
      </svg>
      <div style={{ ...s, bottom: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#fbbf24,transparent)' }} />
      <div style={{ ...s, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.07) 0%,transparent 70%)' }} />
    </>
  );

  return null;
}

/* ════════════════════════════════════════════════
   THEME MINI TILE (sidebar preview)
════════════════════════════════════════════════ */
function ThemeTile({ id, theme, isActive, onSelect, onHover, onLeave }) {
  const p = theme.preview;
  return (
    <div
      className={`adv-theme-tile ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(id)}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={onLeave}
      title={theme.name}
    >
      <div className="theme-tile-preview" style={{ background: p.bg }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 4, height: '100%', background: p.accent }} />
        <div style={{ position: 'absolute', top: '22%', left: 8, right: 12, height: 4, borderRadius: 2, background: p.accent, opacity: 0.9 }} />
        <div style={{ position: 'absolute', top: '47%', left: 8, right: 18, height: 2.5, borderRadius: 1, background: p.text, opacity: 0.35 }} />
        <div style={{ position: 'absolute', top: '62%', left: 8, right: 22, height: 2.5, borderRadius: 1, background: p.text, opacity: 0.25 }} />
        <div style={{ position: 'absolute', top: '77%', left: 8, right: 26, height: 2.5, borderRadius: 1, background: p.text, opacity: 0.18 }} />
        {isActive && (
          <div className="theme-tile-check">
            <Check size={8} color="#fff" />
          </div>
        )}
      </div>
      <span className="theme-tile-label">{theme.name}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN EDITOR
════════════════════════════════════════════════ */
export default function MainEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const guestSessionId = getGuestSessionId();

  const [presentation, setPresentation] = useState(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('templates');
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ── Image state ──
  // Map: slideIndex → { primary, alternatives, keywords, query }
  const [slideImages, setSlideImages] = useState(new Map());
  const [imageLoadingIdx, setImageLoadingIdx] = useState(null);
  // Track every image ID used to guarantee no duplicates across slides
  const usedImageIdsRef = useRef(new Set());

  // ── Auto-fetch images whenever presentation loads ──
  const fetchImagesForPresentation = useCallback(async (slides, meta) => {
    if (!slides || slides.length === 0) return;
    clearUsedImages();
    usedImageIdsRef.current.clear();
    try {
      const imgMap = await fetchAllSlideImages(slides, meta, 5);
      // Record all primary IDs as used
      imgMap.forEach(entry => {
        if (entry.primary?.id) usedImageIdsRef.current.add(entry.primary.id);
      });
      setSlideImages(imgMap);
    } catch (e) {
      console.warn('Image prefetch failed:', e);
    }
  }, []);

  // ── Refresh images for a single slide ──
  const refreshSlideImage = useCallback(async (idx, slide, meta) => {
    setImageLoadingIdx(idx);
    try {
      const result = await fetchSlideImages(slide, meta, usedImageIdsRef.current, 5);
      if (result.primary?.id) {
        usedImageIdsRef.current.add(result.primary.id);
        markImageUsed(result.primary.id);
      }
      setSlideImages(prev => {
        const next = new Map(prev);
        next.set(idx, result);
        return next;
      });
    } catch (e) {
      console.warn('Single slide image refresh failed:', e);
    } finally {
      setImageLoadingIdx(null);
    }
  }, []);

  // ── Handle "Add Image" from AI panel ──
  const handleAddImageFromPanel = useCallback((image) => {
    markImageUsed(image.id);
    usedImageIdsRef.current.add(image.id);
    setSlideImages(prev => {
      const next = new Map(prev);
      const current = next.get(activeSlideIdx) || {};
      next.set(activeSlideIdx, { ...current, primary: image });
      return next;
    });
  }, [activeSlideIdx]);

  const loadPresentation = async () => {
    try {
      setLoading(true);
      if (id.startsWith('pres_')) {
        const demoSlides = [
          { layout: 'title',   title: 'Welcome to DeckFlow AI',  content: ['Your intelligent presentation assistant'] },
          { layout: 'bullets', title: 'Key Features',            content: ['Auto Generation', 'Smart Formatting', 'Export to PPTX'] },
          { layout: 'columns', title: 'Our Pillars',             content: ['Innovation', 'Efficiency', 'Impact'] },
        ];
        const demoMeta = { title: 'DeckFlow AI Presentation', topic: 'AI presentation builder', audience: 'business', tone: 'professional' };
        setPresentation({ title: 'Generated Presentation', theme: 'classic', slides: demoSlides });
        fetchImagesForPresentation(demoSlides, demoMeta);
      } else {
        const response = await api.get(`/api/presentations/${id}?guestSessionId=${guestSessionId}`);
        setPresentation(response.data);
        const meta = { title: response.data.title, topic: response.data.title, audience: '', tone: 'professional' };
        fetchImagesForPresentation(response.data.slides, meta);
      }
    } catch (err) {
      alert('Could not open presentation. Redirecting to home.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPresentation(); }, [id]);

  /* ── Handlers ── */

  const handleSave = async () => {
    if (!presentation) return;
    setSaving(true);
    try {
      if (!id.startsWith('pres_')) {
        await api.put(`/api/presentations/${id}`, { ...presentation, guestSessionId });
      }
      setTimeout(() => { alert('Presentation saved.'); setSaving(false); }, 800);
    } catch (err) {
      alert(err.message || 'Saving failed.');
      setSaving(false);
    }
  };

  const handleDownload = () => { if (presentation) exportToPptx(presentation); };

  // Smooth theme transition — fade out → change → fade in
  const handleThemeChange = (themeName) => {
    if (presentation?.theme === themeName) return;
    setIsTransitioning(true);
    setHoveredTheme(null);
    setTimeout(() => {
      setPresentation(prev => ({ ...prev, theme: themeName }));
      setIsTransitioning(false);
    }, 220);
  };

  // Smooth layout transition — immutable update + fade
  const handleLayoutChange = (layoutName) => {
    if (!activeSlide || activeSlide.layout === layoutName) return;
    setIsTransitioning(true);
    setSelectedElement(null);
    setTimeout(() => {
      setPresentation(prev => ({
        ...prev,
        slides: prev.slides.map((slide, idx) =>
          idx === activeSlideIdx ? { ...slide, layout: layoutName } : slide
        )
      }));
      setIsTransitioning(false);
    }, 220);
  };

  const handleTitleBlur = (e) => {
    const text = e.target.innerText;
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.map((s, i) => i === activeSlideIdx ? { ...s, title: text } : s)
    }));
  };

  const handleBulletBlur = (bulletIdx, text) => {
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.map((s, i) => {
        if (i !== activeSlideIdx) return s;
        const content = [...s.content];
        content[bulletIdx] = text;
        return { ...s, content };
      })
    }));
  };

  const handleAddSlide = () => {
    const newIdx = presentation.slides.length;
    setPresentation(prev => ({
      ...prev,
      slides: [...prev.slides, { title: 'New Slide', content: ['First point'], layout: 'bullets' }]
    }));
    setActiveSlideIdx(newIdx);
  };

  const handleDeleteSlide = (index) => {
    if (presentation.slides.length <= 1) return alert('Cannot delete the last slide.');
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index)
    }));
    setActiveSlideIdx(0);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f3f4f6' }}>
        <div className="spinner" />
        <span style={{ marginLeft: '1rem', color: '#6b7280' }}>Loading editor workspace...</span>
      </div>
    );
  }

  /* ── Derived values ── */
  const activeSlide = presentation.slides[activeSlideIdx] || presentation.slides[0];
  const currentThemeId = presentation.theme || 'classic';
  const displayThemeId = hoveredTheme || currentThemeId;
  const displayTheme = THEMES[displayThemeId] || THEMES.classic;

  // CSS variables injected inline onto the slide-frame
  const themeStyle = Object.entries(displayTheme)
    .filter(([k]) => k.startsWith('--'))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

  /* ── Layout thumb renderers ── */
  const LayoutThumbIcon = ({ type }) => {
    const bar = (w, op = 1) => (
      <div style={{ width: `${w}%`, height: 3, borderRadius: 2, background: 'currentColor', marginBottom: 3, opacity: op }} />
    );
    if (type === 'title') return <div style={{ textAlign: 'center' }}>{bar(55)}{bar(40, 0.5)}</div>;
    if (type === 'bullets') return <>{bar(85)}{bar(70, 0.65)}{bar(60, 0.45)}</>;
    if (type === 'columns') return (
      <div style={{ display: 'flex', gap: 3 }}>
        {[1,1,1].map((_, i) => <div key={i} style={{ flex: 1, height: 20, background: 'currentColor', borderRadius: 2, opacity: 0.8 }} />)}
      </div>
    );
    if (type === 'stats') return (
      <div style={{ display: 'flex', gap: 3 }}>
        {[1,1].map((_, i) => <div key={i} style={{ flex: 1, height: 16, background: 'currentColor', borderRadius: 2 }} />)}
      </div>
    );
    if (type === 'timeline') return (
      <div style={{ position: 'relative', height: 14, width: '100%' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'currentColor', transform: 'translateY(-50%)' }} />
        {[0.2, 0.5, 0.8].map((pos, i) => (
          <div key={i} style={{ position: 'absolute', top: '50%', left: `${pos * 100}%`, width: 7, height: 7, borderRadius: '50%', background: 'currentColor', transform: 'translate(-50%,-50%)' }} />
        ))}
      </div>
    );
    return null;
  };

  /* ═══════ RENDER ═══════ */
  return (
    <div className="adv-editor-layout" data-theme={currentThemeId}>

      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Merriweather:wght@400;700&family=Fira+Code:wght@400;500;600&family=Outfit:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Top Bar ── */}
      <header className="adv-topbar">
        <div className="adv-topbar-left">
          <button onClick={() => navigate('/')} className="adv-icon-btn"><ChevronLeft size={20} /></button>
          <div className="adv-file-menu">
            <span className="adv-doc-title">{presentation.title}</span>
            <div className="adv-menu-links">
              {['File','Edit','View','Insert','Format','Slide','Arrange','Tools','Help'].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>
        <div className="adv-topbar-center">
          <button className="adv-tool-btn" title="Undo"><Undo size={16} /></button>
          <button className="adv-tool-btn" title="Redo"><Redo size={16} /></button>
          <div className="adv-divider" />
          <button className="adv-tool-btn"><Play size={16} /> Present</button>
        </div>
        <div className="adv-topbar-right">
          <button onClick={handleSave} className="adv-btn adv-btn-secondary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleDownload} className="adv-btn adv-btn-primary">
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      {/* ── Format Toolbar ── */}
      <div className="adv-format-toolbar">
        <select className="adv-font-select">
          <option>Inter</option><option>Roboto</option><option>Playfair Display</option><option>Merriweather</option>
        </select>
        <div className="adv-font-size-control">
          <button>−</button><span>24</span><button>+</button>
        </div>
        <div className="adv-divider" />
        <button className="adv-format-btn" title="Bold"><Bold size={16} /></button>
        <button className="adv-format-btn" title="Italic"><Italic size={16} /></button>
        <button className="adv-format-btn" title="Underline"><Underline size={16} /></button>
        <div className="adv-divider" />
        <button className="adv-format-btn"><AlignLeft size={16} /></button>
        <button className="adv-format-btn"><AlignCenter size={16} /></button>
        <button className="adv-format-btn"><AlignRight size={16} /></button>
        <div className="adv-divider" />
        <button className="adv-format-btn" title="AI Rewrite"><Sparkles size={16} color="#8b5cf6" /></button>
      </div>

      <div className="adv-workspace">

        {/* ── Side Nav ── */}
        <nav className="adv-side-nav">
          {[
            { id: 'templates', icon: Layout,    label: 'Design'  },
            { id: 'uploads',   icon: ImageIcon, label: 'Images'  },
            { id: 'shapes',    icon: Shapes,    label: 'Shapes'  },
            { id: 'apps',      icon: Grid,      label: 'Apps'    },
          ].map(tab => (
            <button
              key={tab.id}
              className={`adv-nav-item ${activeSidebarTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveSidebarTab(tab.id)}
            >
              <tab.icon size={24} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Left Drawer ── */}
        <aside className="adv-drawer">
          {activeSidebarTab === 'templates' && (
            <div className="adv-drawer-content">
              <h3>Layouts</h3>
              <div className="adv-layout-grid">
                {['title','bullets','columns','stats','timeline'].map(l => (
                  <div
                    key={l}
                    className={`adv-layout-thumb ${activeSlide.layout === l ? 'active' : ''}`}
                    onClick={() => handleLayoutChange(l)}
                  >
                    <div className="layout-thumb-icon">
                      <LayoutThumbIcon type={l} />
                    </div>
                    <span>{l.charAt(0).toUpperCase() + l.slice(1)}</span>
                  </div>
                ))}
              </div>

              <h3 style={{ marginTop: '2rem' }}>Visual Themes</h3>
              <p className="adv-hint-text">Hover to preview · Click to apply</p>
              <div className="adv-theme-grid">
                {Object.entries(THEMES).map(([tid, theme]) => (
                  <ThemeTile
                    key={tid}
                    id={tid}
                    theme={theme}
                    isActive={currentThemeId === tid}
                    onSelect={handleThemeChange}
                    onHover={setHoveredTheme}
                    onLeave={() => setHoveredTheme(null)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── AI Images Tab ── */}
          {activeSidebarTab === 'uploads' && (
            <AIImagePanel
              slide={activeSlide}
              presentationMeta={{
                title: presentation.title,
                topic: presentation.title,
                audience: '',
                tone: 'professional',
              }}
              usedImageIds={usedImageIdsRef.current}
              onAddImage={handleAddImageFromPanel}
            />
          )}
        </aside>

        {/* ══════════════════════════════════════════
            CENTRAL CANVAS
        ══════════════════════════════════════════ */}
        <main className="adv-canvas-area">
          <div className="adv-canvas-wrapper">
            {/*
              KEY = slideIdx + layout + themeId
              Forces full unmount/remount on any of these changes,
              clearing contentEditable DOM state and preventing stacking.
            */}
            <div
              key={`${activeSlideIdx}-${activeSlide.layout}-${displayThemeId}`}
              className={`slide-frame layout-${activeSlide.layout} theme-${displayThemeId} ${isTransitioning ? 'slide-transitioning' : ''}`}
              style={themeStyle}
              onClick={() => setSelectedElement('background')}
            >
              {/* Unique decorative elements per theme */}
              <SlideThemeDecor theme={displayThemeId} />

              {/* Slide content layer */}
              <div className="slide-content-layer">

                {/* ── TITLE LAYOUT ── */}
                {activeSlide.layout === 'title' && (() => {
                  const imgData = slideImages.get(activeSlideIdx);
                  const bgImg   = imgData?.primary;
                  const isImgLoading = imageLoadingIdx === activeSlideIdx;
                  return (
                    <div className="slide-layout-title" style={bgImg ? { position: 'relative' } : {}}>
                      {/* Full-bleed background image */}
                      {bgImg && (
                        <div className="slide-title-bg-img">
                          <img src={bgImg.src} alt={bgImg.alt} />
                          <div className="slide-title-bg-overlay" />
                        </div>
                      )}
                      {isImgLoading && <div className="slide-img-shimmer slide-title-bg-img" />}
                      <div
                        className={`slide-main-title ${selectedElement === 'title' ? 'selected' : ''}`}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleTitleBlur}
                        onClick={e => { e.stopPropagation(); setSelectedElement('title'); }}
                        style={{
                          fontFamily: 'var(--slide-title-font)',
                          color: bgImg ? '#ffffff' : 'var(--slide-title-color)',
                          textShadow: bgImg ? '0 2px 12px rgba(0,0,0,0.55)' : 'none',
                          position: 'relative', zIndex: 3,
                        }}
                      >
                        {activeSlide.title}
                      </div>
                      <div className="slide-title-divider" style={{ background: bgImg ? 'rgba(255,255,255,0.7)' : 'var(--slide-accent)', position: 'relative', zIndex: 3 }} />
                      <div
                        className="slide-main-subtitle"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => handleBulletBlur(0, e.target.innerText)}
                        style={{
                          fontFamily: 'var(--slide-body-font)',
                          color: bgImg ? 'rgba(255,255,255,0.88)' : 'var(--slide-text-secondary)',
                          textShadow: bgImg ? '0 1px 6px rgba(0,0,0,0.5)' : 'none',
                          position: 'relative', zIndex: 3,
                        }}
                      >
                        {activeSlide.content[0] || 'Add a subtitle here'}
                      </div>
                      {/* Image refresh btn */}
                      <button
                        className="slide-img-refresh-btn"
                        title="Refresh image"
                        onClick={e => { e.stopPropagation(); refreshSlideImage(activeSlideIdx, activeSlide, { title: presentation.title, topic: presentation.title }); }}
                      >
                        <RefreshCw size={11} />
                      </button>
                    </div>
                  );
                })()}

                {/* ── BULLETS LAYOUT ── */}
                {activeSlide.layout === 'bullets' && (() => {
                  const imgData = slideImages.get(activeSlideIdx);
                  const sideImg = imgData?.primary;
                  const isImgLoading = imageLoadingIdx === activeSlideIdx;
                  return (
                    <div className={`slide-layout-bullets ${sideImg || isImgLoading ? 'has-image' : ''}`}>
                      <div className="slide-bullets-text">
                        <h2
                          className={`slide-heading ${selectedElement === 'title' ? 'selected' : ''}`}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={handleTitleBlur}
                          onClick={e => { e.stopPropagation(); setSelectedElement('title'); }}
                          style={{ fontFamily: 'var(--slide-title-font)', color: 'var(--slide-title-color)' }}
                        >
                          {activeSlide.title}
                        </h2>
                        <div className="slide-heading-bar" style={{ background: 'var(--slide-accent)' }} />
                        <ul className="slide-bullet-list" style={{ fontFamily: 'var(--slide-body-font)', color: 'var(--slide-text)' }}>
                          {activeSlide.content.map((bullet, bIdx) => (
                            <li key={bIdx} className="slide-bullet-item">
                              <span className="slide-bullet-dot" style={{ color: 'var(--slide-bullet-color)' }}>✦</span>
                              <div
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={e => handleBulletBlur(bIdx, e.target.innerText)}
                                style={{ flex: 1, outline: 'none' }}
                              >
                                {bullet}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Side image */}
                      {(sideImg || isImgLoading) && (
                        <div className="slide-bullets-img-col">
                          {isImgLoading
                            ? <div className="slide-img-shimmer" style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                            : <img
                                src={sideImg.src}
                                alt={sideImg.alt}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, display: 'block' }}
                              />
                          }
                          <button
                            className="slide-img-refresh-btn"
                            title="Refresh image"
                            onClick={e => { e.stopPropagation(); refreshSlideImage(activeSlideIdx, activeSlide, { title: presentation.title, topic: presentation.title }); }}
                          >
                            <RefreshCw size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* ── COLUMNS LAYOUT ── */}
                {activeSlide.layout === 'columns' && (
                  <div className="slide-layout-columns">
                    <h2
                      className="slide-heading"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={handleTitleBlur}
                      style={{ fontFamily: 'var(--slide-title-font)', color: 'var(--slide-title-color)' }}
                    >
                      {activeSlide.title}
                    </h2>
                    <div className="slide-heading-bar" style={{ background: 'var(--slide-accent)' }} />
                    <div className="slide-columns-grid">
                      {[0,1,2].map(i => {
                        const text = activeSlide.content[i] || `Column ${i + 1} content`;
                        return (
                          <div
                            key={i}
                            className="slide-column-card"
                            style={{ background: 'var(--slide-card-bg)', border: '1px solid var(--slide-border)' }}
                          >
                            <div className="slide-column-num" style={{ color: 'var(--slide-accent)', fontFamily: 'var(--slide-title-font)' }}>
                              0{i + 1}
                            </div>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={e => handleBulletBlur(i, e.target.innerText)}
                              style={{ fontFamily: 'var(--slide-body-font)', color: 'var(--slide-text)', outline: 'none', fontSize: '0.95rem' }}
                            >
                              {text}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── STATS LAYOUT ── */}
                {activeSlide.layout === 'stats' && (
                  <div className="slide-layout-stats">
                    <h2
                      className="slide-heading"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={handleTitleBlur}
                      style={{ fontFamily: 'var(--slide-title-font)', color: 'var(--slide-title-color)' }}
                    >
                      {activeSlide.title}
                    </h2>
                    <div className="slide-heading-bar" style={{ background: 'var(--slide-accent)' }} />
                    <div className="slide-stats-grid">
                      {[0,1,2].map(i => {
                        const stat = activeSlide.content[i] || `Metric ${i + 1}`;
                        return (
                          <div
                            key={i}
                            className="slide-stat-card"
                            style={{ background: 'var(--slide-card-bg)', border: '1px solid var(--slide-border)' }}
                          >
                            <div
                              className="slide-stat-value"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={e => handleBulletBlur(i, e.target.innerText)}
                              style={{ color: 'var(--slide-accent)', fontFamily: 'var(--slide-title-font)', outline: 'none' }}
                            >
                              {stat}
                            </div>
                            <div className="slide-stat-label" style={{ color: 'var(--slide-text-secondary)', fontFamily: 'var(--slide-body-font)' }}>
                              Key Metric {i + 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── TIMELINE LAYOUT ── */}
                {activeSlide.layout === 'timeline' && (
                  <div className="slide-layout-timeline">
                    <h2
                      className="slide-heading"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={handleTitleBlur}
                      style={{ fontFamily: 'var(--slide-title-font)', color: 'var(--slide-title-color)' }}
                    >
                      {activeSlide.title}
                    </h2>
                    <div className="slide-heading-bar" style={{ background: 'var(--slide-accent)' }} />
                    <div className="slide-timeline-track">
                      <div className="slide-timeline-line" style={{ background: 'var(--slide-border)' }} />
                      {(activeSlide.content.length < 3
                        ? [...activeSlide.content, ...Array(3 - activeSlide.content.length).fill('Milestone')]
                        : activeSlide.content.slice(0, 4)
                      ).map((item, i) => (
                        <div key={i} className={`slide-timeline-node node-${i % 2 === 0 ? 'top' : 'bottom'}`}>
                          <div className="slide-tl-dot" style={{ background: 'var(--slide-accent)' }} />
                          <div
                            className="slide-tl-card"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={e => handleBulletBlur(i, e.target.innerText)}
                            style={{ background: 'var(--slide-card-bg)', border: '1px solid var(--slide-border)', color: 'var(--slide-text)', fontFamily: 'var(--slide-body-font)', outline: 'none' }}
                          >
                            {item}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ── Filmstrip ── */}
          <div className="adv-filmstrip">
            {presentation.slides.map((slide, idx) => {
              const imgData = slideImages.get(idx);
              const thumbImg = imgData?.primary;
              return (
                <div
                  key={idx}
                  className={`adv-strip-thumb ${activeSlideIdx === idx ? 'active' : ''}`}
                  onClick={() => setActiveSlideIdx(idx)}
                  style={thumbImg ? {
                    backgroundImage: `url(${thumbImg.srcThumb || thumbImg.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : {}}
                >
                  <div className="adv-strip-num">{idx + 1}</div>
                  <div className="adv-strip-preview" style={thumbImg ? { background: 'rgba(0,0,0,0.5)', color:'#fff', borderRadius:3, padding:'1px 4px' } : {}}>
                    {(slide.title || 'Slide').substring(0, 16)}…
                  </div>
                  <button className="adv-strip-del" onClick={e => { e.stopPropagation(); handleDeleteSlide(idx); }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
            <button className="adv-add-slide-btn" onClick={handleAddSlide}><Plus size={20} /></button>
          </div>
        </main>

        {/* ── Right Properties Panel ── */}
        <aside className="adv-properties-panel">
          <div className="adv-prop-header"><h3>Properties</h3></div>
          <div className="adv-prop-body">
            {selectedElement ? (
              <div className="adv-prop-section">
                <label>Selected Element</label>
                <div className="adv-element-badge">Editing <b>{selectedElement}</b></div>
                <label style={{ marginTop: '1.25rem' }}>Animation</label>
                <select className="adv-select-full">
                  <option>None</option><option>Fade In</option><option>Slide Up</option><option>Pop</option><option>Zoom</option>
                </select>
                <label style={{ marginTop: '1.25rem' }}>Opacity</label>
                <input type="range" min="0" max="100" defaultValue="100" style={{ width: '100%' }} />
              </div>
            ) : (
              <div className="adv-prop-placeholder">
                Click any element on the canvas to edit its properties.
              </div>
            )}
            <div className="adv-notes-section">
              <label>Speaker Notes</label>
              <textarea
                className="adv-notes-input"
                placeholder="Add speaker notes here..."
                value={activeSlide.note || ''}
                onChange={e => {
                  setPresentation(prev => ({
                    ...prev,
                    slides: prev.slides.map((s, i) =>
                      i === activeSlideIdx ? { ...s, note: e.target.value } : s
                    )
                  }));
                }}
              />
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
