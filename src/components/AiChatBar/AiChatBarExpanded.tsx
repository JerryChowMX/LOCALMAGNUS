import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Display } from '../Typography/Typography';
import { useAiChat } from '../../hooks/useAiChat';
import type { AiChatUsedProps } from '../../lib/analytics';
import './AiChatBar.css';

import type { ArticleContext } from '../../hooks/useAiChat';

interface AiChatBarExpandedProps {
    onClose: () => void;
    context?: AiChatUsedProps['context'];
    article?: ArticleContext;
}

export const AiChatBarExpanded: React.FC<AiChatBarExpandedProps> = ({ onClose, context, article }) => {
    const { input, setInput, messages, sendMessage, isTyping } = useAiChat(context, article);
    // Suggestions are visible by default if there are no user messages, otherwise hidden
    const [showSuggestions, setShowSuggestions] = React.useState(messages.length <= 1);

    const handleSendMessage = (text?: string) => {
        sendMessage(text);
        setShowSuggestions(false);
    };

    const toggleSuggestions = () => {
        setShowSuggestions(!showSuggestions);
    };

    return (
        <div className="ai-chat-modal-overlay" onClick={onClose}>
            <div className="ai-chat-modal-content" onClick={e => e.stopPropagation()}>
                <div className="ai-chat-header">
                    <Display>MAGNUS</Display>
                    <button onClick={onClose} className="ai-chat-modal-close">&times;</button>
                </div>

                <div className="ai-chat-body">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message-bubble ${msg.sender === 'user' ? 'message-user' : 'message-ai'}`}>
                            {msg.sender === 'user' ? (
                                msg.text
                            ) : (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ children }) => <p style={{ margin: '0 0 12px 0' }}>{children}</p>,
                                        ul: ({ children }) => <ul style={{ margin: '0 0 12px 16px', padding: 0 }}>{children}</ul>,
                                        ol: ({ children }) => <ol style={{ margin: '0 0 12px 16px', padding: 0 }}>{children}</ol>,
                                        li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                                        strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message-bubble message-ai">
                            ...
                        </div>
                    )}
                </div>

                <div className="ai-chat-footer">
                    {/* Suggestions Toggle */}
                    {!showSuggestions && (
                        <button onClick={toggleSuggestions} className="ai-suggestions-toggle">
                            Sugerencias
                        </button>
                    )}

                    {/* Quick Actions */}
                    {showSuggestions && (
                        <div className="ai-quick-actions">
                            <button
                                className="ai-quick-action-chip"
                                onClick={() => handleSendMessage('Dame los puntos clave del artículo.')}
                            >
                                <span className="ai-chip-title">Resumen Ejecutivo</span>
                            </button>
                            <button
                                className="ai-quick-action-chip"
                                onClick={() => handleSendMessage('Explícame el impacto real de esta noticia.')}
                            >
                                <span className="ai-chip-title">¿Por qué importa?</span>
                            </button>
                            <button
                                className="ai-quick-action-chip"
                                onClick={() => handleSendMessage('Dímelo como si no fuera experto.')}
                            >
                                <span className="ai-chip-title">Explícalo en modo fácil</span>
                            </button>
                            <button
                                className="ai-quick-action-chip"
                                onClick={() => handleSendMessage('Dame la versión ultra corta.')}
                            >
                                <span className="ai-chip-title">Explícalo en un minuto</span>
                            </button>
                        </div>
                    )}

                    <div className="ai-chat-input-wrapper">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Escribe tu pregunta..."
                            className="ai-chat-input"
                        />
                        <button onClick={() => handleSendMessage()} className="ai-chat-send-button">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    {!messages.some(m => m.sender === 'user') && (
                        <div className="ai-chat-disclaimer">
                            MAGNUS puede cometer errores, revisa sus respuestas.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
