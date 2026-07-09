import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Presentation, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { getGuestSessionId } from '../services/auth';
import '../styles/GeneratePPT.css';

export default function GeneratePPT() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const hasTriggered = useRef(false);

  const steps = [
    "Analyzing presentation topic...",
    "Structuring outline...",
    "Generating AI content for slides...",
    "Applying selected template and styles...",
    "Finalizing layouts...",
    "Saving to workspace...",
    "Ready!"
  ];

  // Smooth fake progress ticker up to 90%
  useEffect(() => {
    let timer;
    if (progress < 90 && !errorMsg) {
      timer = setTimeout(() => {
        setProgress(prev => {
          const diff = Math.max(1, (90 - prev) * 0.15);
          return Math.min(90, prev + diff);
        });
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [progress, errorMsg]);

  // Map progress to steps
  useEffect(() => {
    if (!errorMsg) {
      const stepIdx = Math.floor((progress / 100) * (steps.length - 1));
      setCurrentStep(Math.min(stepIdx, steps.length - 2));
    }
  }, [progress, errorMsg]);

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    const triggerGeneration = async () => {
      try {
        const guestSessionId = getGuestSessionId();
        const prompt = state.promptText || state.title || 'General presentation topic';
        const slideCount = parseInt(state.slideCount) || 6;
        const theme = state.selectedTheme || 'classic';

        // 1. Generate outline via server AI service
        const response = await api.post('/api/generation/outline', {
          prompt,
          slideCount
        });

        if (!response || !response.success || !response.data) {
          throw new Error('AI outline generation returned empty response');
        }

        const generatedData = response.data;
        let generatedSlides = generatedData.slides || [];

        // 2. Inject chart slide if requested
        if (state.includeChart) {
          const chartTitle = state.chartTitle || 'Data Overview';
          const chartType = state.chartType || 'bar';
          const chartRawData = state.chartRawData || 'A: 30, B: 60, C: 90';
          
          generatedSlides.push({
            title: chartTitle,
            layout: 'stats', // Use stats layout for displaying chart metrics
            content: [`CHART:${chartType}`, chartTitle, chartRawData], // Custom serialization for editor
            icon: 'TrendingUp',
            note: `Visual representation of ${chartTitle} using a ${chartType} chart layout.`
          });
        }

        // 3. Save the new presentation in DB
        const saveResponse = await api.post('/api/presentations', {
          title: generatedData.title || state.title || 'Generated Deck',
          theme,
          slides: generatedSlides,
          guestSessionId
        });

        if (!saveResponse || !saveResponse.success || !saveResponse.data) {
          throw new Error('Failed to save presentation to workspace database');
        }

        const savedPresentation = saveResponse.data;

        // Complete progress bar
        setProgress(100);
        setCurrentStep(steps.length - 1);

        setTimeout(() => {
          navigate(`/editor/${savedPresentation._id}`);
        }, 1200);

      } catch (err) {
        console.error('Presentation creation error:', err);
        setErrorMsg(err.message || 'Generation failed. Please try again.');
      }
    };

    triggerGeneration();
  }, [state, navigate]);

  if (errorMsg) {
    return (
      <div className="generate-container">
        <div className="generate-card" style={{ borderColor: '#ef4444' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Generation Failed</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>{errorMsg}</p>
          <button 
            onClick={() => navigate('/create-deck')} 
            className="ts-list-use-btn"
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
