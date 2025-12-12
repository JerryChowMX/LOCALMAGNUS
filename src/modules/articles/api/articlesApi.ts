import type { Article } from '../types';

export interface Meta {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
}

export interface ArticlesResponse {
    data: Article[];
    meta: Meta;
}

const MOCK_ARTICLES: Article[] = Array.from({ length: 20 }).map((_, index) => ({
    id: index + 1,
    attributes: {
        title: `Article Title ${index + 1}`,
        summary: `This is a summary for article ${index + 1}.`,
        content: [
            {
                __component: 'shared.rich-text',
                blocks: [
                    { type: 'paragraph', children: [{ text: `Content paragraph for article ${index + 1}...` }] }
                ]
            }
        ],
        image: {
            url: `https://picsum.photos/seed/${index + 1}/800/600`,
            caption: "Random Placeholder",
        },
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
            name: "John Doe",
        },
        category: {
            name: index % 2 === 0 ? "Politics" : "Technology",
            slug: index % 2 === 0 ? "politics" : "technology"
        },
        // Mock formats for testing
        video_summary: index % 3 === 0 ? {
            video_file: { url: "https://www.w3schools.com/html/mov_bbb.mp4" },
            title: "Mock Video Title"
        } : undefined,
    },
}));

export const fetchArticles = async (page: number = 1, pageSize: number = 10): Promise<ArticlesResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = MOCK_ARTICLES.slice(start, end);

    return {
        data,
        meta: {
            pagination: {
                page,
                pageSize,
                pageCount: Math.ceil(MOCK_ARTICLES.length / pageSize),
                total: MOCK_ARTICLES.length,
            },
        },
    };
};

export const fetchArticleById = async (id: number): Promise<Article | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_ARTICLES.find(a => a.id === id) || null;
};
