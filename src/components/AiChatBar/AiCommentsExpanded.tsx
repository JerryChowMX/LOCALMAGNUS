import React from 'react';
import { CommentsSection } from '../../components/Comments/CommentsSection';
import { useComments } from '../../hooks/useComments';
import './AiChatBar.css';

interface AiCommentsExpandedProps {
    onClose: () => void;
    articleId?: number;
}

export const AiCommentsExpanded: React.FC<AiCommentsExpandedProps> = ({ onClose, articleId }) => {
    const { comments, isLoading, submitComment, submitReply } = useComments(articleId);

    const handleAddComment = async (content: string) => {
        await submitComment(content);
    };

    const handleReply = async (parentId: string, content: string) => {
        await submitReply(parentId, content);
    };

    // Placeholder handlers for likes (not implemented in backend yet)
    const handleLike = (id: string) => console.log('Like:', id);
    const handleDislike = (id: string) => console.log('Dislike:', id);

    return (
        <CommentsSection
            comments={comments}
            onAddComment={handleAddComment}
            onReply={handleReply}
            onLike={handleLike}
            onDislike={handleDislike}
            onClose={onClose}
            title="Comentarios"
            style={{ zIndex: 2000 }}
        />
    );
};
