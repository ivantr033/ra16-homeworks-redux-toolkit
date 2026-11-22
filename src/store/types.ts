export interface MovieSearchResult {
    imdbID: string;
    Title: string;
    Year: string;
    Type: 'movie' | 'series' | 'episode' | string;
    Poster: string;
}

export interface MovieDetails {
    imdbID: string;
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: { Source: string; Value: string }[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
    Error?: string;
}

export interface SearchResponse {
    Search?: MovieSearchResult[];
    totalResults?: string;
    Response: 'True' | 'False';
    Error?: string;
}

export type MovieTypeFilter = '' | 'movie' | 'series' | 'episode';
export type SortOption = 'default' | 'year-desc' | 'year-asc' | 'title-asc';
export type ThemeMode = 'light' | 'dark';
