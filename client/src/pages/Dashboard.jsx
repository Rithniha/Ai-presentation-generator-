import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FolderOpen, 
  FileEdit, 
  Trash2, 
  UploadCloud, 
  Plus, 
  Search,
  MoreVertical,
  Play,
  Settings
} from 'lucide-react';
import FloatingBubbles from '../components/FloatingBubbles';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my_work');
  
  // Dummy data
  const presentations = [
    { id: 1, title: 'Q3 Marketing Strategy', date: 'Oct 12, 2026', status: 'published', type: 'my_work', thumbnail: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' },
    { id: 2, title: 'Investor Pitch Deck', date: 'Oct 10, 2026', status: 'published', type: 'my_work', thumbnail: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)' },
    { id: 3, title: 'Product Launch Q4', date: 'Oct 05, 2026', status: 'draft', type: 'drafts', thumbnail: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' },
    { id: 4, title: 'Team Onboarding', date: 'Sep 28, 2026', status: 'draft', type: 'drafts', thumbnail: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)' },
    { id: 5, title: 'Old Financials 2025', date: 'Jan 15, 2026', status: 'deleted', type: 'recycle_bin', thumbnail: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)' }
  ];

  const filteredPresentations = presentations.filter(p => p.type === activeTab);

  const getTabTitle = () => {
    switch(activeTab) {
      case 'my_work': return 'My Work';
      case 'drafts': return 'Drafts';
      case 'recycle_bin': return 'Recycle Bin';
      default: return 'Presentations';
    }
  };

  return (
    <div className="dash-container">
      <FloatingBubbles />
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-brand" onClick={() => navigate('/')}>
          <div className="dash-logo-icon">
            <Play size={16} fill="currentColor" />
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
            My Work
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
          <div className="dash-search">
            <Search size={18} className="dash-search-icon" />
            <input type="text" placeholder="Search presentations..." className="dash-search-input" />
          </div>

          <div className="dash-header-actions">
            <button className="dash-upload-btn">
              <UploadCloud size={18} />
              Upload Your Template
            </button>
            <div className="dash-avatar">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dash-content">
          <div className="dash-content-header">
            <h1 className="dash-title">{getTabTitle()}</h1>
            <span className="dash-count">{filteredPresentations.length} items</span>
          </div>

          {filteredPresentations.length > 0 ? (
            <div className="dash-grid">
              {filteredPresentations.map(pres => (
                <div key={pres.id} className="dash-card">
                  <div className="dash-card-thumb" style={{ background: pres.thumbnail }}>
                    {pres.type === 'recycle_bin' && (
                      <div className="dash-overlay-badge deleted">Deleted</div>
                    )}
                    {pres.type === 'drafts' && (
                      <div className="dash-overlay-badge draft">Draft</div>
                    )}
                  </div>
                  <div className="dash-card-info">
                    <div className="dash-card-text">
                      <h3>{pres.title}</h3>
                      <p>Updated {pres.date}</p>
                    </div>
                    <button className="dash-card-menu">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dash-empty-state">
              <div className="dash-empty-icon">
                {activeTab === 'my_work' ? <FolderOpen size={32} /> : activeTab === 'drafts' ? <FileEdit size={32} /> : <Trash2 size={32} />}
              </div>
              <h2>No presentations found</h2>
              <p>Your {getTabTitle().toLowerCase()} folder is currently empty.</p>
              {activeTab !== 'recycle_bin' && (
                <button className="dash-upload-btn" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/create-deck')}>
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
