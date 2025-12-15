import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { CommentsSection } from '../../../../components/Comments/CommentsSection';
import { useCommentSystem } from '../../../../components/Comments/useCommentSystem';
import { MOCK_COMMENTS } from '../../../../mocks/comments';

// 1. Standard Comment
export const PlaygroundComments = () => {
    const navigate = useNavigate();
    const {
        comments,
        handleAddComment,
        handleReply,
        handleLike,
        handleDislike
    } = useCommentSystem(MOCK_COMMENTS);

    return (
        <PageWrapper>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                height: 'calc(100vh - 130px)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <HeaderContent onBack={() => navigate('/dev/playground/components')} />
                <CommentsSection
                    comments={comments}
                    onAddComment={handleAddComment}
                    onReply={handleReply}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    title="Comentarios"
                    style={{ flex: 1, minHeight: 0 }}
                />
            </div>
        </PageWrapper>
    );
};
