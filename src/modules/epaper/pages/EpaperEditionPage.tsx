import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout';
import { HeaderContent } from '../../noticiasHub/components/HeaderContent';
import { PdfViewer } from '../components/PdfViewer';
import { useShare } from '../../../hooks/useShare';
import { ShareModal } from '../../../components/ShareModal';
import { AiChatBar } from '../../../components/AiChatBar';
import { epaperApi, type EpaperEdition } from '../api/epaperApi';
import { trackEpaperOpened } from '../../../lib/analytics';
import './EpaperEditionPage.css';

export const EpaperEditionPage: React.FC = () => {
    const { date } = useParams<{ date: string }>();
    const navigate = useNavigate();
    const fullscreenRef = React.useRef<HTMLDivElement>(null);
    const { handleShare, isModalOpen, closeModal, shareData } = useShare();
    const [edition, setEdition] = useState<EpaperEdition | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showChatBar, setShowChatBar] = useState(() => {
        const saved = localStorage.getItem('magnus_epaper_chat_visible');
        return saved !== null ? saved === 'true' : true;
    });

    useEffect(() => {
        localStorage.setItem('magnus_epaper_chat_visible', String(showChatBar));
    }, [showChatBar]);

    useEffect(() => {
        const fetchEdition = async () => {
            if (!date) return;

            setLoading(true);
            setError(null);

            try {
                const data = await epaperApi.getByDate(date);
                if (data) {
                    setEdition(data);
                    trackEpaperOpened(date, 'home');
                } else {
                    setError('No se encontró el EPaper para esta fecha');
                }
            } catch (err) {
                setError('Error al cargar el EPaper');
            } finally {
                setLoading(false);
            }
        };

        fetchEdition();
    }, [date]);

    return (
        <PageWrapper>
            <HeaderContent
                onBack={() => navigate(`/EPaper/${date}`)}
                onShare={() => handleShare({
                    title: `EPaper - ${edition?.title || 'Edición del día'}`,
                    analytics: {
                        articleId: `epaper_${date}`,
                        section: 'epaper',
                        format: 'pdf'
                    }
                })}
            />

            <div ref={fullscreenRef} className="epaper-fullscreen-container">
                <Section padding="none">
                    {loading && (
                        <div className="epaper-viewer__loading">
                            <div className="epaper-viewer__spinner"></div>
                            <p>Cargando EPaper...</p>
                        </div>
                    )}

                    {error && (
                        <div className="epaper-viewer__error">
                            <p>{error}</p>
                            <button onClick={() => navigate(`/EPaper/${date}`)}>
                                Volver
                            </button>
                        </div>
                    )}

                    {!loading && !error && edition?.pdf_file?.url && (
                        <PdfViewer
                            url={edition.pdf_file.url}
                            fullscreen={!showChatBar}
                            onToggleFullscreen={() => {
                                if (!document.fullscreenElement) {
                                    fullscreenRef.current?.requestFullscreen();
                                } else {
                                    document.exitFullscreen();
                                }
                            }}
                        />
                    )}
                </Section>

                {/* Chat bar with toggle below */}
                {showChatBar && (
                    <div className="epaper-chat-container">
                        <AiChatBar context="epaper" />
                        <button
                            className="epaper-toggle-text"
                            onClick={() => setShowChatBar(false)}
                        >
                            Ocultar
                        </button>
                    </div>
                )}

                {/* Mostrar button when chat bar is hidden */}
                {!showChatBar && (
                    <button
                        className="epaper-toggle-text epaper-toggle-text--bottom"
                        onClick={() => setShowChatBar(true)}
                    >
                        Mostrar
                    </button>
                )}
            </div>

            <ShareModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={shareData?.title || ''}
                url={shareData?.url}
                analytics={shareData?.analytics}
            />
        </PageWrapper>
    );
};
