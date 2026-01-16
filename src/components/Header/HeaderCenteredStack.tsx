import React, { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale/es';
import { Icons } from '../Icons';
import { SearchModal, type SearchMode } from '../Search/SearchModal';
import './HeaderCenteredStack.css';
import '../../modules/noticiasHub/components/HeaderHubsDatePicker.css';

registerLocale('es', es);

export interface HeaderCenteredStackProps {
    variant?: "light" | "dark";
    currentDate: string;
    onDateChange: (date: string) => void;
    onBack?: () => void;
    showBackButton?: boolean;
    searchMode?: SearchMode;
    onVideoSelect?: (video: any) => void;
    onPodcastSelect?: (podcast: any) => void;
    categories?: string[];
    selectedCategory?: string;
    onCategoryChange?: (category: string) => void;
}

const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

export const HeaderCenteredStack: React.FC<HeaderCenteredStackProps> = ({
    variant = "light",
    currentDate,
    onDateChange,
    onBack,
    showBackButton = true,
    searchMode = 'articles',
    onVideoSelect,
    onPodcastSelect,
    categories,
    selectedCategory,
    onCategoryChange
}) => {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

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
                {showBackButton && (
                    <button className="header-centered-stack__back" onClick={handleBack}>
                        <BackIcon />
                    </button>
                )}

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

                <button
                    className="header-centered-stack__search"
                    onClick={() => setIsSearchOpen(true)}
                >
                    <Icons.search size={24} />
                </button>
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

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                mode={searchMode}
                onVideoSelect={onVideoSelect}
                onPodcastSelect={onPodcastSelect}
            />
        </header>
    );
};
