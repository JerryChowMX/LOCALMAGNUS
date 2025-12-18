/**
 * Core types for the MAGNUS TTS Karaoke system.
 * Designed to be platform-agnostic (Shared Core).
 */

export interface TtsSegment {
    /** Start time in milliseconds */
    startMs: number;
    /** End time in milliseconds */
    endMs: number;
    /** Character start offset in the canonical text */
    charStart: number;
    /** Character end offset in the canonical text */
    charEnd: number;
}

export interface KaraokeModel {
    /** The canonical source-of-truth text extracted from the DOM */
    text: string;
    /** Array of word-level segments */
    words: TtsSegment[];
    /** Array of sentence-level segments */
    sentences: TtsSegment[];
}

export interface KaraokeState {
    /** The currently active sentence segment */
    activeSentence?: TtsSegment;
    /** The currently active word segment */
    activeWord?: TtsSegment;
    /** Index of the current sentence in the sentences array */
    sentenceIndex: number;
    /** Index of the current word in the words array */
    wordIndex: number;
}

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';
