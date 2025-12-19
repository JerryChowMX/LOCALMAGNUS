import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useTtsModel } from '../hooks/useTtsModel';
import { useTtsController } from '../hooks/useTtsController';
import './TtsOverlay.css'; // Import CSS for .tts-active styles

interface TtsExperienceProps {
    audioUrl: string;
    metadataUrl: string;
    articleText: string;
    isPaused?: boolean;
    playbackRate?: number;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export interface TtsExperienceHandle {
    seek: (time: number) => void;
}

/**
 * TtsExperience: Orchestrates the TTS audio playback and karaoke highlighting.
 * Uses word-index based highlighting via CSS classes on data-tts-word spans.
 */
export const TtsExperience = forwardRef<TtsExperienceHandle, TtsExperienceProps>(({
    audioUrl,
    metadataUrl,
    articleText,
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

    // 1. Load the word timings from metadata
    const { wordTimings } = useTtsModel(metadataUrl, articleText);

    console.log('[TTS-EXP] audioRef:', !!audioRef.current, 'wordTimings:', wordTimings.length);

    // 2. Control Karaoke Highlighting
    const { clearHighlights } = useTtsController({
        wordTimings,
        audioRef
    });

    // 3. Handle pause/resume based on isPaused prop
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        console.log('[TTS-EXP] isPaused changed to:', isPaused, 'audio:', audio.src);

        if (isPaused) {
            audio.pause();
        } else {
            console.log('[TTS-EXP] Calling audio.play()...');
            audio.play().then(() => {
                console.log('[TTS-EXP] audio.play() success');
            }).catch((e) => {
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

    // 5. Clear highlights when unmounting or audio ends
    useEffect(() => {
        return () => {
            clearHighlights();
        };
    }, [clearHighlights]);

    // 6. Sync time updates to parent
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
            {/* Audio element - hidden, controlled programmatically */}
            <audio
                ref={audioRef}
                src={audioUrl}
                autoPlay={!isPaused}
                onEnded={onEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                style={{ display: 'none' }}
            />
            {/* No SVG overlay needed - highlighting is done via CSS classes */}
        </>
    );
});

TtsExperience.displayName = 'TtsExperience';
