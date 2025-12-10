import React from 'react';
import { Icons } from '../Icons';
import './SocialButton.css';

export interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    provider: 'google' | 'apple';
}

export const SocialButton: React.FC<SocialButtonProps> = ({
    provider,
    className,
    onClick,
    ...props
}) => {
    const Icon = provider === 'google' ? Icons.google : Icons.apple;
    const label = provider === 'google' ? 'Continúa con Google' : 'Continúa con Apple';

    return (
        <button
            type="button"
            className={`social-button social-button--${provider} ${className || ''}`}
            onClick={onClick}
            {...props}
        >
            <Icon size={24} className="social-button__icon" />
            <span className="social-button__label">{label}</span>
        </button>
    );
};
