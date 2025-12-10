import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticleById } from '../api/articlesApi';
import type { Article } from '../api/articlesApi';
import { Container, Section, Stack, Spacer } from '../../../components/Layout';
import { Display, Headline, Body, Caption } from '../../../components/Typography/Typography';
import { Tag } from '../components/Tag';

export const ArticleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadArticle = async () => {
            if (id) {
                setLoading(true);
                const data = await fetchArticleById(Number(id));
                setArticle(data);
                setLoading(false);
            }
        };
        loadArticle();
    }, [id]);

    if (loading) return <Container><Section padding="lg"><Body>Loading...</Body></Section></Container>;
    if (!article) return <Container><Section padding="lg"><Body>Article not found</Body></Section></Container>;

    const { title, summary, content, image, category, publishedAt, author } = article.attributes;
    const date = new Date(publishedAt).toLocaleDateString();

    return (
        <article>
            {/* Hero Section */}
            <div style={{ width: '100%', height: '400px', overflow: 'hidden', position: 'relative' }}>
                <img src={image.url} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '48px 0' }}>
                    <Container>
                        <Stack spacing="md">
                            {category && <Tag label={category} />}
                            <Display color="primary" className="text-white" style={{ color: 'white' }}>{title}</Display>
                        </Stack>
                    </Container>
                </div>
            </div>

            <Container maxWidth="md">
                <Section padding="lg">
                    <Stack spacing="lg">
                        <Stack direction="row" justify="between" align="center">
                            <Stack direction="row" spacing="sm" align="center">
                                {/* Avatar placeholder */}
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddd' }} />
                                <Stack spacing="xs">
                                    <Caption>By {author?.name}</Caption>
                                    <Caption>{date}</Caption>
                                </Stack>
                            </Stack>
                            {/* Share buttons placeholder */}
                        </Stack>

                        <Headline level={3} className="article-summary">{summary}</Headline>

                        <div className="article-body">
                            <Body size="lg">{content}</Body>
                            <Spacer size="md" />
                            <Body>More content would go here...</Body>
                        </div>
                    </Stack>
                </Section>
            </Container>
        </article>
    );
};
