import React from 'react';

interface InstrumentedTextProps {
    text: string;
    /** Mutable ref for sequential counting (legacy mode) */
    wordIndexRef?: React.MutableRefObject<number>;
    /** Fixed starting index for pre-computed mode */
    startIndex?: number;
}

/**
 * Tokenizes text into words using same regex as backend (/\S+/g).
 * This ensures word count matches backend TTS extraction.
 */
const tokenize = (text: string): string[] => {
    const matches = text.match(/\S+/g);
    return matches || [];
};

/**
 * Wraps each word in a span with data-tts-word attribute for karaoke highlighting.
 * Supports two modes:
 * 1. wordIndexRef: Legacy mode using mutable ref counter
 * 2. startIndex: Pre-computed mode with fixed starting index
 */
export const InstrumentedText: React.FC<InstrumentedTextProps> = ({
    text,
    wordIndexRef,
    startIndex = 0
}) => {
    const words = tokenize(text);
    let localIndex = startIndex;

    // Log when we're about to assign indices 0-5 (to trace where they go)
    if (wordIndexRef && wordIndexRef.current < 10 && words.length > 0) {
        console.log('[INST] Assigning indices', wordIndexRef.current, 'to', wordIndexRef.current + words.length - 1, 'for text:', text.substring(0, 50));
    }

    return (
        <>
            {words.map((word, idx) => {
                // Calculate the word index
                let wordIndex: number;
                if (wordIndexRef) {
                    // Legacy mode: use mutable ref
                    wordIndex = wordIndexRef.current++;
                } else {
                    // Pre-computed mode: use local counter from startIndex
                    wordIndex = localIndex++;
                }

                // Add space between words (except before first)
                const prefix = idx > 0 ? ' ' : '';

                return (
                    <React.Fragment key={idx}>
                        {prefix}
                        <span data-tts-word={wordIndex}>{word}</span>
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default InstrumentedText;
