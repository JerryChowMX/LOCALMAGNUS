import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';
import { AiChatBarCollapsed } from '../../../components/AiChatBar/AiChatBarCollapsed';
import { AiChatBarExpanded } from '../../../components/AiChatBar/AiChatBarExpanded';
import { HeaderContent } from '../../../modules/noticiasHub/components/HeaderContent';
import { AiCommentsExpanded } from '../../../components/AiChatBar/AiCommentsExpanded';

// Reusable Article Components
import { ArticleHero } from '../../articles/components/ArticleHero';
import { ArticleFormatSelector, type ArticleFormatId } from '../../articles/components/ArticleFormatSelector';
import { NotaOriginal } from '../../articles/components/FormatViews/NotaOriginal';
import { Video } from '../../articles/components/FormatViews/Video';
import { Podcast } from '../../articles/components/FormatViews/Podcast';
import { Presentacion } from '../../articles/components/FormatViews/Presentacion';
import { Infografia } from '../../articles/components/FormatViews/Infografia';

// Mock Data (will be replaced with Strapi API call)
import { mockArticle } from '../../articles/mocks/articleMock';

// Styles
import '../../../modules/articles/templates/StandardOneArticle.css';
import './components/PlaygroundStyles.css';

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

    // Article data (from mock, will be from Strapi API)
    const article = mockArticle.attributes;

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
                            onFormatChange={setActiveFormat}
                        />

                        <div>
                            {activeFormat === 'nota-original' && <NotaOriginal article={article} blockMappings={null} isTtsActive={false} />}
                            {activeFormat === 'video' && <Video article={article} />}
                            {activeFormat === 'podcast' && <Podcast article={article} />}
                            {activeFormat === 'presentacion' && <Presentacion article={article} />}
                            {activeFormat === 'infografia' && <Infografia article={article} />}
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
