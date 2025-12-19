/**
 * TTS Block Mappings
 * 
 * Creates deterministic block-to-token mapping from backend blockRanges.
 * No mutation. No refs. No traversal logic.
 */

import type { TtsMetadata } from './verifyCanonical';

/**
 * Block token mapping - deterministic allocation from backend
 */
export interface BlockTokenMapping {
    blockId: string;
    fieldPath: string;
    globalStartIndex: number;
    tokenCount: number;
}

/**
 * Creates block mappings from backend blockRanges.
 * Key format: "blockId:fieldPath"
 * 
 * This prepares Phase 3 instrumentation.
 */
export function createBlockMappings(
    blockRanges: TtsMetadata['blockRanges']
): Map<string, BlockTokenMapping> {
    const mappings = new Map<string, BlockTokenMapping>();

    for (const range of blockRanges) {
        const key = `${range.blockId}:${range.fieldPath}`;
        mappings.set(key, {
            blockId: range.blockId,
            fieldPath: range.fieldPath,
            globalStartIndex: range.startToken,
            tokenCount: range.tokenCount
        });
    }

    return mappings;
}

/**
 * Gets mapping for a specific block/field.
 * Returns undefined if not found.
 */
export function getBlockMapping(
    mappings: Map<string, BlockTokenMapping>,
    blockId: string,
    fieldPath: string
): BlockTokenMapping | undefined {
    return mappings.get(`${blockId}:${fieldPath}`);
}
