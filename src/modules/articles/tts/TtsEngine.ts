import type { TtsSegment, KaraokeModel, KaraokeState } from './types';

/**
 * TtsEngine: Shared Core logic for the TTS Karaoke system.
 * Handles binary search for segments and text normalization.
 */
export class TtsEngine {
    /**
     * Normalizes text from a DOM-like structure to a canonical string.
     * This ensures character offsets from TTS match what's rendered.
     */
    static normalizeText(text: string): string {
        return text
            .normalize('NFKD') // Standardize unicode
            .replace(/[\u2013\u2014]/g, '-') // Normalize em/en dashes
            .replace(/[\u2018\u2019]/g, "'") // Normalize smart quotes
            .replace(/[\u201C\u201D]/g, '"') // Normalize double smart quotes
            .replace(/\u2026/g, '...') // Normalize ellipses
            .replace(/\u00A0/g, ' ') // Non-breaking space to regular space
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim();
    }

    /**
     * Finds the active segment for a given time using binary search.
     */
    static findActiveSegmentIndex(segments: TtsSegment[], currentTimeMs: number): number {
        let low = 0;
        let high = segments.length - 1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const segment = segments[mid];

            if (currentTimeMs >= segment.startMs && currentTimeMs < segment.endMs) {
                return mid;
            } else if (currentTimeMs < segment.startMs) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }

        return -1;
    }

    /**
     * Recomputes the KaraokeState based on the current time.
     */
    static getKaraokeState(model: KaraokeModel, currentTimeMs: number): KaraokeState {
        const sentenceIndex = this.findActiveSegmentIndex(model.sentences, currentTimeMs);
        const wordIndex = this.findActiveSegmentIndex(model.words, currentTimeMs);

        return {
            activeSentence: sentenceIndex !== -1 ? model.sentences[sentenceIndex] : undefined,
            activeWord: wordIndex !== -1 ? model.words[wordIndex] : undefined,
            sentenceIndex,
            wordIndex
        };
    }
}
