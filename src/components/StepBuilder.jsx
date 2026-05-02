import React from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import StepItem from './StepItem';

export default function StepBuilder({ steps, setSteps }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const {active, over} = event;

    if (active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addStep = () => {
    const newStep = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      image: null
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id, updates) => {
    setSteps(steps.map(step => step.id === id ? { ...step, ...updates } : step));
  };

  const removeStep = (id) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const duplicateStep = (id) => {
    const stepToDuplicate = steps.find(step => step.id === id);
    if (stepToDuplicate) {
      const duplicatedStep = {
        ...stepToDuplicate,
        id: crypto.randomUUID()
      };
      const index = steps.findIndex(step => step.id === id);
      const newSteps = [...steps];
      newSteps.splice(index + 1, 0, duplicatedStep);
      setSteps(newSteps);
    }
  };

  return (
    <div className="panel panel-editor">
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="panel-title" style={{ marginBottom: 0 }}>Steps</h2>
        <button className="btn btn-outline" onClick={addStep} style={{ padding: '4px 12px' }}>
          <Plus size={16} /> Add Step
        </button>
      </div>
      
      <div className="scroll-area">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={steps}
            strategy={verticalListSortingStrategy}
          >
            {steps.map((step, index) => (
              <StepItem 
                key={step.id} 
                step={step} 
                index={index}
                updateStep={updateStep}
                removeStep={removeStep}
                duplicateStep={duplicateStep}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
