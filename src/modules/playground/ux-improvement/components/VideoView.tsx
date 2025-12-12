import type { FC } from 'react';

interface VideoViewProps {
    article: any;
}

export const VideoView: FC<VideoViewProps> = ({ article }) => {
    if (!article.video_summary) {
        return (
            <div className="standard-article-content">
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
                    Video no disponible
                </p>
            </div>
        );
    }

    return (
        <div className="standard-article-content">
            <div style={{ padding: '0 24px', marginBottom: '32px' }}>
                <video
                    controls
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        borderRadius: '8px',
                        backgroundColor: '#000'
                    }}
                    src={article.video_summary.video_file.url}
                >
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>

            {article.video_summary.transcript && (
                <div style={{ padding: '0 24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>
                        Transcripción
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {article.video_summary.transcript}
                    </p>
                </div>
            )}

            {/* Spacer for bottom sheet */}
            <div style={{ height: '100px' }}></div>
        </div>
    );
};
