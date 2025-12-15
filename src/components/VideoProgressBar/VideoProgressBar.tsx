/**
 * VideoProgressBar - Reusable progress bar for video players
 * Uses PointerEvents with setPointerCapture for smooth scrubbing
 */

import React, { useRef, useState, useCallback } from 'react';
import './VideoProgressBar.css';

interface VideoProgressBarProps {
    /** Current time in seconds */
    currentTime: number;
    /** Total duration in seconds */
    duration: number;
    /** Callback when user seeks to a new time */
    onSeek: (time: number) => void;
    /** Optional: callback when scrubbing starts (use to pause video) */
    onScrubStart?: () => void;
    /** Optional: variant for different visual styles */
    variant?: 'default' | 'minimal';
}

export const VideoProgressBar: React.FC<VideoProgressBarProps> = ({
    currentTime,
    duration,
    onSeek,
    onScrubStart,
    variant = 'default',
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [scrubTime, setScrubTime] = useState(0);

    // Get time from pointer position
    const getTimeFromEvent = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        return percent * (duration || 1);
    }, [duration]);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        isDragging.current = true;
        setIsScrubbing(true);
        setScrubTime(getTimeFromEvent(e));
        onScrubStart?.(); // Pause video when scrubbing starts
    }, [getTimeFromEvent, onScrubStart]);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return;
        e.stopPropagation();
        setScrubTime(getTimeFromEvent(e));
    }, [getTimeFromEvent]);

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return;
        e.stopPropagation();
        isDragging.current = false;
        onSeek(scrubTime);
        setIsScrubbing(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    }, [scrubTime, onSeek]);

    const progressPercent = isScrubbing
        ? (scrubTime / (duration || 1)) * 100
        : (currentTime / (duration || 1)) * 100;

    return (
        <div className={`video-progress-bar video-progress-bar--${variant}`}>
            <div
                ref={trackRef}
                className={`video-progress-bar__track ${isScrubbing ? 'scrubbing' : ''}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{ touchAction: 'none' }}
            >
                <div
                    className="video-progress-bar__fill"
                    style={{ width: `${progressPercent}%` }}
                >
                    <div className="video-progress-bar__thumb" />
                </div>
            </div>
        </div>
    );
};
