import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';
import { AiChatBarCollapsed } from '../../../components/AiChatBar/AiChatBarCollapsed';
import { AiChatBarExpanded } from '../../../components/AiChatBar/AiChatBarExpanded';
import { AiCommentsExpanded } from '../../../components/AiChatBar/AiCommentsExpanded';
import { HeaderContent } from '../../noticiasHub/components/HeaderContent';
import { STRAPI_ORIGIN } from '../../../lib/env';

// Article Components
import { ArticleHero } from '../components/ArticleHero';
import { ArticleFormatSelector, type ArticleFormatId } from '../components/ArticleFormatSelector';
import { NotaOriginal } from '../components/FormatViews/NotaOriginal';
import { Video } from '../components/FormatViews/Video';
import { Podcast } from '../components/FormatViews/Podcast';
import { Presentacion } from '../components/FormatViews/Presentacion';
import { Infografia } from '../components/FormatViews/Infografia';

// TTS Components
import { ArticleTtsEntry } from '../tts/components/ArticleTtsEntry';
import { TtsExperience } from '../tts/components/TtsExperience';

// Hooks & Utils
import { useStrapiArticle } from '../../../hooks/useStrapiArticles';
import { usePreviewMode } from '../../../hooks/usePreviewMode';
import { routes } from '../../../app/routes';
import { extractTextFromBlocks } from '../../../lib/articleUtils';

// Styles
import '../templates/StandardOneArticle.css';
import { useRef } from 'react';

