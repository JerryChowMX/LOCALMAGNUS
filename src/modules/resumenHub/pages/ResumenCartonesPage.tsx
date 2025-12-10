import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout';
import { Body } from '../../../components/Typography/Typography';
import { HeaderContent } from '../../noticiasHub/components/HeaderContent';
import { ResumenCartoonStrip } from '../components/ResumenCartoonStrip';
import { useResumenDate } from '../hooks/useResumenDate';
import { useResumenCartones } from '../hooks/useResumenCartones';
import { useShare } from '../../../hooks/useShare';
import { ShareModal } from '../../../components/ShareModal';

export const ResumenCartonesPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentDate } = useResumenDate();
    const { cartoons, isLoading, error } = useResumenCartones(currentDate);
    const { handleShare, isModalOpen, closeModal, shareData } = useShare();

    return (
        <PageWrapper>
            <HeaderContent
                onBack={() => navigate(`/ResumenHub/${currentDate}`)}
                onShare={() => handleShare({
                    title: 'Cartones del día',
                    analytics: {
                        articleId: `resumen_cartoons_${currentDate}`,
                        section: 'resumen',
                        format: 'image'
                    }
                })}
            />

            <Section padding="md">
                {isLoading && <Body>Loading cartoons...</Body>}
                {error && <Body color="error">Error loading cartoons.</Body>}

                {!isLoading && !error && (
                    <ResumenCartoonStrip cartoons={cartoons} />
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
