/**
 * AIImagePanel.jsx
 *
 * Sidebar panel providing:
 *  • Per-slide AI image suggestions (auto-fetched, unique per slide)
 *  • Keyword badges showing what was searched
 *  • 3–5 alternative images per slot with click-to-swap
 *  • Manual search override
 *  • Loading skeletons while fetching
 *  • "Add to slide" action
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchSlideImages,
  searchImages,
  extractKeywords,
  markImageUsed,
  clearUsedImages,
} from '../services/imageSearch';
import {
  Search, RefreshCw, ImageIcon, Sparkles, ChevronDown,
  ChevronUp, Check, Plus, ExternalLink, X
} from 'lucide-react';

/* ── Tiny CSS-in-JS for the panel (self-contained) ── */
const panelStyles = `
.ai-image-panel {
  display: flex; flex-direction: column; height: 100%; overflow: hidden;
  background: #ffffff; width: 380px; flex-shrink: 0; box-sizing: border-box;
  padding: 16px; border-left: 1px solid #e2e8f0; font-family: inherit;
}

/* Header */
.aip-header { display: flex; align-items: center; margin-bottom: 16px; flex-shrink: 0; }
.aip-title {
  font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  color: #374151; display: flex; align-items: center; gap: 8px; margin: 0;
}
.aip-title svg { color: #8b5cf6; }

/* Search bar */
.aip-search-row { display: flex; gap: 8px; align-items: center; margin-bottom: 16px; flex-shrink: 0; }
.aip-search-form { flex: 1; display: flex; gap: 8px; }
.aip-search-input {
  flex: 1; height: 44px; padding: 0 12px; border: 1px solid #d1d5db; border-radius: 10px;
  font-size: 0.85rem; outline: none; background: #f9fafb; transition: border-color 0.2s;
}
.aip-search-input:focus { border-color: #8b5cf6; }
.aip-search-btn, .aip-refresh-btn {
  width: 44px; height: 44px; flex-shrink: 0; border: none; border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.aip-search-btn { background: #8b5cf6; color: #fff; }
.aip-search-btn:hover { background: #7c3aed; }
.aip-refresh-btn { background: #f1f5f9; color: #6b7280; border: 1px solid #e2e8f0; }
.aip-refresh-btn:hover { background: #e5e7eb; color: #374151; }

/* Keyword badges */
.aip-keywords { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; flex-shrink: 0; }
.aip-kw-badge {
  font-size: 0.75rem; padding: 6px 12px; border-radius: 20px;
  background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;
  cursor: pointer; transition: background 0.2s; white-space: nowrap;
}
.aip-kw-badge:hover { background: #dbeafe; }
.aip-kw-badge.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }

/* Tip banner */
.aip-tip {
  margin-bottom: 16px; padding: 12px 16px; flex-shrink: 0;
  background: linear-gradient(90deg, #faf5ff, #eff6ff); border: 1px solid #e9d5ff;
  border-radius: 10px; font-size: 0.75rem; color: #5b21b6; line-height: 1.5;
  white-space: normal; word-wrap: break-word; overflow-wrap: break-word;
}

/* Scrollable results body */
.aip-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; padding-right: 4px; }
.aip-body::-webkit-scrollbar { width: 6px; }
.aip-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

/* Image slot */
.aip-slot { display: flex; flex-direction: column; }
.aip-slot-label { font-size: 0.8rem; font-weight: 600; color: #374151; margin-bottom: 12px; }

/* Primary image */
.aip-primary-img-wrap {
  position: relative; width: 100%; aspect-ratio: 4/3;
  border-radius: 12px; overflow: hidden; background: #f3f4f6;
  cursor: pointer; border: 2px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s; margin-bottom: 16px;
}
.aip-primary-img-wrap:hover { border-color: #8b5cf6; box-shadow: 0 4px 12px rgba(139,92,246,0.15); }
.aip-primary-img-wrap.selected { border-color: #10b981; box-shadow: 0 4px 12px rgba(16,185,129,0.15); }
.aip-primary-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.aip-img-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  opacity: 0; transition: opacity 0.2s;
}
.aip-primary-img-wrap:hover .aip-img-overlay { opacity: 1; }
.aip-overlay-btn {
  padding: 6px 12px; border-radius: 6px; border: none; font-size: 0.75rem; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s;
}
.aip-overlay-btn.add { background: #8b5cf6; color: #fff; }
.aip-overlay-btn.add:hover { background: #7c3aed; }
.aip-overlay-btn.ext { background: rgba(255,255,255,0.25); color: #fff; }
.aip-overlay-btn.ext:hover { background: rgba(255,255,255,0.35); }
.aip-added-badge {
  position: absolute; top: 10px; right: 10px; background: #10b981; color: #fff;
  border-radius: 6px; font-size: 0.7rem; font-weight: 700; padding: 4px 8px;
  display: flex; align-items: center; gap: 4px;
}
.aip-img-source {
  position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.6); color: #fff;
  font-size: 0.7rem; font-weight: 500; border-radius: 4px; padding: 4px 8px;
}

/* Skeleton */
.aip-skeleton {
  width: 100%; aspect-ratio: 4/3; border-radius: 12px; margin-bottom: 16px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%; animation: aip-shimmer 1.4s infinite;
}
@keyframes aip-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

/* Alternatives strip */
.aip-alts-toggle {
  background: none; border: none; font-size: 0.75rem; font-weight: 500; color: #6b7280;
  cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0; margin-bottom: 12px;
}
.aip-alts-toggle:hover { color: #374151; }
.aip-alts-strip { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 12px; }
.aip-alts-strip::-webkit-scrollbar { height: 6px; }
.aip-alts-strip::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.aip-alt-thumb {
  flex-shrink: 0; width: 80px; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden;
  border: 2px solid transparent; cursor: pointer; transition: border-color 0.2s;
  position: relative;
}
.aip-alt-thumb:hover { border-color: #a855f7; }
.aip-alt-thumb.selected { border-color: #8b5cf6; }
.aip-alt-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.aip-alt-thumb-skeleton {
  width: 80px; aspect-ratio: 4/3; border-radius: 8px; flex-shrink: 0;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%; animation: aip-shimmer 1.4s infinite;
}

/* Empty state */
.aip-empty { text-align: center; padding: 3rem 1rem; color: #9ca3af; font-size: 0.85rem; }
.aip-empty svg { margin-bottom: 12px; opacity: 0.4; }

/* Attribution */
.aip-attribution { font-size: 0.75rem; color: #9ca3af; }
.aip-attribution a { color: #6b7280; text-decoration: none; font-weight: 500; }
.aip-attribution a:hover { text-decoration: underline; color: #374151; }
`;

