import { useSearchParams } from 'react-router-dom';

/**
 * Hook to detect and manage preview mode state
 * Used when Strapi opens articles in preview mode
 */
export const usePreviewMode = () => {
    const [searchParams] = useSearchParams();

    const isPreview = searchParams.get('preview') === 'true';
    const previewStatus = (searchParams.get('status') as 'draft' | 'published') || 'published';

    return {
        isPreview,
        previewStatus,
        isDraft: previewStatus === 'draft'
    };
};
