import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Button } from '../../../components/Button/Button';
import './NotFoundPage.css';

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div className="not-found">
                <div className="not-found__code">404</div>
                <h1 className="not-found__title">Página no encontrada</h1>
                <p className="not-found__message">
                    Lo sentimos, la página que buscas no existe o fue movida.
                </p>
                <Button
                    variant="primary"
                    onClick={() => navigate('/')}
                >
                    Volver al inicio
                </Button>
            </div>
        </PageWrapper>
    );
};

export default NotFoundPage;
