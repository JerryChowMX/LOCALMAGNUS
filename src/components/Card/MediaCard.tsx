import React from 'react';
import './Card.css';

export interface MediaCardProps {
    imageUrl: string;
    title: string;
    date?: string;
    tag?: string;
    onClick?: () => void;
    className?: string;
}

export const MediaCard: React.FC<MediaCardProps> = ({
    imageUrl,
    title,
    date,
    tag,
    onClick,
    className = ''
}) => {
    return (
        <div className={`media-card ${className}`} onClick={onClick}>
            <div className="media-card__image-container">
                <img src={imageUrl} alt={title} className="media-card__image" />
            </div>
            <div className="media-card__content">
                <h3 className="media-card__title">{title}</h3>
                {(date || tag) && (
                    <div className="media-card__meta">
                        {date && <span>{date}</span>}
                        {date && tag && <span>·</span>}
                        {tag && <span>{tag}</span>}
                    </div>
                )}
            </div>
        </div>
    );
};
