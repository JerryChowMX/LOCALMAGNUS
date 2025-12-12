import { useState, type FC } from 'react';

interface PresentacionViewProps {
    article: any;
}

export const PresentacionView: FC<PresentacionViewProps> = ({ article }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!article.ppt_summary || !article.ppt_summary.slides || article.ppt_summary.slides.length === 0) {
        return (
            <div className="standard-article-content">
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
                    Presentación no disponible
                </p>
            </div>
        );
    }

    const slides = article.ppt_summary.slides;
    const totalSlides = slides.length;

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    return (
        <div className="standard-article-content">
            <div style={{ padding: '0 24px' }}>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <img
                        src={slides[currentSlide].image_url}
                        alt={slides[currentSlide].caption || `Slide ${currentSlide + 1}`}
                        style={{
                            width: '100%',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    />

                    {/* Slide controls */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '16px',
                        gap: '16px'
                    }}>
                        <button
                            onClick={prevSlide}
                            disabled={totalSlides <= 1}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: 'white',
                                cursor: totalSlides <= 1 ? 'not-allowed' : 'pointer',
                                opacity: totalSlides <= 1 ? 0.5 : 1
                            }}
                        >
                            ← Anterior
                        </button>

                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {currentSlide + 1} / {totalSlides}
                        </span>

                        <button
                            onClick={nextSlide}
                            disabled={totalSlides <= 1}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: 'white',
                                cursor: totalSlides <= 1 ? 'not-allowed' : 'pointer',
                                opacity: totalSlides <= 1 ? 0.5 : 1
                            }}
                        >
                            Siguiente →
                        </button>
                    </div>

                    {/* Caption */}
                    {slides[currentSlide].caption && (
                        <p style={{
                            marginTop: '12px',
                            textAlign: 'center',
                            color: 'var(--text-secondary)',
                            fontSize: '14px'
                        }}>
                            {slides[currentSlide].caption}
                        </p>
                    )}
                </div>
            </div>

            {/* Spacer for bottom sheet */}
            <div style={{ height: '100px' }}></div>
        </div>
    );
};
