// dragDropSlice.js
import { createSlice } from '@reduxjs/toolkit';

const dragDropSlice = createSlice({
  name: 'dragDrop',
  initialState: {
    draggedItem: null,
    dragOverTarget: null,
  },
  reducers: {
    setDraggedItem: (state, action) => {
      state.draggedItem = action.payload;
    },
    setDragOverTarget: (state, action) => {
      state.dragOverTarget = action.payload;
    },
    resetDragDrop: (state) => {
      state.draggedItem = null;
      state.dragOverTarget = null;
    },
  },
});

export const { setDraggedItem, setDragOverTarget, resetDragDrop } = dragDropSlice.actions;
export default dragDropSlice.reducer;
