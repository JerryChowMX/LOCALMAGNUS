import React from 'react';
import './Layout.css';

export interface GridProps {
    children: React.ReactNode;
    className?: string;
    columns?: 1 | 2 | 3 | 4 | 12;
    gap?: "sm" | "md" | "lg";
}

export const Grid: React.FC<GridProps> = ({
    children,
    className,
    columns = 1,
    gap = "md"
}) => {
    return (
        <div className={`grid grid--cols-${columns} grid--gap-${gap} ${className || ''}`}>
            {children}
        </div>
    );
};
