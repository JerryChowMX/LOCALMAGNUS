import type { FC } from 'react';
import './FormatViews.css';

interface InfografiaProps {
    article: any;
}

export const Infografia: FC<InfografiaProps> = ({ article }) => {
    if (!article.infographic_summary) {
        return (
            <div className="article-format-view-container standard-article-content">
                <p className="article-format-empty">
                    Infografía no disponible
                </p>
            </div>
        );
    }

    return (
        <div className="article-format-view-container standard-article-content">
            <div className="article-format-slide-container">
                <img
                    src={article.infographic_summary.image_url}
                    alt={article.infographic_summary.caption || 'Infografía'}
                    className="article-format-slide-img"
                    style={{ margin: '0 auto', display: 'block' }}
                />

                {article.infographic_summary.caption && (
                    <p className="article-format-slide-caption">
                        {article.infographic_summary.caption}
                    </p>
                )}
            </div>

            {/* Spacer for bottom sheet */}
            <div className="article-format-spacer"></div>
        </div>
    );
};
