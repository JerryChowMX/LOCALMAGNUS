import type { FC } from 'react';
import { ArticleRichText, ArticleQuote, ArticleAuthor } from '../../../../components/Article';

interface NotaOriginalViewProps {
    article: any;
}

export const NotaOriginalView: FC<NotaOriginalViewProps> = ({ article }) => {
    return (
        <div className="standard-article-content">
            {/* Rich text content */}
            {article.contentBlocks.map((block: any, index: number) => {
                const componentType = block.__component;

                // RICH TEXT
                if (componentType?.includes('rich-text')) {
                    const richTextBlocks = block.blocks || [];
                    return (
                        <ArticleRichText
                            key={index}
                            blocks={richTextBlocks as any}
                        />
                    );
                }

                // QUOTE
                if (componentType?.includes('quote')) {
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
            <div style={{ marginBottom: '40px', textAlign: 'left' }}>
                <ArticleAuthor name={article.author.name} />
            </div>

            {/* Spacer for bottom sheet */}
            <div style={{ height: '100px' }}></div>
        </div>
    );
};
