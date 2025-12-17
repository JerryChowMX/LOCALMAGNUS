import { useState, useEffect, useCallback } from 'react';
import { commentsApi, type Comment } from '../api/commentsApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const useComments = (articleId: number | undefined) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isAuthenticated, user, token } = useAuth(); // token might be needed if we manually attach author, but we'll try standard way first.
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
            // Don't show toast for fetch errors to avoid nagging, just log it.
        } finally {
            setIsLoading(false);
        }
    }, [articleId]);

    // Initial load
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Create comment
    const submitComment = async (content: string) => {
        if (!isAuthenticated || !user) {
            showToast({ message: 'Please log in to comment', type: 'error' });
            return;
        }
        if (!articleId) {
            showToast({ message: 'Invalid article', type: 'error' });
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await commentsApi.createComment({
                content,
                article: articleId
            });

            if (response.data) {
                // Optimistic update or refresh
                // Strapi usually returns the created object. 
                // However, basic create might not return populated author fields immediately.
                // We can append it manually for immediate feedback.

                const newComment: Comment = {
                    ...response.data,
                    // Manually polyfill author for display until refresh
                    author: {
                        data: {
                            id: Number(user.id),
                            attributes: user
                        }
                    }
                };

                setComments(prev => [newComment, ...prev]);
                // showToast({ message: 'Comment posted successfully', type: 'success' });
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

    return {
        comments,
        isLoading,
        isSubmitting,
        submitComment,
        refreshComments: fetchComments
    };
};
