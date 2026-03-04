import { useQuery } from '@tanstack/react-query';
import { fetchTMDB } from '../api/tmdbClient';

/**
 * Custom hook to fetch a TMDB Movie Collection (franchise)
 * Retrieves the collection metadata (name, overview, backdrop) and all its parts (movies).
 * 
 * @param {string|number} collectionId 
 * @returns {object} { collection, loading, error }
 */
export const useMovieCollection = (collectionId) => {
    const { data: collection, isLoading: loading, error } = useQuery({
        queryKey: ['collection', collectionId],
        queryFn: async () => {
            const data = await fetchTMDB(`/collection/${collectionId}`);
            if (!data) throw new Error(`Collection ${collectionId} not found`);

            // TMDB parts array contains movies, ensure they are sorted by release_date organically
            if (data.parts && Array.isArray(data.parts)) {
                data.parts.sort((a, b) => {
                    const dateA = new Date(a.release_date || '1970-01-01');
                    const dateB = new Date(b.release_date || '1970-01-01');
                    return dateA - dateB;
                });
            }

            return data;
        },
        enabled: !!collectionId, // Only execute if we have a valid ID
    });

    return {
        collection,
        loading,
        error: error ? error.message : null
    };
};
