import { useRef, useState, type FC } from 'react';
import type { Article } from '../../types';
import './FormatViews.css';

interface PodcastProps {
    article: Article['attributes'];
}

export const Podcast: FC<PodcastProps> = ({ article }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [scrubTime, setScrubTime] = useState(0);
    const isDragging = useRef(false);

    if (!article.audio_summary) {
        return (
            <div className="article-format-view-container standard-article-content">
                <p className="article-format-empty">
                    Podcast no disponible
                </p>
            </div>
        );
    }

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleSpeed = () => {
        const speeds = [0.8, 1.0, 1.2, 1.8, 2.2];
        const currentIndex = speeds.indexOf(playbackRate);
        const nextIndex = currentIndex === -1 ? 1 : (currentIndex + 1) % speeds.length;
        const nextSpeed = speeds[nextIndex];

        setPlaybackRate(nextSpeed);
        if (audioRef.current) {
            audioRef.current.playbackRate = nextSpeed;
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current && !isDragging.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const formatTime = (time: number) => {
        if (!isFinite(time) || isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Scrubbing handlers (like video)
    const getTimeFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        return percent * (duration || 1);
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

        if (audioRef.current) {
            audioRef.current.currentTime = scrubTime;
            setCurrentTime(scrubTime);
        }

        setIsScrubbing(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // Progress percentage - use scrubTime when scrubbing
    const progressPercent = isScrubbing
        ? (scrubTime / (duration || 1)) * 100
        : (currentTime / (duration || 1)) * 100;

    return (
        <div className="article-format-view-container standard-article-content">
            <div className="podcast-hero">
                {/* Decorative blob */}
                <div className="podcast-blob" />

                {/* Content */}
                <div className="podcast-content">
                    <div className="podcast-episode-label">
                        {article.audio_summary?.episode_label || 'EPISODIO'}
                    </div>
                    <h2 className="podcast-title">
                        "{article.audio_summary?.podcast_title || article.title}"
                    </h2>
                </div>

                {/* Player Controls */}
                <div className="podcast-controls">
                    <div className="podcast-controls-row">
                        <div className="podcast-controls-left">
                            <button className="podcast-play-btn" onClick={togglePlay}>
                                {isPlaying ? '⏸' : '▶'}
                            </button>
                            <button className="podcast-speed-btn" onClick={toggleSpeed}>
                                {playbackRate}x
                            </button>
                        </div>
                        <div className="podcast-time">
                            {formatTime(duration - currentTime)}
                        </div>
                    </div>

                    {/* Progress Bar - Smooth scrubbing like video */}
                    <div
                        className={`podcast-progress-track ${isScrubbing ? 'scrubbing' : ''}`}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        style={{ touchAction: 'none' }}
                    >
                        <div
                            className="podcast-progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="podcast-progress-thumb" />
                        </div>
                    </div>
                </div>

                <audio
                    ref={audioRef}
                    src={article.audio_summary.audio_file.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            </div>

            {/* Spacer */}
            <div style={{ height: '100px' }} />
        </div>
    );
};
