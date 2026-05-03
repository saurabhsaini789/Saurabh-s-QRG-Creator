import React, { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ImagePlus, X, Copy } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export default function StepItem({ step, index, updateStep, removeStep, duplicateStep }) {
  const fileInputRef = useRef(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateStep(step.id, { image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    let hasImage = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        hasImage = true;
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onloadend = () => {
          updateStep(step.id, { image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    }
    
    // If we found an image and handled it, prevent default to avoid
    // the browser also pasting it into the RichTextEditor if that's focused
    if (hasImage) {
      e.preventDefault();
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`step-card ${isDragging ? 'is-dragging' : ''}`}
      onPaste={handlePaste}
    >
      <div className="step-drag-handle" {...attributes} {...listeners}>
        <GripVertical size={20} />
      </div>
      
      <div className="step-content">
        <div className="step-header-row">
          <div className="step-number">{index + 1}</div>
          <input 
            type="text" 
            className="input-invisible step-title-input" 
            placeholder="Step title"
            value={step.title}
            onChange={(e) => updateStep(step.id, { title: e.target.value })}
          />
          <div className="step-actions">
            <button className="btn-icon" onClick={() => duplicateStep(step.id)} title="Duplicate Step">
              <Copy size={16} />
            </button>
            <button className="btn-icon danger" onClick={() => removeStep(step.id)} title="Delete Step">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <RichTextEditor 
          placeholder="Step description (optional)..."
          value={step.description}
          onChange={(val) => updateStep(step.id, { description: val })}
        />

        {step.image ? (
          <div className="image-preview-container">
            <img src={step.image} alt={`Step ${index + 1}`} className="image-preview" />
            <button className="image-remove-btn" onClick={() => updateStep(step.id, { image: null })}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <div 
            className="image-upload-area"
            onClick={() => fileInputRef.current.click()}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <ImagePlus size={24} />
              <span>Click to add image or paste from clipboard (Ctrl+V)</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
}
