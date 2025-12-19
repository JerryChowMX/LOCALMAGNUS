import { useState, useEffect, useCallback } from 'react';
import {
    verifyCanonical,
    createBlockMappings,
    type TtsMetadata,
    type VerificationResult,
    type BlockTokenMapping
} from '../../../../tts';

interface TtsWordTiming {
    startMs: number;
    endMs: number;
    charIndex: number;
    wordLength: number;
    word?: string;
}

interface UseTtsModelResult {
    wordTimings: TtsWordTiming[];
    blockMappings: Map<string, BlockTokenMapping> | null;
    isLoading: boolean;
    error: Error | null;
    verification: VerificationResult | null;
    isVerified: boolean;
}

/**
 * Hook to fetch TTS metadata and verify canonical contract.
 * 
 * CRITICAL: If verification fails, highlighting MUST be disabled.
 */
export const useTtsModel = (
    metadataUrl: string | null,
    articleBlocks: Array<{ __component: string;[key: string]: unknown }> | null,
    articleId: string
): UseTtsModelResult => {
    const [wordTimings, setWordTimings] = useState<TtsWordTiming[]>([]);
    const [blockMappings, setBlockMappings] = useState<Map<string, BlockTokenMapping> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [verification, setVerification] = useState<VerificationResult | null>(null);

    const loadAndVerify = useCallback(async () => {
        if (!metadataUrl || !articleBlocks) {
            setWordTimings([]);
            setBlockMappings(null);
            setVerification(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 1. Fetch metadata
            const response = await fetch(metadataUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch metadata: ${response.statusText}`);
            }

            const metadata: TtsMetadata = await response.json();

            // Validate metadata has required contract fields
            if (!metadata.canonicalText || !metadata.canonicalTextHash || !metadata.blockRanges) {
                // Legacy format - no verification possible
                console.warn('[TTS-MODEL] Legacy metadata format detected, verification skipped');

                // Handle legacy: wordTimings was the root array
                if (Array.isArray(metadata)) {
                    setWordTimings(metadata as unknown as TtsWordTiming[]);
                } else if (metadata.wordTimings) {
                    setWordTimings(metadata.wordTimings);
                }
                setVerification({ valid: false, error: 'Legacy metadata format' });
                return;
            }

            console.log('[TTS-MODEL] Enhanced metadata loaded', {
                tokenCount: metadata.tokenCount,
                blockCount: metadata.blockRanges.length,
                pipelineVersion: metadata.pipelineVersion
            });

            // 2. VERIFICATION GATE - This is the hard stop
            const verificationResult = await verifyCanonical(articleBlocks, metadata, articleId);
            setVerification(verificationResult);

            if (!verificationResult.valid) {
                // HARD STOP: Do not proceed with highlighting
                console.error('[TTS-MODEL] Verification FAILED - highlighting disabled', verificationResult);
                setWordTimings([]);
                setBlockMappings(null);
                return;
            }

            // 3. Verification passed - load data
            console.log('[TTS-MODEL] Verification PASSED - loading timings and mappings');
            setWordTimings(metadata.wordTimings);
            setBlockMappings(createBlockMappings(metadata.blockRanges));

        } catch (err: unknown) {
            const error = err instanceof Error ? err : new Error(String(err));
            console.error('[TTS-MODEL] Failed to load metadata:', error);
            setError(error);
            setWordTimings([]);
            setBlockMappings(null);
            setVerification(null);
        } finally {
            setIsLoading(false);
        }
    }, [metadataUrl, articleBlocks, articleId]);

    useEffect(() => {
        loadAndVerify();
    }, [loadAndVerify]);

    return {
        wordTimings,
        blockMappings,
        isLoading,
        error,
        verification,
        isVerified: verification?.valid === true
    };
};
