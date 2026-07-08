import React from 'react';

export default function Sidebar({ collapsed, setCollapsed, activeSection, setActiveSection }) {
  // Simple navigation items requested by the user
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    },
    {
      id: 'drafts',
      label: 'Drafts',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />
        </svg>
      )
    },
    {
      id: 'extra',
      label: 'Extra',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
          <circle cx="5" cy="12" r="2" />
        </svg>
      )
    }
  ];

  const settingsItem = {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" />
      </svg>
    )
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-mark"></div>
          <div className="brand-name">Present<span>AI</span> Pro</div>
        </div>
        <button 
          className="sidebar-toggle" 
          id="sidebarToggle" 
          aria-label="Collapse sidebar"
          onClick={() => setCollapsed(!collapsed)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>

      <nav className="nav-group">
        <div className="nav-label">Workspace</div>
        {navItems.map((item) => (
          <a
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <nav className="nav-group" style={{ marginTop: 'auto' }}>
        <a
          onClick={() => setActiveSection(settingsItem.id)}
          className={`nav-item ${activeSection === settingsItem.id ? 'active' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          {settingsItem.icon}
          <span>{settingsItem.label}</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="plan-card">
          <div className="plan-top">
            <span className="plan-dot"></span>
            <b style={{ fontSize: '12.5px', color: 'var(--text-0)', fontWeight: 600 }}>Pro Plan</b>
          </div>
          <p>640 of 1,000 AI credits used this month</p>
          <div className="plan-bar"><i></i></div>
        </div>
      </div>
    </aside>
  );
}
