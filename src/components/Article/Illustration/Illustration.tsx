import { Text } from '../../Typography/Typography';
import type { IllustrationProps } from './types';

export const Illustration = ({ imageUrl, caption, artist }: IllustrationProps) => {
    return (
        <div style={{
            width: '100%',
            maxWidth: '480px',
            margin: '0 auto'
        }}>
            {/* Container with minimal border */}
            <div style={{
                border: '1px solid #E5E7EB',
                padding: '16px',
                backgroundColor: '#ffffff'
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
                    borderTop: '1px solid #F3F4F6',
                    paddingTop: '12px'
                }}>
                    <Text variant="caption" style={{
                        color: '#6B7280',
                        fontSize: '0.875rem',
                        fontStyle: 'italic',
                        display: 'block',
                        marginBottom: '6px',
                        lineHeight: '1.5'
                    }}>
                        {caption}
                    </Text>
                    <Text variant="caption" style={{
                        color: '#9CA3AF',
                        fontSize: '0.75rem'
                    }}>
                        {artist}
                    </Text>
                </div>
            </div>
        </div>
    );
};
