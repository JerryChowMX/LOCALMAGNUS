import { useEffect, useRef } from 'react';
import { trackArticleCompleted } from '../lib/analytics';
import type { ArticleViewedProps } from '../lib/analytics';

/**
 * Hook to track when a user scrolls to 80% of the page
 */
export const useScrollTracking = (
    articleId: string | undefined,
    section: ArticleViewedProps['section'],
    format?: ArticleViewedProps['format']
) => {
    const hasFired = useRef(false);

    useEffect(() => {
        if (!articleId) return;

        // Reset fired state when dependencies change (new article loaded)
        hasFired.current = false;

        const handleScroll = () => {
            if (hasFired.current) return;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Check if scrolled past 80%
            if (scrollY + windowHeight > documentHeight * 0.8) {
                trackArticleCompleted(articleId, section, format);
                hasFired.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Initial check in case page is short or already scrolled
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [articleId, section, format]);
};
