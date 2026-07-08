import React, { useState, useEffect, useRef } from 'react';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi Riya 👋 Want me to tighten the narrative on your Series A deck, or start something new?' },
    { sender: 'user', text: 'Tighten slide 6, it feels text-heavy.' },
    { sender: 'bot', text: "On it — I'll split slide 6 into two and lead with the key metric. Preview ready in a few seconds." }
  ]);

  const bodyRef = useRef(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputVal('');

    // Simulate bot response
    setTimeout(() => {
      let botText = "I'm on it! Let me process that recommendation for you.";
      if (userText.toLowerCase().includes('summarize')) {
        botText = "Here is a quick summary of your Series A Pitch Deck: 14 slides, focused on Fintech growth, optimized for Investors with an overall Quality Score of 92/100. Let me know if you want speaker notes!";
      } else if (userText.toLowerCase().includes('title')) {
        botText = "How about these titles: 'NextGen Fintech: Series A Pitch', 'Disrupting Payments: Seed Round', or 'PayFlow Pro: Pitch Deck v2'?";
      } else if (userText.toLowerCase().includes('speaker')) {
        botText = "Sure! Generating speaker notes for Slide 1: 'Welcome everyone, today I'm excited to share our vision for the future of payment systems...'";
      }
      
      setMessages(prev => [...prev, { sender: 'bot', text: botText }]);
    }, 1200);
  };

  const handleSuggestionClick = (text) => {
    setInputVal(text);
  };

  return (
    <div className="fab-wrap">
      <div className={`chat-panel ${isOpen ? 'open' : ''}`} id="chatPanel">
        <div className="chat-inner">
          <div className="chat-head">
            <span className="dot-live"></span>
            <div>
              <b>PresentAI Assistant</b>
              <small>Online · ready to help</small>
            </div>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-suggest">
            <button className="chip-suggest" onClick={() => handleSuggestionClick('Summarize this deck')}>
              Summarize this deck
            </button>
            <button className="chip-suggest" onClick={() => handleSuggestionClick('Suggest a stronger title')}>
              Suggest a stronger title
            </button>
            <button className="chip-suggest" onClick={() => handleSuggestionClick('Generate speaker notes')}>
              Generate speaker notes
            </button>
          </div>
          <form className="chat-input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask PresentAI anything…" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" aria-label="Send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
      <button 
        className={`fab ${isOpen ? 'open' : ''}`} 
        id="fabBtn" 
        aria-label="Open AI assistant"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="ring"></div>
        <svg className="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 3a9 9 0 1 0 9 9" />
          <path d="M12 3v9l6 3" />
        </svg>
        <svg className="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
