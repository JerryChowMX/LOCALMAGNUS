import { useState, useEffect, useRef, useCallback } from 'react';
import { TtsPlaybackController } from '../TtsPlaybackController';
import { WebMeasurementAdapter } from '../adapters/WebMeasurementAdapter';
import type { Rect } from '../adapters/WebMeasurementAdapter';
import type { KaraokeModel, PlaybackStatus } from '../types';

interface UseTtsControllerProps {
    model: KaraokeModel | null;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    containerRef: React.RefObject<HTMLElement | null>;
    onStatusChange?: (status: PlaybackStatus) => void;
}

export const useTtsController = ({
    model,
    audioRef,
    containerRef,
    onStatusChange
}: UseTtsControllerProps) => {
    const [status, setStatus] = useState<PlaybackStatus>('idle');
    const [sentenceRects, setSentenceRects] = useState<Rect[]>([]);
    const [wordRects, setWordRects] = useState<Rect[]>([]);

    // Internal state
    const controllerRef = useRef<TtsPlaybackController | null>(null);
    const adapterRef = useRef<WebMeasurementAdapter | null>(null);
    const rafIdRef = useRef<number>(undefined);

    // Caching for rects
    const rectCacheRef = useRef<Map<string, Rect[]>>(new Map());

    const updateVisuals = useCallback(() => {
        if (!controllerRef.current || !adapterRef.current || !audioRef.current) return;

        // Advance the controller with current audio time
        controllerRef.current.tick(audioRef.current.currentTime * 1000);

        const state = controllerRef.current.getCurrentState();

        if (state.activeSentence) {
            const sKey = `s-${state.sentenceIndex}`;
            if (!rectCacheRef.current.has(sKey)) {
                rectCacheRef.current.set(sKey, adapterRef.current.measureRange(state.activeSentence.charStart, state.activeSentence.charEnd));
            }
            setSentenceRects(rectCacheRef.current.get(sKey) || []);
        } else {
            setSentenceRects([]);
        }

        if (state.activeWord) {
            const wKey = `w-${state.wordIndex}`;
            if (!rectCacheRef.current.has(wKey)) {
                rectCacheRef.current.set(wKey, adapterRef.current.measureRange(state.activeWord.charStart, state.activeWord.charEnd));
            }
            setWordRects(rectCacheRef.current.get(wKey) || []);
        } else {
            setWordRects([]);
        }

        rafIdRef.current = requestAnimationFrame(updateVisuals);
    }, [audioRef]);

    // Initialize controller and adapter
    useEffect(() => {
        if (!containerRef.current) return;

        adapterRef.current = new WebMeasurementAdapter(containerRef.current);
        controllerRef.current = new TtsPlaybackController(
            undefined,
            (newStatus) => {
                setStatus(newStatus);
                onStatusChange?.(newStatus);
            }
        );

        if (model) {
            controllerRef.current.setModel(model);
        }

        // Cleanup
        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [containerRef, model, onStatusChange]);

    // Start/Stop rAF loop based on playback status
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => {
            controllerRef.current?.setStatus('playing');
            rafIdRef.current = requestAnimationFrame(updateVisuals);
        };

        const handlePause = () => {
            controllerRef.current?.setStatus('paused');
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };

        const handleEnded = () => {
            controllerRef.current?.setStatus('ended');
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioRef, updateVisuals]);

    // Handle Resize Invalidation
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(() => {
            rectCacheRef.current.clear(); // Invalidate all cached rects on resize
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [containerRef]);

    return {
        status,
        sentenceRects,
        wordRects,
        isVisible: status === 'playing' || status === 'paused'
    };
};
