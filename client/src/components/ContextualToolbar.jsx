import React, { useState } from 'react';
import {
  Bold, Italic, Underline, Sparkles, Plus, Minus, Palette
} from 'lucide-react';

const FONTS = [
  'Inter', 'Outfit', 'Playfair Display', 'Merriweather', 'Fira Code', 
  'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana'
];

const COLORS = [
  '#000000', '#ffffff', '#1e293b', '#64748b', '#ef4444', 
  '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', 
  '#6366f1', '#a855f7', '#ec4899'
];

export default function ContextualToolbar({
  activeElement,
  style,
  onUpdateStyle,
  onAiAction,
  positionStyle // { top, left }
}) {
  const [activeTab, setActiveTab] = useState(null); // 'font', 'color', 'ai'
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 6px',
        borderRadius: '8px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        background: 'rgba(15, 23, 42, 0.96)',
        color: '#f8fafc',
        width: 'max-content',
        height: '36px',
        boxSizing: 'border-box'
      }}
      onClick={e => e.stopPropagation()}
    >
      
      {/* 1. Font Family Dropdown */}
      <button 
        className={`tb-btn ${activeTab === 'font' ? 'active' : ''}`}
        onClick={() => toggleTab('font')}
        title="Font Family"
        style={{ 
          fontFamily: fontStyle.fontFamily || 'Inter', 
          minWidth: '90px', 
          fontSize: '0.74rem', 
          padding: '2px 6px',
          height: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75px' }}>
          {fontStyle.fontFamily || 'Inter'}
        </span>
        <span style={{ fontSize: '0.45rem', opacity: 0.7, marginLeft: '2px' }}>▼</span>
      </button>

      <div className="tb-divider" />

      {/* 2. Font Size controls */}
      <div style={{ display: 'flex', alignItems: 'center', height: '26px' }}>
        <button 
          className="tb-btn-icon" 
          onClick={() => {
            const current = parseInt(fontStyle.fontSize) || 24;
            updateVal('fontSize', `${Math.max(current - 2, 8)}px`);
          }}
          title="Decrease Size"
          style={{ width: '22px', height: '22px' }}
        >
          <Minus size={11} />
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
            width: '26px',
            border: 'none',
            background: 'transparent',
            textAlign: 'center',
            color: '#fff',
            fontSize: '0.74rem',
            outline: 'none',
            padding: 0
          }}
        />
        <button 
          className="tb-btn-icon" 
          onClick={() => {
            const current = parseInt(fontStyle.fontSize) || 24;
            updateVal('fontSize', `${Math.min(current + 2, 120)}px`);
          }}
          title="Increase Size"
          style={{ width: '22px', height: '22px' }}
        >
          <Plus size={11} />
        </button>
      </div>

      <div className="tb-divider" />

      {/* 3. Bold */}
      <button 
        className={`tb-btn-icon ${fontStyle.fontWeight === 'bold' || fontStyle.fontWeight === '700' ? 'active' : ''}`} 
        onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}
        title="Bold"
        style={{ width: '26px', height: '26px' }}
      >
        <Bold size={12} />
      </button>

      {/* 4. Italic */}
      <button 
        className={`tb-btn-icon ${fontStyle.fontStyle === 'italic' ? 'active' : ''}`} 
        onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}
        title="Italic"
        style={{ width: '26px', height: '26px' }}
      >
        <Italic size={12} />
      </button>

      {/* 5. Underline */}
      <button 
        className={`tb-btn-icon ${fontStyle.textDecoration === 'underline' ? 'active' : ''}`} 
        onClick={() => toggleStyle('textDecoration', 'underline', 'none')}
        title="Underline"
        style={{ width: '26px', height: '26px' }}
      >
        <Underline size={12} />
      </button>

      <div className="tb-divider" />

      {/* 6. Text Color */}
      <button 
        className={`tb-btn-icon ${activeTab === 'color' ? 'active' : ''}`}
        onClick={() => toggleTab('color')}
        title="Text Color"
        style={{ width: '26px', height: '26px' }}
      >
        <Palette size={12} style={{ color: fontStyle.color || '#fff' }} />
      </button>

      <div className="tb-divider" />

      {/* 7. AI Assistant */}
      <button 
        className={`tb-btn ${activeTab === 'ai' ? 'active' : ''}`}
        style={{ 
          background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', 
          color: '#fff', 
          fontSize: '0.72rem', 
          border: 'none',
          padding: '2px 8px',
          height: '24px',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer'
        }}
        onClick={() => toggleTab('ai')}
        title="AI Copywriter"
      >
        <Sparkles size={11} />
        <span>AI Assist</span>
      </button>

      {/* EXPANDED SUBMENUS */}

      {/* Font Family List Dropdown */}
      {activeTab === 'font' && (
        <div className="tb-submenu-card" style={{ top: '38px', minWidth: '130px' }}>
          <input 
            type="text" 
            placeholder="Search..." 
            value={fontSearch}
            onChange={e => setFontSearch(e.target.value)}
            className="tb-search-input"
            style={{ fontSize: '0.68rem', padding: '3px 6px', margin: '0 0 4px 0' }}
          />
          <div className="tb-fonts-list" style={{ maxHeight: '120px' }}>
            {filteredFonts.map(font => (
              <button 
                key={font} 
                className="tb-font-option-btn" 
                onClick={() => {
                  updateVal('fontFamily', font);
                  setActiveTab(null);
                }}
                style={{ fontFamily: font, fontSize: '0.72rem', padding: '3px 5px' }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Text Color Grid Dropdown */}
      {activeTab === 'color' && (
        <div className="tb-submenu-card" style={{ top: '38px', padding: '6px', minWidth: '120px' }}>
          <div className="tb-colors-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px' }}>
            {COLORS.map(c => (
              <button
                key={c}
                className="tb-color-dot"
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  background: c, 
                  border: fontStyle.color === c ? '1.5px solid #a855f7' : '1px solid #475569',
                  borderRadius: '50%',
                  padding: 0
                }}
                onClick={() => {
                  updateVal('color', c);
                  setActiveTab(null);
                }}
              />
            ))}
            <input 
              type="color" 
              value={fontStyle.color || '#ffffff'}
              onChange={e => updateVal('color', e.target.value)}
              style={{ width: '18px', height: '18px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '50%' }}
              title="Custom Color"
            />
          </div>
        </div>
      )}

      {/* AI Assistant Menu Dropdown */}
      {activeTab === 'ai' && (
        <div className="tb-submenu-card" style={{ top: '38px', right: 0, left: 'auto', width: '160px' }}>
          <div className="tb-ai-options-list">
            {[
              { id: 'improve', label: 'Improve Writing' },
              { id: 'rewrite', label: 'Rewrite' },
              { id: 'shorten', label: 'Shorten' },
              { id: 'expand', label: 'Expand' },
              { id: 'grammar', label: 'Fix Grammar' },
              { id: 'tone-professional', label: 'Change Tone' },
              { id: 'notes', label: 'Generate Speaker Notes' }
            ].map(opt => (
              <button 
                key={opt.id}
                className="tb-ai-opt-btn"
                onClick={() => {
                  onAiAction(opt.id);
                  setActiveTab(null);
                }}
                style={{ fontSize: '0.68rem', padding: '3px 6px' }}
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
