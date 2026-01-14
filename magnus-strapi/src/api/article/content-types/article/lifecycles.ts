import { GoogleGenerativeAI } from '@google/generative-ai';

const INTERNAL_URL = process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337';

async function generateKeywords(data: any) {
    try {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) return;

        // Skip if keywords already manually set (optional constraint, but good for overrides)
        // But usually we want to append or refresh. Let's just overwrite for now or only if empty.
        // Actually, let's always regenerate if content changes.

        let combinedText = data.title || '';

        if (data.content_blocks && Array.isArray(data.content_blocks)) {
            for (const block of data.content_blocks) {
                if (block.__component === 'content.rich-text' && block.content) combinedText += ' ' + block.content;
                if (block.__component === 'content.quote' && block.quote_text) combinedText += ' ' + block.quote_text;
            }
        }

        // Truncate to avoid token limits (Gemini has huge window but let's be safe/fast)
        const context = combinedText.substring(0, 50000);

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
        Analiza el siguiente artículo y genera una lista de 15 palabras clave o conceptos de búsqueda "ocultos".
        Deben incluir:
        - Sinónimos (ej: "coche" -> "auto", "vehículo")
        - Temas generales (ej: "fentanilo" -> "drogas", "salud pública", "crisis", "narcotráfico", "opioides")
        - Entidades relacionadas implícitas
        
        TEXTO:
        ${context}

        Responde SOLO con las palabras clave separadas por comas. Nada más.
        `;

        const result = await model.generateContent(prompt);
        const keywords = result.response.text().trim();

        // Clean up
        data.search_keywords = keywords;

    } catch (e) {
        strapi.log.error('❌ AI Keywords failed:' + e);
        // Do not throw, allow save to proceed
    }
}

function triggerWebhook(documentId: string) {
    // ... existing logic ...
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
    if (!result.publishedAt) return false;
    if (result.tts_status && result.tts_status !== 'none') {
        strapi.log.info(`[TTS] LOUD: Skipped (tts_status=${result.tts_status}) for ${result.documentId}`);
        return false;
    }
    return true;
}

export default {
    async beforeCreate(event) {
        const { data } = event.params;
        if (data.title && !data.slug) {
            data.slug = slugify(data.title);
        }
        if (data.content_blocks) {
            const wordCount = calculateWordCount(data.content_blocks);
            data.reading_time = Math.ceil(wordCount / 200) || 1;
        }
        if (!data.view_count) data.view_count = 0;

        await generateKeywords(data);
    },

    async beforeUpdate(event) {
        const { data } = event.params;
        if (data.content_blocks) {
            const wordCount = calculateWordCount(data.content_blocks);
            data.reading_time = Math.ceil(wordCount / 200) || 1;
        }

        // Only regenerate if title or content changes to save API calls
        // But detecting change in beforeUpdate needs the old data which is hard to get efficiently without query
        // For now, let's just do it. It's cheap.
        if (data.title || data.content_blocks) {
            await generateKeywords(data);
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
