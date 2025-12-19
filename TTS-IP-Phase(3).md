# TTS Implementation Plan - Phase 3 Progress

**Phase:** Instrumentation Refactor  
**Status:** ✅ Complete (with critical fixes)  
**Date:** 2025-12-19

---

## Critical Fixes Applied

### Fix #1: Kill Intra-Block Mutation
**Before:** `createInstrumentedMarkdownComponents` with `let currentTokenIndex` advancing during traversal.  
**After:** Strip markdown to plain text, render as single `InstrumentedText` with fixed `globalStartIndex`.

```tsx
// NO: Mutation during render
let currentTokenIndex = globalStartIndex;
currentTokenIndex += tokens.length;

// YES: Pure flat-text
const plainText = markdownToPlainText(richTextContent);
<InstrumentedText text={plainText} globalStartIndex={mapping.globalStartIndex} />
```

### Fix #2: Enforce Atomic Instrumentation
**Before:** Per-block validation, partial instrumentation allowed.  
**After:** All required mappings must exist, or ENTIRE article is not instrumented.

```tsx
const validation = validateAllMappingsPresent(article.content, blockMappings);
if (!validation.valid) {
    canInstrument = false;  // Disable for ALL blocks
}
```

### Fix #3: Stabilize Block IDs
**Before:** `block.id || \`block-${index}\`` (index fallback).  
**After:** Backend ID required. No index fallbacks.

```tsx
const blockId = (block as any).id?.toString();
if (!blockId && canInstrument) {
    console.error(`Block at index ${index} has no ID`);
    // Will fall back to non-instrumented render
}
```

---

## Files Modified

| File | Change |
|------|--------|
| `InstrumentedText.tsx` | Pure component: `globalStartIndex` prop, no refs |
| `ArticleQuote.tsx` | `quoteStartIndex` + `authorStartIndex` props |
| `NotaOriginal.tsx` | Atomic validation, flat-text instrumentation, backend ID required |
| `TtsExperience.tsx` | Exposes `blockMappings` via callback |
| `UnifiedArticleView.tsx` | CSS highlighting with verification guard |

---

## Validation Function

```tsx
const validateAllMappingsPresent = (
    blocks: ContentBlock[],
    blockMappings: Map<string, BlockTokenMapping>
): { valid: boolean; missingBlocks: string[] } => {
    const missingBlocks: string[] = [];
    
    for (const block of blocks) {
        const componentType = (block as any).__component;
        const blockId = (block as any).id?.toString();
        
        if (componentType === 'content.rich-text') {
            const key = `${blockId}:content`;
            if (!blockMappings.has(key)) missingBlocks.push(key);
        }
        
        if (componentType === 'content.quote') {
            const quoteKey = `${blockId}:quote_text`;
            if (!blockMappings.has(quoteKey)) missingBlocks.push(quoteKey);
        }
    }
    
    return { valid: missingBlocks.length === 0, missingBlocks };
};
```

---

## What Was Eliminated

- ❌ `let currentTokenIndex` (mutation during render)
- ❌ `createInstrumentedMarkdownComponents` (ReactMarkdown traversal)
- ❌ `block-${index}` fallback IDs
- ❌ Partial instrumentation (some blocks yes, some no)
- ❌ Per-block error logging (now atomic)

---

## Next Steps (Phase 4)

1. Restart Strapi to generate enhanced metadata
2. Force-regenerate TTS for test article
3. Verify hash match in console
4. Test highlighting synchronization
5. Clean up debug console.log statements
