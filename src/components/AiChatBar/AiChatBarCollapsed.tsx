import React from 'react';
import { SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import './AiChatBarCollapsed.css';

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
    commentCount = 12,
    style,
    className
}) => {
    return (
        <div className={`chatBarContainer ${className || ''}`} style={style}>
            {/* Chat Section with Tech Glow Gradient */}
            <button className="chatButton" onClick={onChatClick}>
                <div className="chatIconWrapper">
                    <SparklesIcon style={{ width: '20px', height: '20px' }} />
                </div>
                <span className="chatLabel">Chatear</span>
            </button>

            {/* Divider */}
            <div className="divider"></div>

            {/* Comments Section */}
            <button className="commentsButton" onClick={onCommentsClick}>
                <ChatBubbleLeftRightIcon style={{ width: '20px', height: '20px' }} />
                <span>Comentar</span>
            </button>
        </div>
    );
};
