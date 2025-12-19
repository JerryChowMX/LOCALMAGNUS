import React from 'react';

/**
 * PHASE 3: Pure Component Interface
 * No refs. No mutation. No effects.
 */
interface InstrumentedTextProps {
    /** Text to tokenize and instrument */
    text: string;
    /** Global start index from backend blockMappings */
    globalStartIndex: number;
}

/**
 * Tokenizes text into words using same regex as backend (/\S+/g).
 * Single source of truth for tokenization.
 */
const tokenize = (text: string): string[] => {
    return text.match(/\S+/g) || [];
};

/**
 * InstrumentedText - PURE COMPONENT
 * 
 * Wraps each word in a span with data-tts-word attribute for karaoke highlighting.
 * 
 * PHASE 3 CONTRACT:
 * - Index = globalStartIndex + localTokenIndex
 * - No refs
 * - No mutation
 * - No effects
 * - No legacy modes
 * 
 * If globalStartIndex < 0, throws in dev, renders nothing in prod.
 */
export const InstrumentedText: React.FC<InstrumentedTextProps> = ({
    text,
    globalStartIndex
}) => {
    // HARD ERROR: Invalid start index
    if (globalStartIndex < 0) {
        if (import.meta.env.DEV) {
            throw new Error(`[InstrumentedText] Invalid globalStartIndex: ${globalStartIndex}`);
        }
        // Prod: render plain text without instrumentation
        return <>{text}</>;
    }

    const tokens = tokenize(text);

    return (
        <>
            {tokens.map((token, localIndex) => (
                <React.Fragment key={localIndex}>
                    {localIndex > 0 && ' '}
                    <span data-tts-word={globalStartIndex + localIndex}>{token}</span>
                </React.Fragment>
            ))}
        </>
    );
};

export default InstrumentedText;

