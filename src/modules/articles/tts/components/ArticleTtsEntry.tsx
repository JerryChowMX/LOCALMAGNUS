import React, { useRef, useState, useCallback } from 'react';
import './ArticleTtsEntry.css';

// Available playback speeds
const PLAYBACK_SPEEDS = [0.8, 1, 1.2, 1.8, 2.2] as const;
type PlaybackSpeed = typeof PLAYBACK_SPEEDS[number];

// SVG Icons
const PlayIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="5" width="4" height="14" />
        <rect x="14" y="5" width="4" height="14" />
    </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

/**
 * Formats remaining time as MM:SS
 * @param remainingSeconds - seconds remaining
 * @returns formatted string like "02:20" or "00:35"
 */
const formatRemainingTime = (remainingSeconds: number): string => {
    if (!remainingSeconds || remainingSeconds < 0 || !isFinite(remainingSeconds)) {
        return '00:00';
    }

    const totalSeconds = Math.ceil(remainingSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Formats speed for display
 */
const formatSpeed = (speed: number): string => {
    return speed === 1 ? '1x' : `${speed}x`;
};

interface ArticleTtsEntryProps {
    ttsStatus?: 'none' | 'pending' | 'ready' | 'error';
    isActive: boolean;
    isPaused?: boolean;
    currentTime?: number;
    duration?: number;
    playbackRate?: number;
    onStart: () => void;
    onStop: () => void;
    onPause?: () => void;
    onResume?: () => void;
    onSeek?: (time: number) => void;
    onPlaybackRateChange?: (rate: number) => void;
}

/**
 * ArticleTtsEntry: Visual entry point for the TTS feature.
 * Design matches the reference audio player component.
 */
export const ArticleTtsEntry: React.FC<ArticleTtsEntryProps> = ({
    ttsStatus,
    isActive,
    isPaused = false,
    currentTime = 0,
    duration = 0,
    playbackRate = 1,
    onStart,
    onStop,
    onPause,
    onResume,
    onSeek,
    onPlaybackRateChange
}) => {
    const progressRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState<number | null>(null);

    // Only show if audio is ready
    if (ttsStatus !== 'ready') return null;

    // Handle play/pause toggle
    const handleToggle = () => {
        if (!isActive) {
            onStart();
        } else if (isPaused && onResume) {
            onResume();
        } else if (onPause) {
            onPause();
        } else {
            onStop();
        }
    };

    // Handle speed cycling
    const handleSpeedClick = () => {
        if (!onPlaybackRateChange) return;

        const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackRate as PlaybackSpeed);
        const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
        onPlaybackRateChange(PLAYBACK_SPEEDS[nextIndex]);
    };

    // Calculate position from mouse/touch event
    const getPositionFromEvent = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!progressRef.current || duration <= 0) return null;

        const rect = progressRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX : e.clientX;
        const x = clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        return percent * duration;
    }, [duration]);

    // Handle click on progress bar
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!onSeek || !isActive) return;
        const time = getPositionFromEvent(e);
        if (time !== null) {
            onSeek(time);
        }
    };

    // Handle drag start
    const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!isActive || !onSeek) return;
        // e.preventDefault(); // REMOVED: Breaks passive listeners in React 18
        setIsDragging(true);

        const time = getPositionFromEvent(e);
        if (time !== null) {
            setDragPosition(time);
        }

        // Add global listeners for smooth dragging
        const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
            const newTime = getPositionFromEvent(moveEvent);
            if (newTime !== null) {
                setDragPosition(newTime);
            }
        };

        const handleEnd = (endEvent: MouseEvent | TouchEvent) => {
            const finalTime = getPositionFromEvent(endEvent);
            if (finalTime !== null && onSeek) {
                onSeek(finalTime);
            }
            setIsDragging(false);
            setDragPosition(null);
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleEnd);
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
    };

    // Show play icon if not active or if paused, otherwise show pause
    const showPlayIcon = !isActive || isPaused;

    // Calculate display values
    const displayTime = isDragging && dragPosition !== null ? dragPosition : currentTime;
    const remainingTime = duration - displayTime;
    const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

    return (
        <div className="audio-player-container">
            <div className="audio-player-header">Escuchar artículo:</div>

            <div className="audio-player-controls">
                {/* Play/Pause Button */}
                <button
                    className={`audio-play-button ${isActive && !isPaused ? 'playing' : ''}`}
                    onClick={handleToggle}
                    aria-label={showPlayIcon ? 'Reproducir audio' : 'Pausar audio'}
                >
                    {showPlayIcon ? <PlayIcon /> : <PauseIcon />}
                </button>

                {/* Time Display - shows remaining time */}
                <span className="audio-time-display">
                    {formatRemainingTime(remainingTime)}
                </span>

                {/* Progress Bar - Interactive */}
                <div
                    className={`audio-progress-container ${isActive ? 'interactive' : ''} ${isDragging ? 'dragging' : ''}`}
                    ref={progressRef}
                    onClick={handleProgressClick}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    role="slider"
                    aria-label="Progreso del audio"
                    aria-valuemin={0}
                    aria-valuemax={duration}
                    aria-valuenow={displayTime}
                >
                    <div className="audio-progress-track">
                        <div
                            className="audio-progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                        <div
                            className="audio-progress-thumb"
                            style={{ left: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Speed Control - Click to cycle through speeds */}
                <div className="audio-speed-wrapper">
                    <button
                        className="audio-speed-button"
                        onClick={handleSpeedClick}
                        aria-label={`Velocidad de reproducción: ${formatSpeed(playbackRate)}. Clic para cambiar.`}
                        title="Clic para cambiar velocidad"
                    >
                        {formatSpeed(playbackRate)}
                    </button>
                </div>

                {/* Favorite Button - visual only */}
                <button
                    className="audio-favorite-button"
                    aria-label="Agregar a favoritos"
                >
                    <HeartIcon filled={false} />
                </button>
            </div>
        </div>
    );
};
