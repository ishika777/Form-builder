import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDragOverTarget, resetDragDrop } from '@/store/dragDropSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, CheckCircle2 } from 'lucide-react';

function DroppableCategoryBox({ 
  id, 
  title, 
  children, 
  variant = 'category', 
  color = 'bg-gray-50 border-gray-200',
  items = [],
  className = '',
  ...props 
}) {
  const dispatch = useDispatch();
  const dragOverTarget = useSelector(state => state.dragDrop.dragOverTarget);
  const draggedItem = useSelector(state => state.dragDrop.draggedItem);
  const isOver = dragOverTarget === id;
  const isDragging = !!draggedItem;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dispatch(setDragOverTarget(id));
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) dispatch(setDragOverTarget(null));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dispatch(resetDragDrop());
  };

  // Collection variant
  if (variant === 'collection') {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative min-h-[120px] rounded-xl border-2 transition-all duration-200
          ${isOver ? 'border-blue-400 bg-blue-100 shadow' : 'border-dashed border-blue-200 bg-white'}
          ${isDragging && !isOver ? 'bg-blue-50 border-blue-300' : ''}
          ${className}
        `}
        {...props}
      >
        {/* Drop overlay */}
        {isOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2 text-blue-600">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Drop item here</span>
          </div>
        )}

        {/* Content */}
        <div className={`${isOver ? 'opacity-20' : 'opacity-100'} transition-opacity duration-200`}>
          {children}
        </div>
      </div>
    );
  }

  // Category variant
  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative transition-all duration-200 group border-2 rounded-lg overflow-hidden
        ${isOver ? 'ring-2 ring-blue-300 bg-blue-50 shadow' : 'hover:shadow-md'}
        ${isDragging && !isOver ? 'border-dashed border-blue-300 bg-blue-50' : ''}
        ${color} ${className}
      `}
      {...props}
    >
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-3">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                ${isOver ? 'bg-blue-500 text-white scale-110' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}
              `}>
                {items.length > 0 ? <CheckCircle2 className="h-4 w-4" /> : <Target className="h-4 w-4" />}
              </div>
              <span className={`${isOver ? 'text-blue-900' : 'text-gray-900'} transition-colors duration-200`}>
                {title}
              </span>
            </div>
            <Badge className={`${isOver ? 'bg-blue-600 text-white scale-110' : ''} transition-all duration-200`}>
              {items.length}
            </Badge>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="relative min-h-[80px]">
        {/* Drop overlay */}
        {isOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none text-blue-700">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center animate-bounce">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Drop here</span>
          </div>
        )}

        {/* Content */}
        <div className={`${isOver ? 'opacity-30 blur-sm' : 'opacity-100'} transition-all duration-200`}>
          {children}
        </div>

        {/* Dragging animation */}
        {isDragging && !isOver && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-300 rounded-lg opacity-50 animate-pulse pointer-events-none" />
        )}
      </CardContent>
    </Card>
  );
}

export default DroppableCategoryBox;
