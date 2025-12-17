/**
 * aichat service
 */

import { factories } from '@strapi/strapi';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default factories.createCoreService('api::aichat.aichat', ({ strapi }) => ({
    async getStreamResponse({ message, articleContext, history = [] }: any) {
        try {
            const apiKey = process.env.GOOGLE_AI_API_KEY;
            if (!apiKey) {
                throw new Error('GOOGLE_AI_API_KEY is not configured');
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            // Construct System Prompt
            const systemPrompt = `
Eres MAGNUS, un asistente de IA para una plataforma de noticias mexicana.
Estás leyendo un artículo y ayudando al usuario a entenderlo.

CONTEXTO DEL ARTÍCULO:
Título: ${articleContext.title || 'Desconocido'}
Autor: ${articleContext.author || 'Desconocido'}
Fecha: ${articleContext.date || 'Desconocido'}
Contenido: ${articleContext.content || 'Sin contenido disponible'}

INSTRUCCIONES:
- Responde preguntas SOLO sobre este artículo específico
- Explica términos complejos en español sencillo
- Proporciona contexto cuando sea relevante
- Sé conciso y útil
- Si el usuario pregunta sobre temas que NO están en el artículo, responde EXACTAMENTE:
  "Eso está fuera de mi conocimiento, pero puedo ayudarte con preguntas sobre este artículo en particular."
`;

            // Transform history to Gemini format (user/model)
            const chatHistory = history.map((msg: any) => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }));

            // Initialize Chat
            const chat = model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: systemPrompt }],
                    },
                    ...chatHistory
                ],
            });

            // Send message and get stream
            const result = await chat.sendMessageStream(message);
            return result.stream;

        } catch (error) {
            strapi.log.error('AI Chat Service Error:', error);
            throw error;
        }
    }
}));
