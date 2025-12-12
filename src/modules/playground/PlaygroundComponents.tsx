import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/Layout/PageWrapper';
import { Heading, Text } from '../../components/Typography/Typography';
import { routes } from '../../app/routes';
import { getMonterreyDate } from '../../lib/dateUtils';
import { PlaygroundHeader } from './components/PlaygroundHeader';

// Simple list component for playground menu
const PlaygroundLink = ({ to, title, description }: { to: string, title: string, description: string }) => (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '16px' }}>
        <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#fff', transition: 'all 0.2s' }}>
            <Text variant="body" style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{title}</Text>
            <Text variant="caption" style={{ color: '#6B7280' }}>{description}</Text>
        </div>
    </Link>
);

export const PlaygroundComponents = () => {
    const today = getMonterreyDate();

    return (
        <PageWrapper>
            <PlaygroundHeader />
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <div style={{ padding: '24px' }}>
                    <Heading level={1} style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Components Lab</Heading>
                    <Text variant="body" style={{ color: '#6B7280', marginBottom: '24px' }}>
                        This sandbox will render key components (cards, buttons, audio player, AI bar) in isolation for visual QA.
                    </Text>

                    <PlaygroundLink
                        to={routes.PLAYGROUND_ARTICLE_COMPONENTS}
                        title="Article Components"
                        description="Components specifically for article pages."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_RESUMEN_EJECUTIVO_COMPONENTS}
                        title="Resumen Ejecutivo Components"
                        description="Components for the Resumen Ejecutivo section."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_AUDIO_SUMMARY}
                        title="Audio Summary"
                        description="Audio player component for summaries."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_COMMENTS}
                        title="Comment Section"
                        description="Comments section component."
                    />

                    <PlaygroundLink
                        to={routes.noticiasHub(today)}
                        title={`NoticiasHub/${today}`}
                        description="Direct link to today's NoticiasHub."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_NOTICIAS_ARTICLE_LANDING}
                        title="Noticias Article Landing (Playground)"
                        description="Clone of the 'Format Selection' page for design iteration."
                    />

                </div>
            </div>
        </PageWrapper>
    );
};
