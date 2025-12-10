import React from 'react';
import { Stack } from '../../../components/Layout';
import { Headline, Body } from '../../../components/Typography/Typography';
import { AudioPlayer } from '../../../components/AudioPlayer/AudioPlayer';
import type { ResumenPodcast } from '../../../types/resumen';
import './ResumenPodcastPlayer.css';

export interface ResumenPodcastPlayerProps {
    podcast: ResumenPodcast;
}

export const ResumenPodcastPlayer: React.FC<ResumenPodcastPlayerProps> = ({ podcast }) => {
    return (
        <div className="resumen-podcast-player">
            <img src={podcast.imageUrl} alt={podcast.title} className="resumen-podcast-player__image" />
            <div className="resumen-podcast-player__controls">
                <Stack spacing="sm" align="center">
                    <Headline level={3} className="resumen-podcast-player__title">{podcast.title}</Headline>
                    {podcast.date && (
                        <span className="resumen-podcast-player__date">{podcast.date}</span>
                    )}
                    <Body>{podcast.description}</Body>
                    <span className="resumen-podcast-player__duration">{podcast.duration}</span>
                    <AudioPlayer
                        src={podcast.audioUrl}
                        analytics={{ articleId: podcast.id, section: 'resumen' }}
                    />
                </Stack>
            </div>
        </div>
    );
};
