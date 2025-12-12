import type { FC } from 'react';
import { AudioPlayer } from '../../../../components/AudioPlayer/AudioPlayer';

interface PodcastViewProps {
    article: any;
}

export const PodcastView: FC<PodcastViewProps> = ({ article }) => {
    if (!article.audio_summary) {
        return (
            <div className="standard-article-content">
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
                    Podcast no disponible
                </p>
            </div>
        );
    }

    return (
        <div className="standard-article-content">
            <div className="standard-article-audio-wrapper">
                <AudioPlayer
                    src={article.audio_summary.audio_file.url}
                    onLike={() => console.log('Like clicked')}
                    analytics={{
                        articleId: 'playground-article',
                        section: 'noticias'
                    }}
                />
            </div>

            {article.audio_summary.transcript && (
                <div style={{ marginTop: '32px', padding: '0 24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>
                        Transcripción
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {article.audio_summary.transcript}
                    </p>
                </div>
            )}

            {/* Spacer for bottom sheet */}
            <div style={{ height: '100px' }}></div>
        </div>
    );
};
