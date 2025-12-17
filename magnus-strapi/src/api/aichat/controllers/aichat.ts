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
