/**
 * vibeyAI.js
 * ═══════════════════════════════════════════════════════════════
 * AI client for the Vibey chatbot.
 * Waterfall: Gemini (primary) → Groq (Llama 3) → HuggingFace → error
 *
 * Accepts a full conversation history array for contextual memory.
 * Returns { text, movies[] } where movies are TMDB-enriched.
 * ═══════════════════════════════════════════════════════════════
 */

import { fetchTMDB } from './tmdbClient';
import { GoogleGenerativeAI } from "@google/generative-ai";

// API Keys
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const LOCAL_GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API;
const LOCAL_HF_API_KEY = import.meta.env.VITE_HF_API_KEY || import.meta.env.HUGGING_FACE_API;

const GROQ_MODELS = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'llama3-70b-8192'
];
const HF_MODEL = 'meta-llama/Llama-3.1-8B-Instruct';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w342';

// Simple session cache for AI results with a size limit
const aiCache = new Map();
const MAX_AI_CACHE_SIZE = 50;

/**
 * Generate a unique string key for conversation history
 */
const getHistoryKey = (history) => {
    if (!history || history.length === 0) return 'empty';
    return JSON.stringify(history.map(m => ({ role: m.role, content: m.content })));
};

/**
 * System prompt that defines Vibey's personality and output format.
 */
const SYSTEM_PROMPT = `You are Vibey, the friendly AI movie & TV recommendation assistant for Joe4cast.

PERSONALITY:
- You're enthusiastic, witty, and casual — like chatting with a movie-nerd friend.
- Use short, punchy sentences. Sprinkle in the occasional emoji but don't overdo it.
- Keep responses concise (2-4 sentences of commentary max before recommendations).

RECOMMENDATION RULES:
- When the user asks for recommendations, ALWAYS include a [MOVIES] block.
- Inside the [MOVIES] block, put a JSON array of exact movie/TV titles.
- Place the [MOVIES] block at the END of your response, after your commentary.
- If the user is just chatting or asking a non-movie question, respond normally WITHOUT a [MOVIES] block.
- Remember previous context in the conversation to refine recommendations.

FORMAT EXAMPLE:
Great picks! If you loved those mind-benders, you'll definitely want to check these out 🍿

[MOVIES]["Inception", "Interstellar", "The Prestige", "Memento", "Shutter Island", "Dark City"][/MOVIES]

IMPORTANT: The [MOVIES] block must contain ONLY a valid JSON array of title strings. No extra text inside the block.`;

/**
 * Parse Vibey's response to extract text and movie titles.
 */
const parseVibeyResponse = (rawText) => {
    const movieBlockRegex = /\[MOVIES\]([\s\S]*?)\[\/MOVIES\]/;
    const match = rawText.match(movieBlockRegex);

    let text = rawText;
    let movieTitles = [];

    if (match) {
        text = rawText.replace(movieBlockRegex, '').trim();
        try {
            const cleaned = match[1].trim();
            const parsed = JSON.parse(cleaned);
            if (Array.isArray(parsed)) {
                movieTitles = parsed;
            }
        } catch (e) {
            console.warn('[Vibey] Failed to parse movie block:', match[1]);
        }
    }

    return { text, movieTitles };
};

/**
 * Enrich movie titles via TMDB search.
 */
const enrichWithTMDB = async (titles) => {
    const results = [];
    const toSearch = titles.slice(0, 6);

    const searches = toSearch.map(async (title) => {
        try {
            const data = await fetchTMDB('/search/multi', { query: title });
            if (data?.results?.length > 0) {
                const best = data.results.find(r => r.poster_path) || data.results[0];
                const details = await fetchTMDB(`/${best.media_type || 'movie'}/${best.id}`, {
                    append_to_response: 'videos'
                });
                const trailer = details?.videos?.results?.find(
                    v => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
                );
                return {
                    id: best.id,
                    title: best.title || best.name,
                    poster_path: best.poster_path,
                    vote_average: best.vote_average,
                    release_date: best.release_date || best.first_air_date,
                    overview: best.overview,
                    media_type: best.media_type || 'movie',
                    posterUrl: best.poster_path ? `${TMDB_IMG_BASE}${best.poster_path}` : null,
                    trailerKey: trailer?.key || null,
                };
            }
        } catch (err) {
            console.warn(`[Vibey] TMDB search failed for "${title}":`, err);
        }
        return null;
    });

    const resolved = await Promise.all(searches);
    resolved.forEach(r => { if (r) results.push(r); });
    return results;
};

