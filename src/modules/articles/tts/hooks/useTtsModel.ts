import { useState, useEffect } from 'react';

interface TtsWordTiming {
    startMs: number;
    endMs: number;
    charIndex: number;
    wordLength: number;
}

/**
 * Hook to fetch TTS word timings from metadata URL.
 * Returns a simple array of word timings for the karaoke controller.
 */
export const useTtsModel = (metadataUrl: string | null, _articleText: string) => {
    const [wordTimings, setWordTimings] = useState<TtsWordTiming[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!metadataUrl) {
            setWordTimings([]);
            return;
        }

        const loadTimings = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(metadataUrl);
                if (!response.ok) throw new Error(`Failed to fetch metadata: ${response.statusText}`);

                const rawTimings: TtsWordTiming[] = await response.json();

                // Validate the data has required fields
                if (Array.isArray(rawTimings) && rawTimings.length > 0) {
                    setWordTimings(rawTimings);
                    console.log(`[TTS] Loaded ${rawTimings.length} word timings`);
                } else {
                    console.warn('[TTS] Metadata is empty or invalid');
                    setWordTimings([]);
                }
            } catch (err: any) {
                console.error('[TTS] Failed to load word timings:', err);
                setError(err);
                setWordTimings([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadTimings();
    }, [metadataUrl]);

    return { wordTimings, isLoading, error };
};
