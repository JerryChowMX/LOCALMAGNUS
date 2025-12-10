import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { routes } from '../../../../app/routes';
import { useLightbox } from '../../../../context/LightboxContext';

// Mock gallery images
const MOCK_IMAGES = [
    { id: 1, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Mountain Sunset' },
    { id: 2, src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800', caption: 'City Skyline' },
    { id: 3, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', caption: 'Forest Path' },
    { id: 4, src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Ocean Waves' },
    { id: 5, src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', caption: 'Desert Landscape' },
    { id: 6, src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', caption: 'Northern Lights' },
];

export const PlaygroundGallery = () => {
    const navigate = useNavigate();
    const { openLightbox } = useLightbox();

    const handleImageClick = (index: number) => {
        // Map mock images to LightboxImage format (src, caption)
        const lightboxImages = MOCK_IMAGES.map(img => ({
            src: img.src,
            caption: img.caption,
            alt: img.caption
        }));
        openLightbox(lightboxImages, index);
    };

    return (
        <PageWrapper>
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
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
                            Featured Gallery
                        </Heading>
                        <Text variant="body" style={{
                            color: '#6B7280',
                            fontSize: '1rem',
                            lineHeight: '1.6'
                        }}>
                            Premium gallery layout with hero image and thumbnails.
                        </Text>
                    </div>

                    {/* FEATURED HERO VARIANT ONLY */}
                    <div style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Hero Image */}
                            <div
                                onClick={() => handleImageClick(0)}
                                style={{
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    aspectRatio: '16/9',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                                }}
                            >
                                <img
                                    src={MOCK_IMAGES[0].src}
                                    alt={MOCK_IMAGES[0].caption}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            </div>

                            {/* Grid Thumbnails */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '12px'
                            }}>
                                {MOCK_IMAGES.slice(1, 4).map((img, index) => (
                                    <div
                                        key={img.id}
                                        onClick={() => handleImageClick(index + 1)}
                                        style={{
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            aspectRatio: '1',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        <img
                                            src={img.src}
                                            alt={img.caption}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};
