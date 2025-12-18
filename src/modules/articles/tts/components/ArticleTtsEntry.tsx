import React from 'react';
import './ArticleTtsEntry.css';

// SVG Icons for better quality
const PlayIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const StopIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="6" width="12" height="12" />
    </svg>
);

const HeadphonesIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
);

interface ArticleTtsEntryProps {
    ttsStatus?: 'none' | 'pending' | 'ready' | 'error';
    isActive: boolean;
    onStart: () => void;
    onStop: () => void;
}

/**
 * ArticleTtsEntry: The editorial entry point for the TTS feature.
 * Styled to blend into the Magnus typography system.
 */
export const ArticleTtsEntry: React.FC<ArticleTtsEntryProps> = ({
    ttsStatus,
    isActive,
    onStart,
    onStop
}) => {
    // Only show if audio is ready
    if (ttsStatus !== 'ready') return null;

    return (
        <div className="article-tts-entry-container">
            {!isActive ? (
                <button
                    className="tts-entry-button"
                    onClick={onStart}
                    aria-label="Escuchar este artículo"
                >
                    <span className="tts-icon">
                        <PlayIcon />
                    </span>
                    <span className="tts-text">Escuchar artículo</span>
                </button>
            ) : (
                <button
                    className="tts-entry-button active"
                    onClick={onStop}
                    aria-label="Detener audio"
                >
                    <span className="tts-icon">
                        <StopIcon />
                    </span>
                    <span className="tts-text">Detener audio</span>
                </button>
            )}

            <span className="tts-divider"></span>

            <div className="tts-status-indicator">
                <HeadphonesIcon />
                <span className="status-label">Narrado por IA</span>
            </div>
        </div>
    );
};
