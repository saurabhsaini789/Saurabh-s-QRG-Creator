import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Link, X, Check } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkData, setLinkData] = useState({ text: '', url: '' });
  const [savedRange, setSavedRange] = useState(null);

  // Set initial value only once
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && value !== undefined) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    }
    return null;
  };

  const restoreSelection = (range) => {
    if (range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    const sel = window.getSelection();
    const range = saveSelection();
    setSavedRange(range);
    
    const selectedText = sel.toString();
    setLinkData({ text: selectedText, url: '' });
    setShowLinkModal(true);
  };

  const confirmLink = () => {
    restoreSelection(savedRange);
    
    let finalUrl = linkData.url;
    if (finalUrl) {
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('mailto:') && !finalUrl.startsWith('tel:')) {
        finalUrl = 'https://' + finalUrl;
      }

      if (!linkData.text && savedRange && savedRange.toString() === '') {
        // No text selected and no text provided? Use URL as text
        const text = linkData.url;
        const linkHtml = `<a href="${finalUrl}" target="_blank">${text}</a>`;
        execCmd('insertHTML', linkHtml);
      } else if (savedRange && savedRange.toString() !== '') {
        // Text was selected
        execCmd('createLink', finalUrl);
      } else {
        // No selection, but text provided
        const linkHtml = `<a href="${finalUrl}" target="_blank">${linkData.text}</a>`;
        execCmd('insertHTML', linkHtml);
      }
    } else if (savedRange && savedRange.toString() !== '') {
      // Empty URL with selection = unlink
      execCmd('unlink');
    }

    setShowLinkModal(false);
    setLinkData({ text: '', url: '' });
  };

  return (
    <div className="rich-text-editor">
      <div className="rich-text-toolbar">
        <button className="rt-btn" onClick={(e) => { e.preventDefault(); execCmd('bold'); }} title="Bold">
          <Bold size={14} />
        </button>
        <button className="rt-btn" onClick={(e) => { e.preventDefault(); execCmd('italic'); }} title="Italic">
          <Italic size={14} />
        </button>
        <button className="rt-btn" onClick={(e) => { e.preventDefault(); execCmd('underline'); }} title="Underline">
          <Underline size={14} />
        </button>
        <button className="rt-btn" onClick={handleLinkClick} title="Add/Remove Link">
          <Link size={14} />
        </button>
      </div>

      {showLinkModal && (
        <div className="rt-modal-overlay">
          <div className="rt-modal">
            <div className="rt-modal-header">
              <span>Add Link</span>
              <button onClick={() => setShowLinkModal(false)}><X size={14} /></button>
            </div>
            <div className="rt-modal-body">
              {!linkData.text && (
                <div className="rt-input-group">
                  <label>Display Text</label>
                  <input 
                    type="text" 
                    value={linkData.text} 
                    onChange={(e) => setLinkData({ ...linkData, text: e.target.value })}
                    placeholder="Text to show..."
                    autoFocus
                  />
                </div>
              )}
              <div className="rt-input-group">
                <label>URL</label>
                <input 
                  type="text" 
                  value={linkData.url} 
                  onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                  placeholder="https://example.com"
                  autoFocus={!!linkData.text}
                  onKeyDown={(e) => e.key === 'Enter' && confirmLink()}
                />
              </div>
            </div>
            <div className="rt-modal-footer">
              <button className="btn-rt-cancel" onClick={() => setShowLinkModal(false)}>Cancel</button>
              <button className="btn-rt-confirm" onClick={confirmLink}>
                <Check size={14} /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        className="rich-text-content"
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
      />
    </div>
  );
}
