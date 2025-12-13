/**
 * @DEAD_CODE: UNUSED_COMPONENT - Identified 2025-12-12
 * This component is not imported anywhere in the codebase.
 * Appears to be early scaffolding that was never integrated.
 * Safe to delete after confirmation.
 */
import React from 'react';
import './ScreenHeader.css';

export interface ScreenHeaderProps {
    title: string;
    onBack?: () => void;
    actions?: React.ReactNode;
    className?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
    title,
    onBack,
    actions,
    className = ''
}) => {
    return (
        <header className={`screen-header ${onBack ? 'screen-header--with-back' : ''} ${className}`}>
            {onBack && (
                <button onClick={onBack} className="screen-header__back-btn" aria-label="Go back">
                    {/* Icon placeholder or use an icon component if available */}
                    ←
                </button>
            )}
            <h1 className="screen-header__title">{title}</h1>
            {actions && <div className="screen-header__actions">{actions}</div>}
        </header>
    );
};
