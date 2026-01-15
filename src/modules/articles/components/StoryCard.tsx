import React from 'react';
import type { StrapiArticle } from '../../../types/strapi';
import { getStrapiMedia } from '../../../utils/media';
import './StoryCard.css';

interface StoryCardProps {
    story: StrapiArticle;
    onClick?: () => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
    // Resolve image URL
    const imageUrl = getStrapiMedia(story.hero_image?.url) || DEFAULT_IMAGE;

    // Format date
    const dateStr = story.publishedAt ? new Date(story.publishedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '';

    return (
        <div className="story-card--split" onClick={onClick}>
            {/* Top Half: Image */}
            <div className="story-card__top">
                <img
                    src={imageUrl}
                    className="story-card__image"
                    alt={story.hero_image?.alternativeText || story.title}
                    loading="lazy"
                />
                {story.category?.name && (
                    <span
                        className="story-card__category-badge"
                        style={{ backgroundColor: story.category.color || '#E30000' }}
                    >
                        {story.category.name}
                    </span>
                )}
            </div>

            {/* Bottom Half: Content (White Background) */}
            <div className="story-card__bottom">
                <div className="story-card__content">
                    <h1 className="story-card__title">{story.title}</h1>

                    {story.author?.name && (
                        <div className="story-card__meta">
                            <span className="story-card__author">Por {story.author.name}</span>
                            {dateStr && <span className="story-card__date"> • {dateStr}</span>}
                        </div>
                    )}

                    {story.excerpt && (
                        <p className="story-card__excerpt">{story.excerpt}</p>
                    )}
                </div>
            </div>
        </div>
    );
};
