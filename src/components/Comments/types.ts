export type UserRole = 'Admin' | 'Subscriber' | 'Guest' | string;

export interface Comment {
    id: string;
    author: string;
    role?: UserRole;
    date: string; // ISO string or flexible for display
    content: string;
    likes: number;
    isLiked?: boolean;
    dislikes: number;
    isDisliked?: boolean;
    replies?: Comment[];
}
