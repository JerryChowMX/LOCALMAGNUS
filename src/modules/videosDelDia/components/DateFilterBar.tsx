/**
 * DateFilterBar - Floating date selector for video feed
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../../components/Icons';
import './DateFilterBar.css';

interface DateFilterBarProps {
    currentDate: string;
    onBack?: () => void;
}

export const DateFilterBar: React.FC<DateFilterBarProps> = ({
    currentDate,
    onBack,
}) => {
    const navigate = useNavigate();

    // Format date for display
    const formatDisplayDate = (dateString: string): string => {
        const date = new Date(dateString + 'T12:00:00');
        return date.toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    // Navigate to previous day
    const goToPrevDay = () => {
        const date = new Date(currentDate + 'T12:00:00');
        date.setDate(date.getDate() - 1);
        const prevDate = date.toISOString().split('T')[0];
        navigate(`/VideosDelDia/${prevDate}`);
    };

    // Navigate to next day
    const goToNextDay = () => {
        const date = new Date(currentDate + 'T12:00:00');
        date.setDate(date.getDate() + 1);
        const nextDate = date.toISOString().split('T')[0];
        navigate(`/VideosDelDia/${nextDate}`);
    };

    // Check if next day is in the future
    const today = new Date().toISOString().split('T')[0];
    const isNextDisabled = currentDate >= today;

    return (
        <div className="date-filter-bar">
            <button
                className="date-filter-bar__back"
                onClick={onBack || (() => navigate('/'))}
                aria-label="Volver"
            >
                <Icons.arrowLeft size={24} />
            </button>

            <div className="date-filter-bar__date-controls">
                <button
                    className="date-filter-bar__arrow"
                    onClick={goToPrevDay}
                    aria-label="Día anterior"
                >
                    <Icons.chevronLeft size={20} />
                </button>

                <span className="date-filter-bar__date">
                    {formatDisplayDate(currentDate)}
                </span>

                <button
                    className="date-filter-bar__arrow"
                    onClick={goToNextDay}
                    disabled={isNextDisabled}
                    aria-label="Día siguiente"
                >
                    <Icons.chevronRight size={20} />
                </button>
            </div>

            <div className="date-filter-bar__spacer" />
        </div>
    );
};
