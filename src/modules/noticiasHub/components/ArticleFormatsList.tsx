import React from 'react';
import { Stack } from '../../../components/Layout';
import { Button } from '../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import './ArticleFormatsList.css';

export interface ArticleFormatsListProps {
    basePath: string; // e.g. /NoticiasHub/2025-01-10/slug
}

export const ArticleFormatsList: React.FC<ArticleFormatsListProps> = ({ basePath }) => {
    const navigate = useNavigate();

    return (
        <Stack spacing="md" className="article-formats-list">
            <Button fullWidth variant="secondary" onClick={() => navigate(`${basePath}/original`)}>
                Leer nota original
            </Button>
            <Button fullWidth variant="secondary" onClick={() => navigate(`${basePath}/ejecutivo`)}>
                Resumen Ejecutivo
            </Button>
            <Button fullWidth variant="secondary" onClick={() => navigate(`${basePath}/audio`)}>
                Resumen de audio
            </Button>
            <Button fullWidth variant="secondary" onClick={() => navigate(`${basePath}/guiada`)}>
                Presentación Guiada
            </Button>
        </Stack>
    );
};
