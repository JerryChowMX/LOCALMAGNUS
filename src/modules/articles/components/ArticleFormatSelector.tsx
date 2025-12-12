import { useEffect, useRef, type FC } from 'react';
import './ArticleFormatSelector.css';

export type ArticleFormatId = 'nota-original' | 'video' | 'podcast' | 'presentacion' | 'infografia';

interface ArticleFormatSelectorProps {
    activeFormat: ArticleFormatId;
    publishedFormats: string[];
    onFormatChange: (format: ArticleFormatId) => void;
    label?: string;
}

export const ArticleFormatSelector: FC<ArticleFormatSelectorProps> = ({
    activeFormat,
    publishedFormats,
    onFormatChange,
    label = 'Elige un formato para consumir esta noticia:'
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const formats: { id: ArticleFormatId; label: string }[] = [
        { id: 'nota-original', label: 'Texto' },
        { id: 'video', label: 'Video' },
        { id: 'podcast', label: 'Podcast' },
        { id: 'presentacion', label: 'Presentación' },
        { id: 'infografia', label: 'Infografía' }
    ];

    // Equalize button widths after render
    useEffect(() => {
        if (!containerRef.current) return;
        const buttons = containerRef.current.querySelectorAll('.article-format-tab');
        if (buttons.length === 0) return;

        buttons.forEach((button) => { (button as HTMLElement).style.width = 'auto'; });
        let maxWidth = 0;
        buttons.forEach((button) => {
            const width = button.getBoundingClientRect().width;
            if (width > maxWidth) maxWidth = width;
        });
        buttons.forEach((button) => {
            (button as HTMLElement).style.width = `${Math.ceil(maxWidth) + 1}px`;
        });
    }, [publishedFormats, activeFormat]);

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    return (
        <div className="article-format-selector-section">
            <div className="article-format-divider" />

            {label && <p className="article-format-label">{label}</p>}

            <div className="article-format-nav-wrapper">
                <button
                    className="article-format-nav-button prev"
                    onClick={scrollLeft}
                    aria-label="Scroll left"
                    type="button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <div ref={containerRef} className="article-format-tabs-container">
                    {formats.map(format => {
                        if (!publishedFormats.includes(format.id)) return null;
                        const isActive = activeFormat === format.id;
                        return (
                            <button
                                key={format.id}
                                className={`article-format-tab ${isActive ? 'active' : 'inactive'}`}
                                onClick={() => onFormatChange(format.id)}
                                type="button"
                            >
                                {format.label}
                            </button>
                        );
                    })}
                </div>

                <button
                    className="article-format-nav-button next"
                    onClick={scrollRight}
                    aria-label="Scroll right"
                    type="button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>

            <div className="article-format-divider" />
        </div>
    );
};
