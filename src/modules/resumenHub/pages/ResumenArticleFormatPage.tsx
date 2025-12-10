import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section, Stack } from '../../../components/Layout';
import { Headline, Body } from '../../../components/Typography/Typography';
import { AudioPlayer } from '../../../components/AudioPlayer/AudioPlayer';
import { HeaderContent } from '../../noticiasHub/components/HeaderContent';
import { useResumenArticle } from '../hooks/useResumenArticle';
import type { ArticleFormat } from '../../noticiasHub/types/noticias.types';
import { RichTextRenderer } from '../../../components/RichTextRenderer/RichTextRenderer';
import { FALLBACK_AUDIO_URL } from '../../../constants/media';
import { trackArticleView } from '../../../lib/analytics';
import { useShare } from '../../../hooks/useShare';
import { ShareModal } from '../../../components/ShareModal';
import { useScrollTracking } from '../../../hooks/useScrollTracking';

export interface ResumenArticleFormatPageProps {
    backPath: string;
}

export const ResumenArticleFormatPage: React.FC<ResumenArticleFormatPageProps> = ({
    backPath
}) => {
    const { slug, format } = useParams<{ slug: string; format: string }>();
    const navigate = useNavigate();
    const { article, loading, error } = useResumenArticle(slug);
    const { handleShare, isModalOpen, closeModal, shareData } = useShare();

    // Scroll Analytics
    useScrollTracking(article?.id, 'resumen', format as any);

    React.useEffect(() => {
        if (article) {
            trackArticleView(article.id, 'resumen', format as any);
        }
    }, [article, format]);

    if (loading) {
        return (
            <PageWrapper>
                <Section padding="md">
                    <Body>Loading...</Body>
                </Section>
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper>
                <HeaderContent
                    onBack={() => navigate(backPath)}
                    onShare={() => handleShare({ title: 'Article' })}
                />
                <Section padding="md">
                    <Body color="error">
                        Error loading article: {error.message}
                    </Body>
                </Section>
            </PageWrapper>
        );
    }

    if (!article) {
        return (
            <PageWrapper>
                <Section padding="md">
                    <Body>Article not found.</Body>
                </Section>
            </PageWrapper>
        );
    }

    const renderContent = () => {
        switch (format as ArticleFormat) {
            case 'original':
                return <RichTextRenderer content={article.content || 'Contenido original no disponible.'} />;
            case 'ejecutivo':
                return <Body>{article.summary || 'Resumen no disponible.'}</Body>;
            case 'audio':
                return <AudioPlayer
                    src={article.audioUrl || FALLBACK_AUDIO_URL}
                    analytics={{ articleId: article.id, section: 'resumen' }}
                />;
            case 'guiada':
                return <Body>[Presentación Guiada Placeholder]</Body>;
            default:
                return <Body>Unknown format</Body>;
        }
    };

    return (
        <PageWrapper>
            <HeaderContent
                onBack={() => navigate(backPath)}
                onShare={() => article && handleShare({
                    title: article.title,
                    analytics: {
                        articleId: article.id,
                        section: 'resumen',
                        format: format
                    }
                })}
            />

            <Section padding="md">
                <Stack spacing="lg">
                    <Headline level={2}>{article.title}</Headline>
                    <Headline level={4}>Format: {format}</Headline>
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
        </PageWrapper>
    );
};
