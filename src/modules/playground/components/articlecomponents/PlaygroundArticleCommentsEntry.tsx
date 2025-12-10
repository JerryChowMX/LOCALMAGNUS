import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { routes } from '../../../../app/routes';
import { ArrowRight, MessageCircle } from 'lucide-react';

export const PlaygroundArticleCommentsEntry = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <HeaderContent onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)} />

                <div style={{ padding: '24px' }}>
                    <Heading level={2} style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Comments / Entry Point</Heading>
                    <Text variant="body" style={{ color: '#6B7280', marginBottom: '32px' }}>
                        Design concepts for the "Comments" Call-to-Action at the bottom of articles.
                    </Text>

                    {/* Selected Design: The Ticker */}
                    <div style={{ marginBottom: '40px' }}>
                        <Text variant="caption" style={{ marginBottom: '8px', display: 'block', color: '#9CA3AF' }}>WITH COMMENTS: THE TICKER</Text>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '12px 16px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                            border: '1px solid #E5E7EB',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            gap: '12px',
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#0076ab';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E5E7EB';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
                            }}
                        >
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0076ab 0%, #FF6600 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 600,
                                flexShrink: 0
                            }}>R</div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <Text variant="body" style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Ricardo:</Text>
                                    <Text variant="body" style={{ fontSize: '0.9rem', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        Excelente análisis sobre la infraestructura...
                                    </Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                <Text variant="caption" style={{ color: '#0076ab', fontWeight: 600 }}>Ver (24)</Text>
                                <ArrowRight size={16} color="#0076ab" />
                            </div>
                        </div>
                    </div>

                    {/* Zero State: First to Comment */}
                    <div style={{ marginBottom: '40px' }}>
                        <Text variant="caption" style={{ marginBottom: '8px', display: 'block', color: '#9CA3AF' }}>ZERO STATE: FIRST TO COMMENT</Text>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                            border: '1px solid #E5E7EB',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            gap: '16px',
                            transition: 'all 0.2s',
                            textAlign: 'center'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#FF6600';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,102,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E5E7EB';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
                            }}
                        >
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%',
                                backgroundColor: '#FFF4ED',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <MessageCircle size={28} color="#FF6600" strokeWidth={2} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <Text variant="body" style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0, lineHeight: '1.3', color: '#111827' }}>
                                    Sé el primero en comentar
                                </Text>
                                <Text variant="caption" style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                    Comparte tu opinión sobre este artículo
                                </Text>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PageWrapper>
    );
};
