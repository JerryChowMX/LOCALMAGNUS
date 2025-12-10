import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Headline, Body } from '../Typography/Typography';
import './RichTextRenderer.css';

interface RichTextRendererProps {
    content: string;
    className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
    return (
        <div className={`rich-text-renderer ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => <Headline level={1}>{children}</Headline>,
                    h2: ({ children }) => <Headline level={2}>{children}</Headline>,
                    h3: ({ children }) => <Headline level={3}>{children}</Headline>,
                    h4: ({ children }) => <Headline level={4}>{children}</Headline>,
                    h5: ({ children }) => <Headline level={5}>{children}</Headline>,
                    h6: ({ children }) => <Headline level={6}>{children}</Headline>,
                    p: ({ children }) => <Body className="rich-text-paragraph">{children}</Body>,
                    ul: ({ children }) => <ul className="rich-text-ul">{children}</ul>,
                    ol: ({ children }) => <ol className="rich-text-ol">{children}</ol>,
                    li: ({ children }) => <li className="rich-text-li"><Body>{children}</Body></li>,
                    blockquote: ({ children }) => <blockquote className="rich-text-blockquote">{children}</blockquote>,
                    a: ({ href, children }) => <a href={href} className="rich-text-link" target="_blank" rel="noopener noreferrer">{children}</a>,
                    img: ({ src, alt }) => <img src={src} alt={alt} className="rich-text-image" />,
                    table: ({ children }) => <div className="rich-text-table-wrapper"><table className="rich-text-table">{children}</table></div>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
