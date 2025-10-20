import React from 'react';
import { useDrag } from 'react-dnd';

// We define a constant for the item type.
const ItemTypes = {
  ITEM: 'item',
};

function DraggableItem({ item }) {
  // The useDrag hook is the magic here.
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ITEM,
    // 'item' is a function that returns the data about the dragged item.
    item: { id: item.id, left: item.position_x, top: item.position_y },
    // 'collect' monitors the drag state. Here, we check if the item is currently being dragged.
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    // The 'ref={drag}' part is what connects our component to the drag system.
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
        // Make the item semi-transparent while it's being dragged.
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {item.content}
    </div>
  );
}

export default DraggableItem;
