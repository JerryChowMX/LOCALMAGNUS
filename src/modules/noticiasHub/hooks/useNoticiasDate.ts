import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getMonterreyDate } from '../../../lib/dateUtils';

export const useNoticiasDate = () => {
    const { date } = useParams<{ date: string }>();
    const navigate = useNavigate();

    // Default to today if no date in URL (though routing should handle this)
    const currentDate = date || getMonterreyDate();

    const handleDateChange = useCallback((newDate: string) => {
        navigate(`/NoticiasHub/${newDate}`);
    }, [navigate]);

    return {
        currentDate,
        handleDateChange
    };
};
