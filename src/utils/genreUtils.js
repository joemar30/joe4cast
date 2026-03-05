export const GENRE_MAP = {
    28: { name: 'Action', color: '#ef4444' }, // Red
    12: { name: 'Adventure', color: '#f59e0b' }, // Amber
    16: { name: 'Animation', color: '#10b981' }, // Emerald
    35: { name: 'Comedy', color: '#facc15' }, // Yellow
    80: { name: 'Crime', color: '#4b5563' }, // Gray
    99: { name: 'Documentary', color: '#06b6d4' }, // Cyan
    18: { name: 'Drama', color: '#8b5cf6' }, // Violet
    10751: { name: 'Family', color: '#fb7185' }, // Rose
    14: { name: 'Fantasy', color: '#d946ef' }, // Fuchsia
    36: { name: 'History', color: '#92400e' }, // Brown
    27: { name: 'Horror', color: '#1f2937' }, // Dark Gray
    10402: { name: 'Music', color: '#ec4899' }, // Pink
    9648: { name: 'Mystery', color: '#6366f1' }, // Indigo
    10749: { name: 'Romance', color: '#f43f5e' }, // Rose
    878: { name: 'Sci-Fi', color: '#3b82f6' }, // Blue
    10770: { name: 'TV Movie', color: '#94a3b8' }, // Slate
    53: { name: 'Thriller', color: '#059669' }, // Emerald
    10752: { name: 'War', color: '#b91c1c' }, // Dark Red
    37: { name: 'Western', color: '#78350f' }, // Amber-Brown
};

export const getGenreInfo = (id) => GENRE_MAP[id] || { name: 'Other', color: '#64748b' };
