import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, FileText } from 'lucide-react';
import StepBuilder from './components/StepBuilder';
import LivePreview from './components/LivePreview';
import SettingsPanel from './components/SettingsPanel';
import Footer from './components/Footer';

export default function App() {
  const [settings, setSettings] = useState({
    logo: null,
    titleFontSize: 32, // Reduced from 40px
    numberColor: '#0f1115',
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

    const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    const opt = {
      margin:       [0.4, 0.3, 0.4, 0.3], // Reverted top margin to standard for all pages
      filename:     `${title || 'Quick-Reference-Guide'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      pagebreak:    { mode: ['css', 'legacy'] },
      html2canvas:  { 
        scale: 2, 
        useCORS: true,
        logging: false,
        letterRendering: true,
        onclone: (clonedDoc) => {
            const el = clonedDoc.querySelector('.preview-container');
            if (el) {
              el.style.boxShadow = 'none';
              el.style.border = 'none';
              el.style.padding = '0 0 20px 0'; // Remove top padding
              el.style.width = '100%';
              el.style.maxWidth = 'none';
              
              // Only pull the title up on the first page
              const titleEl = clonedDoc.querySelector('.preview-title');
              if (titleEl) {
                titleEl.style.marginTop = '-0.2in'; // Specifically reduce first page header space
              }
            }
        }
      },
      jsPDF:        { unit: 'in', format: pageSize, orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(150);
        
        // Created on (Only on last page)
        if (i === totalPages) {
          pdf.text(`Created on ${date}`, 0.5, pageHeight - 0.35);
        }
        
        // Page Number (Right)
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 0.5, pageHeight - 0.35, { align: 'right' });
      }
    }).save();
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <FileText size={24} color="var(--accent)" />
          Saurabh's QRG Creator
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-primary" onClick={handleExportPDF}>
            <Download size={18} /> Export to PDF
          </button>
        </div>
      </header>

      <main className="main-content">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', minHeight: 0, overflow: 'hidden' }}>
          <SettingsPanel settings={settings} setSettings={setSettings} pageSize={pageSize} setPageSize={setPageSize} />
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
      <Footer />
    </div>
  );
}
