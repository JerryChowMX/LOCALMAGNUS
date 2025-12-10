import { resumenApi } from '../services/resumenApi';
import { useApiData } from '../../../hooks/useApiData';

export const useResumenOpinionArticles = (date: string) => {
    const { data, isLoading, error, isFallback } = useApiData(
        () => resumenApi.getOpinionArticles(date),
        [date]
    );

    return {
        articles: data || [],
        isLoading,
        error,
        isFallback
    };
};
