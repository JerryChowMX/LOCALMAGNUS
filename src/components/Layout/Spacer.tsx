import React from 'react';
import './Layout.css';

export interface SpacerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    axis?: 'vertical' | 'horizontal';
    className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({
    size = 'md',
    axis = 'vertical',
    className = ''
}) => {
    const classes = [
        'spacer',
        `spacer--${axis}`,
        `spacer--size-${size}`,
        className
    ].filter(Boolean).join(' ');

    return <div className={classes} aria-hidden="true" />;
};
