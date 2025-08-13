import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    isCheckingAuth: false,
    loading: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoading(state, action) { 
            state.loading = action.payload;
        },
        setUser(state, action) {
            state.user = action.payload;
        },
        setIsAuthenticated(state, action) {
            state.isAuthenticated = action.payload;
        },
        setIsCheckingAuth(state, action) {
            state.isCheckingAuth = action.payload;
        },
        resetUser: () => initialState,

    },
});

export const { setLoading, setUser, setIsAuthenticated, setIsCheckingAuth, resetUser } = userSlice.actions;

export default userSlice.reducer;