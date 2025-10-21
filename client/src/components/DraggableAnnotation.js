import React from 'react';
import { useDrag } from 'react-dnd';

export const ItemTypes = {
  ANNOTATION: 'annotation',
};

// The component now accepts onDeleteAnnotation and onEditAnnotation as props
function DraggableAnnotation({ annotation, onDeleteAnnotation, onEditAnnotation }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ANNOTATION,
    item: { id: annotation.id, left: annotation.position_x, top: annotation.position_y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: annotation.position_x,
        top: annotation.position_y,
        border: '1px dashed #999',
        backgroundColor: '#FFFFE0',
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}
    >
      {/* Container for the control buttons */}
      <div style={{ position: 'absolute', top: 2, right: 2, zIndex: 10 }}>
        <button
          onClick={() => onEditAnnotation(annotation)}
          style={{ fontSize: '10px', padding: '2px 4px', marginRight: '2px' }}
        >
          ✏️
        </button>
        <button
          onClick={() => onDeleteAnnotation(annotation.id)}
          style={{ fontSize: '10px', padding: '2px 4px' }}
        >
          ❌
        </button>
      </div>
      <div style={{ paddingTop: '15px' }}> {/* Add padding to avoid overlap */}
        {annotation.content}
      </div>
    </div>
  );
}

export default DraggableAnnotation;