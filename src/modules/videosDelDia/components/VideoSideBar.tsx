import React from 'react';
import { Icons } from '../../../components/Icons';
import './VideoSideBar.css';

interface VideoSideBarProps {
    onLike?: () => void;
    onComment?: () => void;
    onShare?: () => void;
}

export const VideoSideBar: React.FC<VideoSideBarProps> = ({
    onLike,
    onComment,
    onShare,
}) => {
    return (
        <div className="video-side-bar">
            {/* Like Button */}
            <button className="video-side-bar__btn" onClick={(e) => { e.stopPropagation(); onLike?.(); }}>
                <Icons.heart size={28} strokeWidth={1.5} />
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
