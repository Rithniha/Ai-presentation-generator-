import React from 'react';

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      title: 'AI generated outline',
      time: '2 min ago',
      desc: '12-slide structure created for "Series A Pitch Deck" based on Investor audience.',
      statusClass: 'active'
    },
    {
      id: 2,
      title: 'Presentation created',
      time: '18 min ago',
      desc: '"Series A Pitch Deck" started from a blank AI prompt.',
      statusClass: 'done'
    },
    {
      id: 3,
      title: 'Theme updated',
      time: '1h ago',
      desc: '"Q3 Marketing Review" switched from Slate to Sunrise theme.',
      statusClass: 'done'
    },
    {
      id: 4,
      title: 'PPT exported',
      time: 'Yesterday, 5:42 PM',
      desc: '"Brand Refresh Proposal" exported as .pptx — 10 slides, 4.2 MB.',
      statusClass: 'done'
    },
    {
      id: 5,
      title: 'Presentation shared',
      time: 'Yesterday, 2:10 PM',
      desc: '"Research Findings Summary" shared with 3 collaborators.',
      statusClass: 'done'
    }
  ];

  return (
    <section>
      <div className="section-head">
        <h2>Recent Activity</h2>
        <a className="see-all" style={{ cursor: 'pointer' }}>
          View log 
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </a>
      </div>
      <div className="glass timeline-card">
        <div className="timeline">
          {activities.map((act) => (
            <div key={act.id} className={`t-item ${act.statusClass}`}>
              <div className="t-row">
                <b>{act.title}</b>
                <time>{act.time}</time>
              </div>
              <p>{act.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
