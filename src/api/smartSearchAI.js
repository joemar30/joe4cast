/**
 * smartSearchAI.js
 * ═══════════════════════════════════════════════════════════════
 * Hybrid AI client for Smart Search.
 * Waterfall: Groq (Llama 3) → HuggingFace (Mistral) → null
 * Returns an array of movie title strings, or null if all fail.
 * ═══════════════════════════════════════════════════════════════
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.3';

/**
 * Shared prompt that instructs the model to return movie titles as JSON.
 */
const buildPrompt = (query) => `You are a movie recommendation engine. The user's search query is: "${query}"

Based on this query, recommend 8 to 12 movie or TV show titles that best match what they are looking for.
- If the query is an exact title (e.g., "Inception"), return that title and similar movies.
- If the query is descriptive (e.g., "funny movies from the 90s"), return the best matching titles.
- If the query describes a plot or scene (e.g., "movie about a man stuck on Mars"), identify the movie and return similar ones.

CRITICAL: Return ONLY a valid JSON array of title strings. No markdown, no backticks, no explanations.
Example: ["The Martian", "Interstellar", "Gravity", "Apollo 13"]`;

/**
 * Normalize AI response text into a JSON array of titles.
 */
const parseAIResponse = (text) => {
    // Strip markdown code blocks and whitespace
    let cleaned = text
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

    // Try to extract JSON array if there's surrounding text
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
        cleaned = arrayMatch[0];
    }

    try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
            return parsed;
        }
    } catch (e) {
        console.warn('[SmartSearch AI] Failed to parse response:', cleaned);
    }

    return null;
};

// ── Session Cache ─────────────────────────────────────────────
const getCache = (query) => {
    const key = `smart_ai_${query.trim().toLowerCase()}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch { return null; }
    }
    return null;
};

const setCache = (query, data) => {
    const key = `smart_ai_${query.trim().toLowerCase()}`;
    sessionStorage.setItem(key, JSON.stringify(data));
};

// ── Groq Provider ─────────────────────────────────────────────
const queryGroq = async (query) => {
    if (!GROQ_API_KEY) {
        console.warn('[SmartSearch] Groq API key not configured, skipping.');
        return null;
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    { role: 'user', content: buildPrompt(query) }
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.warn(`[SmartSearch] Groq failed (${response.status}):`, errText);
            return null;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) return null;

        return parseAIResponse(content);
    } catch (err) {
        console.warn('[SmartSearch] Groq error:', err.message);
        return null;
    }
};

// ── HuggingFace Provider ──────────────────────────────────────
const queryHuggingFace = async (query) => {
    if (!HF_API_KEY) {
        console.warn('[SmartSearch] HuggingFace API key not configured, skipping.');
        return null;
    }

    try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HF_API_KEY}`,
            },
            body: JSON.stringify({
                model: HF_MODEL,
                messages: [
                    { role: 'user', content: buildPrompt(query) }
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.warn(`[SmartSearch] HuggingFace failed (${response.status}):`, errText);
            return null;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) return null;

        return parseAIResponse(content);
    } catch (err) {
        console.warn('[SmartSearch] HuggingFace error:', err.message);
        return null;
    }
};

// ── Public API ────────────────────────────────────────────────

/**
 * Query AI providers in waterfall order.
 * Returns { titles: string[], provider: 'groq'|'huggingface'|null }
 */
export const querySmartSearchAI = async (query) => {
    // Check cache first
    const cached = getCache(query);
    if (cached) {
        console.log(`[SmartSearch AI Cache Hit] "${query}" → ${cached.provider}`);
        return cached;
    }

    // 1. Try Groq
    const groqTitles = await queryGroq(query);
    if (groqTitles) {
        const result = { titles: groqTitles, provider: 'groq' };
        setCache(query, result);
        console.log(`[SmartSearch] Groq returned ${groqTitles.length} titles`);
        return result;
    }

    // 2. Try HuggingFace
    const hfTitles = await queryHuggingFace(query);
    if (hfTitles) {
        const result = { titles: hfTitles, provider: 'huggingface' };
        setCache(query, result);
        console.log(`[SmartSearch] HuggingFace returned ${hfTitles.length} titles`);
        return result;
    }

    // 3. Both failed
    console.log('[SmartSearch] All AI providers failed, falling back to keyword parser');
    return { titles: null, provider: null };
};

/**
 * Check if any AI provider is configured.
 */
export const hasAIProvider = () => {
    return !!(GROQ_API_KEY || HF_API_KEY);
};
