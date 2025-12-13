import React from 'react';
import { Stack } from '../../../components/Layout';
import { Headline, Caption } from '../../../components/Typography/Typography';
import './ArticleCard.css';

export interface ArticleCardProps {
    title: string;
    imageUrl: string;
    publishedAt: string;
    section?: string;
    variant?: "light" | "dark";
    onClick?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
    title,
    imageUrl,
    publishedAt,
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
                    <Headline level={3} className="noticias-card__title">{title}</Headline>
                    <Caption className="noticias-card__date">{new Date(publishedAt).toLocaleDateString()}</Caption>
                </Stack>
            </div>
        </article>
    );
};
