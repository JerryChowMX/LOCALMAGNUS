import { useState, type FC } from 'react';
import type { Article } from '../../types';
import { PdfViewer } from '../../../epaper/components/PdfViewer';
import './FormatViews.css';

interface PresentacionProps {
    article: Article['attributes'];
}

export const Presentacion: FC<PresentacionProps> = ({ article }) => {
    const [showViewer, setShowViewer] = useState(false);

    if (!article.ppt_summary?.ppt_file?.url) {
        return (
            <div className="article-format-view-container standard-article-content">
                <p className="article-format-empty">Presentación no disponible</p>
            </div>
        );
    }

    const pdfUrl = article.ppt_summary.ppt_file.url;

    // Lazy Load State: Vertical File Card Design (Clean/Apple-like)
    if (!showViewer) {
        return (
            <div className="article-format-view-container standard-article-content" style={{ display: 'flex', justifyContent: 'center', padding: '0' }}>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '400px',
                    background: 'transparent',
                    borderRadius: '0',
                    padding: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: 'none',
                    border: 'none',
                    transition: 'all 0.2s ease',
                    marginBottom: '40px'
                }}>
                    {/* Action Button */}
                    <button
                        onClick={() => setShowViewer(true)}
                        style={{
                            width: '100%',
                            background: 'var(--magnus-blue)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '0',
                            padding: '12px 20px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--magnus-blue-hover)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--magnus-blue)'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>Descargar Presentación</span>
                    </button>
                </div>
            </div>
        );
    }

    // Active Viewer State
    return (
        <div
            className="article-format-view-container standard-article-content"
            style={{
                width: '100%',
                background: 'var(--surface-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <PdfViewer
                url={pdfUrl}
            />
        </div>
    );
};
