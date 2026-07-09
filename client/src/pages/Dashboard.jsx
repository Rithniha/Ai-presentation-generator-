import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  FileEdit, 
  Trash2, 
  UploadCloud, 
  Plus, 
  Search,
  MoreVertical,
  Play,
  Settings,
  Bell,
  Sun,
  Moon,
  Sparkles,
  LayoutTemplate,
  Copy,
  FolderSync,
  Trash,
  RotateCcw,
  Check,
  X,
  History,
  TrendingUp,
  Cpu,
  Bookmark,
  Volume2
} from 'lucide-react';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // States
  const [activeTab, setActiveTab] = useState('my_work');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [renamingPresentation, setRenamingPresentation] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dummy Presentations Data
  const [presentations, setPresentations] = useState([
    { id: 1, title: 'Q3 Marketing Strategy', date: 'Oct 12, 2026', status: 'published', type: 'my_work', thumbnail: 'linear-gradient(135deg, #6C5CE7 0%, #8B5CF6 100%)', slides: 12, aiGenerated: true, views: 342 },
    { id: 2, title: 'Investor Pitch Deck', date: 'Oct 10, 2026', status: 'published', type: 'my_work', thumbnail: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)', slides: 10, aiGenerated: true, views: 189 },
    { id: 3, title: 'Product Launch Q4', date: 'Oct 05, 2026', status: 'draft', type: 'drafts', thumbnail: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', slides: 8, aiGenerated: false, views: 0 },
    { id: 4, title: 'Team Onboarding', date: 'Sep 28, 2026', status: 'draft', type: 'drafts', thumbnail: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', slides: 15, aiGenerated: true, views: 12 },
    { id: 5, title: 'Old Financials 2025', date: 'Jan 15, 2026', status: 'deleted', type: 'recycle_bin', thumbnail: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)', slides: 20, aiGenerated: false, views: 567 }
  ]);

  // Recent Activity Log state
  const [activities, setActivities] = useState([
    { id: 1, text: 'You edited Q3 Marketing Strategy', date: '2 hours ago', type: 'edit' },
    { id: 2, text: 'AI generated Investor Pitch Deck', date: '1 day ago', type: 'ai' },
    { id: 3, text: 'You deleted Old Financials 2025', date: '3 days ago', type: 'delete' }
  ]);

  // AI tips
  const tips = [
    "Try using the 'Persuasive' tone for sales decks.",
    "Visual-heavy slides see 40% higher attention rates.",
    "You can export decks directly to PPTX format anytime.",
    "Keep key statements under 6 words for maximal punch."
  ];
  const [tipText] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  // Close card menus on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const addActivity = (text, type) => {
    setActivities(prev => [
      { id: Date.now(), text, date: 'Just now', type },
      ...prev
    ]);
  };

  // Card Menu Handlers
  const handleOpenRename = (pres, e) => {
    e.stopPropagation();
    setRenamingPresentation(pres);
    setNewTitle(pres.title);
    setActiveMenuId(null);
  };

  const submitRename = () => {
    if (!newTitle.trim()) return;
    setPresentations(prev => prev.map(p => p.id === renamingPresentation.id ? { ...p, title: newTitle.trim() } : p));
    addActivity(`You renamed '${renamingPresentation.title}' to '${newTitle.trim()}'`, 'edit');
    triggerToast(`Renamed to "${newTitle.trim()}"`);
    setRenamingPresentation(null);
  };

  const handleDuplicate = (pres, e) => {
    e.stopPropagation();
    const newPres = {
      ...pres,
      id: Date.now(),
      title: `${pres.title} (Copy)`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      views: 0
    };
    setPresentations(prev => [...prev, newPres]);
    addActivity(`You duplicated '${pres.title}'`, 'edit');
    triggerToast(`Duplicated "${pres.title}"`);
    setActiveMenuId(null);
  };

  const handleShare = (pres, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/editor/${pres.id}`);
    triggerToast(`Shareable link copied to clipboard! 🔗`);
    setActiveMenuId(null);
  };

  const handleDelete = (pres, e) => {
    e.stopPropagation();
    setPresentations(prev => prev.map(p => p.id === pres.id ? { ...p, type: 'recycle_bin' } : p));
    addActivity(`You moved '${pres.title}' to Recycle Bin`, 'delete');
    triggerToast(`"${pres.title}" moved to Recycle Bin`);
    setActiveMenuId(null);
  };

  const handleRestore = (pres, e) => {
    e.stopPropagation();
    setPresentations(prev => prev.map(p => p.id === pres.id ? { ...p, type: 'my_work' } : p));
    addActivity(`You restored '${pres.title}'`, 'edit');
    triggerToast(`"${pres.title}" restored to My Work`);
    setActiveMenuId(null);
  };

  const handleDeletePermanent = (pres, e) => {
    e.stopPropagation();
    setPresentations(prev => prev.filter(p => p.id !== pres.id));
    addActivity(`Permanently deleted '${pres.title}'`, 'delete');
    triggerToast(`"${pres.title}" permanently deleted`);
    setActiveMenuId(null);
  };

  // Filters
  const filteredPresentations = presentations.filter(p => 
    p.type === activeTab && 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTabTitle = () => {
    switch(activeTab) {
      case 'my_work': return 'My Work';
      case 'drafts': return 'Drafts';
      case 'recycle_bin': return 'Recycle Bin';
      default: return 'Presentations';
    }
  };

  // Helper Stats calculations
  const totalActivePresentations = presentations.filter(p => p.type !== 'recycle_bin').length;
  const totalAIGenerated = presentations.filter(p => p.type !== 'recycle_bin' && p.aiGenerated).length;

  return (
    <motion.div 
      className="dash-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-brand" onClick={() => navigate('/')}>
          <div className="dash-logo-icon">
            <Play size={18} fill="currentColor" />
          </div>
          <span>DeckFlow</span>
        </div>

        <button className="dash-create-btn" onClick={() => navigate('/create-deck')}>
          <Plus size={18} />
          <span>Create New</span>
        </button>

        <nav className="dash-nav">
          <button 
            className={`dash-nav-item ${activeTab === 'my_work' ? 'active' : ''}`}
            onClick={() => handleTabChange('my_work')}
          >
            <FolderOpen size={18} />
            <span>My Work</span>
          </button>
          <button 
            className={`dash-nav-item ${activeTab === 'drafts' ? 'active' : ''}`}
            onClick={() => handleTabChange('drafts')}
          >
            <FileEdit size={18} />
            <span>Drafts</span>
          </button>
          <button 
            className={`dash-nav-item ${activeTab === 'recycle_bin' ? 'active' : ''}`}
            onClick={() => handleTabChange('recycle_bin')}
          >
            <Trash2 size={18} />
            <span>Recycle Bin</span>
          </button>
        </nav>

        <div className="dash-sidebar-bottom">
          {/* Storage usage and AI Credits widget */}
          <div className="sidebar-widget">
            <div className="widget-title">
              <span>Cloud Storage</span>
              <span className="widget-value">42.5 MB / 100 MB</span>
            </div>
            <div className="widget-progress-bar">
              <div className="widget-progress-fill" style={{ width: '42.5%' }}></div>
            </div>
          </div>

          <div className="sidebar-widget">
            <div className="widget-title">
              <span>AI Credits</span>
              <span className="widget-value">80 / 100</span>
            </div>
            <div className="widget-progress-bar">
              <div className="widget-progress-fill" style={{ width: '80%' }}></div>
            </div>
          </div>

          {/* AI Tips widget */}
          <AnimatePresence>
            {showTip && (
              <motion.div 
                className="ai-tips-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <button className="ai-tips-close" onClick={() => setShowTip(false)}>
                  <X size={14} />
                </button>
                <h4>
                  <Sparkles size={14} fill="currentColor" />
                  AI Tip
                </h4>
                <p>{tipText}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button className="dash-nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        {/* Top Header */}
        <header className="dash-header">
          <div className="dash-search">
            <Search size={18} className="dash-search-icon" />
            <input 
              type="text" 
              placeholder="Search presentations..." 
              className="dash-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="dash-header-actions">
            <button className="dash-upload-btn" onClick={() => navigate('/templates')}>
              <UploadCloud size={18} />
              <span>Upload Your Template</span>
            </button>

            {/* Notification trigger button */}
            <button className="header-icon-btn" onClick={() => triggerToast("You have 2 new notifications")}>
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>

            {/* Dark mode aesthetic toggler */}
            <button className="header-icon-btn" onClick={() => {
              setIsDarkMode(!isDarkMode);
              triggerToast("Dark Mode is coming soon! Stay tuned 🚀");
            }}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="dash-avatar" onClick={() => triggerToast("Felix Profile (DeckFlow user)")}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User Avatar" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="dash-content">
          
          {/* Welcome Hero Banner */}
          <motion.div 
            className="dash-hero-banner"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h1 className="dash-hero-title">Welcome back 👋</h1>
            <p className="dash-hero-subtitle">
              Create stunning AI-powered presentations in seconds. Fast outlines, elegant designs, and smart suggestions.
            </p>
            <div className="dash-hero-actions">
              <button className="btn-hero-primary" onClick={() => navigate('/create-deck')}>
                <Sparkles size={16} fill="currentColor" />
                Generate with AI
              </button>
              <button className="btn-hero-secondary" onClick={() => navigate('/templates')}>
                <LayoutTemplate size={16} />
                Browse Templates
              </button>
            </div>
          </motion.div>

          {/* 4 Statistics Cards Row */}
          <div className="dash-stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon">
                <FolderOpen size={20} />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Total Presentations</span>
                <span className="stat-card-value">{totalActivePresentations}</span>
              </div>
              <div className="stat-sparkline">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,20 L20,15 L40,25 L60,10 L80,20 L100,5 L100,30 L0,30 Z" fill="rgba(108, 92, 231, 0.05)" />
                  <path d="M0,20 L20,15 L40,25 L60,10 L80,20 L100,5" fill="none" stroke="#6C5CE7" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.06)', color: '#8B5CF6' }}>
                <Sparkles size={20} />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">AI Generated</span>
                <span className="stat-card-value">{totalAIGenerated}</span>
              </div>
              <div className="stat-sparkline">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,25 L20,18 L40,15 L60,5 L80,10 L100,2 L100,30 L0,30 Z" fill="rgba(139, 92, 246, 0.05)" />
                  <path d="M0,25 L20,18 L40,15 L60,5 L80,10 L100,2" fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.06)', color: '#10B981' }}>
                <LayoutTemplate size={20} />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Templates Used</span>
                <span className="stat-card-value">4</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.06)', color: '#3B82F6' }}>
                <Play size={20} />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-label">Total Views</span>
                <span className="stat-card-value">1,284</span>
              </div>
            </div>
          </div>

          {/* Active Folder Header */}
          <div>
            <div className="dash-content-header">
              <div className="dash-title-group">
                <h1 className="dash-title">{getTabTitle()}</h1>
                <span className="dash-count">{filteredPresentations.length} items</span>
              </div>
            </div>

            {/* Skeleton Loading Panel or Main Folder Grid */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="skeleton"
                  className="dash-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[1, 2, 3].map(n => (
                    <div key={n} className="dash-card skeleton-pulse skeleton-card" />
                  ))}
                </motion.div>
              ) : filteredPresentations.length > 0 ? (
                <motion.div 
                  key="grid"
                  className="dash-grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredPresentations.map((pres) => (
                    <motion.div 
                      key={pres.id} 
                      className="dash-card"
                      whileHover={{ y: -6 }}
                    >
                      {/* Thumbnail Preview Area */}
                      <div className="dash-card-thumb" style={{ background: pres.thumbnail }}>
                        {pres.type === 'recycle_bin' && (
                          <div className="dash-overlay-badge deleted">Deleted</div>
                        )}
                        {pres.type === 'drafts' && (
                          <div className="dash-overlay-badge draft">Draft</div>
                        )}
                        {pres.aiGenerated && (
                          <div className="ai-generated-badge">
                            <Sparkles size={11} fill="currentColor" />
                            AI Generated
                          </div>
                        )}
                      </div>

                      {/* Info & Secondary Options footer */}
                      <div className="dash-card-info">
                        <div className="dash-card-text">
                          <h3>{pres.title}</h3>
                          <div className="dash-card-metadata">
                            <span>{pres.slides} slides</span>
                            <span className="metadata-dot"></span>
                            <span>Edited {pres.date}</span>
                          </div>
                        </div>

                        {/* Interactive Dropdown for options menu */}
                        <div className="dash-card-actions-wrapper">
                          <button 
                            className="dash-card-menu" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === pres.id ? null : pres.id);
                            }}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeMenuId === pres.id && (
                            <div className="quick-menu-dropdown" ref={menuRef}>
                              {activeTab !== 'recycle_bin' ? (
                                <>
                                  <button className="quick-menu-item" onClick={() => navigate(`/editor/${pres.id}`)}>
                                    <Play size={14} /> Open Editor
                                  </button>
                                  <button className="quick-menu-item" onClick={(e) => handleOpenRename(pres, e)}>
                                    <FileEdit size={14} /> Rename
                                  </button>
                                  <button className="quick-menu-item" onClick={(e) => handleDuplicate(pres, e)}>
                                    <Copy size={14} /> Duplicate
                                  </button>
                                  <button className="quick-menu-item" onClick={(e) => handleShare(pres, e)}>
                                    <Plus size={14} /> Share
                                  </button>
                                  <hr style={{ border: 'none', borderBottom: '1px solid var(--border-light)', margin: '4px 0' }} />
                                  <button className="quick-menu-item delete" onClick={(e) => handleDelete(pres, e)}>
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="quick-menu-item" onClick={(e) => handleRestore(pres, e)}>
                                    <RotateCcw size={14} /> Restore
                                  </button>
                                  <button className="quick-menu-item delete" onClick={(e) => handleDeletePermanent(pres, e)}>
                                    <Trash2 size={14} /> Delete Forever
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  className="dash-empty-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="dash-empty-illustration" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="12" cy="12" r="9" strokeDasharray="4 4" />
                    <path strokeLinecap="round" d="M12 8v8m-4-4h8" />
                  </svg>
                  <h2>No Presentations Found</h2>
                  <p>Your {getTabTitle().toLowerCase()} folder is currently empty.</p>
                  {activeTab !== 'recycle_bin' && (
                    <button className="dash-upload-btn" style={{ margin: '0 auto' }} onClick={() => navigate('/create-deck')}>
                      <Plus size={16} />
                      Start a presentation
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recommended Templates Carousel */}
          <div className="dash-templates-section">
            <h2 className="section-title">Recommended Templates</h2>
            <div className="templates-carousel-outer">
              <div className="templates-carousel">
                {[
                  { title: 'Minimal Pitch Deck', theme: 'Business', color: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)' },
                  { title: 'Product Showcase', theme: 'Tech', color: 'linear-gradient(135deg, #1A2A6C 0%, #B21F1F 50%, #FDBB2D 100%)' },
                  { title: 'Creative Agency Portfolio', theme: 'Creative', color: 'linear-gradient(135deg, #6C5CE7 0%, #FF85A2 100%)' },
                  { title: 'Quarterly Review', theme: 'Corporate', color: 'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)' },
                  { title: 'Academic Research', theme: 'Education', color: 'linear-gradient(135deg, #4E54C8 0%, #8F94FB 100%)' }
                ].map((tmpl, idx) => (
                  <div key={idx} className="template-carousel-card" onClick={() => navigate('/templates')}>
                    <div className="template-card-thumb" style={{ background: tmpl.color }}>
                      <LayoutTemplate size={24} color="rgba(255,255,255,0.7)" />
                    </div>
                    <div className="template-card-info">
                      <div className="template-card-title">{tmpl.title}</div>
                      <div className="template-card-tag">{tmpl.theme}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Logs */}
          <div className="dash-activity-section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {activities.map((act) => (
                <div key={act.id} className="activity-item">
                  <div className="activity-left">
                    <div className="activity-icon">
                      <History size={16} />
                    </div>
                    <div className="activity-text">
                      <span className="activity-desc">{act.text}</span>
                      <span className="activity-meta">{act.date}</span>
                    </div>
                  </div>
                  <span className={`activity-badge ${act.type}`}>
                    {act.type.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Rename Dialog Pop-up Modal */}
      <AnimatePresence>
        {renamingPresentation && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Rename Presentation</h3>
              <input 
                type="text" 
                className="modal-input" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title..."
                autoFocus
              />
              <div className="modal-actions">
                <button className="btn-modal-cancel" onClick={() => setRenamingPresentation(null)}>
                  Cancel
                </button>
                <button className="btn-modal-submit" onClick={submitRename}>
                  Rename
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating alert/toast notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            className="toast-msg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
