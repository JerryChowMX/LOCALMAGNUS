/**
 * TTS Module Index
 * 
 * Phase 2: Contract enforcement and verification
 */

// Canonical text extraction (mirrors backend)
export {
    extractCanonicalText,
    markdownToPlainText,
    normalizeText,
    tokenize,
    getPipelineVersion
} from './extractCanonicalText';

// Verification gate
export {
    verifyCanonical,
    type TtsMetadata,
    type VerificationResult
} from './verifyCanonical';

// Block mappings (prepares Phase 3)
export {
    createBlockMappings,
    getBlockMapping,
    type BlockTokenMapping
} from './blockMappings';
