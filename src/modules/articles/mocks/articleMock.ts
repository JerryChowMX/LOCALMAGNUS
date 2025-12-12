import type { Article } from '../types';

/**
 * Mock article data for development and testing.
 * This structure matches the Strapi Article type and can be used
 * in playground pages before connecting to a real Strapi backend.
 */
export const mockArticle: Article = {
    id: 1,
    attributes: {
        title: "Incendio de gran magnitud en Arteaga moviliza a bomberos y Protección Civil",
        summary: "Un incendio de gran magnitud se registró en la localidad de Arteaga, movilizando a cuerpos de bomberos y elementos de Protección Civil para controlar las llamas y evitar su propagación.",
        publishedAt: "2025-12-10",
        updatedAt: "2025-12-10",
        image: {
            url: "/arteaga_fire_news_1765473141986.png",
            caption: "Bomberos combaten el incendio en Arteaga",
            alternativeText: "Vista aérea del incendio"
        },
        author: {
            name: "Redacción Magnus"
        },
        category: {
            name: "Noticias Locales",
            slug: "noticias-locales"
        },

        // Audio/Podcast format
        audio_summary: {
            id: 1,
            audio_file: {
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            },
            duration: 180,
            title: "Resumen Editorial"
        },

        // Video format
        video_summary: {
            video_file: {
                url: "https://www.w3schools.com/html/mov_bbb.mp4"
            },
            duration: 10,
            title: "Resumen en video"
        },

        // Presentation/PDF format
        ppt_summary: {
            title: "Informe Oficial de Incendio",
            slides: [
                { image_url: "/arteaga_fire_news_1765473141986.png", caption: "Incendio en Arteaga - Introducción" },
                { image_url: "/arteaga_fire_news_1765473141986.png", caption: "Movilización de bomberos" },
                { image_url: "/arteaga_fire_news_1765473141986.png", caption: "Estado actual" }
            ]
        },

        // Infographic format
        infographic_summary: {
            image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=1066&q=80",
            caption: "Infografía: Cronología del incendio en Arteaga"
        },

        // Article content blocks (Dynamic Zone)
        content: [
            {
                __component: 'shared.rich-text',
                blocks: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'Un incendio de grandes proporciones se registró la tarde del martes en la localidad de Arteaga, Coahuila. Las autoridades locales movilizaron de inmediato a cuerpos de bomberos y elementos de Protección Civil para controlar las llamas.' }]
                    },
                    {
                        type: 'paragraph',
                        children: [{ text: 'Según reportes preliminares, el incendio comenzó cerca de las 15:00 horas en una zona boscosa cercana al centro de la localidad. Las causas aún están siendo investigadas.' }]
                    }
                ]
            },
            {
                __component: 'shared.quote',
                quote: "Estamos trabajando con todos los recursos disponibles para controlar el incendio y evitar que se propague a zonas habitadas.",
                author: "Director de Protección Civil Coahuila"
            },
            {
                __component: 'shared.rich-text',
                blocks: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'Las autoridades piden a la población mantenerse alejada de la zona afectada y seguir las indicaciones de los cuerpos de emergencia.' }]
                    }
                ]
            }
        ]
    }
};

/**
 * Helper to get the mock article attributes directly.
 * Useful when the component expects just the attributes, not the full Article object.
 */
export const getMockArticleAttributes = () => mockArticle.attributes;
