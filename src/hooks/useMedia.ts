import { useState, useEffect } from 'react';
import { tmdbAPI } from '@/services/tmdbAPI';
import { MediaItem } from '@/context/ModalContext';

export const useMyList = () => {
  const [myList, setMyList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadList = async () => {
      setIsLoading(true);
      try {
        const stored = localStorage.getItem('nogate_mylist');
        setMyList(stored ? JSON.parse(stored) : []);
      } finally {
        setIsLoading(false);
      }
    };
    loadList();
  }, []);

  const addItem = (item: MediaItem) => {
    if (!myList.some(i => i.id === item.id && i.type === item.type)) {
      const newList = [...myList, item];
      setMyList(newList);
      localStorage.setItem('nogate_mylist', JSON.stringify(newList));
    }
  };

  const removeItem = (id: number, type: 'movie' | 'tv') => {
    const newList = myList.filter(i => !(i.id === id && i.type === type));
    setMyList(newList);
    localStorage.setItem('nogate_mylist', JSON.stringify(newList));
  };

  const isInList = (id: number, type: 'movie' | 'tv') => {
    return myList.some(i => i.id === id && i.type === type);
  };

  return { myList, isLoading, addItem, removeItem, isInList };
};

export const useTrendingMedia = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        setIsLoading(true);
        const [moviesRes, seriesRes] = await Promise.all([
          tmdbAPI.getTrendingMovies(),
          tmdbAPI.getTrendingTV(),
        ]);
        setMovies(moviesRes.data.results.slice(0, 20));
        setSeries(seriesRes.data.results.slice(0, 20));
        setError(null);
      } catch (err) {
        setError('Failed to load trending media');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrending();
  }, []);

  return { movies, series, isLoading, error };
};

export const useGenreMovies = (genreId: number) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenreMovies = async () => {
      try {
        setIsLoading(true);
        const res = await tmdbAPI.discoverByGenre(genreId);
        setMovies(res.data.results.slice(0, 15));
        setError(null);
      } catch (err) {
        setError('Failed to load genre movies');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadGenreMovies();
  }, [genreId]);

  return { movies, isLoading, error };
};

export const useHeroCarousel = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHeroItems = async () => {
      try {
        setIsLoading(true);
        const res = await tmdbAPI.getTrendingAll();
        const filtered = res.data.results
          .filter((i: any) => i.backdrop_path)
          .slice(0, 8);
        setItems(filtered);
        setError(null);
      } catch (err) {
        setError('Failed to load hero items');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHeroItems();
  }, []);

  return { items, isLoading, error };
};

export const useInfiniteScroll = (type: 'movie' | 'tv') => {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const res =
        type === 'movie'
          ? await tmdbAPI.getPopularMovies(page)
          : await tmdbAPI.getPopularTV(page);

      if (res.data.results.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...res.data.results]);
        setPage(prev => prev + 1);
        setHasMore(page < res.data.total_pages);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load more items');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  };

  return { items, page, isLoading, hasMore, error, loadMore, reset };
};

export const useSearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, isSuggestion = false) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const res = await tmdbAPI.search(query);
      const filtered = res.data.results
        .filter(i => i.media_type === 'movie' || i.media_type === 'tv')
        .slice(0, isSuggestion ? 6 : 20);

      if (isSuggestion) {
        setSuggestions(filtered);
      } else {
        setResults(filtered);
      }
      setError(null);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setSuggestions([]);
    setError(null);
  };

  return { results, suggestions, isLoading, error, search, clearSearch };
};
