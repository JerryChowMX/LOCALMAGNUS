import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import type { Podcast } from '../modules/podcasts/types/podcast';

// === Types ===
export type RepeatMode = 'off' | 'all' | 'one';

export interface PodcastContextValue {
    // Playlist & Track State
    playlist: Podcast[];
    currentIndex: number;
    currentPodcast: Podcast | undefined;

    // Playback State
    isPlaying: boolean;
    progress: number; // 0-100
    currentTime: number;
    duration: number;
    playbackRate: number;
    repeatMode: RepeatMode;

    // Controls
    play: () => void;
    pause: () => void;
    next: () => void;
    previous: () => void;
    seek: (percentage: number) => void;
    setRate: (rate: number) => void;
    setRepeatMode: (mode: RepeatMode) => void;
    loadPlaylist: (podcasts: Podcast[]) => void;
    jumpTo: (index: number) => void;
    shuffleQueue: () => void;

    // Mini Player State
    isMinimized: boolean;
    setMinimized: (value: boolean) => void;
    hasActiveSession: boolean; // Has audio loaded/played at some point
    clearSession: () => void; // Close mini player and reset session

    // Audio Focus Management
    pauseForVideo: () => void;
    pauseForOtherAudio: () => void; // Pause when TTS, video, or other audio starts
    wasPlayingBeforeVideo: boolean;
}

// === Context ===
const PodcastContext = createContext<PodcastContextValue | null>(null);

