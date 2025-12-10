import React from 'react';
import { useLightbox } from '../../context/LightboxContext';
import './ZoomableImage.css';

interface ZoomableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    caption?: string;
    zoomable?: boolean;
    fullSizeSrc?: string;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
    src,
    fullSizeSrc,
    alt,
    caption,
    zoomable = true,
    className = '',
    ...props
}) => {
    const { openSingleImage } = useLightbox();

    const handleClick = (e: React.MouseEvent) => {
        if (zoomable && src) {
            e.stopPropagation();
            openSingleImage(fullSizeSrc || src, caption, alt);
        }
        props.onClick?.(e as React.MouseEvent<HTMLImageElement, MouseEvent>);
    };

    return (
        <figure className={`zoomable-image-container ${className}`}>
            <img
                src={src}
                alt={alt}
                className={`zoomable-image ${zoomable ? 'is-zoomable' : ''}`}
                onClick={handleClick}
                {...props}
            />
            {caption && <figcaption className="zoomable-image-caption">{caption}</figcaption>}
        </figure>
    );
};
