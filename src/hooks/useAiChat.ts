import { useState, useCallback, useEffect } from 'react';
import { trackAiChatUsed, type AiChatUsedProps } from '../lib/analytics';

export interface ChatMessage {
    text: string;
    sender: 'user' | 'ai';
    timestamp: number;
}

export const useAiChat = (context: AiChatUsedProps['context'] = 'global') => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            text: 'Hola, soy Magnus. ¿En qué puedo ayudarte hoy?',
            sender: 'ai',
            timestamp: Date.now()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            // No specific cleanup needed for the current simple timeout, 
            // but good practice if we had a ref to the timer.
        };
    }, []);

    const sendMessage = useCallback(() => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            text: input,
            sender: 'user',
            timestamp: Date.now()
        };

        // Track usage
        trackAiChatUsed(context, input.length);

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Mock AI response
        // In a real app, this would be an API call
        setTimeout(() => {
            const aiMessage: ChatMessage = {
                text: 'Esta es una respuesta simulada de Magnus AI.',
                sender: 'ai',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1000);
    }, [input, context]);

    return {
        input,
        setInput,
        messages,
        sendMessage,
        isTyping
    };
};
