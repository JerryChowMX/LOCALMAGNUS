import React from 'react';
import './FormatCard.css';

export interface FormatCardProps {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    className?: string;
}

export const FormatCard: React.FC<FormatCardProps> = ({
    label,
    icon,
    onClick,
    className = ''
}) => {
    return (
        <div className={`format-card ${className}`} onClick={onClick}>
            <div className="format-card__icon">{icon}</div>
            <div className="format-card__label">{label}</div>
        </div>
    );
};
