import { useRef } from 'react';
import styles from './RecommendedArticles.module.css';
import { RecommendedArticleCard } from './RecommendedArticleCard';
import type { RecommendedArticleCardProps } from './RecommendedArticleCard';

export interface RecommendedArticlesProps {
    title?: string;
    ctaText?: string;
    articles: RecommendedArticleCardProps[];
}

export const RecommendedArticles: React.FC<RecommendedArticlesProps> = ({
    title = "Sigue leyendo",
    ctaText = "Ver todos",
    articles
}) => {
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <a href="#" className={styles.cta}>{ctaText}</a>
            </div>
            <div className={styles.carouselWrapper}>
                {/* Left Chevron */}
                <button
                    className={`${styles.chevron} ${styles.chevronLeft}`}
                    onClick={scrollLeft}
                    aria-label="Scroll left"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                {/* Carousel Container */}
                <div className={styles.carouselContainer} ref={carouselRef}>
                    {articles.map((article) => (
                        <RecommendedArticleCard
                            key={article.title}
                            {...article}
                        />
                    ))}
                </div>

                {/* Right Chevron */}
                <button
                    className={`${styles.chevron} ${styles.chevronRight}`}
                    onClick={scrollRight}
                    aria-label="Scroll right"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    );
};
