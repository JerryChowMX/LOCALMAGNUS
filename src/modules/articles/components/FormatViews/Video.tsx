import { useRef, useState, useCallback, useEffect, type FC } from 'react';
import type { Article } from '../../types';
import { Icons } from '../../../../components/Icons';
import { usePodcastContext } from '../../../../contexts/PodcastContext';
import './FormatViews.css';

interface VideoProps {
    article: Article['attributes'];
}

const SPEED_BOOST = 2;

export const Video: FC<VideoProps> = ({ article }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const holdTimer = useRef<number | null>(null);
    const isDragging = useRef(false);
    const isHolding = useRef(false);

    // Audio focus management
    const { pauseForOtherAudio } = usePodcastContext();

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [scrubTime, setScrubTime] = useState(0);
    const [isSpeedBoosted, setIsSpeedBoosted] = useState(false);

    // Fullscreen toggle
    const toggleFullscreen = useCallback(async () => {
        if (!containerRef.current) return;
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await containerRef.current.requestFullscreen();
            }
        } catch (e) {
            console.error('Fullscreen error:', e);
        }
    }, []);

    // Listen for fullscreen changes
    useEffect(() => {
        const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    // Cleanup hold timer on unmount
    useEffect(() => {
        return () => { if (holdTimer.current) clearTimeout(holdTimer.current); };
    }, []);

    // Speed boost handlers
    const startSpeedBoost = useCallback(() => {
        if (videoRef.current && isPlaying) {
            videoRef.current.playbackRate = SPEED_BOOST;
            setIsSpeedBoosted(true);
        }
    }, [isPlaying]);

    const endSpeedBoost = useCallback(() => {
        if (videoRef.current) videoRef.current.playbackRate = 1;
        setIsSpeedBoosted(false);
        if (holdTimer.current) clearTimeout(holdTimer.current);
        holdTimer.current = null;
        isHolding.current = false;
    }, []);

    const handleVideoPointerDown = useCallback((e: React.PointerEvent) => {
        if (e.button !== 0) return;
        isHolding.current = true;
        holdTimer.current = window.setTimeout(() => {
            if (isHolding.current) startSpeedBoost();
        }, 200);
    }, [startSpeedBoost]);

    const handleVideoPointerUp = useCallback(() => {
        endSpeedBoost();
    }, [endSpeedBoost]);

    const handleVideoClick = useCallback(async () => {
        if (isSpeedBoosted) return;
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            // Pause global podcast before playing video
            pauseForOtherAudio();
            // Enter fullscreen when starting playback
            if (!document.fullscreenElement && containerRef.current) {
                try {
                    await containerRef.current.requestFullscreen();
                } catch (e) {
                    console.error('Fullscreen error:', e);
                }
            }
            video.play().catch(console.error);
        } else {
            video.pause();
        }
    }, [isSpeedBoosted, pauseForOtherAudio]);

    // Time update
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video && !isDragging.current) {
            setCurrentTime(video.currentTime);
            setDuration(video.duration || 0);
        }
    };

    // Format time as mm:ss
    const formatTime = (time: number) => {
        if (!isFinite(time) || isNaN(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Progress bar scrubbing
    const getTimeFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * (duration || 1);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        isDragging.current = true;
        setIsScrubbing(true);
        setScrubTime(getTimeFromEvent(e));
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return;
        e.stopPropagation();
        setScrubTime(getTimeFromEvent(e));
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return;
        e.stopPropagation();
        isDragging.current = false;
        if (videoRef.current) {
            videoRef.current.currentTime = scrubTime;
            setCurrentTime(scrubTime);
        }
        setIsScrubbing(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const progressPercent = isScrubbing
        ? (scrubTime / (duration || 1)) * 100
        : (currentTime / (duration || 1)) * 100;

    if (!article.video_summary) {
        return (
            <div className="article-format-view-container standard-article-content">
                <p className="article-format-empty">Video no disponible</p>
            </div>
        );
    }

    return (
        <div className="article-format-view-container standard-article-content">
            <div
                ref={containerRef}
                className={`video-immersive-card ${isFullscreen ? 'video-fullscreen' : ''}`}
            >
                <button
                    className="video-expand-button"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Salir" : "Pantalla completa"}
                >
                    {isFullscreen ? (
                        <Icons.minimize size={22} color="white" stroke={2} />
                    ) : (
                        <Icons.maximize size={22} color="white" stroke={2} />
                    )}
                </button>

                {isSpeedBoosted && (
                    <div className="video-speed-indicator">{SPEED_BOOST}x</div>
                )}

                {/* Time Display */}
                {isPlaying && (
                    <div className="video-time-display">
                        {formatTime(currentTime)}
                    </div>
                )}

                <video
                    ref={videoRef}
                    playsInline
                    loop
                    preload="auto"
                    poster={article.video_summary.thumbnail?.url || article.image?.url}
                    className={`video-element ${isFullscreen ? 'video-element-fullscreen' : ''}`}
                    src={article.video_summary.video_file.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onPointerDown={handleVideoPointerDown}
                    onPointerUp={handleVideoPointerUp}
                    onPointerLeave={endSpeedBoost}
                    onPointerCancel={endSpeedBoost}
                    onClick={handleVideoClick}
                />

                <div className="video-progress-container">
                    <div
                        className={`video-progress-track ${isScrubbing ? 'scrubbing' : ''}`}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        style={{ touchAction: 'none' }}
                    >
                        <div className="video-progress-fill" style={{ width: `${progressPercent}%` }}>
                            <div className="video-progress-thumb" />
                        </div>
                    </div>
                </div>

                {!isPlaying && (
                    <div className="video-play-overlay" onClick={handleVideoClick}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="white" style={{ opacity: 0.9 }}>
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};
