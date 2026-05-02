import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);

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
      </div>
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
