# 📊 MAGNUS Analytics – Final PID (Web + Future Native)

## 0. One-line Summary

Implement a single, privacy-aware analytics layer for MAGNUS that tracks how users actually interact with formats (texto, audio, video, E-Paper, Resumen, AI chat, etc.), using a central adapter and a single provider (PostHog) in v1, designed to work on web today and native Android/iOS tomorrow.

## 1. Problem & Goals

### Problem

Right now, MAGNUS has no unified way to answer:

*   Which formats are used the most? (texto vs audio vs video vs resumen ejecutivo vs E-Paper)
*   How users interact with:
    *   AI chat bar
    *   Date picker (E-Paper, Resumen)
    *   Saved articles
    *   Theme (light/dark)
    *   Font size
*   How behavior differs by device / OS / subscription state.

### Goals (v1)

*   **Core Measurement**: Track format consumption, feature usage, and preferences across the whole app.
*   **Clean Architecture**: Create a central analytics adapter so:
    *   UI components never know about PostHog/Mixpanel/etc.
    *   Web and native share the same event names & semantics.
*   **Privacy & Performance**:
    *   Consent-aware (user can opt-in/out).
    *   Batching / minimal overhead (mobile-first).
    *   No PII sent to third parties in v1.
*   **Future-ready**:
    *   Same event contract usable in native apps (React Native or fully native).
    *   Easy to swap provider later if needed.

## 2. Design Principles

1.  **Single Analytics Layer**: All tracking goes through `analytics.track(...)` – never directly via vendor SDKs.
2.  **Typed Event Contract**: Events and properties are defined in TypeScript types / enums to avoid “data swamp”.
3.  **Minimal Provider Choice (v1)**:
    *   v1 provider: PostHog Cloud (or self-host later).
    *   Abstraction allows switching to Mixpanel/Amplitude if needed.
4.  **High-Signal, Low-Noise**: Start with ~10–15 high-value events, not 200 “everything clicks”.
5.  **Privacy-First**:
    *   No email/name in analytics.
    *   Use internal `user_id` only.
    *   Respect consent toggle.

## 3. Architecture

### 3.1 High-Level Flow

On any platform (Web / Android / iOS):

`UI (components/hooks)` → `Analytics Adapter (analytics.ts / AnalyticsService)` → `Provider SDK (PostHog RN / Web)` → `PostHog backend` → `(Later) data warehouse / dashboards`

**No UI ever imports PostHog directly.**

### 3.2 Analytics Adapter API (Canonical)

**File (web):** `src/lib/analytics.ts`
**File (native later):** `src/services/analyticsService.ts` (same contract)

```typescript
// Event names (string literals or enum)
export type AnalyticsEventName =
  | 'article_viewed'
  | 'article_completed'
  | 'resumen_format_selected'
  | 'epaper_opened'
  | 'epaper_date_filtered'
  | 'ai_chat_used'
  | 'article_saved'
  | 'article_shared'
  | 'theme_changed'
  | 'font_size_changed'
  | 'session_started'
  | 'session_ended';

// Example props for a few events
export interface ArticleViewedProps {
  article_id: string;
  section: 'noticias' | 'resumen' | 'opinion' | 'epaper' | 'las5';
  format?: 'texto' | 'audio' | 'video' | 'epaper' | 'resumen_ejecutivo';
  entry_point?: 'home' | 'las5' | 'saved' | 'search' | 'notification';
}

export interface ThemeChangedProps {
  new_theme: 'light' | 'dark';
}

export interface FontSizeChangedProps {
  new_font_size: 'small' | 'medium' | 'large';
}

export type AnalyticsEvent =
  | { name: 'article_viewed'; properties: ArticleViewedProps }
  | { name: 'theme_changed'; properties: ThemeChangedProps }
  | { name: 'font_size_changed'; properties: FontSizeChangedProps }
  // ...and so on for other events

// Public API
export function track(event: AnalyticsEvent): void;

// Optional: user properties (global traits)
export interface UserTraits {
  user_id?: string;
  is_subscriber?: boolean;
  theme_preference?: 'light' | 'dark';
  font_size?: 'small' | 'medium' | 'large';
  device_type?: 'web' | 'android' | 'ios';
  app_version?: string;
}

export function setUserTraits(traits: Partial<UserTraits>): void;

// Consent
export function setAnalyticsConsent(granted: boolean): void;
export function getAnalyticsConsent(): boolean;
```

