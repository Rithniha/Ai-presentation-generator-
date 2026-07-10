import React, { useState, useEffect } from 'react';
import {
  X, Image as ImageIcon, Video, Shapes, LayoutGrid, Package, Play, Search,
  Plus, Minus, ArrowRight, CornerRightDown, HelpCircle, Heart, Clock, Star, HelpCircle as HelpIcon
} from 'lucide-react';
import ModalShell from './modals/ModalShell';
import ChartModal from './modals/ChartModal';
import AppsModal from './modals/AppsModal';

export default function EditorPanels({
  activePanel,
  onClose,
  onInsert, // (type, contentData, styleOverrides) => void
  activeElement, // selected element ID if any
  onUpdateElementStyle, // callback for customize style
  selectedElements = [],
  activeSlide = null,
  onApplyAutoLayout // callback for alignment operations
}) {

  useEffect(() => {
    if (activePanel !== 'asset') return;
    
    // Prevent background scrolling
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePanel, onClose]);

  if (!activePanel) return null;

  if (activePanel === 'asset') {
    return (
      <ModalShell title="Asset Controls" onClose={onClose}>
        <AssetPanel onInsert={onInsert} />
      </ModalShell>
    );
  }

  if (activePanel === 'chart') return <ChartModal onClose={onClose} onInsert={onInsert} />;
  if (activePanel === 'apps') return <AppsModal onClose={onClose} onInsert={onInsert} />;

  // Wrap all legacy panels in the new ModalShell until they are fully extracted
  return (
    <ModalShell 
      title={`${activePanel === 'autolayout' ? 'Auto Layout' : activePanel} Controls`} 
      onClose={onClose}
    >
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {activePanel === 'image' && <ImagePanel onInsert={onInsert} />}
        {activePanel === 'media' && <MediaPanel onInsert={onInsert} />}
        {activePanel === 'autolayout' && <AutoLayoutPanel onApplyAutoLayout={onApplyAutoLayout} selectedElements={selectedElements} />}
        {activePanel === 'mindmap' && <MindMapPanel onInsert={onInsert} />}
      </div>
    </ModalShell>
  );
}



