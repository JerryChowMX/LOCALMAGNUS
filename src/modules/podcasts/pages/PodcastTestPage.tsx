import { useEffect } from 'react';
import { usePodcastEngine } from '../hooks/usePodcastEngine';
import { MOCK_PODCASTS } from '../types/podcast';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';

export const PodcastTestPage = () => {
    const {
        playlist,
        currentPodcast,
        isPlaying,
        progress,
        loadPlaylist,
        play,
        pause,
        next,
        previous
    } = usePodcastEngine();

    // Init Logic
    useEffect(() => {
        loadPlaylist(MOCK_PODCASTS);
    }, []);

    if (!currentPodcast) {
        return (
            <PageWrapper>
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading Engine...</div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div style={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '20px',
                background: '#111',
                color: 'white'
            }}>
                {/* 1. Status Info */}
                <Text variant="caption" style={{ opacity: 0.6 }}>DRIVING MODE TEST</Text>

                <div style={{ margin: '40px 0', width: '100%' }}>
                    <Heading level={2} style={{ fontSize: '32px', marginBottom: '16px' }}>
                        {currentPodcast.title}
                    </Heading>
                    <Text variant="body" style={{ fontSize: '18px', opacity: 0.8 }}>
                        {currentPodcast.author || 'Magnus Podcast'}
                    </Text>
                </div>

                {/* 2. Progress Bar (Visual only for safety, scrubber optional) */}
                <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#333',
                    borderRadius: '4px',
                    marginBottom: '40px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: '#3b82f6',
                        transition: 'width 0.2s linear'
                    }} />
                </div>

                {/* 3. BIG CONTROLS */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '40px'
                }}>
                    {/* Previous (Optional/Smaller) */}
                    <button
                        onClick={previous}
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: '#222',
                            border: '1px solid #444',
                            color: 'white',
                            fontSize: '24px'
                        }}
                    >
                        ⏮
                    </button>

                    {/* PLAY/PAUSE (HUGE) */}
                    <button
                        onClick={isPlaying ? pause : play}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: isPlaying ? '#222' : 'white',
                            color: isPlaying ? 'white' : 'black',
                            border: isPlaying ? '2px solid white' : 'none',
                            fontSize: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>

                    {/* NEXT (HUGE) */}
                    <button
                        onClick={next}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: '#222',
                            border: '1px solid #444',
                            color: 'white',
                            fontSize: '32px'
                        }}
                    >
                        ⏭
                    </button>
                </div>

                {/* 4. Kill Switch Metrics */}
                <div style={{ marginTop: '60px', fontSize: '12px', fontFamily: 'monospace', opacity: 0.5 }}>
                    <div>Track: {playlist.indexOf(currentPodcast) + 1} / {playlist.length}</div>
                    <div>State: {isPlaying ? 'PLAYING' : 'PAUSED'}</div>
                    <div style={{ color: 'orange' }}>
                        LOCK SCREEN CONTROLS: ACTIVE
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
