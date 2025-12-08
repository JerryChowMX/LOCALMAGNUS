import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

export const PlaygroundResumenMainBody = () => {
    const navigate = useNavigate();

    const summaryPoints = [
        "La economía global muestra signos de recuperación lenta pero constante según el último informe del FMI.",
        "Nuevas regulaciones tecnológicas podrían impactar el desarrollo de la inteligencia artificial en Europa.",
        "El sector energético invierte cifra récord en renovables para cumplir metas de 2030.",
        "Descubrimiento médico promete revolucionar el tratamiento de enfermedades autoinmunes."
    ];

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F9FAFB', paddingBottom: '100px' }}>
                <HeaderContent
                    onBack={() => navigate(routes.PLAYGROUND_RESUMEN_EJECUTIVO_COMPONENTS)}
                />

                <div style={{ padding: '24px' }}>
                    {/* Playground Header */}
                    <div style={{ marginBottom: '40px', borderBottom: '1px solid #E5E7EB', paddingBottom: '24px' }}>
                        <Heading level={1} style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '8px', color: '#111827' }}>
                            Resumen Main Body: Magazine Card
                        </Heading>
                        <Text variant="body" style={{ color: '#6B7280', maxWidth: '600px' }}>
                            Defines the main body content structure for the Resumen Ejecutivo. This variation uses the "Magazine Card" design with side-by-side numbering and bold typography.
                        </Text>
                    </div>

                    <Heading level={2} style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: '#111827' }}>
                        Entérate en un minuto:
                    </Heading>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {summaryPoints.map((text, index) => (
                            <div key={index} style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '12px',
                                padding: '24px',
                                border: '1px solid #E5E7EB',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                <Text variant="heading-3" style={{
                                    color: '#0369A1',
                                    fontSize: '1.5rem',
                                    fontWeight: 900,
                                    margin: 0,
                                    borderBottom: '2px solid #F0F9FF',
                                    paddingBottom: '8px',
                                    width: 'fit-content'
                                }}>
                                    0{index + 1}
                                </Text>
                                <Text variant="body" style={{ fontSize: '1.25rem', lineHeight: '1.4', fontWeight: 600, color: '#1F2937', margin: 0 }}>
                                    {text}
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

