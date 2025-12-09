import { useState } from 'react';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

// Mock gallery images
const MOCK_IMAGES = [
    { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Mountain Sunset' },
    { id: 2, url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800', caption: 'City Skyline' },
    { id: 3, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', caption: 'Forest Path' },
    { id: 4, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Ocean Waves' },
    { id: 5, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', caption: 'Desert Landscape' },
    { id: 6, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', caption: 'Northern Lights' },
];

// Lightbox Component
const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }: any) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} onClick={onClose}>
            {/* Close Button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    zIndex: 10001
                }}
            >
                ×
            </button>

            {/* Previous Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                style={{
                    position: 'absolute',
                    left: '20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '2rem',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    zIndex: 10001
                }}
            >
                ‹
            </button>

            {/* Image */}
            <div style={{ maxWidth: '90%', maxHeight: '90%', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                <img
                    src={images[currentIndex].url}
                    alt={images[currentIndex].caption}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '80vh',
                        objectFit: 'contain'
                    }}
                />
                <p style={{ color: '#fff', marginTop: '16px', fontSize: '1rem' }}>
                    {images[currentIndex].caption} ({currentIndex + 1}/{images.length})
                </p>
            </div>

            {/* Next Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                style={{
                    position: 'absolute',
                    right: '20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '2rem',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    zIndex: 10001
                }}
            >
                ›
            </button>
        </div>
    );
};

export const PlaygroundGallery = () => {
    const navigate = useNavigate();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % MOCK_IMAGES.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + MOCK_IMAGES.length) % MOCK_IMAGES.length);
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
                            Gallery Component Variations
                        </Heading>
                        <Text variant="body" style={{
                            color: '#6B7280',
                            fontSize: '1rem',
                            lineHeight: '1.6'
                        }}>
                            Choose your preferred gallery style. Click any image to view in lightbox.
                        </Text>
                    </div>

                    {/* OPTION 1: CLEAN GRID (2 Columns) */}
                    <div style={{ marginBottom: '80px' }}>
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <Heading level={2} style={{
                                fontSize: '1.5rem',
                                marginBottom: '8px',
                                fontWeight: 700,
                                color: '#111827'
                            }}>
                                Option 1: Clean Grid
                            </Heading>
                            <Text variant="body" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                                Simple 2-column grid with rounded corners and subtle hover effect
                            </Text>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '12px'
                        }}>
                            {MOCK_IMAGES.slice(0, 4).map((img, index) => (
                                <div
                                    key={img.id}
                                    onClick={() => openLightbox(index)}
                                    style={{
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        aspectRatio: '1',
                                        position: 'relative'
                                    }}
                                >
                                    <img
                                        src={img.url}
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

                    {/* OPTION 2: MASONRY GRID (Pinterest Style) */}
                    <div style={{ marginBottom: '80px' }}>
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <Heading level={2} style={{
                                fontSize: '1.5rem',
                                marginBottom: '8px',
                                fontWeight: 700,
                                color: '#111827'
                            }}>
                                Option 2: Masonry Grid
                            </Heading>
                            <Text variant="body" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                                Pinterest-style asymmetric layout with varied heights
                            </Text>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '12px',
                            gridAutoRows: '120px'
                        }}>
                            {MOCK_IMAGES.slice(0, 6).map((img, index) => {
                                const spans = [2, 1, 2, 1, 2, 1]; // Varied heights
                                return (
                                    <div
                                        key={img.id}
                                        onClick={() => openLightbox(index)}
                                        style={{
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            gridRow: `span ${spans[index]}`,
                                            position: 'relative',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        <img
                                            src={img.url}
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
                                );
                            })}
                        </div>
                    </div>

                    {/* OPTION 3: FEATURED + GRID */}
                    <div style={{ marginBottom: '80px' }}>
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <Heading level={2} style={{
                                fontSize: '1.5rem',
                                marginBottom: '8px',
                                fontWeight: 700,
                                color: '#111827'
                            }}>
                                Option 3: Featured Hero
                            </Heading>
                            <Text variant="body" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                                Large hero image with smaller grid thumbnails below
                            </Text>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Hero Image */}
                            <div
                                onClick={() => openLightbox(0)}
                                style={{
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    aspectRatio: '16/9',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                                }}
                            >
                                <img
                                    src={MOCK_IMAGES[0].url}
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
                                        onClick={() => openLightbox(index + 1)}
                                        style={{
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            aspectRatio: '1',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        <img
                                            src={img.url}
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

                    {/* OPTION 4: OVERLAP STACK */}
                    <div style={{ marginBottom: '80px' }}>
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <Heading level={2} style={{
                                fontSize: '1.5rem',
                                marginBottom: '8px',
                                fontWeight: 700,
                                color: '#111827'
                            }}>
                                Option 4: Overlap Stack
                            </Heading>
                            <Text variant="body" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                                Modern stacked layout with overlapping cards and depth
                            </Text>
                        </div>

                        <div style={{
                            position: 'relative',
                            height: '400px',
                            width: '100%'
                        }}>
                            {MOCK_IMAGES.slice(0, 4).map((img, index) => (
                                <div
                                    key={img.id}
                                    onClick={() => openLightbox(index)}
                                    style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        width: '90%',
                                        height: '280px',
                                        left: '5%',
                                        top: `${index * 30}px`,
                                        zIndex: 4 - index,
                                        boxShadow: `0 ${8 + index * 4}px ${24 + index * 8}px rgba(0, 0, 0, ${0.15 - index * 0.03})`,
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = `translateY(-8px) scale(1.02)`;
                                        e.currentTarget.style.boxShadow = `0 16px 40px rgba(0, 0, 0, 0.2)`;
                                        e.currentTarget.style.zIndex = '10';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = `0 ${8 + index * 4}px ${24 + index * 8}px rgba(0, 0, 0, ${0.15 - index * 0.03})`;
                                        e.currentTarget.style.zIndex = `${4 - index}`;
                                    }}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.caption}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    {/* Caption Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)',
                                        padding: '20px 16px 16px',
                                        color: '#fff',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}>
                                        {img.caption}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* OPTION 5: NEWSPAPER COLLAGE */}
                    <div style={{ marginBottom: '80px' }}>
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <Heading level={2} style={{
                                fontSize: '1.5rem',
                                marginBottom: '8px',
                                fontWeight: 700,
                                color: '#111827'
                            }}>
                                Option 5: Editorial Collage
                            </Heading>
                            <Text variant="body" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                                Magazine-style asymmetric grid with mixed sizes
                            </Text>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gridTemplateRows: 'repeat(3, 120px)',
                            gap: '12px'
                        }}>
                            {/* Large featured */}
                            <div
                                onClick={() => openLightbox(0)}
                                style={{
                                    gridColumn: 'span 2',
                                    gridRow: 'span 2',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)'
                                }}
                            >
                                <img
                                    src={MOCK_IMAGES[0].url}
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

                            {/* Small images */}
                            {MOCK_IMAGES.slice(1, 6).map((img, index) => (
                                <div
                                    key={img.id}
                                    onClick={() => openLightbox(index + 1)}
                                    style={{
                                        gridColumn: index === 3 ? 'span 2' : 'span 1',
                                        gridRow: index === 3 ? 'span 1' : 'span 1',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <img
                                        src={img.url}
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
                            📸 Gallery Options Summary
                        </Heading>
                        <div style={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                            color: '#6B7280'
                        }}>
                            <strong style={{ color: '#111827', display: 'block', marginTop: '12px' }}>Option 1 - Clean Grid:</strong>
                            Simple, balanced, and easy to scan. Best for uniform content.

                            <strong style={{ color: '#111827', display: 'block', marginTop: '12px' }}>Option 2 - Masonry:</strong>
                            Dynamic Pinterest-style layout. Great for visual variety.

                            <strong style={{ color: '#111827', display: 'block', marginTop: '12px' }}>Option 3 - Featured Hero:</strong>
                            Highlights one main image. Perfect for lead photo emphasis.

                            <strong style={{ color: '#111827', display: 'block', marginTop: '12px' }}>Option 4 - Overlap Stack:</strong>
                            Modern, premium feel with depth. Eye-catching and unique.

                            <strong style={{ color: '#111827', display: 'block', marginTop: '12px' }}>Option 5 - Editorial Collage:</strong>
                            Newspaper/magazine style. Professional and space-efficient.
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <Lightbox
                    images={MOCK_IMAGES}
                    currentIndex={currentIndex}
                    onClose={closeLightbox}
                    onNext={nextImage}
                    onPrev={prevImage}
                />
            )}
        </PageWrapper>
    );
};
