export interface ArticleStandard {
    id: number | string;
    layoutType: "standard-one";

    title: string;
    dek?: string | null;
    slug: string;

    coverImage?: {
        url: string;
        alt?: string | null;
        caption?: string | null;
    };

    category: {
        id: number | string;
        name: string;
        slug: string;
    };

    tags: {
        id: number | string;
        name: string;
        slug: string;
    }[];

    publishedAt: string;
    readTimeMinutes: number;
    audioUrl?: string | null;

    author: {
        id: number | string;
        name: string;
        slug: string;
        avatarUrl?: string | null;
        role?: string;
    };

    contentBlocks: Array<any>; // Using any for now as dynamic zones can be complex, will refine if needed

    relatedArticles?: Array<{
        title: string;
        category: string;
        image: string;
        slug: string;
    }>;
}
