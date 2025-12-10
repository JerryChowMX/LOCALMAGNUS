import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../noticiasHub/components/HeaderContent';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../app/routes';
import { ResumenHeader } from '../components/ResumenHeader';
import { ResumenHighlights } from '../components/ResumenHighlights';
import { ResumenFooter } from '../components/ResumenFooter';

export const ResumenEjecutivoPage = () => {
    const navigate = useNavigate();

    // In a real implementation, this data would come from a prop, context, or API hook.
    // For now, mirroring the staging content as requested for "production" implementation of the design.
    const sampleData = {
        date: "8 de diciembre de 2025",
        title: "Saltillo Amanece con Nueva Propuesta de Movilidad Sostenible",
        dek: "El Ayuntamiento presenta un plan para transformar el transporte urbano durante la próxima década",
        imageUrl: "/brain/90b14cc2-0644-4f54-b312-c8cf448dbf2f/saltillo_bus_hero_1765213173257.png",
        highlights: [
            "La nueva red de autobuses cubrirá el 85% de la zona metropolitana.",
            "Se implementarán carriles exclusivos para reducir el tiempo de traslado en un 40%, facilitando el flujo vehicular en las arterias principales.",
            "El sistema de pago será 100% digital mediante tarjeta única y app móvil, eliminando el uso de efectivo a bordo.",
            "Flotilla eléctrica para reducir emisiones de carbono.",
        ],
        articleUrl: "/articles/saltillo-movilidad-sostenible" // Mock URL
    };

    return (
        <PageWrapper>
            <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
                <HeaderContent
                    onBack={() => navigate(routes.home)}
                />

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <ResumenHeader
                        date={sampleData.date}
                        title={sampleData.title}
                        dek={sampleData.dek}
                        imageUrl={sampleData.imageUrl}
                    />

                    <ResumenHighlights
                        items={sampleData.highlights}
                    />

                    <ResumenFooter
                        thumbnailUrl={sampleData.imageUrl}
                        articleTitle={sampleData.title}
                        onReadMore={() => navigate(sampleData.articleUrl)}
                    />

                </div>
            </div>
        </PageWrapper>
    );
};
