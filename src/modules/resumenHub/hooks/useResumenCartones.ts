import { resumenApi } from '../services/resumenApi';
import { useApiData } from '../../../hooks/useApiData';

export const useResumenCartones = (date: string) => {
    const { data, isLoading, error, isFallback } = useApiData(
        () => resumenApi.getCartoons(date),
        [date]
    );

    return {
        cartoons: data || [],
        isLoading,
        error,
        isFallback
    };
};
