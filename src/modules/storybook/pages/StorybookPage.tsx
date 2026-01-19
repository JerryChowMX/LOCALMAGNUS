import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderCenteredStack } from '../../../components/Header/HeaderCenteredStack';
import { useStorybookDate } from '../hooks/useStorybookDate';
import { useStrapiStoryBooks } from '../hooks/useStrapiStoryBooks';
import { Body } from '../../../components/Typography/Typography';
import { EmptyState } from '../../../components/EmptyState/EmptyState';
import { FlipboardSkeleton } from '../../articles/components/FlipboardSkeleton';
import { Flipboard } from '../../articles/components/Flipboard';
import { BottomNav } from '../../../components/Navigation/BottomNav';
import './StorybookPage.css';

export const StorybookPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentDate, handleDateChange } = useStorybookDate();

    const [selectedCategory, setSelectedCategory] = React.useState<string>('Todas');

    // Fetch stories from the new Content Type
    const { data: storiesData, isLoading, error } = useStrapiStoryBooks(currentDate);

    // Extract unique categories
    const categories = React.useMemo(() => {
        const unique = new Set(
            storiesData
                .map(story => story.Category)
                .filter((cat): cat is string => !!cat)
        );
        return ['Todas', ...Array.from(unique)];
    }, [storiesData]);

    // Adapter: Map StoryBookArticle to StrapiArticle for Flipboard compatibility
    const mappedArticles: any[] = storiesData
        .filter(story => selectedCategory === 'Todas' || story.Category === selectedCategory)
        .map(story => ({
            id: story.id,
            documentId: story.documentId,
            title: story.Headline,
            slug: story.DestinationURl,
            externalUrl: story.DestinationURl, // Add external URL for opening in new tab
            excerpt: story.Excerpt || '',
            // Append noon time to prevent timezone shifts (e.g. UTC midnight -> previous day)
            publishedAt: story.StoryDate ? `${story.StoryDate}T12:00:00` : story.StoryDate,
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
                name: story.Author || 'Magnus',
                slug: (story.Author || 'magnus').toLowerCase().replace(/\s+/g, '-')
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
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            {/*
                Main Content Area
                - Fixed positioning to fill the viewport below the header.
                - top-[160px] ensures it starts after the header + categories.
                - bottom-[64px] ensures space for bottom nav on mobile.
                - left-0/right-0 ensures it fills the rest of the screen.
            */}
            <main className="storybook-main">
                {isLoading && <FlipboardSkeleton />}

                {error && (
                    <div className="flex justify-center p-8 mt-20">
                        <Body color="error">Error cargando historias: {error.message}</Body>
                    </div>
                )}

                {!isLoading && !error && mappedArticles.length > 0 && (
                    <Flipboard
                        articles={mappedArticles}
                        onCategoryClick={setSelectedCategory}
                    />
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

            {/* Bottom Navigation */}
            <BottomNav variant="light" />
        </div>
    );
};
