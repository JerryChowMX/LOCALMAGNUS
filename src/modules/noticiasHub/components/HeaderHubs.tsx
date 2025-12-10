import React, { forwardRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale/es';
import { useScrolledHeader } from '../../../hooks/useScrolledHeader';
import './HeaderHubs.css';
import './HeaderHubsDatePicker.css';

registerLocale('es', es);

export interface HeaderHubsProps {
    variant?: "light" | "dark";
    currentDate: string;
    onDateChange: (date: string) => void;
    onBack?: () => void;
    onFilter?: (date: string) => void; // Optional: if provided, enables filter mode
}

const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Custom Input for DatePicker to match the "Filtrar" button design
const DatePickerCustomInput = forwardRef<HTMLButtonElement, any>(({ onClick }, ref) => (
    <button className="header-hubs__filter" onClick={onClick} ref={ref}>
        <span className="header-hubs__filter-text">Filtrar</span>
        <CalendarIcon />
    </button>
));

export const HeaderHubs: React.FC<HeaderHubsProps> = ({
    variant = "light",
    currentDate,
    onDateChange,
    onBack,
    onFilter
}) => {
    const { isScrolled } = useScrolledHeader();
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            // Format to YYYY-MM-DD
            // Use local date part, do NOT use toISOString() which shifts to UTC
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            // If onFilter is provided, use filter mode; otherwise navigate
            if (onFilter) {
                onFilter(formattedDate);
            } else {
                onDateChange(formattedDate);
            }
        }
    };

    // Parse current date string to Date object
    // Assuming currentDate is YYYY-MM-DD
    const getDisplayDate = (dateStr: string) => {
        if (!dateStr) return "Fecha";
        try {
            // Create date object treating input as local date part to avoid timezone shifts
            const [year, month, day] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);

            const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
            return date.toLocaleDateString('es-ES', options);
        } catch (e) {
            return dateStr;
        }
    };

    const displayDate = getDisplayDate(currentDate);
    const selectedDate = currentDate ? new Date(currentDate + 'T12:00:00') : new Date();

    return (
        <header className={`header-hubs header-hubs--${variant} ${isScrolled ? 'header-hubs--scrolled' : ''}`}>
            {/* Left: Back Button + Date Label */}
            <button className="header-hubs__back" onClick={handleBack}>
                <BackIcon />
                <span className="header-hubs__date-label">{displayDate}</span>
            </button>

            {/* Center: Logo Block */}
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="header-hubs__logo-block">
                    <div className="header-hubs__logo">MAGNUS</div>
                    <div className="header-hubs__vanguardia">VANGUARDIA</div>
                </div>
            </Link>

            {/* Right: Filter Button (DatePicker) */}
            <div className="header-hubs__filter-wrapper">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    customInput={<DatePickerCustomInput />}
                    dateFormat="yyyy-MM-dd"
                    popperPlacement="bottom-end"
                    calendarClassName="magnus-datepicker"
                    locale="es"
                />
            </div>
        </header>
    );
};
