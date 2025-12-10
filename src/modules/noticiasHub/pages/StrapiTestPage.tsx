import { useState } from 'react';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { useStrapiArticles } from '../../../hooks/useStrapiArticles';
import type { StrapiArticle } from '../../../hooks/useStrapiArticles';
import { strapiClient } from '../../../api/strapiClient';

const StrapiTestPage = () => {
    const { data: articles, isLoading, error } = useStrapiArticles();

    const [setupLog, setSetupLog] = useState<string[]>([]);

    // Setup Logic to Populate Data
    const runSetup = async () => {
        setSetupLog(['Starting setup...']);
        try {
            // 1. Create or Get Author
            let authorId;
            const authors: any = await strapiClient.get('/authors?filters[name][$eq]=Ana Martínez');
            if (authors.data && authors.data.length > 0) {
                authorId = authors.data[0].id || authors.data[0].documentId;
                setSetupLog(prev => [...prev, `Found Author: ${authorId}`]);
            } else {
                const newAuthor: any = await strapiClient.post('/authors', {
                    data: {
                        name: "Ana Martínez",
                        slug: "ana-martinez",
                        role: "Columnista Principal",
                        bio: "Periodista especializada en migración."
                    }
                });
                authorId = newAuthor.data.id || newAuthor.data.documentId;
                setSetupLog(prev => [...prev, `Created Author: ${authorId}`]);
            }

            // 2. Update Coahuila Article with Author
            const coahuila: any = await strapiClient.get('/articles?filters[slug][$eq]=coahuila-corredor-migracion');
            if (coahuila.data && coahuila.data.length > 0) {
                const cDocId = coahuila.data[0].documentId;
                await strapiClient.put(`/articles/${cDocId}`, {
                    data: { author: authorId }
                });
                setSetupLog(prev => [...prev, `Updated Coahuila with Author`]);
            } else {
                setSetupLog(prev => [...prev, `Coahuila article not found`]);
            }

            // 3. Create 2 Published Articles for Recommendations
            const articlesToCreate = [
                { title: "Desarrollo Urbano Sostenible", slug: "desarrollo-urbano-sostenible", cat: "Ciudad" },
                { title: "Turismo en México 2024", slug: "turismo-mexico-2024", cat: "Viajes" }
            ];

            for (const art of articlesToCreate) {
                const exists: any = await strapiClient.get(`/articles?filters[slug][$eq]=${art.slug}`);
                if (exists.data && exists.data.length === 0) {
                    try {
                        await strapiClient.post('/articles', {
                            data: {
                                title: art.title,
                                slug: art.slug,
                                publishedAt: new Date().toISOString(),
                                dek: "Article for recommendations.",
                                layout_type: "standard-one",
                                author: authorId
                            }
                        });
                        setSetupLog(prev => [...prev, `Created: ${art.title}`]);
                    } catch (e: any) {
                        setSetupLog(prev => [...prev, `Error creating ${art.title}: ${e.message}`]);
                    }
                } else {
                    setSetupLog(prev => [...prev, `Exists: ${art.title}`]);
                }
            }
            setSetupLog(prev => [...prev, "DONE. Refresh page to see changes."]);

        } catch (error: any) {
            console.error(error);
            setSetupLog(prev => [...prev, `Error: ${error.message}`]);
        }
    };

    return (
        <PageWrapper>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Strapi Integration Test</h1>
                    <button
                        onClick={runSetup}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Run Data Setup
                    </button>
                </div>

                {setupLog.length > 0 && (
                    <div className="mb-6 p-4 bg-black/50 border border-gray-700 rounded font-mono text-xs text-green-400">
                        {setupLog.map((l, i) => <div key={i}>{l}</div>)}
                    </div>
                )}

                {isLoading && <div className="text-white">Loading articles...</div>}

                {error && (
                    <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
                        Error: {error.message}
                        <br />
                        Make sure Strapi is running at http://localhost:1337
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article: StrapiArticle) => (
                            <div key={article.documentId} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg hover:border-zinc-700 transition-all">
                                {article.hero_image && (
                                    <img
                                        src={`http://localhost:1337${article.hero_image.url}`}
                                        alt={article.hero_image.alternativeText || article.description || article.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-white mb-2">{article.title}</h2>
                                    <p className="text-zinc-400 text-sm line-clamp-3">{article.excerpt}</p>

                                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                                        <span>{article.category?.name || 'Uncategorized'}</span>
                                        <span>{article.reading_time || 0} min read</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && !error && articles.length === 0 && (
                    <div className="text-zinc-500">No articles found in Strapi.</div>
                )}
            </div>
        </PageWrapper>
    );
};

export default StrapiTestPage;
