import React from 'react';
import { Icons } from '../../../components/Icons';
import './VideoSideBar.css';

interface VideoSideBarProps {
    likeCount: number;
    isLiked: boolean;
    onLike?: () => void;
    onComment?: () => void;
    onReadArticle?: () => void;
    onShare?: () => void;
}

export const VideoSideBar: React.FC<VideoSideBarProps> = ({
    likeCount,
    isLiked,
    onLike,
    onComment,
    onReadArticle,
    onShare,
}) => {
    // Stop all events from bubbling to parent (VideoPlayer) to prevent pause
    const stopAllEvents = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="video-side-bar"
            onClick={stopAllEvents}
            onTouchStart={stopAllEvents}
            onTouchEnd={stopAllEvents}
            onMouseDown={stopAllEvents}
            onMouseUp={stopAllEvents}
        >
            {/* Like Button */}
            <button className="video-side-bar__btn" onClick={() => onLike?.()}>
                <Icons.heart
                    size={28}
                    strokeWidth={isLiked ? 0 : 1.5}
                    fill={isLiked ? '#ff3b30' : 'none'}
                    color={isLiked ? '#ff3b30' : '#fff'}
                />
                {likeCount > 0 && (
                    <span className="video-side-bar__count">{likeCount}</span>
                )}
            </button>

            {/* Comment Button */}
            <button className="video-side-bar__btn" onClick={() => onComment?.()}>
                <Icons.comment size={28} strokeWidth={1.5} />
            </button>

            {/* Read Article Button - Only shows if handler provided */}
            {onReadArticle && (
                <button className="video-side-bar__btn" onClick={() => onReadArticle()}>
                    <Icons.book size={28} strokeWidth={1.5} />
                </button>
            )}

            {/* Share Button */}
            <button className="video-side-bar__btn" onClick={() => onShare?.()}>
                <Icons.share size={28} strokeWidth={1.5} />
            </button>
        </div>
    );
};
