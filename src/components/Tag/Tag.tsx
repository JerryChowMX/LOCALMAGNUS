import React from 'react';
import './Tag.css';

export interface TagProps {
    label: string;
    variant?: 'default' | 'accent' | 'outline';
    className?: string;
}

export const Tag: React.FC<TagProps> = ({
    label,
    variant = 'default',
    className = ''
}) => {
    return (
        <span className={`tag tag--${variant} ${className}`}>
            {label}
        </span>
    );
};
