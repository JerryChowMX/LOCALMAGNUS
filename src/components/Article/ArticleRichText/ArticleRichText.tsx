import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { StrapiRichTextBlock } from '../types';

interface ArticleRichTextProps {
    blocks: StrapiRichTextBlock[];
}

// MAGNUS Typography components for ReactMarkdown - using CSS classes for theme variable support
const components = {
    h1: ({ children }: any) => <h1 className="article-content-h1">{children}</h1>,
    h2: ({ children }: any) => <h2 className="article-content-h2">{children}</h2>,
    h3: ({ children }: any) => <h3 className="article-content-h3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="article-content-h3">{children}</h4>,
    h5: ({ children }: any) => <h5 className="article-content-p">{children}</h5>,
    h6: ({ children }: any) => <h6 className="article-content-p">{children}</h6>,
    p: ({ children }: any) => <p className="article-content-p">{children}</p>,
    ul: ({ children }: any) => <ul className="article-content-ul">{children}</ul>,
    ol: ({ children }: any) => <ol className="article-content-ol">{children}</ol>,
    li: ({ children }: any) => <li className="article-content-li">{children}</li>,
    strong: ({ children }: any) => (
        <strong style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {children}
        </strong>
    )
};

export const ArticleRichText = ({ blocks }: ArticleRichTextProps) => {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    return (
        <div>
            {blocks.map((block, index) => {
                // If it's a paragraph, we assume it might contain Markdown
                if (block.type === 'paragraph') {
                    return (
                        <ReactMarkdown
                            key={index}
                            remarkPlugins={[remarkGfm]}
                            components={components}
                        >
                            {block.content || ''}
                        </ReactMarkdown>
                    );
                }

                // If it's a heading, list, etc. that is already structured (rare if we get raw md text)
                // we can still fall back to manual render if needed, or convert to md and let ReactMarkdown handle it.
                // For now, let's assume the mapped structure uses 'paragraph' for text chunks.

                switch (block.type) {
                    case 'heading':
                        const level = block.level || 2;
                        const headingClass = level <= 1 ? 'article-content-h1' : level === 2 ? 'article-content-h2' : 'article-content-h3';
                        return React.createElement(`h${level}`, {
                            key: index,
                            className: headingClass
                        }, block.content);
                    case 'list':
                        // If it came as a structured list object
                        const ListTag = block.ordered ? 'ol' : 'ul';
                        const listClass = block.ordered ? 'article-content-ol' : 'article-content-ul';
                        return (
                            <ListTag key={index} className={listClass}>
                                {block.items?.map((item, i) => <li key={i} className="article-content-li">{item}</li>)}
                            </ListTag>
                        );
                    default:
                        // Fallback for types not handled or mapped differently
                        if (block.content) {
                            return (
                                <ReactMarkdown
                                    key={index}
                                    remarkPlugins={[remarkGfm]}
                                    components={components}
                                >
                                    {block.content}
                                </ReactMarkdown>
                            );
                        }
                        return null;
                }
            })}
        </div>
    );
};

