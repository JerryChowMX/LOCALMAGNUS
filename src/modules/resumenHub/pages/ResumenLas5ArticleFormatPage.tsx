import React from 'react';
import { useParams } from 'react-router-dom';
import { ResumenArticleFormatPage } from './ResumenArticleFormatPage';

export const ResumenLas5ArticleFormatPage: React.FC = () => {
    const { date, slug } = useParams<{ date: string; slug: string }>();
    return (
        <ResumenArticleFormatPage
            backPath={`/ResumenHub/${date}/Las5DelDia/${slug}`}
        />
    );
};
