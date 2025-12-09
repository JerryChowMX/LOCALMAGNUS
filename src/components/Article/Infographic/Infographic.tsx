import { useLightbox } from '../../../context/LightboxContext';
import { Text } from '../../Typography/Typography';
import type { InfographicProps } from './types';

export const Infographic = ({ imageUrl, caption, author }: InfographicProps) => {
    const { openSingleImage } = useLightbox();

    const handleClick = () => {
        openSingleImage(imageUrl, caption, author);
    };

    return (
        <div
            onClick={handleClick}
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                borderRadius: '0px',
                overflow: 'hidden',
                backgroundColor: '#000',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                margin: '0 auto'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 24px 70px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
            }}
        >
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

            {/* Magnus Blue Badge - Top Right */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: '#0076ab',
                padding: '8px 16px',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 118, 171, 0.4)',
                pointerEvents: 'none'
            }}>
                <Text variant="caption" style={{
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    margin: 0
                }}>
                    Infografía
                </Text>
            </div>

            {/* Bottom Gradient Overlay */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.90) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%)',
                padding: '80px 24px 24px 24px',
                pointerEvents: 'none'
            }}>
                <Text variant="body" style={{
                    color: '#ffffff',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    lineHeight: '1.5',
                    margin: 0
                }}>
                    {caption}
                </Text>
                <Text variant="caption" style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.875rem',
                    marginTop: '8px',
                    display: 'block'
                }}>
                    {author}
                </Text>
            </div>
        </div>
    );
};
