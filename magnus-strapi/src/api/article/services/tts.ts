import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { GoogleCloudTtsProvider } from './providers';

interface TtsArticle {
    id: number | string;
    title: string;
    publishedAt: string | null;
    content_blocks: any[];
    tts_hash: string | null;
    tts_status: 'none' | 'pending' | 'ready' | 'error';
    tts_last_error?: string;
}

/**
 * TtsService: Handles the logic for generating audio and word-level timings.
 */
export default () => {
    const provider = new GoogleCloudTtsProvider();

    return {
        /**
         * Extracts and normalizes text from article content blocks.
         * Matches the frontend TtsEngine.normalizeText logic.
         */
        extractCanonicalText(blocks: any[]): string {
            if (!blocks || !Array.isArray(blocks)) return '';

            let rawText = '';
            for (const block of blocks) {
                switch (block.__component) {
                    case 'content.rich-text':
                        if (block.content) rawText += block.content + ' ';
                        break;
                    case 'content.quote':
                        if (block.quote_text) rawText += block.quote_text + ' ';
                        break;
                    case 'content.single-image':
                        if (block.hero_image_caption) rawText += block.hero_image_caption + ' ';
                        break;
                    // Add other components as they are added to the Article schema
                    default:
                        break;
                }
            }

            return this.normalizeText(rawText);
        },

        /**
         * Normalization logic must exactly match the frontend.
         */
        normalizeText(text: string): string {
            return text
                .normalize('NFKD')
                .replace(/[\u2013\u2014]/g, '-')
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201C\u201D]/g, '"')
                .replace(/\u2026/g, '...')
                .replace(/\u00A0/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        },

        /**
         * Generates a hash for the content to detect changes.
         */
        generateContentHash(text: string): string {
            return crypto.createHash('sha256').update(text).digest('hex');
        },

        /**
         * Helper to upload a buffer to Strapi Media Library.
         */
        async uploadToMediaLibrary(buffer: Buffer, fileName: string, mimeType: string) {
            const tmpPath = path.join(os.tmpdir(), fileName);
            fs.writeFileSync(tmpPath, buffer);

            try {
                const stats = fs.statSync(tmpPath);
                const [uploadedFile] = await (strapi as any).plugin('upload').service('upload').upload({
                    data: {},
                    files: {
                        path: tmpPath,
                        name: fileName,
                        type: mimeType,
                        size: stats.size,
                    },
                });
                return uploadedFile;
            } finally {
                if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
            }
        },

        /**
         * Main entry point for starting the TTS generation job.
         * Triggered by article lifecycle hooks.
         */
        async processTts(articleId: number | string) {
            // We cast to any first then to our interface to bypass the complex generated union types
            const articleRaw = await (strapi.entityService as any).findOne('api::article.article', articleId, {
                populate: ['content_blocks'],
            });

            const article = articleRaw as TtsArticle;

            if (!article || !article.publishedAt) return;

            const canonicalText = this.extractCanonicalText(article.content_blocks);
            const currentHash = this.generateContentHash(canonicalText);

            // Skip if content hasn't changed
            if (article.tts_hash === currentHash && article.tts_status === 'ready') {
                return;
            }

            console.log(`[TTS] Starting generation for article ${articleId}...`);

            try {
                await (strapi.entityService as any).update('api::article.article', articleId, {
                    data: {
                        tts_status: 'pending',
                        tts_hash: currentHash,
                    } as any,
                });

                // 1. Synthesize Speech
                const { audioBuffer, wordTimings } = await provider.synthesize(canonicalText);

                // 2. Upload Audio
                const audioFile = await this.uploadToMediaLibrary(
                    audioBuffer,
                    `tts_article_${articleId}.mp3`,
                    'audio/mpeg'
                );

                // 3. Upload Metadata
                const metadataBuffer = Buffer.from(JSON.stringify(wordTimings));
                const metadataFile = await this.uploadToMediaLibrary(
                    metadataBuffer,
                    `tts_article_${articleId}_timings.json`,
                    'application/json'
                );

                // 4. Update Article with Assets
                await (strapi.entityService as any).update('api::article.article', articleId, {
                    data: {
                        tts_status: 'ready',
                        tts_audio: audioFile.id,
                        tts_metadata: metadataFile.id,
                    } as any,
                });

                console.log(`[TTS] Success for article ${articleId}`);

            } catch (error: any) {
                console.error(`[TTS] Failed for article ${articleId}:`, error);
                await (strapi.entityService as any).update('api::article.article', articleId, {
                    data: {
                        tts_status: 'error',
                        tts_last_error: error.message,
                    } as any,
                });
            }
        }
    };
};
