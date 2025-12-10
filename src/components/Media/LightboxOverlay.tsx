import React, { useState, useEffect, useRef } from 'react';
import { useLightbox } from '../../context/LightboxContext';
import { Icons } from '../Icons';
import './LightboxOverlay.css';

export const LightboxOverlay: React.FC = () => {
    const { isOpen, currentImage, closeLightbox, nextImage, prevImage, images } = useLightbox();
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const requestRef = useRef<number>();

    // Reset state when opening new image
    useEffect(() => {
        if (isOpen) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isOpen, currentImage]);

    // Handle Keyboard events (ESC, Left, Right)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeLightbox, nextImage, prevImage]);

    if (!isOpen || !currentImage) return null;

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        const delta = e.deltaY * -0.01;
        const newScale = Math.min(Math.max(1, scale + delta), 4); // Max zoom 4x, Min 1x
        setScale(newScale);

        // Reset position if zoomed out
        if (newScale === 1) setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
            e.preventDefault(); // Prevent default drag behavior
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            // Persist event values since we're using them in a callback
            const clientX = e.clientX;
            const clientY = e.clientY;

            if (requestRef.current) return; // Skip if a frame is already pending

            requestRef.current = requestAnimationFrame(() => {
                setPosition({
                    x: clientX - dragStart.current.x,
                    y: clientY - dragStart.current.y
                });
                requestRef.current = undefined;
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = undefined;
        }
    };

    const handleDoubleClick = () => {
        if (scale > 1) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        } else {
            setScale(2); // Double click to 2x zoom
        }
    };

    const hasMultipleImages = images.length > 1;

    return (
        <div className="lightbox-backdrop" onClick={closeLightbox}>
            <div className="lightbox-controls">
                <button className="lightbox-close-btn" onClick={closeLightbox} aria-label="Close">
                    <Icons.x size={32} />
                </button>
            </div>

            {hasMultipleImages && (
                <>
                    <button
                        className="lightbox-nav-btn prev"
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    >
                        <Icons.chevronLeft size={32} />
                    </button>
                    <button
                        className="lightbox-nav-btn next"
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    >
                        <Icons.chevronRight size={32} />
                    </button>
                </>
            )}

            <div
                className="lightbox-content"
                onWheel={handleWheel}
            >
                <div
                    className="lightbox-image-wrapper"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onDoubleClick={handleDoubleClick}
                >
                    <img
                        ref={imageRef}
                        src={currentImage.src}
                        alt={currentImage.alt || ''}
                        className="lightbox-image"
                        draggable={false}
                    />
                </div>
            </div>

            {currentImage.caption && (
                <div className="lightbox-caption" onClick={(e) => e.stopPropagation()}>
                    {currentImage.caption}
                    {hasMultipleImages && ` (${images.indexOf(currentImage) + 1} / ${images.length})`}
                </div>
            )}
        </div>
    );
};
