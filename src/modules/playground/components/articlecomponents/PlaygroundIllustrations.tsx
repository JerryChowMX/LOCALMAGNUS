import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

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
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgb(245, 247, 250) 0%, rgb(255, 255, 255) 90%)'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <HeaderContent
                        onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)}
                    />

                    <div style={{ padding: '24px 24px 100px 24px' }}>
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
                                Minimalist illustration design with subtle border and centered caption.
                            </Text>
                        </div>

                        {/* Final Design */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ marginBottom: '24px', textAlign: 'center', maxWidth: '480px' }}>
                                <Heading level={2} style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '8px',
                                    fontWeight: 700,
                                    color: '#111827'
                                }}>
                                    Subtle Border
                                </Heading>
                                <Text variant="body" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                                    Thin border definition with centered caption.
                                    Understated and refined.
                                </Text>
                            </div>

                            <div style={{
                                width: '100%',
                                maxWidth: '480px'
                            }}>
                                {/* Container with minimal border */}
                                <div style={{
                                    border: '1px solid #E5E7EB',
                                    padding: '16px',
                                    backgroundColor: '#ffffff'
                                }}>
                                    {/* Image */}
                                    <div style={{
                                        width: '100%',
                                        marginBottom: '16px'
                                    }}>
                                        <img
                                            src={mockIllustration.imageUrl}
                                            alt={mockIllustration.caption}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>

                                    {/* Caption centered */}
                                    <div style={{
                                        textAlign: 'center',
                                        borderTop: '1px solid #F3F4F6',
                                        paddingTop: '12px'
                                    }}>
                                        <Text variant="caption" style={{
                                            color: '#6B7280',
                                            fontSize: '0.875rem',
                                            fontStyle: 'italic',
                                            display: 'block',
                                            marginBottom: '6px',
                                            lineHeight: '1.5'
                                        }}>
                                            {mockIllustration.caption}
                                        </Text>
                                        <Text variant="caption" style={{
                                            color: '#9CA3AF',
                                            fontSize: '0.75rem'
                                        }}>
                                            {mockIllustration.artist}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Design Notes */}
                        <div style={{
                            marginTop: '80px',
                            padding: '24px',
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB'
                        }}>
                            <Heading level={3} style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: '#111827',
                                marginBottom: '16px',
                                fontFamily: '"Blinker", sans-serif'
                            }}>
                                🎨 Design Specifications
                            </Heading>
                            <div style={{
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.875rem',
                                lineHeight: '1.6'
                            }}>
                                <strong style={{ color: '#111827' }}>Subtle Border:</strong>
                                <Text variant="caption" style={{ color: '#6B7280', display: 'block', marginTop: '4px' }}>
                                    • Thin 1px border (#E5E7EB)<br />
                                    • Minimal 16px padding<br />
                                    • White background (#ffffff)<br />
                                    • Centered caption with subtle divider<br />
                                    • Artist credit in smaller gray text<br />
                                    • Clean and contained aesthetic
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
