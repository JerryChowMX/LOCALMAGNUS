import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout';
import { HeaderCenteredStack } from '../../../components/Header/HeaderCenteredStack';
import { EpaperCard } from '../components/EpaperCard';
import { useEpaperDate } from '../hooks/useEpaperDate';
import { getEpaperStatus } from '../utils/epaperStatus';
import { trackEpaperDateFiltered } from '../../../lib/analytics';
import './EpaperHubPage.css';

export const EpaperHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { displayDate: currentDate, handleDateChange } = useEpaperDate();

    const handleDateChangeWithTracking = (date: string) => {
        trackEpaperDateFiltered(date);
        handleDateChange(date);
    };

    const status = getEpaperStatus(currentDate);

    return (
        <PageWrapper>
            <HeaderCenteredStack
                variant="light"
                currentDate={currentDate}
                onDateChange={handleDateChangeWithTracking}
                onBack={() => navigate('/')}
            />

            <Section padding="md">
                <div className="epaper-single-edition-container">
                    <EpaperCard
                        date={currentDate}
                        status={status}
                        onClick={() => navigate(`/EPaper/${currentDate}/view`)}
                    />
                </div>
            </Section>
        </PageWrapper>
    );
};
