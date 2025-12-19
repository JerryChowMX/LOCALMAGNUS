import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { GoogleCloudTtsProvider } from './providers';

interface TtsArticle {
    id: number | string;
    documentId: string;
    title: string;
    publishedAt: string | null;
    content_blocks: any[];
    tts_hash: string | null;
    tts_status: 'none' | 'pending' | 'ready' | 'error';
    tts_audio: any;
    tts_metadata: any;
    tts_last_error?: string;
}

/**
 * TtsService: Optimized for isolated execution and minimal DB writes.
 */
export default () => {
    const provider = new GoogleCloudTtsProvider();

    return {
        /**
         * Strips markdown formatting to plain text for TTS.
         */
        markdownToPlainText(md: string): string {
            return String(md)
                .replace(/```[\s\S]*?```/g, '')       // code fences
                .replace(/`[^`]*`/g, '')              // inline code
                .replace(/!\[[^\]]*]\([^)]*\)/g, '')  // images
                .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
                .replace(/[#>*_~\-]+/g, ' ')          // common md chars
                .replace(/\s+/g, ' ')
                .trim();
        },

        /**
         * Extracts spoken text from content blocks.
         * ONLY includes: rich-text body, quote text, quote author
         * EXCLUDES: captions, hero image, titles, UI elements
         */
        extractCanonicalText(blocks: any[]): string {
            if (!blocks || !Array.isArray(blocks)) return '';
            const parts: string[] = [];

            for (const block of blocks) {
                switch (block.__component) {
                    case 'content.rich-text': {
                        const content = block.content || '';
                        const plain = this.markdownToPlainText(content);
                        if (plain.trim()) parts.push(plain.trim());
                        break;
                    }
                    case 'content.quote': {
                        const quote = (block.quote_text || '').trim();
                        const author = (block.author || '').trim();
                        if (quote) parts.push(quote);
                        if (author) parts.push(author);
                        break;
                    }
                    // EXCLUDED: content.single-image captions, gallery captions, etc.
                }
            }

            // Join with paragraph breaks for natural pauses
            return this.normalizeText(parts.join('\n\n'));
        },

        normalizeText(text: string): string {
            return text.normalize('NFKD')
                .replace(/[\u2013\u2014]/g, '-')
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201C\u201D]/g, '"')
                .replace(/\u2026/g, '...')
                .replace(/\u00A0/g, ' ')
                .replace(/\s+/g, ' ').trim();
        },

        generateContentHash(text: string): string {
            return crypto.createHash('sha256').update(text).digest('hex');
        },

        async uploadToMediaLibrary(buffer: Buffer, fileName: string, mimeType: string) {
            try {
                strapi.log.info(`[TTS] LOUD: Uploading ${fileName} (${buffer.length} bytes) via HTTP`);

                // Use native Web API FormData with Blob (works with Node's fetch)
                const blob = new Blob([buffer], { type: mimeType });
                const formData = new globalThis.FormData();
                formData.append('files', blob, fileName);

                const internalUrl = process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337';

                const response = await fetch(`${internalUrl}/api/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Upload HTTP error ${response.status}: ${errorText}`);
                }

                const uploadedFiles = await response.json();
                const uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;

                strapi.log.info(`[TTS] LOUD: Upload complete for ${fileName}, file ID: ${uploadedFile?.id}`);
                return uploadedFile;
            } catch (uploadError: any) {
                strapi.log.error(`[TTS] LOUD: Upload failed for ${fileName}: ${uploadError.message}`);
                throw uploadError;
            }
        },

        async processTts(documentId: string, retryCount = 0, forceRegenerate = false) {
            const MAX_RETRIES = 5;
            const RETRY_DELAY_MS = 3000;

            strapi.log.info(`[TTS] LOUD: processTts for ${documentId} (attempt ${retryCount + 1})${forceRegenerate ? ' [FORCE]' : ''}`);

            try {
                const article = await (strapi as any).documents('api::article.article').findOne({
                    documentId,
                    status: 'published',
                    populate: ['content_blocks', 'tts_audio', 'tts_metadata'],
                }) as TtsArticle;

                if (!article) {
                    if (retryCount < MAX_RETRIES) {
                        strapi.log.warn(`[TTS] LOUD: Published version of ${documentId} not visible yet. Retrying in ${RETRY_DELAY_MS}ms...`);
                        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                        return this.processTts(documentId, retryCount + 1, forceRegenerate);
                    }
                    strapi.log.warn(`[TTS] LOUD: Article ${documentId} (published) not found after retries.`);
                    return;
                }

                const canonicalText = this.extractCanonicalText(article.content_blocks);
                const currentHash = this.generateContentHash(canonicalText);

                // If content hasn't changed and not forcing, we're done.
                if (!forceRegenerate && article.tts_status === 'ready' && article.tts_hash === currentHash && article.tts_audio) {
                    strapi.log.info(`[TTS] LOUD: Cache hit for ${documentId}.`);
                    return;
                }

                // IMMEDIATELY set to pending to prevent retry loops
                await (strapi as any).documents('api::article.article').update({
                    documentId,
                    status: 'published',
                    data: { tts_status: 'pending' }
                });
                strapi.log.info(`[TTS] LOUD: Status set to PENDING for ${documentId}`);

                strapi.log.info(`[TTS] LOUD: Synthesis START (${canonicalText.length} chars)`);

                // 2. EXTERNAL WORK - Synthesize
                let result;
                try {
                    result = await provider.synthesize(canonicalText);
                } catch (synthErr: any) {
                    // Log the full error object for better debugging
                    strapi.log.error(`[TTS] LOUD: PROVIDER ERROR:`, synthErr);
                    throw synthErr;
                }

                const { audioBuffer, wordTimings } = result;
                strapi.log.info(`[TTS] LOUD: Synthesis SUCCESS (${audioBuffer.length} bytes). Uploading...`);

                // 3. ASSET UPLOAD
                const audioFile = await this.uploadToMediaLibrary(audioBuffer, `tts_${documentId}.mp3`, 'audio/mpeg');
                const metadataFile = await this.uploadToMediaLibrary(Buffer.from(JSON.stringify(wordTimings)), `tts_${documentId}_meta.json`, 'application/json');

                // 4. ONE FINAL WRITE
                await (strapi as any).documents('api::article.article').update({
                    documentId,
                    status: 'published',
                    data: {
                        tts_status: 'ready',
                        tts_hash: currentHash,
                        tts_audio: audioFile.id,
                        tts_metadata: metadataFile.id,
                        tts_last_error: null
                    }
                });

                strapi.log.info(`[TTS] LOUD: COMPLETED for ${documentId}`);

            } catch (error: any) {
                const isLockError = error.message && (error.message.includes('Transaction') || error.message.includes('complete') || error.message.includes('locked'));

                if (isLockError && retryCount < MAX_RETRIES) {
                    strapi.log.warn(`[TTS] LOUD: DB LOCK. Retrying...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    return this.processTts(documentId, retryCount + 1);
                }

                const errMsg = error.message || String(error);
                strapi.log.error(`[TTS] LOUD: FINAL FAILURE for ${documentId}: ${errMsg}`);

                try {
                    await (strapi as any).documents('api::article.article').update({
                        documentId,
                        status: 'published',
                        data: { tts_status: 'error', tts_last_error: errMsg }
                    });
                } catch (e) { }
            }
        }
    };
};
