import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails } from '../store/moviesSlice';
import { toggleFavorite } from '../store/favoritesSlice';
import { showToast } from '../store/uiSlice';
import { selectFavoriteIdsSet } from '../store/selectors';
import { ErrorAlert } from '../components/ErrorAlert';
import type { RootState, AppDispatch } from '../store';

const FALLBACK_POSTER = 'https://placehold.co/400x600?text=No%20image';

export function MovieDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { selectedMovie, detailsLoading, detailsError } = useSelector(
        (state: RootState) => state.movies
    );
    const favoriteIds = useSelector(selectFavoriteIdsSet);

    useEffect(() => {
        if (id) {
            dispatch(fetchMovieDetails(id));
        }
    }, [id, dispatch]);

    if (detailsLoading) {
        return (
            <div className="page-container">
                <div className="loader-box">
                    <div className="spinner-large" />
                    <p>Загрузка информации о фильме...</p>
                </div>
            </div>
        );
    }

    if (detailsError) {
        return (
            <div className="page-container">
                <button type="button" className="btn-back" onClick={() => navigate(-1)}>
                    ← Назад
                </button>
                <ErrorAlert
                    message={detailsError}
                    onRetry={() => id && dispatch(fetchMovieDetails(id))}
                />
            </div>
        );
    }

    if (!selectedMovie) return null;

    const isFavorite = favoriteIds.has(selectedMovie.imdbID);
    const posterSrc =
        selectedMovie.Poster && selectedMovie.Poster !== 'N/A'
            ? selectedMovie.Poster
            : FALLBACK_POSTER;

    const handleFavoriteClick = () => {
        dispatch(
            toggleFavorite({
                imdbID: selectedMovie.imdbID,
                Title: selectedMovie.Title,
                Year: selectedMovie.Year,
                Type: selectedMovie.Type,
                Poster: selectedMovie.Poster,
            })
        );
        dispatch(
            showToast(
                isFavorite
                    ? `Удалено из избранного: «${selectedMovie.Title}»`
                    : `Добавлено в избранное: «${selectedMovie.Title}»`
            )
        );
    };

    const handleShareClick = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            dispatch(showToast('Ссылка на страницу фильма скопирована'));
        } catch {
            dispatch(showToast('Не удалось скопировать ссылку'));
        }
    };

    return (
        <div className="page-container">
            <button type="button" className="btn-back" onClick={() => navigate(-1)}>
                ← Назад к результатам
            </button>

            <article className="details-card">
                <div className="details-poster">
                    <img
                        src={posterSrc}
                        alt={selectedMovie.Title}
                        onError={(e) => {
                            e.currentTarget.src = FALLBACK_POSTER;
                        }}
                    />
                </div>

                <div className="details-info">
                    <div className="details-header">
                        <h1>
                            {selectedMovie.Title} <span>({selectedMovie.Year})</span>
                        </h1>
                        {selectedMovie.imdbRating && selectedMovie.imdbRating !== 'N/A' && (
                            <div className="imdb-badge">★ IMDb {selectedMovie.imdbRating}</div>
                        )}
                    </div>

                    <div className="details-actions">
                        <button
                            type="button"
                            className={`btn-fav-large ${isFavorite ? 'active' : ''}`}
                            onClick={handleFavoriteClick}
                        >
                            {isFavorite ? '♥ В избранном' : '♡ Добавить в избранное'}
                        </button>
                        <button type="button" className="btn-share-large" onClick={handleShareClick}>
                            🔗 Поделиться
                        </button>
                    </div>

                    <dl className="details-specs">
                        <div className="spec-row">
                            <dt>Жанр:</dt>
                            <dd>{selectedMovie.Genre}</dd>
                        </div>
                        <div className="spec-row">
                            <dt>Продолжительность:</dt>
                            <dd>{selectedMovie.Runtime}</dd>
                        </div>
                        <div className="spec-row">
                            <dt>Режиссёр:</dt>
                            <dd>{selectedMovie.Director}</dd>
                        </div>
                        <div className="spec-row">
                            <dt>Актёры:</dt>
                            <dd>{selectedMovie.Actors}</dd>
                        </div>
                        <div className="spec-row">
                            <dt>Награды:</dt>
                            <dd>{selectedMovie.Awards}</dd>
                        </div>
                    </dl>

                    <div className="details-plot">
                        <h3>Сюжет</h3>
                        <p>{selectedMovie.Plot}</p>
                    </div>
                </div>
            </article>
        </div>
    );
}
