import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

export const PlaygroundResumenLowerDesign = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <HeaderContent
                    onBack={() => navigate(routes.PLAYGROUND_RESUMEN_BODY)}
                />

                <div style={{ padding: '24px' }}>

                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                        {/* Heading */}
                        <Text
                            variant="body"
                            style={{
                                fontWeight: 700,
                                color: '#9CA3AF',
                                marginBottom: '16px',
                                fontSize: '1.125rem'
                            }}
                        >
                            Lee la nota completa:
                        </Text>

                        {/* Image Placeholder Card */}
                        <div style={{
                            width: '100%',
                            aspectRatio: '4/3',
                            backgroundColor: '#Cacc5c', // Olive green from image
                            borderRadius: '24px',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text variant="caption" style={{ color: '#111827', fontWeight: 500 }}>
                                (Image placeholder)
                            </Text>
                        </div>

                        {/* Article Title */}
                        <Heading
                            level={2}
                            style={{
                                fontSize: '2rem',
                                fontWeight: 800,
                                color: '#111827',
                                lineHeight: '1.2'
                            }}
                        >
                            Article title
                        </Heading>

                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};
