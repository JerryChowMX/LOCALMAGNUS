import React from 'react';
import './styles.css';

interface AiChatBarCollapsedProps {
    onClick: () => void;
    style?: React.CSSProperties;
    className?: string;
}

export const AiChatBarCollapsed: React.FC<AiChatBarCollapsedProps> = ({ onClick, style, className }) => {
    return (
        <div className={`ai-chat-bar-container ${className || ''}`} style={style}>
            <div className="ai-chat-bar-collapsed" onClick={onClick}>
                <span className="ai-chat-bar-placeholder">Pregúntale a MAGNUS...</span>
                <div className="ai-chat-bar-icon">
                    {/* Simple Arrow Icon */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
