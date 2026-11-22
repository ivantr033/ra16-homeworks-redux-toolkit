interface MovieSkeletonProps {
    count?: number;
}

export function MovieSkeleton({ count = 8 }: MovieSkeletonProps) {
    return (
        <div className="movies-grid" aria-busy="true" aria-label="Загрузка фильмов">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="movie-card skeleton-card">
                    <div className="skeleton-poster pulse" />
                    <div className="card-body">
                        <div className="skeleton-line title pulse" />
                        <div className="skeleton-line meta pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
}
