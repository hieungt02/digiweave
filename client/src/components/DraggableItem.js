import React from 'react';
import { useDrag } from 'react-dnd';
import ContentRenderer from './ContentRenderer';

const ItemTypes = {
  ITEM: 'item',
};

// 1. The component now accepts the new props: onDeleteItem and onEditItem
function DraggableItem({ item, onDeleteItem, onEditItem }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ITEM,
    item: { id: item.id, left: item.position_x, top: item.position_y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    // The main container is still draggable
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: item.position_x,
        top: item.position_y,
        border: '1px solid #ccc',
        backgroundColor: 'white',
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        width: '250px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // Added a subtle shadow
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