import { useState, useEffect, useRef, useCallback } from 'react';
import type { PlaybackStatus, TtsWordTiming } from '../types';

interface UseTtsControllerProps {
    /** Array of word timings from TTS metadata */
    wordTimings: TtsWordTiming[];
    /** Reference to the audio element */
    audioRef: React.RefObject<HTMLAudioElement | null>;
    /** Callback when playback status changes */
    onStatusChange?: (status: PlaybackStatus) => void;
    /** Callback when active word changes - for React-first highlighting */
    onActiveWordChange?: (wordIndex: number) => void;
}

/**
 * Binary search to find the active word timing for a given time.
 */
function findActiveWordIndex(timings: TtsWordTiming[], timeMs: number): number {
    let left = 0;
    let right = timings.length - 1;
    let result = -1;

    // Fast tracking optimization: check cached index first? 
    // For now, standard binary search is fast enough for < 2000 items.

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const timing = timings[mid];

        if (timing.startMs <= timeMs && timeMs < timing.endMs) {
            return mid;
        }

        if (timing.startMs <= timeMs) {
            result = mid; // Candidate (if we are in a gap, showing the previous word is safer than next)
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // Strict gap check: if we found a "previous" word but we are actually in a silence gap > 500ms,
    // we might want to return -1. But for now, returning the last passed word is acceptable.
    // However, exact match logic above handles 'inside' the word.
    // If we exit loop, we are in a gap or before first / after last.

    // Check if result is valid (within reasonable margin? or just stick to exact hit?)
    // The previous implementation returned 'result' which acts as "floor".
    // Let's refine: If we didn't hit 'inside' (start <= t < end), we are in a gap.
    // Returning -1 during gaps is cleaner for karaoke.

    if (result !== -1) {
        // If we are strictly inside the word, we returned early.
        // If we are here, it means timeMs >= timing.startMs but timeMs >= timing.endMs
        // So we are AFTER the word.
        return -1;
    }

    return -1;
}

/**
 * TTS Controller Hook - React-First Karaoke Highlighting
 * 
 * REDESIGNED: No longer manipulates DOM directly.
 * Instead, exposes activeWordIndex via callback for parent to set on container.
 * Highlighting is done purely via CSS attribute selectors.
 */
export const useTtsController = ({
    wordTimings,
    audioRef,
    onStatusChange,
    onActiveWordChange
}: UseTtsControllerProps) => {
    const [status, setStatus] = useState<PlaybackStatus>('idle');
    const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);

    // Track current word to avoid redundant updates
    const currentWordRef = useRef<number>(-1);
    const rafIdRef = useRef<number>(undefined);
    const isPlayingRef = useRef<boolean>(false);

    // CRITICAL: Keep fresh reference to wordTimings and callback to avoid stale closure
    const wordTimingsRef = useRef(wordTimings);
    wordTimingsRef.current = wordTimings; // Always update on re-render

    const onActiveWordChangeRef = useRef(onActiveWordChange);
    onActiveWordChangeRef.current = onActiveWordChange; // Always update on re-render

    /**
     * Main update loop - calculates active word and notifies via callback
     * Uses ref to avoid stale closure issues
     */
    const updateActiveWord = useCallback(() => {
        const timings = wordTimingsRef.current; // Read from ref, not closure
        if (!audioRef.current || timings.length === 0) {
            // console.log('[TTS-CTRL] Waiting... audio:', !!audioRef.current, 'timings:', timings.length);
            rafIdRef.current = requestAnimationFrame(updateActiveWord);
            return;
        }

        const timeMs = audioRef.current.currentTime * 1000;
        const newWordIndex = findActiveWordIndex(timings, timeMs);

        // Only update if word changed
        if (newWordIndex !== currentWordRef.current) {
            console.log('[TTS-CTRL] Word changed:', currentWordRef.current, '->', newWordIndex, 'time:', timeMs);
            currentWordRef.current = newWordIndex;
            setActiveWordIndex(newWordIndex);

            // USE REF to ensure we call the LATEST callback, not the one from closure creation time
            if (onActiveWordChangeRef.current) {
                onActiveWordChangeRef.current(newWordIndex);
            }
        }

        rafIdRef.current = requestAnimationFrame(updateActiveWord);
    }, [audioRef]); // Removed onActiveWordChange dependency - using ref instead

    /**
     * Start the update loop
     */
    const startTracking = useCallback(() => {
        console.log('[TTS-CTRL] startTracking called, isPlaying:', isPlayingRef.current);
        if (isPlayingRef.current) return;

        isPlayingRef.current = true;
        setStatus('playing');
        onStatusChange?.('playing');
        rafIdRef.current = requestAnimationFrame(updateActiveWord);
    }, [updateActiveWord, onStatusChange]);

    /**
     * Stop the update loop (but keep activeWordIndex for display)
     */
    const stopTracking = useCallback(() => {
        isPlayingRef.current = false;
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }
        setStatus('paused');
        onStatusChange?.('paused');
        // NOTE: We do NOT reset activeWordIndex - highlight persists!
    }, [onStatusChange]);

    /**
     * Reset everything (for when audio ends or is stopped)
     */
    const reset = useCallback(() => {
        isPlayingRef.current = false;
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }
        currentWordRef.current = -1;
        setActiveWordIndex(-1);
        onActiveWordChange?.(-1);
        setStatus('idle');
        onStatusChange?.('idle');
    }, [onActiveWordChange, onStatusChange]);

    /**
     * Seek to specific time and update active word immediately
     */
    const seekTo = useCallback((timeMs: number) => {
        // Use ref for timings to ensure we have latest data
        const newWordIndex = findActiveWordIndex(wordTimingsRef.current, timeMs);
        currentWordRef.current = newWordIndex;
        setActiveWordIndex(newWordIndex);
        onActiveWordChangeRef.current?.(newWordIndex);
    }, []); // No deps needed, using refs

    // Stable callback refs to prevent effect cleanup on every render

    // Stable callback refs to prevent effect cleanup on every render
    const startTrackingRef = useRef(startTracking);
    const stopTrackingRef = useRef(stopTracking);
    const resetRef = useRef(reset);
    const seekToRef = useRef(seekTo);
    startTrackingRef.current = startTracking;
    stopTrackingRef.current = stopTracking;
    resetRef.current = reset;
    seekToRef.current = seekTo;

    // Listen for audio events - stable effect that doesn't re-run
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) {
            console.log('[TTS-CTRL] No audio element, waiting...');
            return;
        }

        console.log('[TTS-CTRL] Attaching audio event listeners');

        // FIX: Check if already playing (race condition fix)
        if (!audio.paused && !isPlayingRef.current) {
            console.log('[TTS-CTRL] Audio already playing on mount - starting tracking');
            startTrackingRef.current();
        }

        const handlePlay = () => {
            startTrackingRef.current();
        };
        const handlePause = () => {
            stopTrackingRef.current();
        };
        const handleEnded = () => {
            console.log('[TTS-CTRL] Audio ended event');
            resetRef.current();
        };
        const handleSeeked = () => {
            const timeMs = audio.currentTime * 1000;
            seekToRef.current(timeMs);
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('seeked', handleSeeked);

        return () => {
            console.log('[TTS-CTRL] Cleaning up audio listeners');
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('seeked', handleSeeked);
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [audioRef]); // Only depends on audioRef - stable!

    return {
        status,
        activeWordIndex,
        startTracking,
        stopTracking,
        reset,
        seekTo
    };
};
