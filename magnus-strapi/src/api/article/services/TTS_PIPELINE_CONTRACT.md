# TTS Text Pipeline Contract

**Version:** 1.0.0  
**Last Updated:** 2025-12-19

---

## Purpose

This document defines the exact rules for what text is extracted from an article, 
how it's normalized, and how it's tokenized for TTS (Text-to-Speech) karaoke highlighting.

Both **backend (Strapi)** and **frontend (React)** MUST follow these rules identically.

---

## Block Inclusion Rules

### Included (✅)

| Component Type | Field(s) | Notes |
|----------------|----------|-------|
| `content.rich-text` | `content` | Markdown stripped to plain text |
| `content.quote` | `quote_text` | Plain text, no markdown |
| `content.quote` | `author` | Plain text, added after quote_text |

### Excluded (❌)

- Article title
- Article dek/summary
- Image captions
- Gallery captions
- "Read more" links
- Related articles
- Embeds (tweets, videos)
- Infographics
- Any UI-only text

---

## Text Normalization

Apply these transformations IN ORDER:

```javascript
function normalizeText(text) {
  return text
    .normalize('NFC')                      // Unicode canonical composition
    .replace(/[\u2013\u2014]/g, '-')        // en-dash, em-dash → hyphen
    .replace(/[\u2018\u2019]/g, "'")        // smart single quotes → straight
    .replace(/[\u201C\u201D]/g, '"')        // smart double quotes → straight
    .replace(/\u2026/g, '...')              // ellipsis → three dots
    .replace(/\u00A0/g, ' ')                // non-breaking space → space
    .replace(/\s+/g, ' ')                   // collapse whitespace
    .trim();
}
```

---

## Markdown to Plain Text

For `content.rich-text` blocks, strip markdown:

```javascript
function markdownToPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, '')         // code fences → remove
    .replace(/`([^`]+)`/g, '$1')            // inline code → preserve text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')   // images → remove
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')// [text](url) → text
    .replace(/\*\*([^*]+)\*\*/g, '$1')      // **bold** → bold
    .replace(/\*([^*]+)\*/g, '$1')          // *italic* → italic
    .replace(/_([^_]+)_/g, '$1')            // _italic_ → italic
    .replace(/^#{1,6}\s*/gm, '')            // headers → remove markers
    .replace(/^[-*+]\s+/gm, '')             // list markers → remove
    .replace(/^\d+\.\s+/gm, '')             // numbered lists → remove
    .replace(/^>\s*/gm, '')                 // blockquotes → remove marker
    .replace(/\n+/g, ' ')                   // newlines → space
    .replace(/\s+/g, ' ')                   // collapse whitespace
    .trim();
}
```

---

## Block Joining

Blocks are joined with a **single space** (each block is already normalized).

```javascript
const canonicalText = parts.join(' ');
```

---

## Tokenization

Use regex `/\S+/g` to extract tokens (non-whitespace sequences).

```javascript
const tokens = normalizedText.match(/\S+/g) || [];
```

---

## Metadata Output Format

```typescript
interface TtsMetadata {
  wordTimings: Array<{
    word: string;
    start_time: number;  // milliseconds
    end_time: number;    // milliseconds
  }>;
  
  // Contract fields
  canonicalText: string;
  tokenCount: number;
  pipelineVersion: string;  // "1.0.0"
  canonicalTextHash: string;  // sha256(canonicalText)
  
  blockRanges: Array<{
    blockId: string;
    fieldPath: string;    // "content" | "quote_text" | "author"
    startToken: number;
    tokenCount: number;
  }>;
}
```

---

## Verification

Frontend MUST verify before enabling highlighting:

```javascript
const frontendHash = sha256(extractedCanonicalText);
if (frontendHash !== metadata.canonicalTextHash) {
  // DISABLE HIGHLIGHTING
  // Log mismatch details
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-19 | Initial contract |
