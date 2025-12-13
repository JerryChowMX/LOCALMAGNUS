import React from 'react';
import { SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import './AiChatBar.css';

interface AiChatBarCollapsedProps {
    onChatClick?: () => void;
    onCommentsClick?: () => void;
    commentCount?: number;
    style?: React.CSSProperties;
    className?: string;
}

export const AiChatBarCollapsed: React.FC<AiChatBarCollapsedProps> = ({
    onChatClick,
    onCommentsClick,
    style,
    className
}) => {
    return (
        <div className={`ai-chat-bar-container ${className || ''}`} style={style}>
            {/* Chat Section */}
            <button className="ai-chat-button" onClick={onChatClick}>
                <div className="ai-chat-icon-wrapper">
                    <SparklesIcon style={{ width: '20px', height: '20px' }} />
                </div>
                <span className="chatLabel">Chatear</span>
            </button>

            {/* Divider */}
            <div className="ai-chat-divider"></div>

            {/* Comments Section */}
            <button className="ai-comments-button" onClick={onCommentsClick}>
                <ChatBubbleLeftRightIcon style={{ width: '20px', height: '20px' }} />
                <span>Comentar</span>
            </button>
        </div>
    );
};
