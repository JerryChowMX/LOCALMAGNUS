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

                        {/* OPTION 2: FROSTED CAPSULE */}
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
                                Option 2: Frosted Capsule
                            </Text>

                            <div style={{
                                maxWidth: '600px',
                                margin: '0 auto',
                                padding: '16px 24px',
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                borderRadius: '100px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px'
                            }}>
                                {/* Play Button */}
                                <button
                                    onClick={togglePlay}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.9), rgba(234, 88, 12, 0.9))',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.1rem',
                                        color: '#fff',
                                        boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(249, 115, 22, 0.3)';
                                    }}
                                >
                                    {isPlaying ? '❚❚' : '▶'}
                                </button>

                                {/* Progress and Info */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {/* Time and Speed Row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text variant="caption" style={{
                                            color: 'rgba(0, 0, 0, 0.7)',
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            fontFamily: '"Blinker", sans-serif'
                                        }}>
                                            12:45
                                        </Text>
                                        <button
                                            onClick={() => {
                                                setSpeed(prev => {
                                                    if (prev === 1.0) return 1.5;
                                                    if (prev === 1.5) return 2.0;
                                                    if (prev === 2.0) return 3.0;
                                                    if (prev === 3.0) return 0.75;
                                                    return 1.0;
                                                });
                                            }}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.6)',
                                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                                borderRadius: '12px',
                                                padding: '4px 12px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                color: 'rgba(0, 0, 0, 0.7)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {speed}x
                                        </button>
                                    </div>

                                    {/* Progress Bar */}
                                    <div style={{ position: 'relative', width: '100%', height: '20px', display: 'flex', alignItems: 'center' }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'rgba(0, 0, 0, 0.1)',
                                            borderRadius: '2px',
                                            pointerEvents: 'none'
                                        }} />
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            width: `${progress}%`,
                                            height: '4px',
                                            background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.9), rgba(234, 88, 12, 0.9))',
                                            borderRadius: '2px',
                                            pointerEvents: 'none'
                                        }} />
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={progress}
                                            onChange={(e) => setProgress(Number(e.target.value))}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0,
                                                cursor: 'pointer',
                                                position: 'absolute',
                                                zIndex: 10
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Like Button */}
                                <button
                                    onClick={toggleLike}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.4rem',
                                        color: liked ? '#F97316' : 'rgba(0, 0, 0, 0.3)',
                                        transition: 'color 0.2s, transform 0.2s',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {liked ? '♥' : '♡'}
                                </button>
                            </div>
                        </div>

                        {/* OPTION 3: FLOATING GLASS */}
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
                                Option 3: Floating Glass
                            </Text>

                            <div style={{
                                maxWidth: '550px',
                                margin: '0 auto',
                                padding: '20px 28px',
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                                backdropFilter: 'blur(30px)',
                                WebkitBackdropFilter: 'blur(30px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 2px 0 rgba(255, 255, 255, 0.8)',
                                transform: 'translateY(0)',
                                transition: 'transform 0.3s, box-shadow 0.3s'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.8)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 2px 0 rgba(255, 255, 255, 0.8)';
                                }}
                            >
                                {/* Top Row: Controls */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
                                    {/* Play Button */}
                                    <button
                                        onClick={togglePlay}
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '16px',
                                            background: 'linear-gradient(135deg, #F97316, #EA580C)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.2rem',
                                            color: '#fff',
                                            boxShadow: '0 6px 20px rgba(249, 115, 22, 0.35)',
                                            flexShrink: 0
                                        }}
                                    >
                                        {isPlaying ? '❚❚' : '▶'}
                                    </button>

                                    {/* Duration and Title */}
                                    <div style={{ flex: 1 }}>
                                        <Text variant="caption" style={{
                                            color: 'rgba(0, 0, 0, 0.5)',
                                            fontSize: '0.7rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em',
                                            fontWeight: 600,
                                            marginBottom: '4px',
                                            display: 'block'
                                        }}>
                                            DURATION
                                        </Text>
                                        <Text variant="body" style={{
                                            color: 'rgba(0, 0, 0, 0.9)',
                                            fontSize: '1.25rem',
                                            fontWeight: 700,
                                            fontFamily: '"Blinker", sans-serif'
                                        }}>
                                            12:45
                                        </Text>
                                    </div>

                                    {/* Speed and Like */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button
                                            onClick={() => {
                                                setSpeed(prev => {
                                                    if (prev === 1.0) return 1.5;
                                                    if (prev === 1.5) return 2.0;
                                                    if (prev === 2.0) return 3.0;
                                                    if (prev === 3.0) return 0.75;
                                                    return 1.0;
                                                });
                                            }}
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.05)',
                                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                                borderRadius: '10px',
                                                padding: '6px 14px',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                color: 'rgba(0, 0, 0, 0.7)',
                                                cursor: 'pointer'
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
                                                fontSize: '1.5rem',
                                                color: liked ? '#F97316' : 'rgba(0, 0, 0, 0.25)',
                                                transition: 'color 0.2s'
                                            }}
                                        >
                                            {liked ? '♥' : '♡'}
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ position: 'relative', width: '100%', height: '24px', display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        height: '6px',
                                        background: 'rgba(0, 0, 0, 0.08)',
                                        borderRadius: '3px',
                                        pointerEvents: 'none',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${progress}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, #F97316, #EA580C)',
                                            boxShadow: '0 0 8px rgba(249, 115, 22, 0.4)',
                                            transition: 'width 0.1s linear'
                                        }} />
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={progress}
                                        onChange={(e) => setProgress(Number(e.target.value))}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer',
                                            position: 'absolute',
                                            zIndex: 10
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
