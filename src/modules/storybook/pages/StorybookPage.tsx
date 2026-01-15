import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderCenteredStack } from '../../../components/Header/HeaderCenteredStack';
import { useStorybookDate } from '../hooks/useStorybookDate';
import { useStrapiStoryBooks } from '../hooks/useStrapiStoryBooks';
import { Body } from '../../../components/Typography/Typography';
import { EmptyState } from '../../../components/EmptyState/EmptyState';
import { FlipboardSkeleton } from '../../articles/components/FlipboardSkeleton';
import { Flipboard } from '../../articles/components/Flipboard';
import './StorybookPage.css';

export const StorybookPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentDate, handleDateChange } = useStorybookDate();

    // Fetch stories from the new Content Type
    const { data: storiesData, isLoading, error } = useStrapiStoryBooks(currentDate);

    // Adapter: Map StoryBookArticle to StrapiArticle for Flipboard compatibility
    const mappedArticles: any[] = storiesData.map(story => ({
        id: story.id,
        documentId: story.documentId,
        title: story.Headline,
        slug: story.DestinationURl,
        excerpt: story.Excerpt || '',
        publishedAt: story.StoryDate,
        hero_image: story.CoverImage ? {
            url: story.CoverImage.url,
            alternativeText: story.CoverImage.alternativeText
        } : undefined,
        category: story.Category ? {
            name: story.Category,
            slug: story.Category.toLowerCase().replace(/\s+/g, '-'),
            color: '#000000'
        } : undefined,
        author: {
            name: 'Magnus',
            slug: 'magnus'
        },
        blocks: [],
        locale: 'es'
    }));

    // Note: Story click handling is internal to Flipboard -> StoryCard now, but Flipboard takes just articles.
    // Ideally Flipboard's StoryCard should handle navigation if needed, but current spec is "Flip through".
    // The previous implementation had click -> navigate.
    // The new StoryCard in articles/components/StoryCard.tsx accepts onClick.
    // But Flipboard.tsx doesn't expose onClick per card easily yet unless we modify it or it's built-in.
    // Looking at Flipboard.tsx: <StoryCard story={...} />.  It doesn't pass onClick.
    // The visual prompt "Flipboard" usually implies reading in place, but if detailed view is needed...
    // Let's assume for now the flipping IS the experience.

    return (
        <div className="storybook-page">
            <HeaderCenteredStack
                variant="light"
                currentDate={currentDate}
                onDateChange={handleDateChange}
                onBack={() => navigate('/')}
                showBackButton={true}
            />

            <main className="fixed inset-0 top-[60px] z-0">
                {/* Top padding/margin for header if needed, assuming Header is fixed or we need to offset */}
                {/* Actually Flipboard is fixed fullscreen. We might need to adjust it to not cover the header? 
                    The header is z-index high. Flipboard is z-0? 
                    Flipboard CSS says fixed top:0. 
                    If we want it inside this page relative:
                    We should override Flipboard CSS or wrap it.
                    Flipboard.css has .flipboard-container { width: 100vw; height: 100vh; position: relative; ... }
                    Wait, Flipboard logic uses 100vh.
                    Let's ensure it fits.
                 */}

                {isLoading && <FlipboardSkeleton />}

                {error && (
                    <div className="flex justify-center p-8 mt-20">
                        <Body color="error">Error cargando historias: {error.message}</Body>
                    </div>
                )}

                {!isLoading && !error && mappedArticles.length > 0 && (
                    <Flipboard articles={mappedArticles} />
                )}

                {!isLoading && !error && mappedArticles.length === 0 && (
                    <div className="flex justify-center p-8 mt-20">
                        <EmptyState
                            title="No hay historias"
                            message="No encontramos historias para esta fecha. Intenta seleccionar otro día."
                        />
                    </div>
                )}
            </main>
        </div>
    );
};
