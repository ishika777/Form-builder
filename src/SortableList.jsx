import React from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// SortableItem wraps each child with drag logic & drag handle
function SortableItem({ id, children, dragHandle }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "default",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            {/* Drag handle with listeners */}
            <div {...listeners} style={{ cursor: "grab" }}>
                {dragHandle || "☰"}
            </div>
            {/* The rest of the item */}
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );
}

// Generic SortableList component
export default function SortableList({
    items,
    onOrderChange,
    renderItem,
    strategy = verticalListSortingStrategy,
    dragHandle = null,
}) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newItems = arrayMove(items, oldIndex, newIndex);
        onOrderChange(newItems);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items.map((item) => item.id)} strategy={strategy}>
                {items.map((item, index) => (
                    <SortableItem key={item.id} id={item.id} dragHandle={dragHandle}>
                        {renderItem(item, index)}
                    </SortableItem>
                ))}
            </SortableContext>

        </DndContext>
    );
}
