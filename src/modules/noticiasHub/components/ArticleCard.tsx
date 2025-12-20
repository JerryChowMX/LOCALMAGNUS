import React from 'react';
import { Stack } from '../../../components/Layout';
import { Headline } from '../../../components/Typography/Typography';
import { CategoryBadge } from '../../../components/CategoryBadge';
import './ArticleCard.css';

export interface ArticleCardProps {
    title: string;
    imageUrl: string;
    /** Category name for the badge */
    category?: string;
    /** Show category badge for special articles */
    isSpecial?: boolean;
    variant?: "light" | "dark";
    onClick?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
    title,
    imageUrl,
    category,
    variant = "light",
    onClick
}) => {
    return (
        <article
            className={`noticias-card noticias-card--${variant}`}
            onClick={onClick}
            style={{ '--card-bg': `url(${imageUrl})` } as React.CSSProperties}
        >
            <div className="noticias-card__overlay">
                <Stack spacing="sm" className="noticias-card__content">
                    {/* Category tag above title, left-aligned */}
                    {category && (
                        <CategoryBadge category={category} className="noticias-card__category" />
                    )}
                    <Headline level={3} className="noticias-card__title">{title}</Headline>
                </Stack>
            </div>
        </article>
    );
};
