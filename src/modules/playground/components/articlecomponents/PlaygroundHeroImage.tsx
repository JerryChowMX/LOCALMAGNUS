import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';

import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

export const PlaygroundHeroImage = () => {
    const navigate = useNavigate();

    // Mock Article Data
    const articleData = {
        title: 'México alcanza acuerdo histórico en comercio',
        kicker: 'ECONOMÍA GLOBAL',
        date: '09 DICIEMBRE 2025',
        author: 'Roberto Hernández',
        readingTime: '5 min',
        image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=1600&h=1200&fit=crop',
        abstract: 'El centro financiero de la Ciudad de México se ilumina mientras se anuncia el acuerdo comercial que definirá el futuro económico de la región.',
        credit: 'FOTOGRAFÍA: CARLOS MENDOZA / MAGNUS'
    };

    return (
        <PageWrapper>
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#111827',
                paddingBottom: '100px'
            }}>

                {/* Navigation Header */}
                <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #374151' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <HeaderContent onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)} />
                    </div>
                </div>

                <div style={{ width: '100%' }}>

                    <div style={{ textAlign: 'center', marginBottom: '60px', color: '#fff' }}>
                        <Heading level={1} style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#fff' }}>
                            Article Header Design
                        </Heading>
                        <Text variant="body" style={{ color: '#9CA3AF' }}>
                            Premium header with clean typography and seamless image blend.
                        </Text>
                    </div>

                    {/* OPTION 1: The Unified Header */}
                    <div style={{ marginBottom: '100px' }}>
                        <div style={{ marginBottom: '20px', color: '#fff' }}>
                            <Heading level={2} style={{ fontSize: '1.25rem', color: '#34D399' }}>1. The Unified Header</Heading>
                            <Text variant="caption" style={{ color: '#9CA3AF' }}>Clean header blending seamlessly into image below.</Text>
                        </div>

                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '0',
                            overflow: 'hidden',
                            maxWidth: '680px',
                            margin: '0 auto'
                        }}>
                            {/* Top Section with Content */}
                            <div style={{ padding: '60px 40px 40px 40px', backgroundColor: '#fff', textAlign: 'center' }}>
                                {/* Date */}
                                <Text variant="caption" style={{
                                    color: '#6B7280',
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                    marginBottom: '16px',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em'
                                }}>
                                    {articleData.date}
                                </Text>

                                {/* Title */}
                                <Heading level={1} style={{
                                    fontSize: '3rem',
                                    lineHeight: '1.1',
                                    color: '#000',
                                    marginBottom: '24px',
                                    fontFamily: '"Blinker", sans-serif',
                                    maxWidth: '900px',
                                    margin: '0 auto 24px auto'
                                }}>
                                    {articleData.title}
                                </Heading>

                                {/* Summary/Dek */}
                                <Text variant="body" style={{
                                    color: '#4B5563',
                                    marginBottom: '32px',
                                    fontSize: '1.125rem',
                                    lineHeight: '1.6',
                                    maxWidth: '700px',
                                    margin: '0 auto 32px auto'
                                }}>
                                    {articleData.abstract}
                                </Text>


                            </div>

                            {/* Image with Gradient Blend */}
                            <div style={{
                                width: '100%',
                                height: '600px',
                                position: 'relative'
                            }}>
                                <img
                                    src={articleData.image}
                                    alt={articleData.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />

                                {/* Gradient Overlay from White to Transparent */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0,
                                    height: '150px',
                                    background: 'linear-gradient(to bottom, #fff 0%, transparent 100%)'
                                }}></div>


                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </PageWrapper>
    );
};
