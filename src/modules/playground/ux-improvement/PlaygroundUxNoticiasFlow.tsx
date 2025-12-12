import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';
import { AiChatBarCollapsed } from '../../../components/AiChatBar/AiChatBarCollapsed';
import { AiChatBarExpanded } from '../../../components/AiChatBar/AiChatBarExpanded';
import { HeaderContent } from '../../../modules/noticiasHub/components/HeaderContent';
import { AiCommentsExpanded } from '../../../components/AiChatBar/AiCommentsExpanded';

// Reusable Article Components (Scalable & Module-based)
import { ArticleHero } from '../../articles/components/ArticleHero';
import {
    ArticleFormatSelector,
    type ArticleFormatId
} from '../../articles/components/ArticleFormatSelector';
import { NotaOriginal } from '../../articles/components/FormatViews/NotaOriginal';
import { Video } from '../../articles/components/FormatViews/Video';
import { Podcast } from '../../articles/components/FormatViews/Podcast';
import { Presentacion } from '../../articles/components/FormatViews/Presentacion';
import { Infografia } from '../../articles/components/FormatViews/Infografia';

// Styles
import '../../../modules/articles/templates/StandardOneArticle.css';
import './components/PlaygroundStyles.css';
import './components/PodcastUx.css'; // Ensure Podcast styles are loaded
import './components/PresentacionPdf.css'; // Ensure PDF styles are loaded

