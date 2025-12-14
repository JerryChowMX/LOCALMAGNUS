import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArticleRichText, ArticleQuote, ArticleAuthor, ArticleGallery, SingleImage, Infographic, Illustration } from '../../../../components/Article';
import { AudioPlayer } from '../../../../components/AudioPlayer/AudioPlayer';
import { STRAPI_ORIGIN } from '../../../../lib/env';
import type { Article, ContentBlock } from '../../types';
import './FormatViews.css';

interface NotaOriginalProps {
    article: Article['attributes'];
}

// MAGNUS Typography components for ReactMarkdown
const magnusComponents = {
    h1: ({ children }: any) => (
        <h1 className="article-content-h1">{children}</h1>
    ),
    h2: ({ children }: any) => (
        <h2 className="article-content-h2">{children}</h2>
    ),
    h3: ({ children }: any) => (
        <h3 className="article-content-h3">{children}</h3>
    ),
    p: ({ children }: any) => (
        <p className="article-content-p">{children}</p>
    ),
    li: ({ children }: any) => (
        <li className="article-content-li">{children}</li>
    ),
    strong: ({ children }: any) => (
        <strong style={{ fontWeight: 700 }}>{children}</strong>
    )
};

export const NotaOriginal: FC<NotaOriginalProps> = ({ article }) => {
    return (
        <div className="article-format-view-container standard-article-content">
            {/* Rich text content */}
            {article.content.map((block: ContentBlock, index: number) => {
                const componentType = (block as any).__component || (block as any).type || (block as any).__typename;

                // RICH TEXT (supports both shared.rich-text and content.rich-text)
                if (componentType === 'shared.rich-text' || componentType === 'content.rich-text' || componentType === 'ComponentArticleRichText' || componentType === 'paragraph') {
                    // Strapi content.rich-text has a 'content' field with markdown/HTML
                    // shared.rich-text has 'blocks' array
                    const richTextContent = (block as any).content || (block as any).text;
                    if (richTextContent && typeof richTextContent === 'string') {
                        return (
                            <div key={index} className="article-rich-text-block">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={magnusComponents}
                                >
                                    {richTextContent}
                                </ReactMarkdown>
                            </div>
                        );
                    }
                    // Fallback to blocks array for shared.rich-text
                    return (
                        <ArticleRichText
                            key={index}
                            blocks={(block as any).blocks || (block as any).body || []}
                        />
                    );
                }

                // QUOTE (supports both shared.quote and content.quote)
                if (componentType === 'shared.quote' || componentType === 'content.quote' || componentType === 'ComponentArticleQuote') {
                    return (
                        <ArticleQuote
                            key={index}
                            quote={(block as any).quote || (block as any).text || (block as any).quote_text || ''}
                            author={(block as any).author || (block as any).author_title || ''}
                        />
                    );
                }

                // Helper for URL normalization
                const getImageUrl = (url?: string) => {
                    if (!url) return '';
                    if (url.startsWith('http')) return url;
                    return `${STRAPI_ORIGIN}${url}`;
                };

                // GALLERY
                if (
                    componentType?.includes('gallery') ||
                    componentType === 'ComponentArticleGallery'
                ) {
                    // Normalize images to StrapiGalleryImage[]
                    const images = ((block as any).images || []).map((img: any) => ({
                        id: img.id,
                        url: getImageUrl(img.url),
                        caption: img.caption,
                        alt: img.alternativeText || img.alt
                    }));

                    return (
                        <ArticleGallery
                            key={index}
                            images={images}
                            caption={(block as any).caption}
                        />
                    );
                }

                // AUDIO (Embedded Block)
                if (
                    componentType?.includes('audio') ||
                    componentType === 'content.audio'
                ) {
                    const audioUrl = getImageUrl((block as any).audioUrl?.url || (block as any).audioUrl);
                    return (
                        <div key={index} style={{ marginBottom: '24px' }}>
                            <AudioPlayer
                                src={audioUrl}
                                title={(block as any).title}
                                onLike={() => console.log('Like clicked on audio block')}
                            />
                            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', width: '100%', marginTop: '24px' }}></div>
                        </div>
                    );
                }

                // SINGLE IMAGE / ILLUSTRATION / INFOGRAPHIC
                if (
                    componentType?.includes('single-image') ||
                    componentType?.includes('illustration') ||
                    componentType?.includes('infographic') ||
                    componentType === 'ComponentArticleSingleImage' ||
                    componentType === 'ComponentArticleIllustration' ||
                    componentType === 'ComponentArticleInfographic'
                ) {
                    // Extract single image
                    // We rely on normalizeArticle to have put the correct object in 'image' or 'images' array
                    let img = (block as any).image;

                    // If not found in 'image', check 'images' (plural) for illustrations/infographics
                    if (!img) {
                        const images = (block as any).images;
                        if (Array.isArray(images) && images.length > 0) {
                            img = images[0];
                        }
                    }

                    if (!img) return null;

                    const imageUrl = getImageUrl(img.url);
                    const caption = (block as any).caption || img.caption || '';
                    const credit = (block as any).credit || (block as any).source || '';

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

            {/* Author card */}
            {article.author && (
                <div style={{ marginBottom: '40px', textAlign: 'left' }}>
                    <ArticleAuthor name={article.author.name} />
                </div>
            )}

            {/* Spacer for bottom sheet */}
            <div style={{ height: '100px' }}></div>
        </div>
    );
};
