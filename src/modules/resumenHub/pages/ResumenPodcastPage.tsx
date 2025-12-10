import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout';
import { Body } from '../../../components/Typography/Typography';
import { HeaderContent } from '../../noticiasHub/components/HeaderContent';
import { ResumenPodcastPlayer } from '../components/ResumenPodcastPlayer';
import { useResumenDate } from '../hooks/useResumenDate';
import { useResumenPodcast } from '../hooks/useResumenPodcast';
import { useShare } from '../../../hooks/useShare';
import { ShareModal } from '../../../components/ShareModal';
import { trackArticleView } from '../../../lib/analytics';

export const ResumenPodcastPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentDate } = useResumenDate();
    const { podcast, isLoading, error } = useResumenPodcast(currentDate);
    const { handleShare, isModalOpen, closeModal, shareData } = useShare();

    React.useEffect(() => {
        if (podcast) {
            trackArticleView(`resumen_podcast_${currentDate}`, 'resumen', 'audio');
        }
    }, [podcast, currentDate]);

    return (
        <PageWrapper>
            <HeaderContent
                onBack={() => navigate(`/ResumenHub/${currentDate}`)}
                onShare={() => podcast && handleShare({
                    title: podcast.title,
                    analytics: {
                        articleId: `resumen_podcast_${currentDate}`,
                        section: 'resumen',
                        format: 'audio'
                    }
                })}
            />

            <Section padding="md">
                {isLoading && <Body>Loading podcast...</Body>}
                {error && <Body color="error">Error loading podcast.</Body>}

                {!isLoading && !error && podcast && (
                    <ResumenPodcastPlayer podcast={podcast} />
                )}
            </Section>

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
