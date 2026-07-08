import React from 'react';

export default function QuickTemplates({ showToast }) {
  const templates = [
    { id: 'academic', title: 'Academic', desc: 'Research & thesis defense', class: 'tmpl-t1' },
    { id: 'business', title: 'Business', desc: 'Corporate reporting', class: 'tmpl-t2' },
    { id: 'startup', title: 'Startup', desc: 'Pitch & fundraising', class: 'tmpl-t3' },
    { id: 'marketing', title: 'Marketing', desc: 'Campaign performance', class: 'tmpl-t4' },
    { id: 'research', title: 'Research', desc: 'Data-driven findings', class: 'tmpl-t5' },
    { id: 'minimal', title: 'Minimal', desc: 'Clean & distraction-free', class: 'tmpl-t6' }
  ];

  const handleTemplateClick = (title) => {
    showToast(`Loading ${title} presentation template…`);
  };

  return (
    <section>
      <div className="section-head">
        <h2>Quick Templates</h2>
        <a className="see-all" style={{ cursor: 'pointer' }}>
          Browse library 
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </a>
      </div>
      <div className="tmpl-scroll">
        {templates.map((tmpl) => (
          <div 
            key={tmpl.id} 
            className="glass tmpl-card"
            onClick={() => handleTemplateClick(tmpl.title)}
            style={{ cursor: 'pointer' }}
          >
            <div className={`tmpl-thumb ${tmpl.class}`}>
              <div className="mini-slide s1"></div>
              <div className="mini-slide s2"></div>
              <div className="mini-slide s3"></div>
            </div>
            <div className="tmpl-body">
              <b>{tmpl.title}</b>
              <small>{tmpl.desc}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
