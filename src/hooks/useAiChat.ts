import { useState, useCallback, useEffect, useRef } from 'react';
import { trackAiChatUsed, type AiChatUsedProps } from '../lib/analytics';
import { STRAPI_ORIGIN } from '../lib/env';

export interface ChatMessage {
    text: string;
    sender: 'user' | 'ai';
    timestamp: number;
}

export interface ArticleContext {
    title: string;
    author: string;
    date: string;
    content: string;
    summary?: string;
}

export const useAiChat = (context: AiChatUsedProps['context'] = 'global', articleContext?: ArticleContext) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            text: 'Hola, soy Magnus. ¿En qué puedo ayudarte hoy?',
            sender: 'ai',
            timestamp: Date.now()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const sendMessage = useCallback(async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        const userMessage: ChatMessage = {
            text: textToSend,
            sender: 'user',
            timestamp: Date.now()
        };

        // Update UI with user message
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Track usage
        trackAiChatUsed(context, textToSend.length);

        try {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            const response = await fetch(`${STRAPI_ORIGIN}/api/aichats/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: textToSend,
                    articleContext: articleContext || {},
                    history: messages.slice(-10) // Send last 10 messages for context
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            // Create a placeholder for the AI response
            const aiResponseTimestamp = Date.now();
            setMessages(prev => [...prev, {
                text: '',
                sender: 'ai',
                timestamp: aiResponseTimestamp
            }]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.text) {
                                accumulatedText += parsed.text;
                                // Update the last message (AI response) with accumulated text
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    const lastMsg = newMessages[newMessages.length - 1];
                                    if (lastMsg.sender === 'ai' && lastMsg.timestamp === aiResponseTimestamp) {
                                        lastMsg.text = accumulatedText;
                                    }
                                    return newMessages;
                                });
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }

        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('AI Chat Error:', error);
                setMessages(prev => [...prev, {
                    text: 'Lo siento, tuve un problema al procesar tu solicitud. Por favor intenta de nuevo.',
                    sender: 'ai',
                    timestamp: Date.now()
                }]);
            }
        } finally {
            setIsTyping(false);
            abortControllerRef.current = null;
        }
    }, [input, context, articleContext, messages]);

    return {
        input,
        setInput,
        messages,
        sendMessage,
        isTyping
    };
};
