import { useState, type FC } from 'react';
import type { Article } from '../../types';
import './FormatViews.css';
import '../../../playground/ux-improvement/components/PresentacionPdf.css';

interface PresentacionProps {
    article: Article['attributes'];
}

export const Presentacion: FC<PresentacionProps> = ({ article }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const pdfUrl = article.ppt_summary?.ppt_file?.url;
        if (!pdfUrl) {
            console.error('No PDF URL available');
            return;
        }

        setIsDownloading(true);

        try {
            // Open PDF in new tab (works for both viewing and downloading)
            window.open(pdfUrl, '_blank');
        } catch (error) {
            console.error('Download error:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    if (!article.ppt_summary?.ppt_file?.url) {
        return (
            <div className="article-format-view-container standard-article-content">
                <p className="article-format-empty">Presentación no disponible</p>
            </div>
        );
    }

    return (
        <div className="article-format-view-container standard-article-content">
            <div className="pdf-card-base pdf-opt-minimal">
                <div className="pdf-minimal-icon-circle">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                </div>
                <div className="pdf-minimal-title">
                    {article.title}
                </div>

                <button
                    className="pdf-minimal-download-btn"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    style={{ animation: 'fadeIn 0.3s' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>{isDownloading ? 'Abriendo...' : 'Ver PDF'}</span>
                </button>
            </div>

            {/* Spacer for bottom sheet */}
            <div style={{ height: '100px' }} />
        </div>
    );
};
