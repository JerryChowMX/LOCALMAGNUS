import { useState, useEffect, type FC } from 'react';
import type { Article } from '../../types';
import './FormatViews.css';

interface InfografiaProps {
    article: Article['attributes'];
}

export const Infografia: FC<InfografiaProps> = ({ article }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const imageUrl = article.infographic_summary?.image_url || article.image?.url || '';

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => {
        setScale(prev => {
            const newScale = Math.max(prev - 0.5, 1);
            if (newScale === 1) setPosition({ x: 0, y: 0 });
            return newScale;
        });
    };
    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        e.deltaY < 0 ? handleZoomIn() : handleZoomOut();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            e.preventDefault();
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (!isOpen) handleReset();
    }, [isOpen]);

    if (!imageUrl) {
        return (
            <div className="article-format-view-container standard-article-content">
                <p className="article-format-empty">Infografía no disponible</p>
            </div>
        );
    }

    return (
        <div className="article-format-view-container standard-article-content">
            {/* Preview Card */}
            <div className="infografia-preview" onClick={() => setIsOpen(true)}>
                <img src={imageUrl} alt="Infographic Preview" className="infografia-preview-image" />
                <div className="infografia-expand-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                </div>
            </div>

            {/* Lightbox */}
            {isOpen && (
                <div className="infografia-lightbox" onClick={() => setIsOpen(false)}>
                    {/* Close Button */}
                    <button className="infografia-close-btn" onClick={() => setIsOpen(false)}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {/* Zoom Controls */}
                    <div className="infografia-zoom-controls">
                        <button onClick={(e) => { e.stopPropagation(); handleZoomIn(); }} className="infografia-zoom-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="infografia-zoom-btn infografia-zoom-reset">1x</button>
                        <button onClick={(e) => { e.stopPropagation(); handleZoomOut(); }} className="infografia-zoom-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>
                    </div>

                    {/* Image Container */}
                    <div
                        className="infografia-image-container"
                        onClick={(e) => e.stopPropagation()}
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                    >
                        <img
                            src={imageUrl}
                            alt="Full Infographic"
                            className="infografia-full-image"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                            }}
                        />
                    </div>

                    {/* Actions */}
                    <div className="infografia-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="infografia-download-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Descargar en HD
                        </button>
                        <button className="infografia-share-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Spacer */}
            <div style={{ height: '100px' }} />
        </div>
    );
};
