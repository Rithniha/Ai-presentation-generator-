import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Presentation, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import '../styles/GeneratePPT.css';

export default function GeneratePPT() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const hasFetched = React.useRef(false);

  const steps = [
    "Analyzing presentation topic...",
    "Structuring outline...",
    "Generating AI content for slides...",
    "Applying selected template and styles...",
    "Finalizing layouts...",
    "Ready!"
  ];

  useEffect(() => {
    let interval;
    // Animate progress up to 90% while waiting for AI
    if (progress < 90) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProg = prev + (Math.random() * 3 + 1);
          return newProg > 90 ? 90 : newProg;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [progress]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const generateDeck = async () => {
      try {
        // 1. Ask AI to generate the JSON outline
        const aiResponse = await fetch('http://localhost:5000/api/generation/outline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: state.promptText || 'A professional presentation',
            slideCount: state.slideCount || 6
          })
        });
        
        const aiData = await aiResponse.json();
        
        if (!aiData.success || !aiData.data) {
          throw new Error('AI failed to generate presentation');
        }

        const generatedOutline = aiData.data;

        // 2. Save it to our database!
        const saveResponse = await fetch('http://localhost:5000/api/presentations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: state.title || generatedOutline.title || 'Untitled',
            theme: state.selectedTheme || 'classic',
            slides: generatedOutline.slides || [],
            guestSessionId: localStorage.getItem('guestSessionId') || 'demo_guest'
          })
        });

        const saveData = await saveResponse.json();

        if (saveData.success) {
          setProgress(100);
          setTimeout(() => {
            navigate(`/editor/${saveData.data._id}`, { state: { ...state } });
          }, 1000);
        } else {
           throw new Error(saveData.error || 'Failed to save presentation');
        }
        
      } catch (error) {
        console.error("Generation Error:", error);
        alert(error.message || "Something went wrong generating the presentation.");
        navigate('/create-deck');
      }
    };

    generateDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const stepIdx = Math.floor((progress / 100) * (steps.length - 1));
    setCurrentStep(stepIdx);
  }, [progress, steps.length]);

  return (
    <div className="generate-container">
      <div className="generate-card">
        <div className="generate-icon-wrapper">
          {progress < 100 ? (
            <Loader2 className="generate-icon spinning" size={48} />
          ) : (
            <CheckCircle className="generate-icon success" size={48} />
          )}
        </div>
        
        <h1 className="generate-title">
          {progress < 100 ? 'Crafting Your Deck...' : 'Presentation Ready!'}
        </h1>
        
        <div className="generate-progress-bar-bg">
          <div 
            className="generate-progress-bar-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="generate-step-text">
          <Sparkles size={16} className="generate-sparkle" />
          <span>{steps[currentStep]}</span>
        </div>
        
        <div className="generate-percentage">
          {Math.floor(progress)}%
        </div>
      </div>
    </div>
  );
}
