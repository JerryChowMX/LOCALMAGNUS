import React from 'react';
import { InstrumentedText } from '../../../modules/articles/tts/components/InstrumentedText';
import './ArticleQuote.css';

interface ArticleQuoteProps {
    quote: string;
    author: string;
    /** When provided, enables TTS word instrumentation for karaoke highlighting */
    wordIndexRef?: React.MutableRefObject<number>;
}

/**
 * ArticleQuote: Simplified inline quote component for articles.
 * Designed for clean reading flow and TTS karaoke compatibility.
 * 
 * IMPORTANT: Decorative characters (" ") and em-dash (—) are placed OUTSIDE
 * the InstrumentedText to avoid desyncing word indices with backend TTS.
 */
export const ArticleQuote: React.FC<ArticleQuoteProps> = ({ quote, author, wordIndexRef }) => {
    // Render text with optional instrumentation for TTS karaoke
    const renderQuoteText = () => {
        if (wordIndexRef) {
            return (
                <>
                    <span className="article-quote-mark">"</span>
                    <InstrumentedText text={quote} wordIndexRef={wordIndexRef} />
                    <span className="article-quote-mark">"</span>
                </>
            );
        }
        return `"${quote}"`;
    };

    const renderAuthor = () => {
        if (!author) return null;
        if (wordIndexRef) {
            return (
                <>
                    <span className="article-quote-dash">— </span>
                    <InstrumentedText text={author} wordIndexRef={wordIndexRef} />
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
