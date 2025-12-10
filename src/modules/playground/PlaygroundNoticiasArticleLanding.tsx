import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../components/Layout/PageWrapper';
import { Section, Stack } from '../../components/Layout';
import { Display } from '../../components/Typography/Typography';
import { HeaderContent } from '../noticiasHub/components/HeaderContent';
import { FormatSelectionGrid } from '../noticiasHub/components/FormatSelectionGrid';
import { ZoomableImage } from '../../components/Media/ZoomableImage';
import { AiChatBar } from '../../components/AiChatBar';
import { ShareModal } from '../../components/ShareModal';
import { useShare } from '../../hooks/useShare';
import './PlaygroundNoticiasArticleLanding.css';

// Mock Data matching user screenshot
const MOCK_ARTICLE = {
    title: "Aseguran pipa con 30 mil litros de hidrocarburo...",
    documentId: "mock-doc-id",
    hero_image: {
        url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop" // Truck/Tanker placeholder
    }
};

export const PlaygroundNoticiasArticleLanding: React.FC = () => {
    const navigate = useNavigate();
    const { handleShare, isModalOpen, closeModal, shareData } = useShare();

    // Use mock data directly
    const article = MOCK_ARTICLE;
    const imageUrl = article.hero_image.url;

    return (
        <PageWrapper>
            <HeaderContent
                onBack={() => navigate('/dev/playground/components')}
                onShare={() => handleShare({
                    title: article.title,
                    analytics: {
                        articleId: article.documentId,
                        section: 'noticias',
                        format: undefined
                    }
                })}
            />

            <Section padding="md">
                <Display align="center" className="noticias-article-title">{article.title}</Display>
            </Section>

            <Section padding="none">
                <div className="noticias-article-hero">
                    <ZoomableImage
                        src={imageUrl}
                        alt={article.title}
                        className="noticias-article-image"
                    />
                    <div className="noticias-article-gradient-overlay"></div>
                </div>
            </Section>

            <Section padding="md">
                <Stack spacing="lg" align="center">


                    <FormatSelectionGrid basePath={`/dev/playground/article/standard-one`} />

                    {/* Spacer for AI Chat Bar */}
                    <div style={{ height: '80px' }} />
                </Stack>
            </Section>

            <AiChatBar context="noticias" />

            <ShareModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={shareData?.title || ''}
                url={shareData?.url}
                analytics={shareData?.analytics}
            />
        </PageWrapper>
    );
};
