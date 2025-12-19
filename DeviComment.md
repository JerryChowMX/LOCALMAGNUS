# Critical Audit: TTS Word Index Offset Bug

## Status
**Highlighting is technically working, but offset by 40 words.**

## Evidence
- Browser audit shows first DOM word has `data-tts-word="40"`
- Style tag exists: `[data-tts-word="62"] { background-color: ... }`
- Highlighting DOES appear at word "producto" (index 62) after ~52 seconds
- Console shows `[INST] Assigning indices 0 to 39` but DOM has 40-79

## Root Cause
**React StrictMode double-renders components in dev mode.**

1. First render: `localWordIndexRef.current` starts at 0, increments to 40
2. DOM from first render is DISCARDED by React
3. Second render: `useMemo` returns the SAME ref object (already at 40)
4. `localWordIndexRef.current = startIndex` sets it back to 0
5. BUT... the `useMemo` dependency is `[startIndex]` which hasn't changed
6. So useMemo returns CACHED ref object, which is still at 40 from step 1

### The Flaw in My Fix
```tsx
const localWordIndexRef = useMemo(() => ({ current: startIndex }), [startIndex]);
localWordIndexRef.current = startIndex; // This DOES reset to 0
```

But here's the problem: **useMemo runs ONCE**, so on the second render (the one that creates actual DOM), it returns the SAME ref object that was already incremented to 40.

Setting `localWordIndexRef.current = startIndex` only helps if it runs BEFORE the child components consume it. But InstrumentedText consumes it during its own render, which happens AFTER NotaOriginal's return statement begins.

## The Simple Fix
**Don't use useMemo. Create a NEW object every single render.**

```tsx
// NOT useMemo - fresh object every render
const localWordIndexRef = { current: startIndex };
```

This ensures:
1. First render: creates { current: 0 }, increments to 40, DOM discarded
2. Second render: creates NEW { current: 0 }, increments to 40, DOM created
3. DOM has indices 0-39 ✓

## Why This Works
React StrictMode discards the FIRST render's DOM output, keeping the SECOND. By creating a fresh ref object on each render, both renders start at 0, so the second render's DOM also starts at 0.
