import React from 'react';
import { X } from 'lucide-react';

export default function ModalShell({ 
  title, 
  onClose, 
  children, 
  sidebarTabs = [], 
  activeTab = '', 
  onTabChange = () => {} 
}) {
  return (
    <div 
      className="modal-shell-overlay"
      onClick={onClose}
    >
      <div 
        className="modal-shell-container"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-shell-header">
          <span className="modal-shell-title">{title}</span>
          <button onClick={onClose} className="modal-shell-close hover-bg-gray">
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-shell-body">
          {sidebarTabs.length > 0 && (
            <div className="modal-shell-sidebar">
              {sidebarTabs.map(tab => (
                <button 
                  key={tab.id}
                  className={`modal-sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => onTabChange(tab.id)}
                >
                  {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          
          <div className="modal-shell-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
