import { useLocation, useNavigate } from 'react-router-dom';
import { usePodcastContext } from '../../contexts/PodcastContext';
import { useAuth } from '../../hooks/useAuth';
import { IconPlayerPlay, IconPlayerPause, IconX, IconMinus, IconHeadphones } from '@tabler/icons-react';
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
        isPlaying,
        progress,
        hasActiveSession,
        isMinimized,
        setMinimized,
        play,
        pause,
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

            {/* Content */}
            <div className="mini-player__content">
                {/* Episode info */}
                <div className="mini-player__info">
                    <span className="mini-player__title">
                        {currentPodcast?.title || 'Sin título'}
                    </span>
                </div>

                {/* Controls */}
                <div className="mini-player__controls">
                    {/* Play/Pause */}
                    <button
                        className="mini-player__btn mini-player__btn--play"
                        onClick={handlePlayPause}
                        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                    >
                        {isPlaying ? (
                            <IconPlayerPause size={20} stroke={2} />
                        ) : (
                            <IconPlayerPlay size={20} stroke={2} />
                        )}
                    </button>

                    {/* Minimize */}
                    <button
                        className="mini-player__btn"
                        onClick={handleMinimize}
                        aria-label="Minimizar"
                    >
                        <IconMinus size={18} stroke={2} />
                    </button>

                    {/* Close */}
                    <button
                        className="mini-player__btn"
                        onClick={handleClose}
                        aria-label="Cerrar"
                    >
                        <IconX size={18} stroke={2} />
                    </button>
                </div>
            </div>
        </div>
    );
};
