import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { StandardOneArticle } from "../../../modules/articles/templates/StandardOneArticle";
import { fetchStandardArticle } from "../../../api/articlesApi";
import type { ArticleStandard } from "../../../types/articles";
import { PageWrapper } from "../../../components/Layout/PageWrapper";
import { Heading, Text } from "../../../components/Typography/Typography";

export function StandardOneRoute() {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<ArticleStandard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        const loadArticle = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log(`[Staging] Fetching article: ${slug}`);
                const data = await fetchStandardArticle(slug);

                if (!data) {
                    setError("Artículo no encontrado o error en la carga.");
                } else {
                    setArticle(data);
                }
            } catch (e) {
                console.error(e);
                setError("Error inesperado al cargar el artículo.");
            } finally {
                setLoading(false);
            }
        };

        loadArticle();
    }, [slug]);

    if (loading) {
        return (
            <PageWrapper>
                <div className="flex justify-center items-center h-screen">
                    <Text variant="body">Cargando artículo...</Text>
                </div>
            </PageWrapper>
        );
    }

    if (error || !article) {
        return (
            <PageWrapper>
                <div className="flex flex-col justify-center items-center h-screen p-8">
                    <Heading level={2} style={{ color: '#EF4444' }}>Error 404</Heading>
                    <Text variant="body">{error || "No se encontró el artículo."}</Text>
                    <Text variant="caption" style={{ marginTop: '16px' }}>Slug solicitado: {slug}</Text>
                </div>
            </PageWrapper>
        );
    }

    return <StandardOneArticle article={article} />;
}
