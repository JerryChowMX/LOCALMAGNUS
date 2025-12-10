// Type definitions for Strapi Article Content Blocks

export interface StrapiQuote {
    id: number;
    quote: string;
    author: string;
}

export interface StrapiAuthor {
    id: number;
    name: string;
    // We only need the name for the minimalist design, but keeping it flexible
}

export interface StrapiGalleryImage {
    id: number;
    url: string;
    caption?: string;
    alt?: string;
}

export interface StrapiGallery {
    id: number;
    images: StrapiGalleryImage[];
}

export interface StrapiRichTextBlock {
    type: 'paragraph' | 'heading' | 'list';
    content?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6; // For headings
    items?: string[]; // For lists
    ordered?: boolean; // For lists
}

export interface StrapiRichText {
    id: number;
    blocks: StrapiRichTextBlock[];
}

// Union type for all content blocks
export type ArticleContentBlock =
    | { __typename: 'ComponentArticleQuote'; data: StrapiQuote }
    | { __typename: 'ComponentArticleGallery'; data: StrapiGallery }
    | { __typename: 'ComponentArticleRichText'; data: StrapiRichText }
    | { __typename: 'ComponentArticleAuthor'; data: StrapiAuthor };
