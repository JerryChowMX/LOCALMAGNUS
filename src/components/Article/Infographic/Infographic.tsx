import { useLightbox } from '../../../context/LightboxContext';
import { IconZoomIn } from '@tabler/icons-react';
import type { InfographicProps } from './types';
import './Infographic.css';

export const Infographic = ({ imageUrl, caption, author }: InfographicProps) => {
    const { openSingleImage } = useLightbox();

    const handleClick = () => {
        openSingleImage(imageUrl, caption, author);
    };

    return (
        <div
            onClick={handleClick}
            className="infographic-container"
        >
            {/* Image Section */}
            <div className="infographic-image-wrapper">
                <img
                    src={imageUrl}
                    alt={caption}
                    className="infographic-image"
                />

                {/* Overlay Icon on Hover */}
                <div className="infographic-overlay">
                    <div className="infographic-zoom-icon">
                        <IconZoomIn size={24} />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="infographic-content">
                <span className="infographic-label">
                    Infografía
                </span>

                <div className="infographic-caption">
                    {caption}
                </div>

                {author && (
                    <div className="infographic-author">
                        Por {author}
                    </div>
                )}
            </div>
        </div>
    );
};
