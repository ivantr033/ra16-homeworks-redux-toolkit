import { useState, useEffect, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    searchMovies,
    setSearchQuery,
    setTypeFilter,
    setSortBy,
    clearSearch,
    removeHistoryItem,
    clearHistory,
} from '../store/moviesSlice';
import { selectSortedSearchResults } from '../store/selectors';
import { MovieCard } from '../components/MovieCard';
import { MovieSkeleton } from '../components/MovieSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';
import type { RootState, AppDispatch } from '../store';
import type { MovieTypeFilter, SortOption } from '../store/types';

export function SearchPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        searchQuery,
        totalResults,
        currentPage,
        typeFilter,
        sortBy,
        loading,
        error,
        searchHistory,
    } = useSelector((state: RootState) => state.movies);

    const sortedMovies = useSelector(selectSortedSearchResults);
    const [inputText, setInputText] = useState(searchQuery);

    // Debounced search (500ms) when user types
    useEffect(() => {
        const trimmed = inputText.trim();
        if (trimmed === searchQuery) return;

        const timer = setTimeout(() => {
            if (trimmed.length >= 2) {
                dispatch(searchMovies({ query: trimmed, page: 1, type: typeFilter }));
            } else if (trimmed.length === 0) {
                dispatch(clearSearch());
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [inputText, searchQuery, typeFilter, dispatch]);

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = inputText.trim();
        if (!trimmed) return;
        dispatch(setSearchQuery(trimmed));
        dispatch(searchMovies({ query: trimmed, page: 1, type: typeFilter }));
    };

    const handleTypeChange = (newType: MovieTypeFilter) => {
        dispatch(setTypeFilter(newType));
        if (inputText.trim()) {
            dispatch(searchMovies({ query: inputText.trim(), page: 1, type: newType }));
        }
    };

    const handlePageChange = (newPage: number) => {
        if (!searchQuery) return;
        dispatch(searchMovies({ query: searchQuery, page: newPage, type: typeFilter }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleHistorySelect = (query: string) => {
        setInputText(query);
        dispatch(searchMovies({ query, page: 1, type: typeFilter }));
    };

    const totalPages = Math.ceil(totalResults / 10);

    return (
        <div className="page-container">
            <section className="search-hero">
                <h1>Поиск фильмов и сериалов</h1>
                <form onSubmit={handleFormSubmit} className="search-form">
                    <div className="search-input-group">
                        <input
                            type="text"
                            placeholder="Введите название фильма (например: Batman, Matrix, Dune)..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        {inputText && (
                            <button
                                type="button"
                                className="clear-search-btn"
                                title="Очистить"
                                onClick={() => {
                                    setInputText('');
                                    dispatch(clearSearch());
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner-inline" /> : 'Найти'}
                    </button>
                </form>

                {/* Search History Chips */}
                {searchHistory.length > 0 && (
                    <div className="history-bar">
                        <span className="history-label">История:</span>
                        <div className="history-chips">
                            {searchHistory.map((item) => (
                                <span key={item} className="history-chip">
                                    <button
                                        type="button"
                                        className="history-query-btn"
                                        onClick={() => handleHistorySelect(item)}
                                    >
                                        {item}
                                    </button>
                                    <button
                                        type="button"
                                        className="history-del-btn"
                                        title="Удалить из истории"
                                        onClick={() => dispatch(removeHistoryItem(item))}
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                            <button
                                type="button"
                                className="history-clear-all"
                                onClick={() => dispatch(clearHistory())}
                            >
                                Очистить историю
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Filter & Sort Controls */}
            <div className="controls-bar">
                <div className="filter-group">
                    <label htmlFor="type-select">Тип:</label>
                    <select
                        id="type-select"
                        value={typeFilter}
                        onChange={(e) => handleTypeChange(e.target.value as MovieTypeFilter)}
                    >
                        <option value="">Все типы</option>
                        <option value="movie">Фильмы</option>
                        <option value="series">Сериалы</option>
                        <option value="episode">Эпизоды</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="sort-select">Сортировка:</label>
                    <select
                        id="sort-select"
                        value={sortBy}
                        onChange={(e) => dispatch(setSortBy(e.target.value as SortOption))}
                    >
                        <option value="default">По релевантности</option>
                        <option value="year-desc">Год: сначала новые</option>
                        <option value="year-asc">Год: сначала старые</option>
                        <option value="title-asc">По названию (A–Z)</option>
                    </select>
                </div>

                {totalResults > 0 && (
                    <span className="results-counter">
                        Найдено результатов: <strong>{totalResults}</strong>
                    </span>
                )}
            </div>

            {/* Loading, Error, Empty, or Results Grid */}
            {loading && <MovieSkeleton count={8} />}

            {!loading && error && (
                <ErrorAlert
                    message={error}
                    onRetry={() =>
                        searchQuery &&
                        dispatch(searchMovies({ query: searchQuery, page: currentPage, type: typeFilter }))
                    }
                />
            )}

            {!loading && !error && sortedMovies.length === 0 && !searchQuery && (
                <div className="empty-state">
                    <p>Введите название фильма на английском языке, чтобы начать поиск.</p>
                </div>
            )}

            {!loading && !error && sortedMovies.length > 0 && (
                <>
                    <div className="movies-grid">
                        {sortedMovies.map((movie) => (
                            <MovieCard key={movie.imdbID} movie={movie} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                type="button"
                                className="page-btn"
                                disabled={currentPage <= 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                ← Назад
                            </button>
                            <span className="page-info">
                                Страница <strong>{currentPage}</strong> из <strong>{totalPages}</strong>
                            </span>
                            <button
                                type="button"
                                className="page-btn"
                                disabled={currentPage >= totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Вперёд →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
