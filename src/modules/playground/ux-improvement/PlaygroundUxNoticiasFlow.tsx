import { useState, useEffect } from 'react';
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


// Styles
import '../../../modules/articles/templates/StandardOneArticle.css';
import './components/PlaygroundStyles.css';
import './components/PodcastUx.css'; // Ensure Podcast styles are loaded
import './components/PresentacionPdf.css'; // Ensure PDF styles are loaded

// Mock data for the article
const mockArticle = {
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

        // Format-specific data
        audio_summary: {
            id: 1,
            audio_file: {
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            },
            duration: 180,
            title: "Resumen Editorial"
        },

        video_summary: {
            video_file: {
                url: "https://www.w3schools.com/html/mov_bbb.mp4"
            },
            duration: 10,
            title: "Resumen en video"
        },

        ppt_summary: {
            title: "Informe Oficial de Incendio",
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

        content: [
            {
                __component: 'shared.rich-text',
                blocks: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'Un incendio de grandes proporciones se registró la tarde del martes en la localidad de Arteaga...' }]
                    }
                ]
            },
            {
                __component: 'shared.quote',
                quote: "Bomberos de varios municipios se encuentran trabajando...",
                author: "Protección Civil Coahuila"
            }
        ]
    }
};

// New Infographic UX View (Mobile-First Minimal Vertical Card with Pan & Zoom)
const InfografiaUxView = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Zoom & Pan State
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.5, 4));
    };

    const handleZoomOut = () => {
        setScale(prev => {
            const newScale = Math.max(prev - 0.5, 1);
            if (newScale === 1) setPosition({ x: 0, y: 0 }); // Reset pos on full zoom out
            return newScale;
        });
    };

    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation(); // Prevent page scroll
        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };

    // Pan Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            e.preventDefault();
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Reset state when opening/closing
    useEffect(() => {
        if (!isOpen) handleReset();
    }, [isOpen]);

    return (
        <>
            <div style={{
                maxWidth: '420px',
                margin: '0 auto'
            }}>
                {/* Vertical Infographic Preview */}
                <div
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '9/16',
                        backgroundColor: '#F1F5F9',
                        cursor: 'pointer',
                        overflow: 'hidden'
                    }}
                >
                    {/* Real Image Placeholder */}
                    <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=1066&q=80"
                        alt="Infographic Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />

                    {/* Fullscreen Icon */}
                    <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        cursor: 'pointer',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Simulated Lightbox Overlay */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    background: 'rgba(0,0,0,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '8px',
                            zIndex: 10001
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    {/* Zoom Controls */}
                    <div style={{
                        position: 'absolute',
                        right: '24px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        zIndex: 10001
                    }}>
                        <button onClick={handleZoomIn} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <button onClick={handleReset} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                            1x
                        </button>
                        <button onClick={handleZoomOut} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                    </div>

                    {/* Main Image Container */}
                    <div
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{
                            width: '100%',
                            maxWidth: '600px',
                            height: '70vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden', // Mask overflow during zoom
                            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                            alt="Full Infographic"
                            style={{
                                listStyle: 'none',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth zoom, instant drag
                                pointerEvents: 'none', // Let container handle events
                                userSelect: 'none'
                            }}
                        />
                    </div>

                    {/* Lightbox Actions Bar */}
                    <div style={{
                        marginTop: '24px',
                        display: 'flex',
                        gap: '24px',
                        alignItems: 'center'
                    }}>
                        <button style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '30px',
                            padding: '12px 24px',
                            color: 'white',
                            fontFamily: 'var(--font-family-body)',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background 0.2s'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Descargar en HD
                        </button>

                        <button style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '46px',
                            height: '46px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export const PlaygroundUxNoticiasFlow = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [activeFormat, setActiveFormat] = useState<ArticleFormatId>('nota-original');

    // Theme Toggle State
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    // Alias attributes for cleaner access
    const article = mockArticle.attributes as any;

    // Calculate which formats are published
    const publishedFormats = [
        'nota-original',
        article.video_summary && 'video',
        article.audio_summary && 'podcast',
        article.ppt_summary && 'presentacion',
        article.infographic_summary && 'infografia'
    ].filter(Boolean) as string[];

    // Format Date
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
                <HeaderContent onBack={() => window.history.back()} />

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    style={{
                        position: 'fixed',
                        top: '80px',
                        right: '20px',
                        zIndex: 9000,
                        background: 'var(--surface-base)',
                        border: '1px solid var(--border-color)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-primary)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontWeight: 600,
                        fontSize: '12px'
                    }}
                >
                    {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                </button>

                <div className="standard-article-container">
                    <div className="standard-article-header">
                        <Text variant="caption" className="standard-article-date">
                            {formatDate(article.publishedAt)}
                        </Text>
                        <Heading level={1} className="standard-article-title">
                            {article.title}
                        </Heading>
                        {article.summary && (
                            <div className="standard-article-dek">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ children }) => <p className="playground-dek-paragraph">{children}</p>
                                    }}
                                >
                                    {article.summary}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    <div className="standard-article-wrapper">
                        <ArticleHero
                            image={article.image}
                            title={article.title}
                        />

                        <ArticleFormatSelector
                            activeFormat={activeFormat}
                            publishedFormats={publishedFormats}
                            onFormatChange={handleFormatChange}
                        />

                        <div>
                            {activeFormat === 'nota-original' && <NotaOriginal article={article} />}
                            {activeFormat === 'video' && <Video article={article} />}
                            {activeFormat === 'podcast' && <Podcast article={article} />}
                            {activeFormat === 'presentacion' && <Presentacion article={article} />}
                            {activeFormat === 'infografia' && <InfografiaUxView />}
                        </div>
                    </div>
                </div>
            </div>

            <AiChatBarCollapsed
                onChatClick={() => setIsChatOpen(true)}
                onCommentsClick={() => setIsCommentsOpen(true)}
            />
            {isChatOpen && <AiChatBarExpanded onClose={() => setIsChatOpen(false)} />}
            {isCommentsOpen && <AiCommentsExpanded onClose={() => setIsCommentsOpen(false)} />}
        </PageWrapper>
    );
};

export default PlaygroundUxNoticiasFlow;
