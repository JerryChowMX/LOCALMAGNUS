import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useTtsModel } from '../hooks/useTtsModel';
import { useTtsController } from '../hooks/useTtsController';
import { TtsOverlay } from './TtsOverlay';

interface TtsExperienceProps {
    audioUrl: string;
    metadataUrl: string;
    articleText: string;
    containerRef: React.RefObject<HTMLElement | null>;
    isPaused?: boolean;
    playbackRate?: number;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export interface TtsExperienceHandle {
    seek: (time: number) => void;
}

/**
 * TtsExperience: Orchestrates the full audio-visual TTS system.
 * Handles audio element, model loading, and overlay syncing.
 */
export const TtsExperience = forwardRef<TtsExperienceHandle, TtsExperienceProps>(({
    audioUrl,
    metadataUrl,
    articleText,
    containerRef,
    isPaused = false,
    playbackRate = 1,
    onEnded,
    onTimeUpdate
}, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    // Expose seek method to parent
    useImperativeHandle(ref, () => ({
        seek: (time: number) => {
            if (audioRef.current) {
                audioRef.current.currentTime = time;
            }
        }
    }), []);

    // 1. Load the model (Words & Sentences)
    const { model, isLoading: isModelLoading } = useTtsModel(metadataUrl, articleText);

    // 2. Control Playback & Sync Visuals
    const { sentenceRects, wordRects, isVisible } = useTtsController({
        model,
        audioRef,
        containerRef
    });

    // 3. Handle pause/resume based on isPaused prop
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPaused) {
            audio.pause();
        } else {
            audio.play().catch(() => {
                // Ignore autoplay errors
            });
        }
    }, [isPaused]);

    // 4. Handle playback rate changes
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    // 5. Sync time updates to parent
    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio && onTimeUpdate) {
            onTimeUpdate(audio.currentTime, audio.duration || 0);
        }
    };

    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (audio && onTimeUpdate) {
            onTimeUpdate(0, audio.duration || 0);
        }
    };

    return (
        <>
            {/* Invisibly render the audio element, controlled by the overlay/entry hooks */}
            <audio
                ref={audioRef}
                src={audioUrl}
                autoPlay={!isPaused}
                onEnded={onEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                style={{ display: 'none' }}
            />

            {/* Render the SVG overlay inside the article container proxy */}
            <TtsOverlay
                sentenceRects={sentenceRects}
                wordRects={wordRects}
                isVisible={isVisible && !isModelLoading && !isPaused}
            />
        </>
    );
});

TtsExperience.displayName = 'TtsExperience';
