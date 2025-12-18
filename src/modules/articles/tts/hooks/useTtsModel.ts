import { useState, useEffect } from 'react';
import type { KaraokeModel, TtsSegment } from '../types';
import { TtsEngine } from '../TtsEngine';

interface StrapiTtsWord {
    startMs: number;
    endMs: number;
    charIndex: number;
    wordLength: number;
}

/**
 * Hook to fetch and transform Strapi TTS metadata into a KaraokeModel.
 * It also automatically groups words into logical sentences based on punctuation.
 */
export const useTtsModel = (metadataUrl: string | null, text: string) => {
    const [model, setModel] = useState<KaraokeModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!metadataUrl || !text) return;

        const loadModel = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(metadataUrl);
                if (!response.ok) throw new Error(`Failed to fetch metadata: ${response.statusText}`);

                const rawWords: StrapiTtsWord[] = await response.json();

                // 1. Map to TtsSegment
                const words: TtsSegment[] = rawWords.map(w => ({
                    startMs: w.startMs,
                    endMs: w.endMs,
                    charStart: w.charIndex,
                    charEnd: w.charIndex + w.wordLength
                }));

                // 2. Group into sentences
                const sentences: TtsSegment[] = [];
                let currentSentence: TtsSegment | null = null;

                words.forEach((word, index) => {
                    if (!currentSentence) {
                        currentSentence = { ...word };
                    } else {
                        currentSentence.endMs = word.endMs;
                        currentSentence.charEnd = word.charEnd;
                    }

                    // Look ahead or check punctuation in the text at charEnd
                    const wordText = text.slice(word.charStart, word.charEnd);
                    const nextChar = text[word.charEnd] || '';

                    // Simple sentence boundary detection (., !, ?, or end of array)
                    const isLastWord = index === words.length - 1;
                    const isSentenceEnd = /[.!?]/.test(wordText) || /[.!?]/.test(nextChar) || isLastWord;

                    if (isSentenceEnd) {
                        sentences.push(currentSentence);
                        currentSentence = null;
                    }
                });

                setModel({
                    text: TtsEngine.normalizeText(text),
                    words,
                    sentences
                });
            } catch (err: any) {
                console.error('[TTS] Model load failed:', err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadModel();
    }, [metadataUrl, text]);

    return { model, isLoading, error };
};
