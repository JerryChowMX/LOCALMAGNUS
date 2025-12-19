import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArticleRichText, ArticleQuote, ArticleAuthor, ArticleGallery, SingleImage, Infographic, Illustration } from '../../../../components/Article';
import { AudioPlayer } from '../../../../components/AudioPlayer/AudioPlayer';
import { STRAPI_ORIGIN } from '../../../../lib/env';
import type { Article, ContentBlock } from '../../types';
import { InstrumentedText } from '../../tts/components/InstrumentedText';
import './FormatViews.css';

interface NotaOriginalProps {
    article: Article['attributes'];
    /** When provided, enables TTS word instrumentation for karaoke highlighting */
    wordIndexRef?: React.MutableRefObject<number>;
}

// MAGNUS Typography components for ReactMarkdown (non-instrumented)
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

/**
 * Dev-only component that queries DOM after render to count instrumented words.
 */
const DevWordCounter: React.FC = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Query DOM after initial render to count actual instrumented words
        const timer = setTimeout(() => {
            const wordSpans = document.querySelectorAll('[data-tts-word]');
            setCount(wordSpans.length);
        }, 500); // Small delay to ensure DOM is fully rendered
        return () => clearTimeout(timer);
    }, []); // Empty deps - run once on mount

    return (
        <div style={{
            padding: '8px 12px',
            background: '#f0f0f0',
            fontSize: '12px',
            color: '#666',
            marginTop: '20px',
            borderRadius: '4px'
        }}>
            🔍 TTS Word Count: {count}
        </div>
    );
};

/**
 * Recursively process children to instrument string text nodes.
 */
export const instrumentChildren = (
    children: React.ReactNode,
    wordIndexRef: React.MutableRefObject<number>
): React.ReactNode => {
    return React.Children.map(children, (child) => {
        // String nodes get instrumented
        if (typeof child === 'string') {
            return <InstrumentedText text={child} wordIndexRef={wordIndexRef} />;
        }
        // Numbers also need to be converted to strings for TTS
        if (typeof child === 'number') {
            return <InstrumentedText text={String(child)} wordIndexRef={wordIndexRef} />;
        }
        // React elements with children need recursive processing
        if (React.isValidElement(child)) {
            const props = child.props as { children?: React.ReactNode };
            if (props.children) {
                return React.cloneElement(child, {
                    ...props,
                    children: instrumentChildren(props.children, wordIndexRef)
                } as any);
            }
        }
        // Everything else passes through unchanged
        return child;
    });
};

/**
 * Creates ReactMarkdown components with TTS word instrumentation.
 * Text nodes get wrapped with data-tts-word spans for karaoke targeting.
 */
export const createInstrumentedComponents = (wordIndexRef: React.MutableRefObject<number>) => ({
    h1: ({ children }: any) => (
        <h1 className="article-content-h1">{instrumentChildren(children, wordIndexRef)}</h1>
    ),
    h2: ({ children }: any) => (
        <h2 className="article-content-h2">{instrumentChildren(children, wordIndexRef)}</h2>
    ),
    h3: ({ children }: any) => (
        <h3 className="article-content-h3">{instrumentChildren(children, wordIndexRef)}</h3>
    ),
    p: ({ children }: any) => (
        <p className="article-content-p">{instrumentChildren(children, wordIndexRef)}</p>
    ),
    li: ({ children }: any) => (
        <li className="article-content-li">{instrumentChildren(children, wordIndexRef)}</li>
    ),
    strong: ({ children }: any) => (
        <strong style={{ fontWeight: 700 }}>{instrumentChildren(children, wordIndexRef)}</strong>
    ),
    em: ({ children }: any) => (
        <em>{instrumentChildren(children, wordIndexRef)}</em>
    ),
    a: ({ children, href }: any) => (
        <a href={href}>{instrumentChildren(children, wordIndexRef)}</a>
    )
});

export const NotaOriginal: FC<NotaOriginalProps> = ({ article, wordIndexRef }) => {
    // Use instrumented components when wordIndexRef is provided
    const components = wordIndexRef
        ? createInstrumentedComponents(wordIndexRef)
        : magnusComponents;

    return (
        <div
            className="article-format-view-container standard-article-content"
        >
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
                                    components={components}
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
                            wordIndexRef={wordIndexRef}
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

            {/* Dev mode: show word count for debugging */}
            {import.meta.env.DEV && wordIndexRef && (
                <DevWordCounter />
            )}

            {/* Spacer for bottom sheet */}
            <div style={{ height: '100px' }}></div>
        </div>
    );
};
