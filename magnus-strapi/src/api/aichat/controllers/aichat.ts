/**
 * aichat controller
 */

import { factories } from '@strapi/strapi';
import { PassThrough } from 'stream';

export default factories.createCoreController('api::aichat.aichat', ({ strapi }) => ({
    async ping(ctx) {
        ctx.send({ message: 'pong' });
    },

    async chat(ctx) {
        const { message, articleContext, history } = ctx.request.body;

        if (!message || !articleContext) {
            return ctx.badRequest('Message and Article Context are required');
        }

        // Prompt length validation - prevent cost abuse via large prompts
        const MAX_MESSAGE_LENGTH = 1000;
        const MAX_ARTICLE_CONTEXT_LENGTH = 10000;

        if (typeof message !== 'string' || message.length > MAX_MESSAGE_LENGTH) {
            return ctx.badRequest(`Message must be a string with max ${MAX_MESSAGE_LENGTH} characters`);
        }

        if (typeof articleContext !== 'string' || articleContext.length > MAX_ARTICLE_CONTEXT_LENGTH) {
            return ctx.badRequest(`Article context must be a string with max ${MAX_ARTICLE_CONTEXT_LENGTH} characters`);
        }

        try {
            // Get the stream from the service
            const stream = await strapi.service('api::aichat.aichat').getStreamResponse({
                message,
                articleContext,
                history
            });

            // Set headers for SSE
            ctx.set({
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            });

            // Bypass Koa's built-in response handling to stream directly
            ctx.status = 200;
            const passThrough = new PassThrough();
            ctx.body = passThrough;

            // Iterate through the stream and write to the response
            for await (const chunk of stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                    // Send data as SSE event
                    passThrough.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
                }
            }

            // End the stream
            passThrough.write('data: [DONE]\n\n');
            passThrough.end();

        } catch (error) {
            strapi.log.error('AI Chat Controller Error:', error);
            ctx.throw(500, 'Failed to process AI request');
        }
    }
}));
