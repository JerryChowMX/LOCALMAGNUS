import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';
import { PlaygroundHeader } from '../components/PlaygroundHeader';
import { useNavigate } from 'react-router-dom';
import './components/PlaygroundStyles.css';

const PresentationCard = ({ title, description, path }: { title: string, description: string, path: string }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(path)}
            style={{
                background: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '16px'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#FF6B35'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
        >
            <Heading level={3} style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{title}</Heading>
            <Text variant="body" style={{ color: '#64748B' }}>{description}</Text>
        </div>
    )
}

export const PlaygroundPresentacionUx = () => {
    return (
        <PageWrapper>
            <PlaygroundHeader />
            <div className="playground-page-wrapper">

                <div className="video-ux-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <Text variant="caption" style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#FF6B35', fontWeight: 'bold' }}>
                            UX Lab
                        </Text>
                        <Heading level={1} style={{ marginBottom: '16px', fontSize: '32px' }}>
                            Presentacion UX
                        </Heading>
                        <p style={{ color: '#6B7280' }}>
                            Select a presentation format to explore.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <PresentationCard
                            title="PDF Experience"
                            description="Full document viewing with scroll, zoom, and navigation."
                            path="/dev/playground/ux-improvement/presentacion-ux/pdf"
                        />
                        <PresentationCard
                            title="Video Experience"
                            description="Horizontal (16:9) video viewing optimized for presentations."
                            path="/dev/playground/ux-improvement/presentacion-ux/video"
                        />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default PlaygroundPresentacionUx;
