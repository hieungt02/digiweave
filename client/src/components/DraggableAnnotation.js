import React from 'react';
import { useDrag } from 'react-dnd';

// We define a new constant for the annotation type.
// This is crucial for the drop zone to differentiate between items and annotations.
export const ItemTypes = {
  ANNOTATION: 'annotation',
};

function DraggableAnnotation({ annotation }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ANNOTATION,
    // Pass the annotation's data when it's dragged.
    item: { id: annotation.id, left: annotation.position_x, top: annotation.position_y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    // 'ref={drag}' connects our div to the react-dnd system.
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: annotation.position_x,
        top: annotation.position_y,
        padding: '8px',
        border: '1px dashed #999',
        backgroundColor: '#FFFFE0', // Light yellow for a "sticky note" feel
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {annotation.content}
    </div>
  );
}

export default DraggableAnnotation;