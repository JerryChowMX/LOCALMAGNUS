export interface Article {
    id: number;
    attributes: {
        title: string;
        summary: string;
        content: Array<ContentBlock>; // Dynamic Zone content
        image: {
            url: string;
            caption?: string;
            alternativeText?: string;
        };
        publishedAt: string;
        updatedAt: string;
        author?: {
            name: string;
            avatar?: string;
            role?: string;
        };
        category?: {
            name: string;
            slug: string;
        };

        // Format-specific summaries (for the 4-format tabs)
        video_summary?: VideoSummary;
        audio_summary?: AudioSummary;
        ppt_summary?: PresentationSummary;
        infographic_summary?: InfographicSummary;
    };
}

// Dynamic Zone Content Blocks
export type ContentBlock =
    | RichTextBlock
    | QuoteBlock
    | ImageBlock
    | VideoBlock; // Extend as needed

export interface RichTextBlock {
    __component: 'shared.rich-text';
    blocks: any[]; // Strapi Blocks editor JSON structure
}

export interface QuoteBlock {
    __component: 'shared.quote';
    quote: string;
    author: string;
}

export interface ImageBlock {
    __component: 'shared.media';
    file: {
        url: string;
        caption?: string;
        alternativeText?: string;
    }
}

export interface VideoBlock {
    __component: 'shared.video';
    video_url?: string;
    video_file?: {
        url: string;
    };
}

// Summary Types
export interface VideoSummary {
    id?: number;
    video_file: {
        url: string;
        mime?: string;
    };
    thumbnail?: {
        url: string;
    };
    duration?: number;
    title?: string; // Optional override
}

export interface AudioSummary {
    id?: number;
    audio_file: {
        url: string;
        mime?: string;
    };
    duration?: number;
    title?: string;
}

export interface PresentationSummary {
    id?: number;
    title?: string;
    slides?: Array<{
        image_url: string;
        caption?: string;
    }>;
    pdf_file?: {
        url: string;
    };
}

export interface InfographicSummary {
    id?: number;
    image_url: string;
    caption?: string;
}
