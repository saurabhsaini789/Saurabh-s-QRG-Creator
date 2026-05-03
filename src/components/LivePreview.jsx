import React, { forwardRef, useEffect } from 'react';

const LivePreview = forwardRef(({ title, steps, settings }, ref) => {
  useEffect(() => {
    if (settings.fontFamily !== 'Inter') {
      const link = document.createElement('link');
      link.id = 'dynamic-font';
      link.href = `https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      return () => {
        const existing = document.getElementById('dynamic-font');
        if (existing) existing.remove();
      };
    }
  }, [settings.fontFamily]);

  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="panel" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="panel-header">
        <h2 className="panel-title">Live Preview</h2>
      </div>
      
      <div className="scroll-area">
        <div 
          className="preview-container" 
          ref={ref} 
          style={{ 
            fontFamily: `"${settings.fontFamily}", sans-serif`,
            fontSize: `${settings.fontSize}px`,
            position: 'relative',
            paddingBottom: '80px' // Space for footer
          }}
        >
          {settings.logo && (
            <div style={{ position: 'absolute', top: '48px', right: '48px' }}>
              <img src={settings.logo} alt="Company Logo" style={{ maxHeight: '60px', maxWidth: '150px', objectFit: 'contain' }} />
            </div>
          )}

          <h1 className="preview-title" style={{ fontSize: `${settings.titleFontSize}px` }}>
            {title || 'Untitled Quick Reference Guide'}
          </h1>

          {steps.length === 0 ? (
            <div className="empty-state">
              Add steps to see them in the preview.
            </div>
          ) : (
            steps.map((step, index) => (
              <div key={step.id} className="preview-step">
                <div className="preview-step-header">
                  <div className="preview-step-number" style={{ backgroundColor: settings.numberColor }}>{index + 1}</div>
                  <h3 className="preview-step-title">
                    {step.title || 'Untitled Step'}
                  </h3>
                </div>
                
                {step.description && (
                  <div 
                    className="preview-step-desc" 
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                )}

                {step.image && (
                  <div className="preview-step-image">
                    <img src={step.image} alt={`Step ${index + 1}`} />
                  </div>
                )}
              </div>
            ))
          )}
          {steps.length > 0 && (
            <div style={{ position: 'absolute', bottom: '48px', left: '48px', right: '48px', borderTop: '1px solid var(--border)', paddingTop: '16px', color: 'var(--text-secondary)', fontSize: '0.85em', textAlign: 'center' }}>
              Created on {date}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default LivePreview;
