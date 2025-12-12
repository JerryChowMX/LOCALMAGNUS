import { PageWrapper } from '../../components/Layout/PageWrapper';
import { Heading, Text } from '../../components/Typography/Typography';
import { Link } from 'react-router-dom';
import { routes } from '../../app/routes';
import { PlaygroundHeader } from './components/PlaygroundHeader';

export const PlaygroundHome = () => {
    return (
        <PageWrapper>
            <PlaygroundHeader />
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', padding: '24px' }}>
                <Heading level={1} style={{ marginBottom: '16px' }}>Home Feed Playground</Heading>
                <Text variant="body" style={{ marginBottom: '24px' }}>
                    This sandbox will be used to design the home feed cards, sections, and daily summaries without relying on Strapi.
                </Text>

                <div style={{ display: 'grid', gap: '16px' }}>
                    <Link to={routes.PLAYGROUND_HEADERS} style={{
                        display: 'block',
                        padding: '16px',
                        backgroundColor: 'var(--surface-color, #fff)',
                        border: '1px solid var(--border-color, #e5e7eb)',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'inherit'
                    }}>
                        <Heading level={3} style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Headers</Heading>
                        <Text variant="body" style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #6b7280)' }}>
                            Header variations and styles
                        </Text>
                    </Link>
                </div>
            </div>
        </PageWrapper>
    );
};
