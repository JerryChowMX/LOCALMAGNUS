import { Text } from '../../Typography/Typography';
import type { SingleImageProps } from './types';

export const SingleImage = ({ imageUrl, caption, photo_credit }: SingleImageProps) => {
    return (
        <div style={{
            width: '100%',
            maxWidth: '480px',
            margin: '0 auto'
        }}>
            {/* Container */}
            <div style={{
                border: '1px solid #E5E7EB',
                backgroundColor: '#ffffff',
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
                <div style={{
                    textAlign: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid #F3F4F6'
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
                        {photo_credit}
                    </Text>
                </div>
            </div>
        </div>
    );
};
