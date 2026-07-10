import React, { useState, useMemo } from 'react';
import ModalShell from './ModalShell';
import { 
  Search, Star, Grid, Cpu, BarChart3, Image as ImageIcon, Link, 
  Database, Video, MapPin, FileText, Code, Layers, Layout, 
  MessageSquare, Share2, Users, Play, Info, ArrowLeft, Check, Sparkles
} from 'lucide-react';

export default function AppsModal({ onClose, onInsert }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [connectedApps, setConnectedApps] = useState(['youtube']); // Default connected
  const [favorites, setFavorites] = useState(['figma']); // Default favorites

  const tabs = [
    { id: 'all', label: 'All Apps' },
    { id: 'embed', label: 'Embed' },
    { id: 'storage', label: 'Storage' },
    { id: 'design', label: 'Design' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'ai', label: 'AI Tools' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'social', label: 'Social Media' },
    { id: 'collaboration', label: 'Collaboration' },
    { id: 'favorites', label: 'Favorites' }
  ];

  const appsData = useMemo(() => [
    // Embeds
    { id: 'webpage', cat: 'embed', name: 'Webpage Embed', desc: 'Embed any live webpage directly onto your slide.', icon: <Code size={24} color="#3b82f6" />, features: ['Responsive iframe rendering', 'Scrollable views', 'Custom viewport aspect ratios'], permissions: ['View slides data', 'Load external network domains'] },
    { id: 'youtube', cat: 'embed', name: 'YouTube Video', desc: 'Add videos from YouTube directly into presentation slides.', icon: <Video size={24} color="#ef4444" />, features: ['Inline playback controls', 'Autoplay options', 'Start/End timestamp configuration'], permissions: ['Play video streams', 'Interact with media controls'] },
    { id: 'vimeo', cat: 'embed', name: 'Vimeo Player', desc: 'Embed professional Vimeo videos into slides.', icon: <Play size={24} color="#06b6d4" />, features: ['HD video playback', 'No distractions overlay', 'Custom player sizing'], permissions: ['Play video streams'] },
    { id: 'google-maps', cat: 'embed', name: 'Google Maps', desc: 'Add interactive, searchable map locations.', icon: <MapPin size={24} color="#10b981" />, features: ['Pan and zoom controls', 'Satellite/Street views', 'Marker customizations'], permissions: ['Access location domains'] },
    { id: 'pdf-viewer', cat: 'embed', name: 'PDF Viewer', desc: 'Embed complete PDF documents in slides.', icon: <FileText size={24} color="#f43f5e" />, features: ['Page-by-page scrolling', 'Thumbnail view', 'Searchable PDF text'], permissions: ['Access presentation files'] },
    { id: 'codepen', cat: 'embed', name: 'CodePen Embed', desc: 'Display live frontend code demos.', icon: <Code size={24} color="#0f172a" />, features: ['Live preview rendering', 'HTML/CSS/JS tab switcher', 'Editable playground mode'], permissions: ['Execute sandboxed iframe environments'] },
    { id: 'loom', cat: 'embed', name: 'Loom Video', desc: 'Insert quick screen recording presentations.', icon: <Video size={24} color="#6366f1" />, features: ['Picture-in-picture player', 'Custom playback speed controls'], permissions: ['Play video streams'] },

    // Storage
    { id: 'google-drive', cat: 'storage', name: 'Google Drive', desc: 'Import presentation slides, media assets, and files.', icon: <Database size={24} color="#3b82f6" />, features: ['Seamless cloud import', 'Real-time synchronization', 'Support for docs, slides, and sheets'], permissions: ['Read personal file list', 'Download media assets'] },
    { id: 'onedrive', cat: 'storage', name: 'OneDrive', desc: 'Access and import Microsoft 365 cloud files.', icon: <Database size={24} color="#0284c7" />, features: ['Sync with active directories', 'Shared library explorer'], permissions: ['Access personal folders'] },
    { id: 'dropbox', cat: 'storage', name: 'Dropbox Sync', desc: 'Link shared folders to keep assets fresh.', icon: <Database size={24} color="#2563eb" />, features: ['Instant image & asset syncing', 'Auto-updating links'], permissions: ['Read folders and content'] },

    // Design
    { id: 'figma', cat: 'design', name: 'Figma Embed', desc: 'Sync frames and layouts from Figma live.', icon: <Layers size={24} color="#7c3aed" />, features: ['Real-time design sync', 'Interactive vector rendering', 'Inspect components'], permissions: ['Access Figma team files', 'Fetch prototype previews'] },
    { id: 'canva', cat: 'design', name: 'Canva Templates', desc: 'Import beautiful template elements.', icon: <Layout size={24} color="#06b6d4" />, features: ['Canva design generator', 'Direct import of templates'], permissions: ['Link Canva workspace'] },
    { id: 'miro', cat: 'design', name: 'Miro Board', desc: 'Collaborate and show whiteboard flowcharts.', icon: <Layout size={24} color="#f59e0b" />, features: ['Interactive whiteboarding view', 'Sticky notes embed'], permissions: ['Access Miro team files'] },

    // AI
    { id: 'openai', cat: 'ai', name: 'OpenAI GPT-4', desc: 'Use AI to generate presentation copy and slides.', icon: <Cpu size={24} color="#10b981" />, features: ['GPT-4 text assistant', 'Outline generation', 'Grammar correction & summarizing'], permissions: ['Modify slide text', 'Generate slide outline layouts'] },
    { id: 'gemini', cat: 'ai', name: 'Google Gemini', desc: 'Advanced multimodal AI for text and layout suggestions.', icon: <Cpu size={24} color="#6366f1" />, features: ['Gemini Ultra reasoning engine', 'Image generation suggestions'], permissions: ['Modify slide content'] },

    // Analytics
    { id: 'power-bi', cat: 'analytics', name: 'Power BI', desc: 'Embed live interactive business intelligence dashboards.', icon: <BarChart3 size={24} color="#eab308" />, features: ['Live dataset synchronization', 'Interactive chart filtering'], permissions: ['Access Power BI workspace', 'Read analytical charts'] }
  ], []);

  const toggleFavorite = (appId, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const toggleConnect = (appId) => {
    setConnectedApps(prev => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const filteredApps = useMemo(() => {
    return appsData.filter(app => {
      const matchesTab = activeTab === 'all' || 
                         (activeTab === 'favorites' && favorites.includes(app.id)) ||
                         app.cat === activeTab;
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.cat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [appsData, activeTab, favorites, searchQuery]);

  return (
    <ModalShell 
      title="Apps & Integrations" 
      onClose={onClose}
      sidebarTabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
        {/* Header Title & Subtitle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Connect external services, embed content, and extend your presentation.
            </p>
          </div>
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search apps..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px',
                border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Content Body (Split Grid & Details View) */}
        <div style={{ flex: 1, display: 'flex', gap: '24px', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {/* Recommended Section (Only on "All" tab) */}
            {activeTab === 'all' && !searchQuery && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#7c3aed" /> Recommended Apps
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {appsData.filter(app => ['google-drive', 'figma', 'youtube', 'openai', 'power-bi'].includes(app.id)).map(app => (
                    <div 
                      key={`rec-${app.id}`}
                      onClick={() => setSelectedApp(app)}
                      style={{
                        border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px',
                        display: 'flex', gap: '12px', cursor: 'pointer', background: '#faf5ff', transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', flexShrink: 0 }}>
                        {app.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>{app.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{app.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid of Apps */}
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
              {tabs.find(t => t.id === activeTab)?.label}
            </h4>

            {filteredApps.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
                <Grid size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ fontSize: '0.9rem' }}>No apps found. Try another search.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {filteredApps.map(app => (
                  <div 
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    style={{
                      border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px',
                      display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer',
                      transition: 'all 0.2s', background: '#fff', position: 'relative'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.06)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Top Row: Icon & Star */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {app.icon}
                      </div>
                      <button 
                        onClick={(e) => toggleFavorite(app.id, e)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: favorites.includes(app.id) ? '#f59e0b' : '#cbd5e1' }}
                      >
                        <Star size={16} fill={favorites.includes(app.id) ? '#f59e0b' : 'transparent'} />
                      </button>
                    </div>

                    {/* App Description */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {app.name}
                        {connectedApps.includes(app.id) && (
                          <span style={{ fontSize: '0.65rem', background: '#ecfdf5', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>Connected</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: '1.4' }}>{app.desc}</p>
                    </div>

                    {/* Footer Button */}
                    <button 
                      style={{
                        width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1',
                        background: connectedApps.includes(app.id) ? '#f8fafc' : '#7c3aed',
                        color: connectedApps.includes(app.id) ? '#475569' : '#fff',
                        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      {connectedApps.includes(app.id) ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Slide-over details panel on right */}
          {selectedApp && (
            <div style={{
              width: '300px', borderLeft: '1px solid #e2e8f0', paddingLeft: '24px',
              display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto'
            }}>
              {/* Back / Close button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => setSelectedApp(null)}
                  style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b', cursor: 'pointer' }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              </div>

              {/* Large Icon & Info */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  {selectedApp.icon}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>{selectedApp.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>Category: {selectedApp.cat}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h5 style={{ margin: '0 0 6px 0', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Description</h5>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', lineHeight: '1.5' }}>{selectedApp.desc}</p>
              </div>

              {/* Features List */}
              {selectedApp.features && (
                <div>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Key Features</h5>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {selectedApp.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Permissions Required */}
              {selectedApp.permissions && (
                <div>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Permissions</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedApp.permissions.map((perm, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.7rem', color: '#64748b' }}>
                        <Check size={12} color="#10b981" />
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => toggleConnect(selectedApp.id)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                    background: connectedApps.includes(selectedApp.id) ? '#ef4444' : '#7c3aed',
                    color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  {connectedApps.includes(selectedApp.id) ? 'Disconnect App' : 'Connect / Install'}
                </button>
                <a 
                  href="#" 
                  style={{ textAlign: 'center', fontSize: '0.75rem', color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}
                  onClick={e => e.preventDefault()}
                >
                  View Documentation
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
