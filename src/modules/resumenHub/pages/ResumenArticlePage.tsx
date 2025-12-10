import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section, Stack } from '../../../components/Layout';
import { Display, Body, Caption, Headline } from '../../../components/Typography/Typography';
import { HeaderContent } from '../../noticiasHub/components/HeaderContent';
import { ResumenArticleFormatsList } from '../components/ResumenArticleFormatsList';
import { ZoomableImage } from '../../../components/Media/ZoomableImage';
import { AiChatBar } from '../../../components/AiChatBar';
import { useResumenArticle } from '../hooks/useResumenArticle';
import { useShare } from '../../../hooks/useShare';
import { ShareModal } from '../../../components/ShareModal';
import { trackArticleView } from '../../../lib/analytics';
import { useScrollTracking } from '../../../hooks/useScrollTracking';
import './ResumenArticlePage.css';

export interface ResumenArticlePageProps {
    backPath: string;
    articleType: 'las5' | 'opinion';
}

export const ResumenArticlePage: React.FC<ResumenArticlePageProps> = ({
    backPath,
    articleType
}) => {
    const { slug } = useParams<{ date: string; slug: string }>();
    const navigate = useNavigate();
    const { article, loading, error } = useResumenArticle(slug);
    const { handleShare, isModalOpen, closeModal, shareData } = useShare();

    // Scroll Analytics
    useScrollTracking(article?.id, 'resumen');

    React.useEffect(() => {
        if (article) {
            trackArticleView(article.id, 'resumen', undefined, articleType);
        }
    }, [article, articleType]);

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
                <HeaderContent onBack={() => navigate(backPath)} />
                <Section padding="md">
                    <Stack spacing="md" align="center">
                        <Body color="error">Error loading article</Body>
                        <Body size="sm">{error.message}</Body>
                    </Stack>
                </Section>
            </PageWrapper>
        );
    }

    if (!article) {
        return (
            <PageWrapper>
                <HeaderContent onBack={() => navigate(backPath)} />
                <Section padding="md">
                    <Body>Article not found.</Body>
                </Section>
            </PageWrapper>
        );
    }

    const isLas5 = articleType === 'las5';

    return (
        <PageWrapper>
            <HeaderContent
                onBack={() => navigate(backPath)}
                onShare={() => handleShare({
                    title: article.title,
                    analytics: {
                        articleId: article.id,
                        section: 'resumen',
                        format: undefined
                    }
                })}
            />

            <Section padding="none">
                <div className="resumen-article-hero">
                    <ZoomableImage
                        src={article.imageUrl}
                        alt={article.title}
                        className="resumen-article-image"
                        caption={!isLas5 && article.author ? `Por ${article.author}` : article.title}
                    />
                </div>
            </Section>

            <Section padding="md">
                <Stack spacing="lg" align={isLas5 ? "center" : "start"}>
                    <Stack spacing="xs" align={isLas5 ? "center" : "start"}>
                        {!isLas5 && article.author && <Caption>Por {article.author}</Caption>}

                        {isLas5 ? (
                            <Display align="center" className="noticias-article-title">{article.title}</Display>
                        ) : (
                            <Headline level={2}>{article.title}</Headline>
                        )}
                    </Stack>

                    {article.summary && <Body size="lg">{article.summary}</Body>}

                    {isLas5 && (
                        <Body size="sm" color="secondary" align="center" className="noticias-article-instruction">
                            Elige como quieres consumir esta noticia:
                        </Body>
                    )}

                    <ResumenArticleFormatsList basePath={`${backPath}/${slug}`} articleId={article.id} />

                    {/* Spacer for AI Chat Bar */}
                    {isLas5 && <div style={{ height: '80px' }} />}
                </Stack>
            </Section>

            {isLas5 && <AiChatBar context="resumen" />}

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
