import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section, Grid } from '../../../components/Layout';
import { HeaderHubs } from '../../noticiasHub/components/HeaderHubs';
import { ResumenOptionCard } from '../components/ResumenOptionCard';
import { useResumenDate } from '../hooks/useResumenDate';
import { Icons } from '../../../components/Icons';
import './ResumenHubPage.css';

export const ResumenHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentDate, handleDateChange } = useResumenDate();



    return (
        <PageWrapper>
            <HeaderHubs
                currentDate={currentDate}
                onDateChange={handleDateChange}
                onBack={() => navigate('/')}
            />

            <Section padding="md">
                <div className="resumen-hub-header">
                    <h1 className="resumen-hub-title">Lo que no te puedes perder</h1>
                    <p className="resumen-hub-subtitle">Aqui encuentras el contenido seleccionado mas relevante del dia.</p>
                </div>

                <Grid columns={2} gap="md">
                    <ResumenOptionCard
                        label="Las 5 del día"
                        href={`/ResumenHub/${currentDate}/Las5DelDia`}
                        icon={<Icons.book size={48} stroke={1.5} />}
                    />
                    <ResumenOptionCard
                        label="El podcast del día"
                        href={`/ResumenHub/${currentDate}/ElPodcastDelDia`}
                        icon={<Icons.podcast size={48} stroke={1.5} />}
                        recommended={true}
                    />
                    <ResumenOptionCard
                        label="La Opinión del día"
                        href={`/ResumenHub/${currentDate}/LaOpinionDelDia`}
                        icon={<Icons.opinion size={48} stroke={1.5} />}
                    />
                    <ResumenOptionCard
                        label="Fotos del día"
                        href={`/ResumenHub/${currentDate}/LasFotosDelDia`}
                        icon={<Icons.photos size={48} stroke={1.5} />}
                    />
                    <ResumenOptionCard
                        label="Cartones del día"
                        href={`/ResumenHub/${currentDate}/LosCartonesDelDia`}
                        icon={<Icons.cartoons size={48} stroke={1.5} />}
                    />
                    <ResumenOptionCard
                        label="Juegos del día"
                        href="https://vanguardia.com.mx/juegos"
                        icon={<Icons.games size={48} stroke={1.5} />}
                    />
                </Grid>
            </Section>
        </PageWrapper>
    );
};
