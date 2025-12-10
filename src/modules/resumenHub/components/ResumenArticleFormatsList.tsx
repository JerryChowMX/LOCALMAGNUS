import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormatCard } from '../../noticiasHub/components/FormatCard';
import { Icons } from '../../../components/Icons';
import './ResumenArticleFormatsList.css';

import { trackResumenFormatSelected } from '../../../lib/analytics';

export interface ResumenArticleFormatsListProps {
    basePath: string;
    articleId: string;
}

export const ResumenArticleFormatsList: React.FC<ResumenArticleFormatsListProps> = ({ basePath, articleId }) => {
    const navigate = useNavigate();

    const options = [
        { label: 'Nota Original', icon: <Icons.original size={48} stroke={1.5} />, path: 'original', format: 'nota_original' as const },
        { label: 'Resumen Ejecutivo', icon: <Icons.summary size={48} stroke={1.5} />, path: 'ejecutivo', format: 'resumen_ejecutivo' as const },
        { label: 'Resumen de Audio', icon: <Icons.podcast size={48} stroke={1.5} />, path: 'audio', format: 'audio' as const },
        { label: 'Presentación Guiada', icon: <Icons.guided size={48} stroke={1.5} />, path: 'guiada', format: 'guiada' as const },
    ];

    return (
        <div className="resumen-article-formats-list">
            {options.map((option) => (
                <FormatCard
                    key={option.path}
                    label={option.label}
                    icon={option.icon}
                    onClick={() => {
                        trackResumenFormatSelected(articleId, option.format);
                        navigate(`${basePath}/${option.path}`);
                    }}
                />
            ))}
        </div>
    );
};
