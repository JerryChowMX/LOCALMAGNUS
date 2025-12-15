/**
 * VideoPlayer - Single video with autoplay/pause logic
 * Controls playback based on visibility state
 * Supports aggressive preloading for next video
 * 
 * Touch controls:
 * - Tap: Toggle play/pause
 * - Hold right side: 2x speed while holding
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Icons } from '../../../components/Icons';
import { VideoProgressBar } from '../../../components/VideoProgressBar';
import './VideoPlayer.css';

interface VideoPlayerProps {
    videoUrl: string;
    posterUrl?: string;
    isActive: boolean;
    shouldPreload?: boolean;
    onVideoEnd?: () => void;
    /** Called when scrubbing state changes (true = scrubbing, false = not) */
    onScrubChange?: (isScrubbing: boolean) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUrl,
    posterUrl,
    isActive,
    shouldPreload = false,
    onVideoEnd,
    onScrubChange,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isSpeedUp, setIsSpeedUp] = useState(false);

    // Touch/hold tracking
    const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isHoldingRef = useRef(false);

    // Video time tracking
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const preloadValue = isActive || shouldPreload ? 'auto' : 'metadata';

    // Reset pause state when becoming active (enables autoplay on scroll)
    useEffect(() => {
        if (isActive) {
            setIsPaused(false);
        }
    }, [isActive]);

    // Handle play/pause based on active state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive && !isPaused) {
            video.play().catch(() => { });
        } else {
            video.pause();
            if (!isActive) {
                video.currentTime = 0;
            }
        }
    }, [isActive, isPaused]);

    // Tap to toggle play/pause
    const handleTap = useCallback(() => {
        if (isHoldingRef.current) return; // Don't trigger tap if holding

        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play().catch(() => { });
            setIsPaused(false);
        } else {
            video.pause();
            setIsPaused(true);
        }
    }, []);

    // Start 2x speed
    const startSpeedUp = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            video.playbackRate = 2.0;
            setIsSpeedUp(true);
        }
    }, []);

    // End 2x speed
    const endSpeedUp = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            video.playbackRate = 1.0;
            setIsSpeedUp(false);
        }
        isHoldingRef.current = false;
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
            holdTimeoutRef.current = null;
        }
    }, []);

    // Check if touch/click is on right side of screen
    const isRightSide = (clientX: number) => {
        const container = containerRef.current;
        if (!container) return false;
        const rect = container.getBoundingClientRect();
        const midpoint = rect.left + rect.width / 2;
        return clientX > midpoint;
    };

    // Touch start - detect hold for 2x speed
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        if (!isRightSide(touch.clientX)) return;

        holdTimeoutRef.current = setTimeout(() => {
            isHoldingRef.current = true;
            startSpeedUp();
        }, 200); // 200ms hold threshold
    };

    // Touch end
    const handleTouchEnd = () => {
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
            holdTimeoutRef.current = null;
        }

        if (isHoldingRef.current) {
            endSpeedUp();
        } else {
            handleTap();
        }
    };

    // Mouse support for testing
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isRightSide(e.clientX)) return;

        holdTimeoutRef.current = setTimeout(() => {
            isHoldingRef.current = true;
            startSpeedUp();
        }, 200);
    };

    const handleMouseUp = () => {
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
            holdTimeoutRef.current = null;
        }

        if (isHoldingRef.current) {
            endSpeedUp();
        }
    };

    const handleClick = () => {
        // Only handle tap if not holding
        if (!isHoldingRef.current) {
            handleTap();
        }
        isHoldingRef.current = false;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            const video = videoRef.current;
            if (video) {
                video.pause();
                video.src = '';
                video.load();
            }
            if (holdTimeoutRef.current) {
                clearTimeout(holdTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="video-player"
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={endSpeedUp}
        >
            <video
                ref={videoRef}
                className="video-player__video"
                src={videoUrl}
                poster={posterUrl}
                playsInline
                loop
                preload={preloadValue}
                onEnded={onVideoEnd}
                onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    if (video.duration) {
                        setCurrentTime(video.currentTime);
                        setDuration(video.duration);
                    }
                }}
            />

            {/* Poster fallback overlay */}
            {posterUrl && !isActive && (
                <div
                    className="video-player__poster-overlay"
                    style={{ backgroundImage: `url(${posterUrl})` }}
                />
            )}

            {/* Pause indicator */}
            {isActive && isPaused && (
                <div className="video-player__pause-indicator">
                    <Icons.play size={48} />
                </div>
            )}

            {/* 2x Speed indicator */}
            {isActive && isSpeedUp && (
                <div className="video-player__speed-indicator">
                    2x
                </div>
            )}

            {/* Progress bar */}
            {isActive && (
                <div className="video-player__progress-container">
                    <VideoProgressBar
                        currentTime={currentTime}
                        duration={duration}
                        onSeek={(time) => {
                            const video = videoRef.current;
                            if (video) {
                                video.currentTime = time;
                                setCurrentTime(time);
                            }
                        }}
                        onScrubStart={() => {
                            const video = videoRef.current;
                            if (video) {
                                video.pause();
                                setIsPaused(true);
                            }
                            onScrubChange?.(true);
                        }}
                        onScrubEnd={() => {
                            onScrubChange?.(false);
                        }}
                        variant="minimal"
                    />
                </div>
            )}
        </div>
    );
};
