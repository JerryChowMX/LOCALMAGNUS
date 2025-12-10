import { useState } from 'react';
import { PageWrapper } from '../../components/Layout/PageWrapper';
import { Heading, Text } from '../../components/Typography/Typography';
import { AudioPlayer } from '../../components/AudioPlayer/AudioPlayer';
import { AiChatBarCollapsed } from '../../components/AiChatBar/AiChatBarCollapsed';
import { AiChatBarExpanded } from '../../components/AiChatBar/AiChatBarExpanded';
import { HeaderContent } from '../../modules/noticiasHub/components/HeaderContent';
import { ImageSlider } from '../../components/Media/ImageSlider';
import { useNavigate } from 'react-router-dom';

export const PlaygroundArticleStandard = () => {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', backgroundColor: '#fff', minHeight: '100vh', position: 'relative' }}>

                {/* Header - Default Share Icon */}
                <HeaderContent
                    onBack={() => navigate('/dev/playground/article')}
                />

                {/* 1. Meta info and title */}
                <div style={{ textAlign: 'center', paddingTop: '24px', paddingBottom: '16px' }}>
                    <Text variant="caption" style={{ color: '#9CA3AF', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                        12 enero 2026
                    </Text>
                    <Heading level={1} style={{ fontSize: '2rem', lineHeight: '1.2', fontWeight: 800, color: '#000', margin: '0 16px' }}>
                        Carrera BliclArteaga 2026, estos son los resultados.
                    </Heading>
                </div>

                {/* 2. Hero image with Image Slider */}
                <div style={{ position: 'relative', margin: '0 12px 24px 12px' }}>
                    <ImageSlider
                        images={[
                            {
                                src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop",
                                alt: "Corredores en la carrera",
                                caption: "Participantes en la carrera BliclArteaga 2026"
                            },
                            {
                                src: "https://images.unsplash.com/photo-1552674605-5d2178b85608?q=80&w=2070&auto=format&fit=crop",
                                alt: "Grupo de corredores",
                                caption: "El entusiasmo se vivió en cada kilómetro"
                            },
                            {
                                src: "https://images.unsplash.com/photo-1452626038306-3aae5e0f1359?q=80&w=2070&auto=format&fit=crop",
                                alt: "Corredores en maratón",
                                caption: "Más de 500 participantes se dieron cita"
                            },
                            {
                                src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
                                alt: "Preparación para la carrera",
                                caption: "Momentos previos al disparo de salida"
                            }
                        ]}
                    />
                </div>

                {/* 4. Audio player component (Reused Component) */}
                <div style={{ padding: '0 16px 24px 16px' }}>
                    <AudioPlayer
                        src="" // Mock src
                        onLike={() => console.log('Like clicked')}
                    />

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: '#E5E7EB', width: '100%', marginTop: '24px' }}></div>
                </div>

                {/* 5. Article body text */}
                <div style={{ padding: '0 16px 120px 16px' }}>
                    <Text variant="body" style={{ fontSize: '1.125rem', lineHeight: '1.75', color: '#1F2937' }}>
                        En los últimos meses, Coahuila se ha convertido en uno de los corredores más activos de migración hacia la frontera norte. Aunque las rutas cambian constantemente, la travesía de miles de personas que cruzan el estado comparte patrones comunes: largas caminatas, improvisados refugios, un clima extremo y una presión creciente de autoridades y traficantes.
                        <br /><br />
                        De acuerdo con datos recopilados por el Centro Regional de Movilidad Humana (CREMOV) —un organismo ficticio creado para este artículo—, entre enero y noviembre de 2025 han transitado por Coahuila alrededor de 142,800 migrantes, cifra que representa un aumento del 27% respecto al año anterior.
                        <br /><br />
                        <strong>El inicio: el cruce hacia la Comarca Lagunera</strong>
                        <br /><br />
                        El recorrido comienza, para la mayoría, en los límites con Durango. En la Comarca Lagunera, pequeños grupos avanzan por las vías del tren abandonadas o por brechas rurales poco vigiladas.
                        <br /><br />
                        "Llegan agotados, con poca agua. Muchos ya vienen enfermos desde antes", comenta Rocío Herrera, coordinadora del albergue Casa Luminaria en Torreón. El refugio asegura haber atendido a más de 11,500 personas en lo que va del año, principalmente familias venezolanas, hondureñas y guatemaltecas.
                        <br /><br />
                        <strong>Rumbo a Saltillo: una ruta cada vez más fragmentada</strong>
                        <br /><br />
                        El trayecto hacia la capital del estado se ha diversificado. Antes, la mayoría seguía la vía del tren; hoy, las restricciones y operativos han dispersado a los migrantes por caminos alternos.
                        <br /><br />
                        El Observatorio Norteño de Movilidad (ONM) —también ficticio— reporta que:
                        <br />
                        • 58% de los migrantes optan por caminar por la carretera federal 40 en tramos nocturnos.
                        <br />
                        • 31% utilizan transportes informales a bordo de camiones de carga o camionetas irregulares.
                        <br />
                        • 11% intentan avanzar por las vías férreas, aunque el riesgo de detenciones es mayor.
                        <br /><br />
                        En Saltillo, los albergues como Camino Frontera y Relámpago de Luz (organizaciones ficticias) están saturados.
                        <br /><br />
                        "Normalmente atendíamos a 90 personas al día. Ahora tenemos días con más de 240", afirma Héctor Maldonado, responsable del comedor comunitario.
                        <br /><br />
                        <strong>El desierto de la frontera: la parte más peligrosa</strong>
                        <br /><br />
                        La travesía hacia Acuña y Piedras Negras es considerada la más riesgosa. Las temperaturas pueden superar los 38 grados por la tarde y bajar hasta 5 grados por la noche.
                        <br /><br />
                        CREMOV estima que 3 de cada 10 personas reportan haber sido víctimas de robo o extorsión antes de llegar a la frontera. Además, alrededor del 17% afirma haber sido abandonado por "guías" o coyotes en zonas desérticas.
                        <br /><br />
                        En Piedras Negras, la llegada a la frontera del río Bravo no garantiza nada. Según testimonios recopilados por el Informe de Movilidad 2025 (documento ficticio), muchos esperan entre 4 y 12 días para obtener espacio en un refugio o la oportunidad de solicitar asilo.
                        <br /><br />
                        <strong>Los niños, la cara invisible de la crisis</strong>
                        <br /><br />
                        Un dato particularmente alarmante: el 22% de los migrantes que cruzan Coahuila son menores de 12 años, una cifra que se duplicó en dos años.
                        <br /><br />
                        Carla Montemayor, psicóloga voluntaria, explica que los niños presentan altos niveles de estrés, miedo y deshidratación. "Ellos no entienden la frontera; entienden el cansancio. Para muchos, esta es la experiencia más dura de su vida", afirma.
                        <br /><br />
                        <strong>¿Qué sigue para quienes logran cruzar?</strong>
                        <br /><br />
                        Quienes llegan a la frontera enfrentan decisiones difíciles: esperar, entregarse a autoridades estadounidenses o intentar un cruce irregular. El ONM estima que solo 1 de cada 5 logra iniciar un proceso formal de asilo, mientras que el resto queda atrapado en un limbo migratorio o regresa temporalmente a territorio mexicano.
                        <br /><br />
                        <strong>Conclusión</strong>
                        <br /><br />
                        La travesía migrante en Coahuila se ha vuelto más compleja, larga y peligrosa. Las rutas están saturadas, los albergues se ven rebasados y los riesgos aumentan. La realidad para miles de personas que cruzan el estado no es solo un viaje: es una lucha diaria por sobrevivir, avanzar y conservar la esperanza.
                    </Text>
                </div>

            </div>

            {/* 3. AI Chat Bar (Fixed at the bottom via CSS default) */}
            <AiChatBarCollapsed onClick={() => setIsChatOpen(true)} />

            {/* Expanded Chat Modal */}
            {isChatOpen && (
                <AiChatBarExpanded onClose={() => setIsChatOpen(false)} />
            )}

        </PageWrapper>
    );
};
