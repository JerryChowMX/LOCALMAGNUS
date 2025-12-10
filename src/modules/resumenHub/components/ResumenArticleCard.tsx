import React from 'react';
import { Headline } from '../../../components/Typography/Typography';
import './ResumenArticleCard.css';

export interface ResumenArticleCardProps {
    title: string;
    imageUrl: string;
    onClick?: () => void;
}

export const ResumenArticleCard: React.FC<ResumenArticleCardProps> = ({
    title,
    imageUrl,
    onClick
}) => {
    return (
        <article
            className="resumen-article-card"
            onClick={onClick}
            style={{ '--card-bg': `url(${imageUrl})` } as React.CSSProperties}
        >
            <div className="resumen-article-card__overlay">
                <Headline level={3} className="resumen-article-card__title">{title}</Headline>
            </div>
        </article>
    );
};
