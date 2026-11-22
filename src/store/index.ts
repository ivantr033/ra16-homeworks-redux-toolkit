import { configureStore, type Middleware } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';
import favoritesReducer from './favoritesSlice';
import uiReducer from './uiSlice';

// Custom middleware to sync favorites, search history, and theme with localStorage
const localStorageMiddleware: Middleware = (storeApi) => (next) => (action) => {
    const result = next(action);
    const state = storeApi.getState();

    try {
        localStorage.setItem('favorite_movies', JSON.stringify(state.favorites.items));
        localStorage.setItem('movie_search_history', JSON.stringify(state.movies.searchHistory));
        localStorage.setItem('app_theme', state.ui.theme);
    } catch (err) {
        console.warn('Failed to sync state with localStorage:', err);
    }

    return result;
};

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        favorites: favoritesReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
