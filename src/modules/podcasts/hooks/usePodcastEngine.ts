import { useState, useRef, useEffect, useCallback } from 'react';
import type { Podcast } from '../types/podcast';

export type RepeatMode = 'off' | 'all' | 'one';

export interface UsePodcastEngineReturn {
    playlist: Podcast[];
    currentIndex: number;
    currentPodcast: Podcast | undefined;
    isPlaying: boolean;
    progress: number; // 0-100
    currentTime: number;
    duration: number;
    playbackRate: number;
    repeatMode: RepeatMode;
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
}

export const usePodcastEngine = (): UsePodcastEngineReturn => {
    // STATE
    const [playlist, setPlaylist] = useState<Podcast[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [repeatMode, setRepeatModeState] = useState<RepeatMode>('off');

    // REFS
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playlistRef = useRef<Podcast[]>([]);
    const currentIndexRef = useRef(0); // Mirror state for event listeners
    const autoAdvanceRef = useRef(false); // Track if we're auto-advancing to next track
    const repeatModeRef = useRef<RepeatMode>('off');

    // Initialize Audio
    useEffect(() => {
        const audio = new Audio();
        audio.preload = 'auto'; // Optimize for continuous play
        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, []);

    // Sync Ref with State
    useEffect(() => {
        playlistRef.current = playlist;
    }, [playlist]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    useEffect(() => {
        repeatModeRef.current = repeatMode;
    }, [repeatMode]);

    // CORE LOGIC
    const playTrack = useCallback(async (index: number) => {
        const audio = audioRef.current;
        const tracks = playlistRef.current;

        if (!audio || !tracks[index]) return;

        try {
            // If strictly changing tracks (not just resuming)
            if (audio.src !== tracks[index].audioUrl) {
                audio.src = tracks[index].audioUrl;
                audio.load();

                // Update MediaSession
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: tracks[index].title,
                        artist: tracks[index].author || 'Magnus Podcast',
                        artwork: tracks[index].coverUrl ? [{ src: tracks[index].coverUrl, sizes: '512x512', type: 'image/jpeg' }] : []
                    });
                }
            }

            await audio.play();
        } catch (error) {
            console.error('[PodcastEngine] Playback failed:', error);
            // Auto-skip on error (Resilience)
            handleNext();
        }
    }, []);

    const handleNext = useCallback(() => {
        const mode = repeatModeRef.current;

        // Repeat one: replay current track once, then continue
        if (mode === 'one') {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.error('Repeat play error', e));
            }
            // Reset to 'off' so next time it continues normally
            setRepeatModeState('off');
            return;
        }

        const nextIndex = currentIndexRef.current + 1;
        if (nextIndex < playlistRef.current.length) {
            autoAdvanceRef.current = true; // Signal auto-advance for the effect
            setCurrentIndex(nextIndex); // Trigger effect to play
        } else if (mode === 'all') {
            // Repeat all: loop back to beginning
            autoAdvanceRef.current = true;
            setCurrentIndex(0);
        } else {
            console.log('[PodcastEngine] Playlist ended');
            setIsPlaying(false);
        }
    }, []);

    const handlePrevious = useCallback(() => {
        const prevIndex = currentIndexRef.current - 1;
        if (prevIndex >= 0) {
            setCurrentIndex(prevIndex);
        }
    }, []);

    // Effect: Watch Index Changes -> Trigger Play
    useEffect(() => {
        // Auto-advance: play next track automatically when one ends
        if (autoAdvanceRef.current && playlist.length > 0) {
            autoAdvanceRef.current = false; // Reset the flag
            playTrack(currentIndex);
            return;
        }

        if (playlist.length > 0 && isPlaying) {
            playTrack(currentIndex);
        } else if (playlist.length > 0 && !isPlaying && audioRef.current && !audioRef.current.src) {
            // Initial load without auto-play (wait for user)
            // Preload first track?
            audioRef.current.src = playlist[currentIndex].audioUrl;
        }
    }, [currentIndex, playlist]); // Only re-run if index changes


    // EVENT LISTENERS (Resilient)
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
        const onDurationChange = () => {
            setDuration(audio.duration);
        };
        const onEnded = () => {
            console.log('[PodcastEngine] Track ended, advancing...');
            handleNext();
        };
        const onError = (e: Event) => {
            console.error('[PodcastEngine] Audio Error:', e);
            // handleNext(); // Don't infinite loop if all fail, but maybe try next
        };

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('durationchange', onDurationChange);
        audio.addEventListener('loadedmetadata', onDurationChange); // Early capture
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);

        // Media Session Handlers
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                audio.play();
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                audio.pause();
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                handleNext();
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                handlePrevious();
            });
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
    }, [handleNext, handlePrevious]); // Empty dependency array = listeners attached once using Refs intra-function

    // Effect: Sync Rate
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    // PUBLIC API
    return {
        playlist,
        currentIndex,
        currentPodcast: playlist[currentIndex],
        isPlaying,
        progress,
        currentTime,
        duration,
        playbackRate,
        play: () => audioRef.current?.play().catch(e => console.error("Play error", e)),
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
        repeatMode,
        setRepeatMode: (mode: RepeatMode) => setRepeatModeState(mode),
        loadPlaylist: (newPlaylist: Podcast[]) => {
            setPlaylist(newPlaylist);
            setCurrentIndex(0);
            setProgress(0);
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

                // Keep tracks before and including current, shuffle the rest
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
        }
    };
};
