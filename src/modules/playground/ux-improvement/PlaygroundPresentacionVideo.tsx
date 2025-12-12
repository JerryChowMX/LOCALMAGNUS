import { useState } from 'react';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';
import { PlaygroundHeader } from '../components/PlaygroundHeader';

const styles = {
    phoneContainer: {
        maxWidth: '400px',
        margin: '0 auto',
        minHeight: '700px',
        position: 'relative' as const,
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    }
};

// Full Hero with Play Button
const FullHero = ({ onPlay }: { onPlay: () => void }) => (
    <div style={{ ...styles.phoneContainer, background: '#000' }} onClick={onPlay}>
        <img
            src="https://picsum.photos/400/700"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Video hero"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)' }}>
            <div style={{ position: 'absolute', top: 16, right: 16, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
            </div>
        </div>
    </div>
);

// Video Player (horizontal)
const VideoPlayer = ({ onBack }: { onBack: () => void }) => (
    <div style={{ ...styles.phoneContainer, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onBack}>
        <div style={{ width: '100%', aspectRatio: '16/9', background: '#222', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                [16:9 VIDEO PLAYING]
            </div>
        </div>
        <div style={{ position: 'absolute', top: 16, right: 16, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3H5m14 0h-3V3m-3 18v-3m0 0H5m8 0h8" />
            </svg>
        </div>
    </div>
);

export const PlaygroundPresentacionVideo = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <PageWrapper>
            <div style={{ padding: 24 }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <button onClick={() => window.history.back()} style={{ marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>← Back</button>

                    <Heading level={2} style={{ marginBottom: 8 }}>Horizontal Video - Full Hero</Heading>
                    <Text variant="body" style={{ marginBottom: 32, color: '#666' }}>Vertical hero entry point</Text>

                    <div>
                        {isPlaying ? (
                            <VideoPlayer onBack={() => setIsPlaying(false)} />
                        ) : (
                            <FullHero onPlay={() => setIsPlaying(true)} />
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default PlaygroundPresentacionVideo;
