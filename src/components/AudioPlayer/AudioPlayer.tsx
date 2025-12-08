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
        const speeds = [1.0, 1.5, 2.0];
        const nextSpeedIndex = (speeds.indexOf(speed) + 1) % speeds.length;
        const nextSpeed = speeds[nextSpeedIndex];
        setSpeed(nextSpeed);
        if (audioRef.current) {
            audioRef.current.playbackRate = nextSpeed;
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.min(Math.max(x / rect.width, 0), 1);
        const newTime = percentage * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatRemainingTime = (current: number, total: number) => {
        if (isNaN(total)) return "-00:00";
        const remaining = total - current;
        return `-${formatTime(remaining)}`;
    };

    const handleLike = () => {
        setLiked(!liked);
        if (onLike) onLike();
    };

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="audio-player">
            {title && (
                <div style={{
                    marginBottom: '12px',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    textAlign: 'center'
                }}>
                    {title}
                </div>
            )}
            <audio ref={audioRef} src={src} />

            <div className="audio-player__progress-container">
                <span>{formatTime(currentTime)}</span>
                <div className="audio-player__progress-bar-wrapper" onClick={handleSeek}>
                    <div className="audio-player__progress-bar">
                        <div
                            className="audio-player__progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                        >
                            <div className="audio-player__progress-knob" />
                        </div>
                    </div>
                </div>
                <span>{formatRemainingTime(currentTime, duration)}</span>
            </div>

            <div className="audio-player__controls">
                <button
                    className={`audio-player__button audio-player__like ${liked ? 'audio-player__like--active' : ''}`}
                    onClick={handleLike}
                >
                    <Icons.heart size={20} stroke={1.5} fill={liked ? "currentColor" : "none"} />
                </button>

                <button className="audio-player__button audio-player__play-button" onClick={togglePlay}>
                    {isPlaying ? (
                        <Icons.pause size={24} fill="currentColor" stroke={0} />
                    ) : (
                        <Icons.play size={24} fill="currentColor" stroke={0} />
                    )}
                </button>

                <button className="audio-player__button audio-player__speed" onClick={toggleSpeed}>
                    ×{speed}
                </button>
            </div>
        </div>
    );
};
