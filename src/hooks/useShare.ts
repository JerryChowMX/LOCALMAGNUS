import { useCallback, useState } from 'react';
import { trackArticleShared } from '../lib/analytics';

export interface ShareParams {
    title: string;
    text?: string;
    url?: string;
    analytics?: {
        articleId: string;
        section: string;
        format?: string;
    };
}

export interface ShareResult {
    success: boolean;
    method: 'native' | 'clipboard' | 'modal' | 'cancelled' | 'failed';
}

/**
 * Hook for sharing content using Web Share API with modal fallback
 */
export const useShare = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shareData, setShareData] = useState<ShareParams | null>(null);

    const openModal = useCallback((params: ShareParams) => {
        setShareData(params);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        // Clear share data after animation completes
        setTimeout(() => setShareData(null), 300);
    }, []);

    const handleShare = useCallback(async (params: ShareParams): Promise<ShareResult> => {
        const shareDataObj = {
            title: params.title,
            text: params.text,
            url: params.url || window.location.href
        };

        // Try Web Share API first (mobile devices)
        if (navigator.share) {
            try {
                await navigator.share(shareDataObj);

                // Track native share success
                if (params.analytics) {
                    trackArticleShared(
                        params.analytics.articleId,
                        params.analytics.section,
                        params.analytics.format,
                        'other'
                    );
                }

                return { success: true, method: 'native' };
            } catch (err) {
                // User cancelled the share dialog
                if (err instanceof Error && err.name === 'AbortError') {
                    return { success: false, method: 'cancelled' };
                }
                // Fall through to modal fallback
            }
        }

        // Fallback: Open custom share modal
        openModal(params);
        return { success: true, method: 'modal' };
    }, [openModal]);

    const handleShareWithModal = useCallback((params: ShareParams) => {
        openModal(params);
    }, [openModal]);

    return {
        handleShare,
        handleShareWithModal,
        isModalOpen,
        openModal,
        closeModal,
        shareData
    };
};

