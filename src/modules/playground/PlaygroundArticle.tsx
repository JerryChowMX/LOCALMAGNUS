import { PageWrapper } from '../../components/Layout/PageWrapper';
import { HeaderContent } from '../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../components/Typography/Typography';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../../app/routes';

// Simple list component for playground menu
const PlaygroundLink = ({ to, title, description }: { to: string, title: string, description: string }) => (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '16px' }}>
        <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#fff', transition: 'all 0.2s' }}>
            <Text variant="body" style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{title}</Text>
            <Text variant="caption" style={{ color: '#6B7280' }}>{description}</Text>
        </div>
    </Link>
);

export const PlaygroundArticle = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <HeaderContent
                    onBack={() => navigate('/dev/playground')}
                />

                <div style={{ padding: '24px' }}>
                    <Heading level={1} style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Article Designs</Heading>
                    <Text variant="body" style={{ color: '#6B7280', marginBottom: '24px' }}>Select a design variant to view.</Text>

                    <PlaygroundLink
                        to={routes.PLAYGROUND_ARTICLE_STANDARD}
                        title="Standard One"
                        description="Default standard article layout with header, audio, and chat."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_ARTICLE_STANDARD_2}
                        title="Standard Two (Dark Mode)"
                        description="Dark mode variant of the standard article layout."
                    />

                    {/* Future designs can be added here */}
                </div>
            </div>
        </PageWrapper>
    );
};
