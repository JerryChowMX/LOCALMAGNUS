/**
 * VideoPlayer - Single video with autoplay/pause logic
 * Controls playback based on visibility state
 */

import React, { useRef, useEffect } from 'react';
import './VideoPlayer.css';

interface VideoPlayerProps {
    videoUrl: string;
    posterUrl?: string;
    isActive: boolean;
    onVideoEnd?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUrl,
    posterUrl,
    isActive,
    onVideoEnd,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Handle play/pause based on active state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            // Play with error handling for autoplay restrictions
            video.play().catch(() => {
                // Autoplay blocked - user needs to interact first
                // Video will remain paused with poster/controls
            });
        } else {
            video.pause();
            // Reset to start when leaving view
            video.currentTime = 0;
        }
    }, [isActive]);

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
        <div className="video-player">
            <video
                ref={videoRef}
                className="video-player__video"
                src={videoUrl}
                poster={posterUrl}
                playsInline
                muted
                loop
                preload="metadata"
                onEnded={onVideoEnd}
            />
        </div>
    );
};
