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
    if (progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProg = prev + (Math.random() * 5 + 2);
          if (newProg >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProg;
        });
      }, 300);
    } else {
      // Once 100% is reached, wait 1s and navigate to the editor
      setTimeout(() => {
        // In a real app we'd get the real ID from the backend creation response.
        // For now, generating a dummy ID.
        const newId = `pres_${Math.random().toString(36).substring(2, 9)}`;
        navigate(`/editor/${newId}`, { state: { ...state } });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [progress, navigate, state]);

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
