import { useLightbox } from '../../../context/LightboxContext';
import { Text } from '../../Typography/Typography';
import type { IllustrationProps } from './types';

export const Illustration = ({ imageUrl, caption, artist }: IllustrationProps) => {
    const { openSingleImage } = useLightbox();

    return (
        <div style={{
            width: '100%',
            maxWidth: '480px',
            margin: '0 auto',
            cursor: 'pointer'
        }} onClick={() => openSingleImage(imageUrl, caption, artist)}>
            {/* Container with minimal border */}
            <div style={{
                border: '1px solid var(--border-color)',
                padding: '16px',
                backgroundColor: 'var(--bg-surface)'
            }}>
                {/* Image */}
                <div style={{
                    width: '100%',
                    marginBottom: '16px'
                }}>
                    <img
                        src={imageUrl}
                        alt={caption}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                {/* Caption centered */}
                <div style={{
                    textAlign: 'center',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '12px'
                }}>
                    <Text variant="caption" style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        fontStyle: 'italic',
                        display: 'block',
                        marginBottom: '6px',
                        lineHeight: '1.5'
                    }}>
                        {caption}
                    </Text>
                    <Text variant="caption" style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem'
                    }}>
                        {artist}
                    </Text>
                </div>
            </div>
        </div>
    );
};
