import React, { useState, useEffect } from 'react';
import SetupWizard from './components/SetupWizard';
import SkeletonLoader from './components/SkeletonLoader';
import OutlineEditor from './components/OutlineEditor';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isLoading, setIsLoading] = useState(false);
  const [wizardParams, setWizardParams] = useState(null);

  // Sync with browser history navigation
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    
    // Redirect / to /editor/new on initial mount
    if (window.location.pathname === '/' || window.location.pathname === '') {
      navigate('/editor/new');
    }
    
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Generate Action
  const handleGenerateOutline = (params) => {
    setIsLoading(true);
    
    // Create random presentation ID
    const generatedId = `pres-${Math.random().toString(36).slice(2, 8)}`;
    
    // Hold local params
    const updatedParams = {
      ...params,
      id: generatedId
    };
    setWizardParams(updatedParams);

    // Simulate 3 seconds generation delay
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/editor/${generatedId}/outline`);
    }, 3000);
  };

  // Determine current routing view
  const isOutlineView = /^\/editor\/([^\/]+)\/outline$/.test(currentPath);
  const outlineMatch = currentPath.match(/^\/editor\/([^\/]+)\/outline$/);
  const currentPresentationId = outlineMatch ? outlineMatch[1] : null;

  // Fallback params in case user refreshes outline page directly
  const getOutlineParams = () => {
    if (wizardParams && wizardParams.id === currentPresentationId) {
      return wizardParams;
    }
    return {
      id: currentPresentationId || 'pres-demo99',
      prompt: 'Quarterly Business & Strategic Growth Roadmap',
      audience: 'executives',
      tone: 'professional',
      duration: '10min',
      slideCount: 10,
      theme: {
        id: "sleek-dark",
        name: "Sleek Dark",
        bg: "#0b0c10",
        text: "#f3f4f6",
        accent: "#8b5cf6",
        subAccent: "#d946ef",
        swatches: ["#0b0c10", "#8b5cf6", "#d946ef", "#f3f4f6"]
      }
    };
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Fullscreen Loader for Generation */}
      <SkeletonLoader isVisible={isLoading} />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {isOutlineView ? (
          <OutlineEditor 
            initialParams={getOutlineParams()} 
            onBackToNew={() => navigate('/editor/new')}
          />
        ) : (
          <SetupWizard 
            onGenerate={handleGenerateOutline} 
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer 
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '24px 0',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginTop: 'auto'
        }}
      >
        <p>&copy; {new Date().getFullYear()} Antigravity Presentation Labs. Powered by Agentic AI.</p>
      </footer>
    </div>
  );
}
