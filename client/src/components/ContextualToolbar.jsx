import React, { useState } from 'react';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Sparkles, Trash2, Copy, Plus, Minus, Lock, Unlock, Paintbrush, 
  Highlighter, CaseSensitive, Layers, Palette, Eye, CopyCheck, ArrowUp, ArrowDown
} from 'lucide-react';

const FONTS = [
  'Inter', 'Outfit', 'Playfair Display', 'Merriweather', 'Fira Code', 
  'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana'
];

const WEIGHTS = [
  { label: 'Thin', value: '100' },
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' }
];

const COLORS = [
  '#000000', '#ffffff', '#1e293b', '#64748b', '#ef4444', 
  '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', 
  '#6366f1', '#a855f7', '#ec4899'
];

const HIGHLIGHT_COLORS = [
  'transparent', '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#ddd6fe'
];

export default function ContextualToolbar({
  activeElement,
  style,
  onUpdateStyle,
  onDuplicate,
  onDelete,
  onLockToggle,
  isLocked,
  onCopyStyle,
  onPasteStyle,
  hasCopiedStyle,
  onBringForward,
  onSendBackward,
  onAiAction,
  onClose,
  positionStyle // { top, left }
}) {
  const [activeTab, setActiveTab] = useState(null); // 'font', 'color', 'highlight', 'spacing', 'effects', 'position', 'ai'
  const [fontSearch, setFontSearch] = useState('');

  const fontStyle = style || {};

  const toggleTab = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const updateVal = (key, val) => {
    onUpdateStyle({ [key]: val });
  };

  const toggleStyle = (key, activeVal, defaultVal = '') => {
    if (fontStyle[key] === activeVal) {
      updateVal(key, defaultVal);
    } else {
      updateVal(key, activeVal);
    }
  };

  const filteredFonts = FONTS.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase()));

  return (
    <div 
      className="adv-contextual-toolbar glass-panel" 
      style={{
        position: 'absolute',
        ...positionStyle,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '6px',
        borderRadius: '10px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        animation: 'tooltip-fade 0.15s ease-out',
        background: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        width: 'max-content',
        maxWidth: '540px'
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Primary Actions Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        
        {/* Font Family Dropdown Toggle */}
        <button 
          className={`tb-btn ${activeTab === 'font' ? 'active' : ''}`}
          onClick={() => toggleTab('font')}
          title="Font Family"
          style={{ fontFamily: fontStyle.fontFamily || 'Inter', minWidth: '100px', fontSize: '0.78rem', justifyContent: 'space-between' }}
        >
          <span>{fontStyle.fontFamily || 'Inter'}</span>
          <span style={{ fontSize: '0.5rem', opacity: 0.7 }}>▼</span>
        </button>

        {/* Font Size decrease / input / increase */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
          <button 
            className="tb-btn-icon" 
            onClick={() => {
              const current = parseInt(fontStyle.fontSize) || 24;
              updateVal('fontSize', `${Math.max(current - 2, 8)}px`);
            }}
            title="Decrease Size"
          >
            <Minus size={12} />
          </button>
          <input
            type="text"
            className="tb-size-input"
            value={parseInt(fontStyle.fontSize) || 24}
            onChange={e => {
              const val = parseInt(e.target.value) || 24;
              updateVal('fontSize', `${val}px`);
            }}
            style={{
              width: '32px',
              border: 'none',
              background: 'transparent',
              textAlign: 'center',
              color: '#fff',
              fontSize: '0.78rem',
              outline: 'none'
            }}
          />
          <button 
            className="tb-btn-icon" 
            onClick={() => {
              const current = parseInt(fontStyle.fontSize) || 24;
              updateVal('fontSize', `${Math.min(current + 2, 120)}px`);
            }}
            title="Increase Size"
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="tb-divider" />

        {/* Bold, Italic, Underline, Strikethrough */}
        <button 
          className={`tb-btn-icon ${fontStyle.fontWeight === 'bold' || fontStyle.fontWeight === '700' ? 'active' : ''}`} 
          onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}
          title="Bold"
        >
          <Bold size={13} />
        </button>
        <button 
          className={`tb-btn-icon ${fontStyle.fontStyle === 'italic' ? 'active' : ''}`} 
          onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}
          title="Italic"
        >
          <Italic size={13} />
        </button>
        <button 
          className={`tb-btn-icon ${fontStyle.textDecoration === 'underline' ? 'active' : ''}`} 
          onClick={() => toggleStyle('textDecoration', 'underline', 'none')}
          title="Underline"
        >
          <Underline size={13} />
        </button>
        <button 
          className={`tb-btn-icon ${fontStyle.textDecoration === 'line-through' ? 'active' : ''}`} 
          onClick={() => toggleStyle('textDecoration', 'line-through', 'none')}
          title="Strikethrough"
        >
          <span style={{ textDecoration: 'line-through', fontWeight: 'bold', fontSize: '0.7rem' }}>S</span>
        </button>

        <div className="tb-divider" />

        {/* Color Toggles */}
        <button 
          className={`tb-btn-icon ${activeTab === 'color' ? 'active' : ''}`}
          onClick={() => toggleTab('color')}
          title="Text Color"
        >
          <Palette size={13} style={{ color: fontStyle.color || '#fff' }} />
        </button>

        <button 
          className={`tb-btn-icon ${activeTab === 'highlight' ? 'active' : ''}`}
          onClick={() => toggleTab('highlight')}
          title="Highlight Background"
        >
          <Highlighter size={13} style={{ color: fontStyle.backgroundColor || '#fbbf24' }} />
        </button>

        {/* Alignment */}
        <div style={{ display: 'flex', gap: '1px' }}>
          {[
            { id: 'left', icon: AlignLeft },
            { id: 'center', icon: AlignCenter },
            { id: 'right', icon: AlignRight },
            { id: 'justify', icon: AlignJustify }
          ].map(align => (
            <button
              key={align.id}
              className={`tb-btn-icon ${fontStyle.textAlign === align.id ? 'active' : ''}`}
              onClick={() => updateVal('textAlign', align.id)}
              title={`Align ${align.id}`}
            >
              <align.icon size={13} />
            </button>
          ))}
        </div>

        <div className="tb-divider" />

        {/* Case Conversions */}
        <button 
          className="tb-btn-icon" 
          onClick={() => toggleTab('effects')}
          title="Effects & Spacing"
        >
          <Layers size={13} />
        </button>

        <button 
          className={`tb-btn-icon ${activeTab === 'position' ? 'active' : ''}`}
          onClick={() => toggleTab('position')}
          title="Positioning"
        >
          <span style={{ fontSize: '0.62rem', fontWeight: 'bold' }}>POS</span>
        </button>

        {/* Lock/Unlock */}
        <button 
          className={`tb-btn-icon ${isLocked ? 'active' : ''}`}
          onClick={onLockToggle}
          title={isLocked ? 'Unlock Element' : 'Lock Element'}
        >
          {isLocked ? <Lock size={12} color="#f43f5e" /> : <Unlock size={12} />}
        </button>

        {/* Copy/Paste Style */}
        <button 
          className="tb-btn-icon" 
          onClick={onCopyStyle} 
          title="Copy style properties"
        >
          <Paintbrush size={12} />
        </button>
        <button 
          className="tb-btn-icon" 
          onClick={onPasteStyle} 
          disabled={!hasCopiedStyle}
          title="Paste style properties"
          style={!hasCopiedStyle ? { opacity: 0.4 } : {}}
        >
          <CopyCheck size={12} />
        </button>

        <div className="tb-divider" />

        {/* AI Assist Menu */}
        <button 
          className={`tb-btn ${activeTab === 'ai' ? 'active' : ''}`}
          style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontSize: '0.74rem', border: 'none' }}
          onClick={() => toggleTab('ai')}
          title="AI Text Editing Assistant"
        >
          <Sparkles size={11} />
          <span>AI Assist</span>
        </button>

        <div className="tb-divider" />

        {/* Duplicate and Delete */}
        <button className="tb-btn-icon" onClick={onDuplicate} title="Duplicate"><Copy size={12} /></button>
        <button className="tb-btn-icon hover-red" onClick={onDelete} title="Delete"><Trash2 size={12} /></button>
      </div>

      {/* Expanded Submenus */}
      
      {/* 1. FONT SELECTION SUBMENU */}
      {activeTab === 'font' && (
        <div className="tb-submenu-card">
          <input 
            type="text" 
            placeholder="Search fonts..." 
            value={fontSearch}
            onChange={e => setFontSearch(e.target.value)}
            className="tb-search-input"
          />
          <div className="tb-fonts-list">
            {filteredFonts.map(font => (
              <button 
                key={font} 
                className="tb-font-option-btn" 
                onClick={() => {
                  updateVal('fontFamily', font);
                  setActiveTab(null);
                }}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. COLOR SUBMENU */}
      {activeTab === 'color' && (
        <div className="tb-submenu-card">
          <div className="tb-submenu-title">Text Color</div>
          <div className="tb-colors-grid">
            {COLORS.map(c => (
              <button
                key={c}
                className="tb-color-dot"
                style={{ background: c, border: fontStyle.color === c ? '2px solid #a855f7' : '1px solid #475569' }}
                onClick={() => updateVal('color', c)}
              />
            ))}
            <input 
              type="color" 
              value={fontStyle.color || '#ffffff'}
              onChange={e => updateVal('color', e.target.value)}
              style={{ width: '20px', height: '20px', padding: 0, border: 'none', cursor: 'pointer' }}
              title="Custom Color"
            />
          </div>
        </div>
      )}

      {/* 3. HIGHLIGHT SUBMENU */}
      {activeTab === 'highlight' && (
        <div className="tb-submenu-card">
          <div className="tb-submenu-title">Highlight Color</div>
          <div className="tb-colors-grid">
            {HIGHLIGHT_COLORS.map(c => (
              <button
                key={c}
                className="tb-color-dot"
                style={{ background: c === 'transparent' ? 'repeating-linear-gradient(45deg,#ccc,#ccc 2px,#fff 2px,#fff 4px)' : c, border: fontStyle.backgroundColor === c ? '2px solid #a855f7' : '1px solid #475569' }}
                onClick={() => updateVal('backgroundColor', c)}
              />
            ))}
            <input 
              type="color" 
              value={fontStyle.backgroundColor && fontStyle.backgroundColor !== 'transparent' ? fontStyle.backgroundColor : '#fef08a'}
              onChange={e => updateVal('backgroundColor', e.target.value)}
              style={{ width: '20px', height: '20px', padding: 0, border: 'none', cursor: 'pointer' }}
              title="Custom Highlight"
            />
          </div>
        </div>
      )}

      {/* 4. EFFECTS AND SPACING SUBMENU */}
      {activeTab === 'effects' && (
        <div className="tb-submenu-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {/* Spacing Sliders */}
          <div className="tb-slider-group">
            <div className="tb-slider-labels">
              <span>Line Height</span>
              <span>{fontStyle.lineHeight || '1.2'}</span>
            </div>
            <input 
              type="range" min="0.8" max="2.5" step="0.1" 
              value={parseFloat(fontStyle.lineHeight) || 1.2}
              onChange={e => updateVal('lineHeight', e.target.value)}
            />
          </div>

          <div className="tb-slider-group">
            <div className="tb-slider-labels">
              <span>Letter Spacing</span>
              <span>{fontStyle.letterSpacing || '0px'}</span>
            </div>
            <input 
              type="range" min="-2" max="10" step="0.5" 
              value={parseFloat(fontStyle.letterSpacing) || 0}
              onChange={e => updateVal('letterSpacing', `${e.target.value}px`)}
            />
          </div>

          <div className="tb-slider-group">
            <div className="tb-slider-labels">
              <span>Opacity</span>
              <span>{fontStyle.opacity !== undefined ? `${Math.round(parseFloat(fontStyle.opacity) * 100)}%` : '100%'}</span>
            </div>
            <input 
              type="range" min="0.1" max="1" step="0.05" 
              value={fontStyle.opacity !== undefined ? parseFloat(fontStyle.opacity) : 1}
              onChange={e => updateVal('opacity', e.target.value)}
            />
          </div>

          {/* Text Effects Grid */}
          <div className="tb-effects-row">
            <button 
              className={`tb-effect-btn ${fontStyle.textShadow ? 'active' : ''}`}
              onClick={() => toggleStyle('textShadow', '2px 2px 4px rgba(0,0,0,0.5)', 'none')}
            >
              Shadow
            </button>
            <button 
              className={`tb-effect-btn ${fontStyle.textShadow && fontStyle.textShadow.includes('rgba(139,92,246,0.8)') ? 'active' : ''}`}
              onClick={() => toggleStyle('textShadow', '0 0 8px rgba(139,92,246,0.8), 0 0 16px rgba(139,92,246,0.4)', 'none')}
            >
              Glow
            </button>
            <button 
              className={`tb-effect-btn ${fontStyle.textTransform === 'uppercase' ? 'active' : ''}`}
              onClick={() => toggleStyle('textTransform', 'uppercase', 'none')}
            >
              Uppercase
            </button>
          </div>
        </div>
      )}

      {/* 5. POSITIONING SUBMENU */}
      {activeTab === 'position' && (
        <div className="tb-submenu-card" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="tb-menu-action-btn" onClick={onBringForward}>
              <ArrowUp size={11} /> Bring Forward
            </button>
            <button className="tb-menu-action-btn" onClick={onSendBackward}>
              <ArrowDown size={11} /> Send Backward
            </button>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="tb-menu-action-btn" onClick={() => updateVal('alignSelf', 'center')}>
              Center
            </button>
            <button className="tb-menu-action-btn" onClick={() => updateVal('transform', 'rotate(15deg)')}>
              Rotate 15°
            </button>
            <button className="tb-menu-action-btn" onClick={() => updateVal('transform', 'rotate(0deg)')}>
              Reset Rotation
            </button>
          </div>
        </div>
      )}

      {/* 6. AI ASSIST SUBMENU */}
      {activeTab === 'ai' && (
        <div className="tb-submenu-card" style={{ width: '180px' }}>
          <div className="tb-submenu-title" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={11} color="#a855f7" /> AI Copywriter
          </div>
          <div className="tb-ai-options-list">
            {[
              { id: 'improve', label: 'Improve Writing' },
              { id: 'rewrite', label: 'Rewrite Section' },
              { id: 'shorten', label: 'Make Shorter' },
              { id: 'expand', label: 'Expand Content' },
              { id: 'grammar', label: 'Fix Grammar' },
              { id: 'tone-professional', label: 'Make Professional' },
              { id: 'tone-casual', label: 'Make Friendly' },
              { id: 'bullets', label: 'Convert to Bullets' }
            ].map(opt => (
              <button 
                key={opt.id}
                className="tb-ai-opt-btn"
                onClick={() => {
                  onAiAction(opt.id);
                  setActiveTab(null);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
