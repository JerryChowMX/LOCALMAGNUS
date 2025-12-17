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

// Convert API comment to UI comment (flat, with replyingTo)
function toUIComment(comment: Comment, parentAuthorName?: string): UIComment {
    const attrs = comment.author?.data?.attributes;
    return {
        id: comment.id.toString(),
        author: attrs?.name || attrs?.username || 'Usuario',
        role: 'Guest',
        date: formatCommentDate(comment.createdAt),
        shortTime: formatShortTime(comment.createdAt),
        content: comment.content,
        likes: 0,
        dislikes: 0,
        replyingTo: parentAuthorName, // @mention target
        replies: [] // Always empty - flat structure
    };
}

export const useComments = (articleId: number | undefined) => {
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
            const attrs = c.author?.data?.attributes;
            authorMap.set(c.id, attrs?.name || attrs?.username || 'Usuario');
        });

        // Separate top-level comments and replies
        const topLevel: Comment[] = [];
        const repliesMap = new Map<number, Comment[]>(); // parentId -> replies

        comments.forEach(c => {
            const parentId = c.parent?.data?.id;
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
            const parentId = c.parent?.data?.id;
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
