import React from 'react';
import type { Rect } from '../adapters/WebMeasurementAdapter';
import './TtsOverlay.css';

interface TtsOverlayProps {
    sentenceRects: Rect[];
    wordRects: Rect[];
    isVisible: boolean;
}

/**
 * TtsOverlay: Renders the SVG highlight layer.
 * Positioned absolutely relative to the article container.
 */
export const TtsOverlay: React.FC<TtsOverlayProps> = ({
    sentenceRects,
    wordRects,
    isVisible
}) => {
    if (!isVisible) return null;

    return (
        <svg
            className="tts-overlay"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
                mixBlendMode: 'multiply'
            }}
        >
            <defs>
                <filter id="tts-blur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
                </filter>
            </defs>

            {/* Sentence Highlights */}
            <g className="tts-sentence-group" fill="var(--tts-sentence-bg, rgba(210, 227, 252, 0.4))">
                {sentenceRects.map((rect, i) => (
                    <rect
                        key={`sentence-${i}`}
                        x={rect.x}
                        y={rect.y}
                        width={rect.width}
                        height={rect.height}
                        rx={2}
                    />
                ))}
            </g>

            {/* Word Highlight (Karaoke style) */}
            <g className="tts-word-group" fill="var(--tts-word-bg, rgba(138, 180, 248, 0.7))">
                {wordRects.map((rect, i) => (
                    <rect
                        key={`word-${i}`}
                        x={rect.x}
                        y={rect.y}
                        width={rect.width}
                        height={rect.height}
                        rx={2}
                        className="tts-word-rect"
                    />
                ))}
            </g>
        </svg>
    );
};
