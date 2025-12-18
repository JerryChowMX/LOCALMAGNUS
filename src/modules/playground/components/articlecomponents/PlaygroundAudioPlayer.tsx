import { useState, useEffect } from 'react';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';
import { ArticleTtsEntry } from '../../../articles/tts/components/ArticleTtsEntry';

export const PlaygroundAudioPlayer = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFavorited, setIsFavorited] = useState(false);

    // Simulated duration of 6 minutes 12 seconds
    const duration = 372;

    // Simulate playback progress
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= duration) {
                        setIsActive(false);
                        return 0;
                    }
                    return prev + (0.1 * playbackRate);
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isActive, isPaused, playbackRate, duration]);

    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const handleStop = () => {
        setIsActive(false);
        setCurrentTime(0);
    };

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleResume = () => {
        setIsPaused(false);
    };

    const handleSeek = (time: number) => {
        setCurrentTime(time);
    };

    const handlePlaybackRateChange = (rate: number) => {
        setPlaybackRate(rate);
    };

    const handleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    return (
        <PageWrapper>
            <div style={{
                minHeight: '100vh',
                backgroundColor: 'var(--bg-primary, #fff)',
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <HeaderContent
                        onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)}
                    />

                    <div style={{ padding: '24px 24px 100px 24px' }}>
                        <div style={{ marginBottom: '64px', textAlign: 'center' }}>
                            <Heading level={1} style={{
                                fontSize: '2rem',
                                marginBottom: '12px',
                                fontFamily: '"Blinker", sans-serif',
                                fontWeight: 800
                            }}>
                                Audio Player
                            </Heading>
                            <Text variant="body" style={{ color: 'var(--text-secondary, #6B7280)' }}>
                                New TTS Audio Player Design
                            </Text>
                        </div>

                        {/* NEW TTS AUDIO PLAYER COMPONENT */}
                        <div style={{ marginBottom: '80px' }}>
                            <Text variant="caption" style={{
                                color: 'var(--text-tertiary, #9CA3AF)',
                                marginBottom: '16px',
                                display: 'block',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontSize: '0.75rem'
                            }}>
                                NEW DESIGN - ARTICLE TTS ENTRY
                            </Text>

                            <div style={{
                                maxWidth: '600px',
                                margin: '0 auto',
                            }}>
                                <ArticleTtsEntry
                                    ttsStatus="ready"
                                    isActive={isActive}
                                    isPaused={isPaused}
                                    onStart={handleStart}
                                    onStop={handleStop}
                                    onPause={handlePause}
                                    onResume={handleResume}
                                />
                            </div>
                        </div>

                        {/* Status Info */}
                        <div style={{
                            maxWidth: '600px',
                            margin: '0 auto',
                            padding: '16px',
                            backgroundColor: 'var(--bg-secondary, #F5F5F5)',
                            borderRadius: '8px'
                        }}>
                            <Text variant="caption" style={{
                                color: 'var(--text-secondary, #666)',
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 600
                            }}>
                                Player State:
                            </Text>
                            <div style={{
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                                color: 'var(--text-primary, #111)'
                            }}>
                                <div>isActive: {isActive.toString()}</div>
                                <div>isPaused: {isPaused.toString()}</div>
                                <div>currentTime: {currentTime.toFixed(1)}s</div>
                                <div>playbackRate: {playbackRate}x</div>
                                <div>isFavorited: {isFavorited.toString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
