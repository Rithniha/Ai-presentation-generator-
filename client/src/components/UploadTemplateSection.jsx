import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { getCompatibilityScore } from '../hooks/useTemplateFilters';

const THEMES = ["Modern Minimal", "Corporate Navy", "Bold Startup", "Academic Light", "Tech Charcoal", "Marketing Coral"];
const LAYOUT_STYLES = ["Grid-based", "Text-heavy", "Visual-first", "Balanced"];
const AUDIENCES = ["Student", "Professor", "Business Professional"];

function generateAnalysis(fileName, fileSize) {
  const seed = (fileName.length + (fileSize || 0)) % 100;
  const theme = THEMES[seed % THEMES.length];
  const layout = LAYOUT_STYLES[(seed + 2) % LAYOUT_STYLES.length];
  const audience = AUDIENCES[(seed + 5) % AUDIENCES.length];
  const slideCount = 8 + (seed % 13); // 8 to 20
  const compatibilityScore = 70 + (seed % 29); // 70% to 98%

  let colors = ["#4f46e5", "#818cf8", "#cbd5e1"];
  if (theme === "Corporate Navy") {
    colors = ["#1e3a5f", "#3b82f6", "#f8fafc"];
  } else if (theme === "Bold Startup") {
    colors = ["#0f0f1a", "#6366f1", "#a78bfa"];
  } else if (theme === "Modern Minimal") {
    colors = ["#ffffff", "#334155", "#cbd5e1"];
  } else if (theme === "Tech Charcoal") {
    colors = ["#0a0f1e", "#06b6d4", "#e0f2fe"];
  } else if (theme === "Marketing Coral") {
    colors = ["#fff0f5", "#e11d74", "#fff0f5"];
  } else if (theme === "Academic Light") {
    colors = ["#f5f0e8", "#92400e", "#1c1917"];
  }

  return {
    theme,
    colors,
    slideCount,
    layout,
    audience,
    compatibilityScore
  };
}

export default function UploadTemplateSection({ onSelectUploadedTemplate, presentationState }) {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndUpload = (file) => {
    if (!file) return;

    const validExtensions = ['.ppt', '.pptx', '.potx'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => lowerName.endsWith(ext));

    if (!isValid) {
      setErrorMsg('Unsupported format. Please upload a .ppt, .pptx, or .potx file.');
      setStatus('error');
      return;
    }

    // Start simulated upload
    setStatus('uploading');
    setErrorMsg('');
    setFileName(file.name);
    
    setTimeout(() => {
      setStatus('success');
      const analysisData = generateAnalysis(file.name, file.size);
      
      // Calculate real compatibility score using shared getCompatibilityScore helper
      const dummyTemplate = {
        id: 'uploaded-temp',
        name: `Custom (${analysisData.theme})`,
        category: analysisData.audience === 'Student' || analysisData.audience === 'Professor' ? 'Education' : 'Business',
        tags: ['Custom', analysisData.layout],
        users: analysisData.audience,
        font: 'Inter'
      };
      
      analysisData.compatibilityScore = getCompatibilityScore(dummyTemplate, presentationState || {});
      setAnalysis(analysisData);
    }, 1800);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const triggerChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleReset = () => {
    setStatus('idle');
    setFileName('');
    setAnalysis(null);
    setErrorMsg('');
  };

  const handleUseTemplate = () => {
    if (!analysis) return;
    
    // Call the parent handler to select the simulated template
    onSelectUploadedTemplate({
      id: `uploaded-${fileName.replace(/\s+/g, '-').toLowerCase()}`,
      name: `Custom (${analysis.theme})`,
      category: 'Uploaded',
      tags: ['Custom', analysis.layout],
      desc: `Simulated template based on uploaded file "${fileName}".`,
      users: 'Custom User',
      philosophy: `Custom layout matching ${analysis.theme} theme.`,
      bg: analysis.colors[0],
      accent: analysis.colors[1],
      text: '#ffffff',
      secondary: 'rgba(255,255,255,0.12)',
      card: 'rgba(255,255,255,0.1)',
      font: 'Inter'
    });
  };

  return (
    <div className="ts-upload-section" style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '2.5rem' }}>
      <h2 className="ts-upload-title" style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
        Didn't find a suitable template?
      </h2>
      <p className="ts-page-sub" style={{ marginBottom: '1.5rem', fontSize: '0.88rem' }}>
        Upload one of your own PowerPoint templates (.ppt, .pptx, .potx). The AI will analyze its layout, typography, and color palette.
      </p>

      {status === 'idle' || status === 'error' ? (
        <div 
          className={`ts-upload-dropzone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerChooseFile}
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".ppt,.pptx,.potx"
            style={{ display: 'none' }}
          />
          <UploadCloud size={32} style={{ color: dragActive ? '#4f46e5' : '#94a3b8', transition: 'color 0.15s ease' }} />
          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4f46e5' }}>Choose File</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '4px' }}>or drag PowerPoint file here</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Supported formats: .ppt, .pptx, .potx</span>

          {status === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      ) : status === 'uploading' ? (
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '2.5rem 1.5rem',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}>
          <div className="ts-upload-spinner" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
            Uploading and analyzing "{fileName}"...
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Success Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '0.75rem 1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontSize: '0.88rem', fontWeight: 600 }}>
              <CheckCircle size={16} />
              <span>Successfully uploaded "{fileName}"</span>
            </div>
            <button 
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#065f46',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <RefreshCw size={12} /> Upload Another
            </button>
          </div>

          {/* AI Analysis Panel */}
          {analysis && (
            <div className="ts-analysis-panel" style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  🤖 AI Template Analysis
                </span>
                <span className="ts-card-tag" style={{ background: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5', fontWeight: 700 }}>
                  ⚡ {analysis.compatibilityScore}% Compatibility
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Detected Theme</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{analysis.theme}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Primary Colors</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {analysis.colors.map((c, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, border: '1px solid #cbd5e1' }} title={c} />
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Slide Count</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{analysis.slideCount} Slides</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Layout Style</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{analysis.layout}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Recommended Audience</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{analysis.audience}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <button
                  className="ts-preview-select"
                  onClick={handleUseTemplate}
                  style={{
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle size={14} style={{ display: 'inline', marginRight: 4 }} /> Use Analyzed Template
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
