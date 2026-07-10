import React, { useState, useMemo } from 'react';
import ModalShell from './ModalShell';
import { 
  BarChart3, LineChart, PieChart, Activity, ScatterChart, Upload, Search, 
  Trash2, Filter, ArrowUpDown, Settings2, Sparkles, Send, Download, Check, Eye
} from 'lucide-react';

export default function ChartModal({ onClose, onInsert }) {
  const [selectedChartId, setSelectedChartId] = useState('line');
  const [searchQuery, setSearchQuery] = useState('');
  const [dataset, setDataset] = useState(null); // Loaded dataset metadata
  const [previewRows, setPreviewRows] = useState([]); // Loaded dataset rows
  const [columns, setColumns] = useState([]); // Loaded column specs
  const [aiCommands, setAiCommands] = useState([]); // Chat history
  const [cmdInput, setCmdInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Chart styling customizations state
  const [chartTitle, setChartTitle] = useState('Company Revenue 2026');
  const [xAxisLabel, setXAxisLabel] = useState('Month');
  const [yAxisLabel, setYAxisLabel] = useState('Sales ($)');
  const [chartTheme, setChartTheme] = useState('purple'); // purple, dark, classic
  const [showGrid, setShowGrid] = useState(true);

  // Full unified chart type library
  const chartLibrary = [
    { id: 'bar', name: 'Bar Chart', desc: 'Compare discrete category metrics', icon: <BarChart3 size={20} color="#7c3aed" />, emoji: '📊' },
    { id: 'line', name: 'Line Chart', desc: 'Plot trends chronologically', icon: <LineChart size={20} color="#3b82f6" />, emoji: '📈', isRec: true },
    { id: 'pie', name: 'Pie Chart', desc: 'Display shares of a whole', icon: <PieChart size={20} color="#f59e0b" />, emoji: '🥧' },
    { id: 'area', name: 'Area Chart', desc: 'Highlight volume changes over time', icon: <Activity size={20} color="#10b981" />, emoji: '📉' },
    { id: 'scatter', name: 'Scatter Plot', desc: 'Examine coordinate relationship trends', icon: <ScatterChart size={20} color="#6366f1" />, emoji: '🔵' },
    { id: 'heatmap', name: 'Heatmap', desc: 'Visualize matrix density values', icon: <Activity size={20} color="#f43f5e" />, emoji: '🌡️' },
    { id: 'treemap', name: 'Treemap', desc: 'Show nested relative sizes', icon: <BarChart3 size={20} color="#06b6d4" />, emoji: '📦' },
    { id: 'radar', name: 'Radar Chart', desc: 'Multi-variable comparison', icon: <Activity size={20} color="#a855f7" />, emoji: '🎯' },
    { id: 'funnel', name: 'Funnel Chart', desc: 'Analyze conversion stages', icon: <BarChart3 size={20} color="#f97316" />, emoji: '💧' },
    { id: 'bubble', name: 'Bubble Chart', desc: 'Coordinate sizes plotting', icon: <ScatterChart size={20} color="#eab308" />, emoji: '📍' }
  ];

  // Default pre-populated dataset for instant visualization
  const loadDefaultDataset = () => {
    const defaultCols = [
      { name: 'Month', type: 'text', missing: 0 },
      { name: 'Revenue', type: 'numeric', missing: 0 },
      { name: 'Signups', type: 'numeric', missing: 0 },
      { name: 'Cost', type: 'numeric', missing: 0 }
    ];
    const defaultRows = [
      { Month: 'Jan', Revenue: 12000, Signups: 150, Cost: 8000 },
      { Month: 'Feb', Revenue: 15000, Signups: 180, Cost: 9500 },
      { Month: 'Mar', Revenue: 18000, Signups: 220, Cost: 11000 },
      { Month: 'Apr', Revenue: 22000, Signups: 310, Cost: 13000 },
      { Month: 'May', Revenue: 26000, Signups: 420, Cost: 14500 }
    ];
    setColumns(defaultCols);
    setPreviewRows(defaultRows);
    setDataset({
      name: 'financial_performance_2026.csv',
      size: '2.4 KB',
      rows: 50,
      cols: 4
    });
  };

  const handleCommandSend = () => {
    if (!cmdInput.trim()) return;
    setAiCommands(prev => [...prev, { sender: 'user', text: cmdInput }]);
    const query = cmdInput.toLowerCase();
    setCmdInput('');

    setTimeout(() => {
      let reply = "I've updated the chart visualization layout.";
      if (query.includes('title')) {
        setChartTitle('Visualized Financial Review');
        reply = "I have updated the chart title to 'Visualized Financial Review'.";
      } else if (query.includes('dark')) {
        setChartTheme('dark');
        reply = "Theme switched to Dark mode aesthetics successfully.";
      } else if (query.includes('pie')) {
        setSelectedChartId('pie');
        reply = "Visualization converted into a Pie chart.";
      } else if (query.includes('bar')) {
        setSelectedChartId('bar');
        reply = "Visualization converted into a Bar chart.";
      } else if (query.includes('hide grid') || query.includes('grid')) {
        setShowGrid(false);
        reply = "Grid lines have been hidden from the visualization canvas.";
      }

      setAiCommands(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  // Filter library items
  const filteredLibrary = useMemo(() => {
    return chartLibrary.filter(c => {
      return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             c.desc.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  return (
    <ModalShell 
      title="Charts & Data Visualization" 
      onClose={onClose}
      sidebarTabs={[]} // Left sidebar completely removed
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
        {/* Sticky Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Create beautiful charts from your data or upload a dataset.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search charts..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px',
                  border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none'
                }}
              />
            </div>
            
            <button 
              onClick={loadDefaultDataset}
              className="ai-btn-purple"
              style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}
            >
              <Upload size={14} /> Upload Dataset
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, display: 'flex', gap: '24px', overflow: 'hidden' }}>
          {/* Main Visualizer & Grid area */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '4px' }}>
            
            {/* Upload Area if no data loaded */}
            {!dataset && (
              <div 
                onClick={loadDefaultDataset}
                style={{
                  border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '60px 40px',
                  textAlign: 'center', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}
              >
                <Upload size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ margin: '0 0 8px 0', color: '#334155' }}>Drag & Drop your dataset here</h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Supports CSV, Excel (.xlsx, .xls), JSON, or TSV formats.</p>
                <button className="ai-btn-secondary" style={{ marginTop: '16px', padding: '8px 16px' }}>Or Browse Files</button>
              </div>
            )}

            {/* If dataset loaded, show interactive visualizer */}
            {dataset && (
              <>
                {/* AI Recommended Charts Section */}
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                    <Sparkles size={18} color="#7c3aed" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#5b21b6' }}>
                      Recommended: Line Chart (95% match)
                    </span>
                  </div>
                  
                  {/* Gallery of Chart Selection Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                    {filteredLibrary.map(chart => {
                      const isActive = selectedChartId === chart.id;
                      return (
                        <div 
                          key={chart.id}
                          onClick={() => setSelectedChartId(chart.id)}
                          style={{
                            border: isActive ? '2px solid #7c3aed' : '1px solid #e2e8f0', 
                            borderRadius: '10px', padding: '10px',
                            cursor: 'pointer', transition: 'all 0.2s', 
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                            background: isActive ? '#faf5ff' : '#fff',
                            position: 'relative'
                          }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>{chart.emoji}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 600 : 500, color: '#334155' }}>{chart.name}</span>
                          {chart.isRec && (
                            <span style={{ position: 'absolute', top: -6, right: -6, background: '#a855f7', color: '#fff', borderRadius: '10px', padding: '1px 5px', fontSize: '0.55rem', fontWeight: 700 }}>⭐ REC</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Chart Preview Canvas */}
                <div style={{ 
                  background: chartTheme === 'dark' ? '#0f172a' : '#f8fafc', 
                  borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px',
                  color: chartTheme === 'dark' ? '#fff' : '#334155', position: 'relative'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: chartTheme === 'dark' ? '#fff' : '#1e293b' }}>
                    {chartTitle} ({selectedChartId.toUpperCase()})
                  </h4>
                  {/* Simulated Chart Types Layout */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '120px', width: '100%', maxWidth: '300px' }}>
                    {selectedChartId === 'pie' ? (
                      <div style={{ 
                        width: '100px', height: '100px', borderRadius: '50%', 
                        background: 'conic-gradient(#7c3aed 0% 40%, #10b981 40% 70%, #f59e0b 70% 100%)',
                        margin: '0 auto'
                      }} />
                    ) : selectedChartId === 'scatter' ? (
                      <div style={{ position: 'relative', width: '100%', height: '100px' }}>
                        {[20, 40, 60, 80].map((left, i) => (
                          <div key={i} style={{ 
                            position: 'absolute', bottom: `${left}px`, left: `${left}%`, 
                            width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed' 
                          }} />
                        ))}
                      </div>
                    ) : (
                      // Bar / Line / Area default display
                      previewRows.map((row, idx) => (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ 
                            width: '100%', 
                            height: `${(row.Revenue / 30000) * 100}px`, 
                            background: chartTheme === 'dark' ? '#c084fc' : '#7c3aed',
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.3s'
                          }} />
                          <span style={{ fontSize: '0.65rem', color: chartTheme === 'dark' ? '#94a3b8' : '#64748b' }}>{row.Month}</span>
                        </div>
                      ))
                    )}
                  </div>
                  {showGrid && <div style={{ width: '100%', maxWidth: '300px', height: '1px', background: chartTheme === 'dark' ? '#334155' : '#cbd5e1', marginTop: '4px' }} />}
                </div>

                {/* Dataset Preview Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                    <span>File: <b>{dataset.name}</b> ({dataset.size})</span>
                    <span>Loaded {dataset.rows} rows and {dataset.cols} columns</span>
                  </div>
                  <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          {columns.map(col => (
                            <th key={col.name} style={{ padding: '8px 12px', fontWeight: 600, color: '#475569' }}>
                              {col.name} <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 400 }}>({col.type})</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            {columns.map(col => (
                              <td key={col.name} style={{ padding: '8px 12px', color: '#334155' }}>{row[col.name]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI Insights Card */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569', marginBottom: '8px' }}>AI Data Insights</div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>Revenue increased by 18% over the last quarter.</li>
                    <li>Peak revenue detected in May ($26,000).</li>
                    <li>Cost-to-income ratio remains optimized at 55%.</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Right sidebar: customize & AI prompt command panel */}
          <div style={{ width: '280px', borderLeft: '1px solid #e2e8f0', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
            {/* Customization controls */}
            <div>
              <h5 style={{ margin: '0 0 12px 0', fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Settings2 size={16} /> Customize Chart
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: '#64748b' }}>
                  Chart Title
                  <input 
                    type="text" 
                    value={chartTitle}
                    onChange={e => setChartTitle(e.target.value)}
                    style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: '#64748b' }}>
                    X-Axis Label
                    <input 
                      type="text" 
                      value={xAxisLabel}
                      onChange={e => setXAxisLabel(e.target.value)}
                      style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                    />
                  </label>
                  <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: '#64748b' }}>
                    Y-Axis Label
                    <input 
                      type="text" 
                      value={yAxisLabel}
                      onChange={e => setYAxisLabel(e.target.value)}
                      style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                    />
                  </label>
                </div>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem', color: '#64748b' }}>
                  Color Theme
                  <select 
                    value={chartTheme}
                    onChange={e => setChartTheme(e.target.value)}
                    style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem', background: '#fff' }}
                  >
                    <option value="purple">Purple Accent</option>
                    <option value="dark">Slate Dark</option>
                    <option value="classic">Vibrant Classic</option>
                  </select>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#64748b', cursor: 'pointer', marginTop: '4px' }}>
                  <input 
                    type="checkbox" 
                    checked={showGrid}
                    onChange={e => setShowGrid(e.target.checked)}
                  />
                  Show grid lines
                </label>
              </div>
            </div>

            {/* AI Command Prompts */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h5 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Sparkles size={16} color="#7c3aed" /> AI Visualizer Assistant
              </h5>
              
              {/* Chat history */}
              <div style={{ 
                height: '110px', overflowY: 'auto', border: '1px solid #e2e8f0', 
                borderRadius: '8px', padding: '8px', background: '#f8fafc', 
                display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem'
              }}>
                {aiCommands.length === 0 && <span style={{ color: '#94a3b8' }}>Ask AI to generate, switch, or style visualizations.</span>}
                {aiCommands.map((cmd, i) => (
                  <div key={i} style={{ 
                    padding: '4px 8px', borderRadius: '6px', 
                    alignSelf: cmd.sender === 'ai' ? 'flex-start' : 'flex-end',
                    background: cmd.sender === 'ai' ? '#ffffff' : '#f3e8ff',
                    border: '1px solid', borderColor: cmd.sender === 'ai' ? '#e2e8f0' : '#d8b4fe',
                    color: '#334155'
                  }}>
                    {cmd.text}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="text" 
                  placeholder="e.g. 'Use dark theme'..."
                  value={cmdInput}
                  onChange={e => setCmdInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCommandSend()}
                  style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}
                />
                <button 
                  onClick={handleCommandSend}
                  style={{ background: '#7c3aed', border: 'none', color: '#fff', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <Send size={12} />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => onInsert('chart', { chartType: selectedChartId, title: chartTitle }, { width: '400px', height: '300px' })}
                disabled={!dataset}
                className="ai-btn-purple"
                style={{ width: '100%', padding: '10px', fontSize: '0.8rem', fontWeight: 600, opacity: dataset ? 1 : 0.5, cursor: dataset ? 'pointer' : 'not-allowed' }}
              >
                Insert into Slide
              </button>
              <button 
                disabled={!dataset}
                className="ai-btn-secondary"
                style={{ width: '100%', padding: '8px', fontSize: '0.78rem', fontWeight: 600, opacity: dataset ? 1 : 0.5, cursor: dataset ? 'pointer' : 'not-allowed', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}
              >
                <Download size={14} /> Download Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
