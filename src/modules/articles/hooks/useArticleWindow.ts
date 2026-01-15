import { useState, useEffect } from 'react';
import type { StrapiArticle } from '../../../types/strapi';
import { getStrapiMedia } from '../../../utils/media';

interface ArticleWindow {
    currentArticle: StrapiArticle | null;
    nextArticle: StrapiArticle | null;
    prevArticle: StrapiArticle | null;
    currentIndex: number;
    totalArticles: number;
    goNext: () => void;
    goPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

export const useArticleWindow = (articles: StrapiArticle[]): ArticleWindow => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const totalArticles = articles.length;

    // Derived State
    const currentArticle = articles[currentIndex] || null;
    const nextArticle = currentIndex < totalArticles - 1 ? articles[currentIndex + 1] : null;
    const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;

    const hasNext = currentIndex < totalArticles - 1;
    const hasPrev = currentIndex > 0;

    // Actions
    const goNext = () => {
        if (hasNext) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const goPrev = () => {
        if (hasPrev) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Pre-loading Logic
    useEffect(() => {
        if (nextArticle?.hero_image?.url) { // Updated to match StrapiArticle
            const img = new Image();
            const url = getStrapiMedia(nextArticle.hero_image.url);
            if (url) {
                img.src = url;
            }
        }
    }, [nextArticle]);

    return {
        currentArticle,
        nextArticle,
        prevArticle,
        currentIndex,
        totalArticles,
        goNext,
        goPrev,
        hasNext,
        hasPrev
    };
};
