import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Flag, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

// Types
interface Comment {
    id: string;
    author: string;
    role?: 'Admin' | 'Subscriber' | 'Guest';
    date: string;
    content: string;
    likes: number;
    isLiked?: boolean;
    dislikes: number;
    isDisliked?: boolean;
    isFlagged?: boolean;
    replies?: Comment[];
}

// 1. Standard Comment
const commentVariable1: Comment = {
    id: 'c1',
    author: 'Ricardo Morales',
    role: 'Subscriber',
    date: '2 hours ago',
    content: 'This is a fantastic article! The analysis on the economic trends in Monterrey is spot on. I particularly agreed with the point about infrastructure development.',
    likes: 24,
    isLiked: true,
    dislikes: 2,
    isDisliked: false
};

// 2. Short/Snappy Comment
const commentVariable2: Comment = {
    id: 'c2',
    author: 'Ana G.',
    date: '45 mins ago',
    content: 'Great read! 👏',
    likes: 5,
    dislikes: 0
};

// 3. Critical/Long Comment
const commentVariable3: Comment = {
    id: 'c3',
    author: 'Fernando T.',
    role: 'Guest',
    date: '5 hours ago',
    content: 'While I understand the perspective, I think the author missed a crucial detail regarding the environmental impact. We cannot just focus on growth without considering sustainability. Ideally, we should see a follow-up piece addressing these concerns specifically.',
    likes: 12,
    dislikes: 1
};

// 4. Comment with Replies (Nested)
const commentVariable4: Comment = {
    id: 'c4',
    author: 'Sofia Martinez',
    role: 'Admin',
    date: '1 hour ago',
    content: 'Thanks for the feedback everyone. We are planning a series of articles to cover the environmental aspects next week. Stay tuned!',
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
};

