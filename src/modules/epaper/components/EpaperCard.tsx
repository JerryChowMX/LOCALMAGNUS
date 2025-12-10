import React from 'react';
import { Stack } from '../../../components/Layout';
import { Headline, Caption } from '../../../components/Typography/Typography';
import { type EpaperStatus, getStatusMessage } from '../utils/epaperStatus';
import './EpaperCard.css';

interface EpaperCardProps {
    date: string;
    imageUrl?: string;
    onClick: () => void;
    status?: EpaperStatus;
}

const CalendarIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const ArchiveIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
);

const PdfIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

export const EpaperCard: React.FC<EpaperCardProps> = ({
    date,
    imageUrl,
    onClick,
    status = 'available'
}) => {
    const isDisabled = status !== 'available';

    // Format date for display (e.g., "4 dic 2024")
    const formatDate = (dateStr: string) => {
        try {
            const [year, month, day] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
            return date.toLocaleDateString('es-ES', options);
        } catch (e) {
            return dateStr;
        }
    };

    const handleClick = () => {
        if (isDisabled) {
            return;
        }
        onClick();
    };

    return (
        <div
            className={`epaper-card ${isDisabled ? 'epaper-card--disabled' : ''}`}
            onClick={handleClick}
            aria-disabled={isDisabled}
        >
            {/* Badge for upcoming */}
            {status === 'upcoming' && (
                <div className="epaper-card__badge epaper-card__badge--upcoming">
                    Próximamente
                </div>
            )}

            <div className="epaper-card-image">
                {imageUrl && status === 'available' ? (
                    <img src={imageUrl} alt={`EPaper ${date}`} />
                ) : (
                    <div className="epaper-placeholder">
                        {status === 'upcoming' ? (
                            <CalendarIcon />
                        ) : status === 'unavailable' ? (
                            <ArchiveIcon />
                        ) : (
                            <PdfIcon />
                        )}
                    </div>
                )}
            </div>
            <div className="epaper-card-content">
                <Stack spacing="xs">
                    <Headline level={3}>{formatDate(date)}</Headline>
                    <Caption>{getStatusMessage(status)}</Caption>
                </Stack>
            </div>
        </div>
    );
};
