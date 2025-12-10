import { useState } from 'react';

export interface UsePaginationProps {
    total: number;
    pageSize?: number;
    initialPage?: number;
}

export interface UsePaginationReturn {
    currentPage: number;
    pageSize: number;
    total: number;
    pageCount: number;
    nextPage: () => void;
    prevPage: () => void;
    setPage: (page: number) => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export const usePagination = ({
    total,
    pageSize = 10,
    initialPage = 1
}: UsePaginationProps): UsePaginationReturn => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const pageCount = Math.ceil(total / pageSize);

    const nextPage = () => {
        if (currentPage < pageCount) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const setPage = (page: number) => {
        if (page >= 1 && page <= pageCount) {
            setCurrentPage(page);
        }
    };

    const hasNextPage = currentPage < pageCount;
    const hasPrevPage = currentPage > 1;

    return {
        currentPage,
        pageSize,
        total,
        pageCount,
        nextPage,
        prevPage,
        setPage,
        hasNextPage,
        hasPrevPage
    };
};
