import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMonterreyDate } from '../../../lib/dateUtils';
import { routes } from '../../../app/routes';

export const useStorybookDate = () => {
    const { date } = useParams<{ date: string }>();
    const navigate = useNavigate();

    // Default to today if no date in URL
    const currentDate = date || getMonterreyDate();

    const handleDateChange = useCallback((newDate: string) => {
        // Navigate to the same page but with the new date
        // implementation assumes we have a route for /storybook/:date
        navigate(`${routes.storybook}/${newDate}`);
    }, [navigate]);

    return {
        currentDate,
        handleDateChange
    };
};