Implementation details (PostHog, batching, etc.) are inside this module only.

### 3.3 Web Implementation (MAGNUS HO)

Use PostHog JS SDK behind `track(...)`.

On app init (e.g. in `main.tsx` or root component):
1.  Read consent from localStorage.
2.  Initialize PostHog if consent is granted.

In components:
Use small helpers/hooks, e.g. `trackArticleView(article, { entryPoint: 'home' })`.

Example usage:

```typescript
import { track } from '@/lib/analytics';

track({
  name: 'article_viewed',
  properties: {
    article_id: article.id,
    section: 'resumen',
    format: 'audio',
    entry_point: 'las5',
  },
});
```

### 3.4 Native Implementation (Future Android / iOS)

When MAGNUS native app exists:
1.  Implement the same contract (same `AnalyticsEventName` and property types) using `posthog-react-native` or native PostHog SDK.
2.  `track(...)` on mobile should:
    *   Respect the same consent toggle.
    *   Attach device info (OS, app_version, etc.) internally.

This keeps metrics consistent across platforms.

## 4. Event Taxonomy (v1)

This is the v1 tracking plan: small, high-value, format-focused.

### 4.1 Content Consumption

*   **`article_viewed`**
    *   **Props**:
        *   `article_id`: string
        *   `section`: 'noticias' | 'resumen' | 'opinion' | 'epaper' | 'las5'
        *   `format`?: 'texto' | 'audio' | 'video' | 'epaper' | 'resumen_ejecutivo'
        *   `entry_point`?: 'home' | 'las5' | 'saved' | 'search' | 'notification'
    *   **Answers**: “Which formats are actually opened, and from where?”

*   **`article_completed`** (or `article_scrolled_80`)
    *   **Props**: `article_id`, `section`, `format`
    *   **Answers**: “Which formats are really consumed vs just opened?”

*   **`epaper_opened`**
    *   **Props**:
        *   `date`: string (YYYY-MM-DD)
        *   `entry_point`: 'home' | 'date_filter' | 'notification'
    *   **Answers**: “How much do users use E-Paper, and for which dates?”

*   **`epaper_date_filtered`**
    *   **Props**: `selected_date`: string
    *   **Answers**: “How often is the date picker used? Which days are most visited?”

*   **`resumen_format_selected`**
    *   **Props**:
        *   `article_id`: string
        *   `selected_format`: 'nota_original' | 'audio' | 'video' | 'resumen_ejecutivo'
    *   **Answers**: “Within Resumen, what format do they prefer to consume?”

### 4.2 Feature Usage

*   **`ai_chat_used`**
    *   **Props**:
        *   `context`: 'noticias' | 'resumen' | 'epaper' | 'global'
        *   `query_length`: number
    *   **Answers**: “How much is the AI chat bar used, and in which hub?”

*   **`article_saved`**
    *   **Props**: `article_id`, `section`, `format`
    *   **Answers**: “Which formats are ‘save-worthy’?”

*   **`article_shared`**
    *   **Props**:
        *   `article_id`, `section`, `format`
        *   `platform`: 'whatsapp' | 'x' | 'facebook' | 'link' | 'other'
    *   **Answers**: “What drives virality?”

### 4.3 Preferences & Settings

*   **`theme_changed`**
    *   **Props**: `new_theme`: 'light' | 'dark'
    *   **Answers**: “How many users actively choose dark mode?”

*   **`font_size_changed`**
    *   **Props**: `new_font_size`: 'small' | 'medium' | 'large'
    *   **Answers**: “How many users need larger text? Does that correlate with age/proxy segments?”

### 4.4 Session & Navigation

*   **`session_started`**
    *   **Props**: `entry_point`: 'app_icon' | 'notification' | 'share_link'
    *   **Answers**: “Where do sessions originate?”

*   **`session_ended`**
    *   **Props**: `duration_seconds`: number
    *   **Answers**: “How long do users stay per session?”

*   **(Optional v1) `screen_viewed`**
    *   **Props**: `screen_name`: 'NoticiasHub' | 'ResumenHub' | 'EpaperHub' | 'Perfil' | 'Settings'
    *   **Answers**: “Which hubs dominate navigation?”

