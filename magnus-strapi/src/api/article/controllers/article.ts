/**
 * article controller
 */

import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
    async processTts(ctx) {
        const secret = ctx.request.headers['x-tts-secret'];
        if (!secret || secret !== process.env.TTS_WEBHOOK_SECRET) {
            strapi.log.warn('[TTS] Unauthorized webhook attempt detected.');
            throw new errors.UnauthorizedError('Invalid TTS secret');
        }

        const documentId = String(ctx.request.query.docId || '');
        if (!documentId) {
            throw new errors.ValidationError('Missing docId');
        }

        strapi.log.info(`[TTS] Firewall passed. Triggering isolated synthesis for ${documentId}`);

        // Fire-and-forget inside the NEW request context.
        // This is perfectly isolated from the original Publish call.
        (strapi.service('api::article.tts') as any).processTts(documentId).catch((err: any) => {
            strapi.log.error(`[TTS] Isolated synthesis failed for ${documentId}: ${err.message}`);
        });

        ctx.body = { ok: true, message: 'Synthesis triggered' };
    },
}));
