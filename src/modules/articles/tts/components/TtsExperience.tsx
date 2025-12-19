import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useTtsModel } from '../hooks/useTtsModel';
import { useTtsController } from '../hooks/useTtsController';

interface TtsExperienceProps {
    audioUrl: string;
    metadataUrl: string;
    /** Article content blocks for canonical verification */
    articleBlocks: Array<{ __component: string;[key: string]: unknown }>;
    /** Article ID for verification logging */
    articleId: string;
    isPaused?: boolean;
    playbackRate?: number;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    /** Callback when active word changes - parent uses this for CSS highlighting */
    onActiveWordChange?: (wordIndex: number) => void;
    /** Callback when verification status changes */
    onVerificationChange?: (isVerified: boolean, error?: string) => void;
}

export interface TtsExperienceHandle {
    seek: (time: number) => void;
}

/**
 * TtsExperience: Orchestrates TTS audio playback and provides active word index.
 * 
 * PHASE 2: Now includes canonical verification.
 * Highlighting is disabled until verification passes.
 */
export const TtsExperience = forwardRef<TtsExperienceHandle, TtsExperienceProps>(({
    audioUrl,
    metadataUrl,
    articleBlocks,
    articleId,
    isPaused = false,
    playbackRate = 1,
    onEnded,
    onTimeUpdate,
    onActiveWordChange,
    onVerificationChange
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

    // 1. Load metadata and verify canonical contract
    const { wordTimings, isVerified, verification } = useTtsModel(metadataUrl, articleBlocks, articleId);

    // Notify parent of verification status
    useEffect(() => {
        onVerificationChange?.(isVerified, verification?.error);
    }, [isVerified, verification, onVerificationChange]);

    // 2. Control Karaoke - only if verified
    // PHASE 2: Passing empty timings until Phase 3 instrumentation is ready
    useTtsController({
        wordTimings: isVerified ? wordTimings : [],  // Disable if not verified
        audioRef,
        onActiveWordChange: isVerified ? onActiveWordChange : undefined
    });

    // 3. Handle pause/resume based on isPaused prop
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPaused) {
            audio.pause();
        } else {
            audio.play().catch((e) => {
                console.warn('[TTS-EXP] audio.play() error:', e);
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

    const handleEnded = () => {
        onActiveWordChange?.(-1); // Clear highlight
        onEnded?.();
    };

    return (
        <>
            {/* Audio element - hidden, controlled programmatically */}
            <audio
                ref={audioRef}
                src={audioUrl}
                autoPlay={!isPaused}
                onEnded={handleEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                style={{ display: 'none' }}
            />
        </>
    );
});

TtsExperience.displayName = 'TtsExperience';