// Mock data for the article
const mockArticle = {
    title: "Incendio de gran magnitud en Arteaga moviliza a bomberos y Protección Civil",
    dek: "Un incendio de gran magnitud se registró en la localidad de Arteaga, movilizando a cuerpos de bomberos y elementos de Protección Civil para controlar las llamas y evitar su propagación.",
    publishedAt: "2025-12-10",
    coverImage: {
        url: "/arteaga_fire_news_1765473141986.png",
        caption: "Bomberos combaten el incendio en Arteaga",
        credit: "Archivo Magnus"
    },
    author: {
        name: "Redacción Magnus"
    },

    // Format-specific data (separated from main article)
    audio_summary: {
        audio_file: {
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        duration_seconds: 180,
        transcript: "Un incendio de gran magnitud se registró en Arteaga, Coahuila. Bomberos de varios municipios trabajan para controlar las llamas."
    },

    video_summary: {
        video_file: {
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        },
        duration_seconds: 120,
        transcript: "Resumen en video del incendio en Arteaga."
    },

    ppt_summary: {
        slides: [
            { image_url: "/arteaga_fire_news_1765473141986.png", caption: "Incendio en Arteaga - Introducción" },
            { image_url: "/arteaga_fire_news_1765473141986.png", caption: "Movilización de bomberos" },
            { image_url: "/arteaga_fire_news_1765473141986.png", caption: "Estado actual" }
        ]
    },

    infographic_summary: {
        image_url: "/arteaga_fire_news_1765473141986.png",
        caption: "Infografía: Cronología del incendio en Arteaga"
    },

    contentBlocks: [
        {
            __component: 'article.rich-text',
            blocks: [
                {
                    type: 'paragraph',
                    content: 'Un incendio de grandes proporciones se registró la tarde del martes en la localidad de Arteaga, Coahuila, movilizando a múltiples corporaciones de bomberos y elementos de Protección Civil para controlar las llamas.'
                }
            ]
        },
        {
            __component: 'article.rich-text',
            blocks: [
                {
                    type: 'paragraph',
                    content: 'El siniestro comenzó aproximadamente a las 15:30 horas en una zona boscosa cercana al centro del pueblo mágico, provocando una densa columna de humo visible desde varios kilómetros de distancia.'
                }
            ]
        },
        {
            __component: 'article.quote',
            quote: "Bomberos de varios municipios se encuentran trabajando para controlar el incendio. La prioridad es evitar que las llamas alcancen zonas habitadas.",
            author: "Protección Civil Coahuila"
        },
        {
            __component: 'article.rich-text',
            blocks: [
                {
                    type: 'paragraph',
                    content: 'Autoridades locales activaron protocolos de emergencia y cerraron temporalmente algunos accesos a la zona para facilitar las labores de los equipos de rescate. Se desplegaron varios vehículos de bomberos, pipas de agua y personal especializado.'
                }
            ]
        },
        {
            __component: 'article.rich-text',
            blocks: [
                {
                    type: 'paragraph',
                    content: 'Hasta el momento no se han reportado personas heridas, aunque varias familias fueron evacuadas de manera preventiva. Las autoridades mantienen monitoreo constante de la situación.'
                }
            ]
        },
        {
            __component: 'article.rich-text',
            blocks: [
                {
                    type: 'paragraph',
                    content: 'Se espera que las labores de extinción continúen durante las próximas horas. Protección Civil hace un llamado a la población para evitar acercarse a la zona del incendio.'
                }
            ]
        }
    ]
};

export const PlaygroundUxNoticiasFlow = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [activeFormat, setActiveFormat] = useState<ArticleFormatId>('nota-original');

    // Calculate which formats are published (have data)
    const publishedFormats = [
        'nota-original',  // Always published
        mockArticle.video_summary && 'video',
        mockArticle.audio_summary && 'podcast',
        mockArticle.ppt_summary && 'presentacion',
        mockArticle.infographic_summary && 'infografia'
    ].filter(Boolean) as string[];

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleFormatChange = (format: ArticleFormatId) => {
        setActiveFormat(format);
    };

    return (
        <PageWrapper>
            <div className="playground-page-wrapper">

                {/* Header */}
                <HeaderContent
                    onBack={() => window.history.back()}
                />

                {/* Main content area */}
                <div className="standard-article-container">

                    {/* Header Section */}
                    <div className="standard-article-header">
                        <Text variant="caption" className="standard-article-date">
                            {formatDate(mockArticle.publishedAt)}
                        </Text>

                        <Heading level={1} className="standard-article-title">
                            {mockArticle.title}
                        </Heading>

                        {mockArticle.dek && (
                            <div className="standard-article-dek">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ children }) => <p className="playground-dek-paragraph">{children}</p>
                                    }}
                                >
                                    {mockArticle.dek}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Content Wrapper */}
                    <div className="standard-article-wrapper">

                        {/* Hero Image */}
                        <ArticleHero
                            image={mockArticle.coverImage}
                            title={mockArticle.title}
                        />

                        {/* Format Selector Component (Includes Label & Dividers) */}
                        <ArticleFormatSelector
                            activeFormat={activeFormat}
                            publishedFormats={publishedFormats}
                            onFormatChange={handleFormatChange}
                        />

                        {/* Format Content - Swaps based on active format */}
                        {/* Wrapper helps with layout if needed, but animation is inside components */}
                        <div>
                            {activeFormat === 'nota-original' && <NotaOriginal article={mockArticle} />}
                            {activeFormat === 'video' && <Video article={mockArticle} />}
                            {activeFormat === 'podcast' && <Podcast article={mockArticle} />}
                            {activeFormat === 'presentacion' && <Presentacion article={mockArticle} />}
                            {activeFormat === 'infografia' && <Infografia article={mockArticle} />}
                        </div>

                    </div>

                </div>

            </div>

            {/* AI Chat Bar */}
            <AiChatBarCollapsed
                onChatClick={() => setIsChatOpen(true)}
                onCommentsClick={() => setIsCommentsOpen(true)}
            />

            {/* Expanded Chat Modal */}
            {isChatOpen && (
                <AiChatBarExpanded onClose={() => setIsChatOpen(false)} />
            )}

            {/* Comments Modal */}
            {isCommentsOpen && (
                <AiCommentsExpanded onClose={() => setIsCommentsOpen(false)} />
            )}

        </PageWrapper>
    );
};

export default PlaygroundUxNoticiasFlow;
