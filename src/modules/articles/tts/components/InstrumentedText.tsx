import React from 'react';

interface InstrumentedTextProps {
    text: string;
    wordIndexRef: React.MutableRefObject<number>;
}

/**
 * Tokenizes text into words and non-words (whitespace, punctuation).
 * Uses Unicode-aware regex for proper Spanish/international text support.
 */
const tokenize = (text: string): string[] =>
    text.match(/[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu) ?? [];

/**
 * Checks if a token is a "word" (contains letters or numbers).
 */
const isWordToken = (t: string): boolean => /[\p{L}\p{N}]/u.test(t);

/**
 * Wraps each word in a span with data-tts-word attribute for karaoke highlighting.
 * Non-word tokens (spaces, punctuation) are rendered as-is to preserve layout.
 */
export const InstrumentedText: React.FC<InstrumentedTextProps> = ({ text, wordIndexRef }) => {
    const tokens = tokenize(text);

    return (
        <>
            {tokens.map((token, idx) => {
                // Non-word tokens (spaces, punctuation) rendered without wrapper
                if (!isWordToken(token)) {
                    return <React.Fragment key={idx}>{token}</React.Fragment>;
                }

                // Word tokens get a span with data-tts-word index
                const wordIndex = wordIndexRef.current++;
                if (wordIndex === 0) {
                    console.log('[INSTRUMENT] Word 0 generated:', token);
                }
                return (
                    <span key={idx} data-tts-word={wordIndex}>
                        {token}
                    </span>
                );
            })}
        </>
    );
};

export default InstrumentedText;