## 5. Provider Strategy

### v1 Provider: PostHog

*   **Why**:
    *   Event analytics (what they do),
    *   Feature flags + A/B testing (test alternate Las 5 layouts, Resumen formats),
    *   Session replay (see where people struggle with E-Paper, date picker),
    *   Good support for web + native.

### Abstraction

The adapter (`analytics.track`) is provider-agnostic:
*   **Today**: only calls PostHog.
*   **Tomorrow**: we can swap to Mixpanel or add a secondary sink without touching UI.

## 6. Privacy & Consent

### No PII in Analytics (v1)
*   Do not send email, full name, or phone to PostHog.
*   Use an internal `user_id` only (hashed if desired).

### Consent Flow
1.  **On first launch**:
    *   Show a simple consent dialog: “¿Nos permites usar datos de uso anónimos para mejorar la app?”
    *   Store result in localStorage (web) / AsyncStorage (native).
2.  **`track(...)` must**:
    *   Drop events if consent is false.
    *   Queue or ignore events until consent is known.

### Settings Toggle
In Perfil/Configuración:
*   “Permitir que usemos tus datos de uso (anónimos) para mejorar la app.”
*   Flipping it calls `setAnalyticsConsent(...)`.

### Data Minimization
*   Only send event properties needed to answer product questions.
*   No free text except short fields like `query_length` or generic categories.
*   Avoid logging raw AI queries or sensitive content.

## 7. Implementation Phases

### Phase 1 – Foundation (Web, MAGNUS HO)
*   [ ] Implement `src/lib/analytics.ts` with: `track`, `setUserTraits`, `setAnalyticsConsent`.
*   [ ] PostHog initialization with env vars.
*   [ ] Add consent banner + toggle in settings.
*   [ ] Wire 3 events: `article_viewed`, `theme_changed`, `font_size_changed`.

### Phase 2 – Core Product Events
*   [ ] Add: `resumen_format_selected`, `epaper_opened`, `epaper_date_filtered`, `article_saved`, `article_shared`, `ai_chat_used`.
*   [ ] Implement small helper functions/hooks: `trackArticleView(article, { entryPoint })`, `trackResumenFormatSelection(articleId, format)`, etc.

### Phase 3 – Dashboards & Questions
*   [ ] In PostHog, create dashboards:
    *   **Format Adoption**: % of sessions with each format.
    *   **Theme & Font Usage**: breakdown of `theme_preference` and `font_size` vs avg session duration.
    *   **Feature Adoption**: AI chat usage, E-Paper usage, saved articles.

### Phase 4 – Native Apps
*   [ ] Reimplement the same track contract using `posthog-react-native`.
*   [ ] Reuse event taxonomy exactly as on web.
*   [ ] Add mobile-specific traits: `device_type: 'android' | 'ios'`, `app_version`, etc.

## 8. Agent Responsibilities & Acceptance Criteria

### Agents

*   **Analytics Architect Agent**: Owns `analytics.ts` contract and event taxonomy.
*   **Code Fixer Agent**: Integrates `track(...)` calls in key flows using helpers/hooks.
*   **Code Auditor Agent**: Ensures no component imports PostHog directly. Ensures events follow naming & property schema.
*   **Privacy/Legal Agent**: Reviews consent text, privacy policy alignment.
*   **Dark Mode / Font Size Agents**: Ensure their toggles call track correctly.

### Acceptance Criteria

Feature is **DONE** when:
*   ✅ `analytics.track(...)` exists and is the only way to send analytics.
*   ✅ Consent is respected: toggling it off stops all event sending.
*   ✅ At least these events are live and visible in PostHog:
    *   `article_viewed`
    *   `article_completed` or `article_scrolled_80`
    *   `resumen_format_selected`
    *   `epaper_opened`
    *   `epaper_date_filtered`
    *   `article_saved`
    *   `article_shared`
    *   `ai_chat_used`
    *   `theme_changed`
    *   `font_size_changed`
*   ✅ You can answer, in a PostHog dashboard:
    *   “What % of Resumen consumption is audio vs texto vs resumen ejecutivo?”
    *   “What % of active users use dark mode?”
    *   “How many people actually use the E-Paper date filter?”
