import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
import { TtsExperience, type TtsExperienceHandle } from '../tts/components/TtsExperience';
import { InstrumentedText } from '../tts/components/InstrumentedText';
import { createInstrumentedComponents } from '../components/FormatViews/NotaOriginal';

// Hooks & Utils
import { useStrapiArticle } from '../../../hooks/useStrapiArticles';
import { usePreviewMode } from '../../../hooks/usePreviewMode';
import { routes } from '../../../app/routes';
import { extractTextFromBlocks } from '../../../lib/articleUtils';

// Styles
import '../templates/StandardOneArticle.css';


export const UnifiedArticleView = () => {
    const { date, slug } = useParams<{ date: string; slug: string }>();
    const navigate = useNavigate();

    // Preview mode detection
    const { isPreview, previewStatus } = usePreviewMode();

    // Fetch article with preview status support
    const { article, isLoading, error } = useStrapiArticle(slug || '', {
        status: isPreview ? previewStatus : undefined
    });

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [activeFormat, setActiveFormat] = useState<ArticleFormatId>('nota-original');
    const [isTtsActive, setIsTtsActive] = useState(false);
    const [isTtsPaused, setIsTtsPaused] = useState(false);
    const [ttsCurrentTime, setTtsCurrentTime] = useState(0);
    const [ttsDuration, setTtsDuration] = useState(0);
    const [ttsPlaybackRate, setTtsPlaybackRate] = useState(1);
    const articleContainerRef = useRef<HTMLDivElement>(null);
    const ttsRef = useRef<TtsExperienceHandle>(null);
    const ttsWordIndexRef = useRef<number>(0);

    // Handler for back navigation
    const handleBack = useCallback(() => {
        if (date) {
            navigate(routes.notas(date));
        } else {
            navigate(-1);
        }
    }, [date, navigate]);

    // Handler for seeking in the audio
    const handleTtsSeek = (time: number) => {
        if (ttsRef.current) {
            ttsRef.current.seek(time);
            setTtsCurrentTime(time);
        }
    };

    // Handler for playback rate changes
    const handleTtsPlaybackRateChange = (rate: number) => {
        setTtsPlaybackRate(rate);
    };

    // Preload audio duration so user can see time before playing
    useEffect(() => {
        if (!article?.tts_audio?.url) return;

        const audio = new Audio();
        audio.preload = 'metadata';
        audio.src = `${STRAPI_ORIGIN}${article.tts_audio.url}`;

        const handleLoadedMetadata = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setTtsDuration(audio.duration);
            }
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.src = '';
        };
    }, [article?.tts_audio?.url]);

    // Handler for time updates from TtsExperience
    const handleTtsTimeUpdate = (currentTime: number, duration: number) => {
        setTtsCurrentTime(currentTime);
        setTtsDuration(duration);
    };

    // Format Date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // 1. Transform Strapi article to component props format (Stable Memo)
    const articleAttrs = useMemo(() => {
        if (!article) return null;
        return {
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
    }, [article]);

    // 2. Calculate available formats (Stable Memo)
    const publishedFormats = useMemo(() => {
        if (!articleAttrs) return ['nota-original'];
        return [
            'nota-original',
            articleAttrs.video_summary && 'video',
            articleAttrs.audio_summary && 'podcast',
            articleAttrs.ppt_summary && 'presentacion',
            articleAttrs.infographic_summary && 'infografia'
        ].filter(Boolean) as string[];
    }, [articleAttrs]);

    // 3. Stable Instrumented Article Content (ROBUST KARAOKE)
    // We split this into header and body to allow the TTS player to sit in between
    // without triggering re-instrumentation on every time update.
    const instrumented = useMemo(() => {
        if (!article || !articleAttrs) return null;

        // Reset counter at the start of this stable block
        ttsWordIndexRef.current = 0;

        const header = (
            <div className="standard-article-header">
                <Text variant="caption" className="standard-article-date">
                    {formatDate(article.publishedAt)}
                </Text>
                <Heading level={1} className="standard-article-title">
                    <InstrumentedText text={article.title} wordIndexRef={ttsWordIndexRef} />
                </Heading>
                {articleAttrs.summary && (
                    <div className="standard-article-dek">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={createInstrumentedComponents(ttsWordIndexRef)}
                        >
                            {articleAttrs.summary}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        );

        const body = (
            <NotaOriginal
                article={articleAttrs as any}
                wordIndexRef={ttsWordIndexRef}
            />
        );

        return { header, body };
    }, [article?.id, articleAttrs]);

    // --- LOADING & ERROR STATES (Must be AFTER hooks) ---

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

    if (error || !article || !articleAttrs || !instrumented) {
        return (
            <PageWrapper>
                <HeaderContent onBack={handleBack} />
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <Text variant="body">Error cargando el artículo</Text>
                </div>
            </PageWrapper>
        );
    }

    // --- MAIN RENDER ---

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

                {/* Article Content Structure */}
                <div className="standard-article-container" data-tts-scope="article-body">
                    {/* Instrumented Header */}
                    {instrumented.header}

                    <div className="standard-article-wrapper" ref={articleContainerRef}>
                        <ArticleHero
                            image={articleAttrs.image}
                            title={article.title}
                        />

                        <ArticleFormatSelector
                            activeFormat={activeFormat}
                            publishedFormats={publishedFormats}
                            onFormatChange={setActiveFormat}
                        />

                        {/* TTS Controller View - Now sits below format tabs */}
                        {activeFormat === 'nota-original' && (
                            <ArticleTtsEntry
                                ttsStatus={article.tts_status}
                                isActive={isTtsActive}
                                isPaused={isTtsPaused}
                                currentTime={ttsCurrentTime}
                                duration={ttsDuration}
                                playbackRate={ttsPlaybackRate}
                                onStart={() => {
                                    setIsTtsActive(true);
                                    setIsTtsPaused(false);
                                    setTtsCurrentTime(0);
                                }}
                                onStop={() => {
                                    setIsTtsActive(false);
                                    setIsTtsPaused(false);
                                    setTtsCurrentTime(0);
                                    setTtsDuration(0);
                                }}
                                onPause={() => setIsTtsPaused(true)}
                                onResume={() => setIsTtsPaused(false)}
                                onSeek={handleTtsSeek}
                                onPlaybackRateChange={handleTtsPlaybackRateChange}
                            />
                        )}

                        {/* Format Views */}
                        <div className="article-format-view">
                            {activeFormat === 'nota-original' && instrumented.body}
                            {activeFormat === 'video' && articleAttrs.video_summary && (
                                <Video article={articleAttrs as any} />
                            )}
                            {activeFormat === 'podcast' && articleAttrs.audio_summary && (
                                <Podcast article={articleAttrs as any} />
                            )}
                            {activeFormat === 'presentacion' && articleAttrs.ppt_summary && (
                                <Presentacion article={articleAttrs as any} />
                            )}
                            {activeFormat === 'infografia' && articleAttrs.infographic_summary && (
                                <Infografia article={articleAttrs as any} />
                            )}
                        </div>
                    </div>
                </div>

                {/* TTS Experience Engine (Hidden) */}
                {isTtsActive && article.tts_audio && article.tts_metadata && (
                    <TtsExperience
                        ref={ttsRef}
                        audioUrl={`${STRAPI_ORIGIN}${article.tts_audio.url}`}
                        metadataUrl={`${STRAPI_ORIGIN}${article.tts_metadata.url}`}
                        articleText={extractTextFromBlocks(article.blocks || [])}
                        isPaused={isTtsPaused}
                        playbackRate={ttsPlaybackRate}
                        onEnded={() => setIsTtsActive(false)}
                        onTimeUpdate={handleTtsTimeUpdate}
                    />
                )}
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

            {isCommentsOpen && (
                <AiCommentsExpanded
                    onClose={() => setIsCommentsOpen(false)}
                    articleId={article.id}
                />
            )}
        </PageWrapper>
    );
};

export default UnifiedArticleView;
