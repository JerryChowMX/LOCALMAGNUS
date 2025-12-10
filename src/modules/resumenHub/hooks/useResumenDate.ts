import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const useResumenDate = () => {
    const { date } = useParams<{ date: string }>();
    const navigate = useNavigate();

    const currentDate = date || new Date().toISOString().split('T')[0];

    const handleDateChange = useCallback((newDate: string) => {
        // Preserve the current section if possible, or go back to hub root?
        // Spec says: "When user taps an option, routing becomes: /ResumenHub/:Date/Las5DelDia"
        // If we are in a section, we probably want to stay in that section but change date.
        // For now, let's just navigate to the new date's Hub root to be safe/simple, 
        // or we can try to replace the date segment in the current URL.

        // Simple approach: Go to ResumenHub root for new date
        navigate(`/ResumenHub/${newDate}`);
    }, [navigate]);

    return {
        currentDate,
        handleDateChange
    };
};
