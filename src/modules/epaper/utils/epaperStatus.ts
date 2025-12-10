export type EpaperStatus = 'available' | 'upcoming' | 'unavailable';

export const getEpaperStatus = (dateStr: string): EpaperStatus => {
    const selectedDate = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Future dates
    if (selectedDate > today) {
        return 'upcoming';
    }

    // Archive depth - EPapers available from 2020 onwards
    const archiveStartDate = new Date('2020-01-01T00:00:00');
    if (selectedDate < archiveStartDate) {
        return 'unavailable';
    }

    return 'available';
};

export const getStatusMessage = (status: EpaperStatus): string => {
    switch (status) {
        case 'upcoming':
            return 'Próximamente';
        case 'unavailable':
            return 'No disponible';
        case 'available':
        default:
            return 'Edición impresa';
    }
};
