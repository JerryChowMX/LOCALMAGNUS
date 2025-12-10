import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

export const PlaygroundResumenUpperDesign = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <HeaderContent
                    onBack={() => navigate(routes.PLAYGROUND_RESUMEN_BODY)}
                />

                <div style={{ padding: '24px' }}>

                    {/* Upper Design Container */}
                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        backgroundColor: 'white',
                        padding: '40px 24px',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB'
                    }}>

                        {/* Date */}
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <Text
                                variant="caption"
                                style={{
                                    textTransform: 'uppercase',
                                    color: '#9CA3AF',
                                    fontWeight: 600,
                                    letterSpacing: '0.05em'
                                }}
                            >
                                8 de diciembre de 2025
                            </Text>
                        </div>

                        {/* Title */}
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <Heading
                                level={1}
                                style={{
                                    fontSize: '2.25rem',
                                    lineHeight: '1.2',
                                    fontWeight: 800,
                                    color: '#111827'
                                }}
                            >
                                Saltillo Amanece con Nueva Propuesta de Movilidad Sostenible
                            </Heading>
                        </div>

                        {/* Dek */}
                        <div style={{ textAlign: 'center', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
                            <Text
                                variant="body"
                                style={{
                                    fontSize: '1.125rem',
                                    color: '#6B7280',
                                    lineHeight: '1.6'
                                }}
                            >
                                El Ayuntamiento presenta un plan para transformar el transporte urbano durante la próxima década
                            </Text>
                        </div>

                        {/* Hero Image */}
                        <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
                            <img
                                src="/brain/90b14cc2-0644-4f54-b312-c8cf448dbf2f/saltillo_bus_hero_1765213173257.png"
                                alt="Saltillo Bus"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />
                        </div>

                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};
