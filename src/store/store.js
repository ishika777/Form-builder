import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import formReducer from './formSlice';
import dragDropReducer from './dragDropSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        form: formReducer,
        dragDrop: dragDropReducer,
    },
});
