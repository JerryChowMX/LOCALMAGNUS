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
         * MUST match frontend's markdownToPlainText exactly.
         * Pipeline version: 1.0.0
         */
        markdownToPlainText(md: string): string {
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
        },

        /**
         * Extracts spoken text from content blocks.
         * ONLY includes: rich-text body, quote text, quote author
         * EXCLUDES: captions, hero image, titles, UI elements
         * 
         * Returns both canonical text AND block ranges for frontend sync.
         */
        extractCanonicalTextWithRanges(blocks: any[]): {
            canonicalText: string;
            blockRanges: Array<{ blockId: string; fieldPath: string; startToken: number; tokenCount: number }>;
        } {
            if (!blocks || !Array.isArray(blocks)) {
                return { canonicalText: '', blockRanges: [] };
            }

            const parts: string[] = [];
            const blockRanges: Array<{ blockId: string; fieldPath: string; startToken: number; tokenCount: number }> = [];
            let currentToken = 0;

            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i];
                const blockId = block.id?.toString() || `block-${i}`;

                switch (block.__component) {
                    case 'content.rich-text': {
                        const content = block.content || '';
                        const plain = this.markdownToPlainText(content);
                        const normalized = this.normalizeText(plain);
                        if (normalized) {
                            const tokens = normalized.match(/\S+/g) || [];
                            blockRanges.push({
                                blockId,
                                fieldPath: 'content',
                                startToken: currentToken,
                                tokenCount: tokens.length
                            });
                            currentToken += tokens.length;
                            parts.push(normalized);
                        }
                        break;
                    }
                    case 'content.quote': {
                        const quote = this.normalizeText(block.quote_text || '');
                        const author = this.normalizeText(block.author || '');

                        if (quote) {
                            const quoteTokens = quote.match(/\S+/g) || [];
                            blockRanges.push({
                                blockId,
                                fieldPath: 'quote_text',
                                startToken: currentToken,
                                tokenCount: quoteTokens.length
                            });
                            currentToken += quoteTokens.length;
                            parts.push(quote);
                        }

                        if (author) {
                            const authorTokens = author.match(/\S+/g) || [];
                            blockRanges.push({
                                blockId,
                                fieldPath: 'author',
                                startToken: currentToken,
                                tokenCount: authorTokens.length
                            });
                            currentToken += authorTokens.length;
                            parts.push(author);
                        }
                        break;
                    }
                    // EXCLUDED: content.single-image captions, gallery captions, etc.
                }
            }

            // Join with spaces (already normalized)
            const canonicalText = parts.join(' ');
            return { canonicalText, blockRanges };
        },

        /**
         * Legacy wrapper for backward compatibility
         */
        extractCanonicalText(blocks: any[]): string {
            return this.extractCanonicalTextWithRanges(blocks).canonicalText;
        },

        /**
         * Normalizes text for TTS consistency.
         * Uses NFC (canonical composition) - MUST match frontend exactly.
         * Pipeline version: 1.0.0
         */
        normalizeText(text: string): string {
            return text.normalize('NFC')
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
            const PIPELINE_VERSION = '1.0.0';

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

                // Extract canonical text WITH block ranges for frontend sync
                const { canonicalText, blockRanges } = this.extractCanonicalTextWithRanges(article.content_blocks);
                const currentHash = this.generateContentHash(canonicalText);
                const tokenCount = (canonicalText.match(/\S+/g) || []).length;

                strapi.log.info(`[TTS] LOUD: Extracted ${tokenCount} tokens from ${blockRanges.length} blocks`);

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
                strapi.log.info(`[TTS] LOUD: Synthesis SUCCESS (${audioBuffer.length} bytes, ${wordTimings.length} word timings)`);

                // CRITICAL VALIDATION: Token count must match word timings
                if (wordTimings.length !== tokenCount) {
                    const mismatchError = `Token count mismatch: extracted ${tokenCount} tokens but Google returned ${wordTimings.length} timings`;
                    strapi.log.error(`[TTS] LOUD: ${mismatchError}`);

                    await (strapi as any).documents('api::article.article').update({
                        documentId,
                        status: 'published',
                        data: {
                            tts_status: 'error',
                            tts_last_error: mismatchError
                        }
                    });
                    return; // DO NOT ship broken metadata
                }

                strapi.log.info(`[TTS] LOUD: Token validation PASSED (${tokenCount} tokens)`);

                // 3. BUILD ENHANCED METADATA with contract fields
                const enhancedMetadata = {
                    wordTimings,
                    canonicalText,
                    tokenCount,
                    pipelineVersion: PIPELINE_VERSION,
                    canonicalTextHash: currentHash,
                    blockRanges
                };

                // 4. ASSET UPLOAD
                const audioFile = await this.uploadToMediaLibrary(audioBuffer, `tts_${documentId}.mp3`, 'audio/mpeg');
                const metadataFile = await this.uploadToMediaLibrary(
                    Buffer.from(JSON.stringify(enhancedMetadata)),
                    `tts_${documentId}_meta.json`,
                    'application/json'
                );

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
