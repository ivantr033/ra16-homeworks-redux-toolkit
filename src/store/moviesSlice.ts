import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
    MovieSearchResult,
    MovieDetails,
    SearchResponse,
    MovieTypeFilter,
    SortOption,
} from './types';

// OMDb API key (provided in homework specification)
// TODO: Declare these variables in the environment variables file (.env)
const API_KEY = '64405bd2';
const BASE_URL = 'https://omdbapi.com';
const CACHE_STORAGE_KEY = 'omdb_offline_cache_v1';

interface CacheData {
    searches: Record<string, { items: MovieSearchResult[]; totalResults: number }>;
    details: Record<string, MovieDetails>;
}

function loadCache(): CacheData {
    try {
        const raw = localStorage.getItem(CACHE_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (err) {
        console.warn('Failed to read offline cache:', err);
    }
    return { searches: {}, details: {} };
}

function saveCache(cache: CacheData) {
    try {
        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
    } catch (err) {
        console.warn('Failed to persist offline cache:', err);
    }
}

interface SearchParams {
    query: string;
    page?: number;
    type?: MovieTypeFilter;
}

export const searchMovies = createAsyncThunk<
    { items: MovieSearchResult[]; totalResults: number; query: string; page: number; type: MovieTypeFilter },
    SearchParams,
    { rejectValue: string }
>('movies/searchMovies', async ({ query, page = 1, type = '' }, { rejectWithValue }) => {
    const trimmed = query.trim();
    if (!trimmed) {
        return { items: [], totalResults: 0, query: '', page: 1, type };
    }

    const cacheKey = `${trimmed.toLowerCase()}|${page}|${type}`;
    const cache = loadCache();

    try {
        const url = new URL(BASE_URL);
        url.searchParams.set('apikey', API_KEY);
        url.searchParams.set('s', trimmed);
        url.searchParams.set('page', String(page));
        if (type) url.searchParams.set('type', type);

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data: SearchResponse = await response.json();

        if (data.Response === 'False') {
            // Translate standard OMDb messages to Russian for UI
            if (data.Error === 'Movie not found!') {
                return rejectWithValue('Фильмы не найдены');
            }
            if (data.Error === 'Too many results.') {
                return rejectWithValue('Слишком много результатов. Уточните запрос');
            }
            return rejectWithValue(data.Error || 'Ошибка при получении данных от API');
        }

        const items = data.Search || [];
        const totalResults = Number(data.totalResults) || items.length;

        // Update offline cache
        cache.searches[cacheKey] = { items, totalResults };
        saveCache(cache);

        return { items, totalResults, query: trimmed, page, type };
    } catch (error) {
        // Fallback to offline cache if network fails
        if (cache.searches[cacheKey]) {
            return {
                ...cache.searches[cacheKey],
                query: trimmed,
                page,
                type,
            };
        }
        console.error('Search request failed:', error);
        return rejectWithValue('Ошибка сети. Проверьте подключение к интернету');
    }
});

export const fetchMovieDetails = createAsyncThunk<
    MovieDetails,
    string,
    { rejectValue: string }
>('movies/fetchMovieDetails', async (imdbID, { rejectWithValue }) => {
    const cache = loadCache();

    try {
        const url = new URL(BASE_URL);
        url.searchParams.set('apikey', API_KEY);
        url.searchParams.set('i', imdbID);
        url.searchParams.set('plot', 'full');

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data: MovieDetails = await response.json();
        if (data.Response === 'False') {
            return rejectWithValue(data.Error || 'Информация о фильме не найдена');
        }

        cache.details[imdbID] = data;
        saveCache(cache);
        return data;
    } catch (error) {
        if (cache.details[imdbID]) {
            return cache.details[imdbID];
        }
        console.error('Movie details request failed:', error);
        return rejectWithValue('Не удалось загрузить информацию о фильме. Проверьте сеть');
    }
});

interface MoviesState {
    searchResults: MovieSearchResult[];
    totalResults: number;
    currentPage: number;
    searchQuery: string;
    typeFilter: MovieTypeFilter;
    sortBy: SortOption;
    loading: boolean;
    error: string | null;
    selectedMovie: MovieDetails | null;
    detailsLoading: boolean;
    detailsError: string | null;
    searchHistory: string[];
}

function loadHistory(): string[] {
    try {
        const raw = localStorage.getItem('movie_search_history');
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

const initialState: MoviesState = {
    searchResults: [],
    totalResults: 0,
    currentPage: 1,
    searchQuery: '',
    typeFilter: '',
    sortBy: 'default',
    loading: false,
    error: null,
    selectedMovie: null,
    detailsLoading: false,
    detailsError: null,
    searchHistory: loadHistory(),
};

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
        setTypeFilter(state, action: PayloadAction<MovieTypeFilter>) {
            state.typeFilter = action.payload;
            state.currentPage = 1;
        },
        setSortBy(state, action: PayloadAction<SortOption>) {
            state.sortBy = action.payload;
        },
        clearSearch(state) {
            state.searchQuery = '';
            state.searchResults = [];
            state.totalResults = 0;
            state.currentPage = 1;
            state.error = null;
        },
        removeHistoryItem(state, action: PayloadAction<string>) {
            state.searchHistory = state.searchHistory.filter((q) => q !== action.payload);
        },
        clearHistory(state) {
            state.searchHistory = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload.items;
                state.totalResults = action.payload.totalResults;
                state.currentPage = action.payload.page;
                state.searchQuery = action.payload.query;
                state.typeFilter = action.payload.type;

                // Save unique query to search history (max 8 items)
                if (action.payload.query) {
                    const filtered = state.searchHistory.filter(
                        (item) => item.toLowerCase() !== action.payload.query.toLowerCase()
                    );
                    state.searchHistory = [action.payload.query, ...filtered].slice(0, 8);
                }
            })
            .addCase(searchMovies.rejected, (state, action) => {
                state.loading = false;
                state.searchResults = [];
                state.totalResults = 0;
                state.error = action.payload || 'Произошла ошибка при поиске';
            })
            .addCase(fetchMovieDetails.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
            })
            .addCase(fetchMovieDetails.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.selectedMovie = action.payload;
            })
            .addCase(fetchMovieDetails.rejected, (state, action) => {
                state.detailsLoading = false;
                state.detailsError = action.payload || 'Ошибка загрузки деталей фильма';
            });
    },
});

export const {
    setSearchQuery,
    setTypeFilter,
    setSortBy,
    clearSearch,
    removeHistoryItem,
    clearHistory,
} = moviesSlice.actions;

export default moviesSlice.reducer;
