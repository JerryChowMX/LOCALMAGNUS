import type { FC } from 'react';
import { ArticleRichText, ArticleQuote, ArticleAuthor } from '../../../../components/Article';
import type { Article, ContentBlock } from '../../types';
import './FormatViews.css';

interface NotaOriginalProps {
    article: Article['attributes'];
}

export const NotaOriginal: FC<NotaOriginalProps> = ({ article }) => {
    return (
        <div className="article-format-view-container standard-article-content">
            {/* Rich text content */}
            {article.content.map((block: ContentBlock, index: number) => {
                const componentType = block.__component;

                // RICH TEXT
                if (componentType === 'shared.rich-text') {
                    return (
                        <ArticleRichText
                            key={index}
                            blocks={block.blocks}
                        />
                    );
                }

                // QUOTE
                if (componentType === 'shared.quote') {
                    return (
                        <ArticleQuote
                            key={index}
                            quote={block.quote}
                            author={block.author}
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
