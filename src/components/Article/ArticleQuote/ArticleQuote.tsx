import React, { useState } from 'react';
import { IconCopy, IconShare, IconCheck, IconQuote } from '@tabler/icons-react';
import { InstrumentedText } from '../../../modules/articles/tts/components/InstrumentedText';
import '../Quote/Quote.css';

interface ArticleQuoteProps {
    quote: string;
    author: string;
    /** When provided, enables TTS word instrumentation for karaoke highlighting */
    wordIndexRef?: React.MutableRefObject<number>;
}

export const ArticleQuote = ({ quote, author, wordIndexRef }: ArticleQuoteProps) => {
    const [showAuthor, setShowAuthor] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`"${quote}" - ${author}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: 'Magnus Quote',
                text: `"${quote}" - ${author}`,
            }).catch(console.error);
        } else {
            console.log("Share API not available");
        }
    };

    const toggleAuthor = () => setShowAuthor(!showAuthor);

    // Render text with optional instrumentation for TTS karaoke
    const renderText = (text: string) => {
        if (wordIndexRef) {
            return <InstrumentedText text={text} wordIndexRef={wordIndexRef} />;
        }
        return text;
    };

    return (
        <div className="quote-wrapper">

            {/* Component Container */}
            <div className="quote-content-container">
                <div
                    className="quote-card"
                    onClick={toggleAuthor}
                >
                    <IconQuote size={32} className="quote-icon-main" />

                    {/* Content Container - Grid for alignment */}
                    <div className="quote-grid">
                        {/* Quote - Sets the height, simply fades out */}
                        <p className={`quote-text-element ${showAuthor ? 'hidden' : ''}`}>
                            {renderText(quote)}
                        </p>

                        {/* Author - Overlay */}
                        <div className={`quote-author-element ${showAuthor ? 'visible' : ''}`}>
                            <span className="quote-author-name">
                                {renderText(author)}
                            </span>
                        </div>
                    </div>

                </div>

                {/* Floating Actions */}
                <div className="quote-actions">
                    <button
                        onClick={handleCopy}
                        title="Copy text"
                        className="quote-action-btn"
                    >
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </button>
                    <button
                        onClick={handleShare}
                        title="Share"
                        className="quote-action-btn"
                    >
                        <IconShare size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
