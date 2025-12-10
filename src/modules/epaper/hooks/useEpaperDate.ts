import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

export const useEpaperDate = () => {
    const { date } = useParams<{ date: string }>();
    const navigate = useNavigate();

    // Display date comes from URL or defaults to today
    const displayDate = date || format(new Date(), 'yyyy-MM-dd');

    // Filter date is separate - null means no filter applied
    const [filterDate, setFilterDate] = useState<string | null>(null);

    // Today's date for comparison
    const todayDate = format(new Date(), 'yyyy-MM-dd');

    const handleDateChange = useCallback((newDate: string) => {
        navigate(`/EPaper/${newDate}`);
    }, [navigate]);

    const applyFilter = useCallback((date: string) => {
        setFilterDate(date);
    }, []);

    const clearFilter = useCallback(() => {
        setFilterDate(null);
    }, []);

    return {
        displayDate,      // For header display
        filterDate,       // For sorting logic (null = no filter)
        todayDate,        // For comparisons
        handleDateChange, // Navigate to different date
        applyFilter,      // Set filter without navigation
        clearFilter       // Remove filter
    };
};
