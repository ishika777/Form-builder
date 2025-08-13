import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDraggedItem, resetDragDrop } from '@/store/dragDropSlice';
import { Badge } from '@/components/ui/badge';
import { GripVertical } from 'lucide-react';

function DraggableBadge({ item, variant = 'card', className = '', children }) {
    const dispatch = useDispatch();
    const draggedItem = useSelector((state) => state.dragDrop.draggedItem);
    const dragging = draggedItem === item.id;

    const dragHandlers = {
        draggable: true,
        onDragStart: (e) => {
            e.dataTransfer.setData('text/plain', item.id);
            e.dataTransfer.effectAllowed = 'move';
            dispatch(setDraggedItem(item.id));
        },
        onDragEnd: () => dispatch(resetDragDrop()),
    };

    if (variant === 'badge') {
        return (
            <Badge
                {...dragHandlers}
                className={`
                    relative inline-flex items-center gap-1 px-3 py-1 text-xs font-medium cursor-grab
                    bg-blue-500 text-white
                    ${dragging ? 'opacity-70 scale-105' : 'hover:scale-105'}
                    rounded-md transition-transform duration-200
                    ${className}
                `}
            >
                <span className="select-none">{children || item.content}</span>
                <GripVertical className="h-3 w-3 opacity-50" />
            </Badge>
        );
    }

    return (
        <Card
            {...dragHandlers}
            className={`
                relative group cursor-grab select-none border-2 transition-all duration-300
                hover:border-blue-200 hover:shadow-md
                ${dragging ? 'opacity-60 scale-105 border-blue-300' : 'border-gray-200'}
                ${className}
            `}
        >
            <CardContent className="p-4">
                {children || (
                    <div className="flex justify-between items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{item.content}</span>
                        <GripVertical className="h-4 w-4 text-gray-400 opacity-40" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default DraggableBadge;