// === Provider ===
export const PodcastProvider = ({ children }: { children: ReactNode }) => {
    // === PLAYLIST STATE ===
    const [playlist, setPlaylist] = useState<Podcast[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [repeatMode, setRepeatModeState] = useState<RepeatMode>('off');

    // === MINI PLAYER STATE ===
    const [isMinimized, setMinimized] = useState(true); // Start minimized
    const [hasActiveSession, setHasActiveSession] = useState(false);
    const [wasPlayingBeforeVideo, setWasPlayingBeforeVideo] = useState(false);

    // === REFS ===
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playlistRef = useRef<Podcast[]>([]);
    const currentIndexRef = useRef(0);
    const autoAdvanceRef = useRef(false);
    const repeatModeRef = useRef<RepeatMode>('off');

    // === AUDIO INITIALIZATION ===
    useEffect(() => {
        const audio = new Audio();
        audio.preload = 'auto';
        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, []);

    // === SYNC REFS WITH STATE ===
    useEffect(() => {
        playlistRef.current = playlist;
    }, [playlist]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    useEffect(() => {
        repeatModeRef.current = repeatMode;
    }, [repeatMode]);

    // === CORE PLAYBACK LOGIC ===
    const playTrack = useCallback(async (index: number) => {
        const audio = audioRef.current;
        const tracks = playlistRef.current;

        if (!audio || !tracks[index]) return;

        try {
            if (audio.src !== tracks[index].audioUrl) {
                audio.src = tracks[index].audioUrl;
                audio.load();

                // Update MediaSession
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: tracks[index].title,
                        artist: tracks[index].author || 'Magnus Podcast',
                        artwork: tracks[index].coverUrl
                            ? [{ src: tracks[index].coverUrl, sizes: '512x512', type: 'image/jpeg' }]
                            : []
                    });
                }
            }

            await audio.play();
            setHasActiveSession(true);
        } catch (error) {
            console.error('[PodcastContext] Playback failed:', error);
            handleNext();
        }
    }, []);

    const handleNext = useCallback(() => {
        const mode = repeatModeRef.current;

        // Repeat one: replay once then continue
        if (mode === 'one') {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.error('Repeat play error', e));
            }
            setRepeatModeState('off');
            return;
        }

        const nextIndex = currentIndexRef.current + 1;
        if (nextIndex < playlistRef.current.length) {
            autoAdvanceRef.current = true;
            setCurrentIndex(nextIndex);
        } else if (mode === 'all') {
            autoAdvanceRef.current = true;
            setCurrentIndex(0);
        } else {
            console.log('[PodcastContext] Playlist ended');
            setIsPlaying(false);
        }
    }, []);

    const handlePrevious = useCallback(() => {
        const prevIndex = currentIndexRef.current - 1;
        if (prevIndex >= 0) {
            setCurrentIndex(prevIndex);
        }
    }, []);

    // === EFFECT: Watch Index Changes ===
    useEffect(() => {
        if (autoAdvanceRef.current && playlist.length > 0) {
            autoAdvanceRef.current = false;
            playTrack(currentIndex);
            return;
        }

        if (playlist.length > 0 && isPlaying) {
            playTrack(currentIndex);
        } else if (playlist.length > 0 && !isPlaying && audioRef.current && !audioRef.current.src) {
            audioRef.current.src = playlist[currentIndex].audioUrl;
        }
    }, [currentIndex, playlist]);

    // === EVENT LISTENERS ===
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onTimeUpdate = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
            setCurrentTime(audio.currentTime);
        };
        const onDurationChange = () => setDuration(audio.duration);
        const onEnded = () => {
            console.log('[PodcastContext] Track ended, advancing...');
            handleNext();
        };
        const onError = (e: Event) => {
            console.error('[PodcastContext] Audio Error:', e);
        };

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('durationchange', onDurationChange);
        audio.addEventListener('loadedmetadata', onDurationChange);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);

        // Media Session Handlers
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => audio.play());
            navigator.mediaSession.setActionHandler('pause', () => audio.pause());
            navigator.mediaSession.setActionHandler('nexttrack', () => handleNext());
            navigator.mediaSession.setActionHandler('previoustrack', () => handlePrevious());
        }

        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('durationchange', onDurationChange);
            audio.removeEventListener('loadedmetadata', onDurationChange);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('error', onError);

            if ('mediaSession' in navigator) {
                navigator.mediaSession.setActionHandler('play', null);
                navigator.mediaSession.setActionHandler('pause', null);
                navigator.mediaSession.setActionHandler('nexttrack', null);
                navigator.mediaSession.setActionHandler('previoustrack', null);
            }
        };
    }, [handleNext, handlePrevious]);

    // === EFFECT: Sync Playback Rate ===
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    // === AUDIO FOCUS MANAGEMENT ===
    const pauseForVideo = useCallback(() => {
        if (isPlaying) {
            setWasPlayingBeforeVideo(true);
            audioRef.current?.pause();
        }
    }, [isPlaying]);

    // Simple pause for other audio sources (TTS, noticia audio, etc.)
    const pauseForOtherAudio = useCallback(() => {
        audioRef.current?.pause();
    }, []);

    // === PUBLIC API ===
    const value: PodcastContextValue = {
        // State
        playlist,
        currentIndex,
        currentPodcast: playlist[currentIndex],
        isPlaying,
        progress,
        currentTime,
        duration,
        playbackRate,
        repeatMode,

        // Controls
        play: () => {
            audioRef.current?.play().catch(e => console.error("Play error", e));
            setHasActiveSession(true);
        },
        pause: () => audioRef.current?.pause(),
        next: handleNext,
        previous: handlePrevious,
        seek: (percentage: number) => {
            if (audioRef.current && audioRef.current.duration) {
                const time = (percentage / 100) * audioRef.current.duration;
                audioRef.current.currentTime = time;
                setProgress(percentage);
            }
        },
        setRate: (rate: number) => setPlaybackRate(rate),
        setRepeatMode: (mode: RepeatMode) => setRepeatModeState(mode),
        loadPlaylist: (newPlaylist: Podcast[]) => {
            setPlaylist(newPlaylist);
            setCurrentIndex(0);
            setProgress(0);
            if (newPlaylist.length > 0) {
                setHasActiveSession(true);
            }
        },
        jumpTo: (index: number) => {
            if (index >= 0 && index < playlistRef.current.length) {
                autoAdvanceRef.current = true;
                setCurrentIndex(index);
                setProgress(0);
            }
        },
        shuffleQueue: () => {
            setPlaylist(currentPlaylist => {
                const idx = currentIndexRef.current;

                if (currentPlaylist.length <= 1) return currentPlaylist;

                const beforeAndCurrent = currentPlaylist.slice(0, idx + 1);
                const after = currentPlaylist.slice(idx + 1);

                if (after.length === 0) return currentPlaylist;

                // Fisher-Yates shuffle
                const shuffled = [...after];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }

                const newPlaylist = [...beforeAndCurrent, ...shuffled];
                playlistRef.current = newPlaylist;
                return newPlaylist;
            });
        },

        // Mini Player State
        isMinimized,
        setMinimized,
        hasActiveSession,
        clearSession: () => {
            audioRef.current?.pause();
            setHasActiveSession(false);
        },

        // Audio Focus Management
        pauseForVideo,
        pauseForOtherAudio,
        wasPlayingBeforeVideo,
    };

    return (
        <PodcastContext.Provider value={value}>
            {children}
        </PodcastContext.Provider>
    );
};

// === Hook ===
export const usePodcastContext = (): PodcastContextValue => {
    const context = useContext(PodcastContext);
    if (!context) {
        throw new Error('usePodcastContext must be used within a PodcastProvider');
    }
    return context;
};

// Re-export for convenience
export type { Podcast };
