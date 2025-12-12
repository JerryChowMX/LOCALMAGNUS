import { useRef, useState, FC } from 'react';
import './FormatViews.css';

interface VideoProps {
    article: any;
}

export const Video: FC<VideoProps> = ({ article }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const isDragging = useRef(false);

    if (!article.video_summary) {
        return (
            <div className="article-format-view-container standard-article-content">
                <p className="article-format-empty">
                    Video no disponible
                </p>
            </div>
        );
    }

    const handlePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current && !isDragging.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration || 0);
        }
    };

    const calculateTimeFromEvent = (clientX: number, container: HTMLDivElement): number => {
        if (!duration) return 0;
        const rect = container.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const width = rect.width;
        let percentage = offsetX / width;
        percentage = Math.max(0, Math.min(1, percentage));
        return percentage * duration;
    };

    const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return;
        const newTime = calculateTimeFromEvent(e.clientX, e.currentTarget);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        isDragging.current = true;
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return;
        const newTime = calculateTimeFromEvent(e.clientX, e.currentTarget);
        setCurrentTime(newTime);
        // Optional: Update video time while dragging for "live" scrubbing
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current || !videoRef.current) return;
        isDragging.current = false;

        const newTime = calculateTimeFromEvent(e.clientX, e.currentTarget);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="article-format-view-container standard-article-content">
            <div className="video-immersive-card" ref={containerRef}>
                {/* Video Element (Background) */}
                <video
                    ref={videoRef}
                    onClick={handlePlay}
                    playsInline
                    loop
                    className="video-immersive-element"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0
                    }}
                    src={article.video_summary.video_file.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                >
                    <source src={article.video_summary.video_file.url} type="video/mp4" />
                </video>

                {/* Fullscreen Button */}
                <button className="video-fullscreen-btn" onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                </button>

                <div
                    className="video-immersive-overlay"
                    style={{
                        opacity: isPlaying ? 0 : 1,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none'
                    }}
                >
                    <div style={{ marginBottom: '16px' }}>
                        <span className="video-immersive-tag">
                            Resumen de video
                        </span>
                    </div>
                    <h2 style={{
                        color: 'white',
                        marginBottom: '8px',
                        fontSize: '24px',
                        fontFamily: 'inherit',
                        fontWeight: 700,
                        lineHeight: 1.2
                    }}>
                        {article.title}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.4' }}>
                        {article.dek || article.video_summary.transcript?.slice(0, 100) + '...'}
                    </p>
                </div>

                {/* Center Play Button */}
                {!isPlaying && (
                    <div
                        className="video-immersive-play"
                        onClick={handlePlay}
                        style={{ position: 'absolute' }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                )}

                {/* Progress Bar (Always visible at bottom) */}
                <div className="video-controls-bar" onClick={(e) => e.stopPropagation()}>
                    <div
                        className="video-progress-container"
                        onClick={handleSeekClick}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        style={{ touchAction: 'none' }}
                    >
                        <div className="video-progress-bar" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}></div>
                        <div className="video-progress-thumb" style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Transcript below if needed? "Pure Immersive" usually implies just the video. User didn't ask for transcript. */}
            {/* I will allow the card to be the hero. */}
        </div>
    );
};
