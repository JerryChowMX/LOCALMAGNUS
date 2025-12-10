import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section, Grid } from '../../../components/Layout';
import { Body } from '../../../components/Typography/Typography';
import { HeaderCenteredStack } from '../../../components/Header/HeaderCenteredStack';
import { ResumenArticleCard } from '../components/ResumenArticleCard';
import { useResumenDate } from '../hooks/useResumenDate';
import { useResumenOpinionArticles } from '../hooks/useResumenOpinionArticles';
import './ResumenOpinionPage.css';

export const ResumenOpinionPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentDate, handleDateChange } = useResumenDate();
    const { articles, isLoading, error } = useResumenOpinionArticles(currentDate);

    return (
        <PageWrapper>
            <HeaderCenteredStack
                variant="light"
                currentDate={currentDate}
                onDateChange={handleDateChange}
                onBack={() => navigate(`/ResumenHub/${currentDate}`)}
            />

            <Section padding="md">
                {isLoading && <Body>Loading articles...</Body>}
                {error && <Body color="error">Error loading articles.</Body>}

                {!isLoading && !error && (
                    <Grid columns={1} gap="md">
                        {articles.map(article => (
                            <ResumenArticleCard
                                key={article.id}
                                title={article.title}
                                imageUrl={article.imageUrl}

                                onClick={() => navigate(`/ResumenHub/${currentDate}/LaOpinionDelDia/${article.id}`)}
                            />
                        ))}
                    </Grid>
                )}
            </Section>
        </PageWrapper>
    );
};