/* ══════════════════════════════════════════════
   AIImagePanel component
══════════════════════════════════════════════ */
export default function AIImagePanel({ slide, presentationMeta, usedImageIds, onAddImage, onSwapImage }) {
  const [loading,         setLoading]        = useState(false);
  const [searchQuery,     setSearchQuery]    = useState('');
  const [keywords,        setKeywords]       = useState([]);
  const [activeKw,        setActiveKw]       = useState(null);
  const [primaryImg,      setPrimaryImg]     = useState(null);
  const [alternatives,    setAlternatives]   = useState([]);
  const [selectedAltIdx,  setSelectedAltIdx] = useState(-1);   // -1 = primary is selected
  const [showAlts,        setShowAlts]       = useState(true);
  const [addedSuccess,    setAddedSuccess]   = useState(false);
  const [error,           setError]          = useState(null);

  const abortRef = useRef(null);

  // ── Auto-load when slide changes ──
  useEffect(() => {
    if (!slide) return;
    const kws = extractKeywords(slide, presentationMeta, 5);
    setKeywords(kws);
    setActiveKw(kws[0] || '');
    loadImages(kws[0] || slide.title || 'presentation');
    setAddedSuccess(false);
    setSelectedAltIdx(-1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide?.title, slide?.layout, (slide?.content || []).join('|')]);

  const loadImages = useCallback(async (query) => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setPrimaryImg(null);
    setAlternatives([]);

    try {
      const excludeIds = new Set(usedImageIds || []);
      const { primary, alternatives: alts } = await fetchSlideImages(
        slide,
        presentationMeta,
        excludeIds,
        5
      );
      setPrimaryImg(primary);
      setAlternatives(alts || []);
    } catch (e) {
      setError('Could not load images. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [slide, presentationMeta, usedImageIds]);

  const handleKeywordClick = (kw) => {
    setActiveKw(kw);
    setSearchQuery(kw);
    loadImages(kw);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setActiveKw(q);
    loadImages(q);
  };

  const handleRefresh = () => {
    const q = activeKw || keywords[0] || slide?.title || 'presentation';
    loadImages(q);
  };

  const currentImage = selectedAltIdx >= 0 ? alternatives[selectedAltIdx] : primaryImg;

  const handleAddToSlide = () => {
    if (!currentImage) return;
    markImageUsed(currentImage.id);
    onAddImage && onAddImage(currentImage);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <>
      {/* Inject scoped styles once */}
      <style>{panelStyles}</style>

      <div className="ai-image-panel">

        {/* ── Header ── */}
        <div className="aip-header">
          <h2 className="aip-title">
            <Sparkles size={16} /> AI Image Search
          </h2>
        </div>

        {/* ── Search Section ── */}
        <div className="aip-search-row">
          <form onSubmit={handleSearch} className="aip-search-form">
            <input
              className="aip-search-input"
              type="text"
              placeholder="Search images…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="aip-search-btn" title="Search">
              <Search size={16} />
            </button>
          </form>
          <button className="aip-refresh-btn" onClick={handleRefresh} title="Refresh">
            <RefreshCw size={16} className={loading ? 'aip-spin' : ''} />
          </button>
        </div>

        {/* ── Keyword badges ── */}
        {keywords.length > 0 && (
          <div className="aip-keywords">
            {keywords.map((kw, i) => (
              <span
                key={i}
                className={`aip-kw-badge ${activeKw === kw ? 'active' : ''}`}
                onClick={() => handleKeywordClick(kw)}
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* ── Tip banner (shown when no API key) ── */}
        {!import.meta.env.VITE_UNSPLASH_ACCESS_KEY && (
          <div className="aip-tip">
            <b>Tip:</b> Add <code>VITE_UNSPLASH_ACCESS_KEY</code> to your <code>.env</code> for 50× better results.
          </div>
        )}

        {/* ── Body ── */}
        <div className="aip-body">

          {error && (
            <div className="aip-empty">
              <ImageIcon size={32} />
              <div>{error}</div>
            </div>
          )}

          {!error && (
            <div className="aip-slot">
              <div className="aip-slot-label">
                Best match — "{activeKw || slide?.title}"
              </div>

              {/* Primary image */}
              {loading ? (
                <div className="aip-skeleton" />
              ) : primaryImg ? (
                <div
                  className={`aip-primary-img-wrap ${addedSuccess ? 'selected' : ''}`}
                  onClick={handleAddToSlide}
                >
                  <img
                    className="aip-primary-img"
                    src={selectedAltIdx >= 0 ? (alternatives[selectedAltIdx]?.srcThumb || alternatives[selectedAltIdx]?.src) : (primaryImg.srcThumb || primaryImg.src)}
                    alt={currentImage?.alt || 'Image'}
                    loading="lazy"
                  />
                  <div className="aip-img-overlay">
                    <button type="button" className="aip-overlay-btn add" onClick={handleAddToSlide}>
                      <Plus size={14} /> Add to Slide
                    </button>
                    {currentImage?.authorUrl && (
                      <a
                        href={currentImage.authorUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="aip-overlay-btn ext"
                        onClick={e => e.stopPropagation()}
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  {addedSuccess && (
                    <div className="aip-added-badge"><Check size={10} /> Added!</div>
                  )}
                  <div className="aip-img-source">{currentImage?.source}</div>
                </div>
              ) : (
                <div className="aip-empty">
                  <ImageIcon size={32} />
                  <div>No images found. Try a different keyword.</div>
                </div>
              )}

              {/* Alternatives strip */}
              {(loading || alternatives.length > 0) && (
                <>
                  <button className="aip-alts-toggle" onClick={() => setShowAlts(v => !v)}>
                    {showAlts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {alternatives.length} alternative{alternatives.length !== 1 ? 's' : ''}
                  </button>

                  {showAlts && (
                    <div className="aip-alts-strip">
                      {/* Primary thumb */}
                      {!loading && primaryImg && (
                        <div
                          className={`aip-alt-thumb ${selectedAltIdx === -1 ? 'selected' : ''}`}
                          onClick={() => setSelectedAltIdx(-1)}
                          title="Primary match"
                        >
                          <img src={primaryImg.srcThumb || primaryImg.src} alt={primaryImg.alt} loading="lazy" />
                        </div>
                      )}

                      {/* Alternative thumbs */}
                      {loading
                        ? [0,1,2,3].map(i => <div key={i} className="aip-alt-thumb-skeleton" />)
                        : alternatives.map((alt, i) => (
                            <div
                              key={alt.id}
                              className={`aip-alt-thumb ${selectedAltIdx === i ? 'selected' : ''}`}
                              onClick={() => setSelectedAltIdx(i)}
                              title={alt.alt}
                            >
                              <img src={alt.srcThumb || alt.src} alt={alt.alt} loading="lazy" />
                            </div>
                          ))
                      }
                    </div>
                  )}
                </>
              )}

              {/* Attribution */}
              {currentImage?.author && (
                <div className="aip-attribution">
                  Photo by{' '}
                  <a href={currentImage.authorUrl} target="_blank" rel="noreferrer">
                    {currentImage.author}
                  </a>{' '}
                  · {currentImage.source}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`.aip-spin { animation: aip-rotate .7s linear infinite; } @keyframes aip-rotate { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
