import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
    variant?: 'text' | 'card' | 'image' | 'avatar' | 'button';
    width?: string;
    height?: string;
    aspectRatio?: string;
    className?: string;
}

/**
 * Skeleton loader component for showing loading states
 * Follows design system specifications from DESIGN_SYSTEM.md
 */
export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width = '100%',
    height,
    aspectRatio,
    className = '',
}) => {
    const getDefaultHeight = () => {
        switch (variant) {
            case 'text':
                return '1em';
            case 'button':
                return '44px';
            case 'avatar':
                return '48px';
            case 'card':
                return '200px';
            case 'image':
                return aspectRatio ? 'auto' : '200px';
            default:
                return '1em';
        }
    };

    const getDefaultWidth = () => {
        if (variant === 'avatar') return '48px';
        if (variant === 'button') return '120px';
        return width;
    };

    const style: React.CSSProperties = {
        width: getDefaultWidth(),
        height: height || getDefaultHeight(),
        ...(aspectRatio && { aspectRatio }),
    };

    return (
        <div
            className={`skeleton skeleton--${variant} ${className}`}
            style={style}
            aria-busy="true"
            aria-label="Cargando..."
        />
    );
};

// Convenience components for common skeleton patterns
export const SkeletonText: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton variant="text" {...props} />
);

export const SkeletonCard: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton variant="card" {...props} />
);

export const SkeletonImage: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton variant="image" {...props} />
);

export const SkeletonAvatar: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton variant="avatar" {...props} />
);

export const SkeletonButton: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton variant="button" {...props} />
);
