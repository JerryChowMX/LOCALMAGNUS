/**
 * @DEAD_CODE: LEGACY_NOTICIAS_HUB - Identified 2025-12-12
 * This page was replaced by UnifiedArticleView with the /Notas/:date/:slug routing structure.
 * No route exists in AppRouter.tsx pointing to this component.
 * Safe to delete after confirmation.
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section, Stack } from '../../../components/Layout';
import { Body, Display } from '../../../components/Typography/Typography';
import { HeaderContent } from '../components/HeaderContent';
import { FormatSelectionGrid } from '../components/FormatSelectionGrid';
import { ZoomableImage } from '../../../components/Media/ZoomableImage';
import { AiChatBar } from '../../../components/AiChatBar';
import { useStrapiArticle } from '../../../hooks/useStrapiArticles';
import { useShare } from '../../../hooks/useShare';
import { ShareModal } from '../../../components/ShareModal';
import { trackArticleView } from '../../../lib/analytics';
import { useScrollTracking } from '../../../hooks/useScrollTracking';
import { STRAPI_ORIGIN } from '../../../lib/env'; // Assuming env var is available or I will hardcode for now if env is not exposed
import './NoticiasArticlePage.css';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";

export const NoticiasArticlePage: React.FC = () => {
    const { date, slug } = useParams<{ date: string; slug: string }>();
    const navigate = useNavigate();
    // Use Strapi hook
    const { article, isLoading, error } = useStrapiArticle(slug || '');
    const { handleShare, isModalOpen, closeModal, shareData } = useShare();

    // Construct full image URL
    const imageUrl = article?.hero_image?.url
        ? `${STRAPI_ORIGIN}${article.hero_image.url}`
        : DEFAULT_IMAGE;

    // Scroll Analytics (using documentId as distinct ID)
    useScrollTracking(article?.documentId, 'noticias');

    React.useEffect(() => {
        if (article) {
            trackArticleView(article.documentId, 'noticias', undefined, 'home');
        }
    }, [article]);

    if (isLoading) return <PageWrapper><Section padding="md"><Body>Loading...</Body></Section></PageWrapper>;
    if (error || !article) return <PageWrapper><Section padding="md"><Body>Article not found.</Body></Section></PageWrapper>;

    return (
        <PageWrapper>
            <HeaderContent
                onBack={() => navigate(`/NoticiasHub/${date}`)}
                onShare={() => article && handleShare({
                    title: article.title,
                    analytics: {
                        articleId: article.documentId,
                        section: 'noticias',
                        format: undefined
                    }
                })}
            />

            <Section padding="none">
                <Section padding="md">
                    <Display align="center" className="noticias-article-title">{article.title}</Display>
                </Section>
                <div className="noticias-article-hero">
                    <ZoomableImage
                        src={imageUrl}
                        alt={article.title}
                        className="noticias-article-image"

                    />
                    <div className="noticias-article-gradient-overlay"></div>
                </div>
            </Section>

            <Section padding="md">
                <Stack spacing="lg" align="center">

                    <FormatSelectionGrid basePath={`/NoticiasHub/${date}/${slug}`} />

                    {/* Spacer for AI Chat Bar */}
                    <div style={{ height: '80px' }} />
                </Stack>
            </Section>

            <AiChatBar context="noticias" />

            <ShareModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={shareData?.title || ''}
                url={shareData?.url}
                analytics={shareData?.analytics}
            />
        </PageWrapper>
    );
};
