/**
 * TTS Canonical Verification
 * 
 * Enforces contract between frontend and backend.
 * If verification fails → highlighting MUST be disabled.
 */

import { extractCanonicalText, tokenize, getPipelineVersion } from './extractCanonicalText';

/**
 * TTS Metadata from backend (contract fields)
 */
export interface TtsMetadata {
    wordTimings: Array<{
        word: string;
        start_time: number;
        end_time: number;
    }>;
    canonicalText: string;
    tokenCount: number;
    pipelineVersion: string;
    canonicalTextHash: string;
    blockRanges: Array<{
        blockId: string;
        fieldPath: string;
        startToken: number;
        tokenCount: number;
    }>;
}

/**
 * Verification result
 */
export interface VerificationResult {
    valid: boolean;
    error?: string;
    mismatch?: {
        index: number;
        backendToken: string | undefined;
        frontendToken: string | undefined;
        pipelineVersion: string;
        articleId: string;
    };
    frontendCanonicalText?: string;
    frontendTokenCount?: number;
}

/**
 * Simple SHA-256 hash using Web Crypto API
 */
async function sha256(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Finds first mismatching token between backend and frontend.
 */
function findFirstMismatch(
    backendTokens: string[],
    frontendTokens: string[],
    pipelineVersion: string,
    articleId: string
): VerificationResult['mismatch'] {
    const maxLen = Math.max(backendTokens.length, frontendTokens.length);

    for (let i = 0; i < maxLen; i++) {
        if (backendTokens[i] !== frontendTokens[i]) {
            return {
                index: i,
                backendToken: backendTokens[i],
                frontendToken: frontendTokens[i],
                pipelineVersion,
                articleId
            };
        }
    }
    return undefined;
}

/**
 * Verifies frontend canonical text matches backend contract.
 * 
 * HARD STOP: If this fails, highlighting MUST be disabled.
 */
export async function verifyCanonical(
    blocks: Array<{ __component: string;[key: string]: unknown }>,
    metadata: TtsMetadata,
    articleId: string
): Promise<VerificationResult> {
    // Extract canonical text using frontend logic
    const frontendCanonicalText = extractCanonicalText(blocks);
    const frontendTokens = tokenize(frontendCanonicalText);
    const frontendTokenCount = frontendTokens.length;

    // Compute hash
    const frontendHash = await sha256(frontendCanonicalText);

    // Check 1: Hash match
    if (frontendHash !== metadata.canonicalTextHash) {
        // Find first mismatch for debugging
        const backendTokens = tokenize(metadata.canonicalText);
        const mismatch = findFirstMismatch(
            backendTokens,
            frontendTokens,
            metadata.pipelineVersion,
            articleId
        );

        console.error('[TTS-VERIFY] Hash mismatch detected', {
            articleId,
            expectedHash: metadata.canonicalTextHash,
            actualHash: frontendHash,
            mismatch
        });

        return {
            valid: false,
            error: `Hash mismatch: expected ${metadata.canonicalTextHash.substring(0, 8)}..., got ${frontendHash.substring(0, 8)}...`,
            mismatch,
            frontendCanonicalText,
            frontendTokenCount
        };
    }

    // Check 2: Token count match
    if (frontendTokenCount !== metadata.tokenCount) {
        console.error('[TTS-VERIFY] Token count mismatch', {
            articleId,
            expected: metadata.tokenCount,
            actual: frontendTokenCount
        });

        return {
            valid: false,
            error: `Token count mismatch: expected ${metadata.tokenCount}, got ${frontendTokenCount}`,
            frontendCanonicalText,
            frontendTokenCount
        };
    }

    // Check 3: Pipeline version (warning only)
    if (metadata.pipelineVersion !== getPipelineVersion()) {
        console.warn('[TTS-VERIFY] Pipeline version mismatch', {
            backend: metadata.pipelineVersion,
            frontend: getPipelineVersion()
        });
    }

    console.log('[TTS-VERIFY] Verification PASSED', {
        articleId,
        tokenCount: frontendTokenCount,
        pipelineVersion: metadata.pipelineVersion
    });

    return {
        valid: true,
        frontendCanonicalText,
        frontendTokenCount
    };
}
