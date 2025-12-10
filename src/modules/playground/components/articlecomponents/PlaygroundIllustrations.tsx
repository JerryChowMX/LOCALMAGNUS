import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';
import { Illustration } from '../../../../components/Article/Illustration/Illustration';

export const PlaygroundIllustrations = () => {
    const navigate = useNavigate();

    // Mock illustration data
    const mockIllustration = {
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        caption: 'Representación artística del crecimiento tecnológico en México',
        artist: 'Studio MAGNUS'
    };

    return (
        <PageWrapper>
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#F9FAFB',
                paddingBottom: '100px'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <HeaderContent
                        onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)}
                    />

                    <div style={{ padding: '24px' }}>
                        {/* Page Header */}
                        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                            <Heading level={1} style={{
                                fontSize: '2rem',
                                marginBottom: '12px',
                                fontFamily: '"Blinker", sans-serif',
                                fontWeight: 800
                            }}>
                                Illustrations
                            </Heading>
                            <Text variant="body" style={{
                                color: '#6B7280',
                                maxWidth: '600px',
                                margin: '0 auto',
                                fontSize: '1rem',
                                lineHeight: '1.6'
                            }}>
                                Minimalist illustration design. Image only, no visible caption or border.
                            </Text>
                        </div>

                        {/* Component Display */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '60px 24px',
                            borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}>
                            <Illustration
                                imageUrl={mockIllustration.imageUrl}
                                caption={mockIllustration.caption}
                                artist={mockIllustration.artist}
                            />
                        </div>

                        {/* Design Notes */}
                        <div style={{ marginTop: '40px', textAlign: 'center' }}>
                            <Text variant="body" style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                                Tap image to expand in Lightbox.
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
