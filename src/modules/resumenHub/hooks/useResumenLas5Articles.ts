import { resumenApi } from '../services/resumenApi';
import { useApiData } from '../../../hooks/useApiData';

export const useResumenLas5Articles = (date: string) => {
    const { data, isLoading, error, isFallback } = useApiData(
        () => resumenApi.getLas5Articles(date),
        [date]
    );

    return {
        articles: data || [],
        isLoading,
        error,
        isFallback
    };
};
