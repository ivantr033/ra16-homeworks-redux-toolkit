import { type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/favoritesSlice';
import { showToast } from '../store/uiSlice';
import { selectFavoriteIdsSet } from '../store/selectors';
import type { MovieSearchResult } from '../store/types';

interface MovieCardProps {
    movie: MovieSearchResult;
}

const FALLBACK_POSTER = 'https://placehold.co/400x600?text=No%20image';

const TYPE_LABELS: Record<string, string> = {
    movie: 'Фильм',
    series: 'Сериал',
    episode: 'Эпизод',
};

export function MovieCard({ movie }: MovieCardProps) {
    const dispatch = useDispatch();
    const favoriteIds = useSelector(selectFavoriteIdsSet);
    const isFavorite = favoriteIds.has(movie.imdbID);

    const posterSrc =
        movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER;

    const handleToggleFavorite = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleFavorite(movie));
        dispatch(
            showToast(
                isFavorite
                    ? `Удалено из избранного: «${movie.Title}»`
                    : `Добавлено в избранное: «${movie.Title}»`
            )
        );
    };

    const handleShare = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const shareUrl = `${window.location.origin}${window.location.pathname}#/movie/${movie.imdbID}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            dispatch(showToast('Ссылка на фильм скопирована в буфер обмена'));
        } catch {
            dispatch(showToast('Не удалось скопировать ссылку'));
        }
    };

    return (
        <Link to={`/movie/${movie.imdbID}`} className="movie-card">
            <div className="poster-wrapper">
                <img
                    src={posterSrc}
                    alt={movie.Title}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_POSTER;
                    }}
                />
                <span className="type-badge">{TYPE_LABELS[movie.Type] || movie.Type}</span>

                <div className="card-overlay-actions">
                    <button
                        type="button"
                        className={`card-icon-btn ${isFavorite ? 'is-fav' : ''}`}
                        title={isFavorite ? 'Убрать из избранного' : 'В избранное'}
                        onClick={handleToggleFavorite}
                    >
                        {isFavorite ? '♥' : '♡'}
                    </button>
                    <button
                        type="button"
                        className="card-icon-btn"
                        title="Поделиться ссылкой"
                        onClick={handleShare}
                    >
                        🔗
                    </button>
                </div>
            </div>

            <div className="card-body">
                <h3 className="movie-title" title={movie.Title}>
                    {movie.Title}
                </h3>
                <div className="movie-meta">
                    <span className="movie-year">{movie.Year}</span>
                    <span className="movie-id">IMDb: {movie.imdbID}</span>
                </div>
            </div>
        </Link>
    );
}
