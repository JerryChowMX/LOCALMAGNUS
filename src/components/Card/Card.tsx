import React from 'react';
import './Card.css';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    padding = "md"
}) => {
    const isInteractive = !!onClick;

    const getPaddingClass = (p: string) => {
        switch (p) {
            case 'sm': return '8px';
            case 'md': return '16px';
            case 'lg': return '24px';
            default: return '0';
        }
    };

    return (
        <div
            className={`card ${isInteractive ? 'card--interactive' : ''} ${className}`}
            onClick={onClick}
            style={{ padding: getPaddingClass(padding) }}
        >
            {children}
        </div>
    );
};
