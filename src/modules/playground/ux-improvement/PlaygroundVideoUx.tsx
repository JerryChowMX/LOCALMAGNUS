import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';
import { PlaygroundHeader } from '../components/PlaygroundHeader';
import './components/PlaygroundStyles.css';
import './components/VideoUx.css';

// OPTION 1: THE PURE IMMERSIVE STORY (Winner)
import { useRef, useMemo } from 'react';
import { HoldToSpeedController } from '../../media/components/HoldToSpeedController';
import type { VideoPlaybackController } from '../../media/hooks/useHoldPlaybackRate';

const Option1Immersive = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Adapt HTML5 video to our controller interface
    const playbackController = useMemo<VideoPlaybackController>(() => {
        // Logic handled inside hook via dynamic current access if needed, 
        // strictly speaking useHoldPlaybackRate handles null controller gracefully, 
        // but let's provide an object that always proxies to current ref
        return {
            getPlaybackRate: () => videoRef.current?.playbackRate ?? 1.0,
            setPlaybackRate: (rate: number) => {
                if (videoRef.current) videoRef.current.playbackRate = rate;
            },
            isPaused: () => videoRef.current?.paused ?? true,
            togglePlay: () => {
                if (videoRef.current) {
                    videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
                }
            }
        };
    }, []); // Empty dep array works if we proxy to ref.current, but ref might be null initially.
    // Actually, useHoldPlaybackRate doesn't call controller methods immediately on render, only on event.
    // So proxying is safe.

    return (
        <div className="video-immersive-card" ref={containerRef} style={{ overflow: 'hidden', position: 'relative' }}>
            <video
                ref={videoRef}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                playsInline
                loop
                controls
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <HoldToSpeedController
                containerRef={containerRef}
                controller={playbackController}
                enabled={true}
                rate={2.0}
            />
        </div>
    );
};

export const PlaygroundVideoUx = () => {
    return (
        <PageWrapper>
            <PlaygroundHeader />
            <div className="playground-page-wrapper">

                <div className="video-ux-container">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <Text variant="caption" style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#FF6B35', fontWeight: 'bold' }}>
                            UX Lab
                        </Text>
                        <Heading level={1} style={{ marginBottom: '16px', fontSize: '32px' }}>
                            Vertical Video Experience
                        </Heading>
                        <p style={{ color: '#6B7280', maxWidth: '500px', margin: '0 auto' }}>
                            Selected concept: Immersive Story (Pure)
                        </p>
                    </div>

                    <div style={{ minHeight: '600px' }}>
                        <Option1Immersive />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default PlaygroundVideoUx;
