import { useLightbox } from '../../../context/LightboxContext';
import type { SingleImageProps } from './types';
import './SingleImage.css';

export const SingleImage = ({ imageUrl, caption, photo_credit }: SingleImageProps) => {
    const { openSingleImage } = useLightbox();

    const lightboxCaption = photo_credit ? `${caption} (${photo_credit})` : caption;

    return (
        <div
            className="single-image-container"
            onClick={() => openSingleImage(imageUrl, lightboxCaption, photo_credit)}
        >
            <img
                src={imageUrl}
                alt={caption}
                className="single-image-img"
            />
        </div>
    );
};
