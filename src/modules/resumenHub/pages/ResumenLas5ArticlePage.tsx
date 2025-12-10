import React from 'react';
import { useParams } from 'react-router-dom';
import { ResumenArticlePage } from './ResumenArticlePage';

export const ResumenLas5ArticlePage: React.FC = () => {
    const { date } = useParams<{ date: string }>();
    return (
        <ResumenArticlePage
            backPath={`/ResumenHub/${date}/Las5DelDia`}
            articleType="las5"
        />
    );
};
