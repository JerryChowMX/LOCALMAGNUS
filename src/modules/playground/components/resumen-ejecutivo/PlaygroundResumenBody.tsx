import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate, Link } from 'react-router-dom';
import { routes } from '../../../../app/routes';

export const PlaygroundResumenBody = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <HeaderContent
                    onBack={() => navigate(routes.PLAYGROUND_RESUMEN_EJECUTIVO_COMPONENTS)}
                />

                <div style={{ padding: '24px' }}>
                    <Heading level={1} style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Resumen Body</Heading>
                    <Text variant="body" style={{ color: '#6B7280', marginBottom: '24px' }}>
                        This is a placeholder for the Resumen Body component.
                    </Text>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Link to={routes.PLAYGROUND_RESUMEN_UPPER_DESIGN} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: 'white' }}>
                                <Text variant="body" style={{ fontWeight: 600 }}>Upper Design</Text>
                                <Text variant="caption" style={{ color: '#6B7280' }}>Design and layout components for the upper section.</Text>
                            </div>
                        </Link>

                        <Link to={routes.PLAYGROUND_RESUMEN_MAIN_BODY} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: 'white' }}>
                                <Text variant="body" style={{ fontWeight: 600 }}>Body</Text>
                                <Text variant="caption" style={{ color: '#6B7280' }}>Design and layout components for the body section.</Text>
                            </div>
                        </Link>

                        <Link to={routes.PLAYGROUND_RESUMEN_LOWER_DESIGN} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: 'white' }}>
                                <Text variant="body" style={{ fontWeight: 600 }}>Lower Design</Text>
                                <Text variant="caption" style={{ color: '#6B7280' }}>Design and layout components for the lower section.</Text>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};
