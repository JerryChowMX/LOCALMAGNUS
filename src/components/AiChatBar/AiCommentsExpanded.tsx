import React, { useMemo } from 'react';
import { CommentsSection } from '../../components/Comments/CommentsSection';
import { useComments } from '../../hooks/useComments';
import type { Comment as UIComment } from '../../components/Comments/types';
import './AiChatBar.css';

interface AiCommentsExpandedProps {
    onClose: () => void;
    articleId?: number;
}

export const AiCommentsExpanded: React.FC<AiCommentsExpandedProps> = ({ onClose, articleId }) => {
    const { comments: apiComments, isLoading, submitComment } = useComments(articleId);

    // Map API comments to UI comments
    const comments: UIComment[] = useMemo(() => {
        return apiComments.map(c => {
            const attrs = c.author?.data?.attributes;
            return {
                id: c.id.toString(),
                author: attrs?.name || attrs?.username || 'Usuario', // Fallback sequence
                role: 'Guest', // TODO: Map from user role if available 
                date: new Date(c.createdAt).toLocaleDateString(),
                content: c.content,
                likes: 0, // Not implemented in API yet
                dislikes: 0,
                replies: []
            };
        });
    }, [apiComments]);

    const handleAddComment = async (content: string) => {
        await submitComment(content);
    };

    // Placeholder handlers for now
    const handleReply = (parentId: string, content: string) => console.log('Reply:', parentId, content);
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
