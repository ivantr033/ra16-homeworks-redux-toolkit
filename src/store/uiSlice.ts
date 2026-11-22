import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from './types';

function loadTheme(): ThemeMode {
    const saved = localStorage.getItem('app_theme');
    return saved === 'dark' ? 'dark' : 'light';
}

interface UIState {
    theme: ThemeMode;
    toastMessage: string | null;
}

const initialState: UIState = {
    theme: loadTheme(),
    toastMessage: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme(state) {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        showToast(state, action: PayloadAction<string>) {
            state.toastMessage = action.payload;
        },
        clearToast(state) {
            state.toastMessage = null;
        },
    },
});

export const { toggleTheme, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
