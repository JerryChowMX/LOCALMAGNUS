import React from 'react';
import { InstrumentedText } from '../../../modules/articles/tts/components/InstrumentedText';
import './ArticleQuote.css';

/**
 * PHASE 3: Pure Component Interface
 * No refs. No mutation.
 */
interface ArticleQuoteProps {
    quote: string;
    author?: string;
    /** Global start index for quote text from blockMappings (-1 = no instrumentation) */
    quoteStartIndex?: number;
    /** Global start index for author text from blockMappings (-1 = no instrumentation) */
    authorStartIndex?: number;
}

/**
 * ArticleQuote - PHASE 3 PURE COMPONENT
 * 
 * Decorative characters (" " and —) are placed OUTSIDE InstrumentedText
 * to avoid desyncing word indices with backend TTS.
 * 
 * If start indices are < 0 or undefined, renders without instrumentation.
 */
export const ArticleQuote: React.FC<ArticleQuoteProps> = ({
    quote,
    author,
    quoteStartIndex,
    authorStartIndex
}) => {
    // Determine if instrumentation is enabled
    const shouldInstrumentQuote = quoteStartIndex !== undefined && quoteStartIndex >= 0;
    const shouldInstrumentAuthor = authorStartIndex !== undefined && authorStartIndex >= 0 && author;

    const renderQuoteText = () => {
        if (shouldInstrumentQuote) {
            return (
                <>
                    <span className="article-quote-mark">"</span>
                    <InstrumentedText text={quote} globalStartIndex={quoteStartIndex} />
                    <span className="article-quote-mark">"</span>
                </>
            );
        }
        return `"${quote}"`;
    };

    const renderAuthor = () => {
        if (!author) return null;
        if (shouldInstrumentAuthor) {
            return (
                <>
                    <span className="article-quote-dash">— </span>
                    <InstrumentedText text={author} globalStartIndex={authorStartIndex!} />
                </>
            );
        }
        return `— ${author}`;
    };

    return (
        <blockquote className="article-quote">
            <div className="article-quote-bar" aria-hidden="true" />
            <div className="article-quote-content">
                <p className="article-quote-text">
                    {renderQuoteText()}
                </p>
                {author && (
                    <cite className="article-quote-author">
                        {renderAuthor()}
                    </cite>
                )}
            </div>
        </blockquote>
    );
};

export default ArticleQuote;

