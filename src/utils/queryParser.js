/**
 * queryParser.js
 * ═══════════════════════════════════════════════════════════════
 * Client-side natural language → TMDB Discover API filter parser.
 * No AI dependency — uses curated synonym dictionaries + regex.
 * ═══════════════════════════════════════════════════════════════
 */

// ── TMDB Genre ID Mapping ─────────────────────────────────────
const GENRE_SYNONYMS = {
    // Action (28)
    'action': 28, 'action-packed': 28, 'explosive': 28, 'adrenaline': 28, 'stunts': 28,
    'fight': 28, 'fighting': 28, 'martial arts': 28, 'combat': 28, 'battles': 28,

    // Adventure (12)
    'adventure': 12, 'adventurous': 12, 'quest': 12, 'journey': 12, 'exploration': 12,
    'expedition': 12, 'treasure': 12,

    // Animation (16)
    'animation': 16, 'animated': 16, 'cartoon': 16, 'anime': 16, 'pixar': 16,
    'disney': 16,

    // Comedy (35)
    'comedy': 35, 'funny': 35, 'hilarious': 35, 'humor': 35, 'humorous': 35,
    'laugh': 35, 'laughing': 35, 'comedic': 35, 'sitcom': 35, 'parody': 35,
    'satire': 35, 'witty': 35, 'slapstick': 35, 'goofy': 35, 'silly': 35,

    // Crime (80)
    'crime': 80, 'criminal': 80, 'heist': 80, 'robbery': 80, 'gangster': 80,
    'mafia': 80, 'mob': 80, 'detective': 80, 'murder': 80,

    // Documentary (99)
    'documentary': 99, 'documentaries': 99, 'docuseries': 99, 'true story': 99,
    'real life': 99, 'non-fiction': 99, 'nonfiction': 99,

    // Drama (18)
    'drama': 18, 'dramatic': 18, 'emotional': 18, 'intense': 18, 'serious': 18,
    'heartfelt': 18, 'moving': 18, 'tear-jerker': 18, 'tearjerker': 18,

    // Family (10751)
    'family': 10751, 'kids': 10751, 'children': 10751, 'kid-friendly': 10751,
    'wholesome': 10751, 'family-friendly': 10751,

    // Fantasy (14)
    'fantasy': 14, 'magical': 14, 'magic': 14, 'mythical': 14, 'fairy tale': 14,
    'fairytale': 14, 'wizards': 14, 'dragons': 14, 'enchanted': 14, 'supernatural': 14,

    // History (36)
    'history': 36, 'historical': 36, 'period': 36, 'period piece': 36, 'ancient': 36,
    'medieval': 36, 'civil war': 36, 'world war': 36,

    // Horror (27)
    'horror': 27, 'scary': 27, 'terrifying': 27, 'creepy': 27, 'spooky': 27,
    'haunted': 27, 'ghost': 27, 'ghosts': 27, 'zombie': 27, 'zombies': 27,
    'slasher': 27, 'nightmare': 27, 'frightening': 27, 'demonic': 27, 'possessed': 27,

    // Music (10402)
    'music': 10402, 'musical': 10402, 'concert': 10402, 'singing': 10402,
    'band': 10402, 'rock': 10402,

    // Mystery (9648)
    'mystery': 9648, 'mysterious': 9648, 'whodunit': 9648, 'suspense': 9648,
    'enigma': 9648, 'puzzle': 9648, 'clue': 9648, 'investigation': 9648,

    // Romance (10749)
    'romance': 10749, 'romantic': 10749, 'love': 10749, 'love story': 10749,
    'rom-com': 10749, 'romcom': 10749, 'relationship': 10749, 'dating': 10749,
    'heartbreak': 10749,

    // Science Fiction (878)
    'sci-fi': 878, 'scifi': 878, 'science fiction': 878, 'futuristic': 878,
    'space': 878, 'alien': 878, 'aliens': 878, 'cyberpunk': 878, 'dystopian': 878,
    'dystopia': 878, 'robots': 878, 'robot': 878, 'time travel': 878,

    // Thriller (53)
    'thriller': 53, 'thrilling': 53, 'tense': 53, 'suspenseful': 53,
    'edge-of-seat': 53, 'gripping': 53, 'psychological': 53, 'conspiracy': 53,
    'spy': 53, 'espionage': 53,

    // War (10752)
    'war': 10752, 'military': 10752, 'soldier': 10752, 'soldiers': 10752,
    'battlefield': 10752, 'army': 10752, 'navy': 10752,

    // Western (37)
    'western': 37, 'cowboy': 37, 'cowboys': 37, 'wild west': 37, 'frontier': 37,
    'outlaw': 37, 'sheriff': 37,
};

// ── Sort Keyword Mapping ──────────────────────────────────────
const SORT_SYNONYMS = {
    'top rated': 'vote_average.desc',
    'top-rated': 'vote_average.desc',
    'highest rated': 'vote_average.desc',
    'best rated': 'vote_average.desc',
    'best': 'vote_average.desc',
    'popular': 'popularity.desc',
    'most popular': 'popularity.desc',
    'trending': 'popularity.desc',
    'new': 'primary_release_date.desc',
    'newest': 'primary_release_date.desc',
    'latest': 'primary_release_date.desc',
    'recent': 'primary_release_date.desc',
    'recent releases': 'primary_release_date.desc',
    'upcoming': 'primary_release_date.asc',
    'classic': 'primary_release_date.asc',
    'classics': 'primary_release_date.asc',
    'oldest': 'primary_release_date.asc',
    'highest grossing': 'revenue.desc',
    'box office': 'revenue.desc',
    'blockbuster': 'revenue.desc',
    'blockbusters': 'revenue.desc',
};

