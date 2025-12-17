import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section, Grid } from '../../../components/Layout';
import { Body } from '../../../components/Typography/Typography';
import { EmptyState } from '../../../components/EmptyState/EmptyState';
import { HeaderCenteredStack } from '../../../components/Header/HeaderCenteredStack';
import { ArticleCard } from '../../noticiasHub/components/ArticleCard';
import { useNoticiasDate } from '../../noticiasHub/hooks/useNoticiasDate';
import { useStrapiArticles } from '../../../hooks/useStrapiArticles';
import { STRAPI_ORIGIN } from '../../../lib/env';
import { Divider } from '../../../components/Divider/Divider';
import { routes } from '../../../app/routes';
import './NotasFeedPage.css';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";

export const NotasFeedPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentDate, handleDateChange } = useNoticiasDate();
    const { data: articles, isLoading, error } = useStrapiArticles(1, 10, currentDate);

    return (
        <PageWrapper>
            <HeaderCenteredStack
                variant="light"
                currentDate={currentDate}
                onDateChange={handleDateChange}
                onBack={() => navigate('/')}
            />

            <Section padding="md">
                {isLoading && <Body>Cargando artículos...</Body>}
                {error && <Body color="error">Error cargando artículos.</Body>}

                {!isLoading && !error && (
                    <Grid columns={1} gap="md">
                        {articles.map((article, index) => {
                            const imageUrl = article.hero_image?.url
                                ? `${STRAPI_ORIGIN}${article.hero_image.url}`
                                : DEFAULT_IMAGE;

                            // Only show badge if category exists (no fallback)
                            const badgeCategory = article.category?.name;

                            return (
                                <React.Fragment key={article.documentId}>
                                    <ArticleCard
                                        title={article.title}
                                        imageUrl={imageUrl}
                                        category={badgeCategory}
                                        isSpecial={article.isSpecial}
                                        onClick={() => navigate(routes.notasArticle(currentDate, article.slug))}
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
                    <EmptyState
                        title="¡Aún no hay noticias!"
                        message="Parece que no hay artículos publicados para esta fecha. Usa el calendario para explorar otras fechas."
                    />
                )}
            </Section>
        </PageWrapper>
    );
};

export default NotasFeedPage;
