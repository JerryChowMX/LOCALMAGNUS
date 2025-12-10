import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormatCard } from './FormatCard';
import { Icons } from '../../../components/Icons';
import './FormatSelectionGrid.css';

export interface FormatSelectionGridProps {
    basePath: string; // e.g. /NoticiasHub/2025-01-10/slug
}

export const FormatSelectionGrid: React.FC<FormatSelectionGridProps> = ({ basePath }) => {
    const navigate = useNavigate();

    const options = [
        { label: 'Nota Original', icon: <Icons.original size={48} stroke={1.5} />, path: 'original' },
        { label: 'Resumen Ejecutivo', icon: <Icons.summary size={48} stroke={1.5} />, path: 'ejecutivo' },
        { label: 'Resumen de Audio', icon: <Icons.podcast size={48} stroke={1.5} />, path: 'audio' },
        { label: 'Presentación Guiada', icon: <Icons.guided size={48} stroke={1.5} />, path: 'guiada' },
    ];

    return (
        <div className="format-selection-grid">
            {options.map((option) => (
                <FormatCard
                    key={option.path}
                    label={option.label}
                    icon={option.icon}
                    onClick={() => navigate(`${basePath}/${option.path}`)}
                />
            ))}
        </div>
    );
};
