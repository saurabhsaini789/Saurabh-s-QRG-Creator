import React, { useRef } from 'react';
import { Settings, ImagePlus, X } from 'lucide-react';

export default function SettingsPanel({ settings, setSettings, pageSize, setPageSize }) {
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="panel" style={{ flex: 'none', borderBottom: '1px solid var(--border)' }}>
      <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
        <Settings size={18} />
        <h2 className="panel-title" style={{ marginBottom: 0 }}>Document Settings</h2>
      </div>
      <div style={{ padding: '8px 24px 16px', display: 'flex', gap: '32px', flexWrap: 'wrap', backgroundColor: 'var(--panel-bg)', alignItems: 'flex-start' }}>
        
        <div className="setting-group">
          <label>Company Logo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '32px' }}>
            {settings.logo ? (
              <>
                <img src={settings.logo} alt="Logo" style={{ height: '100%', border: '1px solid var(--border)', borderRadius: '4px', objectFit: 'contain', background: 'var(--bg-card)' }} />
                <button className="btn-icon" onClick={() => setSettings({ ...settings, logo: null })}><X size={14} /></button>
              </>
            ) : (
              <>
                <button className="btn btn-outline" style={{ height: '32px', padding: '2px 12px', fontSize: '12px' }} onClick={() => fileInputRef.current.click()}>
                  <ImagePlus size={14} /> Upload
                </button>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleLogoUpload} />
              </>
            )}
          </div>
        </div>

        <div className="setting-group">
          <label>Title (px)</label>
          <input 
            type="number" 
            value={settings.titleFontSize} 
            onChange={(e) => setSettings({ ...settings, titleFontSize: parseInt(e.target.value) || 24 })}
            style={{ width: '64px', height: '32px', padding: '2px 8px', fontSize: '13px' }}
          />
        </div>

        <div className="setting-group">
          <label>Body (px)</label>
          <input 
            type="number" 
            value={settings.fontSize} 
            onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) || 16 })}
            style={{ width: '64px', height: '32px', padding: '2px 8px', fontSize: '13px' }}
          />
        </div>

        <div className="setting-group">
          <label>Color</label>
          <input 
            type="color" 
            value={settings.numberColor} 
            onChange={(e) => setSettings({ ...settings, numberColor: e.target.value })}
            style={{ width: '32px', padding: '0', height: '32px', cursor: 'pointer', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--bg-card)' }}
          />
        </div>

        <div className="setting-group">
          <label>Font Family</label>
          <select 
            value={settings.fontFamily} 
            onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
            style={{ height: '32px', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '13px', fontFamily: 'inherit', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Merriweather">Merriweather</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Page Size</label>
          <select 
            value={pageSize} 
            onChange={(e) => setPageSize(e.target.value)}
            style={{ height: '32px', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '13px', fontFamily: 'inherit', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
          >
            <option value="letter">Letter (8.5" x 11")</option>
            <option value="a4">A4 (8.27" x 11.69")</option>
            <option value="legal">Legal (8.5" x 14")</option>
          </select>
        </div>
      </div>
    </div>
  );
}
