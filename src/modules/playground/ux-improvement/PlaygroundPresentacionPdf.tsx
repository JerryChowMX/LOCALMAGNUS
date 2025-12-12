import { useState } from 'react';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';
import { PlaygroundHeader } from '../components/PlaygroundHeader';
import './components/PresentacionPdf.css';

const OptionMinimalist = () => {
    const [isDownloaded, setIsDownloaded] = useState(false);

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click if any
        setIsDownloaded(true);
    };

    return (
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
                Informe Anual de Sustentabilidad 2024
            </div>


            {!isDownloaded && (
                <button className="pdf-minimal-download-btn" onClick={handleDownload} style={{ animation: 'fadeIn 0.3s' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Descargar PDF</span>
                </button>
            )}
        </div>
    );
};

export const PlaygroundPresentacionPdf = () => {
    return (
        <PageWrapper>
            <PlaygroundHeader />
            <div className="playground-page-wrapper">
                <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <Text variant="caption" style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#E11D48', fontWeight: 'bold' }}>
                            UX Lab
                        </Text>
                        <Heading level={1} style={{ marginBottom: '16px', fontSize: '32px' }}>
                            PDF Presentation UX
                        </Heading>
                        <p style={{ color: '#6B7280' }}>
                            Selected Design: Minimalist Cover
                        </p>
                    </div>

                    <div className="pdf-playground-container">
                        <OptionMinimalist />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default PlaygroundPresentacionPdf;
