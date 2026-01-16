import React, { forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale/es';
import './HeaderCenteredStack.css';
import '../../modules/noticiasHub/components/HeaderHubsDatePicker.css';

registerLocale('es', es);

export interface HeaderCenteredStackProps {
    variant?: "light" | "dark";
    currentDate: string;
    onDateChange: (date: string) => void;
    // Optional props kept for interface compatibility but currently unused
    onBack?: () => void;
    showBackButton?: boolean;
    searchMode?: any;
    onVideoSelect?: (video: any) => void;
    onPodcastSelect?: (podcast: any) => void;
    categories?: string[];
    selectedCategory?: string;
    onCategoryChange?: (category: string) => void;
}

const ChevronDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

export const HeaderCenteredStack: React.FC<HeaderCenteredStackProps> = ({
    variant = "light",
    currentDate,
    onDateChange,
    categories,
    selectedCategory,
    onCategoryChange
}) => {
    // Removed unused logic (search, back button)
    // Removed isSearchOpen state as requested

    // Removed handleBack as requested

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            onDateChange(formattedDate);
        }
    };

    const getDisplayDate = (dateStr: string) => {
        if (!dateStr) return "Fecha";
        try {
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

    const DatePickerCustomInput = forwardRef<HTMLButtonElement, any>(({ onClick }, ref) => (
        <button
            className="header-centered-stack__date-button"
            onClick={onClick}
            ref={ref}
        >
            <span>{displayDate}</span>
            <ChevronDownIcon />
        </button>
    ));

    return (
        <header className={`header-centered-stack header-centered-stack--${variant} ${categories?.length ? 'header-centered-stack--with-categories' : ''}`}>
            <div className="header-centered-stack__top-row">
                {/* Back Button Removed as requested */}

                <div className="header-centered-stack__date-picker">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        customInput={<DatePickerCustomInput />}
                        dateFormat="yyyy-MM-dd"
                        popperPlacement="bottom"
                        calendarClassName="magnus-datepicker"
                        locale="es"
                        maxDate={new Date()}
                    />
                </div>

                {/* Search Button Removed as requested */}
            </div>

            {categories && categories.length > 0 && (
                <div className="header-centered-stack__categories">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`header-centered-stack__category-item ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => onCategoryChange?.(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
};
