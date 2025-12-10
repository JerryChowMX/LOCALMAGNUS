import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Caption } from '../../../components/Typography/Typography';
import { Button } from '../../../components/Button/Button';
import './HomeHubsPage.css';

import { getMonterreyDate } from '../../../lib/dateUtils';

export const HomeHubsPage: React.FC = () => {
    const navigate = useNavigate();
    const today = getMonterreyDate();
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = new Date().toLocaleDateString('es-ES', dateOptions);
    // Capitalize first letter
    const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return (
        <PageWrapper className="home-hubs">
            {/* 1. MAGNUS Logo Stack */}
            <div className="home-hubs__brand">
                <Heading level={1} className="home-hubs__logo">MAGNUS</Heading>
                <div className="home-hubs__submark">VANGUARDIA</div>
            </div>

            {/* 2. Welcome Block */}
            <div className="home-hubs__welcome">
                <Heading level={3} className="home-hubs__greeting">
                    Bienvenido de vuelta, <span className="home-hubs__username">Gerardo</span>
                </Heading>
                <Caption className="home-hubs__date">{displayDate}</Caption>
            </div>

            {/* 3. Prompt Block */}
            <Heading level={3} className="home-hubs__prompt">
                ¿Qué quieres ver hoy?
            </Heading>

            {/* 4. Main Navigation Button Group */}
            <div className="home-hubs__buttons">
                <Button
                    variant="glass"
                    size="lg"
                    fullWidth
                    onClick={() => navigate(`/NoticiasHub/${today}`)}
                >
                    Noticias del día
                </Button>

                <Button
                    variant="glass"
                    size="lg"
                    fullWidth
                    onClick={() => navigate(`/ResumenHub/${today}`)}
                >
                    Resumen del día
                </Button>

                <Button
                    variant="glass"
                    size="lg"
                    fullWidth
                    onClick={() => navigate(`/EPaper/${today}`)}
                >
                    E-Paper
                </Button>
            </div>

            {/* 5. Footer Link */}
            <div className="home-hubs__footer">
                <Button variant="ghost" size="sm" onClick={() => navigate('/PerfilHub')}>
                    Configuraciones y perfil
                </Button>
            </div>
        </PageWrapper>
    );
};
