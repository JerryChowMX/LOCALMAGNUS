import { useState, useEffect, useRef, useCallback } from 'react';
import type { PlaybackStatus } from '../types';

interface TtsWordTiming {
    startMs: number;
    endMs: number;
    charIndex: number;
    wordLength: number;
}

interface UseTtsControllerProps {
    /** Array of word timings from TTS metadata */
    wordTimings: TtsWordTiming[];
    /** Reference to the audio element */
    audioRef: React.RefObject<HTMLAudioElement | null>;
    /** Callback when playback status changes */
    onStatusChange?: (status: PlaybackStatus) => void;
}

/**
 * Binary search to find the active word timing for a given time.
 */
function findActiveWordIndex(timings: TtsWordTiming[], timeMs: number): number {
    let left = 0;
    let right = timings.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const timing = timings[mid];

        if (timing.startMs <= timeMs && timeMs < timing.endMs) {
            return mid;
        }

        if (timing.startMs <= timeMs) {
            result = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

/**
 * Check if element is within visible viewport with margin.
 */
function isInViewport(el: Element, margin: number = 100): boolean {
    const rect = el.getBoundingClientRect();
    return rect.top >= margin && rect.bottom <= window.innerHeight - margin;
}

/**
 * TTS Controller Hook - Word-Index Based Karaoke Highlighting
 * 
 * Uses CSS class `.tts-active` on span elements with `data-tts-word` attributes.
 * No rect overlays, no char-offset scanning.
 */
export const useTtsController = ({
    wordTimings,
    audioRef,
    onStatusChange
}: UseTtsControllerProps) => {
    const [status, setStatus] = useState<PlaybackStatus>('idle');
    const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);

    // Track current word to avoid redundant DOM updates
    const currentWordRef = useRef<number>(-1);
    const rafIdRef = useRef<number>(undefined);
    const isPlayingRef = useRef<boolean>(false);

    /**
     * Main highlight update loop - runs on rAF during playback
     */
    const updateHighlight = useCallback(() => {
        if (!audioRef.current || wordTimings.length === 0) {
            rafIdRef.current = requestAnimationFrame(updateHighlight);
            return;
        }

        const timeMs = audioRef.current.currentTime * 1000;
        const newWordIndex = findActiveWordIndex(wordTimings, timeMs);

        // Only update DOM if word changed
        if (newWordIndex !== currentWordRef.current) {
            // ROBUST OFFSET DETECTION
            // Calculate once for the whole update block
            const scopeEl = document.querySelector('[data-tts-scope="article-body"]');
            const firstDomEl = scopeEl?.querySelector('[data-tts-word]') as HTMLElement | null;
            const offset = firstDomEl ? Number(firstDomEl.dataset.ttsWord) || 0 : 0;

            // Remove highlight from previous word
            if (currentWordRef.current >= 0) {
                const prevTargetIndex = currentWordRef.current + offset;
                const prevEl = document.querySelector(
                    `[data-tts-scope="article-body"] [data-tts-word="${prevTargetIndex}"]`
                );
                prevEl?.classList.remove('tts-active');
            }

            // Add highlight to new word
            if (newWordIndex >= 0) {
                const targetIndex = newWordIndex + offset;
                const selector = `[data-tts-scope="article-body"] [data-tts-word="${targetIndex}"]`;
                let newEl = document.querySelector(selector) as HTMLElement | null;

                if (newEl) {
                    newEl.classList.add('tts-active');
                    console.log(`[TTS-CTRL] Highlighted word ${newWordIndex} (DOM index ${targetIndex}): "${newEl.innerText}"`);
                    // Auto-scroll if word is outside viewport
                    if (!isInViewport(newEl)) {
                        newEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
                    }
                } else {
                    console.warn(`[TTS-CTRL] Word element not found! Selector: ${selector}, Offset used: ${offset}, Audio word index: ${newWordIndex}`);
                }
            }

            currentWordRef.current = newWordIndex;
            setActiveWordIndex(newWordIndex);
        }

        rafIdRef.current = requestAnimationFrame(updateHighlight);
    }, [audioRef, wordTimings]);

    /**
     * Cleanup highlight when stopping or unmounting
     */
    const clearAllHighlights = useCallback(() => {
        const activeElements = document.querySelectorAll('[data-tts-scope="article-body"] .tts-active');
        activeElements.forEach(el => el.classList.remove('tts-active'));
        currentWordRef.current = -1;
        setActiveWordIndex(-1);
    }, []);

    /**
     * Handle audio events
     */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => {
            isPlayingRef.current = true;
            setStatus('playing');
            onStatusChange?.('playing');
            // Only start RAF if we have wordTimings
            if (wordTimings.length > 0) {
                rafIdRef.current = requestAnimationFrame(updateHighlight);
            }
        };

        const handlePause = () => {
            isPlayingRef.current = false;
            setStatus('paused');
            onStatusChange?.('paused');
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            // Keep highlight visible when paused (freeze)
        };

        const handleEnded = () => {
            isPlayingRef.current = false;
            setStatus('ended');
            onStatusChange?.('ended');
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            clearAllHighlights();
        };

        const handleSeeked = () => {
            // Force update on seek
            if (status === 'playing') {
                // Update will happen naturally on next rAF
            } else {
                // Update immediately for paused/idle state
                const timeMs = audio.currentTime * 1000;
                const newWordIndex = findActiveWordIndex(wordTimings, timeMs);

                if (newWordIndex !== currentWordRef.current) {
                    if (currentWordRef.current >= 0) {
                        const prevEl = document.querySelector(
                            `[data-tts-scope="article-body"] [data-tts-word="${currentWordRef.current}"]`
                        );
                        prevEl?.classList.remove('tts-active');
                    }

                    if (newWordIndex >= 0) {
                        // Apply offset detection here too
                        const scopeEl = document.querySelector('[data-tts-scope="article-body"]');
                        const firstDomEl = scopeEl?.querySelector('[data-tts-word]') as HTMLElement | null;
                        const offset = firstDomEl ? Number(firstDomEl.dataset.ttsWord) || 0 : 0;

                        const targetIndex = newWordIndex + offset;
                        const newEl = document.querySelector(
                            `[data-tts-scope="article-body"] [data-tts-word="${targetIndex}"]`
                        );
                        newEl?.classList.add('tts-active');
                    }

                    currentWordRef.current = newWordIndex;
                    setActiveWordIndex(newWordIndex);
                }
            }
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('seeked', handleSeeked);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('seeked', handleSeeked);
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            clearAllHighlights();
        };
    }, [audioRef, updateHighlight, clearAllHighlights, onStatusChange, status, wordTimings]);

    /**
     * Critical: Restart karaoke when wordTimings arrive while audio is already playing.
     * This handles the race condition where play fires before metadata loads.
     */
    useEffect(() => {
        if (isPlayingRef.current && wordTimings.length > 0 && audioRef.current && !audioRef.current.paused) {
            console.log('[TTS-CTRL] Word timings arrived while playing - starting karaoke loop now!');
            // Cancel any existing RAF to avoid duplicates
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = requestAnimationFrame(updateHighlight);
        }
    }, [wordTimings.length, audioRef, updateHighlight]);

    return {
        status,
        activeWordIndex,
        isVisible: status === 'playing' || status === 'paused',
        clearHighlights: clearAllHighlights
    };
};
