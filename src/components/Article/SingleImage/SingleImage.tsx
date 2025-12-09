import { useLightbox } from '../../../context/LightboxContext';
import { Text } from '../../Typography/Typography';
import type { SingleImageProps } from './types';

export const SingleImage = ({ imageUrl, caption, photo_credit }: SingleImageProps) => {
    const { openSingleImage } = useLightbox();

    return (
        <div style={{
            width: '100%',
            maxWidth: '480px',
            margin: '0 auto',
            cursor: 'pointer'
        }} onClick={() => openSingleImage(imageUrl, caption, photo_credit)}>
            {/* Container */}
            <div style={{
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                padding: '16px'
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

                {/* Caption */}
                {(caption || photo_credit) && (
                    <div style={{
                        textAlign: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)'
                    }}>
                        {caption && (
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
                        )}
                        {photo_credit && (
                            <Text variant="caption" style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.75rem'
                            }}>
                                {photo_credit}
                            </Text>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
