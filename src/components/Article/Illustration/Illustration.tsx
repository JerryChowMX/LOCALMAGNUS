import { useLightbox } from '../../../context/LightboxContext';
import { Text } from '../../Typography/Typography';
import type { IllustrationProps } from './types';
import './Illustration.css';

export const Illustration = ({ imageUrl, caption, artist }: IllustrationProps) => {
    const { openSingleImage } = useLightbox();

    return (
        <div
            className="article-illustration-container"
            onClick={() => openSingleImage(imageUrl, caption, artist)}
        >
            {/* Image (Clean, no border) */}
            <div style={{ width: '100%', marginBottom: '16px', overflow: 'hidden' }}>
                <img
                    src={imageUrl}
                    alt={caption}
                    className="article-illustration-img"
                />
            </div>

            {/* Caption centered (No border) */}
            <div className="article-illustration-caption">
                <Text variant="caption" className="illustration-caption-text">
                    {caption}
                </Text>
                <Text variant="caption" className="illustration-artist-text">
                    {artist}
                </Text>
            </div>
        </div>
    );
};
