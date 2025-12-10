import { resumenApi } from '../services/resumenApi';
import { useApiData } from '../../../hooks/useApiData';

export const useResumenPodcast = (date: string) => {
    const { data, isLoading, error, isFallback } = useApiData(
        () => resumenApi.getPodcast(date),
        [date]
    );

    return {
        podcast: data || null,
        isLoading,
        error,
        isFallback
    };
};
