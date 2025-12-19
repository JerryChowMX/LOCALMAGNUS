import { useState, useEffect, useRef, useCallback } from 'react';
import type { PlaybackStatus } from '../types';

/**
 * Word timing from backend TTS metadata.
 * Uses backend field names: start_time/end_time (milliseconds)
 */
interface TtsWordTiming {
    word: string;
    start_time: number;  // milliseconds
    end_time: number;    // milliseconds
}

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

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const timing = timings[mid];

        if (timing.start_time <= timeMs && timeMs < timing.end_time) {
            return mid;
        }

        if (timing.start_time <= timeMs) {
            result = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
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

    // CRITICAL: Keep fresh reference to wordTimings to avoid stale closure
    const wordTimingsRef = useRef(wordTimings);
    wordTimingsRef.current = wordTimings; // Always update on re-render

    /**
     * Main update loop - calculates active word and notifies via callback
     * Uses ref to avoid stale closure issues
     */
    const updateActiveWord = useCallback(() => {
        const timings = wordTimingsRef.current; // Read from ref, not closure
        if (!audioRef.current || timings.length === 0) {
            console.log('[TTS-CTRL] Waiting... audio:', !!audioRef.current, 'timings:', timings.length);
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
            onActiveWordChange?.(newWordIndex);
        }

        rafIdRef.current = requestAnimationFrame(updateActiveWord);
    }, [audioRef, onActiveWordChange]); // wordTimings removed - using ref instead

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
        const newWordIndex = findActiveWordIndex(wordTimings, timeMs);
        currentWordRef.current = newWordIndex;
        setActiveWordIndex(newWordIndex);
        onActiveWordChange?.(newWordIndex);
    }, [onActiveWordChange]); // Removed wordTimings - using ref

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

        const handlePlay = () => {
            console.log('[TTS-CTRL] Audio play event');
            startTrackingRef.current();
        };
        const handlePause = () => {
            console.log('[TTS-CTRL] Audio pause event');
            stopTrackingRef.current();
        };
        const handleEnded = () => {
            console.log('[TTS-CTRL] Audio ended event');
            resetRef.current();
        };
        const handleSeeked = () => {
            const timeMs = audio.currentTime * 1000;
            console.log('[TTS-CTRL] Audio seeked event, time:', timeMs);
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
