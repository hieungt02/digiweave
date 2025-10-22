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
  const itemClassName = `item-card ${isHovered ? 'hovered' : ''}`;

  return (
    // The main container is still draggable
    <div
      ref={drag}
      className={itemClassName}
      // 3. Add mouse enter/leave events to update the shared state
      onMouseEnter={() => setHoveredItemId(item.id)}
      onMouseLeave={() => setHoveredItemId(null)}
      style={{
        left: item.position_x,
        top: item.position_y,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {/* 2. Add a container for the controls */}
      <div className="card-controls">
        <button onClick={() => onEditItem(item)}>✏️</button>
        <button onClick={() => onDeleteItem(item.id)}>❌</button>
      </div>
      {/* 3. The content renderer is now inside its own div to handle padding */}
      <div style={{ padding: '8px' }}>
        <ContentRenderer item={item} />
      </div>
    </div>
  );
}

export default DraggableItem;