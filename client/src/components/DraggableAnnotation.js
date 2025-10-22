import React from 'react';
import { useDrag } from 'react-dnd';

export const ItemTypes = {
  ANNOTATION: 'annotation',
};

// The component now accepts onDeleteAnnotation and onEditAnnotation as props
function DraggableAnnotation({ annotation, onDeleteAnnotation, onEditAnnotation, hoveredItemId }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ANNOTATION,
    item: { id: annotation.id, left: annotation.position_x, top: annotation.position_y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // 2. Check if this annotation is linked to the hovered item
  const isLinked = hoveredItemId === annotation.item_id;
  const noteClassName = `annotation-note ${isLinked ? 'linked' : ''}`;

  return (
    <div
      ref={drag}
      className={noteClassName}
      style={{
        left: annotation.position_x,
        top: annotation.position_y,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {/* Container for the control buttons */}
      <div className="card-controls">
        <button onClick={() => onEditAnnotation(annotation)}>✏️</button>
        <button onClick={() => onDeleteAnnotation(annotation.id)}>❌</button>
      </div>
      <div style={{ paddingTop: '15px' }}> {/* Add padding to avoid overlap */}
        {annotation.content}
      </div>
    </div>
  );
}

export default DraggableAnnotation;