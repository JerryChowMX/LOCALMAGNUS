import React, { useState, useRef, useEffect } from 'react';
import { trackArticleCompleted } from '../../lib/analytics';
import type { ArticleViewedProps } from '../../lib/analytics';
import { Icons } from '../Icons';
import './AudioPlayer.css';

export interface AudioPlayerProps {
    src: string;
    title?: string;
    onLike?: () => void;
    isLiked?: boolean;
    analytics?: {
        articleId: string;
        section: ArticleViewedProps['section'];
    };
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, onLike, isLiked = false, analytics }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeed] = useState(1.0);
    const [liked, setLiked] = useState(isLiked);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const onEnded = () => {
            setIsPlaying(false);
            if (analytics) {
                trackArticleCompleted(analytics.articleId, analytics.section, 'audio');
            }
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', onEnded);
        };
    }, [analytics]);

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
        let nextSpeed = 1.0;
        if (speed === 1.0) nextSpeed = 1.5;
        else if (speed === 1.5) nextSpeed = 2.0;
        else if (speed === 2.0) nextSpeed = 3.0;
        else if (speed === 3.0) nextSpeed = 0.75;
        else if (speed === 0.75) nextSpeed = 1.0;

        setSpeed(nextSpeed);
        if (audioRef.current) {
            audioRef.current.playbackRate = nextSpeed;
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;
        const newTime = (Number(e.target.value) / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleLike = () => {
        setLiked(!liked);
        if (onLike) onLike();
    };

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="audio-player">
            <audio ref={audioRef} src={src} />

            {title && (
                <div className="audio-player__title">
                    {title}
                </div>
            )}

            <div className="audio-player__controls-bar">
                {/* Left: Play + Duration */}
                <div className="audio-player__play-section">
                    <button
                        onClick={togglePlay}
                        className="audio-player__play-btn"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? (
                            <Icons.pause size={20} fill="currentColor" stroke={0} />
                        ) : (
                            <Icons.play size={20} fill="currentColor" stroke={0} />
                        )}
                    </button>
                    <span className="audio-player__duration">
                        {duration > 0 ? `-${formatTime(duration - currentTime)}` : '00:00'}
                    </span>
                </div>

                {/* Middle: Interactive Progress Bar */}
                <div className="audio-player__progress-section">
                    <div className="audio-player__progress-wrapper">
                        {/* Visual Track */}
                        <div className="audio-player__track" />

                        {/* Visual Progress */}
                        <div
                            className="audio-player__progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                        />

                        {/* Input Range for Interaction */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progressPercentage || 0}
                            onChange={handleSeek}
                            className="audio-player__range-input"
                            aria-label="Seek"
                        />

                        {/* Scrubber Handle */}
                        <div
                            className="audio-player__scrubber"
                            style={{ left: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Right: Speed + Like */}
                <div className="audio-player__actions-section">
                    <button
                        onClick={toggleSpeed}
                        className="audio-player__speed-btn"
                        aria-label="Change playback speed"
                    >
                        {speed}x
                    </button>

                    <button
                        onClick={handleLike}
                        className={`audio-player__like-btn ${liked ? 'audio-player__like-btn--active' : ''}`}
                        aria-label={liked ? 'Unlike' : 'Like'}
                    >
                        <Icons.heart size={18} fill={liked ? "currentColor" : "none"} stroke={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};
