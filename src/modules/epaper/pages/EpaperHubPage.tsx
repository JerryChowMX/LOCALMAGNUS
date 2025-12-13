import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout';
import { HeaderCenteredStack } from '../../../components/Header/HeaderCenteredStack';
import { EpaperCard } from '../components/EpaperCard';
import { preloadPdf } from '../components/PdfViewer';
import { useEpaperDate } from '../hooks/useEpaperDate';
import { epaperApi, type EpaperEdition } from '../api/epaperApi';
import { trackEpaperDateFiltered } from '../../../lib/analytics';
import './EpaperHubPage.css';

export const EpaperHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { displayDate: currentDate, handleDateChange } = useEpaperDate();
    const [edition, setEdition] = useState<EpaperEdition | null>(null);
    const [loading, setLoading] = useState(true);
    const [preloaded, setPreloaded] = useState(false);

    useEffect(() => {
        const fetchEdition = async () => {
            setLoading(true);
            setPreloaded(false);
            const data = await epaperApi.getByDate(currentDate);
            setEdition(data);
            setLoading(false);
        };
        fetchEdition();
    }, [currentDate]);

    const handleDateChangeWithTracking = (date: string) => {
        trackEpaperDateFiltered(date);
        handleDateChange(date);
    };

    // Preload PDF on hover for faster loading
    const handlePreload = useCallback(() => {
        if (edition?.pdf_file?.url && !preloaded) {
            preloadPdf(edition.pdf_file.url);
            setPreloaded(true);
        }
    }, [edition, preloaded]);

    // Determine status based on whether we have an edition
    const getStatus = () => {
        if (loading) return 'available';
        if (!edition) return 'unavailable';
        return 'available';
    };

    return (
        <PageWrapper>
            <HeaderCenteredStack
                variant="light"
                currentDate={currentDate}
                onDateChange={handleDateChangeWithTracking}
                onBack={() => navigate('/')}
            />

            <Section padding="md">
                <div
                    className="epaper-single-edition-container"
                    onMouseEnter={handlePreload}
                    onTouchStart={handlePreload}
                >
                    <EpaperCard
                        date={currentDate}
                        status={getStatus()}
                        imageUrl={edition?.cover_image?.url}
                        onClick={() => {
                            if (edition?.pdf_file?.url) {
                                navigate(`/EPaper/${currentDate}/view`);
                            }
                        }}
                    />
                </div>
            </Section>
        </PageWrapper>
    );
};
