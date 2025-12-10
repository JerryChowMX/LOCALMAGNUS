import React from 'react';
import { Stack } from '../../../components/Layout';
import { Headline, Caption } from '../../../components/Typography/Typography';
import { ZoomableImage } from '../../../components/Media/ZoomableImage';
import type { ResumenCartoon } from '../../../types/resumen';
import './ResumenCartoonStrip.css';

export interface ResumenCartoonStripProps {
    cartoons: ResumenCartoon[];
}

export const ResumenCartoonStrip: React.FC<ResumenCartoonStripProps> = ({ cartoons }) => {
    return (
        <div className="resumen-cartoon-strip">
            {cartoons.map(cartoon => (
                <div key={cartoon.id} className="resumen-cartoon-item">
                    <Stack spacing="sm" align="center">
                        <ZoomableImage
                            src={cartoon.imageUrl}
                            alt={cartoon.title}
                            caption={cartoon.artist ? `by ${cartoon.artist}` : undefined}
                        />
                        <Headline level={4}>{cartoon.title}</Headline>
                        {cartoon.artist && <Caption>by {cartoon.artist}</Caption>}
                    </Stack>
                </div>
            ))}
        </div>
    );
};
