import { useRef, type FC } from 'react';
import './ArticleFormatSelector.css';

export type ArticleFormatId = 'nota-original' | 'video' | 'podcast' | 'presentacion' | 'infografia';

interface ArticleFormatSelectorProps {
    activeFormat: ArticleFormatId;
    publishedFormats: string[];
    onFormatChange: (format: ArticleFormatId) => void;
}

export const ArticleFormatSelector: FC<ArticleFormatSelectorProps> = ({
    activeFormat,
    publishedFormats,
    onFormatChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const formats: { id: ArticleFormatId; label: string }[] = [
        { id: 'nota-original', label: 'Texto' },
        { id: 'video', label: 'Video' },
        { id: 'podcast', label: 'Podcast' },
        { id: 'presentacion', label: 'Presentación' },
        { id: 'infografia', label: 'Infografía' }
    ];

    return (
        <div className="article-format-selector-section">

            <div className="article-format-nav-wrapper">
                <div ref={containerRef} className="article-format-tabs-container">
                    {formats.filter(f => publishedFormats.includes(f.id)).map((format, index, arr) => {
                        const isActive = activeFormat === format.id;
                        return (
                            <div key={format.id} style={{ display: 'flex', alignItems: 'center' }}>
                                <button
                                    className={`article-format-tab ${isActive ? 'active' : 'inactive'}`}
                                    onClick={() => onFormatChange(format.id)}
                                    type="button"
                                >
                                    {format.label}
                                </button>
                                {/* Add divider if not the last item */}
                                {index < arr.length - 1 && (
                                    <div className="article-format-tab-divider" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="article-format-divider" />
        </div >
    );
};
