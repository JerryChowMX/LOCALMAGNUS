import React from 'react';
import { useParams } from 'react-router-dom';
import { ResumenArticleFormatPage } from './ResumenArticleFormatPage';

export const ResumenOpinionArticleFormatPage: React.FC = () => {
    const { date, slug } = useParams<{ date: string; slug: string }>();
    return (
        <ResumenArticleFormatPage
            backPath={`/ResumenHub/${date}/LaOpinionDelDia/${slug}`}
        />
    );
};
