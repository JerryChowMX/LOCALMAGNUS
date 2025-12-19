import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Removed PageWrapper to allow full-screen immersive design without padding/width constraints
import { usePodcastEngine } from '../hooks/usePodcastEngine';
import { podcastApi } from '../../../services/podcastApi';
import { HeaderCenteredStack } from '../../../components/Header/HeaderCenteredStack';
import { Icons } from '../../../components/Icons';
import { Heading, Text, Caption } from '../../../components/Typography/Typography';
import { IconHeart, IconChevronLeft, IconChevronRight, IconPlaylist } from '@tabler/icons-react';

// Helper
const formatTime = (seconds: number) => {
    if (!seconds) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Styles
const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column' as const,
        backgroundColor: 'var(--bg-primary)', // Adapts to Dark Mode
        overflow: 'hidden'
    },
    topSection: {
        flex: '1',
        position: 'relative' as const,
        backgroundColor: 'var(--surface-base)', // Dark mode compatible
        overflow: 'hidden'
    },
    // The image itself
    backgroundImage: (url?: string) => ({
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: url ? `url(${url})` : undefined,
        backgroundColor: 'var(--bg-tertiary)', // Fallback uses token
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }),
    // Gradient overlay for text readability
    gradientOverlay: {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
    },
    headerSpace: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50
    },
    textOverlay: {
        position: 'absolute' as const,
        bottom: '24px',
        left: '24px',
        right: '24px',
        zIndex: 20,
        color: '#F2EEE8', // Warm Milk - always visible on dark gradient
        textAlign: 'center' as const
    },
    // Top right action button (Playlist)
    topRightAction: {
        position: 'absolute' as const,
        top: '115px', // Below header
        right: '16px',
        zIndex: 40,
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--overlay-bg)',
        borderRadius: '0', // Sharp corners
        border: 'none',
        cursor: 'pointer',
        color: '#F2EEE8' // Warm Milk - visible on dark overlay
    },
    // Updated Bottom Section layout
    bottomSection: {
        height: 'auto',
        padding: '32px 24px',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'flex-start',
        gap: '32px',
        borderTop: '1px solid var(--border-subtle)'
    },
    // Progress Row (Time - Bar - Time)
    progressRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        color: 'var(--text-secondary)',
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500
    },
    progressBarContainer: {
        flex: 1,
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative' as const,
        touchAction: 'none' as const
    },
    track: {
        width: '100%',
        height: '4px',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '2px',
        overflow: 'hidden'
    },
    fill: (percent: number) => ({
        width: `${percent}%`,
        height: '100%',
        backgroundColor: 'var(--magnus-blue)',
        borderRadius: '2px',
        transition: 'none'
    }),

    // Unified Controls Row: [Heart] [Prev] [Play] [Next] [Speed]
    controlsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '0 8px'
    },
    // Side action icons (Heart, Speed)
    actionIcon: {
        width: '44px',
        height: '44px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        background: 'none',
        border: 'none'
    },
    // Square navigation buttons (Prev, Next)
    squareBtn: {
        width: '56px',
        height: '56px',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: '0',
        cursor: 'pointer',
        color: 'var(--text-primary)'
    },
    // Central play button (icon only, no container)
    playBtn: {
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: 'var(--text-primary)'
    }
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
            <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
                <div style={styles.headerSpace}>
                    <HeaderCenteredStack
                        variant="dark"
                        currentDate={currentDate}
                        onDateChange={handleDateChange}
                        onBack={() => navigate('/')}
                    />
                </div>
                <Text variant="body" style={{ color: '#000' }}>Cargando podcasts...</Text>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* TOP SECTION: IMMERSIVE */}
            <div style={styles.topSection}>
                {/* Background Image */}
                <div style={styles.backgroundImage(currentPodcast.coverUrl)} />

                {/* Gradient Scrim */}
                <div style={styles.gradientOverlay} />

                {/* Header (Absolute) */}
                <div style={styles.headerSpace}>
                    <HeaderCenteredStack
                        variant="dark"
                        currentDate={currentDate}
                        onDateChange={handleDateChange}
                        onBack={() => navigate('/')}
                    />
                </div>

                {/* Playlist Button (Top Right) */}
                <button style={styles.topRightAction}>
                    <IconPlaylist size={22} stroke={1.5} />
                </button>

                {/* Text Overlay */}
                <div style={styles.textOverlay}>
                    <Caption style={{
                        opacity: 0.9,
                        marginBottom: '8px',
                        letterSpacing: '1px',
                        fontSize: '11px',
                        textTransform: 'uppercase'
                    }}>
                        EPISODIO {currentIndex + 1}
                    </Caption>
                    <Heading level={2} style={{
                        fontSize: '24px',
                        lineHeight: '1.2',
                        marginBottom: '8px',
                        color: '#F2EEE8', // Warm Milk - always visible on dark gradient
                        fontWeight: '700'
                    }}>
                        {currentPodcast.title}
                    </Heading>
                </div>
            </div>

            {/* BOTTOM SECTION: CONTROLS */}
            <div style={styles.bottomSection}>

                {/* Progress Row (Time - Bar - Time) */}
                <div style={styles.progressRow}>
                    <span style={{ minWidth: '35px' }}>{formatTime(currentTime)}</span>

                    <div
                        ref={progressBarRef}
                        style={styles.progressBarContainer}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    >
                        <div style={styles.track}>
                            <div style={styles.fill(currentProgress)} />
                        </div>
                    </div>

                    <span style={{ minWidth: '35px', textAlign: 'right' }}>{formatTime(displayDuration)}</span>
                </div>

                {/* Unified Controls Row: [Heart] [Prev] [Play] [Next] [Speed] */}
                <div style={styles.controlsRow}>
                    {/* Heart (Favorite) */}
                    <button style={styles.actionIcon}>
                        <IconHeart size={24} stroke={1.5} />
                    </button>

                    {/* Previous */}
                    <button
                        onClick={previous}
                        style={{ ...styles.squareBtn, opacity: currentIndex === 0 ? 0.5 : 1 }}
                        disabled={currentIndex === 0}
                    >
                        <IconChevronLeft size={24} stroke={2} />
                    </button>

                    {/* Play/Pause (Center) */}
                    <button
                        onClick={isPlaying ? pause : play}
                        style={styles.playBtn}
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
                        style={styles.squareBtn}
                    >
                        <IconChevronRight size={24} stroke={2} />
                    </button>

                    {/* Speed */}
                    <button
                        onClick={toggleSpeed}
                        style={{ ...styles.actionIcon, fontWeight: 600, fontSize: '14px' }}
                    >
                        {playbackRate}x
                    </button>
                </div>
            </div>
        </div>
    );
};
