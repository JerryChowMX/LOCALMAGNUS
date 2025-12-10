import React from 'react';
import styles from './RecommendedArticles.module.css';

export interface RecommendedArticleCardProps {
    image: string;
    category: string;
    title: string;
    link?: string;
}

export const RecommendedArticleCard: React.FC<RecommendedArticleCardProps> = ({
    image,
    category,
    title
}) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <span className={styles.categoryPill}>{category}</span>
                <img src={image} alt={title} className={styles.image} />
                <div className={styles.arrowButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            <h3 className={styles.cardTitle}>{title}</h3>
        </div>
    );
};
