import textToSpeech from '@google-cloud/text-to-speech';

/**
 * Shared interface for TTS providers.
 */
export interface TtsWordTiming {
    startMs: number;
    endMs: number;
    charIndex: number;
    wordLength: number;
}

export interface TtsSynthesisResult {
    audioBuffer: Buffer;
    wordTimings: TtsWordTiming[];
}

export interface TtsProvider {
    /**
     * Synthesizes text into audio and returns word timings.
     */
    synthesize(text: string, options?: { voice?: string; language?: string }): Promise<TtsSynthesisResult>;
}

/**
 * Google Cloud TTS Implementation.
 * Decisive feature: Native word-level time offsets.
 */
export class GoogleCloudTtsProvider implements TtsProvider {
    private client: any;

    constructor() {
        // Automatically picks up GOOGLE_APPLICATION_CREDENTIALS from process.env
        this.client = new textToSpeech.TextToSpeechClient();
    }

    async synthesize(text: string, options: { voice?: string; language?: string } = {}): Promise<TtsSynthesisResult> {
        const {
            voice = 'es-US-Standard-A',
            language = 'es-US'
        } = options;

        const request = {
            input: { text },
            voice: { languageCode: language, name: voice },
            audioConfig: { audioEncoding: 'MP3' as const },
            enableWordTimeOffsets: true,
        };

        const [response] = await this.client.synthesizeSpeech(request);

        if (!response.audioContent) {
            throw new Error('Google Cloud TTS returned no audio content.');
        }

        const wordTimings: TtsWordTiming[] = [];

        /**
         * Google's 'timeOffsets' returns tokens with their start/end times.
         * We must correlate these with the original text to find the charIndex.
         */
        if (response.timeOffsets && response.timeOffsets.length > 0) {
            let lastSearchIndex = 0;

            for (const offset of response.timeOffsets) {
                const wordText = offset.text || '';
                if (!wordText) continue;

                // Find the word in the original text starting from the last found position
                const foundIndex = text.indexOf(wordText, lastSearchIndex);

                if (foundIndex !== -1) {
                    const startMs = Math.round(
                        (Number(offset.startTime?.seconds || 0) * 1000) +
                        (Number(offset.startTime?.nanos || 0) / 1000000)
                    );
                    const endMs = Math.round(
                        (Number(offset.endTime?.seconds || 0) * 1000) +
                        (Number(offset.endTime?.nanos || 0) / 1000000)
                    );

                    wordTimings.push({
                        startMs,
                        endMs,
                        charIndex: foundIndex,
                        wordLength: wordText.length
                    });

                    lastSearchIndex = foundIndex + wordText.length;
                }
            }
        }

        return {
            audioBuffer: response.audioContent as Buffer,
            wordTimings
        };
    }
}
