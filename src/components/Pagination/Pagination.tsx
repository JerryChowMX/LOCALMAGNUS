import React from 'react';
import './Pagination.css';
import { Button } from '../Button/Button';
import { Stack } from '../Layout/Stack';
import { Body } from '../Typography/Typography';

export interface PaginationProps {
    currentPage: number;
    pageCount: number;
    onPageChange?: (page: number) => void;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    pageCount,
    onNext,
    onPrev,
    hasNext,
    hasPrev
}) => {
    return (
        <div className="pagination">
            <Stack direction="row" spacing="md" align="center" justify="center">
                <Button
                    variant="secondary"
                    onClick={onPrev}
                    disabled={!hasPrev}
                >
                    Previous
                </Button>

                <Body>
                    Page {currentPage} of {pageCount}
                </Body>

                <Button
                    variant="secondary"
                    onClick={onNext}
                    disabled={!hasNext}
                >
                    Next
                </Button>
            </Stack>
        </div>
    );
};
