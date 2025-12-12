import type { FC } from 'react';
import './ArticleHero.css';

interface ArticleHeroProps {
    image: {
        url: string;
        alt?: string;
    } | null;
    title: string;
}

export const ArticleHero: FC<ArticleHeroProps> = ({ image, title }) => {
    if (!image) return null;

    return (
        <div className="article-hero-container">
            <img
                src={image.url}
                alt={image.alt || title}
                className="article-hero-image"
            />
            <div className="article-hero-gradient" />
        </div>
    );
};
