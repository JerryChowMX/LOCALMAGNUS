import React from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import './EmptyState.css';

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title = '¡Aún no hay noticias!',
    message = 'Parece que no hay artículos publicados para esta fecha. Prueba seleccionando otro día.',
    icon,
    actionLabel,
    onAction
}) => {
    return (
        <div className="empty-state">
            <div className="empty-state__icon-wrapper">
                {icon || <CalendarDaysIcon className="empty-state__icon" />}
            </div>
            <h3 className="empty-state__title">{title}</h3>
            <p className="empty-state__message">{message}</p>
            {actionLabel && onAction && (
                <button className="empty-state__action" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
};
