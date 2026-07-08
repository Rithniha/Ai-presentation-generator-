import React from 'react';

export default function Sidebar({ collapsed, setCollapsed, activeSection, setActiveSection }) {
  // Navigation items to display
  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    },
    {
      id: 'personal-workspace',
      label: 'Personal Workspace',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      id: 'my-presentations',
      label: 'My Presentations',
      badge: '24',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 9h18M8 4v14" />
        </svg>
      )
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M4 5h16M4 12h16M4 19h10" />
        </svg>
      )
    },
    {
      id: 'ai-workspace',
      label: 'AI Workspace',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 3a9 9 0 1 0 9 9" />
          <path d="M12 3v9l6 3" />
        </svg>
      )
    }
  ];

  const libraryNavItems = [
    {
      id: 'history',
      label: 'History',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      )
    },
    {
      id: 'shared-decks',
      label: 'Shared Decks',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 17.3l-6.2 3.3 1.2-6.9L2 8.9l7-1L12 1.5l3 6.4 7 1-5 4.8 1.2 6.9z" />
        </svg>
      )
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />
        </svg>
      )
    }
  ];

  const preferenceNavItems = [
    {
      id: 'settings',
      label: 'Account Settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>

      <nav className="nav-group">
        <div className="nav-label">Workspace</div>
        {mainNavItems.map((item) => (
          <a
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && !collapsed && <span className="badge">{item.badge}</span>}
          </a>
        ))}
      </nav>

      <nav className="nav-group">
        <div className="nav-label">Library</div>
        {libraryNavItems.map((item) => (
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

      <nav className="nav-group">
        <div className="nav-label">Preferences</div>
        {preferenceNavItems.map((item) => (
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
