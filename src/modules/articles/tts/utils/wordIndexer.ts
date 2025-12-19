/**
 * TTS Word Indexer
 * 
 * Pre-computes word indices for article content, matching the exact same
 * traversal order as the backend TTS extraction in tts.ts.
 * 
 * This solves the React render-order problem by calculating indices upfront.
 */

interface ContentBlock {
    __component?: string;
    content?: string;
    quote_text?: string;
    quote?: string;
    text?: string;
    author?: string;
    author_title?: string;
}

/**
 * Strip markdown formatting to plain text.
 * MUST EXACTLY MATCH backend tts.ts markdownToPlainText()
 */
export function markdownToPlainText(md: string): string {
    return String(md)
        .replace(/```[\s\S]*?```/g, '')       // code fences
        .replace(/`[^`]*`/g, '')              // inline code
        .replace(/!\[[^\]]*]\([^)]*\)/g, '')  // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
        .replace(/[#>*_~\-]+/g, ' ')          // common md chars
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Tokenize text into words using same regex as backend (/\S+/g).
 */
export function tokenizeWords(text: string): string[] {
    const matches = text.match(/\S+/g);
    return matches || [];
}

/**
 * Build a word index map from article content blocks.
 * Returns a Map from block index to { startIndex, wordCount }.
 * 
 * This matches the backend's extractCanonicalText traversal order:
 * 1. rich-text blocks (content field, markdown stripped)
 * 2. quote blocks (quote_text, then author)
 */
export function buildWordIndexMap(blocks: ContentBlock[]): {
    blockInfo: Map<number, { startIndex: number; wordCount: number }>;
    totalWordCount: number;
} {
    const blockInfo = new Map<number, { startIndex: number; wordCount: number }>();
    let currentIndex = 0;

    if (!blocks || !Array.isArray(blocks)) {
        return { blockInfo, totalWordCount: 0 };
    }

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const componentType = block.__component || '';
        const blockStartIndex = currentIndex;
        let blockWordCount = 0;

        // Count words based on block type (matching backend extraction)
        if (componentType === 'content.rich-text' || componentType === 'shared.rich-text') {
            const content = block.content || '';
            const plain = markdownToPlainText(content);
            if (plain.trim()) {
                const words = tokenizeWords(plain);
                blockWordCount = words.length;
                currentIndex += blockWordCount;
            }
        } else if (componentType === 'content.quote' || componentType === 'shared.quote') {
            // Support multiple field name variations (strapi schemas vary)
            const quoteText = (block.quote_text || block.quote || block.text || '').trim();
            const author = (block.author || block.author_title || '').trim();

            if (quoteText) {
                const quoteWords = tokenizeWords(quoteText);
                blockWordCount += quoteWords.length;
                currentIndex += quoteWords.length;
            }
            if (author) {
                const authorWords = tokenizeWords(author);
                blockWordCount += authorWords.length;
                currentIndex += authorWords.length;
            }
        }
        // Other block types are excluded from TTS (images, galleries, etc.)

        blockInfo.set(i, { startIndex: blockStartIndex, wordCount: blockWordCount });
    }

    console.log('[TTS-INDEXER] Built word map:', { totalWordCount: currentIndex, blocks: blockInfo.size });
    return { blockInfo, totalWordCount: currentIndex };
}

/**
 * Create a WordIndexContext for use in article rendering.
 * Each block gets a starting offset based on backend-order traversal.
 */
export function createWordIndexContext(blocks: ContentBlock[]) {
    const { blockInfo, totalWordCount } = buildWordIndexMap(blocks);

    return {
        getBlockStartIndex: (blockIndex: number) => blockInfo.get(blockIndex)?.startIndex ?? 0,
        getBlockWordCount: (blockIndex: number) => blockInfo.get(blockIndex)?.wordCount ?? 0,
        totalWordCount,
    };
}
