import { useState, useEffect } from 'react';
import { fetchTMDB } from '../api/tmdbClient';
import { useOnboardingMovies } from './useOnboardingMovies';

export const useOnboardingSearch = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    // Default trending movies fallback
    const { movies: defaultMovies, loading: defaultLoading, error: defaultError } = useOnboardingMovies();

    // Debounce the search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
            setPage(1); // Reset page on new query
            setSearchResults([]); // Clear old results immediately
        }, 300);

        return () => clearTimeout(handler);
    }, [query]);

    // Perform Search
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                setHasMore(false);
                return;
            }

            setIsSearching(true);
            setSearchError(null);

            try {
                const data = await fetchTMDB('/search/movie', {
                    query: debouncedQuery,
                    page: page,
                    include_adult: false
                });

                const results = data?.results || [];
                const totalPages = data?.total_pages || 0;

                // Filter out movies without posters
                const validMovies = results.filter(m => m.poster_path);

                setSearchResults(prev => page === 1 ? validMovies : [...prev, ...validMovies]);
                setHasMore(page < totalPages);
            } catch (err) {
                console.error("Onboarding search error:", err);
                setSearchError(err);
            } finally {
                setIsSearching(false);
            }
        };

        performSearch();
    }, [debouncedQuery, page]);

    const loadMore = () => {
        if (!isSearching && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return {
        query,
        setQuery,
        movies: debouncedQuery.trim() ? searchResults : defaultMovies,
        loading: debouncedQuery.trim() ? isSearching : defaultLoading,
        error: searchError || defaultError,
        hasMore: debouncedQuery.trim() ? hasMore : false, // Trending uses Tanstack Query, keeping it simple for now
        loadMore
    };
};
