/**
 * @DEAD_CODE: LEGACY_NOTICIAS_HUB - Identified 2025-12-12
 * This page was replaced by UnifiedArticleView which handles format switching internally.
 * No route exists in AppRouter.tsx pointing to this component.
 * Safe to delete after confirmation.
 */
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section, Stack } from '../../../components/Layout';
import { Headline, Body } from '../../../components/Typography/Typography';
import { AudioSummaryCard } from '../../../components/AudioSummary/AudioSummaryCard';
import { ArticleGallery } from '../../../components/Article';

import { HeaderContent } from '../components/HeaderContent';
import { useStrapiArticle } from '../../../hooks/useStrapiArticles';
import { FALLBACK_AUDIO_URL } from '../../../constants/media';
import type { ArticleFormat } from '../types/noticias.types';
import { useShare } from '../../../hooks/useShare';
import { ShareModal } from '../../../components/ShareModal';
import { useScrollTracking } from '../../../hooks/useScrollTracking';
import { trackArticleView } from '../../../lib/analytics';
import { getStrapiMedia } from '../../../utils/media';

// Staging Component (Rich Design)
import { StandardOneArticle } from '../../../modules/articles/templates/StandardOneArticle';
import { mapStrapiToStandard } from '../../../utils/articleMapper';

// Resumen Ejecutivo Components
import { ResumenHeader } from '../../resumenEjecutivo/components/ResumenHeader';
import { ResumenHighlights } from '../../resumenEjecutivo/components/ResumenHighlights';

import { AiChatBar } from '../../../components/AiChatBar';

import './NoticiasArticleFormatPage.css';

export const NoticiasArticleFormatPage: React.FC = () => {
    const { date, slug, format } = useParams<{ date: string; slug: string; format: string }>();
    const navigate = useNavigate();
    const { article, isLoading, error } = useStrapiArticle(slug || '');
    const { handleShare, isModalOpen, closeModal, shareData } = useShare();

    // Scroll Analytics
    useScrollTracking(article?.documentId, 'noticias', format as any);

    React.useEffect(() => {
        if (article) {
            trackArticleView(article.documentId, 'noticias', format as any);
        }
    }, [article, format]);

    // Map Strapi Data to Standard Article Format if available
    const standardArticle = useMemo(() => {
        if (!article) return null;
        return mapStrapiToStandard(article);
    }, [article]);

    // Extract gallery images for "Apoyos visuales" (Moved up for shared access)
    const galleryImages = useMemo(() => {
        return standardArticle ? standardArticle.contentBlocks?.flatMap((block: any) => {
            const componentType = block.__component || block.__typename || block.type;
            if (
                componentType?.includes('gallery') ||
                componentType === 'ComponentArticleGallery'
            ) {
                const rawImages = block.images?.data || block.images || [];
                return rawImages.map((img: any) => ({
                    id: img.id,
                    url: getStrapiMedia(img.attributes?.url || img.url),
                    caption: img.attributes?.caption || img.caption,
                    alt: img.attributes?.alternativeText || img.alt
                }));
            }
            return [];
        }) : [];
    }, [standardArticle]);

    if (isLoading) return <PageWrapper><Section padding="md"><Body>Loading...</Body></Section></PageWrapper>;
    if (error || !article) return <PageWrapper><Section padding="md"><Body>Article not found.</Body></Section></PageWrapper>;

    // Special Case: If format is 'original', use the Rich Design Template (Staging)
    if (format === 'original' && standardArticle) {
        return <StandardOneArticle article={standardArticle} />;
    }



    // Special Case: Resumen Ejecutivo (Seamless Design)
    if (format === 'ejecutivo') {
        const highlights = article.executive_summary?.bullet_points?.length
            ? article.executive_summary.bullet_points.map((bp: any) => bp.quote_text || bp.highlight_text || bp.text || bp.value || (typeof bp === 'string' ? bp : ""))
            : (article.summary ? [article.summary] : ["Resumen no disponible."]);

        const dek = article.excerpt || article.executive_summary?.summary_text || '';
        const imageUrl = getStrapiMedia(article.hero_image?.url) || '';

        return (
            <PageWrapper>
                <div className="noticias-format-resumen-container">
                    <HeaderContent
                        onBack={() => navigate(`/NoticiasHub/${date}/${slug}`)}
                        onShare={() => handleShare({
                            title: article.title,
                            analytics: { articleId: article.documentId, section: 'noticias', format: 'ejecutivo' }
                        })}
                    />

                    <ResumenHeader
                        date={date || ''}
                        title={article.title}
                        dek={dek}
                        imageUrl={imageUrl}
                    />

                    <ResumenHighlights
                        items={highlights}
                    />

                    {/* Apoyos Visuales Section */}
                    {galleryImages && galleryImages.length > 0 && (
                        <div style={{ marginTop: '40px', padding: '0 24px 24px' }}>
                            <Headline level={3} style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 600 }}>Apoyos visuales</Headline>
                            <ArticleGallery images={galleryImages} />
                        </div>
                    )}
                    <AiChatBar />
                </div>

                <ShareModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={shareData?.title || ''}
                    url={shareData?.url}
                    analytics={shareData?.analytics}
                />
            </PageWrapper>
        );
    }

    // For other formats (Audio, Guided), use the standard layout
    const renderContent = () => {
        switch (format as ArticleFormat) {
            case 'audio':
                // Prefer audio_summary, fallback to generic audioUrl
                const finalAudioUrl = getStrapiMedia(article.audio_summary?.audio_file?.url) || getStrapiMedia(article.audioUrl) || FALLBACK_AUDIO_URL;
                const durationLabel = article.audio_summary?.duration_seconds
                    ? `${Math.ceil(article.audio_summary.duration_seconds / 60)} min`
                    : undefined;



                return (
                    <div className="noticias-format-audio-container">
                        <AudioSummaryCard
                            title={article.title}
                            imageUrl={getStrapiMedia(article.hero_image?.url) || ''}
                            audioSrc={finalAudioUrl}
                            durationLabel={durationLabel}
                        />

                        {/* Apoyos Visuales Section */}
                        {galleryImages && galleryImages.length > 0 && (
                            <div className="noticias-format-visual-aids">
                                <Headline level={3} className="noticias-format-visual-aids-title">Apoyos visuales</Headline>
                                <ArticleGallery images={galleryImages} />
                            </div>
                        )}
                    </div>
                );


            case 'guiada':
                return (
                    <Stack spacing="md">
                        <Headline level={3}>Presentación Guiada</Headline>
                        <Body>Step 1: Introduction...</Body>
                        <Body>Step 2: Details...</Body>
                    </Stack>
                );
            default:
                // Fallback for 'original' if mapping failed or generic content needed
                return (
                    <Stack spacing="md">
                        <Headline level={3}>Leer Nota Original</Headline>
                        <Body>{String(article.blocks || "No content found")}</Body>
                    </Stack>
                );
        }
    };

    return (
        <PageWrapper>
            <HeaderContent
                onBack={() => navigate(`/NoticiasHub/${date}/${slug}`)}
                onShare={() => article && handleShare({
                    title: article.title,
                    analytics: {
                        articleId: article.documentId,
                        section: 'noticias',
                        format: format
                    }
                })}
            />

            <Section padding="md">
                <Stack spacing="lg">
                    {format !== 'audio' && <Headline level={2}>{article.title}</Headline>}
                    {renderContent()}
                </Stack>

            </Section>

            <ShareModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={shareData?.title || ''}
                url={shareData?.url}
                analytics={shareData?.analytics}
            />
            <AiChatBar />
        </PageWrapper>
    );
};
