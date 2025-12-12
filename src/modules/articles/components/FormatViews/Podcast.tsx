import { useRef, useState, useEffect, FC } from 'react';
import './FormatViews.css';

interface PodcastProps {
    article: any;
}

export const Podcast: FC<PodcastProps> = ({ article }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
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
        const speeds = [0.8, 1, 1.5, 1.8, 2]; // Expanded speeds
        const nextSpeedIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
        const nextSpeed = speeds[nextSpeedIndex];

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
        if (!audioRef.current) return;
        const newTime = calculateTimeFromEvent(e.clientX, e.currentTarget);
        audioRef.current.currentTime = newTime;
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
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current || !audioRef.current) return;
        isDragging.current = false;

        const newTime = calculateTimeFromEvent(e.clientX, e.currentTarget);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    // Responsive Time Display Logic
    const getTimeDisplay = () => {
        const totalDuration = duration || 180; // Fallback for loading
        if (isPlaying) {
            const timeLeft = totalDuration - currentTime;
            return `${formatTime(currentTime)} / -${formatTime(timeLeft)}`;
        } else {
            return `${formatTime(currentTime)} / ${formatTime(totalDuration)}`;
        }
    };

    return (
        <div className="article-format-view-container standard-article-content">
            <div className="podcast-editorial-container">
                <div className="podcast-magnus-hero">
                    <div className="magnus-blob"></div>

                    <div className="type-content">
                        <div className="editorial-status">
                            {isPlaying ? 'REPRODUCIENDO AHORA' : 'PODCAST EXCLUSIVO'}
                        </div>
                        <div className="editorial-title">
                            "{article.title}"
                        </div>
                        <div className="editorial-meta">
                            EPISODIO {article.id || '46'}
                        </div>
                    </div>

                    <div className="editorial-player-area">
                        <div className="editorial-controls-row">
                            <div className="editorial-controls-left">
                                <div className="editorial-play-btn" onClick={togglePlay}>
                                    {isPlaying ? '⏸' : '▶'}
                                </div>
                                <button className="editorial-speed-btn" onClick={toggleSpeed}>
                                    {playbackRate}x
                                </button>
                            </div>

                            <div className="editorial-time-text">
                                {getTimeDisplay()}
                            </div>
                        </div>

                        <div
                            className="editorial-progress-container"
                            onClick={handleSeekClick}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp} // Safety release
                            style={{ touchAction: 'none' }} // Prevent scrolling while dragging
                        >
                            <div className="editorial-progress-bar-bg"></div>
                            <div
                                className="editorial-progress-bar"
                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                            ></div>
                            {/* The thumb (ball) */}
                            <div
                                className="editorial-progress-thumb"
                                style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <audio
                        ref={audioRef}
                        src={article.audio_summary.audio_file.url}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setIsPlaying(false)}
                    />
                </div>
            </div>

            {/* Spacer */}
            <div className="article-format-spacer"></div>
        </div>
    );
};
