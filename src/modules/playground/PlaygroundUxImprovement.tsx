import { PageWrapper } from '../../components/Layout/PageWrapper';
import { Heading, Text } from '../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../app/routes';
import { PlaygroundHeader } from './components/PlaygroundHeader';

const UxCard = ({ title, description, route }: { title: string; description: string; route: string }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(route)}
            style={{
                border: '1px solid var(--border-color)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '12px',
                cursor: 'pointer',
                backgroundColor: 'var(--surface-color)'
            }}
        >
            <Heading level={3} style={{ marginBottom: '8px', fontSize: '1.2rem' }}>{title}</Heading>
            <Text variant="body" style={{ color: 'var(--text-secondary)' }}>{description}</Text>
        </div>
    );
};

export const PlaygroundUxImprovement = () => {
    return (
        <PageWrapper>
            <PlaygroundHeader />
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', padding: '24px' }}>
                <Heading level={1} style={{ marginBottom: '8px' }}>UX Improvement</Heading>
                <Text variant="body" style={{ marginBottom: '24px' }}>Testing and refining UX improvements</Text>

                <UxCard
                    title="Noticias Flow"
                    description="Design and test the Noticias flow and user journey."
                    route={routes.PLAYGROUND_UX_NOTICIAS_FLOW}
                />

                <UxCard
                    title="Video UX Lab"
                    description="Vertical video consumption concepts (Mobile First)."
                    route="/dev/playground/ux-improvement/video-ux"
                />

                <UxCard
                    title="Podcast UX Lab"
                    description="Audio consumption concepts."
                    route="/dev/playground/ux-improvement/podcast-ux"
                />

                <UxCard
                    title="Presentacion UX Lab"
                    description="Slideshow and presentation format experiments."
                    route="/dev/playground/ux-improvement/presentacion-ux"
                />

                <UxCard
                    title="Infografia UX Lab"
                    description="Infographic visualization and interaction concepts."
                    route="/dev/playground/ux-improvement/infografia-ux"
                />
            </div>
        </PageWrapper>
    );
};
