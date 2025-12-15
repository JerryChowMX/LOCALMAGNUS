import { useState } from 'react';
import type { Comment } from './types';

export const useCommentSystem = (initialComments: Comment[]) => {
    const [comments, setComments] = useState<Comment[]>(initialComments);

    const handleReply = (parentId: string, content: string) => {
        setComments(prevComments => {
            const findAndAddReply = (commentsArray: Comment[]): Comment[] => {
                return commentsArray.map(comment => {
                    if (comment.id === parentId) {
                        const newReply: Comment = {
                            id: `${parentId}-r${(comment.replies?.length || 0) + 1}`,
                            author: 'Current User',
                            date: 'Just now',
                            content: content,
                            likes: 0,
                            dislikes: 0
                        };
                        return {
                            ...comment,
                            replies: [...(comment.replies || []), newReply]
                        };
                    }
                    if (comment.replies) {
                        return {
                            ...comment,
                            replies: findAndAddReply(comment.replies)
                        };
                    }
                    return comment;
                });
            };
            return findAndAddReply([...prevComments]);
        });
    };

    const handleLike = (id: string) => {
        setComments(prevComments => {
            const updateLike = (commentsArray: Comment[]): Comment[] => {
                return commentsArray.map(comment => {
                    if (comment.id === id) {
                        let newLikes = comment.likes;
                        let newIsLiked = !comment.isLiked;
                        let newDislikes = comment.dislikes;
                        let newIsDisliked = comment.isDisliked;

                        if (newIsLiked) {
                            newLikes++;
                            if (newIsDisliked) {
                                newIsDisliked = false;
                                newDislikes--;
                            }
                        } else {
                            newLikes--;
                        }
                        return { ...comment, likes: newLikes, isLiked: newIsLiked, dislikes: newDislikes, isDisliked: newIsDisliked };
                    }
                    if (comment.replies) {
                        return { ...comment, replies: updateLike(comment.replies) };
                    }
                    return comment;
                });
            };
            return updateLike([...prevComments]);
        });
    };

    const handleDislike = (id: string) => {
        setComments(prevComments => {
            const updateDislike = (commentsArray: Comment[]): Comment[] => {
                return commentsArray.map(comment => {
                    if (comment.id === id) {
                        let newDislikes = comment.dislikes;
                        let newIsDisliked = !comment.isDisliked;
                        let newLikes = comment.likes;
                        let newIsLiked = comment.isLiked;

                        if (newIsDisliked) {
                            newDislikes++;
                            if (newIsLiked) {
                                newIsLiked = false;
                                newLikes--;
                            }
                        } else {
                            newDislikes--;
                        }
                        return { ...comment, dislikes: newDislikes, isDisliked: newIsDisliked, likes: newLikes, isLiked: newIsLiked };
                    }
                    if (comment.replies) {
                        return { ...comment, replies: updateDislike(comment.replies) };
                    }
                    return comment;
                });
            };
            return updateDislike([...prevComments]);
        });
    };

    const handleAddComment = (content: string) => {
        const newMsg: Comment = {
            id: `new-${Date.now()}`,
            author: 'Current User',
            date: 'Just now',
            content: content,
            likes: 0,
            dislikes: 0
        };
        setComments(prev => [...prev, newMsg]);
    };

    return {
        comments,
        setComments,
        handleReply,
        handleLike,
        handleDislike,
        handleAddComment
    };
};
