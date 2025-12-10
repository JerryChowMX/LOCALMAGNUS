import { useState } from 'react';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

export const PlaygroundAudioPlayer = () => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [liked, setLiked] = useState(false);
    const [progress, setProgress] = useState(35);
    const [speed, setSpeed] = useState(1.0);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleLike = () => {
        setLiked(!liked);
    };

    return (
        <PageWrapper>
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#fff',
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
                            <Text variant="body" style={{ color: '#6B7280' }}>
                                Exploring glassmorphism-inspired variations
                            </Text>
                        </div>

                        {/* FINAL SELECTED OPTION: SPLIT STRIP */}
                        <div style={{ marginBottom: '80px' }}>
                            <Text variant="caption" style={{
                                color: '#9CA3AF',
                                marginBottom: '16px',
                                display: 'block',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontSize: '0.75rem'
                            }}>
                                THE AUDIO PLAYER
                            </Text>

                            <div style={{
                                borderTop: '1px solid var(--border-color)',
                                borderBottom: '1px solid var(--border-color)',
                                maxWidth: '600px',
                                margin: '0 auto',
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
                                            width: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {isPlaying ? '❚❚' : '▶'}
                                    </button>
                                    <Text variant="caption" style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: '"Blinker", sans-serif', fontSize: '0.9rem' }}>
                                        12:45
                                    </Text>
                                </div>

                                {/* Middle: Interactive Progress Bar */}
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 24px', position: 'relative' }}>
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '24px', // Touch target height
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
                                            width: `${progress}%`,
                                            height: '1px',
                                            backgroundColor: 'var(--text-primary)',
                                            pointerEvents: 'none'
                                        }} />

                                        {/* Input Range for Interaction */}
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={progress}
                                            onChange={(e) => setProgress(Number(e.target.value))}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0, // Hide default browser input but keep interactive area
                                                cursor: 'pointer',
                                                margin: 0,
                                                padding: 0,
                                                zIndex: 10
                                            }}
                                            className="audio-range-input"
                                        />

                                        {/* Scrubber Handle (Visible on Hover/Drag) */}
                                        <div style={{
                                            position: 'absolute',
                                            left: `${progress}%`,
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--text-primary)',
                                            transform: 'translateX(-5px)',
                                            pointerEvents: 'none',
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            zIndex: 5
                                        }} className="scrubber-handle" />
                                    </div>
                                </div>

                                {/* Right: Speed + Like */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '24px', borderLeft: '1px solid var(--border-color)' }}>
                                    <button
                                        onClick={() => {
                                            // Cycle through speeds: 1.0 -> 1.5 -> 2.0 -> 3.0 -> 0.75 -> 1.0
                                            setSpeed(prev => {
                                                if (prev === 1.0) return 1.5;
                                                if (prev === 1.5) return 2.0;
                                                if (prev === 2.0) return 3.0;
                                                if (prev === 3.0) return 0.75;
                                                return 1.0;
                                            });
                                        }}
                                        style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                            border: 'none',
                                            background: 'transparent',
                                            minWidth: '40px', // Ensure consistent width preventing layout shift
                                            textAlign: 'center'
                                        }}
                                    >
                                        {speed}x
                                    </button>

                                    <button
                                        onClick={toggleLike}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            color: liked ? '#F97316' : 'var(--text-secondary)', // MAGNUS Orange
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'color 0.2s'
                                        }}
                                    >
                                        {liked ? '♥' : '♡'}
                                    </button>
                                </div>
                            </div>

                            {/* CSS for hover interactions */}
                            <style>{`
                                .audio-range-input:hover + .scrubber-handle,
                                .audio-range-input:active + .scrubber-handle {
                                    opacity: 1 !important;
                                }
                            `}</style>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
