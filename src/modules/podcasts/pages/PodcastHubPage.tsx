import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePodcastEngine } from '../hooks/usePodcastEngine';
import { podcastApi } from '../../../services/podcastApi';
import { HeaderCenteredStack } from '../../../components/Header/HeaderCenteredStack';
import { Icons } from '../../../components/Icons';
import { Heading, Text, Caption } from '../../../components/Typography/Typography';
import { IconHeart, IconChevronLeft, IconChevronRight, IconPlaylist } from '@tabler/icons-react';
import './PodcastHubPage.css';

// Helper
const formatTime = (seconds: number) => {
    if (!seconds) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const PodcastHubPage = () => {
    const { date } = useParams<{ date: string }>();
    const navigate = useNavigate();

    // Fallback date
    const currentDate = date || new Date().toISOString().split('T')[0];

    // Engine
    const {
        currentPodcast,
        currentIndex,
        isPlaying,
        progress: engineProgress,
        currentTime,
        duration,
        playbackRate,
        play,
        pause,
        next,
        previous,
        seek,
        setRate,
        loadPlaylist
    } = usePodcastEngine();

    // Local Dragging State for smooth scrubbing
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragProgress, setDragProgress] = React.useState(0);
    const progressBarRef = React.useRef<HTMLDivElement>(null);

    const displayDuration = duration || 0;
    const currentProgress = isDragging ? dragProgress : engineProgress;

    // Effect: Load Data
    useEffect(() => {
        const fetchPodcasts = async () => {
            if (!currentDate) return;
            const data = await podcastApi.getDailyPodcasts(currentDate);
            if (data.length > 0) {
                loadPlaylist(data);
            } else {
                loadPlaylist([]);
            }
        };
        fetchPodcasts();
    }, [currentDate]);

    const handleDateChange = (newDate: string) => {
        navigate(`/PodcastsDelDia/${newDate}`);
    };

    // Scrubbing Logic
    const calculateProgress = (clientX: number) => {
        if (!progressBarRef.current) return 0;
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        return Math.min(Math.max((x / rect.width) * 100, 0), 100);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        const p = calculateProgress(e.clientX);
        setDragProgress(p);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        setDragProgress(calculateProgress(e.clientX));
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDragging) {
            const finalProgress = calculateProgress(e.clientX);
            seek(finalProgress);
            setIsDragging(false);
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    const toggleSpeed = () => {
        const rates = [1.0, 1.25, 1.5, 2.0];
        const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
        setRate(rates[nextIdx]);
    };

    if (!currentPodcast) {
        return (
            <div className="podcast-player podcast-player--loading">
                <div className="podcast-player__header-space">
                    <HeaderCenteredStack
                        variant="dark"
                        currentDate={currentDate}
                        onDateChange={handleDateChange}
                        onBack={() => navigate('/')}
                    />
                </div>
                <Text variant="body">Cargando podcasts...</Text>
            </div>
        );
    }

    return (
        <div className="podcast-player">
            {/* TOP SECTION: IMMERSIVE */}
            <div className="podcast-player__top-section">
                {/* Background Image */}
                <div
                    className="podcast-player__background-image"
                    style={{ backgroundImage: currentPodcast.coverUrl ? `url(${currentPodcast.coverUrl})` : undefined }}
                />

                {/* Gradient Scrim */}
                <div className="podcast-player__gradient-overlay" />

                {/* Header (Absolute) */}
                <div className="podcast-player__header-space">
                    <HeaderCenteredStack
                        variant="dark"
                        currentDate={currentDate}
                        onDateChange={handleDateChange}
                        onBack={() => navigate('/')}
                    />
                </div>

                {/* Playlist Button (Top Right) */}
                <button className="podcast-player__playlist-btn">
                    <IconPlaylist size={22} stroke={1.5} />
                </button>

                {/* Text Overlay */}
                <div className="podcast-player__text-overlay">
                    <Caption className="episode-tag">
                        EPISODIO {currentIndex + 1}
                    </Caption>
                    <Heading level={2} className="episode-title">
                        {currentPodcast.title}
                    </Heading>
                </div>
            </div>

            {/* BOTTOM SECTION: CONTROLS */}
            <div className="podcast-player__bottom-section">

                {/* Progress Row (Time - Bar - Time) */}
                <div className="podcast-player__progress-row">
                    <span className="podcast-player__time">{formatTime(currentTime)}</span>

                    <div
                        ref={progressBarRef}
                        className="podcast-player__progress-bar-container"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    >
                        <div className="podcast-player__track">
                            <div
                                className="podcast-player__fill"
                                style={{ width: `${currentProgress}%` }}
                            />
                        </div>
                    </div>

                    <span className="podcast-player__time podcast-player__time--end">{formatTime(displayDuration)}</span>
                </div>

                {/* Unified Controls Row: [Heart] [Prev] [Play] [Next] [Speed] */}
                <div className="podcast-player__controls-row">
                    {/* Heart (Favorite) */}
                    <button className="podcast-player__action-icon">
                        <IconHeart size={24} stroke={1.5} />
                    </button>

                    {/* Previous */}
                    <button
                        onClick={previous}
                        className="podcast-player__nav-btn"
                        disabled={currentIndex === 0}
                    >
                        <IconChevronLeft size={24} stroke={2} />
                    </button>

                    {/* Play/Pause (Center) */}
                    <button
                        onClick={isPlaying ? pause : play}
                        className="podcast-player__play-btn"
                    >
                        {isPlaying ? (
                            <Icons.pause size={48} fill="currentColor" />
                        ) : (
                            <Icons.play size={48} fill="currentColor" />
                        )}
                    </button>

                    {/* Next */}
                    <button
                        onClick={next}
                        className="podcast-player__nav-btn"
                    >
                        <IconChevronRight size={24} stroke={2} />
                    </button>

                    {/* Speed */}
                    <button
                        onClick={toggleSpeed}
                        className="podcast-player__speed-btn"
                    >
                        {playbackRate}x
                    </button>
                </div>
            </div>
        </div>
    );
};
