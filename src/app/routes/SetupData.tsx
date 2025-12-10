import { useEffect, useState } from 'react';
import { strapiClient } from '../../api/strapiClient';

export const SetupData = () => {
    const [status, setStatus] = useState<string[]>((['Initializing...']));

    const addLog = (msg: string) => setStatus(prev => [...prev, msg]);

    useEffect(() => {
        const runSetup = async () => {
            try {
                addLog("Starting setup...");

                // 1. Create or Get Author
                let authorId;
                const authors: any = await strapiClient.get('/authors?filters[name][$eq]=Ana Martínez');
                if (authors.data && authors.data.length > 0) {
                    authorId = authors.data[0].id || authors.data[0].documentId; // V5 could be documentId
                    addLog(`Found Author Ana Martínez: ${authorId}`);
                } else {
                    const newAuthor: any = await strapiClient.post('/authors', {
                        data: {
                            name: "Ana Martínez",
                            slug: "ana-martinez",
                            role: "Columnista Principal",
                            bio: "Periodista especializada en migración."
                        }
                    });
                    // In V5 response is { data: { id, documentId, ... } }
                    authorId = newAuthor.data.id || newAuthor.data.documentId;
                    addLog(`Created Author Ana Martínez: ${authorId}`);
                }

                // 2. Update Coahuila Article with Author
                // Need to find Coahuila ID first (we know slug)
                const coahuila: any = await strapiClient.get('/articles?filters[slug][$eq]=coahuila-corredor-migracion');
                if (coahuila.data && coahuila.data.length > 0) {
                    const cDocId = coahuila.data[0].documentId; // Use documentId for v5 updates usually

                    // In v5 update usually takes documentId
                    await strapiClient.put(`/articles/${cDocId}`, {
                        data: {
                            author: authorId
                        }
                    });
                    addLog(`Updated Coahuila article with Author ID ${authorId}`);
                } else {
                    addLog("Could not find Coahuila article!");
                }

                // 3. Create 2 Published Articles for Recommendations
                const articlesToCreate = [
                    { title: "Desarrollo Urbano Sostenible", slug: "desarrollo-urbano-sostenible", cat: "Ciudad" },
                    { title: "Turismo en México 2024", slug: "turismo-mexico-2024", cat: "Viajes" }
                ];

                for (const art of articlesToCreate) {
                    // Check if exists
                    const exists: any = await strapiClient.get(`/articles?filters[slug][$eq]=${art.slug}`);
                    if (exists.data && exists.data.length === 0) {
                        try {
                            await strapiClient.post('/articles', {
                                data: {
                                    title: art.title,
                                    slug: art.slug,
                                    publishedAt: new Date().toISOString(), // PUBLISH IT
                                    dek: "Un artículo de prueba para recomendaciones.",
                                    layout_type: "standard-one",
                                    author: authorId
                                    // We skip category/image for speed if not strictly needed or reuse existing
                                }
                            });
                            addLog(`Created published article: ${art.title}`);
                        } catch (e: any) {
                            addLog(`Failed to create ${art.title}: ${e.message}`);
                        }
                    } else {
                        addLog(`Article ${art.title} already exists.`);
                    }
                }

                addLog("SETUP COMPLETE");

            } catch (error: any) {
                console.error(error);
                addLog(`ERROR: ${error.message || JSON.stringify(error)}`);
            }
        };

        runSetup();
    }, []);

    return (
        <div style={{ padding: 40, fontFamily: 'monospace' }}>
            <h1>Strapi Data Setup</h1>
            <ul>
                {status.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
        </div>
    );
};
