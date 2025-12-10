import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';
import { AudioPlayer } from '../../../components/AudioPlayer/AudioPlayer';
import { AiChatBarCollapsed } from '../../../components/AiChatBar/AiChatBarCollapsed';
import { AiChatBarExpanded } from '../../../components/AiChatBar/AiChatBarExpanded';
import { HeaderContent } from '../../../modules/noticiasHub/components/HeaderContent';
import {
    ArticleAuthor,
    ArticleGallery,
    ArticleQuote,
    ArticleRichText,
    Infographic,
    Illustration,
    SingleImage
} from '../../../components/Article';
import { RecommendedArticles } from '../../../components/Article/RecommendedArticles/RecommendedArticles';
import { AiCommentsExpanded } from '../../../components/AiChatBar/AiCommentsExpanded';
import type { ArticleStandard } from '../../../types/articles';
import { STRAPI_ORIGIN } from '../../../lib/env';

import './StandardOneArticle.css';

interface StandardOneArticleProps {
    article: ArticleStandard;
}

export const StandardOneArticle: FC<StandardOneArticleProps> = ({ article }) => {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    const {
        title,
        dek,
        publishedAt,
        coverImage,
        author,
        contentBlocks,
        audioUrl
    } = article;

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Helper to process URL
    const getImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${STRAPI_ORIGIN}${url}`;
    };



    return (
        <PageWrapper>
            <div style={{ margin: '0 auto', width: '100%', backgroundColor: 'var(--bg-primary)', minHeight: '100vh', position: 'relative' }}>

                {/* Header */}
                <HeaderContent
                    onBack={() => navigate(-1)} // dynamic back
                />

                {/* Main content area */}
                <div className="standard-article-container">

                    {/* Header Section */}
                    <div className="standard-article-header">
                        <Text variant="caption" className="standard-article-date">
                            {formatDate(publishedAt)}
                        </Text>

                        <Heading level={1} className="standard-article-title">
                            {title}
                        </Heading>

                        {dek && (
                            <div className="standard-article-dek">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>
                                    }}
                                >
                                    {dek}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Hero Image - Standard Layout with Gradient */}
                    {coverImage && (
                        <div className="standard-article-hero-container">
                            <img
                                src={getImageUrl(coverImage.url)}
                                alt={title} // Use title as alt since we removed specific caption
                                className="standard-article-hero-image"
                            />
                            <div className="standard-article-gradient-overlay"></div>
                        </div>
                    )}

                    {/* 4. Audio player */}
                    {audioUrl && (
                        <div className="standard-article-audio-wrapper">
                            <AudioPlayer
                                src={audioUrl}
                                onLike={() => console.log('Like clicked')}
                                analytics={{
                                    articleId: article.id?.toString(),
                                    section: 'noticias'
                                }}
                            />
                            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', width: '100%', marginTop: '24px' }}></div>
                        </div>
                    )}

                    {/* 5. Article body text */}
                    <div className="standard-article-content">
                        {contentBlocks.map((block, index) => {
                            // Normalize the component name to handle various Strapi formats (e.g. 'article.quote', 'ComponentArticleQuote')
                            const componentType = block.__component || block.__typename || block.type;

                            // 1. RICH TEXT
                            if (
                                componentType?.includes('rich-text') ||
                                componentType === 'paragraph' ||
                                componentType === 'ComponentArticleRichText'
                            ) {
                                // Helper to normalize rich text blocks
                                const richTextBlocks = block.blocks || (block.text ? [{ type: 'paragraph', content: block.text }] : []);
                                return (
                                    <ArticleRichText
                                        key={index}
                                        blocks={richTextBlocks}
                                    />
                                );
                            }

                            // 2. QUOTE
                            if (
                                componentType?.includes('quote') ||
                                componentType === 'ComponentArticleQuote'
                            ) {
                                return (
                                    <ArticleQuote
                                        key={index}
                                        quote={block.quote}
                                        author={block.author}
                                    />
                                );
                            }

                            // 3. GALLERY
                            if (
                                componentType?.includes('gallery') ||
                                componentType === 'ComponentArticleGallery'
                            ) {
                                // Normalize images to StrapiGalleryImage[]
                                const images = (block.images?.data || block.images || []).map((img: any) => ({
                                    id: img.id,
                                    url: img.attributes?.url ? `${STRAPI_ORIGIN}${img.attributes.url}` : (img.url?.startsWith('http') ? img.url : `${STRAPI_ORIGIN}${img.url}`),
                                    caption: img.attributes?.caption || img.caption,
                                    alt: img.attributes?.alternativeText || img.alt
                                }));

                                return (
                                    <ArticleGallery
                                        key={index}
                                        images={images}
                                        caption={block.caption}
                                    />
                                );
                            }

                            // 4. AUTHOR (Embedded)
                            if (
                                componentType?.includes('author') ||
                                componentType === 'ComponentArticleAuthor'
                            ) {
                                return (
                                    <ArticleAuthor
                                        key={index}
                                        name={block.name}
                                    />
                                );
                            }

                            // 5. AUDIO (Embedded Block)
                            if (
                                componentType?.includes('audio') ||
                                componentType === 'content.audio'
                            ) {
                                return (
                                    <div key={index} style={{ marginBottom: '24px' }}>
                                        <AudioPlayer
                                            src={getImageUrl(block.audioUrl)}
                                            title={block.title}
                                            onLike={() => console.log('Like clicked on audio block')}
                                            analytics={{
                                                articleId: article.id?.toString(),
                                                section: 'noticias'
                                            }}
                                        />
                                        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', width: '100%', marginTop: '24px' }}></div>
                                    </div>
                                );
                            }

                            // 6. SINGLE IMAGE / ILLUSTRATION / INFOGRAPHIC
                            if (
                                componentType?.includes('single-image') ||
                                componentType?.includes('illustration') ||
                                componentType?.includes('infographic') ||
                                componentType === 'ComponentArticleSingleImage' ||
                                componentType === 'ComponentArticleIllustration' ||
                                componentType === 'ComponentArticleInfographic'
                            ) {
                                // Extract single image (handle both 'image' and 'images' fields)
                                let img = block.image?.data?.attributes || block.image?.data || block.image;

                                // If not found in 'image', check 'images' (plural) for illustrations/infographics
                                if (!img) {
                                    const images = block.images?.data || block.images;
                                    if (Array.isArray(images) && images.length > 0) {
                                        img = images[0].attributes || images[0];
                                    } else if (images?.attributes) {
                                        img = images.attributes;
                                    }
                                }

                                // Fallback
                                img = img || block.file?.data?.attributes || block.file;

                                if (!img) return null;

                                const imageUrl = img.url ? getImageUrl(img.url) : '';
                                const caption = block.caption || img.caption || '';
                                const credit = block.credit || block.source || '';

                                // RENDER INFOGRAPHIC
                                if (componentType?.includes('infographic') || componentType === 'ComponentArticleInfographic') {
                                    return (
                                        <div key={index} style={{ marginBottom: '40px' }}>
                                            <Infographic
                                                imageUrl={imageUrl}
                                                caption={caption}
                                                author={credit || 'Magnus Data'}
                                            />
                                        </div>
                                    );
                                }

                                // RENDER ILLUSTRATION
                                if (componentType?.includes('illustration') || componentType === 'ComponentArticleIllustration') {
                                    return (
                                        <div key={index} style={{ marginBottom: '40px' }}>
                                            <Illustration
                                                imageUrl={imageUrl}
                                                caption={caption}
                                                artist={credit}
                                            />
                                        </div>
                                    );
                                }

                                // RENDER SINGLE IMAGE (Standard Border Design)
                                return (
                                    <div key={index} style={{ marginBottom: '40px' }}>
                                        <SingleImage
                                            imageUrl={imageUrl}
                                            caption={caption}
                                            photo_credit={credit}
                                        />
                                    </div>
                                );
                            }

                            return null;
                        })}

                        {contentBlocks.length === 0 && (
                            <Text variant="body" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                [Contenido del artículo vacío]
                            </Text>
                        )}
                    </div>

                    {/* 6. Main Author Card (Footer) */}
                    <div style={{ marginBottom: '40px', textAlign: 'left' }}>
                        <ArticleAuthor
                            name={author.name}
                        />
                    </div>

                    {/* 7. Recommended Articles */}
                    {article.relatedArticles && article.relatedArticles.length > 0 && (
                        <RecommendedArticles
                            articles={article.relatedArticles.map(ra => ({
                                title: ra.title,
                                category: ra.category,
                                image: getImageUrl(ra.image || undefined),
                                slug: ra.slug
                            }))}
                        />
                    )}

                    {/* 8. Spacer for bottom sheet */}
                    <div style={{ height: '100px' }}></div>

                </div>

            </div>

            {/* 3. AI Chat Bar */}
            <AiChatBarCollapsed
                onChatClick={() => setIsChatOpen(true)}
                onCommentsClick={() => setIsCommentsOpen(true)}
            />

            {/* Expanded Chat Modal */}
            {isChatOpen && (
                <AiChatBarExpanded onClose={() => setIsChatOpen(false)} />
            )}

            {/* Comments Modal */}
            {isCommentsOpen && (
                <AiCommentsExpanded onClose={() => setIsCommentsOpen(false)} />
            )}

        </PageWrapper>
    );
};
