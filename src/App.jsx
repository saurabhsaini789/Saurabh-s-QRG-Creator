import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, FileText } from 'lucide-react';
import StepBuilder from './components/StepBuilder';
import LivePreview from './components/LivePreview';
import SettingsPanel from './components/SettingsPanel';

export default function App() {
  const [settings, setSettings] = useState({
    logo: null,
    titleFontSize: 32, // Reduced from 40px
    numberColor: '#111111',
    fontFamily: 'Inter',
    fontSize: 16
  });
  const [pageSize, setPageSize] = useState('letter');
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState([
    {
      id: crypto.randomUUID(),
      title: 'First Step',
      description: 'Describe what to do here.',
      image: null
    }
  ]);
  const previewRef = useRef(null);

  const handleExportPDF = () => {
    const element = previewRef.current;
    if (!element) return;

    const opt = {
      margin:       0,
      filename:     `${title || 'Quick-Reference-Guide'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: pageSize, orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <FileText size={24} color="var(--accent)" />
          Saurabh's QRG Creator
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select 
            value={pageSize} 
            onChange={(e) => setPageSize(e.target.value)}
            className="btn btn-outline"
            style={{ padding: '8px', cursor: 'pointer' }}
          >
            <option value="letter">Letter (8.5" x 11")</option>
            <option value="a4">A4 (8.27" x 11.69")</option>
            <option value="legal">Legal (8.5" x 14")</option>
          </select>
          <button className="btn btn-primary" onClick={handleExportPDF}>
            <Download size={18} /> Export to PDF
          </button>
        </div>
      </header>

      <main className="main-content">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', minHeight: 0, overflow: 'hidden' }}>
          <SettingsPanel settings={settings} setSettings={setSettings} />
          <div style={{ padding: '24px 24px 0 24px', flexShrink: 0 }}>
            <input
              type="text"
              className="qrg-title-input"
              placeholder="Guide Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <StepBuilder steps={steps} setSteps={setSteps} />
        </div>
        
        <LivePreview title={title} steps={steps} settings={settings} ref={previewRef} />
      </main>
    </div>
  );
}
