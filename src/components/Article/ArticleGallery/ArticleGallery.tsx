import { useLightbox, type LightboxImage } from '../../../context/LightboxContext';
import type { StrapiGalleryImage } from '../types';

interface ArticleGalleryProps {
    images: StrapiGalleryImage[];
    caption?: string;
}

export const ArticleGallery = ({ images, caption }: ArticleGalleryProps) => {
    const { openLightbox } = useLightbox();

    if (!images || images.length === 0) {
        return null;
    }

    const handleImageClick = (index: number) => {
        const lightboxImages: LightboxImage[] = images.map(img => ({
            src: img.url,
            alt: img.alt || img.caption || '',
            caption: img.caption || ''
        }));
        openLightbox(lightboxImages, index);
    };

    return (
        <>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: caption ? '8px' : '24px'
            }}>
                {images.map((img, index) => (
                    <div
                        key={img.id}
                        onClick={() => handleImageClick(index)}
                        style={{
                            cursor: 'pointer',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            aspectRatio: '1',
                            position: 'relative'
                        }}
                    >
                        <img
                            src={img.url}
                            alt={img.alt || img.caption || `Gallery image ${index + 1}`}
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
            {caption && (
                <p style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    fontStyle: 'italic',
                    marginBottom: '24px',
                    textAlign: 'center'
                }}>
                    {caption}
                </p>
            )}
        </>
    );
};
