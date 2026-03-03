/**
 * useFanartLogo.js — Custom Hook for fanart.tv Movie Logos
 * ─────────────────────────────────────────────────────────────
 * Fetches HD movie title logos from the fanart.tv API using
 * TMDB movie IDs.
 *
 * Returns the best English HD logo URL (sorted by likes).
 * Falls back to standard movielogo if HD is unavailable.
 * Includes an in-memory cache to avoid redundant API calls.
 *
 * Usage:
 *   const { logoUrl, loading } = useFanartLogo(tmdbId);
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { TMDB_API_KEY, TMDB_BASE_URL } from '@/config/constants';

const FANART_API_KEY = import.meta.env.VITE_FANART_API_KEY;

// In dev, Vite proxies /fanart-api → webservice.fanart.tv/v3 (bypasses CORS)
// In production, you'd need your own proxy or a serverless function
const FANART_BASE = '/fanart-api';
const TMDB_IMAGE_ORIGINAL_BASE = 'https://image.tmdb.org/t/p/original';
const LOGO_CACHE_VERSION = 'v2';

// ── In-memory cache so we never fetch the same movie twice ──
const logoCache = {};

const useFanartLogo = (tmdbId, type = 'movie') => {
    const [logoUrl, setLogoUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tmdbId) {
            setLoading(false);
            return;
        }

        const mediaType = type === 'tv' ? 'tv' : 'movie';
        const cacheKey = `${LOGO_CACHE_VERSION}_${mediaType}_${tmdbId}`;

        // Check cache first
        if (logoCache[cacheKey] !== undefined) {
            setLogoUrl(logoCache[cacheKey]);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchLogo = async () => {
            setLoading(true);
            try {
                const endpoint = mediaType === 'tv' ? 'tv' : 'movies';
                const res = await fetch(
                    `${FANART_BASE}/${endpoint}/${tmdbId}?api_key=${FANART_API_KEY}`
                );

                if (!res.ok) throw new Error(`fanart.tv ${res.status}`);

                const data = await res.json();

                // ── Pick the best logo ──
                let logo = null;

                const pickBest = (arr) => {
                    if (!arr || arr.length === 0) return null;
                    // Prefer English logos, sorted by likes descending
                    const english = arr.filter(l => l.lang === 'en');
                    const pool = english.length > 0 ? english : arr;
                    // Sort by likes (string → number)
                    pool.sort((a, b) => Number(b.likes) - Number(a.likes));
                    return pool[0]?.url || null;
                };

                if (mediaType === 'tv') {
                    logo = pickBest(data.hdtvlogo) || pickBest(data.tvlogo) || pickBest(data.clearlogo);
                } else {
                    logo = pickBest(data.hdmovielogo) || pickBest(data.movielogo) || pickBest(data.clearlogo);
                }

                // Fallback to TMDB logos when fanart has no title logo for this item.
                if (!logo && TMDB_API_KEY) {
                    const tmdbPath = mediaType === 'tv' ? 'tv' : 'movie';
                    const tmdbUrl =
                        `${TMDB_BASE_URL}/${tmdbPath}/${tmdbId}/images` +
                        `?api_key=${TMDB_API_KEY}&include_image_language=en,null`;

                    const tmdbRes = await fetch(tmdbUrl);
                    if (tmdbRes.ok) {
                        const tmdbData = await tmdbRes.json();
                        const logos = Array.isArray(tmdbData.logos) ? [...tmdbData.logos] : [];

                        const preferred = logos.filter(l => l.iso_639_1 === 'en' || l.iso_639_1 === null);
                        const pool = preferred.length > 0 ? preferred : logos;

                        pool.sort((a, b) => {
                            const scoreA = Number(a.vote_count || 0) * 10 + Number(a.vote_average || 0);
                            const scoreB = Number(b.vote_count || 0) * 10 + Number(b.vote_average || 0);
                            return scoreB - scoreA;
                        });

                        const bestLogoPath = pool[0]?.file_path;
                        if (bestLogoPath) {
                            logo = `${TMDB_IMAGE_ORIGINAL_BASE}${bestLogoPath}`;
                        }
                    }
                }

                // Cache the result (even null, to avoid retrying)
                logoCache[cacheKey] = logo;

                if (!cancelled) {
                    setLogoUrl(logo);
                }
            } catch {
                // Cache null on error to prevent hammering the API
                logoCache[cacheKey] = null;
                if (!cancelled) {
                    setLogoUrl(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchLogo();

        return () => { cancelled = true; };
    }, [tmdbId, type]);

    return { logoUrl, loading };
};

export default useFanartLogo;
