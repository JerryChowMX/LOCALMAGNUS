import React, { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResumenOptionCard.css';

export interface ResumenOptionCardProps {
    icon: ReactNode;
    label: string;
    href: string;
    variant?: 'light' | 'dark';
    recommended?: boolean;
}

export const ResumenOptionCard: React.FC<ResumenOptionCardProps> = ({
    icon,
    label,
    href,
    variant = 'light',
    recommended = false
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (href.startsWith('http')) {
            window.location.href = href;
        } else {
            navigate(href);
        }
    };

    return (
        <button
            className={`resumen-option-card resumen-option-card--${variant}`}
            onClick={handleClick}
        >
            {recommended && (
                <div className="resumen-option-card__ribbon">
                    RECOMENDADO
                </div>
            )}
            <div className="resumen-option-card__icon">
                {icon}
            </div>
            <div className="resumen-option-card__label">
                {label}
            </div>
        </button>
    );
};
