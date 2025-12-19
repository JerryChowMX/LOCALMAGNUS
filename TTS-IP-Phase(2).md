# TTS Implementation Plan - Phase 2 Progress

**Phase:** Frontend Verification  
**Status:** ✅ Complete  
**Date:** 2025-12-19

---

## Files Created

| File | Purpose |
|------|---------|
| `src/tts/extractCanonicalText.ts` | Mirrors backend text extraction exactly |
| `src/tts/verifyCanonical.ts` | Hash comparison + first-mismatch detector |
| `src/tts/blockMappings.ts` | Deterministic block-to-token mapping loader |
| `src/tts/index.ts` | Module exports |

---

## Files Modified

| File | Change |
|------|--------|
| `useTtsModel.ts` | Rewrote with verification gate; returns `isVerified`, `blockMappings` |
| `useTtsController.ts` | Updated `TtsWordTiming` to match backend format (`start_time`/`end_time`) |
| `TtsExperience.tsx` | New props: `articleBlocks`, `articleId`, `onVerificationChange`; disables highlighting if not verified |
| `UnifiedArticleView.tsx` | Removed +40 offset; passes new props to TtsExperience |

---

## Key Functions

### extractCanonicalText.ts
```typescript
export function extractCanonicalText(blocks: ContentBlock[]): string
export function markdownToPlainText(md: string): string
export function normalizeText(text: string): string
export function tokenize(text: string): string[]
```

### verifyCanonical.ts
```typescript
export async function verifyCanonical(
    blocks: Array<{ __component: string; [key: string]: unknown }>,
    metadata: TtsMetadata,
    articleId: string
): Promise<VerificationResult>
```

### blockMappings.ts
```typescript
export function createBlockMappings(
    blockRanges: TtsMetadata['blockRanges']
): Map<string, BlockTokenMapping>
```

---

## Verification Flow

```
1. TtsExperience mounts
2. useTtsModel fetches metadata
3. If legacy format → skip verification, disable highlighting
4. If enhanced format:
   a. Extract canonical text from articleBlocks (frontend)
   b. Compute sha256(frontendCanonicalText)
   c. Compare to metadata.canonicalTextHash
   d. If mismatch → find first differing token, log error
   e. If match → enable word timings and block mappings
5. useTtsController only receives timings if isVerified === true
6. Highlighting disabled until Phase 3 instrumentation
```

---

## What is NOT Implemented Yet

- ❌ DOM instrumentation with spans
- ❌ CSS highlighting from verified indices
- ❌ wordIndexRef removal from InstrumentedText/NotaOriginal
- ❌ Phase 3 blockMappings usage for rendering

---

## Expected Console Output (on verification)

**Success:**
```
[TTS-MODEL] Enhanced metadata loaded { tokenCount: 188, blockCount: 5, pipelineVersion: "1.0.0" }
[TTS-VERIFY] Verification PASSED { articleId: "xxx", tokenCount: 188, pipelineVersion: "1.0.0" }
[TTS-MODEL] Verification PASSED - loading timings and mappings
```

**Failure:**
```
[TTS-MODEL] Enhanced metadata loaded { tokenCount: 188, blockCount: 5, pipelineVersion: "1.0.0" }
[TTS-VERIFY] Hash mismatch detected { articleId: "xxx", expectedHash: "abc123...", actualHash: "def456...", mismatch: { index: 42, backendToken: "Coahuila,", frontendToken: "Coahuila" } }
[TTS-MODEL] Verification FAILED - highlighting disabled
[UAV] TTS verification failed: Hash mismatch: expected abc123..., got def456...
```

---

## Next Steps (Phase 3)

1. Restart Strapi to generate enhanced metadata
2. Force-regenerate TTS for test article
3. Test verification (expect first-time mismatch, then fix)
4. When verification passes → implement Phase 3 instrumentation
