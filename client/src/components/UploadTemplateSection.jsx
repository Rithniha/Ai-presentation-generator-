import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
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
  const [status, setStatus] = useState('idle'); // idle, uploading, parsing, success, error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const fileInputRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

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

    // File validation
    const validExtensions = ['.ppt', '.pptx', '.potx'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => lowerName.endsWith(ext));

    if (!isValid) {
      setErrorMsg('Unsupported format. Please upload a .ppt, .pptx, or .potx file.');
      setStatus('error');
      return;
    }

    // Size limit validation (e.g. 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg('File too large. Maximum size is 50MB.');
      setStatus('error');
      return;
    }

    // Calculate file size string
    const sizeKB = file.size / 1024;
    const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB.toFixed(0)} KB`;
    setFileSizeStr(sizeStr);

    // Reset progress and errors
    setStatus('uploading');
    setUploadProgress(0);
    setStatusText('Uploading file...');
    setErrorMsg('');
    setFileName(file.name);

    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += 5;
      if (progress <= 60) {
        setUploadProgress(progress);
        setStatusText(`Uploading template assets... ${progress}%`);
      } else if (progress <= 90) {
        setUploadProgress(progress);
        setStatusText(`AI model analyzing slide layouts & color palettes... ${progress}%`);
      } else if (progress < 100) {
        setUploadProgress(progress);
        setStatusText(`Optimizing theme parameters... ${progress}%`);
      } else {
        clearInterval(progressIntervalRef.current);
        setUploadProgress(100);
        setStatusText('Analyzing template structure... Complete!');
        
        setTimeout(() => {
          setStatus('success');
          const analysisData = generateAnalysis(file.name, file.size);
          
          // Calculate real compatibility score using shared helper
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
        }, 300);
      }
    }, 90);
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
    setFileSizeStr('');
    setUploadProgress(0);
    setAnalysis(null);
    setErrorMsg('');
  };

  const handleUseTemplate = () => {
    if (!analysis) return;
    
    onSelectUploadedTemplate({
      id: `uploaded-${fileName.replace(/\s+/g, '-').toLowerCase()}`,
      name: `Custom (${analysis.theme})`,
      category: 'Uploaded',
      tags: ['Custom', analysis.layout],
      desc: `Simulated template based on uploaded file "${fileName}".`,
      users: analysis.audience,
      philosophy: `Custom layout matching ${analysis.theme} theme.`,
      bg: analysis.colors[0],
      accent: analysis.colors[1],
      text: analysis.colors[0] === '#ffffff' ? '#0f172a' : '#ffffff',
      secondary: 'rgba(255,255,255,0.12)',
      card: 'rgba(255,255,255,0.1)',
      font: 'Inter',
      industry: analysis.audience === 'Business Professional' ? 'Corporate' : 'Education',
      style: analysis.layout.replace('-based', '').replace('-first', ''),
      animated: true,
      aspectRatio: '16:9',
      slideCount: analysis.slideCount,
      lastUpdated: 'Just now',
      badges: ['Custom Upload']
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
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Supported formats: <b>.ppt, .pptx, .potx</b> (Max size: 50MB)</span>

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
          gap: '1.25rem',
        }}>
          <div className="ts-upload-spinner" />
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
              <span>Status: {statusText}</span>
              <span>{uploadProgress}%</span>
            </div>
            {/* Custom Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #818cf8)', borderRadius: '999px', transition: 'width 0.1s ease' }} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Uploading "{fileName}" ({fileSizeStr})</span>
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
              <span>Successfully uploaded "{fileName}" ({fileSizeStr})</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={14} /> 🤖 AI Template Analysis Complete
                </span>
                <span className="ts-card-tag" style={{ background: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5', fontWeight: 700 }}>
                  ⚡ {analysis.compatibilityScore}% Compatibility
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Visual Thumbnail Preview Box */}
                <div style={{
                  width: '140px',
                  aspectRatio: '16/9',
                  borderRadius: '8px',
                  background: analysis.colors[0],
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '10px',
                  flexShrink: 0
                }}>
                  {/* Accent strip */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: analysis.colors[1] }} />
                  
                  <div>
                    <div style={{ fontSize: '5.5px', fontWeight: 900, color: analysis.colors[1], letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                      {analysis.audience.split(' ')[0]} THEME
                    </div>
                    <div style={{ fontSize: '8.5px', fontWeight: 900, color: analysis.colors[0] === '#ffffff' ? '#0f172a' : '#ffffff', marginTop: '3px', lineHeight: 1.1 }}>
                      {analysis.theme}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ fontSize: '5px', color: analysis.colors[0] === '#ffffff' ? '#64748b' : '#ffffff', opacity: 0.6 }}>
                      {analysis.layout}
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {analysis.colors.map((c, i) => (
                        <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: c, border: '0.2px solid #e2e8f0' }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Analysis Info */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Detected Theme</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{analysis.theme}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Primary Colors</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {analysis.colors.map((c, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: c, border: '1px solid #cbd5e1' }} title={c} />
                          <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>{c}</span>
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
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '1.25rem' }}>
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
