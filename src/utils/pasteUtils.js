/**
 * pasteUtils.js
 * ═══════════════════════════════════════════════════════════════
 * Shared paste handler factory for single-line chat inputs.
 *
 * - Extracts only plain text from the clipboard.
 * - Inserts at the caret / selection instead of replacing the input.
 * - Flattens multi-line clips to one line (inputs are single-line).
 * - Never hijacks the event when there is no text (e.g. images),
 *   so the browser's default behavior still applies.
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Build an onPaste handler bound to a controlled input's setter.
 * @param {Function} setValue - State setter for the input value (supports functional updates).
 * @returns {(e: React.ClipboardEvent<HTMLInputElement>) => void}
 */
export const createPasteHandler = (setValue) => (e) => {
    const raw = e.clipboardData?.getData('text/plain') ?? '';

    // No usable text (image, empty or whitespace-only clip):
    // do NOT preventDefault — let the browser handle it gracefully.
    if (!raw.trim()) return;

    e.preventDefault();

    // Single-line input: collapse line breaks into spaces.
    const clean = raw.replace(/\s*\r?\n\s*/g, ' ').trim();
    if (!clean) return;

    const el = e.currentTarget;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    // Insert at caret/selection, preserving text around it.
    setValue((prev) => {
        const before = prev.slice(0, Math.min(start, prev.length));
        const after = prev.slice(Math.min(end, prev.length));
        return before + clean + after;
    });

    // Restore caret position after React commits the new value.
    requestAnimationFrame(() => {
        try {
            const caret = start + clean.length;
            el.focus();
            el.setSelectionRange(caret, caret);
        } catch {
            /* element disabled or unmounted */
        }
    });
};
