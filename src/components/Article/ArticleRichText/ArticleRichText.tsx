import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { StrapiRichTextBlock } from '../types';

interface ArticleRichTextProps {
    blocks: StrapiRichTextBlock[];
}

const HEADING_STYLES: Record<number, React.CSSProperties> = {
    1: {
        fontFamily: '"Blinker", sans-serif',
        fontSize: '2.5rem',
        fontWeight: 800,
        lineHeight: '1.1',
        color: 'var(--text-primary)',
        marginBottom: '24px',
        marginTop: '32px'
    },
    2: {
        fontFamily: '"Blinker", sans-serif',
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: '1.2',
        color: 'var(--text-primary)',
        marginBottom: '20px',
        marginTop: '28px'
    },
    3: {
        fontFamily: '"Blinker", sans-serif',
        fontSize: '1.5rem',
        fontWeight: 700,
        lineHeight: '1.3',
        color: 'var(--text-primary)',
        marginBottom: '16px',
        marginTop: '24px'
    },
    4: {
        fontFamily: '"Blinker", sans-serif',
        fontSize: '1.25rem',
        fontWeight: 700,
        lineHeight: '1.4',
        color: 'var(--text-primary)',
        marginBottom: '12px',
        marginTop: '20px'
    },
    5: {
        fontFamily: '"Inter", sans-serif',
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: '1.4',
        color: 'var(--text-primary)',
        marginBottom: '12px',
        marginTop: '16px'
    },
    6: {
        fontFamily: '"Inter", sans-serif',
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: '1.5',
        color: 'var(--text-secondary)',
        marginBottom: '12px',
        marginTop: '16px'
    }
};

const components = {
    h1: ({ children }: any) => <h1 style={HEADING_STYLES[1]}>{children}</h1>,
    h2: ({ children }: any) => <h2 style={HEADING_STYLES[2]}>{children}</h2>,
    h3: ({ children }: any) => <h3 style={HEADING_STYLES[3]}>{children}</h3>,
    h4: ({ children }: any) => <h4 style={HEADING_STYLES[4]}>{children}</h4>,
    h5: ({ children }: any) => <h5 style={HEADING_STYLES[5]}>{children}</h5>,
    h6: ({ children }: any) => <h6 style={HEADING_STYLES[6]}>{children}</h6>,
    p: ({ children }: any) => (
        <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '1.0625rem',
            lineHeight: '1.65',
            color: 'var(--text-secondary)',
            marginBottom: '20px'
        }}>
            {children}
        </p>
    ),
    ul: ({ children }: any) => (
        <ul style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '1.0625rem',
            lineHeight: '1.65',
            color: 'var(--text-secondary)',
            marginBottom: '20px',
            paddingLeft: '24px',
            listStyleType: 'disc'
        }}>
            {children}
        </ul>
    ),
    ol: ({ children }: any) => (
        <ol style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '1.0625rem',
            lineHeight: '1.65',
            color: 'var(--text-secondary)',
            marginBottom: '20px',
            paddingLeft: '24px',
            listStyleType: 'decimal'
        }}>
            {children}
        </ol>
    ),
    li: ({ children }: any) => (
        <li style={{ marginBottom: '8px' }}>
            {children}
        </li>
    ),
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
        <div style={{ marginBottom: '24px' }}>
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
                        return React.createElement(`h${level}`, {
                            key: index,
                            style: HEADING_STYLES[level]
                        }, block.content);
                    case 'list':
                        // If it came as a structured list object
                        const ListTag = block.ordered ? 'ol' : 'ul';
                        return (
                            <ListTag key={index} style={components[ListTag]({}).props.style}>
                                {block.items?.map((item, i) => <li key={i} style={components.li({}).props.style}>{item}</li>)}
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

