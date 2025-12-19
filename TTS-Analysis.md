# TTS Karaoke Highlighting - Revised Analysis

**Date:** 2025-12-19  
**Status:** 🔴 Broken - Requires Fundamental Rethinking

---

## What I Got Wrong in the First Analysis

1. **I blamed StrictMode.** It's just a diagnostic amplifier. The disease is render-order-dependent indexing.
2. **I assumed "+40" was a clean offset.** It's not. The offset isn't constant—it varies by article structure, block order, and whatever else consumed the ref.
3. **I proposed a `Map<string, number>` indexer** that doesn't match what InstrumentedText needs and has undefined variables.
4. **I under-weighted tokenization mismatch** as the primary failure mode.
5. **I suggested removing StrictMode** as a diagnostic shortcut. That's weak engineering.

---

## The Actual Problem

### The Real Failure: Index Assignment is Tied to Render Traversal, Not to Data

The current system does this:
```
Render component → traverse children → increment ref → assign index
```

This is broken because:
- React re-renders for many reasons (state, parent, suspense, memo, hydration)
- Render order is not guaranteed
- The same component can render multiple times
- Different content blocks resolve at different times

**StrictMode doesn't cause the bug. It reveals it.**

### The Deeper Failure: Tokenization Mismatch

Even if we fix the render-order problem, we still have:

| Backend (Strapi tts.ts) | Frontend (InstrumentedText) |
|------------------------|----------------------------|
| `/\S+/g` on canonical extracted text | Tokenizes markdown-rendered output |
| Sees: `"Coahuila,"` | Might see: `"Coahuila"` + `","` |
| Normalized text | HTML entities, smart quotes, &nbsp; |
| Exact character sequence | Whatever ReactMarkdown outputs |

**If token #217 on backend is "Estrategia" but frontend produces "Estrategia" at token #220 due to punctuation handling, no index scheme will sync.**

This is the real landmine. I ignored it.

---

## Why the +40 Workaround is Garbage

The +40 offset "works" for one article's first paragraph. But:

1. **Different articles have different offsets** - depends on block structure
2. **The offset isn't +40, it's "whatever got rendered first"** - could be title, dek, skeleton, hidden elements, stray components
3. **Quote blocks have different consumption patterns** - the offset changes mid-article
4. **I haven't proven anything** - I found a number that hides the bug, not fixes it

---

## What the Backend Actually Sends

Looking at `tts.ts`, the backend:
1. Extracts text from specific block types (`content.rich-text`, `content.quote`)
2. Joins with paragraph breaks
3. Normalizes (Unicode NFC, smart quotes → plain quotes)
4. Sends to Google TTS
5. Returns word timings with `{ word, start_time, end_time }`

**What's missing:**
- `canonicalText` - the exact string that was sent to TTS
- `tokenCount` - how many tokens backend counted
- `tokenizationVersion` - so frontend knows which regex to match
- `hash(canonicalText)` - for mismatch detection
- Block ranges: `{ blockId, startToken, tokenCount }` - where each block's words start

---

## Why Pre-computing Indices (Alone) Isn't Enough

Even with render-order-safe indexing, you need:

1. **Single source of truth for exact text** - frontend must highlight against the SAME text backend used
2. **Deterministic block → token allocation** - can't let frontend "reconstruct" ranges
3. **Rendered text must match canonical text** - if markdown adds/removes characters, game over

My Map proposal was "sounds smart" architecture, not shippable. The snippet had:
- `localIdx` undefined
- Keys based on runtime tokenization (fragile)
- No stable token identity system

---

## The Robust Solution (That I Should Have Proposed)

### Option 1: Hidden Canonical Text Stream (MVP)

Render a hidden `<div>` containing EXACTLY the canonical text from backend. Instrument that. Use it solely for highlighting. The visible article is for reading; the hidden stream is for TTS sync.

**Why this works:**
- Proves timing correctness
- Removes markdown/quote variability from the equation
- Zero tokenization drift (same text = same tokens)

**Downside:** User sees highlighted text in a different place than rendered article (or requires visual sync between streams)

### Option 2: Backend Sends Block Ranges

Backend extraction already walks blocks to create canonical text. Have it also output:

```json
{
  "wordTimings": [...],
  "totalTokens": 188,
  "blockRanges": [
    { "blockId": "block-1", "startToken": 0, "tokenCount": 40 },
    { "blockId": "block-2", "startToken": 40, "tokenCount": 12 },
    ...
  ],
  "canonicalTextHash": "sha256:abc123..."
}
```

Frontend then:
1. Verifies `hash(extractedText) === canonicalTextHash`
2. Uses `blockRanges` to assign indices deterministically
3. If mismatch, shows dev-only banner and disables highlight

### Option 3: Anchor by Char Ranges, Not Token Index (Long-term)

Token-based indexing is inherently brittle. For robustness:

- Store `{ startChar, endChar }` per token in metadata
- DOM elements get `data-tts-start="0" data-tts-end="10"`
- Highlighting uses char ranges, not token positions

This survives:
- Punctuation changes
- Whitespace normalization
- Markdown rendering variations

---

## What Must Change Now

### Immediate (Before More Coding)

1. **Add `canonicalText` to backend TTS response** - the exact string sent to Google
2. **Add `tokenCount` to metadata** - so frontend can verify
3. **Log frontend token count** - compare to backend; if mismatch, stop

### Short-term (Architectural Fix)

1. **Stop instrumenting rendered blocks** - instrument a canonical stream
2. **Backend sends block ranges** - deterministic allocation from source of truth
3. **Mismatch detection** - if counts differ, disable highlight with warning

### Design Principle

> The frontend should never "reconstruct" what the backend used.  
> The backend is the single source of truth for text identity.

---

## Files That Need Changes

| File | What's Wrong | What It Needs |
|------|-------------|--------------|
| `magnus-strapi/src/api/article/services/tts.ts` | Doesn't expose canonical text or block ranges | Return `canonicalText`, `tokenCount`, `blockRanges` |
| `UnifiedArticleView.tsx` | +40 hack, mutable ref in useMemo | Verify token count, use canonical stream |
| `NotaOriginal.tsx` | Mutable ref during render | Pre-computed indices from backend ranges |
| `InstrumentedText.tsx` | `wordIndexRef.current++` | Remove mutation, use passed indices |

---

## Conclusion

My first analysis focused on React mechanics. That was wrong.

**The real problem is text identity:** the frontend doesn't know what text the backend used, and it reconstructs indices during render instead of receiving them from the source of truth.

StrictMode didn't break the feature. It revealed that the feature was never correctly architected.

**Estimated effort to fix properly:** 1-2 days (backend changes + frontend refactor)  
**The +40 workaround:** Should be removed; it hides the bug and varies per article