// ── Gemini Provider (Primary) ─────────────────────────────────
const queryGemini = async (messages) => {
    if (!GEMINI_API_KEY) {
        console.warn('[Vibey] Gemini API key not configured.');
        return null;
    }
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            systemInstruction: SYSTEM_PROMPT,
        });

        // Convert history to Gemini format (uses "user" and "model" roles)
        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const lastMessage = messages[messages.length - 1];

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage.content);
        const text = result.response.text();
        if (text) {
            console.log('[Vibey] Successfully used Gemini.');
            return text;
        }
    } catch (err) {
        console.warn('[Vibey] Gemini error:', err.message);
    }
    return null;
};

// ── Groq Provider (Fallback 1) ────────────────────────────────
const queryGroq = async (messages) => {
    for (const model of GROQ_MODELS) {
        try {
            const isLocalDev = import.meta.env.DEV;
            const endpoint = isLocalDev ? 'https://api.groq.com/openai/v1/chat/completions' : '/api/groq';
            const headers = { 'Content-Type': 'application/json' };

            if (isLocalDev) {
                if (!LOCAL_GROQ_API_KEY) return null;
                headers['Authorization'] = `Bearer ${LOCAL_GROQ_API_KEY}`;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        ...messages,
                    ],
                    temperature: 0.8,
                    max_tokens: 800,
                }),
            });

            if (!response.ok) {
                if (response.status === 400 || response.status === 429) continue;
                return null;
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) return content;
        } catch (err) {
            console.warn(`[Vibey] Groq error with ${model}:`, err.message);
        }
    }
    return null;
};

// ── HuggingFace Provider (Fallback 2) ─────────────────────────
const queryHuggingFace = async (messages) => {
    try {
        const isLocalDev = import.meta.env.DEV;
        const endpoint = isLocalDev ? `https://router.huggingface.co/v1/chat/completions` : '/api/huggingface';
        const headers = { 'Content-Type': 'application/json' };

        if (isLocalDev) {
            if (!LOCAL_HF_API_KEY) return null;
            headers['Authorization'] = `Bearer ${LOCAL_HF_API_KEY}`;
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: HF_MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages,
                ],
                temperature: 0.8,
                max_tokens: 800,
            }),
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    } catch (err) {
        console.warn('[Vibey] HuggingFace error:', err.message);
        return null;
    }
};

// ── Public API ────────────────────────────────────────────────

/**
 * Send a message to Vibey with full conversation context.
 * @param {Array<{role: string, content: string}>} conversationHistory
 * @returns {Promise<{text: string, movies: Array}>}
 */
export const sendVibeyMessage = async (conversationHistory) => {
    // 0. Simulated Latency for Debugging
    const simLatency = localStorage.getItem('joe4cast-simlatency');
    if (simLatency === 'true') {
        console.log('[Vibey] Simulating network latency (2s)...');
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 1. Check cache first
    const cacheKey = getHistoryKey(conversationHistory);
    if (aiCache.has(cacheKey)) {
        console.log('[Vibey] Returning cached response');
        return aiCache.get(cacheKey);
    }

    // 2. Try Gemini first (key already configured)
    let rawResponse = await queryGemini(conversationHistory);
    let provider = 'gemini';

    // 3. Fallback to Groq
    if (!rawResponse) {
        rawResponse = await queryGroq(conversationHistory);
        provider = 'groq';
    }

    // 4. Fallback to HuggingFace
    if (!rawResponse) {
        rawResponse = await queryHuggingFace(conversationHistory);
        provider = 'huggingface';
    }

    // 5. All providers failed
    if (!rawResponse) {
        return {
            text: "Hmm, I'm having trouble connecting right now. Try again in a moment! 🔌",
            movies: [],
            provider: null,
        };
    }

    console.log(`[Vibey] Response from ${provider}`);

    // 6. Parse the response
    const { text, movieTitles } = parseVibeyResponse(rawResponse);

    // 7. Enrich with TMDB data if there are movie recommendations
    let movies = [];
    if (movieTitles.length > 0) {
        movies = await enrichWithTMDB(movieTitles);
    }

    const result = { text, movies, provider, rawResponse };

    // 8. Save to cache with size limit (FIFO)
    if (aiCache.size >= MAX_AI_CACHE_SIZE) {
        const oldestKey = aiCache.keys().next().value;
        aiCache.delete(oldestKey);
    }
    aiCache.set(cacheKey, result);

    return result;
};

/**
 * Check if any AI provider is configured for Vibey.
 */
export const hasVibeyProvider = () => {
    if (import.meta.env.DEV) {
        return !!(GEMINI_API_KEY || LOCAL_GROQ_API_KEY || LOCAL_HF_API_KEY);
    }
    return true; // Proxy via Vercel removes need for client-side keys check
};
