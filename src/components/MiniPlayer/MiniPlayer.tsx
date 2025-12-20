import { useLocation, useNavigate } from 'react-router-dom';
import { usePodcastContext } from '../../contexts/PodcastContext';
import { useAuth } from '../../hooks/useAuth';
import { MarqueeText } from '../Typography/MarqueeText';
import {
    IconPlayerPlay,
    IconPlayerPause,
    IconX,
    IconMinus,
    IconHeadphones,
    IconChevronLeft,
    IconChevronRight
} from '@tabler/icons-react';
import './MiniPlayer.css';

// Routes where mini player should be hidden
const HIDDEN_ROUTES = [
    '/PodcastsDelDia',      // Full player shown
    '/VideosDelDia',        // Video conflict
    '/login',
    '/signup',
    '/registro',
];

// Routes where audio should auto-pause
const VIDEO_ROUTES = [
    '/VideosDelDia',
];

export const MiniPlayer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const {
        currentPodcast,
        playlist,
        currentIndex,
        isPlaying,
        progress,
        playbackRate,
        hasActiveSession,
        isMinimized,
        setMinimized,
        play,
        pause,
        next,
        previous,
        setRate,
        pauseForVideo,
        clearSession,
    } = usePodcastContext();

    // Check if we should show the mini player
    const isOnHiddenRoute = HIDDEN_ROUTES.some(route =>
        location.pathname.startsWith(route)
    );
    const isOnVideoRoute = VIDEO_ROUTES.some(route =>
        location.pathname.startsWith(route)
    );

    // Auto-pause when entering video route
    if (isOnVideoRoute && isPlaying) {
        pauseForVideo();
    }

    // Determine visibility
    const shouldShow =
        isAuthenticated &&
        hasActiveSession &&
        currentPodcast &&
        !isOnHiddenRoute;

    if (!shouldShow) return null;

    // Can navigate prev/next?
    const canPrevious = currentIndex > 0;
    const canNext = currentIndex < playlist.length - 1;

    // Speed toggle - cycle through speeds
    const handleSpeedToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        const speeds = [1, 1.25, 1.5, 2];
        // Find closest match or default to 0
        let currentIdx = speeds.findIndex(s => Math.abs(s - playbackRate) < 0.01);
        if (currentIdx === -1) currentIdx = 0;
        const nextIdx = (currentIdx + 1) % speeds.length;
        setRate(speeds[nextIdx]);
    };

    // Handle navigation to full player
    const handleNavigateToPlayer = () => {
        navigate('/PodcastsDelDia');
    };

    // Handle close (stop and hide mini player)
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        clearSession();
    };

    // Handle minimize toggle
    const handleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMinimized(true);
    };

    // Handle expand from minimized
    const handleExpand = () => {
        setMinimized(false);
    };

    // Handle play/pause
    const handlePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    // Handle previous
    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (canPrevious) previous();
    };

    // Handle next
    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (canNext) next();
    };

    // Minimized state - show small icon
    if (isMinimized) {
        return (
            <button
                className={`mini-player__minimized ${isPlaying ? 'mini-player__minimized--playing' : ''}`}
                onClick={handleExpand}
                aria-label="Expandir reproductor"
            >
                <IconHeadphones size={20} stroke={1.5} />
            </button>
        );
    }

    // Full mini player
    return (
        <div className="mini-player" onClick={handleNavigateToPlayer}>
            {/* Progress bar at top */}
            <div className="mini-player__progress">
                <div
                    className="mini-player__progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Title row - marquee only if overflows */}
            <div className="mini-player__title-row">
                <div className="mini-player__title-wrapper">
                    <MarqueeText
                        text={currentPodcast?.title || 'Sin título'}
                        className="mini-player__title"
                    />
                </div>
            </div>

            {/* Controls row - mobile first with good spacing */}
            <div className="mini-player__controls">
                {/* Previous */}
                <button
                    className="mini-player__btn"
                    onClick={handlePrevious}
                    disabled={!canPrevious}
                    aria-label="Anterior"
                >
                    <IconChevronLeft size={22} stroke={2} />
                </button>

                {/* Play/Pause */}
                <button
                    className="mini-player__btn mini-player__btn--play"
                    onClick={handlePlayPause}
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                    {isPlaying ? (
                        <IconPlayerPause size={24} stroke={2} />
                    ) : (
                        <IconPlayerPlay size={24} stroke={2} />
                    )}
                </button>

                {/* Next */}
                <button
                    className="mini-player__btn"
                    onClick={handleNext}
                    disabled={!canNext}
                    aria-label="Siguiente"
                >
                    <IconChevronRight size={22} stroke={2} />
                </button>

                {/* Speed */}
                <button
                    className="mini-player__btn mini-player__btn--speed"
                    onClick={handleSpeedToggle}
                    aria-label="Velocidad"
                >
                    {playbackRate}x
                </button>

                {/* Minimize */}
                <button
                    className="mini-player__btn"
                    onClick={handleMinimize}
                    aria-label="Minimizar"
                >
                    <IconMinus size={20} stroke={2} />
                </button>

                {/* Close */}
                <button
                    className="mini-player__btn"
                    onClick={handleClose}
                    aria-label="Cerrar"
                >
                    <IconX size={20} stroke={2} />
                </button>
            </div>
        </div>
    );
};
