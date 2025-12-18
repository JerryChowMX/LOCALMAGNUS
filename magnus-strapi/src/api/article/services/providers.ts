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
 * Helper to convert text to SSML with <mark> tags before each word.
 * This is required for Google Cloud TTS to return word timing information.
 */
function textToSsmlWithMarks(text: string): { ssml: string; wordMap: Array<{ markName: string; charStart: number; word: string }> } {
    const wordMap: Array<{ markName: string; charStart: number; word: string }> = [];

    // Split text into words while preserving positions
    const words: Array<{ word: string; start: number }> = [];
    const wordRegex = /\S+/g;
    let match;

    while ((match = wordRegex.exec(text)) !== null) {
        words.push({ word: match[0], start: match.index });
    }

    // Build SSML with marks
    let ssml = '<speak>';
    let lastEnd = 0;

    words.forEach((wordInfo, index) => {
        // Add any whitespace/punctuation before this word
        if (wordInfo.start > lastEnd) {
            const gap = text.slice(lastEnd, wordInfo.start);
            ssml += gap;
        }

        // Use underscore format for mark names (w_0, w_1, etc.)
        const markName = `w_${index}`;
        wordMap.push({
            markName,
            charStart: wordInfo.start,
            word: wordInfo.word
        });

        // Add mark before word
        ssml += `<mark name="${markName}"/>${wordInfo.word}`;
        lastEnd = wordInfo.start + wordInfo.word.length;
    });

    // Add any trailing text
    if (lastEnd < text.length) {
        ssml += text.slice(lastEnd);
    }

    ssml += '</speak>';

    return { ssml, wordMap };
}

/**
 * Google Cloud TTS Implementation with Word Timing Support.
 * IMPORTANT: Uses v1beta1 client for timepoints support.
 * Uses SSML <mark> tags and enableTimePointing for word-level timepoints.
 */
export class GoogleCloudTtsProvider implements TtsProvider {
    private client: any;

    constructor() {
        // CRITICAL: Use v1beta1 for timepoints support
        // v1 client does NOT return timepoints even with enableTimePointing
        this.client = new textToSpeech.v1beta1.TextToSpeechClient();
        strapi?.log?.info?.('[TTS] GoogleCloudTtsProvider initialized with v1beta1 client');
    }

    async synthesize(text: string, options: { voice?: string; language?: string } = {}): Promise<TtsSynthesisResult> {
        const {
            voice = 'es-US-Standard-A',
            language = 'es-US'
        } = options;

        // Convert plain text to SSML with marks for word timing
        const { ssml, wordMap } = textToSsmlWithMarks(text);

        strapi?.log?.info?.(`[TTS] SSML generated with ${wordMap.length} word marks`);
        strapi?.log?.debug?.(`[TTS] SSML preview: ${ssml.substring(0, 200)}...`);

        const request = {
            input: { ssml },
            voice: { languageCode: language, name: voice },
            audioConfig: { audioEncoding: 'MP3' as const },
            // CRITICAL: Use string array format for enableTimePointing
            // Must be ['SSML_MARK'] as a string, not numeric 1
            enableTimePointing: ['SSML_MARK'],
        };

        strapi?.log?.debug?.(`[TTS] Request: voice=${voice}, language=${language}, enableTimePointing=${JSON.stringify(request.enableTimePointing)}`);

        const [response] = await this.client.synthesizeSpeech(request);

        if (!response.audioContent) {
            throw new Error('Google Cloud TTS returned no audio content.');
        }

        strapi?.log?.info?.(`[TTS] Google response - audioContent: ${response.audioContent?.length} bytes, timepoints: ${response.timepoints?.length ?? 0}`);

        const wordTimings: TtsWordTiming[] = [];

        /**
         * Google's 'timepoints' returns the timing of each <mark> tag.
         * We correlate these with our wordMap to get character positions.
         */
        if (response.timepoints && response.timepoints.length > 0) {
            strapi?.log?.info?.(`[TTS] Received ${response.timepoints.length} timepoints from Google`);
            strapi?.log?.debug?.(`[TTS] First timepoint: ${JSON.stringify(response.timepoints[0])}`);

            for (let i = 0; i < response.timepoints.length; i++) {
                const timepoint = response.timepoints[i];
                const markName = timepoint.markName;

                // Find the corresponding word in our map
                const wordInfo = wordMap.find(w => w.markName === markName);
                if (!wordInfo) {
                    strapi?.log?.warn?.(`[TTS] Could not find wordMap entry for mark: ${markName}`);
                    continue;
                }

                // Calculate start time in ms
                const startMs = Math.round((timepoint.timeSeconds || 0) * 1000);

                // End time is the start of the next word, or estimate based on audio duration
                let endMs: number;
                if (i + 1 < response.timepoints.length) {
                    endMs = Math.round((response.timepoints[i + 1].timeSeconds || 0) * 1000);
                } else {
                    // For the last word, estimate based on word length (rough heuristic)
                    endMs = startMs + Math.max(200, wordInfo.word.length * 80);
                }

                wordTimings.push({
                    startMs,
                    endMs,
                    charIndex: wordInfo.charStart,
                    wordLength: wordInfo.word.length
                });
            }
        } else {
            strapi?.log?.warn?.(`[TTS] No timepoints received from Google Cloud TTS`);
            strapi?.log?.warn?.(`[TTS] This usually means: 1) Wrong client version (need v1beta1), 2) Wrong enableTimePointing format, or 3) Voice doesn't support timepoints`);
        }

        strapi?.log?.info?.(`[TTS] Generated ${wordTimings.length} word timings`);

        return {
            audioBuffer: response.audioContent as Buffer,
            wordTimings
        };
    }
}
