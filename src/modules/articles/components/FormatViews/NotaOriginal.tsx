import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArticleRichText, ArticleQuote, ArticleAuthor, ArticleGallery, SingleImage, Infographic, Illustration } from '../../../../components/Article';
import { AudioPlayer } from '../../../../components/AudioPlayer/AudioPlayer';
import { STRAPI_ORIGIN } from '../../../../lib/env';
import type { Article, ContentBlock } from '../../types';
import { InstrumentedText } from '../../tts/components/InstrumentedText';
import type { BlockTokenMapping } from '../../../../tts';
import './FormatViews.css';

/**
 * PHASE 3: Pure Component Interface
 */
interface NotaOriginalProps {
    article: Article['attributes'];
    /** Block mappings from verified backend metadata */
    blockMappings: Map<string, BlockTokenMapping> | null;
    /** Whether TTS is active (controls instrumentation) */
    isTtsActive: boolean;
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
 * Strip markdown to plain text - matches backend exactly.
 * CRITICAL: This must mirror the backend's markdownToPlainText function.
 */
const markdownToPlainText = (markdown: string): string => {
    return markdown
        .replace(/\*\*(.+?)\*\*/g, '$1')      // Bold
        .replace(/\*(.+?)\*/g, '$1')          // Italic
        .replace(/_(.+?)_/g, '$1')            // Underscore italic
        .replace(/~~(.+?)~~/g, '$1')          // Strikethrough
        .replace(/`([^`]+)`/g, '$1')          // Inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
        .replace(/^#{1,6}\s+/gm, '')          // Headers
        .replace(/^[-*+]\s+/gm, '')           // List items
        .replace(/^\d+\.\s+/gm, '')           // Numbered lists
        .replace(/^>\s*/gm, '')               // Blockquotes
        .replace(/\n{2,}/g, '\n')             // Multiple newlines
        .trim();
};

/**
 * Validate that all required TTS-enabled blocks have mappings.
 * Returns false if any required mapping is missing.
 */
const validateAllMappingsPresent = (
    blocks: ContentBlock[],
    blockMappings: Map<string, BlockTokenMapping>
): { valid: boolean; missingBlocks: string[] } => {
    const missingBlocks: string[] = [];

    for (const block of blocks) {
        const componentType = (block as any).__component;
        const blockId = (block as any).id?.toString();

        // Only check blocks that need TTS
        if (componentType === 'content.rich-text' || componentType === 'shared.rich-text') {
            const key = `${blockId}:content`;
            if (!blockMappings.has(key)) {
                missingBlocks.push(key);
            }
        }

        if (componentType === 'content.quote' || componentType === 'shared.quote') {
            const quoteKey = `${blockId}:quote_text`;
            if (!blockMappings.has(quoteKey)) {
                missingBlocks.push(quoteKey);
            }
            // author is optional, don't require it
        }
    }

    return {
        valid: missingBlocks.length === 0,
        missingBlocks
    };
};

/**
 * Get mapping key for a block.
 */
const getBlockMappingKey = (blockId: string, fieldPath: string): string => {
    return `${blockId}:${fieldPath}`;
};

export const NotaOriginal: FC<NotaOriginalProps> = ({ article, blockMappings, isTtsActive }) => {
    // PHASE 3 FIX #2: Atomic validation - all required mappings or none
    // If any required mapping is missing, disable instrumentation for the ENTIRE article
    let canInstrument = isTtsActive && blockMappings !== null;

    if (canInstrument && blockMappings) {
        const validation = validateAllMappingsPresent(article.content, blockMappings);
        if (!validation.valid) {
            if (import.meta.env.DEV) {
                console.error('[NotaOriginal] Missing TTS mappings, disabling instrumentation:', validation.missingBlocks);
            }
            canInstrument = false;
        }
    }

    return (
        <div
            className="article-format-view-container standard-article-content"
        >
            {/* Rich text content */}
            {article.content.map((block: ContentBlock, index: number) => {
                const componentType = (block as any).__component || (block as any).type || (block as any).__typename;

                // PHASE 3 FIX #3: Backend ID required - no index fallbacks
                const blockId = (block as any).id?.toString();
                if (!blockId && canInstrument) {
                    if (import.meta.env.DEV) {
                        console.error(`[NotaOriginal] Block at index ${index} has no ID - cannot instrument`);
                    }
                    // Will fall back to non-instrumented render below
                }

                // RICH TEXT (supports both shared.rich-text and content.rich-text)
                if (componentType === 'shared.rich-text' || componentType === 'content.rich-text' || componentType === 'ComponentArticleRichText' || componentType === 'paragraph') {
                    const richTextContent = (block as any).content || (block as any).text;
                    if (richTextContent && typeof richTextContent === 'string') {
                        // Get mapping for this block
                        const mapping = canInstrument && blockId
                            ? blockMappings?.get(getBlockMappingKey(blockId, 'content'))
                            : undefined;

                        // PHASE 3 FIX #1: Pure flat-text instrumentation
                        // Strip markdown to plain text (matches backend exactly)
                        // Render as single InstrumentedText with globalStartIndex
                        if (mapping) {
                            const plainText = markdownToPlainText(richTextContent);
                            return (
                                <div key={index} className="article-rich-text-block">
                                    <p className="article-content-p">
                                        <InstrumentedText
                                            text={plainText}
                                            globalStartIndex={mapping.globalStartIndex}
                                        />
                                    </p>
                                </div>
                            );
                        }

                        // Non-instrumented: use ReactMarkdown for styling
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
                    const quoteText = (block as any).quote || (block as any).text || (block as any).quote_text || '';
                    const authorText = (block as any).author || (block as any).author_title || '';

                    // Get mappings for quote fields (only if we have valid blockId)
                    const quoteMapping = canInstrument && blockId
                        ? blockMappings?.get(getBlockMappingKey(blockId, 'quote_text'))
                        : undefined;
                    const authorMapping = canInstrument && blockId
                        ? blockMappings?.get(getBlockMappingKey(blockId, 'author'))
                        : undefined;

                    return (
                        <ArticleQuote
                            key={index}
                            quote={quoteText}
                            author={authorText}
                            quoteStartIndex={quoteMapping?.globalStartIndex ?? -1}
                            authorStartIndex={authorMapping?.globalStartIndex ?? -1}
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
