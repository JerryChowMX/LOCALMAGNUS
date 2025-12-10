import React, { useState, useRef, useEffect } from 'react';
import { trackArticleCompleted } from '../../lib/analytics';
import type { ArticleViewedProps } from '../../lib/analytics';
import { Icons } from '../Icons';
import './AudioPlayer.css';
import { Text } from '../Typography/Typography';

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
        // Cycle through speeds: 1.0 -> 1.5 -> 2.0 -> 3.0 -> 0.75 -> 1.0
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
        <div style={{ width: '100%', fontFamily: '"Inter", sans-serif' }}>
            <audio ref={audioRef} src={src} />

            {title && (
                <div style={{
                    marginBottom: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    textAlign: 'center'
                }}>
                    {title}
                </div>
            )}

            <div style={{
                borderTop: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)',
                width: '100%',
                display: 'flex',
                height: '48px',
                backgroundColor: 'var(--bg-surface)'
            }}>
                {/* Left: Play + Duration */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '24px', borderRight: '1px solid var(--border-color)' }}>
                    <button
                        onClick={togglePlay}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.25rem',
                            color: 'var(--text-primary)',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0
                        }}
                    >
                        {isPlaying ? <Icons.pause size={20} fill="currentColor" stroke={0} /> : <Icons.play size={20} fill="currentColor" stroke={0} />}
                    </button>
                    <Text variant="caption" style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: '"Blinker", sans-serif', fontSize: '0.9rem', whiteSpace: 'nowrap', minWidth: '50px', textAlign: 'center' }}>
                        {duration > 0 ? `-${formatTime(duration - currentTime)}` : '00:00'}
                    </Text>
                </div>

                {/* Middle: Interactive Progress Bar */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 24px', position: 'relative' }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {/* Visual Track */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '1px',
                            backgroundColor: 'var(--border-color)',
                            pointerEvents: 'none'
                        }} />

                        {/* Visual Progress */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            width: `${progressPercentage}%`,
                            height: '1px',
                            backgroundColor: 'var(--text-primary)',
                            pointerEvents: 'none'
                        }} />

                        {/* Input Range for Interaction */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progressPercentage || 0}
                            onChange={handleSeek}
                            style={{
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer',
                                margin: 0,
                                padding: 0,
                                zIndex: 10,
                                position: 'absolute',
                                left: 0,
                                top: 0
                            }}
                            className="audio-range-input"
                        />

                        {/* Scrubber Handle */}
                        <div style={{
                            position: 'absolute',
                            left: `${progressPercentage}%`,
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--text-primary)',
                            transform: 'translateX(-5px)',
                            pointerEvents: 'none',
                            opacity: 0, // Hidden until hover logic applied via CSS
                            transition: 'opacity 0.2s',
                            zIndex: 5
                        }} className="scrubber-handle" />
                    </div>
                </div>

                {/* Right: Speed + Like */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '24px', borderLeft: '1px solid var(--border-color)' }}>
                    <button
                        onClick={toggleSpeed}
                        style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontWeight: 500,
                            border: 'none',
                            background: 'transparent',
                            minWidth: '40px',
                            textAlign: 'center',
                            padding: 0
                        }}
                    >
                        {speed}x
                    </button>

                    <button
                        onClick={handleLike}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            color: liked ? '#F97316' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s',
                            padding: 0
                        }}
                    >
                        <Icons.heart size={18} fill={liked ? "currentColor" : "none"} stroke={1.5} />
                    </button>
                </div>
            </div>

            <style>{`
                .audio-range-input:hover + .scrubber-handle,
                .audio-range-input:active + .scrubber-handle {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};
