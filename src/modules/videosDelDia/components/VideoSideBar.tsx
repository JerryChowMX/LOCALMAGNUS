import React from 'react';
import { Icons } from '../../../components/Icons';
import './VideoSideBar.css';

interface VideoSideBarProps {
    likeCount: number;
    isLiked: boolean;
    onLike?: () => void;
    onComment?: () => void;
    onShare?: () => void;
}

export const VideoSideBar: React.FC<VideoSideBarProps> = ({
    likeCount,
    isLiked,
    onLike,
    onComment,
    onShare,
}) => {
    return (
        <div className="video-side-bar">
            {/* Like Button */}
            <button className="video-side-bar__btn" onClick={(e) => { e.stopPropagation(); onLike?.(); }}>
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
            <button className="video-side-bar__btn" onClick={(e) => { e.stopPropagation(); onComment?.(); }}>
                <Icons.comment size={28} strokeWidth={1.5} />
            </button>

            {/* Share Button */}
            <button className="video-side-bar__btn" onClick={(e) => { e.stopPropagation(); onShare?.(); }}>
                <Icons.share size={28} strokeWidth={1.5} />
            </button>
        </div>
    );
};
