export default {
    beforeCreate(event) {
        const { data } = event.params;

        // 1. Auto-generate slug if missing
        if (data.title && !data.slug) {
            data.slug = slugify(data.title);
        }

        // 2. Calculate reading time
        if (data.content_blocks) {
            const wordCount = calculateWordCount(data.content_blocks);
            // Avg reading speed: 200 words per minute
            data.reading_time = Math.ceil(wordCount / 200) || 1;
        }

        // 4. Update view count if missing
        if (!data.view_count) data.view_count = 0;
    },

    beforeUpdate(event) {
        const { data } = event.params;

        // 2. Recalculate reading time if content changed
        if (data.content_blocks) {
            const wordCount = calculateWordCount(data.content_blocks);
            data.reading_time = Math.ceil(wordCount / 200) || 1;
        }
    },
};

function calculateWordCount(blocks: any[]) {
    if (!blocks || !Array.isArray(blocks)) return 0;

    let text = '';

    for (const block of blocks) {
        if (block.__component === 'content.rich-text' && block.content) {
            text += block.content + ' ';
        }
        if (block.__component === 'content.quote' && block.quote_text) {
            text += block.quote_text + ' ';
        }
    }

    // Basic split by whitespace
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
}
