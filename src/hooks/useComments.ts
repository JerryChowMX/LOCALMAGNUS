import { useState, useEffect, useCallback, useMemo } from 'react';
import { commentsApi, type Comment } from '../api/commentsApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Comment as UIComment } from '../components/Comments/types';

// Format date as "17 Dic, 10:09"
function formatCommentDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month}, ${hours}:${mins}`;
}

// Format short time as "10:09"
function formatShortTime(dateStr: string): string {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}`;
}
// Helper to extract author name from various Strapi response formats
function getAuthorName(author: any): string {
    console.log('Author data:', JSON.stringify(author, null, 2));
    if (!author) return 'Usuario';
    // v5 flat: { id, name, username }
    if (author.name || author.username) {
        return author.name || author.username;
    }
    // v4 nested: { data: { id, attributes: { name, username } } }
    if (author.data?.attributes) {
        return author.data.attributes.name || author.data.attributes.username || 'Usuario';
    }
    // v4/v5 mixed: { data: { name, username } }
    if (author.data) {
        return author.data.name || author.data.username || 'Usuario';
    }
    return 'Usuario';
}

// Helper to extract parent comment ID from various Strapi formats
function getParentId(parent: any): number | null {
    if (!parent) return null;
    // v5 flat: { id, content, ... }
    if (typeof parent.id === 'number') {
        return parent.id;
    }
    // v4 nested: { data: { id } }
    if (parent.data?.id) {
        return parent.data.id;
    }
    return null;
}

// Convert API comment to UI comment (flat, with replyingTo)
function toUIComment(comment: Comment, parentAuthorName?: string): UIComment {
    return {
        id: comment.id.toString(),
        author: getAuthorName(comment.author),
        role: 'Guest',
        date: formatCommentDate(comment.createdAt),
        shortTime: formatShortTime(comment.createdAt),
        content: comment.content,
        likes: 0,
        dislikes: 0,
        replyingTo: parentAuthorName,
        replies: []
    };
}

export const useComments = (articleId: number | string | undefined) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const { showToast } = useToast();

    // Fetch comments
    const fetchComments = useCallback(async () => {
        if (!articleId) return;

        try {
            setIsLoading(true);
            const response = await commentsApi.getCommentsByArticle(articleId);
            if (response.data) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch comments', error);
        } finally {
            setIsLoading(false);
        }
    }, [articleId]);

    // Initial load
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Build flat UI comments with @mentions (grouped: replies follow their parent)
    const flatComments: UIComment[] = useMemo(() => {
        // Create a map of comment IDs to author names for @mentions
        const authorMap = new Map<number, string>();
        comments.forEach(c => {
            authorMap.set(c.id, getAuthorName(c.author));
        });

        // Separate top-level comments and replies
        const topLevel: Comment[] = [];
        const repliesMap = new Map<number, Comment[]>(); // parentId -> replies

        comments.forEach(c => {
            const parentId = getParentId(c.parent);
            if (parentId) {
                if (!repliesMap.has(parentId)) {
                    repliesMap.set(parentId, []);
                }
                repliesMap.get(parentId)!.push(c);
            } else {
                topLevel.push(c);
            }
        });

        // Sort top-level by createdAt
        topLevel.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        // Build ordered list: top-level comment followed by its replies (recursively)
        const orderedComments: Comment[] = [];

        const addWithReplies = (comment: Comment) => {
            orderedComments.push(comment);
            const replies = repliesMap.get(comment.id) || [];
            // Sort replies chronologically
            replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            replies.forEach(reply => addWithReplies(reply));
        };

        topLevel.forEach(c => addWithReplies(c));

        // Convert to UI format
        return orderedComments.map(c => {
            const parentId = getParentId(c.parent);
            const parentAuthor = parentId ? authorMap.get(parentId) : undefined;
            return toUIComment(c, parentAuthor);
        });
    }, [comments]);

    // Create top-level comment
    const submitComment = async (content: string) => {
        if (!isAuthenticated || !user) {
            showToast({ message: 'Please log in to comment', type: 'error' });
            return false;
        }
        if (!articleId) {
            showToast({ message: 'Invalid article', type: 'error' });
            return false;
        }

        try {
            setIsSubmitting(true);
            const response = await commentsApi.createComment({
                content,
                article: articleId
            });

            if (response.data) {
                const newComment: Comment = {
                    ...response.data,
                    author: {
                        data: {
                            id: Number(user.id),
                            attributes: user
                        }
                    }
                };
                setComments(prev => [...prev, newComment]);
                return true;
            }
        } catch (error) {
            console.error('Failed to post comment', error);
            showToast({ message: 'Failed to post comment', type: 'error' });
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    // Create reply to a comment
    const submitReply = async (parentId: string, content: string) => {
        if (!isAuthenticated || !user) {
            showToast({ message: 'Please log in to reply', type: 'error' });
            return false;
        }
        if (!articleId) {
            showToast({ message: 'Invalid article', type: 'error' });
            return false;
        }

        try {
            setIsSubmitting(true);
            const response = await commentsApi.createComment({
                content,
                article: articleId,
                parent: parseInt(parentId, 10)
            });

            if (response.data) {
                const newReply: Comment = {
                    ...response.data,
                    author: {
                        data: {
                            id: Number(user.id),
                            attributes: user
                        }
                    },
                    parent: {
                        data: {
                            id: parseInt(parentId, 10)
                        }
                    }
                };
                setComments(prev => [...prev, newReply]);
                return true;
            }
        } catch (error) {
            console.error('Failed to post reply', error);
            showToast({ message: 'Failed to post reply', type: 'error' });
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        comments: flatComments,
        rawComments: comments,
        isLoading,
        isSubmitting,
        submitComment,
        submitReply,
        refreshComments: fetchComments
    };
};
