import React, { useState } from 'react';
import { CommentsSection } from '../../components/Comments/CommentsSection';
import type { Comment } from '../../components/Comments/types';
import './AiChatBar.css';

interface AiCommentsExpandedProps {
    onClose: () => void;
}

// 1. Mock Data (Same as Playground)
const MOCK_COMMENTS: Comment[] = [
    {
        id: 'c1',
        author: 'Ricardo Morales',
        role: 'Subscriber',
        date: '2 hours ago',
        content: 'This is a fantastic article! The analysis on the economic trends in Monterrey is spot on.',
        likes: 24,
        isLiked: true,
        dislikes: 2,
        isDisliked: false
    },
    {
        id: 'c2',
        author: 'Ana G.',
        date: '45 mins ago',
        content: 'Great read! 👏',
        likes: 5,
        dislikes: 0
    },
    {
        id: 'c4',
        author: 'Sofia Martinez',
        role: 'Admin',
        date: '1 hour ago',
        content: 'Thanks for the feedback everyone. We are planning a series of articles to cover the environmental aspects next week.',
        likes: 45,
        dislikes: 0,
        replies: [
            {
                id: 'c4-r1',
                author: 'Carlos D.',
                date: '30 mins ago',
                content: 'That is good news. Looking forward to it.',
                likes: 3,
                dislikes: 0
            }
        ]
    }
];

export const AiCommentsExpanded: React.FC<AiCommentsExpandedProps> = ({ onClose }) => {
    const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);

    // Handlers (Controller Logic)
    const handleReply = (parentId: string, content: string) => {
        setComments(prevComments => {
            const newComments = [...prevComments];
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
            return findAndAddReply(newComments);
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
        setComments([...comments, newMsg]);
    };

    return (
        <div className="ai-chat-modal-overlay" onClick={onClose}>
            {/* 
                Stop propagation to prevent closing when clicking inside content.
                Using style to ensure it fits nicely in the modal overlay structure.
            */}
            <div onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '600px', height: '80vh', display: 'flex' }}>
                <CommentsSection
                    comments={comments}
                    onAddComment={handleAddComment}
                    onReply={handleReply}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    title="Comentarios"
                    style={{ width: '100%', height: '100%' }}
                />
                {/* Close Button customized or overlay can just handle outside click. 
                     The design doesn't show a close button on the comments panel specifically, 
                     but standard UX usually has one or relies on clicking outside. 
                     We'll add a separate close button or rely on clicking outside. 
                     Let's add a close button absolutely positioned or rely on outside click for now as designed.
                 */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        zIndex: 2002,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                    }}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};
