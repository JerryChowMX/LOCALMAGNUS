import { PageWrapper } from '../../components/Layout/PageWrapper';
import { Heading, Text } from '../../components/Typography/Typography';
import { routes } from '../../app/routes';
import { useNavigate } from 'react-router-dom';

const PlaygroundCard = ({ title, description, route }: { title: string; description: string; route: string }) => {
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

export const PlaygroundMenu = () => {
    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
                <Heading level={1} style={{ marginBottom: '8px' }}>MAGNUS Playground</Heading>
                <Text variant="body" style={{ marginBottom: '24px' }}>Sandboxes for design & development</Text>

                <PlaygroundCard
                    title="Article Screen Playground"
                    description="Design and test the article detail layout: header, image, audio player, AI bar, body text."
                    route={routes.PLAYGROUND_ARTICLE}
                />

                <PlaygroundCard
                    title="Home Feed Playground"
                    description="Experiment with the main feed layout and cards."
                    route={routes.PLAYGROUND_HOME}
                />

                <PlaygroundCard
                    title="Components Lab"
                    description="Isolated UI components: buttons, cards, media players, etc."
                    route={routes.playgroundComponents}
                />
            </div>
        </PageWrapper>
    );
};
