import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

export const PlaygroundSingleImage = () => {
    const navigate = useNavigate();

    // Mock image data
    const mockImage = {
        imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
        caption: 'Vista panorámica del centro financiero de la Ciudad de México al atardecer',
        photo_credit: 'Fotografía: Carlos Mendoza / MAGNUS'
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
                                Single Image
                            </Heading>
                            <Text variant="body" style={{
                                color: '#6B7280',
                                maxWidth: '600px',
                                margin: '0 auto',
                                fontSize: '1rem',
                                lineHeight: '1.6'
                            }}>
                                Photo and image display with clean border and integrated caption.
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
                                    Standard Border
                                </Heading>
                                <Text variant="body" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                                    Clean border with integrated caption.
                                    Professional and contained.
                                </Text>
                            </div>

                            <div style={{
                                width: '100%',
                                maxWidth: '480px'
                            }}>
                                {/* Container */}
                                <div style={{
                                    border: '1px solid #E5E7EB',
                                    backgroundColor: '#ffffff',
                                    padding: '16px'
                                }}>
                                    {/* Image */}
                                    <div style={{
                                        width: '100%',
                                        marginBottom: '16px'
                                    }}>
                                        <img
                                            src={mockImage.imageUrl}
                                            alt={mockImage.caption}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>

                                    {/* Caption */}
                                    <div style={{
                                        textAlign: 'center',
                                        paddingTop: '12px',
                                        borderTop: '1px solid #F3F4F6'
                                    }}>
                                        <Text variant="caption" style={{
                                            color: '#6B7280',
                                            fontSize: '0.875rem',
                                            fontStyle: 'italic',
                                            display: 'block',
                                            marginBottom: '6px',
                                            lineHeight: '1.5'
                                        }}>
                                            {mockImage.caption}
                                        </Text>
                                        <Text variant="caption" style={{
                                            color: '#9CA3AF',
                                            fontSize: '0.75rem'
                                        }}>
                                            {mockImage.photo_credit}
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
                                📸 Design Specifications
                            </Heading>
                            <div style={{
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.875rem',
                                lineHeight: '1.6'
                            }}>
                                <strong style={{ color: '#111827' }}>Standard Border:</strong>
                                <Text variant="caption" style={{ color: '#6B7280', display: 'block', marginTop: '4px' }}>
                                    • 1px border (#E5E7EB) with 16px padding<br />
                                    • White background (#ffffff)<br />
                                    • Centered caption with divider line<br />
                                    • Photo credit in smaller gray text<br />
                                    • Professional and contained presentation
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
