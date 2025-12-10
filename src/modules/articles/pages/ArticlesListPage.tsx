import React from 'react';
import { useArticles } from '../hooks/useArticles';
import { usePagination } from '../../../hooks/usePagination';
import { NewsCard } from '../components/NewsCard';
import { Pagination } from '../../../components/Pagination/Pagination';
import { Container, Grid, Section, Stack, Spacer } from '../../../components/Layout';
import { Display, Body } from '../../../components/Typography/Typography';

export const ArticlesListPage: React.FC = () => {
    const { currentPage, setPage, nextPage, prevPage, hasNextPage, hasPrevPage } = usePagination({
        total: 20, // Mock total for now, should come from API meta
        pageSize: 10
    });

    const { articles, meta, loading, error } = useArticles(currentPage, 10);

    // Update pagination total when meta is available
    // Note: usePagination hook might need to accept setTotal or we just pass meta.pagination.total to it if we lift state up or use effect.
    // For now, let's just use the meta from API to drive Pagination component props directly if possible, 
    // but usePagination hook manages state. 
    // Let's assume usePagination is driving the API call via currentPage.

    if (loading) {
        return (
            <Container>
                <Section padding="lg">
                    <Body>Loading articles...</Body>
                </Section>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Section padding="lg">
                    <Body color="error">{error}</Body>
                </Section>
            </Container>
        );
    }

    return (
        <Container>
            <Section padding="lg">
                <Stack spacing="lg">
                    <Display>Latest News</Display>

                    <Grid columns={3} gap="md" className="articles-grid">
                        {articles.map((article) => (
                            <NewsCard
                                key={article.id}
                                article={article}
                                onClick={() => console.log('Clicked article', article.id)}
                            />
                        ))}
                    </Grid>

                    <Spacer size="lg" />

                    {meta && (
                        <Pagination
                            currentPage={meta.pagination.page}
                            pageCount={meta.pagination.pageCount}
                            onPageChange={setPage}
                            onNext={nextPage}
                            onPrev={prevPage}
                            hasNext={hasNextPage} // Or use meta.pagination.page < meta.pagination.pageCount
                            hasPrev={hasPrevPage}
                        />
                    )}
                </Stack>
            </Section>
        </Container>
    );
};
