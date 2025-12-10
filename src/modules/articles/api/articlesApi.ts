export interface Article {
    id: number;
    attributes: {
        title: string;
        summary: string;
        content: string;
        image: {
            url: string;
        };
        publishedAt: string;
        author?: {
            name: string;
            avatar?: string;
        };
        category?: string;
    };
}

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
        summary: `This is a summary for article ${index + 1}. It describes the content briefly.`,
        content: `Full content for article ${index + 1}...`,
        image: {
            url: `https://picsum.photos/seed/${index + 1}/800/600`,
        },
        publishedAt: new Date().toISOString(),
        author: {
            name: "John Doe",
        },
        category: index % 2 === 0 ? "Politics" : "Technology",
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
