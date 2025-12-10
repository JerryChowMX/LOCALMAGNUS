export const TIMEZONE = 'America/Monterrey';

export const getMonterreyDate = (): string => {
    return new Date().toLocaleDateString('en-CA', { timeZone: TIMEZONE });
};

export const getMonterreyTime = (): Date => {
    const now = new Date();
    // const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE }));
    return tzDate;
};
