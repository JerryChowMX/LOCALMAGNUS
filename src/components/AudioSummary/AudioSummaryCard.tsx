import React from 'react';
import { AudioPlayer } from '../AudioPlayer/AudioPlayer';
import './AudioSummaryCard.css';

export interface AudioSummaryCardProps {
    title: string;
    imageUrl: string;
    audioSrc: string;
    durationLabel?: string; // e.g. "3 min"
    onLike?: () => void;
    isLiked?: boolean;
}

export const AudioSummaryCard: React.FC<AudioSummaryCardProps> = ({
    title,
    imageUrl,
    audioSrc,
    durationLabel = "3 min",
    onLike,
    isLiked
}) => {
    return (
        <div className="audio-summary-card">
            <div className="audio-summary-card__image-container">
                <img
                    src={imageUrl}
                    alt={title}
                    className="audio-summary-card__image"
                />
                <div className="audio-summary-card__duration-badge">
                    <span className="audio-summary-card__duration-icon">🎧</span> {durationLabel}
                </div>
            </div>
            <div className="audio-summary-card__content">
                <h3 className="audio-summary-card__title">
                    {title}
                </h3>
                <AudioPlayer
                    src={audioSrc}
                    onLike={onLike}
                    isLiked={isLiked}
                />
            </div>
        </div>
    );
};
