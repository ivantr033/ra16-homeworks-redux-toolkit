import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MovieSearchResult } from './types';

function loadFavorites(): MovieSearchResult[] {
    try {
        const raw = localStorage.getItem('favorite_movies');
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

interface FavoritesState {
    items: MovieSearchResult[];
}

const initialState: FavoritesState = {
    items: loadFavorites(),
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        toggleFavorite(state, action: PayloadAction<MovieSearchResult>) {
            const index = state.items.findIndex((m) => m.imdbID === action.payload.imdbID);
            if (index >= 0) {
                state.items.splice(index, 1);
            } else {
                state.items.unshift(action.payload);
            }
        },
        removeFavorite(state, action: PayloadAction<string>) {
            state.items = state.items.filter((m) => m.imdbID !== action.payload);
        },
        clearFavorites(state) {
            state.items = [];
        },
    },
});

export const { toggleFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
