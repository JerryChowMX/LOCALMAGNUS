import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate, Link } from 'react-router-dom';
import { routes } from '../../../../app/routes';

export const PlaygroundResumenEjecutivoComponents = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <HeaderContent
                    onBack={() => navigate(routes.playgroundComponents)}
                />

                <div style={{ padding: '24px' }}>
                    <Heading level={1} style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Resumen Ejecutivo Components</Heading>
                    <Text variant="body" style={{ color: '#6B7280', marginBottom: '24px' }}>
                        Components for the Resumen Ejecutivo section.
                    </Text>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Link to={routes.PLAYGROUND_RESUMEN_STAGING} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ padding: '24px', borderRadius: '12px', border: '2px solid #0076ab', backgroundColor: '#F0F9FF' }}>
                                <Text variant="body" style={{ fontWeight: 700, fontSize: '1.25rem', color: '#005a85' }}>View Full Staging Page</Text>
                                <Text variant="caption" style={{ color: '#005a85' }}>Combined view of Upper Design, Body, and Lower Design.</Text>
                            </div>
                        </Link>

                        <Link to={routes.PLAYGROUND_RESUMEN_BODY} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: 'white' }}>
                                <Text variant="body" style={{ fontWeight: 600 }}>Resumen Body</Text>
                                <Text variant="caption" style={{ color: '#6B7280' }}>The main content body for Resumen Ejecutivo articles.</Text>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};
