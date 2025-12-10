import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

export const PlaygroundRichText = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#fff' }}>
                <HeaderContent
                    onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)}
                />

                <div style={{ padding: '24px 24px 100px 24px' }}>
                    <Heading level={2} style={{ marginBottom: '8px', fontSize: '1.25rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Playground: Rich Text
                    </Heading>
                    <Heading level={1} style={{ marginBottom: '32px', fontFamily: '"Blinker", sans-serif', fontWeight: 800, fontSize: '2.5rem', lineHeight: '1.1' }}>
                        THE MODERNIST
                    </Heading>

                    {/* Rich Text Renderer Implementation */}
                    <div className="rich-text-modernist">
                        {MOCK_CONTENT.map((block, index) => {
                            switch (block.type) {
                                case 'heading':
                                    return (
                                        <h2 key={index} style={{
                                            fontFamily: '"Blinker", sans-serif',
                                            fontWeight: 800,
                                            fontSize: '1.5rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            color: '#111827',
                                            marginTop: '40px',
                                            marginBottom: '16px',
                                            lineHeight: '1.2'
                                        }}>
                                            {block.content}
                                        </h2>
                                    );
                                case 'paragraph':
                                    return (
                                        <p key={index} style={{
                                            fontFamily: '"Inter", sans-serif',
                                            fontSize: '1rem',
                                            lineHeight: '1.6',
                                            color: '#374151',
                                            marginBottom: '24px'
                                        }}>
                                            {block.content}
                                        </p>
                                    );
                                case 'list':
                                    return (
                                        <ul key={index} style={{
                                            listStyleType: 'disc',
                                            paddingLeft: '20px',
                                            marginBottom: '24px',
                                            fontFamily: '"Inter", sans-serif',
                                            color: '#374151'
                                        }}>
                                            {/* @ts-ignore */}
                                            {block.items.map((item, i) => (
                                                <li key={i} style={{ marginBottom: '8px', lineHeight: '1.6' }}>{item}</li>
                                            ))}
                                        </ul>
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

const MOCK_CONTENT = [
    {
        type: 'paragraph',
        content: 'En los últimos meses, Coahuila se ha convertido en uno de los corredores más activos de migración hacia la frontera norte. Aunque las rutas cambian constantemente, la travesía de miles de personas que cruzan el estado comparte patrones comunes.'
    },
    {
        type: 'heading',
        content: 'El inicio: Cruce Lagunero'
    },
    {
        type: 'paragraph',
        content: 'El recorrido comienza, para la mayoría, en los límites con Durango. En la Comarca Lagunera, pequeños grupos avanzan por las vías del tren abandonadas o por brechas rurales poco vigiladas. "Llegan agotados, con poca agua. Muchos ya vienen enfermos desde antes", comenta Rocío Herrera, coordinadora del albergue Casa Luminaria.'
    },
    {
        type: 'heading',
        content: 'Rumbo a Saltillo'
    },
    {
        type: 'paragraph',
        content: 'El trayecto hacia la capital del estado se ha diversificado. Antes, la mayoría seguía la vía del tren; hoy, las restricciones y operativos han dispersado a los migrantes por caminos alternos. El Observatorio Norteño de Movilidad reporta que:'
    },
    {
        type: 'list',
        items: [
            '58% de los migrantes optan por caminar por la carretera.',
            '31% utilizan transportes informales.',
            '11% intentan avanzar por las vías férreas.'
        ]
    },
    {
        type: 'heading',
        content: 'El desierto de la frontera'
    },
    {
        type: 'paragraph',
        content: 'La travesía hacia Acuña y Piedras Negras es considerada la más riesgosa. Las temperaturas pueden superar los 38 grados por la tarde y bajar hasta 5 grados por la noche. CREMOV estima que 3 de cada 10 personas reportan haber sido víctimas de robo o extorsión antes de llegar a la frontera.'
    }
];
