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

// Hooks & Utils
import { useArticle } from '../../../hooks/useArticles';
import { usePreviewMode } from '../../../hooks/usePreviewMode';
import { usePodcastContext } from '../../../contexts/PodcastContext';
import { routes } from '../../../app/routes';
import { extractTextFromBlocks } from '../../../lib/articleUtils';
import type { BlockTokenMapping } from '../../../tts';

// Styles
import '../templates/StandardOneArticle.css';


export const UnifiedArticleView = () => {
    const { date, slug } = useParams<{ date: string; slug: string }>();
    const navigate = useNavigate();

    // Preview mode detection
    const { isPreview, previewStatus } = usePreviewMode();

    // Fetch article with preview status support
    const { data: article, isLoading, error } = useArticle(slug || '');
    // Note: status support for preview is pending in new hook, defaulting to standard fetch
    // TODO: Add support for options in useArticles hook if needed for preview

    // Audio focus management - pause global podcast when local audio plays
    const { pauseForOtherAudio } = usePodcastContext();

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [activeFormat, setActiveFormat] = useState<ArticleFormatId>('nota-original');
    const [isTtsActive, setIsTtsActive] = useState(false);
    const [isTtsPaused, setIsTtsPaused] = useState(false);
    const [ttsCurrentTime, setTtsCurrentTime] = useState(0);
    const [ttsDuration, setTtsDuration] = useState(0);
    const [ttsPlaybackRate, setTtsPlaybackRate] = useState(1);
    const [activeWordIndex, setActiveWordIndex] = useState(-1);
    const [blockMappings, setBlockMappings] = useState<Map<string, BlockTokenMapping> | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const articleContainerRef = useRef<HTMLDivElement>(null);
    const ttsRef = useRef<TtsExperienceHandle>(null);

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
            summary: article.dek || '',
            publishedAt: article.publishedAt,
            updatedAt: article.publishedAt,
            image: article.coverImage ? {
                url: `${STRAPI_ORIGIN}${article.coverImage.url}`,
                caption: article.coverImage.caption || '',
                alternativeText: article.coverImage.alt || ''
            } : { url: '' },
            author: article.author ? { name: article.author.name } : undefined,
            category: article.category ? { name: article.category.name, slug: article.category.slug } : undefined,
            content: article.contentBlocks || [],
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
    // Header is NOT instrumented because TTS only reads body content.
    // Body instrumentation uses verified blockMappings (PHASE 3)
    const instrumented = useMemo(() => {
        if (!article || !articleAttrs) return null;

        // Header is NOT instrumented - TTS doesn't read title/summary
        const header = (
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
            </div>
        );

        // Body IS instrumented - uses verified blockMappings from TTS
        // PHASE 3: Pure rendering with deterministic indices
        const body = (
            <NotaOriginal
                key={`nota-body-${article.id}`}
                article={articleAttrs as any}
                blockMappings={blockMappings}
                isTtsActive={isTtsActive && isVerified}
            />
        );

        return { header, body };
    }, [article?.id, articleAttrs, blockMappings, isTtsActive, isVerified]);

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

                {/* PHASE 3: CSS Highlighting - Only when verified */}
                {isTtsActive && isVerified && activeWordIndex >= 0 && (
                    <style>{`
                        [data-tts-scope="article-body"] [data-tts-word="${activeWordIndex}"] {
                            background-color: rgba(138, 180, 248, 0.5) !important;
                            box-shadow: 0 0 0 3px rgba(138, 180, 248, 0.3) !important;
                            border-radius: 3px !important;
                        }
                        [data-theme="dark"] [data-tts-scope="article-body"] [data-tts-word="${activeWordIndex}"] {
                            background-color: rgba(59, 130, 246, 0.4) !important;
                            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25) !important;
                        }
                    `}</style>
                )}

                {/* Dev Banner: Verification Failed */}
                {import.meta.env.DEV && isTtsActive && !isVerified && blockMappings === null && (
                    <div style={{
                        background: '#fef3cd',
                        color: '#856404',
                        padding: '8px 16px',
                        fontSize: '13px',
                        borderRadius: '4px',
                        marginBottom: '16px'
                    }}>
                        ⚠️ TTS highlighting disabled: verification failed or legacy metadata
                    </div>
                )}

                {/* Article Content Structure */}
                <div
                    className="standard-article-container"
                    data-tts-scope="article-body"
                    data-active-word={isTtsActive && isVerified ? activeWordIndex : undefined}
                >
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
                                ttsStatus={article.tts_status as "error" | "none" | "pending" | "ready" | undefined}
                                isActive={isTtsActive}
                                isPaused={isTtsPaused}
                                currentTime={ttsCurrentTime}
                                duration={ttsDuration}
                                playbackRate={ttsPlaybackRate}
                                onStart={() => {
                                    pauseForOtherAudio(); // Pause global podcast
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
                        articleBlocks={article.contentBlocks || []}
                        articleId={String(article.id)}
                        isPaused={isTtsPaused}
                        playbackRate={ttsPlaybackRate}
                        onEnded={() => {
                            setIsTtsActive(false);
                            setActiveWordIndex(-1);
                        }}
                        onTimeUpdate={handleTtsTimeUpdate}
                        onActiveWordChange={(wordIndex) => {
                            console.log('[UAV] onActiveWordChange received:', wordIndex);
                            setActiveWordIndex(wordIndex);
                        }}
                        onVerificationChange={(verified, error, mappings) => {
                            setIsVerified(verified);
                            setBlockMappings(mappings || null);
                            if (!verified) {
                                console.warn('[UAV] TTS verification failed:', error);
                            }
                        }}
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
                        summary: article.dek || undefined,
                        content: extractTextFromBlocks(article.contentBlocks || [])
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
