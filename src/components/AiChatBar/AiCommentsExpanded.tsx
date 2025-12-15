import React from 'react';
import { CommentsSection } from '../../components/Comments/CommentsSection';
import { useCommentSystem } from '../../components/Comments/useCommentSystem';
import { MOCK_COMMENTS } from '../../mocks/comments';
import './AiChatBar.css';

interface AiCommentsExpandedProps {
    onClose: () => void;
}

// 1. Mock Data (Same as Playground)
export const AiCommentsExpanded: React.FC<AiCommentsExpandedProps> = ({ onClose }) => {
    const {
        comments,
        handleAddComment,
        handleReply,
        handleLike,
        handleDislike
    } = useCommentSystem(MOCK_COMMENTS);

    return (
        <CommentsSection
            comments={comments}
            onAddComment={handleAddComment}
            onReply={handleReply}
            onLike={handleLike}
            onDislike={handleDislike}
            onClose={onClose}
            title="Comentarios"
            style={{ zIndex: 2000 }} // Ensure z-index is high enough if needed (though CSS handles it)
        />
    );
};