// ── Decade / Year Extraction ──────────────────────────────────
const DECADE_MAP = {
    '20s': [2020, 2029],
    '2020s': [2020, 2029],
    '10s': [2010, 2019],
    '2010s': [2010, 2019],
    '00s': [2000, 2009],
    '2000s': [2000, 2009],
    '90s': [1990, 1999],
    '1990s': [1990, 1999],
    '80s': [1980, 1989],
    '1980s': [1980, 1989],
    '70s': [1970, 1979],
    '1970s': [1970, 1979],
    '60s': [1960, 1969],
    '1960s': [1960, 1969],
    '50s': [1950, 1959],
    '1950s': [1950, 1959],
};

// ── TMDB Genre ID → Label (for display) ──────────────────────
const GENRE_LABELS = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
    10752: 'War', 37: 'Western',
};

// ── Sort Label Map ────────────────────────────────────────────
const SORT_LABELS = {
    'vote_average.desc': 'Top Rated',
    'popularity.desc': 'Most Popular',
    'primary_release_date.desc': 'Newest First',
    'primary_release_date.asc': 'Oldest First',
    'revenue.desc': 'Highest Grossing',
};

/**
 * Parse a natural-language query into structured TMDB Discover filters.
 *
 * @param {string} query — The raw user input
 * @returns {{ genres: number[], genreLabels: string[], yearRange: [number, number]|null, sortBy: string|null, sortLabel: string|null, remainingKeywords: string[], original: string }}
 */
export const parseSmartQuery = (query) => {
    const original = query;
    let text = query.toLowerCase().trim();

    const result = {
        genres: [],
        genreLabels: [],
        yearRange: null,
        sortBy: null,
        sortLabel: null,
        remainingKeywords: [],
        original,
    };

    // ── 1. Extract Sort ───────────────────────────────────────
    // Check multi-word sort phrases first (longest match first)
    const sortKeys = Object.keys(SORT_SYNONYMS).sort((a, b) => b.length - a.length);
    for (const key of sortKeys) {
        if (text.includes(key)) {
            result.sortBy = SORT_SYNONYMS[key];
            result.sortLabel = SORT_LABELS[result.sortBy] || key;
            text = text.replace(key, ' ').trim();
            break;
        }
    }

    // ── 2. Extract Year / Decade ──────────────────────────────
    // Check for decade strings
    const decadeKeys = Object.keys(DECADE_MAP).sort((a, b) => b.length - a.length);
    for (const key of decadeKeys) {
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(text)) {
            result.yearRange = DECADE_MAP[key];
            text = text.replace(regex, ' ').trim();
            break;
        }
    }

    // Check for specific year (e.g., "2020", "1995")
    if (!result.yearRange) {
        const yearMatch = text.match(/\b(19[5-9]\d|20[0-2]\d)\b/);
        if (yearMatch) {
            const year = parseInt(yearMatch[1]);
            result.yearRange = [year, year];
            text = text.replace(yearMatch[0], ' ').trim();
        }
    }

    // ── 3. Extract Genres ─────────────────────────────────────
    // Check multi-word genre phrases first, then single words
    const genreKeys = Object.keys(GENRE_SYNONYMS).sort((a, b) => b.length - a.length);
    for (const key of genreKeys) {
        const regex = new RegExp(`\\b${key.replace(/-/g, '[\\-\\s]?')}\\b`, 'i');
        if (regex.test(text)) {
            const genreId = GENRE_SYNONYMS[key];
            if (!result.genres.includes(genreId)) {
                result.genres.push(genreId);
                result.genreLabels.push(GENRE_LABELS[genreId] || key);
            }
            text = text.replace(regex, ' ').trim();
        }
    }

    // ── 4. Collect Remaining Keywords ─────────────────────────
    // Strip common filler words
    const fillerWords = new Set([
        'movie', 'movies', 'film', 'films', 'show', 'shows', 'series',
        'the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'with',
        'and', 'or', 'but', 'from', 'about', 'like', 'that', 'are',
        'is', 'was', 'were', 'been', 'be', 'have', 'has', 'had',
        'do', 'does', 'did', 'will', 'would', 'could', 'should',
        'can', 'may', 'might', 'shall', 'must', 'need', 'some',
        'really', 'very', 'super', 'good', 'great', 'me', 'i',
        'want', 'looking', 'find', 'search', 'recommend', 'suggest',
    ]);

    const remaining = text
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 1 && !fillerWords.has(word));

    result.remainingKeywords = [...new Set(remaining)];

    return result;
};

/**
 * Build TMDB Discover API params from parsed query result.
 *
 * @param {ReturnType<typeof parseSmartQuery>} parsed
 * @param {number} page
 * @returns {object} — Params for fetchTMDB('/discover/movie', params)
 */
export const buildDiscoverParams = (parsed, page = 1) => {
    const params = { page };

    // Genres
    if (parsed.genres.length > 0) {
        params.with_genres = parsed.genres.join(',');
    }

    // Year range
    if (parsed.yearRange) {
        params['primary_release_date.gte'] = `${parsed.yearRange[0]}-01-01`;
        params['primary_release_date.lte'] = `${parsed.yearRange[1]}-12-31`;
    }

    // Sort
    if (parsed.sortBy) {
        params.sort_by = parsed.sortBy;
        // For vote-based sorting, require minimum votes to avoid obscure results
        if (parsed.sortBy === 'vote_average.desc') {
            params['vote_count.gte'] = 200;
        }
    } else {
        params.sort_by = 'popularity.desc';
    }

    return params;
};

export { GENRE_LABELS, SORT_LABELS };
