import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';
import { ResumenHeader } from './components/ResumenHeader';
import { ResumenHighlights } from './components/ResumenHighlights';
import { ResumenFooter } from './components/ResumenFooter';

export const PlaygroundResumenStaging = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: 'white' }}>
                <HeaderContent
                    onBack={() => navigate(routes.PLAYGROUND_RESUMEN_EJECUTIVO_COMPONENTS)}
                />

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <ResumenHeader
                        date="8 de diciembre de 2025"
                        title="Saltillo Amanece con Nueva Propuesta de Movilidad Sostenible"
                        dek="El Ayuntamiento presenta un plan para transformar el transporte urbano durante la próxima década"
                        imageUrl="/brain/90b14cc2-0644-4f54-b312-c8cf448dbf2f/saltillo_bus_hero_1765213173257.png"
                    />

                    <ResumenHighlights
                        items={[
                            "La nueva red de autobuses cubrirá el 85% de la zona metropolitana.",
                            "Se implementarán carriles exclusivos para reducir el tiempo de traslado en un 40%, facilitando el flujo vehicular en las arterias principales.",
                            "El sistema de pago será 100% digital mediante tarjeta única y app móvil, eliminando el uso de efectivo a bordo.",
                            "Flotilla eléctrica para reducir emisiones de carbono."
                        ]}
                    />

                    <ResumenFooter
                        thumbnailUrl="/brain/90b14cc2-0644-4f54-b312-c8cf448dbf2f/saltillo_bus_hero_1765213173257.png"
                        articleTitle="Saltillo Amanece con Nueva Propuesta de Movilidad Sostenible"
                        onReadMore={() => console.log('Read more clicked')}
                    />

                </div>
            </div>
        </PageWrapper>
    );
};
