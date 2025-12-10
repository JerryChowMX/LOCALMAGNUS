import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';
import { Infographic } from '../../../../components/Article/Infographic';

export const PlaygroundInfographics = () => {
    const navigate = useNavigate();

    // Mock infographic data
    const mockInfographic = {
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=1200&fit=crop',
        caption: 'Estadísticas de crecimiento económico en México 2025',
        author: 'Equipo de Datos Magnus'
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
                                Infographics
                            </Heading>
                            <Text variant="body" style={{
                                color: '#6B7280',
                                maxWidth: '600px',
                                margin: '0 auto',
                                fontSize: '1rem',
                                lineHeight: '1.6'
                            }}>
                                Interactive infographic with Magnus Blue badge accent.
                                Click to view fullscreen with zoom capabilities.
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
                                    Top-Right Badge
                                </Heading>
                                <Text variant="body" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                                    Magnus Blue badge in top-right corner with bottom gradient overlay.
                                    Click anywhere on the infographic to expand.
                                </Text>
                            </div>

                            <Infographic
                                imageUrl={mockInfographic.imageUrl}
                                caption={mockInfographic.caption}
                                author={mockInfographic.author}
                            />
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
                                📊 Design Specifications
                            </Heading>
                            <div style={{
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.875rem',
                                lineHeight: '1.6'
                            }}>
                                <strong style={{ color: '#111827' }}>Top-Right Badge Design:</strong>
                                <Text variant="caption" style={{ color: '#6B7280', display: 'block', marginTop: '4px' }}>
                                    • Magnus Blue (#0076ab) badge in top-right corner<br />
                                    • Rounded (6px) with elevated drop shadow<br />
                                    • Bottom gradient overlay (90% to 50% to transparent)<br />
                                    • Caption and author only (no date)<br />
                                    • Edge-to-edge image presentation<br />
                                    • <strong>Click to expand in lightbox</strong> with zoom/pan capabilities<br />
                                    • Hover effect for visual feedback<br />
                                    • Perfect for article context
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