const CommentItem = ({ comment, onReply, onLike, onDislike, onFlag }: {
    comment: Comment;
    onReply: (parentId: string, content: string) => void;
    onLike: (id: string) => void;
    onDislike: (id: string) => void;
    onFlag: (id: string) => void;
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [areRepliesOpen, setAreRepliesOpen] = useState(true);

    const handleSubmitReply = () => {
        if (replyContent.trim()) {
            onReply(comment.id, replyContent);
            setIsReplying(false);
            setReplyContent('');
            setAreRepliesOpen(true);
        }
    };

    return (
        <div style={{ marginBottom: '24px', opacity: 1, animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #E0E7FF 0%, #F3F4F6 100%)', // Subtle gradient
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        zIndex: 1,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        marginTop: '5px' // Align with text cap-height
                    }}>
                        <div style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#4B5563',
                            fontFamily: 'var(--font-family-title)'
                        }}>
                            {comment.author.charAt(0)}
                        </div>
                    </div>
                    {/* Thread Line */}
                    {comment.replies && comment.replies.length > 0 && areRepliesOpen && (
                        <div style={{
                            width: '2px',
                            flexGrow: 1,
                            background: 'linear-gradient(to bottom, #E5E7EB 0%, rgba(229, 231, 235, 0.2) 100%)',
                            marginTop: '12px',
                            marginBottom: '0px',
                            borderRadius: '2px'
                        }} />
                    )}
                </div>

                <div style={{ flex: 1 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                        <Text variant="body" style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', fontFamily: 'var(--font-family-title)' }}>
                            {comment.author}
                        </Text>
                        {comment.role && (
                            <span style={{
                                fontSize: '0.65rem',
                                padding: '2px 8px',
                                borderRadius: '99px',
                                backgroundColor: comment.role === 'Admin' ? '#0076ab' : comment.role === 'Subscriber' ? '#FF6600' : '#F3F4F6',
                                color: comment.role === 'Guest' ? '#6B7280' : '#FFFFFF',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em',
                                marginTop: '2px' // Visual correction for alignment
                            }}>
                                {comment.role === 'Admin' ? 'Administrador' : comment.role === 'Subscriber' ? 'Suscriptor' : 'Invitado'}
                            </span>
                        )}
                    </div>

                    {/* Content - No Box, Clean Typography */}
                    <div style={{ marginBottom: '12px' }}>
                        <Text variant="body" style={{
                            color: '#374151',
                            lineHeight: '1.6',
                            fontSize: '1rem',
                            fontFamily: 'var(--font-family-body)'
                        }}>
                            {comment.content}
                        </Text>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Vote Pill */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#F3F4F6',
                            borderRadius: '20px',
                            padding: '2px 4px'
                        }}>
                            <button
                                onClick={() => onLike(comment.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: comment.isLiked ? '#0076ab' : '#6B7280',
                                    fontSize: '0.85rem',
                                    padding: '6px 10px',
                                    borderRadius: '16px',
                                    transition: 'background-color 0.2s'
                                }}
                                title="Me gusta"
                            >
                                <ThumbsUp size={16} fill={comment.isLiked ? 'currentColor' : 'none'} strokeWidth={comment.isLiked ? 2.5 : 2} />
                                <span style={{ fontWeight: comment.isLiked ? 600 : 500, minWidth: '12px' }}>{comment.likes}</span>
                            </button>

                            <div style={{ width: '1px', height: '16px', backgroundColor: '#D1D5DB' }}></div>

                            <button
                                onClick={() => onDislike(comment.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: comment.isDisliked ? '#ef4444' : '#6B7280',
                                    fontSize: '0.85rem',
                                    padding: '6px 10px',
                                    borderRadius: '16px',
                                    transition: 'background-color 0.2s'
                                }}
                                title="No me gusta"
                            >
                                <ThumbsDown size={16} fill={comment.isDisliked ? 'currentColor' : 'none'} strokeWidth={comment.isDisliked ? 2.5 : 2} />
                                <span style={{ fontWeight: comment.isDisliked ? 600 : 500, minWidth: '12px' }}>{comment.dislikes}</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: isReplying ? '#0076ab' : '#6B7280',
                                fontWeight: isReplying ? 600 : 500,
                                fontSize: '0.85rem',
                                padding: '4px 8px',
                                transition: 'color 0.2s'
                            }}
                        >
                            <MessageCircle size={18} />
                            Responder
                        </button>

                        <button
                            onClick={() => onFlag(comment.id)}
                            style={{
                                marginLeft: 'auto',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: comment.isFlagged ? '#EF4444' : '#9CA3AF',
                                padding: '4px',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            title={comment.isFlagged ? "Deshacer reporte" : "Reportar"}
                        >
                            <Flag size={16} fill={comment.isFlagged ? 'currentColor' : 'none'} />
                            {comment.isFlagged && <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Reportado</span>}
                        </button>
                    </div>

                    {/* Reply Input */}
                    {isReplying && (
                        <div style={{
                            marginTop: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            animation: 'fadeIn 0.2s ease-in',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid #E5E7EB',
                            padding: '16px'
                        }}>
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Escribe tu respuesta..."
                                autoFocus
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    resize: 'none',
                                    fontSize: '0.95rem',
                                    minHeight: '60px',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    color: '#374151'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #F3F4F6' }}>
                                <button
                                    onClick={() => setIsReplying(false)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        backgroundColor: 'transparent',
                                        color: '#6B7280',
                                        fontSize: '0.9rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 500
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmitReply}
                                    disabled={!replyContent.trim()}
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: '8px',
                                        backgroundColor: replyContent.trim() ? '#0076ab' : '#E5E7EB', // Blue for primary action
                                        color: replyContent.trim() ? '#FFFFFF' : '#9CA3AF',
                                        fontSize: '0.9rem',
                                        border: 'none',
                                        cursor: replyContent.trim() ? 'pointer' : 'not-allowed',
                                        fontWeight: 600,
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    Publicar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            {areRepliesOpen ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                                    {comment.replies.map(reply => (
                                        <CommentItem key={reply.id} comment={reply} onReply={onReply} onLike={onLike} onDislike={onDislike} onFlag={onFlag} />
                                    ))}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAreRepliesOpen(true)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#0076ab',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        padding: '8px 0',
                                        fontWeight: 500,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <div style={{ width: '20px', height: '1px', backgroundColor: '#0076ab' }}></div>
                                    Ver {comment.replies.length} respuestas
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ... imports remain the same but ensure Send icon is imported if needed, reusing icons

import { Send } from 'lucide-react';

// ... CommentItem component remains largely the same, maybe slight tweaks if needed for the container context
// But the main changes are in the PlaygroundComments layout structure.

export const PlaygroundComments = () => {
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>([commentVariable1, commentVariable2, commentVariable3, commentVariable4]);
    const [newComment, setNewComment] = useState('');

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
                                newIsDisliked = false; // Remove dislike if adding like
                                newDislikes--; // Decrement dislike count
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
                                newIsLiked = false; // Remove like if adding dislike
                                newLikes--; // Decrement like count
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

    const handleFlag = (id: string) => {
        setComments(prevComments => {
            const updateFlag = (commentsArray: Comment[]): Comment[] => {
                return commentsArray.map(comment => {
                    if (comment.id === id) {
                        return { ...comment, isFlagged: !comment.isFlagged };
                    }
                    if (comment.replies) {
                        return { ...comment, replies: updateFlag(comment.replies) };
                    }
                    return comment;
                });
            };
            return updateFlag([...prevComments]);
        });
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            const newMsg: Comment = {
                id: `new-${Date.now()}`,
                author: 'Current User',
                date: 'Just now',
                content: newComment,
                likes: 0,
                dislikes: 0
            };
            setComments([...comments, newMsg]);
            setNewComment('');
        }
    };

    return (
        <PageWrapper>
            <div style={{
                maxWidth: '600px', // Narrower for chat feel
                margin: '0 auto',
                width: '100%',
                height: 'calc(100vh - 130px)', // Account for PageWrapper padding (96px top + 16px bottom + buffer)
                backgroundColor: '#F3F4F6', // Chat background usually slightly gray
                display: 'flex',
                flexDirection: 'column'
            }}>
                <HeaderContent onBack={() => navigate('/dev/playground/components')} />

                {/* Chat Container */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    maxWidth: '100%',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden', // Contain the scroll
                    position: 'relative'
                }}>
                    {/* Fixed Header */}
                    <div style={{
                        padding: '16px 24px',
                        borderBottom: '1px solid #E5E7EB',
                        backgroundColor: '#fff',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Heading level={3} style={{ fontSize: '1.25rem', marginBottom: '0', textAlign: 'center' }}>Comentarios ({comments.length})</Heading>
                    </div>

                    {/* Scrollable Body */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {comments.map(comment => (
                            <CommentItem key={comment.id} comment={comment} onReply={handleReply} onLike={handleLike} onDislike={handleDislike} onFlag={handleFlag} />
                        ))}

                        <div style={{ padding: '24px 0', textAlign: 'center' }}>
                            <Text variant="caption" style={{ color: '#9CA3AF' }}>Fin de los comentarios</Text>
                        </div>
                    </div>

                    {/* Fixed Bottom Input Area (WhatsApp style) */}
                    <div style={{
                        padding: '16px 24px',
                        borderTop: '1px solid #E5E7EB',
                        backgroundColor: '#F9FAFB',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            border: '1px solid #E5E7EB',
                            padding: '8px 16px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Comenta algo..."
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    resize: 'none',
                                    height: '24px', // Starts small
                                    maxHeight: '100px',
                                    fontFamily: 'inherit',
                                    padding: '2px 0'
                                }}
                            />
                        </div>
                        <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: newComment.trim() ? '#FF6600' : '#E5E7EB',
                                color: '#fff',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: newComment.trim() ? 'pointer' : 'default',
                                transition: 'all 0.2s',
                                flexShrink: 0
                            }}
                        >
                            <Send size={20} style={{ marginLeft: '2px' }} />
                        </button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
