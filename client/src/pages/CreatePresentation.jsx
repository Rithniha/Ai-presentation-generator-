import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { getGuestSessionId } from '../services/auth';
import { 
  Sparkles, 
  ArrowRight, 
  Presentation, 
  BarChart2, 
  Upload,
  FileSpreadsheet,
  GraduationCap, 
  Briefcase, 
  Award 
} from 'lucide-react';
import '../styles/CreatePresentation.css';

const ROLES = [
  { id: 'student', title: 'Student', icon: <GraduationCap size={20} />, desc: 'Simple explanations, educational tone, and summary diagrams.' },
  { id: 'professor', title: 'Professor', icon: <Award size={20} />, desc: 'Analytical focus, structured references, and detailed narratives.' },
  { id: 'business', title: 'Business Professional', icon: <Briefcase size={20} />, desc: 'Action-oriented layouts, key metrics, and strategic takeaways.' }
];

const THEMES = [
  { id: 'classic', label: 'Classic Indigo', colors: ['#4f46e5', '#818cf8'] },
  { id: 'teal', label: 'Modern Teal', colors: ['#0d9488', '#2dd4bf'] },
  { id: 'aurora', label: 'Aurora Purple', colors: ['#7c3aed', '#c084fc'] }
];

const PIE_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function CreatePresentation() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [requirements, setRequirements] = useState('');
  const [selectedRole, setSelectedRole] = useState('business');
  
  // Slide settings
  const [slideCount, setSlideCount] = useState('6');
  const [slideCountError, setSlideCountError] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('classic');
  const [tone, setTone] = useState('Professional');

  // Chart Integration
  const [includeChart, setIncludeChart] = useState(false);
  const [chartTitle, setChartTitle] = useState('Key Growth Metrics');
  const [chartType, setChartType] = useState('bar');
  const [chartRawData, setChartRawData] = useState('Q1: 120, Q2: 240, Q3: 310, Q4: 480');

  // Spreadsheet Data Upload State
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [labelCol, setLabelCol] = useState('');
  const [valueCol, setValueCol] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [warmingUp, setWarmingUp] = useState(false);
  const [warmupTimer, setWarmupTimer] = useState(0);

  // File Upload parsing logic
  const parseSheetText = (text) => {
    if (!text) return;
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return;
    
    // Separator detection
    const firstLine = lines[0];
    let sep = ',';
    if (firstLine.includes('\t')) sep = '\t';
    else if (firstLine.includes(';')) sep = ';';
    
    const fileHeaders = firstLine.split(sep).map(h => h.trim().replace(/^["']|["']$/g, ''));
    const fileRows = lines.slice(1).map(line => {
      const cells = line.split(sep).map(c => c.trim().replace(/^["']|["']$/g, ''));
      const rowObj = {};
      fileHeaders.forEach((h, idx) => {
        rowObj[h] = cells[idx] || '';
      });
      return rowObj;
    });

    setHeaders(fileHeaders);
    setRows(fileRows);

    if (fileHeaders.length >= 2) {
      setLabelCol(fileHeaders[0]);
      setValueCol(fileHeaders[1]);
      setChartTitle(fileHeaders[1]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      parseSheetText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleSlideCountChange = (e) => {
    const val = e.target.value;
    const cleanVal = val.replace(/\D/g, '');
    setSlideCount(cleanVal);

    if (!cleanVal) {
      setSlideCountError('Number of slides is required.');
    } else {
      const num = parseInt(cleanVal, 10);
      if (num < 3 || num > 50) {
        setSlideCountError('Number of slides must be between 3 and 50.');
      } else {
        setSlideCountError('');
      }
    }
  };

  // Sync columns selection to raw formatted text
  useEffect(() => {
    if (rows.length > 0 && labelCol && valueCol) {
      const rawFormat = rows.map(row => {
        const lbl = row[labelCol];
        const val = parseFloat(row[valueCol]);
        return lbl && !isNaN(val) ? `${lbl}:${val}` : null;
      }).filter(Boolean).join(', ');
      setChartRawData(rawFormat);
    }
  }, [labelCol, valueCol, rows]);

  // Parse raw chart data to render graphs
  const parsedData = useMemo(() => {
    try {
      return chartRawData.split(',').map(item => {
        const [label, val] = item.split(':');
        return {
          label: label?.trim() || 'Label',
          value: parseFloat(val?.trim()) || 0
        };
      }).filter(d => !isNaN(d.value));
    } catch (e) {
      return [];
    }
  }, [chartRawData]);

  const maxValue = useMemo(() => {
    const vals = parsedData.map(d => d.value);
    return vals.length > 0 ? Math.max(...vals) : 100;
  }, [parsedData]);

  const totalValue = useMemo(() => {
    return parsedData.reduce((sum, d) => sum + d.value, 0);
  }, [parsedData]);

  // SVG coordinates coordinate helper for Pie
  const getCoordinatesForPercent = (percent) => {
    // Offset by -0.25 to start slice path at 12 o'clock (top center)
    const angle = (percent - 0.25) * 2 * Math.PI;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return [x, y];
  };

  // Build Pie Slice coordinates
  const pieSlices = useMemo(() => {
    let cumulativePercent = 0;
    return parsedData.map((d, index) => {
      const percent = d.value / (totalValue || 1);
      const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
      cumulativePercent += percent;
      const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

      const largeArcFlag = percent > 0.5 ? 1 : 0;
      const x1 = 50 + startX * 35;
      const y1 = 50 + startY * 35;
      const x2 = 50 + endX * 35;
      const y2 = 50 + endY * 35;

      const pathData = `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      return {
        path: pathData,
        color: PIE_COLORS[index % PIE_COLORS.length],
        label: d.label,
        value: d.value,
        pct: (percent * 100).toFixed(0)
      };
    });
  }, [parsedData, totalValue]);

  // Warmup countdown
  useEffect(() => {
    let interval;
    if (warmingUp) {
      interval = setInterval(() => {
        setWarmupTimer(prev => prev + 1);
      }, 1000);
    } else {
      setWarmupTimer(0);
    }
    return () => clearInterval(interval);
  }, [warmingUp]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!purpose) return;

    const num = parseInt(slideCount, 10);
    if (isNaN(num) || num < 3 || num > 50) {
      setSlideCountError('Number of slides must be between 3 and 50.');
      return;
    }

    const promptText = `
      Title: ${title.trim()}
      Presentation Purpose: ${purpose}
      Number of Slides: ${num}
      Requirements & Outline: ${requirements.trim()}
      Audience Role: ${selectedRole}
      Tone: ${tone}
      ${includeChart ? `Include a ${chartType} chart named "${chartTitle}" with data: ${chartRawData}` : ''}
    `;

    // Pass all config to template selector page
    navigate('/templates', {
      state: {
        title: title.trim(),
        purpose,
        requirements: requirements.trim(),
        selectedRole,
        tone,
        slideCount: num,
        includeChart,
        chartTitle,
        chartType,
        chartRawData,
        promptText,
      }
    });
  };

  return (
    <div className="create-page-container">
      {/* Sticky Header */}
      <header className="create-header">
        <Link to="/" className="create-logo">
          <div className="create-logo-icon">
            <Presentation size={16} />
          </div>
          <span>DeckFlow</span>
        </Link>
        <Link to="/dashboard" className="landing-btn landing-btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          Back to Dashboard
        </Link>
      </header>

      <div className="create-content-wrapper">
        <div className="create-title-block">
          <h1>Configure Presentation Details</h1>
          <p>Provide title specifications, custom requirements, and charts to generate tailor-made slides.</p>
        </div>

        <form onSubmit={handleSubmit} className="create-form-card">
          
          {/* Section 1: Presentation Info */}
          <div>
            <div className="create-section-title">1. Presentation Scope</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="create-input-group">
                <label className="create-label">Presentation Title</label>
                <input
                  type="text"
                  className="create-input"
                  placeholder="e.g., Q3 Sales Performance and Growth Roadmaps"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="create-input-group">
                <label className="create-label">Presentation Purpose</label>
                <select
                  className="create-input"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="" disabled>Select presentation purpose</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Project Presentation">Project Presentation</option>
                  <option value="Business Pitch">Business Pitch</option>
                  <option value="Research Presentation">Research Presentation</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Training">Training</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="create-input-group">
                <label className="create-label">Requirements / Guidelines</label>
                <textarea
                  className="create-input create-textarea"
                  placeholder="Describe details, bullet points, core arguments, or sections you want the AI to include..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Target Audience Role */}
          <div>
            <div className="create-section-title">2. Target Audience</div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
              Select who will view this deck. The AI will customize vocabulary and detail levels accordingly.
            </p>
            <div className="role-grid">
              {ROLES.map((role) => (
                <div
                  key={role.id}
                  className={`role-card ${selectedRole === role.id ? 'active' : ''}`}
                  onClick={() => !loading && setSelectedRole(role.id)}
                >
                  <div className="role-icon">{role.icon}</div>
                  <div className="role-title">{role.title}</div>
                  <div className="role-desc">{role.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: AI Charts */}
          <div>
            <div className="create-section-title">3. AI Data Chart & Graph</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div 
                className="chart-toggle-row"
                onClick={() => !loading && setIncludeChart(!includeChart)}
              >
                <div className="chart-toggle-left">
                  <BarChart2 size={18} style={{ color: '#4f46e5' }} />
                  <span>Include dynamic data chart slide</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={includeChart} 
                  onChange={() => {}} 
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>

              {includeChart && (
                <div className="chart-config-panel">
                  {/* Left inputs */}
                  <div className="chart-inputs">
                    {/* CSV / Sheet Upload area */}
                    <div className="create-input-group">
                      <label className="create-label">Upload Spreadsheet (CSV/TSV)</label>
                      <label className="upload-dropzone">
                        <Upload size={24} style={{ color: '#64748b' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4f46e5' }}>Choose CSV File</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Or drag spreadsheet file here</span>
                        <input 
                          type="file" 
                          accept=".csv,.txt"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                          disabled={loading}
                        />
                      </label>
                    </div>

                    {/* Columns Mapper (if headers parsed) */}
                    {headers.length > 0 && (
                      <div className="col-mapper-row">
                        <div className="create-input-group">
                          <label className="create-label">Label Column (X-axis)</label>
                          <select 
                            className="create-input"
                            value={labelCol}
                            onChange={(e) => setLabelCol(e.target.value)}
                            disabled={loading}
                          >
                            {headers.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </div>
                        <div className="create-input-group">
                          <label className="create-label">Value Column (Y-axis)</label>
                          <select 
                            className="create-input"
                            value={valueCol}
                            onChange={(e) => setValueCol(e.target.value)}
                            disabled={loading}
                          >
                            {headers.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Raw manual editor */}
                    <div className="create-input-group">
                      <label className="create-label">Chart Title</label>
                      <input
                        type="text"
                        className="create-input"
                        value={chartTitle}
                        onChange={(e) => setChartTitle(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className="create-input-group">
                      <label className="create-label">Chart Type</label>
                      <select 
                        className="create-input"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        disabled={loading}
                      >
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="pie">Pie Chart</option>
                        <option value="area">Area Chart</option>
                      </select>
                    </div>

                    <div className="create-input-group">
                      <label className="create-label">Or Edit Chart Data Manually</label>
                      <input
                        type="text"
                        className="create-input"
                        value={chartRawData}
                        onChange={(e) => setChartRawData(e.target.value)}
                        placeholder="Label:Value, e.g. Q1:120, Q2:240, Q3:310"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Right Chart Preview & Spreadsheet grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="chart-preview-box">
                      <div className="chart-preview-title">{chartTitle}</div>
                      
                      {parsedData.length === 0 ? (
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Enter valid data to preview</span>
                      ) : chartType === 'bar' ? (
                        <div className="chart-bar-container">
                          {parsedData.map((d, idx) => {
                            const pct = maxValue > 0 ? (d.value / maxValue) * 100 : 0;
                            return (
                              <div key={idx} className="chart-bar-wrapper">
                                <div className="chart-bar-fill" style={{ height: `${pct}%` }}>
                                  <span className="chart-bar-value">{d.value}</span>
                                </div>
                                <span className="chart-bar-label">{d.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : chartType === 'line' ? (
                        <div style={{ width: '100%', padding: '0.5rem' }}>
                          <svg className="chart-line-svg" viewBox="0 0 400 120">
                            {/* Grid Lines */}
                            <line x1="0" y1="10" x2="400" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="110" x2="400" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                            
                            {(() => {
                              const widthStep = 400 / (parsedData.length - 1 || 1);
                              const points = parsedData.map((d, i) => {
                                const x = i * widthStep;
                                const y = 110 - (maxValue > 0 ? (d.value / maxValue) * 100 : 0);
                                return { x, y, val: d.value, lbl: d.label };
                              });

                              const dPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

                              return (
                                <>
                                  <path d={dPath} fill="none" stroke="#4f46e5" strokeWidth="2.5" />
                                  {points.map((p, i) => (
                                    <g key={i}>
                                      <circle cx={p.x} cy={p.y} r="4.5" fill="#4f46e5" stroke="white" strokeWidth="1.5" />
                                      <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fill="#4f46e5" fontWeight="bold">
                                        {p.val}
                                      </text>
                                      <text x={p.x} y="120" textAnchor="middle" fontSize="9" fill="#94a3b8">
                                        {p.lbl}
                                      </text>
                                    </g>
                                  ))}
                                </>
                              );
                            })()}
                          </svg>
                        </div>
                      ) : chartType === 'area' ? (
                        <div style={{ width: '100%', padding: '0.5rem' }}>
                          <svg className="chart-line-svg" viewBox="0 0 400 120">
                            <defs>
                              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <line x1="0" y1="10" x2="400" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="110" x2="400" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                            
                            {(() => {
                              const widthStep = 400 / (parsedData.length - 1 || 1);
                              const points = parsedData.map((d, i) => {
                                const x = i * widthStep;
                                const y = 110 - (maxValue > 0 ? (d.value / maxValue) * 100 : 0);
                                return { x, y, val: d.value, lbl: d.label };
                              });

                              const dPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                              const fillPath = `${dPath} L ${points[points.length - 1].x} 110 L ${points[0].x} 110 Z`;

                              return (
                                <>
                                  <path d={fillPath} fill="url(#areaGrad)" />
                                  <path d={dPath} fill="none" stroke="#4f46e5" strokeWidth="2.5" />
                                  {points.map((p, i) => (
                                    <g key={i}>
                                      <circle cx={p.x} cy={p.y} r="4" fill="#4f46e5" stroke="white" strokeWidth="1.5" />
                                      <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fill="#4f46e5" fontWeight="bold">
                                        {p.val}
                                      </text>
                                      <text x={p.x} y="120" textAnchor="middle" fontSize="9" fill="#94a3b8">
                                        {p.lbl}
                                      </text>
                                    </g>
                                  ))}
                                </>
                              );
                            })()}
                          </svg>
                        </div>
                      ) : (
                        // Pie Chart Layout
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', justifyContent: 'center' }}>
                          <svg width="100" height="100" viewBox="0 0 100 100">
                            {pieSlices.map((slice, idx) => (
                              <path 
                                key={idx}
                                d={slice.path}
                                fill={slice.color}
                                stroke="white"
                                strokeWidth="1"
                              />
                            ))}
                          </svg>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '100px', overflowY: 'auto' }}>
                            {pieSlices.map((slice, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: slice.color }}></span>
                                <span style={{ fontWeight: 600 }}>{slice.pct}%</span>
                                <span style={{ color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>{slice.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Table Preview */}
                    {rows.length > 0 && (
                      <div className="sheet-preview-table-container">
                        <table className="sheet-preview-table">
                          <thead>
                            <tr>
                              {headers.map(h => <th key={h}>{h}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {headers.map((h, cIdx) => <td key={cIdx}>{row[h]}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Extra Options */}
          <div>
            <div className="create-section-title">4. Extra Settings</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="create-input-group">
                <label className="create-label">Number of Slides</label>
                <input 
                  type="text"
                  className={`create-input ${slideCountError ? 'input-error' : ''}`}
                  placeholder="Enter number of slides (e.g., 10)"
                  value={slideCount}
                  onChange={handleSlideCountChange}
                  disabled={loading}
                  required
                />
                {slideCountError && (
                  <span className="input-error-message">
                    {slideCountError}
                  </span>
                )}
              </div>

              <div className="create-input-group">
                <label className="create-label">Tone</label>
                <select
                  className="create-input"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  disabled={loading}
                  required
                >
                  <option value="Professional">Professional</option>
                  <option value="Academic">Academic</option>
                  <option value="Creative">Creative</option>
                  <option value="Formal">Formal</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Slide Structure...' : 'Choose Template'}
            <ArrowRight size={18} />
          </button>

          {/* Warmup display */}
          {warmingUp && warmupTimer > 3 && (
            <div className="landing-warmup">
              <div className="landing-spinner"></div>
              <span className="landing-warmup-text">
                Warming up backend container... (elapsed: {warmupTimer}s / ~45s)
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
