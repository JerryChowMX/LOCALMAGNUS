import { useLightbox, type LightboxImage } from '../../../context/LightboxContext';
import type { StrapiGalleryImage } from '../types';
import './ArticleGallery.css';

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

    const heroImage = images[0];
    const thumbnails = images.slice(1);

    return (
        <>
            <div className={`article-gallery-container ${caption ? 'with-caption' : ''}`}>
                {/* Hero Image (First Image) */}
                <div
                    className="gallery-hero"
                    onClick={() => handleImageClick(0)}
                >
                    <img
                        src={heroImage.url}
                        alt={heroImage.alt || heroImage.caption || 'Gallery hero'}
                        className="gallery-hero-img"
                    />
                </div>

                {/* Grid Thumbnails (Remaining Images) */}
                {thumbnails.length > 0 && (
                    <div className="gallery-thumbnails">
                        {thumbnails.map((img, index) => (
                            <div
                                key={img.id}
                                className="gallery-thumbnail"
                                onClick={() => handleImageClick(index + 1)} // Index 0 is hero, so thumbs start at 1
                            >
                                <img
                                    src={img.url}
                                    alt={img.alt || img.caption || `Gallery image ${index + 2}`}
                                    className="gallery-thumbnail-img"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {caption && (
                <p className="gallery-caption">
                    {caption}
                </p>
            )}
        </>
    );
};
