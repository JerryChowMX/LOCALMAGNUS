import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Heading } from '../Typography/Typography';
import type { Comment } from './types';
import { CommentItem } from './CommentItem';
import './Comments.css';

interface CommentsSectionProps {
    comments: Comment[];
    onAddComment: (content: string) => void;
    onReply: (parentId: string, content: string) => void;
    onLike: (id: string) => void;
    onDislike: (id: string) => void;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const CommentsSection = ({
    comments,
    onAddComment,
    onReply,
    onLike,
    onDislike,
    title = 'Comentarios',
    className = '',
    style
}: CommentsSectionProps) => {
    const [newComment, setNewComment] = useState('');

    const handleAdd = () => {
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div className={`magnus-comments-wrapper ${className}`} style={style}>
            {/* Glass Chat Container */}
            <div className="magnus-comments-panel">
                {/* Fixed Header */}
                <div className="magnus-comments-header">
                    <Heading level={3} style={{ fontSize: '1.25rem', marginBottom: '0', textAlign: 'center' }}>
                        {title} ({comments.length})
                    </Heading>
                </div>

                {/* Scrollable Body */}
                <div className="magnus-comments-body">
                    {comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={onReply}
                            onLike={onLike}
                            onDislike={onDislike}
                        />
                    ))}

                    <div style={{ padding: '24px 0', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-disabled)', fontSize: '0.9rem' }}>
                            Fin de los comentarios
                        </p>
                    </div>
                </div>

                {/* Fixed Bottom Input Area */}
                <div className="magnus-comments-input-area">
                    <div className="magnus-comments-input-wrapper">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe tu comentario..."
                            className="magnus-comments-input"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={!newComment.trim()}
                            className="magnus-send-button"
                        >
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
