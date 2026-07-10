import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Check, RotateCcw, Play, Eye } from 'lucide-react';

export default function AIReviewAgent({ 
  presentation, 
  setPresentation, 
  activeSlide, 
  activeSlideIdx 
}) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm your slide design agent. Ask me to rewrite text, optimize spacing, or completely redesign this slide." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyStack, setHistoryStack] = useState([]); // Store previous presentation states for Undo
  const [suggestions, setSuggestions] = useState([
    { id: 'size', text: 'Title could be larger', checked: false },
    { id: 'density', text: 'Content is text-heavy', checked: false },
    { id: 'contrast', text: 'Improve color contrast', checked: false },
    { id: 'spacing', text: 'Increase element spacing', checked: false }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    '✨ Improve Design',
    '✨ Simplify',
    '✨ Investor Pitch',
    '✨ Executive Summary',
    '✨ Increase Spacing',
    '✨ Enlarge Title',
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Save history for Undo
    setHistoryStack(prev => [...prev, JSON.parse(JSON.stringify(presentation))]);

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setLoading(true);

    setTimeout(() => {
      // Analyze text to simulate changes on the active slide
      const query = text.toLowerCase();
      let aiResponse = "I have reviewed the slide and optimized its layout for better readability.";
      let updatedSuggestions = [...suggestions];

      setPresentation(prev => {
        if (!prev) return prev;
        const slides = [...prev.slides];
        const slide = { ...slides[activeSlideIdx] };

        // Ensure styles exist
        const currentStyles = { ...(slide.styles instanceof Map ? Object.fromEntries(slide.styles) : slide.styles) };

        if (query.includes('title') || query.includes('enlarge')) {
          // Update title font size
          if (currentStyles.title) {
            currentStyles.title = { ...currentStyles.title, fontSize: '48px' };
            aiResponse = "I increased the slide title's size to 48px to improve the visual hierarchy.";
            updatedSuggestions = updatedSuggestions.map(s => s.id === 'size' ? { ...s, checked: true } : s);
          }
        } 
        else if (query.includes('simplify') || query.includes('shorten') || query.includes('reduce')) {
          // Shorten elements text
          if (slide.elements) {
            slide.elements = slide.elements.map(el => {
              if (el.type === 'text' && el.content.length > 50) {
                return { ...el, content: el.content.substring(0, 50) + '...' };
              }
              return el;
            });
          }
          aiResponse = "I summarized the slide contents to reduce density and enhance breathing room.";
          updatedSuggestions = updatedSuggestions.map(s => s.id === 'density' ? { ...s, checked: true } : s);
        }
        else if (query.includes('spacing') || query.includes('design') || query.includes('layout')) {
          // Move elements to avoid overlap
          if (slide.elements) {
            slide.elements = slide.elements.map((el, idx) => ({
              ...el,
              style: { ...el.style, top: `${100 + idx * 80}px` }
            }));
          }
          aiResponse = "I rearranged the elements and increased vertical spacing to prevent overlapping.";
          updatedSuggestions = updatedSuggestions.map(s => s.id === 'spacing' ? { ...s, checked: true } : s);
        }
        else if (query.includes('contrast') || query.includes('color') || query.includes('pitch')) {
          currentStyles.title = { ...currentStyles.title, color: '#4f46e5' };
          aiResponse = "I optimized the title color using a high-contrast purple tone suitable for investor pitches.";
          updatedSuggestions = updatedSuggestions.map(s => s.id === 'contrast' ? { ...s, checked: true } : s);
        }

        slide.styles = currentStyles;
        slides[activeSlideIdx] = slide;
        return { ...prev, slides };
      });

      setSuggestions(updatedSuggestions);
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setLoading(false);
    }, 1000);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const prev = historyStack[historyStack.length - 1];
    setPresentation(prev);
    setHistoryStack(historyStack.slice(0, -1));
    setMessages(prevMsgs => [...prevMsgs, { sender: 'ai', text: 'Reverted previous AI design modifications.' }]);
  };

  return (
    <div className="ai-agent-panel">
      {/* Overall Quality Score */}
      <div className="ai-agent-score-card">
        <div>
          <div className="ai-score-label">Slide Score</div>
          <div className="ai-score-value">92/100</div>
        </div>
        <Sparkles size={24} color="#a855f7" />
      </div>

      <p className="ai-agent-subtitle">Ask AI to review, improve, or redesign this slide.</p>

      {/* Chat Area */}
      <div className="ai-agent-chat-container">
        {messages.map((m, i) => (
          <div key={i} className={`ai-chat-bubble ${m.sender}`}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: m.sender === 'ai' ? '#7c3aed' : '#475569' }}>
              {m.sender === 'ai' ? '🤖 AI Agent' : '👤 You'}
            </span>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', lineHeight: '1.4' }}>{m.text}</p>
          </div>
        ))}
        {loading && (
          <div className="ai-chat-bubble ai loading">
            <span className="loading-dots">AI is modifying slide...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="ai-agent-chips-container">
        {quickPrompts.map((chip, idx) => (
          <button 
            key={idx} 
            className="ai-prompt-chip"
            onClick={() => handleSend(chip.replace('✨ ', ''))}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Suggestions Checklist */}
      <div className="ai-agent-suggestions-card">
        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#475569', marginBottom: '8px' }}>AI Suggestions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {suggestions.map(s => (
            <div key={s.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.75rem', color: s.checked ? '#10b981' : '#64748b' }}>
              <Check size={12} strokeWidth={3} style={{ opacity: s.checked ? 1 : 0.3 }} />
              <span style={{ textDecoration: s.checked ? 'line-through' : 'none' }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="ai-agent-input-row">
        <input 
          type="text" 
          placeholder="Ask anything about this slide..." 
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend(inputValue)}
        />
        <button onClick={() => handleSend(inputValue)} className="ai-btn-purple">
          <Send size={16} />
        </button>
      </div>

      <div className="ai-agent-actions-row">
        <button onClick={handleUndo} disabled={historyStack.length === 0} className="ai-btn-secondary">
          <RotateCcw size={14} /> Undo
        </button>
        <button className="ai-btn-secondary">
          <Eye size={14} /> Preview
        </button>
      </div>
    </div>
  );
}
