import { useState, useEffect, useCallback, useMemo } from 'react';
import { commentsApi, type Comment } from '../api/commentsApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Comment as UIComment } from '../components/Comments/types';

// Build nested comment tree from flat list
function buildCommentTree(flatComments: Comment[]): Comment[] {
    const commentMap = new Map<number, Comment & { children: Comment[] }>();
    const rootComments: (Comment & { children: Comment[] })[] = [];

    // First pass: create map with children array
    flatComments.forEach(comment => {
        commentMap.set(comment.id, { ...comment, children: [] });
    });

    // Second pass: build tree structure
    flatComments.forEach(comment => {
        const parentId = comment.parent?.data?.id;
        const commentWithChildren = commentMap.get(comment.id)!;

        if (parentId && commentMap.has(parentId)) {
            // This is a reply - add to parent's children
            commentMap.get(parentId)!.children.push(commentWithChildren);
        } else {
            // This is a root comment
            rootComments.push(commentWithChildren);
        }
    });

    return rootComments;
}

// Convert API comment to UI comment recursively
function toUIComment(comment: Comment & { children?: Comment[] }, userMap?: Map<number, any>): UIComment {
    const attrs = comment.author?.data?.attributes;
    return {
        id: comment.id.toString(),
        author: attrs?.name || attrs?.username || 'Usuario',
        role: 'Guest', // TODO: Map from user role if available
        date: new Date(comment.createdAt).toLocaleDateString(),
        content: comment.content,
        likes: 0,
        dislikes: 0,
        replies: comment.children?.map(child => toUIComment(child as Comment & { children?: Comment[] })) || []
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

    // Build nested UI comments
    const nestedComments: UIComment[] = useMemo(() => {
        const tree = buildCommentTree(comments);
        return tree.map(c => toUIComment(c as Comment & { children?: Comment[] }));
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
                // Optimistic update
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
                // Optimistic update - add reply to flat list
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
        comments: nestedComments,
        rawComments: comments,
        isLoading,
        isSubmitting,
        submitComment,
        submitReply,
        refreshComments: fetchComments
    };
};
