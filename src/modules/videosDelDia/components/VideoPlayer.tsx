/**
 * VideoPlayer - Single video with autoplay/pause logic
 * Controls playback based on visibility state
 * Supports aggressive preloading for next video
 */

import React, { useRef, useEffect, useState } from 'react';
import './VideoPlayer.css';

interface VideoPlayerProps {
    videoUrl: string;
    posterUrl?: string;
    isActive: boolean;
    shouldPreload?: boolean; // True for active + next video
    onVideoEnd?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUrl,
    posterUrl,
    isActive,
    shouldPreload = false,
    onVideoEnd,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Determine preload strategy
    // - Active: auto (full preload)
    // - Next: auto (aggressive preload for smoothness)
    // - Others: metadata only
    const preloadValue = isActive || shouldPreload ? 'auto' : 'metadata';

    // Handle play/pause based on active state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            // Play with error handling for autoplay restrictions
            video.play().catch(() => {
                // Autoplay blocked - user needs to interact first
                setHasInteracted(false);
            });
        } else {
            video.pause();
            // Reset to start when leaving view
            video.currentTime = 0;
        }
    }, [isActive]);

    // Handle user tap to unmute/play (for autoplay-blocked scenarios)
    const handleVideoClick = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play().catch(() => { });
            setHasInteracted(true);
        }
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
        };
    }, []);

    return (
        <div className="video-player" onClick={handleVideoClick}>
            <video
                ref={videoRef}
                className="video-player__video"
                src={videoUrl}
                poster={posterUrl}
                playsInline
                muted
                loop
                preload={preloadValue}
                onEnded={onVideoEnd}
            />
            {/* Poster fallback overlay for when video hasn't loaded */}
            {posterUrl && !isActive && (
                <div
                    className="video-player__poster-overlay"
                    style={{ backgroundImage: `url(${posterUrl})` }}
                />
            )}
        </div>
    );
};
