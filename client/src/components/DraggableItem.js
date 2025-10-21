import React from 'react';
import { useDrag } from 'react-dnd';
import ContentRenderer from './ContentRenderer';

const ItemTypes = {
  ITEM: 'item',
};

// 1. Component now accepts hoveredItemId and setHoveredItemId
function DraggableItem({ item, onDeleteItem, onEditItem, hoveredItemId, setHoveredItemId }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ITEM,
    item: { id: item.id, left: item.position_x, top: item.position_y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const isHovered = hoveredItemId === item.id;

  return (
    // The main container is still draggable
    <div
      ref={drag}
      // 3. Add mouse enter/leave events to update the shared state
      onMouseEnter={() => setHoveredItemId(item.id)}
      onMouseLeave={() => setHoveredItemId(null)}
      style={{
        position: 'absolute',
        left: item.position_x,
        top: item.position_y,
        // 4. Change the border style based on the hover state
        border: isHovered ? '2px solid #007bff' : '1px solid #ccc',
        backgroundColor: 'white',
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        width: '250px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        zIndex: isHovered ? 100 : 10, // Bring hovered item to the front
      }}
    >
      {/* 2. Add a container for the controls */}
      <div style={{ position: 'absolute', top: 2, right: 2, zIndex: 10 }}>
        <button
          onClick={() => onEditItem(item)}
          style={{ fontSize: '10px', padding: '2px 4px', marginRight: '2px' }}
        >
          ✏️
        </button>
        <button
          onClick={() => onDeleteItem(item.id)}
          style={{ fontSize: '10px', padding: '2px 4px' }}
        >
          ❌
        </button>
      </div>

      {/* 3. The content renderer is now inside its own div to handle padding */}
      <div style={{ padding: '8px' }}>
        <ContentRenderer item={item} />
      </div>
    </div>
  );
}

export default DraggableItem;