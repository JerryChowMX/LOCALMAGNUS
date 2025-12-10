import React from 'react';
import type { Article } from '../api/articlesApi';
import { Tag } from './Tag';
import { Stack } from '../../../components/Layout/Stack';
import { Headline, Body, Caption } from '../../../components/Typography/Typography';
import './ArticlesComponents.css';

export interface NewsCardProps {
    article: Article;
    variant?: 'standard' | 'featured' | 'compact';
    onClick?: () => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
    article,
    variant = 'standard',
    onClick
}) => {
    const { title, summary, image, category, publishedAt } = article.attributes;
    const date = new Date(publishedAt).toLocaleDateString();

    return (
        <article
            className={`news-card news-card--${variant}`}
            onClick={onClick}
        >
            <div className="news-card__image-container">
                <img src={image.url} alt={title} className="news-card__image" />
            </div>
            <div className="news-card__content">
                <Stack spacing="sm">
                    {category && <Tag label={category} />}
                    <Headline level={variant === 'featured' ? 2 : 3} className="news-card__title">
                        {title}
                    </Headline>
                    {variant !== 'compact' && (
                        <Body size="sm" className="news-card__summary">
                            {summary}
                        </Body>
                    )}
                    <Caption className="news-card__date">{date}</Caption>
                </Stack>
            </div>
        </article>
    );
};
