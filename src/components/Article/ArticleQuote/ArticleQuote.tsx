import { useState } from 'react';
import '../Quote/Quote.css';

interface ArticleQuoteProps {
    quote: string;
    author: string;
}

export const ArticleQuote = ({ quote, author }: ArticleQuoteProps) => {
    const [showAuthor, setShowAuthor] = useState(false);

    return (
        <div className="quote-container">
            <div
                onClick={() => setShowAuthor(!showAuthor)}
                className="quote-interactive"
            >
                {/* Quote */}
                <div className={`quote-content ${showAuthor ? 'hidden' : ''}`}>
                    <p className="quote-text">
                        {quote}
                    </p>
                </div>

                {/* Author */}
                <div className={`quote-author-wrapper ${showAuthor ? 'visible' : ''}`}>
                    <p className="quote-author">
                        – {author}
                    </p>
                </div>
            </div>
        </div>
    );
};
