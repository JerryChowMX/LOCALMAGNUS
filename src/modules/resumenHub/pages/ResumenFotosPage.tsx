import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout';
import { Body } from '../../../components/Typography/Typography';
import { HeaderContent } from '../../noticiasHub/components/HeaderContent';
import { ResumenPhotoGallery } from '../components/ResumenPhotoGallery';
import { useResumenDate } from '../hooks/useResumenDate';
import { useResumenPhotos } from '../hooks/useResumenPhotos';
import { useShare } from '../../../hooks/useShare';
import { ShareModal } from '../../../components/ShareModal';

export const ResumenFotosPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentDate } = useResumenDate();
    const { photos, isLoading, error } = useResumenPhotos(currentDate);
    const { handleShare, isModalOpen, closeModal, shareData } = useShare();

    return (
        <PageWrapper>
            <HeaderContent
                onBack={() => navigate(`/ResumenHub/${currentDate}`)}
                onShare={() => handleShare({
                    title: 'Fotos del día',
                    analytics: {
                        articleId: `resumen_photos_${currentDate}`,
                        section: 'resumen',
                        format: 'image'
                    }
                })}
            />

            <Section padding="md">
                {isLoading && <Body>Loading photos...</Body>}
                {error && <Body color="error">Error loading photos.</Body>}

                {!isLoading && !error && (
                    <ResumenPhotoGallery photos={photos} />
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
