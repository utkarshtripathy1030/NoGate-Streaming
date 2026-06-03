import axios from 'axios';

const TMDB_KEY = 'c0e43697b1855f9f29f4938bc20ebb9a';
const BASE_API = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w342';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

interface TMDBResponse<T> {
  results: T[];
  total_pages: number;
  total_results: number;
  page: number;
}

interface MediaDetails {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  genres: Array<{ id: number; name: string }>;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  number_of_seasons?: number;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  similar?: TMDBResponse<MediaDetails>;
  recommendations?: TMDBResponse<MediaDetails>;
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      type: string;
      site: string;
    }>;
  };
  seasons?: Array<{
    season_number: number;
    name: string;
    episode_count: number;
  }>;
}

interface Episode {
  episode_number: number;
  name: string;
  still_path: string | null;
  overview: string;
  air_date: string;
  vote_average: number;
}

const axiosInstance = axios.create({
  baseURL: BASE_API,
  timeout: 10000,
});

export const tmdbAPI = {
  // Trending
  getTrendingAll: (page = 1) =>
    axiosInstance.get<TMDBResponse<any>>('/trending/all/week', {
      params: { api_key: TMDB_KEY, language: 'en-US', page },
    }),

  getTrendingMovies: (page = 1) =>
    axiosInstance.get<TMDBResponse<any>>('/trending/movie/week', {
      params: { api_key: TMDB_KEY, language: 'en-US', page },
    }),

  getTrendingTV: (page = 1) =>
    axiosInstance.get<TMDBResponse<any>>('/trending/tv/week', {
      params: { api_key: TMDB_KEY, language: 'en-US', page },
    }),

  // Popular
  getPopularMovies: (page = 1) =>
    axiosInstance.get<TMDBResponse<any>>('/movie/popular', {
      params: { api_key: TMDB_KEY, language: 'en-US', page },
    }),

  getPopularTV: (page = 1) =>
    axiosInstance.get<TMDBResponse<any>>('/tv/popular', {
      params: { api_key: TMDB_KEY, language: 'en-US', page },
    }),

  // Details
  getMovieDetails: (id: number) =>
    axiosInstance.get<MediaDetails>(`/movie/${id}`, {
      params: {
        api_key: TMDB_KEY,
        append_to_response: 'credits,similar,recommendations,videos',
      },
    }),

  getTVDetails: (id: number) =>
    axiosInstance.get<MediaDetails>(`/tv/${id}`, {
      params: {
        api_key: TMDB_KEY,
        append_to_response: 'credits,similar,recommendations,videos',
      },
    }),

  // Genres
  discoverByGenre: (genreId: number, page = 1) =>
    axiosInstance.get<TMDBResponse<any>>('/discover/movie', {
      params: {
        api_key: TMDB_KEY,
        with_genres: genreId,
        sort_by: 'popularity.desc',
        page,
      },
    }),

  // Search
  search: (query: string, page = 1) =>
    axiosInstance.get<TMDBResponse<any>>('/search/multi', {
      params: {
        api_key: TMDB_KEY,
        language: 'en-US',
        query,
        page,
      },
    }),

  // Episodes
  getSeasonDetails: (tvId: number, seasonNumber: number) =>
    axiosInstance.get<{ episodes: Episode[] }>(`/tv/${tvId}/season/${seasonNumber}`, {
      params: { api_key: TMDB_KEY, language: 'en-US' },
    }),
};

export const getImageUrl = (path: string | null, width = 342): string => {
  if (!path) {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 500"%3E%3Crect width="342" height="500" fill="%23222222"/%3E%3Ctext x="50%25" y="50%25" fill="%23666" font-size="14" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
  }
  return `${IMG_BASE}${path}`;
};

export const getBackdropUrl = (path: string | null): string => {
  if (!path) return getImageUrl(null);
  return `${BACKDROP_BASE}${path}`;
};

export const VIDSRC_BASE = 'https://vidsrc.me/embed';

export const GENRES = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
];
