import React, { useState, useEffect } from 'react';
import { useDragDropRedux } from './useDragDropRedux';
import DraggableBadge from './DraggableBadge';
import DroppableCategoryBox from './DroppableCategoryBox';
import { Package, Target } from 'lucide-react';

export default function CategoryQuestion({ question, answers, onAnswerChange }) {
    const categoryList = question.categories;
    const formItems = question.items;

    const categoryColors = [
        'bg-emerald-50 border-emerald-200',
        'bg-amber-50 border-amber-200',
        'bg-sky-50 border-sky-200',
        'bg-violet-50 border-violet-200',
        'bg-rose-50 border-rose-200',
        'bg-teal-50 border-teal-200',
    ];

    const categories = categoryList.map((cat, i) => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        color: categoryColors[i % categoryColors.length] || 'bg-gray-50 border-gray-200',
    }));

    const initialItems = formItems.map((item, index) => ({
        id: `item-${index + 1}`,
        content: item.name,
        category: answers?.[item.name] || null,
    }));

    const [localItems, setLocalItems] = useState(initialItems);

    useEffect(() => {
        const updatedItems = formItems.map((item, index) => ({
            id: `item-${index + 1}`,
            content: item.name,
            category: answers?.[item.name] || null,
        }));
        setLocalItems(updatedItems);
    }, [answers, formItems]);

    const { createDragHandlers, createDropHandlers, isDragging } = useDragDropRedux();

    const handleDrop = (itemId, targetId) => {
        if (!itemId) return;

        const updatedItems = localItems.map(item =>
            item.id === itemId
                ? { ...item, category: targetId === 'available' ? null : targetId }
                : item
        );

        setLocalItems(updatedItems);

        const newAnswers = updatedItems.reduce((acc, item) => {
            acc[item.content] = item.category;
            return acc;
        }, {});

        onAnswerChange(newAnswers);
    };

    const getDropHandlers = (targetId) => {
        const handlers = createDropHandlers(targetId);
        return {
            ...handlers,
            onDrop: (e) => {
                handlers.onDrop(e);
                const draggedId = e.dataTransfer.getData('text/plain');
                handleDrop(draggedId, targetId);
            },
        };
    };

    const unassignedItems = localItems.filter(item => !item.category);

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">{question.text}</h3>
                <p className="text-sm text-gray-600">
                    Drag items from the collection below into their categories
                </p>

                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                            className="h-2 bg-blue-500 rounded-full transition-all"
                            style={{ width: `${(localItems.filter(i => i.category).length / localItems.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-sm text-gray-700">
                        {localItems.filter(i => i.category).length}/{localItems.length}
                    </span>
                </div>
            </div>

            {/* Question Image */}
            {question.picture && (
                <div className="border rounded-md overflow-hidden">
                    <img
                        src={question.picture}
                        alt="Reference"
                        className="w-full max-h-60 object-contain"
                    />
                </div>
            )}

            {/* Available Items Collection */}
            <div className="border border-dashed border-blue-300 rounded-md p-4 bg-blue-50/30">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">Items Collection</h4>
                    <span className="text-sm text-gray-700">{unassignedItems.length} remaining</span>
                </div>
                <DroppableCategoryBox
                    id="available"
                    variant="collection"
                    items={unassignedItems}
                    {...getDropHandlers('available')}
                    className="min-h-[120px]"
                >
                    {unassignedItems.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {unassignedItems.map(item => (
                                <DraggableBadge
                                    key={item.id}
                                    item={item}
                                    variant="badge"
                                    {...createDragHandlers(item.id)}
                                    isDragging={isDragging(item.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-20 text-gray-500">
                            <p className="text-sm">All items categorized</p>
                        </div>
                    )}
                </DroppableCategoryBox>
            </div>

            {/* Categories Grid */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Categories</h4>
                    <span className="text-sm text-gray-700">{categories.length} categories</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(category => {
                        const categoryItems = localItems.filter(item => item.category === category.id);
                        return (
                            <div
                                key={category.id}
                                className={`border rounded-md p-3 ${category.color}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{category.name}</span>
                                    <span className="text-sm text-gray-700">{categoryItems.length}</span>
                                </div>
                                <DroppableCategoryBox
                                    id={category.id}
                                    items={categoryItems}
                                    {...getDropHandlers(category.id)}
                                    className="min-h-[80px]"
                                >
                                    {categoryItems.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {categoryItems.map(item => (
                                                <DraggableBadge
                                                    key={item.id}
                                                    item={item}
                                                    variant="badge" // <-- always badge
                                                    {...createDragHandlers(item.id)}
                                                    isDragging={isDragging(item.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-16 text-gray-400">
                                            <p className="text-xs">Drop items here</p>
                                        </div>
                                    )}
                                </DroppableCategoryBox>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
