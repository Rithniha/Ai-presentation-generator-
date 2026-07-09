import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { presentationService } from '../services/presentation';
import { authService } from '../services/auth';
import { 
  FolderOpen, FileEdit, Trash2, UploadCloud, Plus, Search,
  MoreVertical, Play, Settings, Sparkles, LayoutTemplate, MonitorPlay,
  Presentation
} from 'lucide-react';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my_work');
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await authService.getMe();
        setUser(userData);
        const res = await presentationService.getAll();
        setPresentations(res.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusForTab = (tab) => {
    if (tab === 'my_work') return 'published';
    if (tab === 'drafts') return 'draft';
    if (tab === 'recycle_bin') return 'deleted';
    return 'published';
  };

  const filteredPresentations = presentations.filter(p => {
    const status = p.status || 'draft';
    return status === getStatusForTab(activeTab);
  });

  const getTabTitle = () => {
    switch(activeTab) {
      case 'my_work': return 'Recent Designs';
      case 'drafts': return 'Drafts';
      case 'recycle_bin': return 'Recycle Bin';
      default: return 'Presentations';
    }
  };

  const getThumbnailColor = (id) => {
    const colors = [
      'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    ];
    if (!id) return colors[0];
    const charCodeSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const moveToRecycleBin = async (e, id) => {
    e.stopPropagation();
    try {
      await presentationService.update(id, { status: 'deleted' });
      setPresentations(prev => prev.map(p => p._id === id ? { ...p, status: 'deleted' } : p));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const restoreFromRecycleBin = async (e, id) => {
    e.stopPropagation();
    try {
      await presentationService.update(id, { status: 'draft' });
      setPresentations(prev => prev.map(p => p._id === id ? { ...p, status: 'draft' } : p));
    } catch (err) {
      console.error('Failed to restore', err);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div className="dash-container">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-brand" onClick={() => navigate('/')}>
          <div className="dash-logo-icon">
            <Presentation size={18} fill="currentColor" />
          </div>
          <span>DeckFlow</span>
        </div>

        <button className="dash-create-btn" onClick={() => navigate('/create-deck')}>
          <Plus size={18} />
          Create New
        </button>

        <nav className="dash-nav">
          <button 
            className={`dash-nav-item ${activeTab === 'my_work' ? 'active' : ''}`}
            onClick={() => setActiveTab('my_work')}
          >
            <FolderOpen size={18} />
            Home
          </button>
          <button 
            className={`dash-nav-item ${activeTab === 'drafts' ? 'active' : ''}`}
            onClick={() => setActiveTab('drafts')}
          >
            <FileEdit size={18} />
            Drafts
          </button>
          <button 
            className={`dash-nav-item ${activeTab === 'recycle_bin' ? 'active' : ''}`}
            onClick={() => setActiveTab('recycle_bin')}
          >
            <Trash2 size={18} />
            Recycle Bin
          </button>
        </nav>

        <div className="dash-sidebar-bottom">
          <button className="dash-nav-item">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        {/* Top Header */}
        <header className="dash-header">
          <div className="dash-header-left">
             {/* Empty space since search is in hero */}
          </div>

          <div className="dash-header-actions">
            <button className="dash-upload-btn">
              <UploadCloud size={18} />
              Upload Template
            </button>
            <div className="dash-avatar" onClick={() => navigate(user ? '/profile' : '/signin')}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}`} alt="User" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dash-content">
          
          {/* Canva-like Hero Section */}
          {activeTab === 'my_work' && (
            <div className="dash-hero">
              <h1 className="dash-hero-title">What will you design today?</h1>
              
              <div className="dash-hero-search">
                <Search size={20} className="dash-hero-search-icon" />
                <input type="text" placeholder="Search your presentations or templates..." />
              </div>

              <div className="dash-quick-actions">
                <div className="dash-quick-action" onClick={() => navigate('/create-deck')}>
                  <div className="dash-qa-icon ai">
                    <Sparkles size={24} />
                  </div>
                  <span>Magic AI</span>
                </div>
                <div className="dash-quick-action">
                  <div className="dash-qa-icon template">
                    <LayoutTemplate size={24} />
                  </div>
                  <span>Templates</span>
                </div>
              </div>
            </div>
          )}

          <div className="dash-content-header">
            <h2 className="dash-section-title">{getTabTitle()}</h2>
          </div>

          {loading ? (
            <div className="dash-loading">Loading your workspace...</div>
          ) : filteredPresentations.length > 0 ? (
            <div className="dash-grid">
              {filteredPresentations.map(pres => (
                <div key={pres._id} className="dash-card" onClick={() => handleCardClick(pres._id)}>
                  <div className="dash-card-thumb" style={{ background: getThumbnailColor(pres._id) }}>
                    {pres.status === 'deleted' && (
                      <div className="dash-overlay-badge deleted">Deleted</div>
                    )}
                    {pres.status === 'draft' && (
                      <div className="dash-overlay-badge draft">Draft</div>
                    )}
                  </div>
                  <div className="dash-card-info">
                    <div className="dash-card-text">
                      <h3>{pres.title}</h3>
                      <p>Updated {formatDate(pres.createdAt)}</p>
                    </div>
                    {activeTab !== 'recycle_bin' ? (
                      <button className="dash-card-menu" onClick={(e) => moveToRecycleBin(e, pres._id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button className="dash-card-menu" onClick={(e) => restoreFromRecycleBin(e, pres._id)} title="Restore">
                        <FolderOpen size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dash-empty-state">
              <div className="dash-empty-icon">
                {activeTab === 'my_work' ? <MonitorPlay size={32} /> : activeTab === 'drafts' ? <FileEdit size={32} /> : <Trash2 size={32} />}
              </div>
              <h2>No presentations found</h2>
              <p>Your {getTabTitle().toLowerCase()} folder is currently empty.</p>
              {activeTab !== 'recycle_bin' && (
                <button className="dash-create-btn" style={{ marginTop: '1.5rem', marginBottom: 0 }} onClick={() => navigate('/create-deck')}>
                  Start a new presentation
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
