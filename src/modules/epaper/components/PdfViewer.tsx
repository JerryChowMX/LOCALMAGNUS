import React, { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Icons } from '../../../components/Icons';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './PdfViewer.css';

// Use CDN worker - better for production (cached, distributed, smaller bundle)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    url: string;
    fullscreen?: boolean;
    onLoad?: () => void;
    onToggleFullscreen?: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, fullscreen = false, onLoad, onToggleFullscreen }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const transformRef = React.useRef<any>(null);

    // Responsive width calculation and fullscreen detection
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                // Use full container width for fullscreen PDF
                setContainerWidth(containerRef.current.clientWidth);
            }
            setIsBrowserFullscreen(!!document.fullscreenElement);
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        document.addEventListener('fullscreenchange', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
            document.removeEventListener('fullscreenchange', updateWidth);
        };
    }, []);

    // Reset zoom when page changes
    useEffect(() => {
        if (transformRef.current) {
            transformRef.current.resetTransform();
        }
    }, [pageNumber]);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
        setLoadingProgress(100);
        onLoad?.();
    }, [onLoad]);

    const onDocumentLoadError = useCallback((error: Error) => {
        console.error('Error loading PDF:', error);
        setError('Error al cargar el PDF. Intenta de nuevo.');
        setLoading(false);
    }, []);

    const onLoadProgress = useCallback(({ loaded, total }: { loaded: number; total: number }) => {
        if (total > 0) {
            const progress = Math.round((loaded / total) * 100);
            setLoadingProgress(progress);
        }
    }, []);

    const goToPrevPage = () => {
        setPageNumber(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prev => Math.min(prev + 1, numPages || 1));
    };

    // Helper for generating PDF content to avoid duplication
    // We separate this to conditionally wrap it
    const pdfContent = (
        <div className="pdf-viewer__document" style={{ opacity: loading ? 0.3 : 1 }}>
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                onLoadProgress={onLoadProgress}
                loading={null}
            >
                <Page
                    pageNumber={pageNumber}
                    width={containerWidth || 400}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                />
            </Document>
        </div>
    );

    return (
        <div className={`pdf-viewer ${fullscreen ? 'pdf-viewer--fullscreen' : ''}`} ref={containerRef}>
            {loading && (
                <div className="pdf-viewer__loading">
                    <div className="pdf-viewer__progress-container">
                        <div
                            className="pdf-viewer__progress-bar"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <p className="pdf-viewer__progress-text">
                        Cargando... {loadingProgress}%
                    </p>
                </div>
            )}

            {error && (
                <div className="pdf-viewer__error">
                    <p>{error}</p>
                    <button
                        className="pdf-viewer__retry-btn"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            )}

            <div className={`pdf-viewer__content ${isBrowserFullscreen ? 'pdf-viewer__content--zoomable' : ''}`}>
                {/* Left Navigation */}
                {numPages && !loading && (
                    <button
                        className="pdf-viewer__nav-chevron pdf-viewer__nav-chevron--left"
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        aria-label="Página anterior"
                    >
                        ‹
                    </button>
                )}

                {/* PDF Document - Conditional Zoom Wrapper if in Browser Fullscreen */}
                {isBrowserFullscreen ? (
                    <TransformWrapper
                        ref={transformRef}
                        initialScale={1}
                        minScale={1}
                        maxScale={4}
                        centerOnInit={true}
                        wheel={{ step: 0.1 }}
                    >
                        <TransformComponent
                            wrapperStyle={{ width: '100%', height: '100%' }}
                            contentStyle={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {pdfContent}
                        </TransformComponent>
                    </TransformWrapper>
                ) : (
                    pdfContent
                )}

                {/* Right Navigation */}
                {numPages && !loading && (
                    <button
                        className="pdf-viewer__nav-chevron pdf-viewer__nav-chevron--right"
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        aria-label="Página siguiente"
                    >
                        ›
                    </button>
                )}
            </div>

            {/* Page indicator (minimal) */}
            {numPages && !loading && (
                <div className="pdf-viewer__page-indicator">
                    {pageNumber} / {numPages}
                </div>
            )}

            {/* Browser Fullscreen Toggle */}
            {!loading && (
                <button
                    className="pdf-viewer__fullscreen-btn"
                    onClick={() => {
                        if (onToggleFullscreen) {
                            onToggleFullscreen();
                        } else {
                            // Fallback to local logic if no handler provided
                            if (!document.fullscreenElement) {
                                containerRef.current?.requestFullscreen();
                            } else {
                                document.exitFullscreen();
                            }
                        }
                    }}
                    aria-label="Pantalla completa"
                >
                    <Icons.maximize size={24} />
                </button>
            )}
        </div>
    );
};

// Preload utility - call this on hover to start loading PDF early
export const preloadPdf = (url: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'fetch';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
};
