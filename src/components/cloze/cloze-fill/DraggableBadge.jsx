import { useDragDropRedux } from '@/components/category-fill/useDragDropRedux';
import React from 'react'

const DraggableBadge = ({ item, isUsed, onDragStart, className = '' }) => {
    const { createDragHandlers, isDragging } = useDragDropRedux();
    const dragging = isDragging(item.id);

    const dragHandlers = {
        ...createDragHandlers(item.id),
        onDragStart: (e) => {
            createDragHandlers(item.id).onDragStart(e);
            onDragStart?.(item);
        }
    };

    return (
        <div
            {...dragHandlers}
            className={`
        inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
        px-4 py-2 rounded-full text-sm font-medium cursor-grab
        hover:from-indigo-600 hover:to-purple-700 transition-all duration-200
        active:cursor-grabbing shadow-md hover:shadow-lg transform
        ${dragging ? 'opacity-50 rotate-3 scale-110' : 'opacity-100'}
        ${isUsed ? 'opacity-40 grayscale cursor-not-allowed' : ''}
        ${className}
      `}
        >
            {item.content}
        </div>
    );
};

export default DraggableBadge