export const UnifiedArticleView = () => {
    const { date, slug } = useParams<{ date: string; slug: string }>();
    const navigate = useNavigate();

    // Preview mode detection
    const { isPreview, previewStatus } = usePreviewMode();

    // Fetch article with preview status support
    const { article, isLoading, error } = useStrapiArticle(slug || '', {
        status: isPreview ? previewStatus : undefined
    });

    console.log('[DEBUG] UnifiedArticleView: Raw Article Data:', article);
    if (article) {
        console.log('[DEBUG] TTS Fields:', {
            status: article.tts_status,
            audio: article.tts_audio,
            metadata: article.tts_metadata
        });
    }

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [activeFormat, setActiveFormat] = useState<ArticleFormatId>('nota-original');
    const [isTtsActive, setIsTtsActive] = useState(false);
    const articleContainerRef = useRef<HTMLDivElement>(null);

    // Format Date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Handle back navigation
    const handleBack = () => {
        if (date) {
            navigate(routes.notas(date));
        } else {
            navigate(-1);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <PageWrapper>
                <HeaderContent onBack={handleBack} />
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <Text variant="body">Cargando artículo...</Text>
                </div>
            </PageWrapper>
        );
    }

    // Error state
    if (error || !article) {
        return (
            <PageWrapper>
                <HeaderContent onBack={handleBack} />
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <Text variant="body">Error cargando el artículo</Text>
                </div>
            </PageWrapper>
        );
    }

    // Transform Strapi article to component props format
    const articleAttrs = {
        title: article.title,
        summary: article.excerpt || article.summary || '',
        publishedAt: article.publishedAt,
        updatedAt: article.publishedAt,
        image: article.hero_image ? {
            url: `${STRAPI_ORIGIN}${article.hero_image.url}`,
            caption: '',
            alternativeText: article.hero_image.alternativeText
        } : { url: '' },
        author: article.author ? { name: article.author.name } : undefined,
        category: article.category ? { name: article.category.name, slug: article.category.slug } : undefined,
        content: article.blocks || [],
        audio_summary: article.audio_summary ? {
            id: 1,
            episode_label: article.audio_summary.episode_label,
            podcast_title: article.audio_summary.podcast_title,
            audio_file: { url: `${STRAPI_ORIGIN}${article.audio_summary.audio_file?.url || ''}` },
            title: article.title
        } : undefined,
        video_summary: article.video_summary ? {
            video_file: { url: `${STRAPI_ORIGIN}${article.video_summary.video_file?.url || ''}` },
            thumbnail: article.video_summary.thumbnail ? { url: `${STRAPI_ORIGIN}${article.video_summary.thumbnail.url}` } : undefined,
            duration_seconds: article.video_summary.duration_seconds
        } : undefined,
        ppt_summary: article.ppt_summary ? {
            ppt_file: { url: `${STRAPI_ORIGIN}${article.ppt_summary.ppt_file?.url || ''}` },
            slide_count: article.ppt_summary.slide_count
        } : undefined,
        infographic_summary: article.infographic_summary ? {
            image_file: { url: `${STRAPI_ORIGIN}${article.infographic_summary.image_file?.url || ''}` }
        } : undefined
    };

    // Calculate available formats
    const publishedFormats = [
        'nota-original',
        articleAttrs.video_summary && 'video',
        articleAttrs.audio_summary && 'podcast',
        articleAttrs.ppt_summary && 'presentacion',
        articleAttrs.infographic_summary && 'infografia'
    ].filter(Boolean) as string[];

    return (
        <PageWrapper>
            <div className="playground-page-wrapper">
                <HeaderContent onBack={handleBack} />

                {/* Preview Mode Banner */}
                {isPreview && (
                    <div style={{
                        background: previewStatus === 'draft' ? '#FEF3C7' : '#D1FAE5',
                        border: `1px solid ${previewStatus === 'draft' ? '#F59E0B' : '#10B981'}`,
                        borderRadius: '8px',
                        padding: '12px 16px',
                        margin: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        👁️ <strong>Modo Vista Previa</strong> —
                        {previewStatus === 'draft' ? ' Borrador' : ' Publicado'}
                    </div>
                )}

                <div className="standard-article-container">
                    <div className="standard-article-header">
                        <Text variant="caption" className="standard-article-date">
                            {formatDate(article.publishedAt)}
                        </Text>
                        <Heading level={1} className="standard-article-title">
                            {article.title}
                        </Heading>
                        {articleAttrs.summary && (
                            <div className="standard-article-dek">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {articleAttrs.summary}
                                </ReactMarkdown>
                            </div>
                        )}

                        <ArticleTtsEntry
                            ttsStatus={article.tts_status}
                            isActive={isTtsActive}
                            onStart={() => setIsTtsActive(true)}
                            onStop={() => setIsTtsActive(false)}
                        />
                    </div>

                    <div className="standard-article-wrapper" ref={articleContainerRef}>
                        {isTtsActive && article.tts_audio && article.tts_metadata && (
                            <TtsExperience
                                audioUrl={`${STRAPI_ORIGIN}${article.tts_audio.url}`}
                                metadataUrl={`${STRAPI_ORIGIN}${article.tts_metadata.url}`}
                                articleText={extractTextFromBlocks(article.blocks || [])}
                                containerRef={articleContainerRef}
                                onEnded={() => setIsTtsActive(false)}
                            />
                        )}
                        <ArticleHero
                            image={articleAttrs.image}
                            title={article.title}
                        />

                        <ArticleFormatSelector
                            activeFormat={activeFormat}
                            publishedFormats={publishedFormats}
                            onFormatChange={setActiveFormat}
                        />

                        <div>
                            {activeFormat === 'nota-original' && <NotaOriginal article={articleAttrs as any} />}
                            {activeFormat === 'video' && <Video article={articleAttrs as any} />}
                            {activeFormat === 'podcast' && <Podcast article={articleAttrs as any} />}
                            {activeFormat === 'presentacion' && <Presentacion article={articleAttrs as any} />}
                            {activeFormat === 'infografia' && <Infografia article={articleAttrs as any} />}
                        </div>
                    </div>
                </div>
            </div>

            <AiChatBarCollapsed
                onChatClick={() => setIsChatOpen(true)}
                onCommentsClick={() => setIsCommentsOpen(true)}
            />
            {isChatOpen && (
                <AiChatBarExpanded
                    onClose={() => setIsChatOpen(false)}
                    article={{
                        title: article.title,
                        author: article.author?.name || 'Redacción Magnus',
                        date: article.publishedAt,
                        summary: article.excerpt || article.summary || undefined,
                        content: extractTextFromBlocks(article.blocks || [])
                    }}
                />
            )}
            {isCommentsOpen && <AiCommentsExpanded onClose={() => setIsCommentsOpen(false)} articleId={article.id} />}
        </PageWrapper>
    );
};

export default UnifiedArticleView;
