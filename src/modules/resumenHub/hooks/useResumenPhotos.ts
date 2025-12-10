import { resumenApi } from '../services/resumenApi';
import { useApiData } from '../../../hooks/useApiData';

export const useResumenPhotos = (date: string) => {
    const { data, isLoading, error, isFallback } = useApiData(
        () => resumenApi.getPhotos(date),
        [date]
    );

    return {
        photos: data || [],
        isLoading,
        error,
        isFallback
    };
};
