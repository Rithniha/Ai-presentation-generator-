import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { authService, getGuestSessionId } from '../services/auth';
import { Plus, Trash2, Calendar, FileText, ChevronLeft } from 'lucide-react';
import Auth from './Auth';
import '../styles/Landing.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const guestSessionId = getGuestSessionId();

  // Load user details
  useEffect(() => {
    const checkUser = async () => {
      try {
        const u = await authService.getMe();
        setUser(u);
      } catch (err) {
        console.log('Dashboard guest view');
      }
    };
    checkUser();
  }, []);

  // Load Decks
  const loadDecks = async () => {
    try {
      setLoading(true);
      // Fetch decks matching guestSessionId query
      const response = await api.get(`/api/presentations?guestSessionId=${guestSessionId}`);
      setDecks(response.data || []);
    } catch (err) {
      console.error('Failed to load decks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
  }, []);

  const handleAuthSuccess = async (success) => {
    setShowAuthModal(false);
    if (success) {
      try {
        const u = await authService.getMe();
        setUser(u);
      } catch (err) {
        console.log('Error reloading user:', err);
      }
      loadDecks();
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      // Reload decks for guest view
      loadDecks();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Handle deck deletion
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Avoid triggering card navigation click
    if (!confirm('Are you sure you want to delete this deck?')) return;

    try {
      await api.delete(`/api/presentations/${id}?guestSessionId=${guestSessionId}`);
      // Remove deleted item from local state list
      setDecks(prev => prev.filter(deck => deck._id !== id));
    } catch (err) {
      alert(err.message || 'Deletion failed.');
    }
  };

  return (
    <div className="landing-container" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="dashboard-container">
        
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/')} className="deck-action-btn" style={{ padding: '0.5rem' }}>
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>My Slide Decks</h2>
              {user && <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Logged in as <strong style={{ color: 'hsl(var(--text-primary))' }}>{user.name}</strong></span>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Logout
              </button>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Sign In / Sign Up
              </button>
            )}
            <button onClick={() => navigate('/')} className="btn btn-primary">
              <Plus size={16} />
              Create New Deck
            </button>
          </div>
        </div>

        {/* Guest limitations alert message or user welcome banner */}
        {user ? (
          <div className="guest-alert" style={{ borderColor: 'hsla(250, 89%, 65%, 0.3)', background: 'rgba(99, 102, 241, 0.05)', marginBottom: '2rem' }}>
            <FileText size={20} className="slide-icon" style={{ color: 'hsl(var(--primary))' }} />
            <div className="guest-alert-text">
              Welcome back, <span className="guest-alert-bold">{user.name}</span>! All your generated slide decks are securely saved in your permanent account.
            </div>
          </div>
        ) : (
          <div className="guest-alert" style={{ marginBottom: '2rem' }}>
            <FileText size={20} className="slide-icon" style={{ color: '#ef4444' }} />
            <div className="guest-alert-text">
              You are browsing as a <span className="guest-alert-bold">Guest User</span>. 
              Your generated slide decks will automatically expire and be deleted after <span className="guest-alert-bold">24 hours</span>. 
              <span onClick={() => setShowAuthModal(true)} style={{ color: 'hsl(var(--primary))', textDecoration: 'underline', cursor: 'pointer', marginLeft: '0.25rem', fontWeight: 600 }}>Log in or sign up</span> to preserve files permanently.
            </div>
          </div>
        )}

        {loading ? (
          <div className="deck-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel shimmer" style={{ height: '200px', borderRadius: '16px' }}></div>
            ))}
          </div>
        ) : decks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>
            <FileText size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
            <h3>No Slide Decks Found</h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>Enter a topic on the home screen to generate your first AI presentation.</p>
          </div>
        ) : (
          <div className="deck-grid">
            {decks.map(deck => (
              <div 
                key={deck._id} 
                className="glass-panel deck-card"
                onClick={() => navigate(`/editor/${deck._id}`)}
              >
                <h3 className="deck-title">{deck.title}</h3>
                
                <div className="deck-footer">
                  <div className="deck-date" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {new Date(deck.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  <div className="deck-actions">
                    <button 
                      onClick={(e) => handleDelete(e, deck._id)}
                      className="deck-action-btn"
                      title="Delete presentation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showAuthModal && <Auth onClose={handleAuthSuccess} />}
    </div>
  );
}
