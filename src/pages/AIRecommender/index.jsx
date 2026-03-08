import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '@/components/common/MovieCard';
import { fetchTMDB } from '@/api/tmdbClient';
import { analyzeTastePreferences } from '@/api/geminiClient';
import { useAuth } from '@/context/AuthContext';
import { useUserMovies } from '@/hooks/useUserMovies';
import { TMDB_IMAGE_BASE } from '@/config/constants';
import './styles.css';

const AIRecommender = () => {
    const navigate = useNavigate();

    const { currentUser } = useAuth();
    const { isWatchlisted, toggleWatchlist } = useUserMovies();

    // Lists logic (Persisted to sessionStorage)
    const [watched, setWatched] = useState(() => {
        const saved = sessionStorage.getItem('ai_watched');
        return saved ? JSON.parse(saved) : [];
    });
    const [loved, setLoved] = useState(() => {
        const saved = sessionStorage.getItem('ai_loved');
        return saved ? JSON.parse(saved) : [];
    });

    // AI Analysis
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [recommendations, setRecommendations] = useState(() => {
        const saved = sessionStorage.getItem('ai_recommendations');
        return saved ? JSON.parse(saved) : [];
    });
    const [loadingLogs, setLoadingLogs] = useState([]);

    // Persist to session storage so users don't lose progress when navigating away
    useEffect(() => { sessionStorage.setItem('ai_watched', JSON.stringify(watched)); }, [watched]);
    useEffect(() => { sessionStorage.setItem('ai_loved', JSON.stringify(loved)); }, [loved]);
    useEffect(() => { sessionStorage.setItem('ai_recommendations', JSON.stringify(recommendations)); }, [recommendations]);

    // Search 
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeout = useRef(null);


    // Interactive Loading Terminal Effect
    useEffect(() => {
        let timeoutIds = [];
        if (isAnalyzing) {
            setLoadingLogs(["Initializing neural pathways..."]);

            const phases = [
                `Extracting thematic elements from ${loved[0]?.title || loved[0]?.name || 'your favorites'}...`,
                `Cross-referencing directors and cinematic styles...`,
                loved.length > 1 ? `Analyzing the pacing of ${loved[1]?.title || loved[1]?.name || 'other selections'}...` : `Deep-diving into specific genre tropes...`,
                watched.length > 0 ? `Filtering out movies you've already watched...` : `Comparing against global viewer data...`,
                `Finalizing your personalized taste profile...`,
                `Synthesizing perfect matches...`
            ];

            phases.forEach((text, index) => {
                const id = setTimeout(() => {
                    setLoadingLogs(prev => [...prev, text]);
                }, (index + 1) * 2000);
                timeoutIds.push(id);
            });
        }
        return () => timeoutIds.forEach(clearTimeout);
    }, [isAnalyzing, loved, watched]);

    // Live Search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(async () => {
            const data = await fetchTMDB('/search/movie', {
                query: encodeURIComponent(searchQuery.trim()),
                page: 1,
            });

            if (data && data.results) {
                setSearchResults(data.results.slice(0, 8));
            }
            setIsSearching(false);
        }, 400);

        return () => clearTimeout(searchTimeout.current);
    }, [searchQuery]);

    const handleAdd = (movie, listType) => {
        if (listType === 'watched') {
            if (!watched.find(m => m.id === movie.id)) {
                setWatched([...watched, movie]);
            }
        } else if (listType === 'loved') {
            if (!loved.find(m => m.id === movie.id)) {
                setLoved([...loved, movie]);
            }
        }
        setSearchQuery(''); // clear search
    };

    const handleRemove = (movie, listType) => {
        if (listType === 'watched') {
            setWatched(watched.filter(m => m.id !== movie.id));
        } else {
            setLoved(loved.filter(m => m.id !== movie.id));
        }
    };

    const handleAnalyze = async () => {
        if (loved.length === 0) {
            alert("Please add at least one movie to your 'Loved' list so the AI can learn your taste!");
            return;
        }

        setIsAnalyzing(true);
        setRecommendations([]);

        try {
            // Get titles from Gemini
            const aiTitles = await analyzeTastePreferences(watched, loved);

            // Map those titles to actual TMDB movie objects
            const tmdbMovies = [];
            for (const title of aiTitles) {
                const data = await fetchTMDB('/search/multi', { query: encodeURIComponent(title), page: 1 });
                if (data && data.results && data.results.length > 0) {
                    // Pick the most popular/first match
                    const match = data.results.find(res => res.media_type === 'movie' || res.media_type === 'tv') || data.results[0];
                    if (match && !tmdbMovies.find(m => m.id === match.id)) {
                        tmdbMovies.push(match);
                    }
                }
            }
            setRecommendations(tmdbMovies);

        } catch (error) {
            console.error("Analysis Failed", error);
            alert("Something went wrong with the AI analysis. Please try again.");
        } finally {
            setIsAnalyzing(false);

            // Scroll to results
            setTimeout(() => {
                const resEl = document.getElementById("ai-results");
                if (resEl) {
                    window.scrollTo({ top: resEl.offsetTop - 100, behavior: 'smooth' });
                }
            }, 300);
        }
    };

    const getYear = (item) => {
        const date = item.release_date || item.first_air_date || '';
        return date ? date.slice(0, 4) : '';
    };

    return (
        <div className="page-wrapper ai-page">
            <main className="ai-main fade-in-up">

                <div className="ai-header">
                    <h1>AI Taste Matcher</h1>
                    <p>Build your profile and let our AI engine find your next favorite movie.</p>
                </div>

                <div className="ai-container">

                    {/* LEFT COLUMN: BUILDER */}
                    <div className="ai-builder">
                        <div className="ai-search-container">
                            <input
                                type="text"
                                placeholder="Search for movies you know..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="ai-search-input"
                            />
                            {isSearching && (
                                <div className="ai-search-spinner">
                                    <div className="ai-spinner-small" />
                                </div>
                            )}

                            {searchResults.length > 0 && searchQuery && (
                                <div className="ai-search-dropdown">
                                    {searchResults.map(movie => (
                                        <div key={movie.id} className="ai-search-item">
                                            {movie.poster_path ? (
                                                <img src={`${TMDB_IMAGE_BASE}${movie.poster_path}`} alt={movie.title} />
                                            ) : (
                                                <div className="no-poster"></div>
                                            )}
                                            <div className="ai-search-info">
                                                <span className="ai-title">{movie.title || movie.name}</span>
                                                <span className="ai-year">{getYear(movie)}</span>
                                            </div>
                                            <div className="ai-search-actions">
                                                <button onClick={() => handleAdd(movie, 'watched')} className="btn-add watched">Watched it</button>
                                                <button onClick={() => handleAdd(movie, 'loved')} className="btn-add loved">I Love this</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="ai-lists">
                            <div className="ai-list-wrap">
                                <h3>Movies I've Watched</h3>
                                <p className="ai-list-desc">Helps the AI know what not to recommend.</p>
                                <div className="ai-list">
                                    {watched.length === 0 && <div className="ai-list-empty">Search and add movies here</div>}
                                    {watched.map(movie => (
                                        <div key={movie.id} className="ai-list-pill watched-pill">
                                            {movie.title || movie.name}
                                            <button onClick={() => handleRemove(movie, 'watched')}>×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="ai-list-wrap">
                                <h3>Movies I ABSOLUTELY LOVE <span className="req">*</span></h3>
                                <p className="ai-list-desc">The AI reads the vibes, genres, and styles of these.</p>
                                <div className="ai-list">
                                    {loved.length === 0 && <div className="ai-list-empty">Search and add your favorites here</div>}
                                    {loved.map(movie => (
                                        <div key={movie.id} className="ai-list-pill loved-pill">
                                            {movie.title || movie.name}
                                            <button onClick={() => handleRemove(movie, 'loved')}>×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="ai-action-bar">
                            <button
                                className={`btn-analyze ${isAnalyzing ? 'analyzing' : ''}`}
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || loved.length === 0}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="ai-spinner-small accent"></div>
                                        Reading Neural Pathways...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                        </svg>
                                        Learn My Preferences
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RESULTS */}
                    <div id="ai-results" className="ai-results-panel">
                        {isAnalyzing ? (
                            <div className="ai-loading-splash">
                                <div className="ai-pulse-ring"></div>
                                <h2>Building Taste Profile</h2>
                                <div className="ai-terminal">
                                    {loadingLogs.map((log, index) => (
                                        <div key={index} className="ai-terminal-line">
                                            <span className="ai-terminal-prompt">&gt;</span> {log}
                                        </div>
                                    ))}
                                    <span className="ai-terminal-cursor">_</span>
                                </div>
                            </div>
                        ) : recommendations.length > 0 ? (
                            <div className="ai-matches">
                                <h2 className="ai-match-title">Perfect Matches Found</h2>
                                <div className="ai-grid">
                                    {recommendations.map((movie, i) => {
                                        const isSaved = isWatchlisted(movie.id);
                                        return (
                                            <div key={movie.id} className="ai-result-card">
                                                <MovieCard
                                                    movie={movie}
                                                    onClick={() => navigate(`/watch/${movie.id}?type=${movie.media_type || 'movie'}`)}
                                                    animationDelay={`${i * 100}ms`}
                                                    showBadge={true}
                                                />
                                                <button
                                                    className={`btn-save-watch ${isSaved ? 'saved' : ''}`}
                                                    onClick={() => toggleWatchlist(movie)}
                                                    title={isSaved ? "Saved to Watchlist" : "Add to Watchlist"}
                                                >
                                                    {isSaved ? '✓ Saved' : '+ Watchlist'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="ai-waiting">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <p>Your AI recommendations will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIRecommender;
