import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

export const PlaygroundAuthorCard = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#fff' }}>
                <HeaderContent
                    onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)}
                />

                <div style={{ padding: '24px' }}>
                    <Heading level={2} style={{ marginBottom: '8px', fontSize: '1.25rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Playground: Author
                    </Heading>
                    <Heading level={1} style={{ marginBottom: '32px', fontFamily: '"Blinker", sans-serif', fontWeight: 800, fontSize: '2.5rem', lineHeight: '1.1' }}>
                        FINAL AUTHOR CARD
                    </Heading>

                    {/* Final Option: Minimalist */}
                    <div style={{ marginBottom: '48px', maxWidth: '100%' }}>
                        <div style={{
                            padding: '32px 24px',
                            backgroundColor: '#fff',
                            textAlign: 'center',
                            borderTop: '1px solid #E5E7EB',
                            borderBottom: '1px solid #E5E7EB'
                        }}>
                            <span style={{
                                display: 'block',
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: '#6B7280',
                                marginBottom: '8px'
                            }}>
                                Por
                            </span>
                            <h4 style={{
                                fontFamily: '"Blinker", sans-serif',
                                fontSize: '1.75rem',
                                fontWeight: 800,
                                color: '#111827',
                                margin: '0 0 16px 0',
                                letterSpacing: '-0.02em',
                                textTransform: 'uppercase'
                            }}>
                                CARLOS RAMÍREZ
                            </h4>
                            <div style={{
                                width: '40px',
                                height: '2px',
                                backgroundColor: '#0076AB',
                                margin: '0 auto'
                            }} />
                        </div>
                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};
