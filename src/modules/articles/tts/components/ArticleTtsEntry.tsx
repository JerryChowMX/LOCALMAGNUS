import React from 'react';
import './ArticleTtsEntry.css';

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
                    <span className="tts-icon">▶</span>
                    <span className="tts-text">Escuchar artículo</span>
                </button>
            ) : (
                <button
                    className="tts-entry-button active"
                    onClick={onStop}
                    aria-label="Detener audio"
                >
                    <span className="tts-icon">■</span>
                    <span className="tts-text">Detener audio</span>
                </button>
            )}

            <span className="tts-divider"></span>

            <div className="tts-status-indicator">
                <span className="status-label">Narrado por AI</span>
                <span className="status-dot"></span>
            </div>
        </div>
    );
};
