import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';
import { PlaygroundHeader } from '../components/PlaygroundHeader';
import './components/PlaygroundStyles.css';
import './components/VideoUx.css';
import './components/PodcastUx.css';

// OPTION: BALANCED (Winner)
const OptionBalancedSpeed = () => (
    <div className="podcast-opt-container" style={{ height: '600px' }}>
        <div className="podcast-magnus-hero">
            <div className="magnus-blob"></div>

            <div className="type-content">
                <div className="type-status" style={{ color: '#0284C7' }}>EPISODIO 46</div>
                <div className="type-title-serif-magnus">
                    "Futuro Digital: La revolución de la inteligencia artificial."
                </div>
            </div>

            <div style={{ zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ fontSize: '48px', cursor: 'pointer', color: '#0369A1', lineHeight: 0.8 }}>
                            ▶
                        </div>
                        <button style={{
                            background: 'none',
                            border: '1px solid #0369A1',
                            borderRadius: '0px',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0369A1',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontFamily: 'inherit'
                        }}>
                            1x
                        </button>
                    </div>

                    <div style={{ fontFamily: 'monospace', fontSize: '16px', color: '#0369A1', fontWeight: 'bold' }}>
                        12:45
                    </div>
                </div>

                <div className="type-progress-container" style={{ background: 'rgba(3, 105, 161, 0.1)' }}>
                    <div style={{ width: '65%', height: '100%', background: '#0369A1' }}></div>
                </div>
            </div>
        </div>
    </div>
);

export const PlaygroundPodcastUx = () => {
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
                            Podcast Experience
                        </Heading>
                        <p style={{ color: '#6B7280', maxWidth: '500px', margin: '0 auto' }}>
                            Final Selection: Balanced Control
                        </p>
                    </div>

                    <div style={{ minHeight: '600px' }}>
                        <OptionBalancedSpeed />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default PlaygroundPodcastUx;
