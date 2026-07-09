import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { getGuestSessionId } from '../services/auth';
import { exportToPptx } from '../services/pptxExporter';
import {
  Sparkles, Download, Layout, Plus, Trash2,
  ChevronLeft, Type, Image as ImageIcon, Shapes, Grid,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  Undo, Redo, Play, Check, Save, RefreshCw, Star, AlertCircle,
  Lock, Unlock, BarChart3, LayoutGrid, Package, Sigma, Network, Table
} from 'lucide-react';
import {
  analyzeContent,
  getThemeRecommendations,
  getLayoutRecommendations,
  recordUserSelection
} from '../services/recommendationEngine';
import '../styles/Editor.css';
import AIImagePanel from '../components/AIImagePanel';
import ContextualToolbar from '../components/ContextualToolbar';
import EditorPanels from '../components/EditorPanels';
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
  const location = useLocation();
  const guestSessionId = getGuestSessionId();

  const [presentation, setPresentation] = useState(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('templates');
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const [hoveredLayout, setHoveredLayout] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ── AI Recommendation and View States ──
  const [autoApply, setAutoApply] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [explainingId, setExplainingId] = useState(null);
  const [recommendationToast, setRecommendationToast] = useState(null);

  // ── Contextual Text Toolbar & Multi-Selection States ──
  const [selectedElements, setSelectedElements] = useState([]);
  const [styleClipboard, setStyleClipboard] = useState(null);
  const [toolbarPosition, setToolbarPosition] = useState(null);
  const [activePanel, setActivePanel] = useState(null);

  // ── Image state ──
  const [slideImages, setSlideImages] = useState(new Map());
  const [imageLoadingIdx, setImageLoadingIdx] = useState(null);
  const usedImageIdsRef = useRef(new Set());

  // ── Auto-fetch images ──
  const fetchImagesForPresentation = useCallback(async (slides, meta) => {
    if (!slides || slides.length === 0) return;
    clearUsedImages();
    usedImageIdsRef.current.clear();
    try {
      const imgMap = await fetchAllSlideImages(slides, meta, 5);
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
      const locationState = location.state || {};
      
      if (id.startsWith('pres_')) {
        const demoSlides = [
          { layout: 'title',   title: 'Welcome to DeckFlow AI',  content: ['Your intelligent presentation assistant'] },
          { layout: 'bullets', title: 'Key Features',            content: ['Auto Generation', 'Smart Formatting', 'Export to PPTX'] },
          { layout: 'columns', title: 'Our Pillars',             content: ['Innovation', 'Efficiency', 'Impact'] },
        ];
        
        setPresentation({ 
          title: locationState.title || 'Generated Presentation', 
          theme: locationState.selectedTheme || 'classic',
          topic: locationState.topic || locationState.requirements || 'AI Presentation Builder',
          audience: locationState.selectedRole || 'business',
          tone: locationState.tone || 'professional',
          purpose: locationState.purpose || 'business',
          industry: locationState.industry || '',
          brandStyle: locationState.brandStyle || '',
          slides: demoSlides 
        });
        
        const demoMeta = { 
          title: locationState.title || 'DeckFlow AI Presentation', 
          topic: locationState.requirements || 'AI presentation builder', 
          audience: locationState.selectedRole || 'business', 
          tone: locationState.tone || 'professional' 
        };
        fetchImagesForPresentation(demoSlides, demoMeta);
      } else {
        const response = await api.get(`/api/presentations/${id}?guestSessionId=${guestSessionId}`);
        setPresentation({
          ...response.data,
          topic: response.data.topic || locationState.requirements || '',
          audience: response.data.audience || locationState.selectedRole || '',
          tone: response.data.tone || locationState.tone || 'professional',
          purpose: response.data.purpose || '',
          industry: response.data.industry || '',
          brandStyle: response.data.brandStyle || '',
        });
        
        const meta = { 
          title: response.data.title, 
          topic: response.data.topic || response.data.title, 
          audience: response.data.audience || '', 
          tone: response.data.tone || 'professional' 
        };
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

  /* ════════════════════════════════════════════════
     CONTEXTUAL TOOLBAR AND OVERLAY ACTIONS
  ════════════════════════════════════════════════ */
  const getElementStyle = (key, baseStyles = {}) => {
    const activeSlide = presentation?.slides[activeSlideIdx];
    if (!activeSlide) return baseStyles;
    
    if (key.startsWith('el_')) {
      const el = (activeSlide.elements || []).find(e => e.id === key);
      const custom = el?.style || {};
      const merged = { ...baseStyles, ...custom };
      if (custom.locked) {
        merged.userSelect = 'none';
        merged.cursor = 'not-allowed';
      }
      return merged;
    }

    const slideStyles = activeSlide.styles || {};
    const plainStyles = slideStyles instanceof Map ? Object.fromEntries(slideStyles) : slideStyles;
    const custom = plainStyles[key] || {};
    const merged = { ...baseStyles, ...custom };
    if (custom.locked) {
      merged.userSelect = 'none';
      merged.cursor = 'not-allowed';
    }
    return merged;
  };

  const handleUpdateElementStyle = (key, styleChanges) => {
    setPresentation(prev => {
      if (!prev) return prev;
      const updatedSlides = prev.slides.map((s, idx) => {
        if (idx !== activeSlideIdx) return s;

        if (key.startsWith('el_')) {
          const elements = (s.elements || []).map(el => {
            if (el.id !== key) return el;
            return {
              ...el,
              style: {
                ...el.style,
                ...styleChanges
              }
            };
          });
          return { ...s, elements };
        }

        const currentStyles = s.styles || {};
        const plainStyles = currentStyles instanceof Map ? Object.fromEntries(currentStyles) : currentStyles;
        const elStyles = plainStyles[key] || {};
        return {
          ...s,
          styles: {
            ...plainStyles,
            [key]: {
              ...elStyles,
              ...styleChanges
            }
          }
        };
      });
      return { ...prev, slides: updatedSlides };
    });
  };

  const handleElementClick = (key, e) => {
    e.stopPropagation();
    const activeSlide = presentation?.slides[activeSlideIdx];
    const isLocked = (activeSlide?.styles instanceof Map ? activeSlide.styles.get(key) : activeSlide?.styles?.[key])?.locked;
    if (isLocked) {
      setSelectedElements([key]);
      return;
    }
    
    if (e.shiftKey) {
      if (selectedElements.includes(key)) {
        setSelectedElements(prev => prev.filter(k => k !== key));
      } else {
        setSelectedElements(prev => [...prev, key]);
      }
    } else {
      setSelectedElements([key]);
    }
  };

  const updateToolbarPosition = useCallback(() => {
    if (selectedElements.length === 0) {
      setToolbarPosition(null);
      return;
    }
    let minTop = Infinity;
    let minLeft = Infinity;
    let maxRight = -Infinity;
    let found = false;
    
    selectedElements.forEach(key => {
      const el = document.querySelector(`[data-el-key="${key}"]`);
      if (el) {
        found = true;
        const rect = el.getBoundingClientRect();
        if (rect.top < minTop) minTop = rect.top;
        if (rect.left < minLeft) minLeft = rect.left;
        if (rect.right > maxRight) maxRight = rect.right;
      }
    });
    
    if (!found) {
      setToolbarPosition(null);
      return;
    }
    
    const editorCanvas = document.querySelector('.adv-canvas-wrapper');
    if (!editorCanvas) return;
    const canvasRect = editorCanvas.getBoundingClientRect();
    
    let top = minTop - canvasRect.top - 68;
    let left = minLeft - canvasRect.left + (maxRight - minLeft) / 2 - 200;
    
    if (top < 10) top = minTop - canvasRect.top + 30;
    if (left < 10) left = 10;
    if (left + 420 > canvasRect.width) left = canvasRect.width - 430;
    
    setToolbarPosition({ top, left });
  }, [selectedElements]);

  useEffect(() => {
    updateToolbarPosition();
    window.addEventListener('resize', updateToolbarPosition);
    return () => window.removeEventListener('resize', updateToolbarPosition);
  }, [selectedElements, updateToolbarPosition]);

  const handleDragStart = (key, e) => {
    e.preventDefault();
    e.stopPropagation();
    const activeSlide = presentation?.slides[activeSlideIdx];
    let isLocked = false;
    if (key.startsWith('el_')) {
      const el = (activeSlide?.elements || []).find(x => x.id === key);
      isLocked = el?.locked;
    } else {
      isLocked = (activeSlide?.styles instanceof Map ? activeSlide.styles.get(key) : activeSlide?.styles?.[key])?.locked;
    }
    if (isLocked) return;

    const startX = e.clientX;
    const startY = e.clientY;

    let startLeft = 0;
    let startTop = 0;

    if (key.startsWith('el_')) {
      const el = (activeSlide?.elements || []).find(x => x.id === key);
      startLeft = parseFloat(el?.style?.left) || 150;
      startTop = parseFloat(el?.style?.top) || 150;
    } else {
      const currentStyles = (activeSlide?.styles instanceof Map ? Object.fromEntries(activeSlide.styles) : activeSlide?.styles) || {};
      const elStyles = currentStyles[key] || {};
      startLeft = parseFloat(elStyles.left) || 0;
      startTop = parseFloat(elStyles.top) || 0;
    }

    const handleMouseMove = (moveEvt) => {
      let newLeft = startLeft + (moveEvt.clientX - startX);
      let newTop = startTop + (moveEvt.clientY - startY);
      
      if (Math.abs(newLeft) < 10) newLeft = 0;
      if (Math.abs(newTop) < 10) newTop = 0;

      const positionType = key.startsWith('el_') ? 'absolute' : 'relative';
      handleUpdateElementStyle(key, {
        position: positionType,
        left: `${newLeft}px`,
        top: `${newTop}px`
      });
      updateToolbarPosition();
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (key, e) => {
    e.preventDefault();
    e.stopPropagation();
    const activeSlide = presentation?.slides[activeSlideIdx];
    let isLocked = false;
    if (key.startsWith('el_')) {
      const el = (activeSlide?.elements || []).find(x => x.id === key);
      isLocked = el?.locked;
    } else {
      isLocked = (activeSlide?.styles instanceof Map ? activeSlide.styles.get(key) : activeSlide?.styles?.[key])?.locked;
    }
    if (isLocked) return;

    const startX = e.clientX;
    const startY = e.clientY;

    let startWidth = 0;
    let startHeight = 0;
    let startSize = 24;

    if (key.startsWith('el_')) {
      const el = (activeSlide?.elements || []).find(x => x.id === key);
      startWidth = parseFloat(el?.style?.width) || 120;
      startHeight = parseFloat(el?.style?.height) || 120;
    } else {
      const elStyles = (activeSlide?.styles instanceof Map ? Object.fromEntries(activeSlide.styles) : activeSlide?.styles)?.[key] || {};
      startSize = parseInt(elStyles.fontSize) || 24;
    }

    const handleMouseMove = (moveEvt) => {
      const deltaX = moveEvt.clientX - startX;
      const deltaY = moveEvt.clientY - startY;

      if (key.startsWith('el_')) {
        const newWidth = Math.max(startWidth + deltaX, 20);
        const newHeight = Math.max(startHeight + deltaY, 20);
        handleUpdateElementStyle(key, {
          width: `${newWidth}px`,
          height: `${newHeight}px`
        });
      } else {
        const newSize = Math.max(startSize + deltaX * 0.2, 8);
        handleUpdateElementStyle(key, { fontSize: `${Math.round(newSize)}px` });
      }
      updateToolbarPosition();
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRotateStart = (key, e) => {
    e.preventDefault();
    e.stopPropagation();
    const activeSlide = presentation?.slides[activeSlideIdx];
    let isLocked = false;
    if (key.startsWith('el_')) {
      const el = (activeSlide?.elements || []).find(x => x.id === key);
      isLocked = el?.locked;
    } else {
      isLocked = (activeSlide?.styles instanceof Map ? activeSlide.styles.get(key) : activeSlide?.styles?.[key])?.locked;
    }
    if (isLocked) return;

    const el = document.querySelector(`[data-el-key="${key}"]`);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMouseMove = (moveEvt) => {
      const angle = Math.atan2(moveEvt.clientY - centerY, moveEvt.clientX - centerX);
      const degree = Math.round(angle * (180 / Math.PI)) - 90;
      handleUpdateElementStyle(key, { transform: `rotate(${degree}deg)` });
      updateToolbarPosition();
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDuplicateElement = (key) => {
    const activeSlide = presentation?.slides[activeSlideIdx];
    if (!activeSlide) return;

    if (key.startsWith('el_')) {
      const el = (activeSlide.elements || []).find(e => e.id === key);
      if (!el) return;
      const newEl = {
        ...el,
        id: `el_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        style: {
          ...el.style,
          left: `${parseFloat(el.style.left || 150) + 25}px`,
          top: `${parseFloat(el.style.top || 150) + 25}px`
        }
      };
      setPresentation(prev => ({
        ...prev,
        slides: prev.slides.map((s, i) => {
          if (i !== activeSlideIdx) return s;
          return {
            ...s,
            elements: [...(s.elements || []), newEl]
          };
        })
      }));
    } else if (key === 'title' || key === 'subtitle') {
      const currentStyles = (activeSlide.styles instanceof Map ? Object.fromEntries(activeSlide.styles) : activeSlide.styles) || {};
      const elStyles = currentStyles[key] || {};
      const left = parseFloat(elStyles.left) || 0;
      const top = parseFloat(elStyles.top) || 0;
      handleUpdateElementStyle(key, {
        left: `${left + 25}px`,
        top: `${top + 25}px`
      });
    } else if (key.startsWith('bullet-')) {
      const idx = parseInt(key.split('-')[1]);
      const bulletText = activeSlide.content[idx];
      setPresentation(prev => ({
        ...prev,
        slides: prev.slides.map((s, i) => {
          if (i !== activeSlideIdx) return s;
          const content = [...s.content];
          content.splice(idx + 1, 0, bulletText);
          return { ...s, content };
        })
      }));
    }
  };

  const handleDeleteElement = (key) => {
    const activeSlide = presentation?.slides[activeSlideIdx];
    if (!activeSlide) return;

    if (key.startsWith('el_')) {
      setPresentation(prev => ({
        ...prev,
        slides: prev.slides.map((s, i) => {
          if (i !== activeSlideIdx) return s;
          return {
            ...s,
            elements: (s.elements || []).filter(el => el.id !== key)
          };
        })
      }));
    } else if (key.startsWith('bullet-')) {
      const idx = parseInt(key.split('-')[1]);
      setPresentation(prev => ({
        ...prev,
        slides: prev.slides.map((s, i) => {
          if (i !== activeSlideIdx) return s;
          const content = s.content.filter((_, bulletIdx) => bulletIdx !== idx);
          return { ...s, content };
        })
      }));
    } else {
      if (key === 'title') {
        setPresentation(prev => ({
          ...prev,
          slides: prev.slides.map((s, i) => i === activeSlideIdx ? { ...s, title: '' } : s)
        }));
      }
    }
  };

  const handleAiTextAction = async (key, actionType) => {
    const el = document.querySelector(`[data-el-key="${key}"]`);
    if (!el) return;
    const currentText = el.innerText || el.textContent;
    setSaving(true);
    try {
      let rewritten = currentText;
      if (actionType === 'improve') {
        rewritten = `Optimized: ${currentText} (Enriched executive presentation vocabulary)`;
      } else if (actionType === 'rewrite') {
        rewritten = `Alternative version: ${currentText}`;
      } else if (actionType === 'shorten') {
        rewritten = currentText.length > 25 ? currentText.substring(0, 25) + '...' : currentText;
      } else if (actionType === 'expand') {
        rewritten = `${currentText} (expanding key customer strategies and target segments)`;
      } else if (actionType === 'grammar') {
        rewritten = currentText.trim();
      } else if (actionType === 'tone-professional') {
        rewritten = `Executive: ${currentText}`;
      } else if (actionType === 'tone-casual') {
        rewritten = `Hey, so: ${currentText}`;
      }
      
      if (key === 'title') {
        setPresentation(prev => ({
          ...prev,
          slides: prev.slides.map((s, i) => i === activeSlideIdx ? { ...s, title: rewritten } : s)
        }));
      } else if (key.startsWith('bullet-')) {
        const idx = parseInt(key.split('-')[1]);
        setPresentation(prev => ({
          ...prev,
          slides: prev.slides.map((s, i) => {
            if (i !== activeSlideIdx) return s;
            const content = [...s.content];
            content[idx] = rewritten;
            return { ...s, content };
          })
        }));
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setSaving(false);
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedElements.length === 0) return;
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      if (cmdCtrl) {
        if (e.key === 'b') {
          e.preventDefault();
          selectedElements.forEach(key => {
            const currentWeight = getElementStyle(key).fontWeight;
            handleUpdateElementStyle(key, { fontWeight: currentWeight === 'bold' ? 'normal' : 'bold' });
          });
        } else if (e.key === 'i') {
          e.preventDefault();
          selectedElements.forEach(key => {
            const currentStyle = getElementStyle(key).fontStyle;
            handleUpdateElementStyle(key, { fontStyle: currentStyle === 'italic' ? 'normal' : 'italic' });
          });
        } else if (e.key === 'u') {
          e.preventDefault();
          selectedElements.forEach(key => {
            const currentDec = getElementStyle(key).textDecoration;
            handleUpdateElementStyle(key, { textDecoration: currentDec === 'underline' ? 'none' : 'underline' });
          });
        } else if (e.key === 'd') {
          e.preventDefault();
          handleDuplicateElement(selectedElements[0]);
        }
      } else if (e.key === 'Delete') {
        selectedElements.forEach(key => handleDeleteElement(key));
        setSelectedElements([]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, presentation, activeSlideIdx]);

  const handleInsertElement = (type, content, defaultStyle = {}) => {
    const newEl = {
      id: `el_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      content,
      style: {
        position: 'absolute',
        left: '150px',
        top: '150px',
        width: type === 'text' ? '300px' : type === 'table' ? '400px' : '360px',
        height: type === 'text' ? 'auto' : type === 'table' ? '200px' : '220px',
        transform: 'rotate(0deg)',
        zIndex: 5,
        ...defaultStyle
      },
      locked: false
    };
    setPresentation(prev => {
      if (!prev) return prev;
      const updatedSlides = prev.slides.map((s, idx) => {
        if (idx !== activeSlideIdx) return s;
        const elements = [...(s.elements || []), newEl];
        return { ...s, elements };
      });
      return { ...prev, slides: updatedSlides };
    });
  };

  const handleApplyAutoLayout = (actionType) => {
    if (selectedElements.length === 0) return;
    const canvasWidth = 800;
    const canvasHeight = 450;

    selectedElements.forEach(key => {
      const el = document.querySelector(`[data-el-key="${key}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elWidth = rect.width;
      const elHeight = rect.height;
      let styleChanges = {};

      if (actionType === 'center') {
        styleChanges = {
          left: `${(canvasWidth - elWidth) / 2}px`,
          top: `${(canvasHeight - elHeight) / 2}px`
        };
      } else if (actionType === 'left') {
        styleChanges = { left: '40px' };
      } else if (actionType === 'right') {
        styleChanges = { left: `${canvasWidth - elWidth - 40}px` };
      } else if (actionType === 'top') {
        styleChanges = { top: '40px' };
      } else if (actionType === 'bottom') {
        styleChanges = { top: `${canvasHeight - elHeight - 40}px` };
      } else if (actionType === 'even-space') {
        const idx = selectedElements.indexOf(key);
        styleChanges = { left: `${40 + idx * 150}px` };
      } else if (actionType === 'smart-grid') {
        const idx = selectedElements.indexOf(key);
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        styleChanges = { left: `${40 + col * 240}px`, top: `${40 + row * 160}px` };
      } else if (actionType === 'equal-size') {
        styleChanges = { width: '200px', height: '150px' };
      }

      handleUpdateElementStyle(key, styleChanges);
    });
  };

  const handleElementTextChange = (elId, text) => {
    setPresentation(prev => {
      if (!prev) return prev;
      const updatedSlides = prev.slides.map((s, idx) => {
        if (idx !== activeSlideIdx) return s;
        const elements = (s.elements || []).map(el => {
          if (el.id !== elId) return el;
          return { ...el, content: text };
        });
        return { ...s, elements };
      });
      return { ...prev, slides: updatedSlides };
    });
  };

  const handleTableCellChange = (elId, rowIdx, colIdx, text) => {
    setPresentation(prev => {
      if (!prev) return prev;
      const updatedSlides = prev.slides.map((s, idx) => {
        if (idx !== activeSlideIdx) return s;
        const elements = (s.elements || []).map(el => {
          if (el.id !== elId) return el;
          const cells = el.content.cells.map((row, r) => 
            row.map((cell, c) => (r === rowIdx && c === colIdx) ? text : cell)
          );
          return {
            ...el,
            content: {
              ...el.content,
              cells
            }
          };
        });
        return { ...s, elements };
      });
      return { ...prev, slides: updatedSlides };
    });
  };

  const handleToolClick = (toolId) => {
    setActivePanel(prev => prev === toolId ? null : toolId);
  };

  const handleCanvasClick = (e) => {
    if (!e.target.closest('[data-el-key]') && !e.target.closest('.adv-contextual-toolbar')) {
      setSelectedElements([]);
    }
  };

  // ── AI Recommendation Logic ──
  const contentProfile = useMemo(() => {
    return analyzeContent(presentation, activeSlideIdx);
  }, [presentation, activeSlideIdx]);

  const themeRecommendations = useMemo(() => {
    return getThemeRecommendations(presentation, contentProfile);
  }, [presentation, contentProfile]);

  const layoutRecommendations = useMemo(() => {
    return getLayoutRecommendations(presentation, contentProfile, activeSlideIdx);
  }, [presentation, contentProfile, activeSlideIdx]);

  // Toast alert for continuous recommendation updates
  const prevRecLayoutIdRef = useRef(null);
  useEffect(() => {
    if (!layoutRecommendations || layoutRecommendations.length === 0) return;
    const topLayout = layoutRecommendations[0];
    
    // Alert if top recommendation layout changes
    if (prevRecLayoutIdRef.current && prevRecLayoutIdRef.current !== topLayout.id) {
      setRecommendationToast({
        id: topLayout.id,
        name: topLayout.name,
        reason: topLayout.reason
      });
      const timer = setTimeout(() => setRecommendationToast(null), 6000);
      return () => clearTimeout(timer);
    }
    prevRecLayoutIdRef.current = topLayout.id;
  }, [layoutRecommendations]);

  // Auto Apply AI Recommendations Effect
  useEffect(() => {
    if (!autoApply || !presentation || !themeRecommendations.length || !layoutRecommendations.length) return;
    
    let updated = false;
    let nextPresentation = { ...presentation };
    
    // Auto-apply recommended theme
    const topThemeId = themeRecommendations[0].id;
    if (presentation.theme !== topThemeId) {
      nextPresentation.theme = topThemeId;
      updated = true;
    }

    // Auto-apply recommended layout for active slide
    const topLayoutId = layoutRecommendations[0].id;
    const activeSlide = presentation.slides[activeSlideIdx];
    if (activeSlide && activeSlide.layout !== topLayoutId) {
      nextPresentation.slides = presentation.slides.map((s, idx) => 
        idx === activeSlideIdx ? { ...s, layout: topLayoutId } : s
      );
      updated = true;
    }

    if (updated) {
      setPresentation(nextPresentation);
    }
  }, [autoApply, themeRecommendations, layoutRecommendations, activeSlideIdx]);

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

  // Smooth theme transition
  const handleThemeChange = (themeName) => {
    if (presentation?.theme === themeName) return;
    
    // Learning System preference tracker
    try {
      const prefs = localStorage.getItem('deckflow_user_preferences') || '{"themes":{},"layouts":{}}';
      const parsed = JSON.parse(prefs);
      parsed.themes[themeName] = (parsed.themes[themeName] || 0) + 1;
      localStorage.setItem('deckflow_user_preferences', JSON.stringify(parsed));
    } catch (e) {}

    setIsTransitioning(true);
    setHoveredTheme(null);
    setTimeout(() => {
      setPresentation(prev => ({ ...prev, theme: themeName }));
      setIsTransitioning(false);
    }, 220);
  };

  // Smooth layout transition
  const handleLayoutChange = (layoutName) => {
    if (!activeSlide || activeSlide.layout === layoutName) return;

    // Learning System preference tracker
    try {
      const prefs = localStorage.getItem('deckflow_user_preferences') || '{"themes":{},"layouts":{}}';
      const parsed = JSON.parse(prefs);
      parsed.layouts[layoutName] = (parsed.layouts[layoutName] || 0) + 1;
      localStorage.setItem('deckflow_user_preferences', JSON.stringify(parsed));
    } catch (e) {}

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

  /* ── Derived values ── */
  const activeSlide = presentation ? (presentation.slides[activeSlideIdx] || presentation.slides[0]) : null;
  const currentThemeId = presentation ? (presentation.theme || 'classic') : 'classic';
  const displayThemeId = hoveredTheme || currentThemeId;
  const displayTheme = THEMES[displayThemeId] || THEMES.classic;
  const displayLayout = hoveredLayout || (activeSlide ? activeSlide.layout : 'bullets');

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

  const SvgChartRenderer = ({ chartData, width = '100%', height = '100%' }) => {
    const { chartType, labels = [], datasets = [] } = chartData;
    const values = datasets[0]?.data || [];
    const chartColor = datasets[0]?.color || '#7c3aed';
    
    if (chartType === 'pie' || chartType === 'doughnut') {
      let total = values.reduce((a, b) => a + b, 0) || 1;
      let accumulatedAngle = 0;
      
      return (
        <svg width={width} height={height} viewBox="0 0 100 100">
          {values.map((v, idx) => {
            const percentage = v / total;
            const angle = percentage * 360;
            const x1 = 50 + 40 * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
            const y1 = 50 + 40 * Math.sin((accumulatedAngle - 90) * Math.PI / 180);
            accumulatedAngle += angle;
            const x2 = 50 + 40 * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
            const y2 = 50 + 40 * Math.sin((accumulatedAngle - 90) * Math.PI / 180);
            const largeArc = angle > 180 ? 1 : 0;
            const d = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
            const sliceColor = `hsl(${(idx * 360) / values.length}, 70%, 60%)`;
            return <path key={idx} d={d} fill={sliceColor} stroke="#fff" strokeWidth="0.5" />;
          })}
          {chartType === 'doughnut' && <circle cx="50" cy="50" r="18" fill="#fff" />}
        </svg>
      );
    }

    const maxVal = Math.max(...values, 1);
    return (
      <svg width={width} height={height} viewBox="0 0 100 60" style={{ overflow: 'visible' }}>
        {values.map((v, idx) => {
          const barHeight = (v / maxVal) * 45;
          const barWidth = 60 / (values.length || 1);
          const x = 10 + idx * (barWidth + 5);
          const y = 50 - barHeight;
          return (
            <g key={idx}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={chartColor} rx="1" />
              <text x={x + barWidth / 2} y={55} fontSize="3.5" textAnchor="middle" fill="#64748b">{labels[idx] || ''}</text>
              <text x={x + barWidth / 2} y={y - 2} fontSize="3.5" textAnchor="middle" fill="#1e293b" fontWeight="600">{v}</text>
            </g>
          );
        })}
        <line x1="5" y1="50" x2="95" y2="50" stroke="#cbd5e1" strokeWidth="0.5" />
      </svg>
    );
  };

  const renderCustomElement = (el) => {
    if (el.type === 'text') {
      return (
        <div
          key={el.id}
          data-el-key={el.id}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleElementTextChange(el.id, e.target.innerText)}
          onClick={e => handleElementClick(el.id, e)}
          style={getElementStyle(el.id, {
            position: 'absolute',
            outline: 'none',
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--slide-body-font)',
            color: 'var(--slide-text)',
            fontSize: '18px'
          })}
        >
          {el.content}
        </div>
      );
    }
    if (el.type === 'image') {
      return (
        <div
          key={el.id}
          data-el-key={el.id}
          onClick={e => handleElementClick(el.id, e)}
          style={getElementStyle(el.id, {
            position: 'absolute'
          })}
        >
          <img
            src={el.content}
            alt="Custom Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
          />
        </div>
      );
    }
    if (el.type === 'media') {
      const isVideo = el.content && (el.content.endsWith('.mp4') || el.content.includes('video') || el.content.includes('pexels'));
      return (
        <div
          key={el.id}
          data-el-key={el.id}
          onClick={e => handleElementClick(el.id, e)}
          style={getElementStyle(el.id, {
            position: 'absolute',
            background: isVideo ? '#000' : '#f8fafc',
            border: isVideo ? 'none' : '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          })}
        >
          {isVideo ? (
            <video src={el.content} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px' }}>
              <audio src={el.content} controls style={{ width: '100%', maxWidth: '280px', height: '40px' }} />
            </div>
          )}
        </div>
      );
    }
    if (el.type === 'shape') {
      const shapeType = el.content.shapeType;
      let shapeSvg = null;
      if (shapeType === 'rectangle') shapeSvg = <rect x="2" y="2" width="96" height="96" fill="currentColor" rx="4" />;
      else if (shapeType === 'circle') shapeSvg = <circle cx="50" cy="50" r="46" fill="currentColor" />;
      else if (shapeType === 'triangle') shapeSvg = <polygon points="50,5 95,95 5,95" fill="currentColor" />;
      else if (shapeType === 'arrow-right') shapeSvg = <path d="M10,40 H70 V20 L90,50 L70,80 V60 H10 Z" fill="currentColor" />;
      else if (shapeType === 'arrow-down') shapeSvg = <path d="M40,10 V70 H20 L50,90 L80,70 H60 V10 Z" fill="currentColor" />;
      else if (shapeType === 'star') shapeSvg = <polygon points="50,2 64,30 95,35 73,57 78,88 50,74 22,88 27,57 5,35 36,30" fill="currentColor" />;
      else if (shapeType === 'diamond') shapeSvg = <polygon points="50,5 95,50 50,95 5,50" fill="currentColor" />;
      else shapeSvg = <rect x="2" y="2" width="96" height="96" fill="currentColor" rx="4" />;

      return (
        <div
          key={el.id}
          data-el-key={el.id}
          onClick={e => handleElementClick(el.id, e)}
          style={getElementStyle(el.id, {
            position: 'absolute',
            color: el.content.fill || '#7c3aed'
          })}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {shapeSvg}
          </svg>
        </div>
      );
    }
    if (el.type === 'formula') {
      let previewHtml = el.content;
      if (window.katex) {
        try {
          previewHtml = window.katex.renderToString(el.content, { throwOnError: false });
        } catch (err) {
          console.warn(err);
        }
      }
      return (
        <div
          key={el.id}
          data-el-key={el.id}
          onClick={e => handleElementClick(el.id, e)}
          style={getElementStyle(el.id, {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.7)',
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid rgba(139,92,246,0.15)'
          })}
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      );
    }
    if (el.type === 'asset') {
      return (
        <div
          key={el.id}
          data-el-key={el.id}
          onClick={e => handleElementClick(el.id, e)}
          style={getElementStyle(el.id, {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          })}
        >
          {el.content.code}
        </div>
      );
    }
    if (el.type === 'table') {
      const tableData = el.content;
      return (
        <div
          key={el.id}
          data-el-key={el.id}
          onClick={e => handleElementClick(el.id, e)}
          style={getElementStyle(el.id, {
            position: 'absolute',
            overflow: 'auto',
            background: '#fff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px'
          })}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <tbody>
              {tableData.cells.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => handleTableCellChange(el.id, rIdx, cIdx, e.target.innerText)}
                      style={{
                        border: '1px solid #cbd5e1',
                        padding: '6px',
                        textAlign: 'left',
                        minWidth: '50px'
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (el.type === 'chart') {
      return (
        <div
          key={el.id}
          data-el-key={el.id}
          onClick={e => handleElementClick(el.id, e)}
          style={getElementStyle(el.id, {
            position: 'absolute',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px',
            boxSizing: 'border-box'
          })}
        >
          <SvgChartRenderer chartData={el.content} />
        </div>
      );
    }
    if (el.type === 'mindmap') {
      return (
        <div
          key={el.id}
          data-el-key={el.id}
          onClick={e => handleElementClick(el.id, e)}
          style={getElementStyle(el.id, {
            position: 'absolute',
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px dashed #a855f7',
            borderRadius: '8px',
            padding: '8px',
            boxSizing: 'border-box'
          })}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ background: '#7c3aed', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', textAlign: 'center', minWidth: '80px' }}>
              {el.content.rootNode.text}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {el.content.rootNode.children.map((child, cIdx) => (
                <div key={cIdx} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                  {child.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  /* ── Render Slide Content Helper ── */
  const renderSlideInner = (slide, idx, layout, themeId) => {
    if (!slide) return null;
    const imgData = slideImages.get(idx);
    const primaryImg = imgData?.primary;
    const isImgLoading = imageLoadingIdx === idx;

    const renderBullets = (bullets) => {
      return bullets.map((bullet, bIdx) => {
        let iconSymbol = '✦';
        if (autoApply) {
          const text = bullet.toLowerCase();
          if (text.includes('growth') || text.includes('revenue') || text.includes('increase') || text.includes('stats')) {
            iconSymbol = '📈';
          } else if (text.includes('feature') || text.includes('benefit') || text.includes('key') || text.includes('award')) {
            iconSymbol = '⭐';
          } else if (text.includes('step') || text.includes('phase') || text.includes('timeline')) {
            iconSymbol = '➔';
          } else if (text.includes('speed') || text.includes('fast') || text.includes('quick')) {
            iconSymbol = '⚡';
          } else if (text.includes('user') || text.includes('customer') || text.includes('client')) {
            iconSymbol = '👤';
          } else {
            iconSymbol = '✓';
          }
        }
        const key = `bullet-${bIdx}`;
        return (
          <li key={bIdx} className="slide-bullet-item">
            <span className={`slide-bullet-dot ${autoApply ? 'auto-applied' : ''}`} style={{ color: 'var(--slide-bullet-color)' }}>
              {iconSymbol}
            </span>
            <div
              data-el-key={key}
              contentEditable
              suppressContentEditableWarning
              onBlur={e => handleBulletBlur(bIdx, e.target.innerText)}
              onClick={e => handleElementClick(key, e)}
              style={getElementStyle(key, { flex: 1, outline: 'none' })}
            >
              {bullet}
            </div>
          </li>
        );
      });
    };

    let layoutContent = null;

    if (layout === 'title') {
      const bgImg = primaryImg;
      layoutContent = (
        <div className={`slide-layout-title ${autoApply ? 'auto-applied-title' : ''}`} style={bgImg ? { position: 'relative' } : {}}>
          {bgImg && (
            <div className="slide-title-bg-img">
              <img src={bgImg.src} alt={bgImg.alt} />
              <div className="slide-title-bg-overlay" />
            </div>
          )}
          {isImgLoading && <div className="slide-img-shimmer slide-title-bg-img" />}
          <div
            data-el-key="title"
            className={`slide-main-title ${selectedElements.includes('title') ? 'selected' : ''}`}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleBlur}
            onClick={e => handleElementClick('title', e)}
            style={getElementStyle('title', {
              fontFamily: 'var(--slide-title-font)',
              color: bgImg ? '#ffffff' : 'var(--slide-title-color)',
              textShadow: bgImg ? '0 2px 12px rgba(0,0,0,0.55)' : 'none',
              position: 'relative', zIndex: 3,
            })}
          >
            {slide.title}
          </div>
          <div className="slide-title-divider" style={{ background: bgImg ? 'rgba(255,255,255,0.7)' : 'var(--slide-accent)', position: 'relative', zIndex: 3 }} />
          <div
            data-el-key="subtitle"
            className="slide-main-subtitle"
            contentEditable
            suppressContentEditableWarning
            onBlur={e => handleBulletBlur(0, e.target.innerText)}
            onClick={e => handleElementClick('subtitle', e)}
            style={getElementStyle('subtitle', {
              fontFamily: 'var(--slide-body-font)',
              color: bgImg ? 'rgba(255,255,255,0.88)' : 'var(--slide-text-secondary)',
              textShadow: bgImg ? '0 1px 6px rgba(0,0,0,0.5)' : 'none',
              position: 'relative', zIndex: 3,
            })}
          >
            {slide.content[0] || 'Add a subtitle here'}
          </div>
          <button
            className="slide-img-refresh-btn"
            title="Refresh image"
            onClick={e => { e.stopPropagation(); refreshSlideImage(idx, slide, { title: presentation.title, topic: presentation.title }); }}
          >
            <RefreshCw size={11} />
          </button>
        </div>
      );
    } else if (layout === 'bullets') {
      const sideImg = primaryImg;
      layoutContent = (
        <div className={`slide-layout-bullets ${sideImg || isImgLoading ? 'has-image' : ''} ${autoApply ? 'auto-applied-bullets' : ''}`}>
          <div className="slide-bullets-text">
            <h2
              data-el-key="title"
              className={`slide-heading ${selectedElements.includes('title') ? 'selected' : ''}`}
              contentEditable
              suppressContentEditableWarning
              onBlur={handleTitleBlur}
              onClick={e => handleElementClick('title', e)}
              style={getElementStyle('title', { fontFamily: 'var(--slide-title-font)', color: 'var(--slide-title-color)' })}
            >
              {slide.title}
            </h2>
            <div className="slide-heading-bar" style={{ background: 'var(--slide-accent)' }} />
            <ul className="slide-bullet-list" style={{ fontFamily: 'var(--slide-body-font)', color: 'var(--slide-text)' }}>
              {renderBullets(slide.content)}
            </ul>
          </div>
          {(sideImg || isImgLoading) && (
            <div className={`slide-bullets-img-col ${autoApply ? 'auto-applied-frame' : ''}`}>
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
                onClick={e => { e.stopPropagation(); refreshSlideImage(idx, slide, { title: presentation.title, topic: presentation.title }); }}
              >
                <RefreshCw size={11} />
              </button>
            </div>
          )}
        </div>
      );
    } else if (layout === 'columns') {
      layoutContent = (
        <div className={`slide-layout-columns ${autoApply ? 'auto-applied-columns' : ''}`}>
          <h2
            data-el-key="title"
            className="slide-heading"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleBlur}
            onClick={e => handleElementClick('title', e)}
            style={getElementStyle('title', { fontFamily: 'var(--slide-title-font)', color: 'var(--slide-title-color)' })}
          >
            {slide.title}
          </h2>
          <div className="slide-heading-bar" style={{ background: 'var(--slide-accent)' }} />
          <div className="slide-columns-grid">
            {[0,1,2].map(i => {
              const text = slide.content[i] || `Column ${i + 1} content`;
              const key = `column-${i}`;
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
                    data-el-key={key}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => handleBulletBlur(i, e.target.innerText)}
                    onClick={e => handleElementClick(key, e)}
                    style={getElementStyle(key, { fontFamily: 'var(--slide-body-font)', color: 'var(--slide-text)', outline: 'none', fontSize: '0.95rem' })}
                  >
                    {text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (layout === 'stats') {
      layoutContent = (
        <div className={`slide-layout-stats ${autoApply ? 'auto-applied-stats' : ''}`}>
          <h2
            data-el-key="title"
            className="slide-heading"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleBlur}
            onClick={e => handleElementClick('title', e)}
            style={getElementStyle('title', { fontFamily: 'var(--slide-title-font)', color: 'var(--slide-title-color)' })}
          >
            {slide.title}
          </h2>
          <div className="slide-heading-bar" style={{ background: 'var(--slide-accent)' }} />
          <div className="slide-stats-grid">
            {[0,1,2].map(i => {
              const stat = slide.content[i] || `Metric ${i + 1}`;
              const valKey = `stat-val-${i}`;
              const lblKey = `stat-lbl-${i}`;
              return (
                <div
                  key={i}
                  className="slide-stat-card"
                  style={{ background: 'var(--slide-card-bg)', border: '1px solid var(--slide-border)' }}
                >
                  <div
                    className="slide-stat-value"
                    data-el-key={valKey}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => handleBulletBlur(i, e.target.innerText)}
                    onClick={e => handleElementClick(valKey, e)}
                    style={getElementStyle(valKey, { color: 'var(--slide-accent)', fontFamily: 'var(--slide-title-font)', outline: 'none' })}
                  >
                    {stat}
                  </div>
                  <div 
                    className="slide-stat-label" 
                    data-el-key={lblKey}
                    contentEditable
                    suppressContentEditableWarning
                    onClick={e => handleElementClick(lblKey, e)}
                    style={getElementStyle(lblKey, { color: 'var(--slide-text-secondary)', fontFamily: 'var(--slide-body-font)', outline: 'none' })}
                  >
                    Key Metric {i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (layout === 'timeline') {
      layoutContent = (
        <div className={`slide-layout-timeline ${autoApply ? 'auto-applied-timeline' : ''}`}>
          <h2
            data-el-key="title"
            className="slide-heading"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleBlur}
            onClick={e => handleElementClick('title', e)}
            style={getElementStyle('title', { fontFamily: 'var(--slide-title-font)', color: 'var(--slide-title-color)' })}
          >
            {slide.title}
          </h2>
          <div className="slide-heading-bar" style={{ background: 'var(--slide-accent)' }} />
          <div className="slide-timeline-track">
            <div className="slide-timeline-line" style={{ background: 'var(--slide-border)' }} />
            {(slide.content.length < 3
              ? [...slide.content, ...Array(3 - slide.content.length).fill('Milestone')]
              : slide.content.slice(0, 4)
            ).map((item, i) => {
              const key = `timeline-${i}`;
              return (
                <div key={i} className={`slide-timeline-node node-${i % 2 === 0 ? 'top' : 'bottom'}`}>
                  <div className="slide-tl-dot" style={{ background: 'var(--slide-accent)' }} />
                  <div
                    className="slide-tl-card"
                    data-el-key={key}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => handleBulletBlur(i, e.target.innerText)}
                    onClick={e => handleElementClick(key, e)}
                    style={getElementStyle(key, { background: 'var(--slide-card-bg)', border: '1px solid var(--slide-border)', color: 'var(--slide-text)', fontFamily: 'var(--slide-body-font)', outline: 'none' })}
                  >
                    {item}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {layoutContent}
        {(slide.elements || []).map(el => renderCustomElement(el))}
      </div>
    );
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
          </div>
          <div className="adv-divider" />
          <button className="adv-tool-btn" title="Undo"><Undo size={16} /></button>
          <button className="adv-tool-btn" title="Redo"><Redo size={16} /></button>
        </div>
        <div className="adv-topbar-center" style={{ gap: '4px' }}>
          {[
            { id: 'text', label: 'Text', icon: Type },
            { id: 'table', label: 'Table', icon: Table },
            { id: 'chart', label: 'Chart', icon: BarChart3 },
            { id: 'image', label: 'Image', icon: ImageIcon },
            { id: 'autolayout', label: 'Auto Layout', icon: LayoutGrid },
            { id: 'asset', label: 'Asset', icon: Package },
            { id: 'media', label: 'Media', icon: Play },
            { id: 'shape', label: 'Shape', icon: Shapes },
            { id: 'formula', label: 'Formula', icon: Sigma },
            { id: 'mindmap', label: 'Mind Map', icon: Network }
          ].map(tool => {
            const Icon = tool.icon;
            const isActive = activePanel === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={`adv-nav-tool-btn ${isActive ? 'active' : ''}`}
                title={tool.label}
              >
                <Icon size={18} />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
        <div className="adv-topbar-right">
          <button className="adv-btn adv-btn-secondary" style={{ marginRight: '0.5rem' }}><Play size={16} /> Present</button>
          <button 
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`adv-btn ${isCompareMode ? 'adv-btn-primary' : 'adv-btn-secondary'}`}
            style={{ marginRight: '0.5rem', border: '1px solid #a855f7' }}
          >
            <Sparkles size={14} className={isCompareMode ? 'spinning' : ''} />
            {isCompareMode ? 'Exit Compare' : 'Compare Mode'}
          </button>
          <button onClick={handleSave} className="adv-btn adv-btn-secondary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleDownload} className="adv-btn adv-btn-primary">
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      {/* ── Editor Panels (Slide-Down Panel Container) ── */}
      {activePanel && (
        <div style={{ position: 'relative', zIndex: 9, animation: 'slideDown 0.25s ease-out' }}>
          <EditorPanels
            activePanel={activePanel}
            onClose={() => setActivePanel(null)}
            onInsert={handleInsertElement}
            activeElement={selectedElements[0]}
            onUpdateElementStyle={handleUpdateElementStyle}
            selectedElements={selectedElements}
            activeSlide={presentation?.slides[activeSlideIdx]}
            onApplyAutoLayout={handleApplyAutoLayout}
          />
        </div>
      )}

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
              
              {/* AI Auto Apply and Settings option */}
              <div className="ai-options-banner">
                <label className="ai-toggle-label">
                  <input
                    type="checkbox"
                    checked={autoApply}
                    onChange={(e) => setAutoApply(e.target.checked)}
                  />
                  <div className="ai-toggle-text">
                    <span className="toggle-title">⚡ Auto-Apply AI Design</span>
                    <span className="toggle-desc">Automatically set matching theme, layout, fonts, and spacing.</span>
                  </div>
                </label>
              </div>

              <div className="ai-rec-header-section">
                <h3>Layouts</h3>
                <span className="ai-rec-pill">AI Active</span>
              </div>


              
              <div className="adv-layout-grid">
                {layoutRecommendations.map(rec => {
                  const l = rec.id;
                  const isTopRec = layoutRecommendations[0]?.id === l;
                  const isActive = activeSlide.layout === l;
                  
                  return (
                    <div
                      key={rec.id}
                      className={`adv-layout-thumb ${isActive ? 'active' : ''} ${isTopRec ? 'recommended' : ''}`}
                      onClick={() => handleLayoutChange(l)}
                      onMouseEnter={() => setHoveredLayout(l)}
                      onMouseLeave={() => setHoveredLayout(null)}
                      style={{ position: 'relative' }}
                    >
                      {isTopRec && (
                        <div className="ai-badge-card-corner" title="AI Recommended Layout">
                          <Sparkles size={8} color="#fff" />
                        </div>
                      )}
                      <div className="layout-thumb-icon">
                        <LayoutThumbIcon type={l} />
                      </div>
                      
                      <div className="layout-thumb-label-row">
                        <span className="layout-name">{l.charAt(0).toUpperCase() + l.slice(1)}</span>
                        {isTopRec && <span className="layout-score">{rec.score}% Match</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <h3 style={{ marginTop: '2rem' }}>Visual Themes</h3>
              <p className="adv-hint-text">Hover to preview · Click to apply</p>



              <div className="adv-theme-grid" style={{ marginTop: '1rem' }}>
                {themeRecommendations.map(rec => {
                  const tid = rec.id;
                  const theme = THEMES[tid];
                  const isTopTheme = themeRecommendations[0]?.id === tid;
                  return (
                    <div key={tid} style={{ position: 'relative' }}>
                      <ThemeTile
                        id={tid}
                        theme={theme}
                        isActive={currentThemeId === tid}
                        onSelect={handleThemeChange}
                        onHover={setHoveredTheme}
                        onLeave={() => setHoveredTheme(null)}
                      />
                      {isTopTheme && (
                        <div className="ai-theme-badge-dot" title="AI Recommended Theme">
                          <Sparkles size={8} color="#fff" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>



            </div>
          )}

          {/* ── AI Images Tab ── */}
          {activeSidebarTab === 'uploads' && (
            <AIImagePanel
              slide={activeSlide}
              presentationMeta={{
                title: presentation.title,
                topic: presentation.topic || presentation.title,
                audience: presentation.audience || '',
                tone: presentation.tone || 'professional',
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
          
          {/* Continuous recommendation toast */}
          {recommendationToast && (
            <div className="ai-recommendation-toast shadow-lg">
              <div className="toast-header">
                <Sparkles size={14} className="toast-spark" />
                <span>AI Recommendation Updated</span>
                <button className="toast-close" onClick={() => setRecommendationToast(null)}>×</button>
              </div>
              <div className="toast-body">
                <p>We recommend switching to <b>{recommendationToast.name} Layout</b>.</p>
                <span className="toast-desc">{recommendationToast.reason}</span>
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    className="toast-apply-btn"
                    onClick={() => {
                      handleLayoutChange(recommendationToast.id);
                      setRecommendationToast(null);
                    }}
                  >
                    Apply Design
                  </button>
                </div>
              </div>
            </div>
          )}

          {isCompareMode ? (
            /* ── Compare Mode Split Screen ── */
            <div className="ai-compare-split-view">
              <div className="compare-pane compare-pane-current">
                <div className="compare-pane-header">
                  <h4>Current Design Look</h4>
                  <span className="compare-info-tag">Theme: {currentThemeId.toUpperCase()} · Layout: {activeSlide.layout.toUpperCase()}</span>
                </div>
                <div className="compare-canvas-box">
                  <div
                    className={`slide-frame layout-${activeSlide.layout} theme-${currentThemeId}`}
                    style={Object.entries(THEMES[currentThemeId] || THEMES.classic)
                      .filter(([k]) => k.startsWith('--'))
                      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})}
                  >
                    <SlideThemeDecor theme={currentThemeId} />
                    <div className="slide-content-layer">
                      {renderSlideInner(activeSlide, activeSlideIdx, activeSlide.layout, currentThemeId)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="compare-pane compare-pane-recommended">
                <div className="compare-pane-header">
                  <h4 className="flex items-center gap-1 text-purple-600">
                    <Sparkles size={14} />
                    AI Recommended Look
                  </h4>
                  <span className="compare-info-tag match-success">
                    Score: Theme {themeRecommendations[0]?.score}% · Layout {layoutRecommendations[0]?.score}%
                  </span>
                </div>
                <div className="compare-canvas-box recommended-glow">
                  <div
                    className={`slide-frame layout-${layoutRecommendations[0]?.id || 'bullets'} theme-${themeRecommendations[0]?.id || 'classic'}`}
                    style={Object.entries(THEMES[themeRecommendations[0]?.id || 'classic'] || THEMES.classic)
                      .filter(([k]) => k.startsWith('--'))
                      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})}
                  >
                    <SlideThemeDecor theme={themeRecommendations[0]?.id || 'classic'} />
                    <div className="slide-content-layer">
                      {renderSlideInner(
                        activeSlide, 
                        activeSlideIdx, 
                        layoutRecommendations[0]?.id || 'bullets', 
                        themeRecommendations[0]?.id || 'classic'
                      )}
                    </div>
                  </div>
                </div>
                <div className="compare-actions-bar">
                  <p className="compare-explain">{themeRecommendations[0]?.reason}</p>
                  <button
                    className="btn btn-primary shadow-md"
                    style={{ padding: '0.45rem 1.25rem', fontSize: '0.8rem' }}
                    onClick={() => {
                      handleThemeChange(themeRecommendations[0]?.id);
                      handleLayoutChange(layoutRecommendations[0]?.id);
                      setIsCompareMode(false);
                    }}
                  >
                    Apply AI Recommended Design
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── Standard Canvas ── */
            <div className="adv-canvas-wrapper" onClick={handleCanvasClick} style={{ position: 'relative' }}>
              <div
                key={`${activeSlideIdx}-${displayLayout}-${displayThemeId}`}
                className={`slide-frame layout-${displayLayout} theme-${displayThemeId} ${isTransitioning ? 'slide-transitioning' : ''} ${autoApply ? 'auto-applied-slide-frame' : ''}`}
                style={themeStyle}
                onClick={() => setSelectedElement('background')}
              >
                {/* Visual feedback for auto apply */}
                {autoApply && (
                  <div className="auto-apply-pill-label" title="AI Auto Apply is active on spacing, colors and elements.">
                    <Sparkles size={9} />
                    <span>AI Optimized Style</span>
                  </div>
                )}
                
                {/* Unique decorative elements per theme */}
                <SlideThemeDecor theme={displayThemeId} />

                {/* Slide content layer */}
                <div className="slide-content-layer">
                  {renderSlideInner(activeSlide, activeSlideIdx, displayLayout, displayThemeId)}
                </div>
              </div>

              {/* FLOATING SELECTION OVERLAYS */}
              {!isCompareMode && selectedElements.map(key => {
                const el = document.querySelector(`[data-el-key="${key}"]`);
                if (!el) return null;
                const container = document.querySelector('.slide-frame');
                if (!container) return null;
                
                const elRect = el.getBoundingClientRect();
                const contRect = container.getBoundingClientRect();
                
                const top = elRect.top - contRect.top;
                const left = elRect.left - contRect.left;
                const width = elRect.width;
                const height = elRect.height;
                
                const elStyles = (activeSlide?.styles instanceof Map ? Object.fromEntries(activeSlide.styles) : activeSlide?.styles)?.[key] || {};
                const isLocked = elStyles.locked;
                
                return (
                  <div 
                    key={key}
                    className={`adv-selection-box ${isLocked ? 'locked' : ''}`}
                    style={{
                      position: 'absolute',
                      top: top - 2,
                      left: left - 2,
                      width: width + 4,
                      height: height + 4,
                      border: isLocked ? '1.5px dashed #f43f5e' : '1.5px solid #a855f7',
                      zIndex: 1000,
                      cursor: isLocked ? 'not-allowed' : 'move'
                    }}
                    onMouseDown={(e) => handleDragStart(key, e)}
                  >
                    {!isLocked && (
                      <>
                        <div className="sel-handle sel-tl" style={{ position: 'absolute', top: -4, left: -4 }} onMouseDown={e => handleResizeStart(key, e)} />
                        <div className="sel-handle sel-tr" style={{ position: 'absolute', top: -4, right: -4 }} onMouseDown={e => handleResizeStart(key, e)} />
                        <div className="sel-handle sel-bl" style={{ position: 'absolute', bottom: -4, left: -4 }} onMouseDown={e => handleResizeStart(key, e)} />
                        <div className="sel-handle sel-br" style={{ position: 'absolute', bottom: -4, right: -4 }} onMouseDown={e => handleResizeStart(key, e)} />
                        
                        {/* Rotation Handle */}
                        <div 
                          className="sel-rotate-handle" 
                          style={{
                            position: 'absolute',
                            bottom: -22,
                            left: '50%',
                            marginLeft: -6,
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#a855f7',
                            border: '2px solid #fff',
                            cursor: 'alias',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }} 
                          onMouseDown={e => handleRotateStart(key, e)}
                        />
                      </>
                    )}
                    {isLocked && (
                      <div style={{ position: 'absolute', top: -10, right: -10, background: '#f43f5e', color: '#fff', borderRadius: '50%', padding: '2px' }}>
                        <Lock size={10} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* CONTEXTUAL FLOATING TOOLBAR */}
              {!isCompareMode && toolbarPosition && selectedElements.length > 0 && (
                <ContextualToolbar
                  activeElement={selectedElements[0]}
                  style={getElementStyle(selectedElements[0])}
                  onUpdateStyle={(changes) => {
                    selectedElements.forEach(key => handleUpdateElementStyle(key, changes));
                  }}
                  onAiAction={(actionType) => handleAiTextAction(selectedElements[0], actionType)}
                  positionStyle={toolbarPosition}
                />
              )}
            </div>
          )}

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
                value={activeSlide ? (activeSlide.note || '') : ''}
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
