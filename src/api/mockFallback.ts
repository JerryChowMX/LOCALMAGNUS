const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export async function withMockFallback<T>(
    fetcher: () => Promise<T>,
    mock: T,
    context: string
): Promise<{ data: T; isFallback: boolean }> {
    try {
        const data = await fetcher();
        return { data, isFallback: false };
    } catch (error) {
        if (!USE_MOCKS) {
            throw error;
        }
        console.warn(`[MockFallback] Using mock for ${context}`, error);
        return { data: mock, isFallback: true };
    }
}
