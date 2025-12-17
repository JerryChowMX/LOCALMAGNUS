import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import type { Comment } from './types';
import './Comments.css';

interface CommentItemProps {
    comment: Comment;
    onReply: (parentId: string, content: string) => void;
    onLike: (id: string) => void;
    onDislike: (id: string) => void;
}

export const CommentItem = ({ comment, onReply, onLike, onDislike }: CommentItemProps) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleSubmitReply = () => {
        if (replyContent.trim()) {
            onReply(comment.id, replyContent);
            setIsReplying(false);
            setReplyContent('');
        }
    };

    return (
        <div className={`comment-item ${comment.replyingTo ? 'is-reply' : ''}`}>
            <div className="comment-bubble">
                {/* Avatar */}
                <div className="comment-avatar">
                    <div className="comment-avatar-text">
                        {comment.author.charAt(0)}
                    </div>
                </div>

                <div className="comment-content-wrapper">
                    {/* Message Bubble */}
                    <div className="comment-message-bubble">
                        {/* Header with Name and Role */}
                        <div className="comment-header-info">
                            <span className="comment-author-name">{comment.author}</span>
                            {comment.role && (
                                <span className="comment-role-badge" style={{
                                    backgroundColor: comment.role === 'Admin' ? 'var(--magnus-blue)' : comment.role === 'Subscriber' ? 'var(--accent-brass)' : 'transparent',
                                    color: comment.role === 'Guest' ? 'var(--text-secondary)' : '#FFFFFF',
                                    border: comment.role === 'Guest' ? '1px solid var(--text-secondary)' : 'none'
                                }}>
                                    {comment.role === 'Admin' ? 'Admin' : comment.role === 'Subscriber' ? 'Suscriptor' : 'Invitado'}
                                </span>
                            )}
                            <span className="comment-timestamp">
                                {comment.replyingTo ? comment.shortTime : comment.date}
                            </span>
                        </div>

                        {/* Comment Text */}
                        <div className="comment-text">
                            {comment.replyingTo && (
                                <span className="comment-mention">@{comment.replyingTo}</span>
                            )}{' '}
                            {comment.content}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="comment-actions">
                        <button
                            onClick={() => onLike(comment.id)}
                            className={`comment-action-button ${comment.isLiked ? 'active' : ''}`}
                        >
                            <ThumbsUp size={14} fill={comment.isLiked ? 'currentColor' : 'none'} />
                            {comment.likes}
                        </button>

                        <button
                            onClick={() => onDislike(comment.id)}
                            className={`comment-action-button ${comment.isDisliked ? 'active' : ''}`}
                        >
                            <ThumbsDown size={14} fill={comment.isDisliked ? 'currentColor' : 'none'} />
                            {comment.dislikes}
                        </button>

                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className={`comment-action-button ${isReplying ? 'active' : ''}`}
                        >
                            <MessageCircle size={14} />
                            Responder
                        </button>
                    </div>

                    {/* Reply Input */}
                    {isReplying && (
                        <div className="reply-input-inline">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Escribe tu respuesta..."
                                autoFocus
                                className="reply-textarea"
                            />
                            <div className="reply-actions">
                                <button
                                    onClick={() => setIsReplying(false)}
                                    className="reply-btn reply-btn-cancel"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmitReply}
                                    disabled={!replyContent.trim()}
                                    className="reply-btn reply-btn-submit"
                                >
                                    Publicar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
