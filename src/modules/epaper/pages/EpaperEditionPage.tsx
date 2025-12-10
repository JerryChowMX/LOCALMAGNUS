import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout';
import { HeaderContent } from '../../noticiasHub/components/HeaderContent';
import { PdfViewer } from '../components/PdfViewer';
import { useShare } from '../../../hooks/useShare';
import { AiChatBar } from '../../../components/AiChatBar';
import { ShareModal } from '../../../components/ShareModal';
import { trackEpaperOpened } from '../../../lib/analytics';
import './EpaperEditionPage.css';

export const EpaperEditionPage: React.FC = () => {
    const { date, editionNumber } = useParams<{ date: string; editionNumber: string }>();
    const navigate = useNavigate();
    const { handleShare, isModalOpen, closeModal, shareData } = useShare();

    React.useEffect(() => {
        if (date) {
            trackEpaperOpened(date, 'home');
        }
    }, [date]);

    return (
        <PageWrapper>
            <HeaderContent
                onBack={() => navigate(`/EPaper/${date}`)}
                onShare={() => handleShare({
                    title: `EPaper - Edición ${editionNumber}`,
                    analytics: {
                        articleId: `epaper_${date}_${editionNumber}`,
                        section: 'epaper',
                        format: 'pdf'
                    }
                })}
            />

            <Section padding="none">
                <PdfViewer url={`http://example.com/epaper/${date}/${editionNumber}.pdf`} />
            </Section>

            <AiChatBar context="epaper" />

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
