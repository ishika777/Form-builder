import { useDispatch, useSelector } from 'react-redux';
import { setDraggedItem, setDragOverTarget, resetDragDrop } from '@/store/dragDropSlice';

export function useDragDropRedux() {
    const dispatch = useDispatch();
    const {draggedItem, dragOverTarget} = useSelector(state => state.dragDrop);

    const createDragHandlers = (itemId) => ({
        draggable: true,
        onDragStart: (e) => {
            e.dataTransfer.setData('text/plain', itemId);
            e.dataTransfer.effectAllowed = 'move';
            dispatch(setDraggedItem(itemId));
        },
        onDragEnd: () => {
            dispatch(resetDragDrop());
        },
    });

    const createDropHandlers = (targetId) => ({
        onDragOver: (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            dispatch(setDragOverTarget(targetId));
        },
        onDragLeave: (e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
                dispatch(setDragOverTarget(null));
            }
        },
        onDrop: (e) => {
            e.preventDefault();
            dispatch(resetDragDrop());
        },
    });

    const isDragging = (itemId) => draggedItem === itemId;
    const isOver = (targetId) => dragOverTarget === targetId;

    return {
        createDragHandlers,
        createDropHandlers,
        isDragging,
        isOver,
    };
}
