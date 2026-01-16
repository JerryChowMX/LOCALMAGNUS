export interface StrapiImageFormat {
    url: string;
    width: number;
    height: number;
}

export interface StrapiImage {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
    formats?: {
        thumbnail?: StrapiImageFormat;
        small?: StrapiImageFormat;
        medium?: StrapiImageFormat;
        large?: StrapiImageFormat;
    };
}

export interface StoryBookArticle {
    id: number;
    documentId: string;
    StoryDate: string;
    Headline: string;
    DestinationURl: string;
    Excerpt?: string;
    Category?: string;
    Author?: string;
    CoverImage?: StrapiImage;
}

export interface StoryBookResponse {
    data: StoryBookArticle[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        }
    }
}
