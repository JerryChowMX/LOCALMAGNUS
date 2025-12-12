import type { FC } from 'react';

interface InfografiaViewProps {
    article: any;
}

export const InfografiaView: FC<InfografiaViewProps> = ({ article }) => {
    if (!article.infographic_summary) {
        return (
            <div className="standard-article-content">
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
                    Infografía no disponible
                </p>
            </div>
        );
    }

    return (
        <div className="standard-article-content">
            <div style={{ padding: '0 24px' }}>
                <img
                    src={article.infographic_summary.image_url}
                    alt={article.infographic_summary.caption || 'Infografía'}
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        display: 'block',
                        margin: '0 auto'
                    }}
                />

                {article.infographic_summary.caption && (
                    <p style={{
                        marginTop: '16px',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        maxWidth: '800px',
                        margin: '16px auto 0'
                    }}>
                        {article.infographic_summary.caption}
                    </p>
                )}
            </div>

            {/* Spacer for bottom sheet */}
            <div style={{ height: '100px' }}></div>
        </div>
    );
};