/* ── 2. TABLE PANEL ── */
function TablePanel({ onInsert }) {
  const [hoveredGrid, setHoveredGrid] = useState({ r: 0, c: 0 });
  const [manualRows, setManualRows] = useState(3);
  const [manualCols, setManualCols] = useState(3);

  const insertTable = (rows, cols) => {
    const cells = Array(rows).fill(null).map(() => Array(cols).fill('Text'));
    onInsert('table', { rows, cols, cells }, {
      width: `${Math.min(cols * 100, 600)}px`,
      height: `${Math.min(rows * 40, 250)}px`,
      left: '100px',
      top: '150px'
    });
  };

  return (
    <div style={{ display: 'flex', width: '100%', padding: '16px 24px', boxSizing: 'border-box' }}>
      <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
          Table Size: <span style={{ color: '#7c3aed' }}>{hoveredGrid.r || 1} × {hoveredGrid.c || 1}</span>
        </span>
        {/* 20x20 Grid Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: '1px', background: '#f1f5f9', padding: '4px', borderRadius: '6px' }}>
          {Array(20).fill(null).map((_, rIdx) => (
            Array(20).fill(null).map((_, cIdx) => {
              const r = rIdx + 1;
              const c = cIdx + 1;
              const isHighlighted = r <= hoveredGrid.r && c <= hoveredGrid.c;
              return (
                <div
                  key={`${r}-${c}`}
                  onMouseEnter={() => setHoveredGrid({ r, c })}
                  onClick={() => insertTable(r, c)}
                  style={{
                    width: '10px',
                    height: '10px',
                    background: isHighlighted ? '#a855f7' : '#fff',
                    border: '0.5px solid #cbd5e1',
                    borderRadius: '1px',
                    cursor: 'pointer',
                  }}
                />
              );
            })
          ))}
        </div>
      </div>

      <div style={{ flex: 1, paddingLeft: '28px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Manual Insertion Settings</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: '#475569' }}>
            Rows
            <input 
              type="number" min="1" max="20" 
              value={manualRows}
              onChange={e => setManualRows(Math.min(parseInt(e.target.value) || 1, 20))}
              style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
            />
          </label>
          <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: '#475569' }}>
            Columns
            <input 
              type="number" min="1" max="20" 
              value={manualCols}
              onChange={e => setManualCols(Math.min(parseInt(e.target.value) || 1, 20))}
              style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
            />
          </label>
        </div>
        <button 
          onClick={() => insertTable(manualRows, manualCols)}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            border: 'none',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '6px',
            padding: '10px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            boxShadow: '0 4px 10px rgba(124, 58, 237, 0.25)'
          }}
        >
          Insert Table
        </button>
      </div>
    </div>
  );
}

/* ── 3. CHART PANEL ── */
function ChartPanel({ onInsert }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const chartCategories = ['All', 'Line', 'Bar', 'Pie', 'Scatter', 'Area', 'Radar', 'Funnel', 'Doughnut'];

  const charts = [
    { name: 'Basic Bar Chart', type: 'bar', category: 'Bar' },
    { name: 'Stacked Line Chart', type: 'line', category: 'Line' },
    { name: 'Pie Distribution', type: 'pie', category: 'Pie' },
    { name: 'Doughnut Breakdown', type: 'doughnut', category: 'Doughnut' },
    { name: 'Scatter Plot Matrix', type: 'scatter', category: 'Scatter' },
    { name: 'Gradient Area Chart', type: 'area', category: 'Area' },
    { name: 'Funnel Stage Metrics', type: 'funnel', category: 'Funnel' },
    { name: 'Radar Target Map', type: 'radar', category: 'Radar' }
  ];

  const filteredCharts = charts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' || c.category === category;
    return matchesSearch && matchesCat;
  });

  const insertChart = (c) => {
    onInsert('chart', {
      chartType: c.type,
      title: c.name,
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Metrics',
        data: [65, 59, 80, 81, 96],
        color: '#7c3aed'
      }]
    }, {
      width: '450px',
      height: '280px',
      left: '100px',
      top: '120px'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '16px 24px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '8px', top: '9px', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search charts..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '6px 8px 6px 28px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', maxWidth: 'calc(100% - 240px)' }}>
          {chartCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                border: 'none',
                background: category === cat ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                color: category === cat ? '#7c3aed' : '#64748b',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', overflowY: 'auto' }}>
        {filteredCharts.map((c, idx) => (
          <div
            key={idx}
            onClick={() => insertChart(c)}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px',
              cursor: 'pointer',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '90px',
              boxSizing: 'border-box'
            }}
            className="hover-card-border"
          >
            <div style={{ width: '100%', height: '50px', background: '#f8fafc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
              <BarChart3 size={22} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#1e293b', fontWeight: 600, marginTop: '6px', textAlign: 'center' }}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 4. IMAGE PANEL ── */
function ImagePanel({ onInsert }) {
  const [tab, setTab] = useState('pexels');
  const [search, setSearch] = useState('');

  const themes = ['Business', 'Technology', 'Education', 'Nature', 'Medical', 'Marketing', 'Finance', 'Modern', 'Minimal', 'Creative'];

  const sampleImages = [
    { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=60', desc: 'Business Meeting' },
    { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60', desc: 'Technology Coding' },
    { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=60', desc: 'Education Learning' },
    { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format&fit=crop&q=60', desc: 'Nature Forest' }
  ];

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ width: '140px', borderRight: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {[
          { id: 'upload', label: 'Upload' },
          { id: 'url', label: 'Image URL' },
          { id: 'pexels', label: 'Pexels' },
          { id: 'pixabay', label: 'Pixabay' },
          { id: 'themes', label: 'Image Themes' },
          { id: 'material', label: 'Material Library' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              padding: '10px 14px',
              textAlign: 'left',
              border: 'none',
              background: tab === item.id ? '#fff' : 'transparent',
              fontWeight: tab === item.id ? 600 : 400,
              color: tab === item.id ? '#7c3aed' : '#475569',
              borderLeft: tab === item.id ? '3px solid #7c3aed' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '0.78rem'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {(tab === 'pexels' || tab === 'pixabay') && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input 
                type="text" 
                placeholder={`Search stock images on ${tab === 'pexels' ? 'Pexels' : 'Pixabay'}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', flex: 1 }}
              />
              <button style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.78rem', cursor: 'pointer' }}>Search</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', overflowY: 'auto', flex: 1 }}>
              {sampleImages.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => onInsert('image', img.url, { width: '320px', height: '220px', left: '120px', top: '120px' })}
                  style={{ borderRadius: '6px', overflow: 'hidden', height: '90px', cursor: 'pointer', border: '1px solid #f1f5f9', position: 'relative' }}
                >
                  <img src={img.url} alt={img.desc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.62rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {img.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '24px', background: '#f8fafc', height: '100%', boxSizing: 'border-box' }}>
            <ImageIcon size={32} style={{ color: '#94a3b8', marginBottom: '8px' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Drag & Drop Files Here</span>
            <span style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '2px' }}>PNG, JPG, JPEG, WEBP or GIF</span>
            <button 
              style={{ marginTop: '12px', border: 'none', background: '#7c3aed', color: '#fff', padding: '6px 14px', borderRadius: '4px', fontSize: '0.76rem', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => onInsert('image', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500', { width: '320px', height: '220px', left: '100px', top: '100px' })}
            >
              Browse Files
            </button>
          </div>
        )}

        {tab === 'url' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <h4 style={{ margin: 0, fontSize: '0.82rem', color: '#1e293b' }}>Insert Image from URL</h4>
            <input 
              type="text" 
              placeholder="Paste absolute image URL (e.g. https://example.com/image.png)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
            />
            <button
              onClick={() => {
                if (search.trim()) {
                  onInsert('image', search, { width: '320px', height: '220px' });
                  setSearch('');
                }
              }}
              style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.78rem', cursor: 'pointer', width: 'max-content' }}
            >
              Insert Image
            </button>
          </div>
        )}

        {tab === 'themes' && (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#1e293b' }}>Image Themes Collection</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {themes.map((t, idx) => (
                <div 
                  key={idx}
                  onClick={() => onInsert('image', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500', { width: '320px', height: '220px' })}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #c084fc)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.15)',
                    minHeight: '55px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'material' && (
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: '#1e293b' }}>Default Material Assets</h4>
            <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Select background patterns and stock vector illustrations.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 5. MEDIA PANEL ── */
function MediaPanel({ onInsert }) {
  const [tab, setTab] = useState('library');

  const mediaList = [
    { name: 'Executive Overview Video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video', size: '2.4 MB' },
    { name: 'Background Instrumental Audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', type: 'audio', size: '4.8 MB' }
  ];

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ width: '120px', borderRight: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <button 
          onClick={() => setTab('library')}
          style={{
            padding: '12px 14px',
            textAlign: 'left',
            border: 'none',
            background: tab === 'library' ? '#fff' : 'transparent',
            fontWeight: tab === 'library' ? 600 : 400,
            color: tab === 'library' ? '#7c3aed' : '#475569',
            borderLeft: tab === 'library' ? '3px solid #7c3aed' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '0.78rem'
          }}
        >
          Media Library
        </button>
        <button 
          onClick={() => setTab('upload')}
          style={{
            padding: '12px 14px',
            textAlign: 'left',
            border: 'none',
            background: tab === 'upload' ? '#fff' : 'transparent',
            fontWeight: tab === 'upload' ? 600 : 400,
            color: tab === 'upload' ? '#7c3aed' : '#475569',
            borderLeft: tab === 'upload' ? '3px solid #7c3aed' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '0.78rem'
          }}
        >
          Upload Media
        </button>
      </div>

      <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
        {tab === 'library' ? (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#1e293b' }}>Select Media to Insert</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {mediaList.map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => onInsert(m.type, m.url, { width: m.type === 'video' ? '360px' : '300px', height: m.type === 'video' ? '200px' : '60px', left: '100px', top: '150px' })}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '80px'
                  }}
                  className="hover-card-border"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#1e293b' }}>{m.name}</span>
                    <span style={{ fontSize: '0.62rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', color: '#475569', textTransform: 'uppercase' }}>{m.type}</span>
                  </div>
                  <span style={{ fontSize: '0.64rem', color: '#94a3b8', marginTop: '6px' }}>Size: {m.size}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '24px', background: '#f8fafc', height: '100%', boxSizing: 'border-box' }}>
            <Video size={32} style={{ color: '#94a3b8', marginBottom: '8px' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Drag & Drop Video/Audio Files Here</span>
            <span style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '2px' }}>MP4, WEBM, MOV, MP3, WAV or AAC</span>
            <button 
              style={{ marginTop: '12px', border: 'none', background: '#7c3aed', color: '#fff', padding: '6px 14px', borderRadius: '4px', fontSize: '0.76rem', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => onInsert('video', 'https://www.w3schools.com/html/mov_bbb.mp4', { width: '360px', height: '200px' })}
            >
              Browse Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 6. SHAPE PANEL ── */
function ShapePanel({ onInsert }) {
  const [cat, setCat] = useState('All');

  const categories = [
    'All', 'Rectangle', 'Circle', 'Triangle', 'Basic Shapes', 'Lines', 
    'Arrows', 'Flowchart', 'Callouts', 'Stars', 'Mathematics', 'Science', 'Biology', 'Icons'
  ];

  const shapes = [
    { name: 'Rectangle', type: 'rectangle', cat: 'Rectangle', svg: <rect x="5" y="5" width="40" height="40" fill="currentColor" rx="4" /> },
    { name: 'Circle', type: 'circle', cat: 'Circle', svg: <circle cx="25" cy="25" r="20" fill="currentColor" /> },
    { name: 'Triangle', type: 'triangle', cat: 'Triangle', svg: <polygon points="25,5 45,45 5,45" fill="currentColor" /> },
    { name: 'Right Arrow', type: 'arrow-right', cat: 'Arrows', svg: <path d="M5,20 H35 V10 L45,25 L35,40 V30 H5 Z" fill="currentColor" /> },
    { name: 'Down Arrow', type: 'arrow-down', cat: 'Arrows', svg: <path d="M20,5 V35 H10 L25,45 L40,35 H30 V5 Z" fill="currentColor" /> },
    { name: 'Star', type: 'star', cat: 'Stars', svg: <polygon points="25,2 32,16 47,18 36,29 39,44 25,37 11,44 14,29 3,18 18,16" fill="currentColor" /> },
    { name: 'Diamond', type: 'diamond', cat: 'Flowchart', svg: <polygon points="25,5 45,25 25,45 5,25" fill="currentColor" /> },
    { name: 'Database', type: 'database', cat: 'Flowchart', svg: <path d="M10,12 C10,6 40,6 40,12 V38 C40,44 10,44 10,38 Z M10,20 C10,26 40,26 40,20 M10,30 C10,36 40,36 40,30" fill="none" stroke="currentColor" strokeWidth="3" /> }
  ];

  const filteredShapes = shapes.filter(s => cat === 'All' || s.cat === cat);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ width: '130px', borderRight: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              padding: '10px 14px',
              textAlign: 'left',
              border: 'none',
              background: cat === c ? '#fff' : 'transparent',
              fontWeight: cat === c ? 600 : 400,
              color: cat === c ? '#7c3aed' : '#475569',
              borderLeft: cat === c ? '3px solid #7c3aed' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '0.78rem',
              whiteSpace: 'nowrap'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
          {filteredShapes.map((shape, idx) => (
            <div
              key={idx}
              onClick={() => onInsert('shape', {
                shapeType: shape.type,
                fill: '#7c3aed',
                stroke: '#ffffff',
                strokeWidth: 2,
                opacity: 1
              }, {
                width: '120px',
                height: '120px',
                left: '150px',
                top: '150px'
              })}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                boxSizing: 'border-box'
              }}
              className="hover-card-border"
            >
              <svg width="35" height="35" viewBox="0 0 50 50" style={{ color: '#7c3aed' }}>
                {shape.svg}
              </svg>
              <span style={{ fontSize: '0.62rem', color: '#475569', marginTop: '6px', textAlign: 'center', fontWeight: 500 }}>{shape.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 7. FORMULA PANEL ── */
function FormulaPanel({ onInsert, isKaTeXLoaded }) {
  const [tab, setTab] = useState('formulas');
  const [latex, setLatex] = useState('e = mc^2');
  const [previewHtml, setPreviewHtml] = useState('');

  const commonFormulas = [
    { name: 'Einstein Mass-Energy', code: 'E = mc^2' },
    { name: 'Quadratic Equation Solution', code: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    { name: 'Euler Identity Formula', code: 'e^{i\\pi} + 1 = 0' },
    { name: 'Maxwell Gauss Law', code: '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}' },
    { name: 'Pythagorean Theorem', code: 'a^2 + b^2 = c^2' },
    { name: 'Fourier Transform Definition', code: '\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi} dx' }
  ];

  const symbolsList = [
    { label: 'Alpha', code: '\\alpha' },
    { label: 'Beta', code: '\\beta' },
    { label: 'Gamma', code: '\\gamma' },
    { label: 'Theta', code: '\\theta' },
    { label: 'Pi Ratio', code: '\\pi' },
    { label: 'Integral', code: '\\int' },
    { label: 'Summation', code: '\\sum' },
    { label: 'Infinity', code: '\\infty' },
    { label: 'Square Root', code: '\\sqrt{x}' }
  ];

  useEffect(() => {
    if (isKaTeXLoaded && window.katex) {
      try {
        const html = window.katex.renderToString(latex, { throwOnError: false });
        setPreviewHtml(html);
      } catch (err) {
        console.warn(err);
      }
    } else {
      setPreviewHtml(`<span style="color:#64748b; font-size:0.8rem">${latex}</span>`);
    }
  }, [latex, isKaTeXLoaded]);

  const insertFormula = (code = latex) => {
    onInsert('formula', code, {
      width: '280px',
      height: '80px',
      left: '120px',
      top: '160px'
    });
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ width: '130px', borderRight: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <button 
          onClick={() => setTab('formulas')}
          style={{
            padding: '12px 14px',
            textAlign: 'left',
            border: 'none',
            background: tab === 'formulas' ? '#fff' : 'transparent',
            fontWeight: tab === 'formulas' ? 600 : 400,
            color: tab === 'formulas' ? '#7c3aed' : '#475569',
            borderLeft: tab === 'formulas' ? '3px solid #7c3aed' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '0.78rem'
          }}
        >
          Common Formulas
        </button>
        <button 
          onClick={() => setTab('symbols')}
          style={{
            padding: '12px 14px',
            textAlign: 'left',
            border: 'none',
            background: tab === 'symbols' ? '#fff' : 'transparent',
            fontWeight: tab === 'symbols' ? 600 : 400,
            color: tab === 'symbols' ? '#7c3aed' : '#475569',
            borderLeft: tab === 'symbols' ? '3px solid #7c3aed' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '0.78rem'
          }}
        >
          Math Symbols
        </button>
      </div>

      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', gap: '20px', overflowY: 'auto' }}>
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#334155' }}>LaTeX Editor</label>
          <textarea
            value={latex}
            onChange={e => setLatex(e.target.value)}
            style={{
              width: '100%',
              height: '80px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              padding: '8px',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              resize: 'none'
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Live Preview</span>
            <div 
              style={{
                minHeight: '50px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflowX: 'auto'
              }}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>

          <button
            onClick={() => insertFormula()}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '5px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              width: 'max-content',
              marginTop: '6px'
            }}
          >
            Insert Formula
          </button>
        </div>

        <div style={{ flex: 1, borderLeft: '1px solid #e2e8f0', paddingLeft: '16px', maxHeight: '280px', overflowY: 'auto' }}>
          {tab === 'formulas' ? (
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '8px' }}>Common Presets</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {commonFormulas.map((f, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLatex(f.code)}
                    style={{
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.72rem'
                    }}
                    className="hover-card-border"
                  >
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{f.name}</div>
                    <div style={{ fontFamily: 'monospace', color: '#7c3aed', marginTop: '2px', opacity: 0.85 }}>{f.code}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '8px' }}>Inject Symbols</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {symbolsList.map((sym, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLatex(prev => prev + ' ' + sym.code)}
                    style={{
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      padding: '8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    className="hover-card-border"
                  >
                    <span style={{ fontSize: '0.88rem', color: '#1e293b' }}>{sym.label}</span>
                    <span style={{ fontFamily: 'monospace', color: '#a855f7', marginTop: '2px', fontSize: '0.62rem' }}>{sym.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 8. AUTO LAYOUT PANEL ── */
function AutoLayoutPanel({ onApplyAutoLayout, selectedElements }) {
  const options = [
    { id: 'center', label: 'Center Canvas', desc: 'Position selected elements in the exact center.' },
    { id: 'left', label: 'Align Left', desc: 'Align elements along the left margin.' },
    { id: 'right', label: 'Align Right', desc: 'Align elements along the right margin.' },
    { id: 'top', label: 'Align Top', desc: 'Align elements along the top margin.' },
    { id: 'bottom', label: 'Align Bottom', desc: 'Align elements along the bottom margin.' },
    { id: 'even-space', label: 'Even Spacing', desc: 'Distribute space equally between elements.' },
    { id: 'smart-grid', label: 'Smart Grid', desc: 'Snap elements into clean row/col grid layouts.' },
    { id: 'equal-size', label: 'Equal Size', desc: 'Set same width and height across selections.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '20px 24px', boxSizing: 'border-box' }}>
      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.88rem', color: '#1e293b' }}>Auto Layout Alignments</h4>
      <p style={{ margin: '0 0 16px 0', fontSize: '0.72rem', color: '#64748b' }}>
        Select elements on the canvas, then apply alignments immediately.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', flex: 1, overflowY: 'auto' }}>
        {options.map((opt, idx) => (
          <div
            key={idx}
            onClick={() => onApplyAutoLayout(opt.id)}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px',
              cursor: 'pointer',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '75px',
              boxSizing: 'border-box'
            }}
            className="hover-card-border"
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b' }}>{opt.label}</span>
            <span style={{ fontSize: '0.64rem', color: '#64748b', marginTop: '4px', lineHeight: '1.2' }}>{opt.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 9. ASSET PANEL ── */
function AssetPanel({ onInsert }) {
  const [tab, setTab] = useState('icons');
  const [search, setSearch] = useState('');

  const sampleAssets = {
    icons: [
      { label: 'Star Icon', code: '⭐' },
      { label: 'Idea Bulb', code: '💡' },
      { label: 'Success Target', code: '🎯' },
      { label: 'Global Network', code: '🌐' }
    ],
    stickers: [
      { label: 'Hooray Sticker', code: '🎉' },
      { label: 'Fire Hot', code: '🔥' },
      { label: 'Thumbs Up', code: '👍' },
      { label: 'Great Work Badge', code: '🏅' }
    ],
    illustrations: [
      { label: 'Startup Launch Vector', code: '🚀' },
      { label: 'Data Analysis Chart', code: '📊' },
      { label: 'Secure Security', code: '🔒' }
    ]
  };

  const filteredAssets = (sampleAssets[tab] || []).filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ width: '140px', borderRight: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {[
          { id: 'icons', label: 'Icons' },
          { id: 'stickers', label: 'Stickers' },
          { id: 'illustrations', label: 'Illustrations' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              padding: '12px 14px',
              textAlign: 'left',
              border: 'none',
              background: tab === item.id ? '#fff' : 'transparent',
              fontWeight: tab === item.id ? 600 : 400,
              color: tab === item.id ? '#7c3aed' : '#475569',
              borderLeft: tab === item.id ? '3px solid #7c3aed' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '0.78rem'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '16px' }}>
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', width: '240px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', flex: 1 }}>
          {filteredAssets.map((asset, idx) => (
            <div
              key={idx}
              onClick={() => onInsert('asset', asset, { width: '80px', height: '80px', left: '150px', top: '150px' })}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '160px',
                boxSizing: 'border-box'
              }}
              className="hover-card-border"
            >
              <span style={{ fontSize: '3rem', marginBottom: '12px' }}>{asset.code}</span>
              <span style={{ fontSize: '0.75rem', color: '#475569', textAlign: 'center', fontWeight: 500 }}>{asset.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 10. MIND MAP PANEL ── */
function MindMapPanel({ onInsert }) {
  const mindMapTypes = [
    { name: 'Radial Brainstorm', desc: 'Central idea branching out symmetrically.' },
    { name: 'Logical Flow Tree', desc: 'Top-down hierarchical node mapping.' },
    { name: 'Strategy Roadmap Layout', desc: 'Horizontal timeline-oriented roadmap tree.' }
  ];

  const insertMindMap = (type) => {
    onInsert('mindmap', {
      mapType: type.name,
      rootNode: {
        text: 'Central Topic',
        children: [
          { text: 'Subtopic 1', children: [] },
          { text: 'Subtopic 2', children: [] }
        ]
      }
    }, {
      width: '450px',
      height: '250px',
      left: '100px',
      top: '120px'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '20px 24px', boxSizing: 'border-box' }}>
      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.88rem', color: '#1e293b' }}>Insert Mind Map</h4>
      <p style={{ margin: '0 0 16px 0', fontSize: '0.72rem', color: '#64748b' }}>
        Select a diagram type below to add a dynamic mind map to your active slide.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {mindMapTypes.map((type, idx) => (
          <div
            key={idx}
            onClick={() => insertMindMap(type)}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px',
              background: '#fff',
              cursor: 'pointer',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}
            className="hover-card-border"
          >
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', display: 'block' }}>{type.name}</span>
              <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block', marginTop: '6px', lineHeight: '1.3' }}>{type.desc}</span>
            </div>
            <span style={{ fontSize: '0.64rem', color: '#7c3aed', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Add to Slide <ArrowRight size={10} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
