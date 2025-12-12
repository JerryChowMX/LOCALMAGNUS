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

// Article Components
import { ArticleHero } from '../components/ArticleHero';
import { ArticleFormatSelector, type ArticleFormatId } from '../components/ArticleFormatSelector';
import { NotaOriginal } from '../components/FormatViews/NotaOriginal';
import { Video } from '../components/FormatViews/Video';
import { Podcast } from '../components/FormatViews/Podcast';
import { Presentacion } from '../components/FormatViews/Presentacion';
import { Infografia } from '../components/FormatViews/Infografia';

// Hooks & Utils
import { useStrapiArticle } from '../../../hooks/useStrapiArticles';
import { routes } from '../../../app/routes';

// Styles
import '../templates/StandardOneArticle.css';

export const UnifiedArticleView = () => {
    const { date, slug } = useParams<{ date: string; slug: string }>();
    const navigate = useNavigate();
    const { article, isLoading, error } = useStrapiArticle(slug || '');

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [activeFormat, setActiveFormat] = useState<ArticleFormatId>('nota-original');

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
            url: article.hero_image.url,
            caption: '',
            alternativeText: article.hero_image.alternativeText
        } : { url: '' },
        author: article.author ? { name: article.author.name } : undefined,
        category: article.category ? { name: article.category.name, slug: article.category.slug } : undefined,
        content: article.blocks || [],
        audio_summary: article.audio_summary ? {
            id: 1,
            audio_file: { url: article.audio_summary.audio_file?.url || '' },
            duration: article.audio_summary.duration_seconds,
            title: article.title
        } : undefined,
        video_summary: undefined, // TODO: Add when video field exists in Strapi
        ppt_summary: undefined,   // TODO: Add when PPT field exists in Strapi
        infographic_summary: undefined // TODO: Add when infographic field exists in Strapi
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
                    </div>

                    <div className="standard-article-wrapper">
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
            {isChatOpen && <AiChatBarExpanded onClose={() => setIsChatOpen(false)} />}
            {isCommentsOpen && <AiCommentsExpanded onClose={() => setIsCommentsOpen(false)} />}
        </PageWrapper>
    );
};

export default UnifiedArticleView;
