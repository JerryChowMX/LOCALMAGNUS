export interface ArticleBlock {
    __component?: string;
    __typename?: string;
    type?: string;
    blocks?: any[];
    text?: string;
    quote?: string;
    author?: string;
    caption?: string;
    title?: string;
    [key: string]: any;
}

/**
 * Extracts plain text from Strapi article blocks for AI context.
 */
export const extractTextFromBlocks = (blocks: ArticleBlock[]): string => {
    if (!Array.isArray(blocks)) return '';

    const getRichText = (nodes: any[]): string => {
        if (!Array.isArray(nodes)) return '';
        return nodes.map((n: any) => {
            if (n.type === 'paragraph' || n.type === 'heading') {
                return n.children?.map((c: any) => c.text).join('') || '';
            }
            if (n.type === 'list') {
                return n.children?.map((li: any) => li.children?.map((c: any) => c.text).join('')).join('\n') || '';
            }
            return '';
        }).join('\n');
    };

    return blocks.map(block => {
        const type = block.__component || block.__typename || block.type;

        // 1. JSON-based Rich Text (blocks array)
        if (block.blocks && Array.isArray(block.blocks)) {
            return getRichText(block.blocks);
        }

        // 2. String-based Rich Text (Markdown/HTML)
        // Strapi often uses 'content', 'text', 'body', or 'rich_text'
        const stringContent = block.content || block.text || block.body || block.rich_text || block.quote;
        if (typeof stringContent === 'string') {
            // If it's a quote, format it
            if (type?.includes('quote') || block.quote) {
                return `"${stringContent}" - ${block.author || ''}`;
            }
            return stringContent;
        }

        // 3. Captions for media context
        if (block.caption) return `[Imagen: ${block.caption}]`;

        return '';
    }).filter(Boolean).join('\n\n');
};
