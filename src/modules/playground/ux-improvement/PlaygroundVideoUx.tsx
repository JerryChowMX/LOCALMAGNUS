import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';
import { PlaygroundHeader } from '../components/PlaygroundHeader';
import './components/PlaygroundStyles.css';
import './components/VideoUx.css';

// OPTION 1: THE PURE IMMERSIVE STORY (Winner)
const Option1Immersive = () => (
    <div className="video-immersive-card">
        {/* Mock Video Content */}
        <div style={{ color: '#444', fontSize: '120px', opacity: 0.2 }}>
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
        </div>

        {/* Overlay Controls */}
        <div className="video-immersive-overlay">
            <div style={{ marginBottom: '16px' }}>
                <span style={{
                    background: '#FF6B35', color: 'white', padding: '4px 12px',
                    borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'
                }}>
                    Resumen de video
                </span>
            </div>
            <Heading level={2} style={{ color: 'white', marginBottom: '8px', fontSize: '24px' }}>
                Incendio en Arteaga
            </Heading>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.4' }}>
                Bomberos combaten el fuego que ha consumido más de 50 hectáreas.
            </p>
        </div>

        {/* Center Play Button */}
        <div style={{ position: 'absolute' }}>
            <div className="video-immersive-play">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
            </div>
        </div>
    </div>
);

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
