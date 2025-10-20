import React from 'react';
import { useDrag } from 'react-dnd';
import ContentRenderer from './ContentRenderer'; // 1. Import the new renderer

const ItemTypes = {
  ITEM: 'item',
};

function DraggableItem({ item }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ITEM,
    item: { id: item.id, left: item.position_x, top: item.position_y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: item.position_x,
        top: item.position_y,
        padding: '8px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        width: '250px', // Set a default width
      }}
    >
      {/* 2. Replace the plain text with our new smart renderer */}
      <ContentRenderer item={item} />
    </div>
  );
}

export default DraggableItem;