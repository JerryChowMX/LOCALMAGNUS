import React from 'react';
import { Body } from '../../../components/Typography/Typography';
import './PdfViewer.css';

interface PdfViewerProps {
    url?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
    return (
        <div className="pdf-viewer-container">
            <div className="pdf-viewer-placeholder">
                <Body size="lg">PDF Viewer Placeholder</Body>
                {url && <Body size="sm" color="secondary">Source: {url}</Body>}
            </div>
        </div>
    );
};
