import React from 'react';
import type { StrapiArticle } from '../../../types/strapi';
import { getStrapiMedia } from '../../../utils/media';
import { Typography, Caption, Body } from '../../../components/Typography/Typography';
import './StoryCard.css';

interface StoryCardProps {
    story: StrapiArticle;
    onClick?: () => void;
    onCategoryClick?: (category: string) => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick, onCategoryClick }) => {
    // Resolve image URL
    const imageUrl = getStrapiMedia(story.hero_image?.url) || DEFAULT_IMAGE;

    // Format date as DD.MM.YYYY
    const dateStr = story.publishedAt ? new Date(story.publishedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '.') : '';

    // Handle click - open external URL if present, otherwise use onClick handler
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (story.externalUrl) {
            window.open(story.externalUrl, '_blank', 'noopener,noreferrer');
        } else if (onClick) {
            onClick();
        }
    };

    // Handle category click
    const handleCategoryClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (story.category?.name && onCategoryClick) {
            onCategoryClick(story.category.name);
        }
    };

    // Handle share click
    const handleShareClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const shareData = {
            title: story.title,
            text: story.excerpt || story.title,
            url: story.externalUrl || window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(shareData.url);
                // You could show a toast notification here
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="story-card--split">
            {/* Top Half: Image */}
            <div className="story-card__top">
                <img
                    src={imageUrl}
                    className="story-card__image"
                    alt={story.hero_image?.alternativeText || story.title}
                    loading="lazy"
                />
                <div className="story-card__top-badges">
                    {story.category?.name && (
                        <button
                            className="story-card__category-badge"
                            style={{ backgroundColor: story.category.color || 'var(--semantic-error)' }}
                            onClick={handleCategoryClick}
                        >
                            <Caption>
                                {story.category.name}
                            </Caption>
                        </button>
                    )}
                    {story.externalUrl && (
                        <>
                            <button
                                className="story-card__read-button"
                                onClick={handleClick}
                            >
                                <Caption className="story-card__button-text">
                                    leer nota completa
                                </Caption>
                            </button>
                            <button
                                className="story-card__share-button"
                                onClick={handleShareClick}
                                aria-label="Compartir"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3"></circle>
                                    <circle cx="6" cy="12" r="3"></circle>
                                    <circle cx="18" cy="19" r="3"></circle>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Half: Content (White Background) */}
            <div className="story-card__bottom">
                <div className="story-card__content">
                    <Typography variant="heading-1" as="h1" className="story-card__title">
                        {story.title}
                    </Typography>

                    {/* Author and date below title */}
                    <div className="story-card__meta-block">
                        <Caption className="story-card__author">Autor: {story.author?.name || 'Redacción'}</Caption>
                        <Caption className="story-card__date">{dateStr || ''}</Caption>
                    </div>

                    {/* Divider line */}
                    <hr className="story-card__divider" />

                    {story.excerpt && (
                        <Body className="story-card__excerpt">{story.excerpt}</Body>
                    )}
                </div>
            </div>
        </div>
    );
};
