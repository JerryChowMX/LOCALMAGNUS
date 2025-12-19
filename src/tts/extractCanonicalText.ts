/**
 * TTS Canonical Text Extraction
 * 
 * MUST match backend tts.ts EXACTLY - byte-for-byte compatibility required.
 * Pipeline version: 1.0.0
 */

const PIPELINE_VERSION = '1.0.0';

/**
 * Strips markdown formatting to plain text.
 * MUST match backend's markdownToPlainText exactly.
 */
export function markdownToPlainText(md: string): string {
    return String(md)
        .replace(/```[\s\S]*?```/g, '')           // code fences
        .replace(/`([^`]+)`/g, '$1')              // inline code → preserve text
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')     // images → remove
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')  // [text](url) → text
        .replace(/\*\*([^*]+)\*\*/g, '$1')        // **bold** → bold
        .replace(/\*([^*]+)\*/g, '$1')            // *italic* → italic
        .replace(/_([^_]+)_/g, '$1')              // _italic_ → italic
        .replace(/^#{1,6}\s*/gm, '')              // headers → remove markers
        .replace(/^[-*+]\s+/gm, '')               // list markers → remove
        .replace(/^\d+\.\s+/gm, '')               // numbered lists → remove
        .replace(/^>\s*/gm, '')                   // blockquotes → remove marker
        .replace(/\n+/g, ' ')                     // newlines → space
        .replace(/\s+/g, ' ')                     // collapse whitespace
        .trim();
}

/**
 * Normalizes text for TTS consistency.
 * Uses NFC (canonical composition) - MUST match backend exactly.
 */
export function normalizeText(text: string): string {
    return text.normalize('NFC')
        .replace(/[\u2013\u2014]/g, '-')          // en-dash, em-dash → hyphen
        .replace(/[\u2018\u2019]/g, "'")          // smart single quotes → straight
        .replace(/[\u201C\u201D]/g, '"')          // smart double quotes → straight
        .replace(/\u2026/g, '...')                // ellipsis → three dots
        .replace(/\u00A0/g, ' ')                  // non-breaking space → space
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Content block type (matches Strapi structure)
 */
interface ContentBlock {
    __component: string;
    id?: string | number;
    content?: string;
    quote_text?: string;
    author?: string;
    [key: string]: unknown;
}

/**
 * Extracts canonical text from article blocks.
 * MUST match backend's extractCanonicalTextWithRanges exactly.
 * 
 * Block inclusion:
 *   ✅ content.rich-text → content field
 *   ✅ content.quote → quote_text + author
 *   ❌ Everything else (titles, captions, images, etc.)
 */
export function extractCanonicalText(blocks: ContentBlock[]): string {
    if (!blocks || !Array.isArray(blocks)) return '';

    const parts: string[] = [];

    for (const block of blocks) {
        switch (block.__component) {
            case 'content.rich-text': {
                const content = block.content || '';
                const plain = markdownToPlainText(content);
                const normalized = normalizeText(plain);
                if (normalized) {
                    parts.push(normalized);
                }
                break;
            }
            case 'content.quote': {
                const quote = normalizeText(block.quote_text || '');
                const author = normalizeText(block.author || '');
                if (quote) parts.push(quote);
                if (author) parts.push(author);
                break;
            }
            // EXCLUDED: content.single-image, content.gallery, etc.
        }
    }

    // Join with single space (parts already normalized)
    return parts.join(' ');
}

/**
 * Tokenizes text using the pipeline contract regex.
 */
export function tokenize(text: string): string[] {
    return text.match(/\S+/g) || [];
}

/**
 * Returns pipeline version for verification.
 */
export function getPipelineVersion(): string {
    return PIPELINE_VERSION;
}
