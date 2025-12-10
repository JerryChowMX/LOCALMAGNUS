export interface NoticiasArticle {
    id: string;          // slug/id
    title: string;
    imageUrl: string;    // pre-worked image with gradient
    publishedAt: string; // ISO datetime
    section?: string;    // optional (e.g. "Saltillo", "Dinero")
    summary?: string;
    content?: string;
    audioUrl?: string;
}

export type ArticleFormat = "original" | "ejecutivo" | "audio" | "guiada";
