import { useDragDropRedux } from '@/components/category-fill/useDragDropRedux';
import React from 'react'

const BlankDropZone = ({
    blankId,
    filledWord,
    onDrop,
    isCorrect,
    showFeedback,
    className = ''
}) => {
    const { createDropHandlers, isOver } = useDragDropRedux();

    const dropHandlers = {
        ...createDropHandlers(blankId),
        onDrop: (e) => {
            createDropHandlers(blankId).onDrop(e);
            const draggedItemId = e.dataTransfer.getData('text/plain');
            onDrop(blankId, draggedItemId);
        }
    };

    const getBlankStyles = () => {
        let baseStyles = `
      inline-block min-w-20 h-8 mx-1 px-2 py-1 
      border-2 border-dashed border-gray-400 rounded-lg
      transition-all duration-300 text-center text-sm
      ${className}
    `;

        if (isOver(blankId)) {
            baseStyles += ' border-blue-500 bg-blue-50 scale-105';
        }

        if (filledWord) {
            if (showFeedback) {
                baseStyles += isCorrect
                    ? ' border-green-500 bg-green-50 text-green-700'
                    : ' border-red-500 bg-red-50 text-red-700';
            } else {
                baseStyles += ' border-purple-500 bg-purple-50 text-purple-700';
            }
        }

        return baseStyles;
    };

    return (
        <span
            {...dropHandlers}
            className={getBlankStyles()}
        >
            {filledWord || '____'}
            {showFeedback && filledWord && (
                <span className="ml-1">
                    {isCorrect ? '✓' : '✗'}
                </span>
            )}
        </span>
    );
};

export default BlankDropZone