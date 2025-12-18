const INTERNAL_URL = process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337';

function triggerWebhook(documentId: string) {
    setTimeout(() => {
        fetch(`${INTERNAL_URL}/api/articles/process-tts?docId=${encodeURIComponent(documentId)}`, {
            method: 'POST',
            headers: {
                'x-tts-secret': process.env.TTS_WEBHOOK_SECRET || '',
                'content-type': 'application/json',
            },
        })
            .then(res => {
                if (!res.ok) return res.text().then(text => { throw new Error(text) });
                return res.json();
            })
            .then(data => {
                strapi.log.info(`[TTS] LOUD: Webhook successful for ${documentId}`);
            })
            .catch((e) => {
                strapi.log.error(`[TTS] LOUD: Webhook call failed for ${documentId}: ${e?.message ?? e}`);
            });
    }, 5000);
}

function shouldTriggerTts(result: any): boolean {
    // Skip if not published
    if (!result.publishedAt) return false;

    // ONLY trigger when tts_status is 'none' or not set
    // Skip for 'pending', 'ready', AND 'error' to prevent loops
    if (result.tts_status && result.tts_status !== 'none') {
        strapi.log.info(`[TTS] LOUD: Skipped (tts_status=${result.tts_status}) for ${result.documentId}`);
        return false;
    }

    return true;
}

export default {
    beforeCreate(event) {
        const { data } = event.params;
        if (data.title && !data.slug) {
            data.slug = slugify(data.title);
        }
        if (data.content_blocks) {
            const wordCount = calculateWordCount(data.content_blocks);
            data.reading_time = Math.ceil(wordCount / 200) || 1;
        }
        if (!data.view_count) data.view_count = 0;
    },

    beforeUpdate(event) {
        const { data } = event.params;
        if (data.content_blocks) {
            const wordCount = calculateWordCount(data.content_blocks);
            data.reading_time = Math.ceil(wordCount / 200) || 1;
        }
    },

    afterCreate(event) {
        const { result } = event;

        if (shouldTriggerTts(result)) {
            strapi.log.info('--------------------------------------------------');
            strapi.log.info(`[TTS] LOUD: AFTER_CREATE for docId=${result.documentId} - Scheduling synthesis`);
            triggerWebhook(result.documentId);
        }
    },

    afterUpdate(event) {
        const { result } = event;

        if (shouldTriggerTts(result)) {
            strapi.log.info('--------------------------------------------------');
            strapi.log.info(`[TTS] LOUD: AFTER_UPDATE for docId=${result.documentId} - Scheduling synthesis`);
            triggerWebhook(result.documentId);
        }
    },
};

function calculateWordCount(blocks: any[]) {
    if (!blocks || !Array.isArray(blocks)) return 0;
    let text = '';
    for (const block of blocks) {
        if (block.__component === 'content.rich-text' && block.content) text += block.content + ' ';
        if (block.__component === 'content.quote' && block.quote_text) text += block.quote_text + ' ';
    }
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function slugify(text: string) {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
