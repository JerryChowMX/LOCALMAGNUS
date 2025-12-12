import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArticleRichText, ArticleQuote, ArticleAuthor } from '../../../../components/Article';
import type { Article, ContentBlock } from '../../types';
import './FormatViews.css';

interface NotaOriginalProps {
    article: Article['attributes'];
}

// MAGNUS Typography components for ReactMarkdown
const magnusComponents = {
    h1: ({ children }: any) => (
        <h1 style={{
            fontFamily: '"Blinker", sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            color: 'var(--text-primary)',
            marginBottom: '20px',
            marginTop: '32px'
        }}>{children}</h1>
    ),
    h2: ({ children }: any) => (
        <h2 style={{
            fontFamily: '"Blinker", sans-serif',
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.3,
            color: 'var(--text-primary)',
            marginBottom: '16px',
            marginTop: '28px'
        }}>{children}</h2>
    ),
    h3: ({ children }: any) => (
        <h3 style={{
            fontFamily: '"Blinker", sans-serif',
            fontWeight: 700,
            fontSize: '1.5rem',
            lineHeight: 1.4,
            color: 'var(--text-primary)',
            marginBottom: '12px',
            marginTop: '24px'
        }}>{children}</h3>
    ),
    p: ({ children }: any) => (
        <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            marginBottom: '16px'
        }}>{children}</p>
    ),
    li: ({ children }: any) => (
        <li style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            marginBottom: '8px'
        }}>{children}</li>
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
                const componentType = block.__component;

                // RICH TEXT (supports both shared.rich-text and content.rich-text)
                if (componentType === 'shared.rich-text' || componentType === 'content.rich-text') {
                    // Strapi content.rich-text has a 'content' field with markdown/HTML
                    // shared.rich-text has 'blocks' array
                    const richTextContent = (block as any).content;
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
                            blocks={block.blocks || block.body || []}
                        />
                    );
                }

                // QUOTE (supports both shared.quote and content.quote)
                if (componentType === 'shared.quote' || componentType === 'content.quote') {
                    return (
                        <ArticleQuote
                            key={index}
                            quote={block.quote || block.text || (block as any).quote_text || ''}
                            author={block.author || (block as any).author_title || ''}
                        />
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
