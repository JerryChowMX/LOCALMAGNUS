import React, { useState, type TouchEvent } from 'react';
import './ImageSlider.css';
import { ZoomableImage } from './ZoomableImage';

interface ImageSliderImage {
    src: string;
    alt?: string;
    caption?: string;
    fullSizeSrc?: string;
}

interface ImageSliderProps {
    images: ImageSliderImage[];
    aspectRatio?: string;
    className?: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
    images,
    aspectRatio = '4/3',
    className = ''
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // For auto-play or just staying consistent, we could add a timer, but manual is requested.

    // Minimum swipe distance (in px) 
    const minSwipeDistance = 50;

    const onTouchStart = (e: TouchEvent) => {
        setTouchEnd(null); // Reset touch end
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (!images || images.length === 0) return null;

    return (
        <div
            className={`image-slider-container ${className}`}
            style={{ aspectRatio }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div
                className="image-slider-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div className="image-slider-slide" key={index}>
                        <ZoomableImage
                            src={image.src}
                            alt={image.alt || `Slide ${index + 1}`}
                            fullSizeSrc={image.fullSizeSrc || image.src}
                            caption={image.caption}
                            zoomable={true}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows - Only show if > 1 image */}
            {images.length > 1 && (
                <>
                    <button
                        className="image-slider-arrow prev"
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        aria-label="Previous slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button
                        className="image-slider-arrow next"
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        aria-label="Next slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>

                    {/* Dots Indicator */}
                    <div className="image-slider-dots">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`image-slider-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
