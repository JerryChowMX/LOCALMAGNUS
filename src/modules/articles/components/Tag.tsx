import React from 'react';
import './ArticlesComponents.css';

export interface TagProps {
    label: string;
    className?: string;
}

export const Tag: React.FC<TagProps> = ({ label, className = '' }) => {
    return (
        <span className={`article-tag ${className}`}>
            {label}
        </span>
    );
};
