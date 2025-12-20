import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePodcastContext } from '../../../contexts/PodcastContext';
import type { RepeatMode } from '../../../contexts/PodcastContext';
import { podcastApi } from '../../../services/podcastApi';
import { HeaderCenteredStack } from '../../../components/Header/HeaderCenteredStack';
import { Icons } from '../../../components/Icons';
import { Heading, Text, Caption } from '../../../components/Typography/Typography';
import { MarqueeText } from '../../../components/Typography/MarqueeText';
import {
    IconHeart,
    IconChevronLeft,
    IconChevronRight,
    IconPlaylist,
    IconChevronDown,
    IconDotsVertical,
    IconGripVertical,
    IconMoon,
    IconArrowsShuffle,
    IconShare,
    IconRepeat,
    IconRepeatOnce
} from '@tabler/icons-react';
import './PodcastHubPage.css';

// Helper
const formatTime = (seconds: number) => {
    if (!seconds) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Sleep timer options
const SLEEP_TIMER_OPTIONS = [
    { label: '15 minutos', value: 15 },
    { label: '30 minutos', value: 30 },
    { label: '45 minutos', value: 45 },
    { label: '1 hora', value: 60 },
    { label: 'Fin del episodio', value: -1 },
    { label: 'Desactivar', value: 0 },
];

export const PodcastHubPage = () => {
    const { date } = useParams<{ date: string }>();
    const navigate = useNavigate();

    // Fallback date
    const currentDate = date || new Date().toISOString().split('T')[0];

    // Loading state
    const [isLoading, setIsLoading] = React.useState(true);

    // Queue view state
    const [showQueue, setShowQueue] = React.useState(false);

    // Menu state
    const [showMenu, setShowMenu] = React.useState(false);
    const [showSleepTimerSubmenu, setShowSleepTimerSubmenu] = React.useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Feature states
    const [sleepTimerMinutes, setSleepTimerMinutes] = React.useState<number>(0);
    const [sleepTimerEndOfEpisode, setSleepTimerEndOfEpisode] = React.useState(false);
    const [isShuffled, setIsShuffled] = React.useState(false);
    const [originalPlaylist, setOriginalPlaylist] = React.useState<typeof playlist>([]);

    // Sleep timer countdown
    const [sleepTimerRemaining, setSleepTimerRemaining] = React.useState<number>(0);

    // Global Podcast Context (instead of local engine)
    const {
        playlist,
        currentPodcast,
        currentIndex,
        isPlaying,
        progress: engineProgress,
        currentTime,
        duration,
        playbackRate,
        repeatMode,
        play,
        pause,
        next,
        previous,
        seek,
        setRate,
        setRepeatMode,
        loadPlaylist,
        jumpTo,
        shuffleQueue,
        reorderPlaylist
    } = usePodcastContext();

    // Local Dragging State for smooth scrubbing
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragProgress, setDragProgress] = React.useState(0);
    const progressBarRef = React.useRef<HTMLDivElement>(null);

    // Drag and drop sorting state
    const [draggedItemIndex, setDraggedItemIndex] = React.useState<number | null>(null);

    // Handlers
    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // Optional: Custom drag image or ghost styling
        // e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
        setDraggedItemIndex(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetIndex: number) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

        // Calculate adjustments because upcomingTracks is a subset (playlist slice)
        // upcomingTracks[0] corresponds to playlist[currentIndex + 1]
        // So global fromIndex = currentIndex + 1 + draggedItemIndex
        // global toIndex = currentIndex + 1 + targetIndex

        const globalFromIndex = currentIndex + 1 + draggedItemIndex;
        const globalToIndex = currentIndex + 1 + targetIndex;

        reorderPlaylist(globalFromIndex, globalToIndex);
        setDraggedItemIndex(null);
    };

    const displayDuration = duration || 0;
    const currentProgress = isDragging ? dragProgress : engineProgress;

    // Effect: Load Data
    useEffect(() => {
        const fetchPodcasts = async () => {
            if (!currentDate) return;
            setIsLoading(true);
            const data = await podcastApi.getDailyPodcasts(currentDate);
            if (data.length > 0) {
                loadPlaylist(data);
            } else {
                loadPlaylist([]);
            }
            setIsLoading(false);
        };
        fetchPodcasts();
    }, [currentDate]);

    // Effect: Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
                setShowSleepTimerSubmenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    // Effect: Sleep timer countdown
    const timerActive = sleepTimerRemaining > 0;

    useEffect(() => {
        // Only start countdown if timer is active and playing
        if (timerActive && isPlaying) {
            const interval = setInterval(() => {
                setSleepTimerRemaining(prev => {
                    if (prev <= 1) {
                        pause();
                        setSleepTimerMinutes(0); // Reset the timer state
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timerActive, isPlaying, pause]);

    // Effect: Sleep timer - end of episode
    useEffect(() => {
        if (sleepTimerEndOfEpisode && currentTime > 0 && duration > 0) {
            // Check if episode is about to end (within 3 seconds for reliability)
            if (duration - currentTime <= 3) {
                pause();
                setSleepTimerEndOfEpisode(false);
                setSleepTimerMinutes(0); // Reset timer state
            }
        }
    }, [currentTime, duration, sleepTimerEndOfEpisode, pause]);

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

    // Jump to a specific track in the queue
    const handleSelectTrack = (index: number) => {
        if (index === currentIndex) return;
        jumpTo(index);
        setShowQueue(false);
    };

    // Menu handlers
    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
        setShowSleepTimerSubmenu(false);
    };

    const handleSleepTimer = (minutes: number) => {
        if (minutes === 0) {
            // Disable timer
            setSleepTimerMinutes(0);
            setSleepTimerRemaining(0);
            setSleepTimerEndOfEpisode(false);
        } else if (minutes === -1) {
            // End of episode
            setSleepTimerEndOfEpisode(true);
            setSleepTimerMinutes(-1);
            setSleepTimerRemaining(0);
        } else {
            setSleepTimerMinutes(minutes);
            setSleepTimerRemaining(minutes * 60);
            setSleepTimerEndOfEpisode(false);
        }
        setShowSleepTimerSubmenu(false);
    };

    const handleShuffle = () => {
        if (!isShuffled && playlist.length > 1) {
            // Store original order before shuffling
            setOriginalPlaylist([...playlist]);
            // Shuffle upcoming tracks
            shuffleQueue();
            setIsShuffled(true);
        } else if (isShuffled && originalPlaylist.length > 0) {
            // Restore original order
            // Find current track in original playlist
            const currentTrack = playlist[currentIndex];
            const originalIndex = originalPlaylist.findIndex(p => p.id === currentTrack?.id);
            loadPlaylist(originalPlaylist);
            if (originalIndex >= 0) {
                jumpTo(originalIndex);
            }
            setOriginalPlaylist([]);
            setIsShuffled(false);
        }
    };

    const handleShare = async () => {
        if (currentPodcast && navigator.share) {
            try {
                await navigator.share({
                    title: currentPodcast.title,
                    text: `Escucha "${currentPodcast.title}" en Magnus Audio`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled or failed:', err);
            }
        } else if (currentPodcast) {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                // Could show a toast here
                console.log('Link copied to clipboard');
            } catch (err) {
                console.log('Copy failed:', err);
            }
        }
    };

    const handleRepeatToggle = () => {
        const modes: RepeatMode[] = ['off', 'all', 'one'];
        const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
        setRepeatMode(modes[nextIdx]);
    };

    const getRepeatLabel = () => {
        switch (repeatMode) {
            case 'off': return 'Repetir: Desactivado';
            case 'all': return 'Repetir: Playlist';
            case 'one': return 'Repetir: Episodio';
        }
    };

    const getSleepTimerLabel = () => {
        if (sleepTimerEndOfEpisode) return 'Fin del episodio';
        if (sleepTimerRemaining > 0) {
            const mins = Math.floor(sleepTimerRemaining / 60);
            const secs = sleepTimerRemaining % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        return null;
    };

    // Get upcoming tracks (after current)
    const upcomingTracks = playlist.slice(currentIndex + 1);

    // Show loading or empty state
    if (isLoading || playlist.length === 0) {
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
                <Text variant="body">
                    {isLoading ? 'Cargando podcasts...' : 'Hoy no hay podcasts disponibles'}
                </Text>
            </div>
        );
    }

    // Reusable controls component
    const PlayerControls = () => (
        <>
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
                    disabled={currentIndex >= playlist.length - 1}
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
        </>
    );

    // Queue Menu Component
    const QueueMenu = () => (
        <div className="podcast-queue__menu" ref={menuRef}>
            {showSleepTimerSubmenu ? (
                <>
                    <button
                        className="podcast-queue__menu-item podcast-queue__menu-back"
                        onClick={() => setShowSleepTimerSubmenu(false)}
                    >
                        <IconChevronLeft size={20} stroke={2} />
                        <span>Temporizador de sueño</span>
                    </button>
                    <div className="podcast-queue__menu-divider" />
                    {SLEEP_TIMER_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            className={`podcast-queue__menu-item ${sleepTimerMinutes === option.value ? 'podcast-queue__menu-item--active' : ''}`}
                            onClick={() => handleSleepTimer(option.value)}
                        >
                            <span>{option.label}</span>
                        </button>
                    ))}
                </>
            ) : (
                <>
                    {/* Sleep Timer */}
                    <button
                        className="podcast-queue__menu-item"
                        onClick={() => setShowSleepTimerSubmenu(true)}
                    >
                        <IconMoon size={20} stroke={1.5} />
                        <span>Temporizador de sueño</span>
                        {getSleepTimerLabel() && (
                            <span className="podcast-queue__menu-badge">{getSleepTimerLabel()}</span>
                        )}
                        <IconChevronRight size={18} stroke={2} className="podcast-queue__menu-chevron" />
                    </button>

                    {/* Shuffle */}
                    <button
                        className={`podcast-queue__menu-item ${isShuffled ? 'podcast-queue__menu-item--active' : ''}`}
                        onClick={handleShuffle}
                    >
                        <IconArrowsShuffle size={20} stroke={1.5} />
                        <span>Modo aleatorio</span>
                        {isShuffled && <span className="podcast-queue__menu-badge">Activo</span>}
                    </button>

                    {/* Share */}
                    <button
                        className="podcast-queue__menu-item"
                        onClick={handleShare}
                    >
                        <IconShare size={20} stroke={1.5} />
                        <span>Compartir</span>
                    </button>

                    {/* Repeat */}
                    <button
                        className={`podcast-queue__menu-item ${repeatMode !== 'off' ? 'podcast-queue__menu-item--active' : ''}`}
                        onClick={handleRepeatToggle}
                    >
                        {repeatMode === 'one' ? (
                            <IconRepeatOnce size={20} stroke={1.5} />
                        ) : (
                            <IconRepeat size={20} stroke={1.5} />
                        )}
                        <span>{getRepeatLabel()}</span>
                    </button>
                </>
            )}
        </div>
    );

    // QUEUE VIEW
    if (showQueue) {
        return (
            <div className="podcast-queue">
                {/* Header */}
                <div className="podcast-queue__header">
                    <button
                        className="podcast-queue__header-btn"
                        onClick={() => setShowQueue(false)}
                    >
                        <IconChevronDown size={24} stroke={2} />
                    </button>
                    <span className="podcast-queue__header-title">A Continuación</span>
                    <div className="podcast-queue__header-menu-container">
                        <button
                            className="podcast-queue__header-btn"
                            onClick={handleMenuToggle}
                        >
                            <IconDotsVertical size={24} stroke={1.5} />
                        </button>
                        {showMenu && <QueueMenu />}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="podcast-queue__content">
                    {/* Now Playing Section */}
                    <div className="podcast-queue__now-playing">
                        <div className="podcast-queue__section-label">Reproduciendo Ahora</div>
                        <div className="podcast-queue__active-track">
                            {currentPodcast!.coverUrl ? (
                                <img
                                    src={currentPodcast!.coverUrl}
                                    alt={currentPodcast!.title}
                                    className="podcast-queue__track-thumb"
                                />
                            ) : (
                                <div className="podcast-queue__track-thumb" />
                            )}
                            <div className="podcast-queue__track-info">
                                <p className="podcast-queue__track-title">{currentPodcast!.title}</p>
                                <p className="podcast-queue__track-subtitle">{currentPodcast!.author || 'Magnus Audio'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Queue List */}
                    <div className="podcast-queue__list-section">
                        <div className="podcast-queue__list-header">
                            <span className="podcast-queue__section-label">Próximos de Magnus Audio</span>
                            <button
                                className="podcast-queue__clear-btn"
                                disabled={upcomingTracks.length === 0}
                            >
                                Borrar
                            </button>
                        </div>

                        {upcomingTracks.length === 0 ? (
                            <div className="podcast-queue__empty">
                                <p className="podcast-queue__empty-text">No hay más episodios en la cola</p>
                            </div>
                        ) : (
                            <ul className="podcast-queue__list">
                                {upcomingTracks.map((track, idx) => (
                                    <li
                                        key={track.id || idx}
                                        className={`podcast-queue__item ${draggedItemIndex === idx ? 'podcast-queue__item--dragging' : ''}`}
                                        onClick={() => handleSelectTrack(currentIndex + 1 + idx)}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, idx)}
                                        onDragOver={(e) => handleDragOver(e, idx)}
                                        onDrop={(e) => handleDrop(e, idx)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <span className="podcast-queue__item-number">{currentIndex + 2 + idx}</span>
                                        <div className="podcast-queue__item-info">
                                            <MarqueeText
                                                text={track.title}
                                                className="podcast-queue__item-title-wrapper"
                                            />
                                            <p className="podcast-queue__item-subtitle">{track.author || 'Magnus Audio'}</p>
                                        </div>
                                        <div className="podcast-queue__item-drag">
                                            <IconGripVertical size={18} stroke={1.5} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Bottom Controls - Same as main player */}
                <div className="podcast-queue__controls">
                    <PlayerControls />
                </div>
            </div>
        );
    }

    // MAIN PLAYER VIEW
    return (
        <div className="podcast-player">
            {/* TOP SECTION: IMMERSIVE */}
            <div className="podcast-player__top-section">
                {/* Background Image */}
                <div
                    className="podcast-player__background-image"
                    style={{ backgroundImage: currentPodcast!.coverUrl ? `url(${currentPodcast!.coverUrl})` : undefined }}
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
                <button
                    className="podcast-player__playlist-btn"
                    onClick={() => setShowQueue(true)}
                >
                    <IconPlaylist size={22} stroke={1.5} />
                </button>

                {/* Text Overlay */}
                <div className="podcast-player__text-overlay">
                    <Caption className="episode-tag">
                        EPISODIO {currentIndex + 1}
                    </Caption>
                    <Heading level={2} className="episode-title">
                        {currentPodcast!.title}
                    </Heading>
                </div>
            </div>

            {/* BOTTOM SECTION: CONTROLS */}
            <div className="podcast-player__bottom-section">
                <PlayerControls />
            </div>
        </div>
    );
};
