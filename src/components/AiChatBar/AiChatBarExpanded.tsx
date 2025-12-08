import React from 'react';
import { Display } from '../Typography/Typography';
import { useAiChat } from '../../hooks/useAiChat';
import type { AiChatUsedProps } from '../../lib/analytics';
import './styles.css';
import './AiChatBarExpanded.css';

interface AiChatBarExpandedProps {
    onClose: () => void;
    context?: AiChatUsedProps['context'];
}

export const AiChatBarExpanded: React.FC<AiChatBarExpandedProps> = ({ onClose, context }) => {
    const { input, setInput, messages, sendMessage, isTyping } = useAiChat(context);

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
                            {msg.text}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message-bubble message-ai">
                            ...
                        </div>
                    )}
                </div>

                <div className="ai-chat-footer">
                    <div className="ai-chat-bar-collapsed ai-chat-input-wrapper">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Escribe tu pregunta..."
                            className="ai-chat-input"
                        />
                        <button onClick={sendMessage} className="ai-chat-send-button">
                            <div className="ai-chat-bar-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>
                    {!messages.some(m => m.sender === 'user') && (
                        <div className="ai-chat-disclaimer">
                            MAGNUS puede cometer errores, por favor revisa sus respuestas.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
