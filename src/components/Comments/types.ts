export type UserRole = 'Admin' | 'Subscriber' | 'Guest' | string;

export interface Comment {
    id: string;
    author: string;
    role?: UserRole;
    date: string; // Full format: "17 Dic, 10:09"
    shortTime?: string; // Short format for replies: "10:09" (optional, derived from date)
    content: string;
    likes: number;
    isLiked?: boolean;
    dislikes: number;
    isDisliked?: boolean;
    replyingTo?: string; // @mention for flat replies
    replies?: Comment[];
}
