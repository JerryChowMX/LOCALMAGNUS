import React from 'react';
import './Divider.css';

export interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    children?: React.ReactNode;
}

export const Divider: React.FC<DividerProps> = ({
    orientation = 'horizontal',
    className = '',
    children
}) => {
    if (children && orientation === 'horizontal') {
        return (
            <div className={`divider-with-text ${className}`}>
                <hr className="divider-line" />
                <span className="divider-text">{children}</span>
                <hr className="divider-line" />
            </div>
        );
    }

    return (
        <hr className={`divider divider--${orientation} ${className}`} />
    );
};
