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

    return (
        <div
            className={`card card--padding-${padding} ${isInteractive ? 'card--interactive' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

