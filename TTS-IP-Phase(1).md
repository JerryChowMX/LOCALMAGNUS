# TTS Implementation Plan - Phase 1 Progress

**Phase:** Backend Contract  
**Status:** ✅ Complete (pending test)  
**Date:** 2025-12-19

---

## Deliverables Created

### 1. TTS_PIPELINE_CONTRACT.md

**Location:** `magnus-strapi/src/api/article/services/TTS_PIPELINE_CONTRACT.md`

Defines exact rules for:
- Block inclusion (✅ `content.rich-text`, ✅ `content.quote`)
- Block exclusion (❌ title, dek, captions, embeds)
- Text normalization (NFC, smart quotes, dashes, whitespace)
- Markdown stripping (surgical regex replacements)
- Block joining (single space, parts already normalized)
- Tokenization regex (`/\S+/g`)
- Metadata output format

### 2. tts.ts Enhancements

**Location:** `magnus-strapi/src/api/article/services/tts.ts`

#### Changes Made:

**1. New `extractCanonicalTextWithRanges()` function:**
- Returns canonical text AND block ranges
- Tracks per-block: `blockId`, `fieldPath`, `startToken`, `tokenCount`

**2. Updated `markdownToPlainText()` (surgical regex):**
```typescript
.replace(/```[\s\S]*?```/g, '')           // code fences
.replace(/`([^`]+)`/g, '$1')              // inline code → preserve text
.replace(/!\[[^\]]*\]\([^)]*\)/g, '')     // images → remove
.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')  // [text](url) → text
.replace(/\*\*([^*]+)\*\*/g, '$1')        // **bold** → bold
.replace(/\*([^*]+)\*/g, '$1')            // *italic* → italic
// ... etc
```

**3. Fixed `normalizeText()` to use NFC:**
```typescript
return text.normalize('NFC')  // Was NFKD
```

**4. Added token validation gate in `processTts()`:**
```typescript
if (wordTimings.length !== tokenCount) {
    const mismatchError = `Token count mismatch: extracted ${tokenCount} tokens but Google returned ${wordTimings.length} timings`;
    strapi.log.error(`[TTS] LOUD: ${mismatchError}`);
    // Set error status, DO NOT ship broken metadata
    return;
}
```

**5. Enhanced metadata output:**
```typescript
{
    wordTimings,
    canonicalText,
    tokenCount,
    pipelineVersion: '1.0.0',
    canonicalTextHash,
    blockRanges
}
```

---

## Patches Applied (Audit Feedback)

| Issue | Fix |
|-------|-----|
| Joiner mismatch (spec: `\n\n`, code: `' '`) | Updated spec to match code: single space |
| Normalization (spec: NFC, code: NFKD) | Fixed code to use NFC |
| Markdown stripper too lossy | Made surgical with explicit replacements |
| Missing tokenCount validation | Added hard validation gate with error+abort |

---

## Next Steps

1. **Restart Strapi** to pick up changes
2. **Force-regenerate TTS** for a test article
3. **Verify in Strapi logs:**
   - `[TTS] LOUD: Extracted N tokens from M blocks`
   - `[TTS] LOUD: Token validation PASSED (N tokens)`
4. **Download metadata JSON** and verify contains all contract fields
5. **Proceed to Phase 2** (Frontend Verification)

---

## Files Changed

| File | Change |
|------|--------|
| `TTS_PIPELINE_CONTRACT.md` | Created, then synced with implementation |
| `tts.ts` | `extractCanonicalTextWithRanges()`, `markdownToPlainText()`, `normalizeText()`, `processTts()` |
