import posthog from 'posthog-js';

// ============================================================================
// TYPES & EVENTS
// ============================================================================

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

export interface ArticleViewedProps {
    article_id: string;
    section: 'noticias' | 'resumen' | 'opinion' | 'epaper' | 'las5';
    format?: 'texto' | 'audio' | 'video' | 'epaper' | 'resumen_ejecutivo';
    entry_point?: 'home' | 'las5' | 'saved' | 'search' | 'notification' | 'opinion';
}

export interface ThemeChangedProps {
    new_theme: 'light' | 'dark';
}

export interface FontSizeChangedProps {
    new_font_size: 'small' | 'medium' | 'large';
}

export interface ResumenFormatSelectedProps {
    article_id: string;
    selected_format: 'nota_original' | 'audio' | 'video' | 'resumen_ejecutivo' | 'guiada';
}

export interface EpaperOpenedProps {
    date: string;
    entry_point: 'home' | 'date_filter' | 'notification';
}

export interface EpaperDateFilteredProps {
    selected_date: string;
}

export interface AiChatUsedProps {
    context: 'noticias' | 'resumen' | 'epaper' | 'global';
    query_length: number;
}

export interface ArticleSavedProps {
    article_id: string;
    section: string;
    format?: string;
}

export interface ArticleSharedProps {
    article_id: string;
    section: string;
    format?: string;
    platform: 'whatsapp' | 'x' | 'facebook' | 'link' | 'other';
}

export interface SessionStartedProps {
    entry_point: 'app_icon' | 'notification' | 'share_link';
}

export interface SessionEndedProps {
    duration_seconds: number;
}


export type AnalyticsEvent =
    | { name: 'article_viewed'; properties: ArticleViewedProps }
    | { name: 'article_completed'; properties: ArticleViewedProps } // Reusing props for simplicity
    | { name: 'resumen_format_selected'; properties: ResumenFormatSelectedProps }
    | { name: 'epaper_opened'; properties: EpaperOpenedProps }
    | { name: 'epaper_date_filtered'; properties: EpaperDateFilteredProps }
    | { name: 'ai_chat_used'; properties: AiChatUsedProps }
    | { name: 'article_saved'; properties: ArticleSavedProps }
    | { name: 'article_shared'; properties: ArticleSharedProps }
    | { name: 'theme_changed'; properties: ThemeChangedProps }
    | { name: 'font_size_changed'; properties: FontSizeChangedProps }
    | { name: 'session_started'; properties: SessionStartedProps }
    | { name: 'session_ended'; properties: SessionEndedProps };

export interface UserTraits {
    user_id?: string;
    is_subscriber?: boolean;
    theme_preference?: 'light' | 'dark';
    font_size?: 'small' | 'medium' | 'large';
    device_type?: 'web' | 'android' | 'ios';
    app_version?: string;
}

// ============================================================================
// STATE & CONFIG
// ============================================================================

const CONSENT_KEY = 'magnus_analytics_consent';
let isInitialized = false;

// ============================================================================
// PUBLIC API
// ============================================================================

export function initAnalytics() {
    if (isInitialized) return;

    const consent = getAnalyticsConsent();

    // Only init if consent is explicitly granted
    if (consent) {
        // Replace with your actual PostHog project key and host
        // For now using placeholders or env vars if available
        const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || 'phc_PLACEHOLDER_KEY';
        const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

        posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            autocapture: false, // Strict: no autocapture
            capture_pageview: false, // Strict: manual tracking only
            persistence: 'localStorage',
        });
        isInitialized = true;
        console.log('[Analytics] Initialized');

        // Track session start
        track({
            name: 'session_started',
            properties: {
                entry_point: 'app_icon' // Default for now
            }
        });
    } else {
        console.log('[Analytics] Consent not granted, skipping init');
    }
}

export function track(event: AnalyticsEvent): void {
    if (!getAnalyticsConsent()) {
        // Drop event if no consent
        return;
    }

    if (!isInitialized) {
        // Try to init if consent exists but not initialized yet
        initAnalytics();
        if (!isInitialized) return;
    }

    try {
        posthog.capture(event.name, event.properties);
        if (import.meta.env.DEV) {
            console.log('[Analytics] Tracked:', event.name, event.properties);
        }
    } catch (error) {
        console.error('[Analytics] Error tracking event:', error);
    }
}

export function setUserTraits(traits: Partial<UserTraits>): void {
    if (!getAnalyticsConsent() || !isInitialized) return;

    try {
        if (traits.user_id) {
            posthog.identify(traits.user_id, traits);
        } else {
            posthog.setPersonProperties(traits);
        }
    } catch (error) {
        console.error('[Analytics] Error setting traits:', error);
    }
}

export function setAnalyticsConsent(granted: boolean): void {
    localStorage.setItem(CONSENT_KEY, granted ? 'true' : 'false');

    if (granted) {
        if (!isInitialized) {
            initAnalytics();
        }
        posthog.opt_in_capturing();
    } else {
        posthog.opt_out_capturing();
    }
}

export function getAnalyticsConsent(): boolean {
    return localStorage.getItem(CONSENT_KEY) === 'true';
}

export function hasConsentBeenSet(): boolean {
    return localStorage.getItem(CONSENT_KEY) !== null;
}

export function trackArticleView(
    articleId: string,
    section: ArticleViewedProps['section'],
    format?: ArticleViewedProps['format'],
    entryPoint?: ArticleViewedProps['entry_point']
) {
    track({
        name: 'article_viewed',
        properties: {
            article_id: articleId,
            section,
            format,
            entry_point: entryPoint,
        },
    });
}

export function trackResumenFormatSelected(
    articleId: string,
    selectedFormat: ResumenFormatSelectedProps['selected_format']
) {
    track({
        name: 'resumen_format_selected',
        properties: {
            article_id: articleId,
            selected_format: selectedFormat,
        },
    });
}

export function trackEpaperOpened(
    date: string,
    entryPoint: EpaperOpenedProps['entry_point']
) {
    track({
        name: 'epaper_opened',
        properties: {
            date,
            entry_point: entryPoint,
        },
    });
}

export function trackAiChatUsed(
    context: AiChatUsedProps['context'],
    queryLength: number
) {
    track({
        name: 'ai_chat_used',
        properties: {
            context,
            query_length: queryLength,
        },
    });
}

export function trackArticleSaved(
    articleId: string,
    section: string,
    format?: string
) {
    track({
        name: 'article_saved',
        properties: {
            article_id: articleId,
            section,
            format,
        },
    });
}

export function trackArticleShared(
    articleId: string,
    section: string,
    format: string | undefined,
    platform: ArticleSharedProps['platform']
) {
    track({
        name: 'article_shared',
        properties: {
            article_id: articleId,
            section,
            format,
            platform,
        },
    });
}

export function trackEpaperDateFiltered(
    selectedDate: string
) {
    track({
        name: 'epaper_date_filtered',
        properties: {
            selected_date: selectedDate,
        },
    });
}

export function trackArticleCompleted(
    articleId: string,
    section: ArticleViewedProps['section'],
    format?: ArticleViewedProps['format']
) {
    track({
        name: 'article_completed',
        properties: {
            article_id: articleId,
            section,
            format,
        },
    });
}


