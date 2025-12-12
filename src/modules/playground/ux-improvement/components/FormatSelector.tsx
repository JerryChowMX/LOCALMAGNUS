import { useEffect, useRef, type FC } from 'react';
import './FormatSelector.css';

interface FormatSelectorProps {
    activeFormat: 'nota-original' | 'video' | 'podcast' | 'presentacion' | 'infografia';
    publishedFormats: string[];
    onFormatChange: (format: string) => void;
}

export const FormatSelector: FC<FormatSelectorProps> = ({
    activeFormat,
    publishedFormats,
    onFormatChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const formats = [
        { id: 'nota-original', label: 'Nota Original' },
        { id: 'video', label: 'Video' },
        { id: 'podcast', label: 'Podcast' },
        { id: 'presentacion', label: 'Presentación' },
        { id: 'infografia', label: 'Infografía' }
    ];

    // Equalize button widths after render
    useEffect(() => {
        if (!containerRef.current) return;

        const buttons = containerRef.current.querySelectorAll('.format-button');
        if (buttons.length === 0) return;

        // Reset widths to auto to measure natural width
        buttons.forEach((button) => {
            (button as HTMLElement).style.width = 'auto';
        });

        // Find the maximum width
        let maxWidth = 0;
        buttons.forEach((button) => {
            const width = button.getBoundingClientRect().width;
            if (width > maxWidth) {
                maxWidth = width;
            }
        });

        // Apply max width to all buttons
        buttons.forEach((button) => {
            (button as HTMLElement).style.width = `${maxWidth}px`;
        });
    }, [publishedFormats, activeFormat]); // Re-run when formats change

    return (
        <div ref={containerRef} className="format-selector">
            {formats.map(format => {
                // HIDE if format is not published (unpublished = hidden completely)
                if (!publishedFormats.includes(format.id)) {
                    return null;
                }

                const isActive = activeFormat === format.id;

                return (
                    <button
                        key={format.id}
                        className={`format-button ${isActive ? 'active' : 'inactive'}`}
                        onClick={() => onFormatChange(format.id as any)}
                    >
                        {format.label}
                    </button>
                );
            })}
        </div>
    );
};
