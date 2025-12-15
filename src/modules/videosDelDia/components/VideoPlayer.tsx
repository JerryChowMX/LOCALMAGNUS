/**
 * VideoPlayer - Single video with autoplay/pause logic
 * Controls playback based on visibility state
 * Supports aggressive preloading for next video
 */

import React, { useRef, useEffect, useState } from 'react';
import { Icons } from '../../../components/Icons';
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
    const [isMuted, setIsMuted] = useState(false); // Unmuted by default for mobile app

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
                // Autoplay blocked - video will remain paused
            });
        } else {
            video.pause();
            // Reset to start when leaving view
            video.currentTime = 0;
        }
    }, [isActive]);

    // Sync muted state with video element
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = isMuted;
        }
    }, [isMuted]);

    // Toggle mute/unmute
    const handleMuteToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Don't trigger video click
        setIsMuted(!isMuted);
    };

    // Handle video area click - play if paused
    const handleVideoClick = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play().catch(() => { });
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
                muted={isMuted}
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

            {/* Mute/Unmute button - only show when active */}
            {isActive && (
                <button
                    className="video-player__mute-btn"
                    onClick={handleMuteToggle}
                    aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                    {isMuted ? (
                        <Icons.volumeOff size={24} />
                    ) : (
                        <Icons.volume size={24} />
                    )}
                </button>
            )}
        </div>
    );
};
