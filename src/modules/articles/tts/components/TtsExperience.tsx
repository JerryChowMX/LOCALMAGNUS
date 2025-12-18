import React, { useRef } from 'react';
import { useTtsModel } from '../hooks/useTtsModel';
import { useTtsController } from '../hooks/useTtsController';
import { TtsOverlay } from './TtsOverlay';

interface TtsExperienceProps {
    audioUrl: string;
    metadataUrl: string;
    articleText: string;
    containerRef: React.RefObject<HTMLElement | null>;
    onEnded?: () => void;
}

/**
 * TtsExperience: Orchestrates the full audio-visual TTS system.
 * Handles audio element, model loading, and overlay syncing.
 */
export const TtsExperience: React.FC<TtsExperienceProps> = ({
    audioUrl,
    metadataUrl,
    articleText,
    containerRef,
    onEnded
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    // 1. Load the model (Words & Sentences)
    const { model, isLoading: isModelLoading } = useTtsModel(metadataUrl, articleText);

    // 2. Control Playback & Sync Visuals
    const { sentenceRects, wordRects, isVisible } = useTtsController({
        model,
        audioRef,
        containerRef
    });

    return (
        <>
            {/* Invisibly render the audio element, controlled by the overlay/entry hooks */}
            <audio
                ref={audioRef}
                src={audioUrl}
                autoPlay
                onEnded={onEnded}
                style={{ display: 'none' }}
            />

            {/* Render the SVG overlay inside the article container proxy */}
            <TtsOverlay
                sentenceRects={sentenceRects}
                wordRects={wordRects}
                isVisible={isVisible && !isModelLoading}
            />
        </>
    );
};
