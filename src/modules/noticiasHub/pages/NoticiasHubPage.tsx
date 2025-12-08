import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section, Grid } from '../../../components/Layout';
import { Body } from '../../../components/Typography/Typography';
import { HeaderHubs } from '../components/HeaderHubs';
import { ArticleCard } from '../components/ArticleCard';
import { useNoticiasDate } from '../hooks/useNoticiasDate';
import { useStrapiArticles } from '../../../hooks/useStrapiArticles';
import { STRAPI_ORIGIN } from '../../../lib/env'; // Assuming env var is available or I will hardcode for now if env is not exposed
import { Divider } from '../../../components/Divider/Divider';
import './NoticiasHubPage.css';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";

export const NoticiasHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentDate, handleDateChange } = useNoticiasDate();
    // Using Strapi hook with date filter
    const { data: articles, isLoading, error } = useStrapiArticles(1, 10, currentDate);

    return (
        <PageWrapper>
            <HeaderHubs
                currentDate={currentDate}
                onDateChange={handleDateChange}
                onBack={() => navigate('/')}
            />

            <Section padding="md">
                {isLoading && <Body>Loading articles...</Body>}
                {error && <Body color="error">Error loading articles.</Body>}

                {!isLoading && !error && (
                    <Grid columns={1} gap="md">
                        {articles.map((article, index) => {
                            // Construct full image URL if relative path exists
                            const imageUrl = article.hero_image?.url
                                ? `${STRAPI_ORIGIN}${article.hero_image.url}`
                                : DEFAULT_IMAGE;

                            return (
                                <React.Fragment key={article.documentId}>
                                    <ArticleCard
                                        title={article.title}
                                        imageUrl={imageUrl}
                                        publishedAt={article.publishedAt}
                                        section={article.category?.name || 'General'}
                                        onClick={() => navigate(`/NoticiasHub/${currentDate}/${article.slug}`)} // Use slug for routing
                                    />
                                    {index < articles.length - 1 && (
                                        <Divider className="hub-divider" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Grid>
                )}

                {!isLoading && !error && articles.length === 0 && (
                    <Body>No articles found for today.</Body>
                )}
            </Section>
        </PageWrapper>
    );
};
