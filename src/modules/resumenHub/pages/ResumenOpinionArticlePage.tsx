import React from 'react';
import { useParams } from 'react-router-dom';
import { ResumenArticlePage } from './ResumenArticlePage';

export const ResumenOpinionArticlePage: React.FC = () => {
    const { date } = useParams<{ date: string }>();
    return (
        <ResumenArticlePage
            backPath={`/ResumenHub/${date}/LaOpinionDelDia`}
            articleType="opinion"
        />
    );
};
