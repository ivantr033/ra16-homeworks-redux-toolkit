import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearFavorites } from '../store/favoritesSlice';
import { showToast } from '../store/uiSlice';
import { MovieCard } from '../components/MovieCard';
import type { RootState } from '../store';

export function FavoritesPage() {
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.favorites.items);

    const handleClearAll = () => {
        dispatch(clearFavorites());
        dispatch(showToast('Список избранного очищен'));
    };

    return (
        <div className="page-container">
            <div className="favorites-header">
                <h1>Избранные фильмы ({favorites.length})</h1>
                {favorites.length > 0 && (
                    <button type="button" className="btn-clear-fav" onClick={handleClearAll}>
                        Очистить всё
                    </button>
                )}
            </div>

            {favorites.length === 0 ? (
                <div className="empty-state">
                    <p>У вас пока нет избранных фильмов.</p>
                    <Link to="/" className="btn-primary">
                        Перейти к поиску
                    </Link>
                </div>
            ) : (
                <div className="movies-grid">
                    {favorites.map((movie) => (
                        <MovieCard key={movie.imdbID} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}
