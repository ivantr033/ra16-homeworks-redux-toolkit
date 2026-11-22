import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

export const selectSortedSearchResults = createSelector(
    [(state: RootState) => state.movies.searchResults, (state: RootState) => state.movies.sortBy],
    (results, sortBy) => {
        if (sortBy === 'default') return results;

        return [...results].sort((a, b) => {
            const yearA = parseInt(a.Year, 10) || 0;
            const yearB = parseInt(b.Year, 10) || 0;

            switch (sortBy) {
                case 'year-desc':
                    return yearB - yearA;
                case 'year-asc':
                    return yearA - yearB;
                case 'title-asc':
                    return a.Title.localeCompare(b.Title);
                default:
                    return 0;
            }
        });
    }
);

export const selectFavoriteIdsSet = createSelector(
    [(state: RootState) => state.favorites.items],
    (items) => new Set(items.map((item) => item.imdbID))
);
