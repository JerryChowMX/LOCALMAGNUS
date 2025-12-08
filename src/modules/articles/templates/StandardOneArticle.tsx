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
import { ImageSlider } from '../../../components/Media/ImageSlider';
import {
    ArticleAuthor,
    ArticleGallery,
    ArticleQuote,
    ArticleRichText
} from '../../../components/Article';
import { RecommendedArticles } from '../../../components/Article/RecommendedArticles/RecommendedArticles';
import type { ArticleStandard } from '../../../types/articles';
import { STRAPI_ORIGIN } from '../../../lib/env';

interface StandardOneArticleProps {
    article: ArticleStandard;
}

export const StandardOneArticle: FC<StandardOneArticleProps> = ({ article }) => {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);

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
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', backgroundColor: '#fff', minHeight: '100vh', position: 'relative' }}>

                {/* Header */}
                <HeaderContent
                    onBack={() => navigate(-1)} // dynamic back
                />

                {/* 1. Meta info and title */}
                <div style={{ textAlign: 'center', paddingTop: '24px', paddingBottom: '16px' }}>
                    <Text variant="caption" style={{ color: '#9CA3AF', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                        {formatDate(publishedAt)}
                    </Text>

                    <Heading level={1} style={{ fontSize: '2rem', lineHeight: '1.2', fontWeight: 800, color: '#000', margin: '0 16px' }}>
                        {title}
                    </Heading>
                    {dek && (
                        <div style={{ fontSize: '1.125rem', color: '#6B7280', margin: '8px 16px 0' }}>
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

                {/* 2. Hero image */}
                {coverImage && (
                    <div style={{ position: 'relative', margin: '0 12px 24px 12px' }}>
                        {/* Assuming ImageSlider for consistency with playground, but passing single image */}
                        <ImageSlider
                            images={[
                                {
                                    src: getImageUrl(coverImage.url),
                                    alt: coverImage.alt || title,
                                    caption: coverImage.caption || ''
                                }
                            ]}
                        />
                    </div>
                )}

                {/* 4. Audio player (Placeholder for now) */}
                {/* 4. Audio player (Placeholder for now) */}
                {audioUrl && (
                    <div style={{ padding: '0 16px 24px 16px' }}>
                        <AudioPlayer
                            src={audioUrl}
                            onLike={() => console.log('Like clicked')}
                            analytics={{
                                articleId: article.id?.toString(),
                                section: 'noticias'
                            }}
                        />
                        <div style={{ height: '1px', backgroundColor: '#E5E7EB', width: '100%', marginTop: '24px' }}></div>
                    </div>
                )}

                {/* 5. Article body text */}
                <div style={{ padding: '0 16px 40px 16px' }}>
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
                                    <div style={{ height: '1px', backgroundColor: '#E5E7EB', width: '100%', marginTop: '24px' }}></div>
                                </div>
                            );
                        }

                        return null;
                    })}

                    {contentBlocks.length === 0 && (
                        <Text variant="body" style={{ fontStyle: 'italic', color: '#9CA3AF' }}>
                            [Contenido del artículo vacío]
                        </Text>
                    )}
                </div>

                {/* 6. Main Author Card (Footer) - Only show if not already embedded in blocks */}
                <div style={{ padding: '0 16px 40px 16px' }}>
                    {/* We use the minimalist ArticleAuthor here as the default footer signature */}
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

            {/* 3. AI Chat Bar */}
            <AiChatBarCollapsed onClick={() => setIsChatOpen(true)} />

            {/* Expanded Chat Modal */}
            {isChatOpen && (
                <AiChatBarExpanded onClose={() => setIsChatOpen(false)} />
            )}



        </PageWrapper>
    );
};
