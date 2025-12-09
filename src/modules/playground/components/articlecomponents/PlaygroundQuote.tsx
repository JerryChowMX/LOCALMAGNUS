import { useState } from 'react';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

export const PlaygroundQuote = () => {
    const navigate = useNavigate();
    const [showAuthor, setShowAuthor] = useState(false);

    return (
        <PageWrapper>
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#F9FAFB',
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgb(245, 247, 250) 0%, rgb(255, 255, 255) 90%)'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <HeaderContent
                        onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)}
                    />

                    <div style={{ padding: '24px 24px 100px 24px' }}>
                        {/* Page Header */}
                        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                            <Heading level={1} style={{
                                fontSize: '2rem',
                                marginBottom: '12px',
                                fontFamily: '"Blinker", sans-serif',
                                fontWeight: 800
                            }}>
                                Quote
                            </Heading>
                            <Text variant="body" style={{
                                color: '#6B7280',
                                maxWidth: '600px',
                                margin: '0 auto',
                                fontSize: '1rem',
                                lineHeight: '1.6'
                            }}>
                                Ultra minimal quote design with Magnus Blue accent.
                                Tap to reveal author.
                            </Text>
                        </div>

                        {/* Final Design */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ marginBottom: '24px', textAlign: 'center', maxWidth: '480px' }}>
                                <Heading level={2} style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '8px',
                                    fontWeight: 700,
                                    color: '#111827'
                                }}>
                                    Ultra Minimal
                                </Heading>
                                <Text variant="body" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                                    No background, just typography with blue accent line.
                                    Maximum reading flow integration.
                                </Text>
                            </div>

                            <div style={{ width: '100%', maxWidth: '480px' }}>
                                <div
                                    onClick={() => setShowAuthor(!showAuthor)}
                                    style={{
                                        position: 'relative',
                                        padding: '20px 0',
                                        cursor: 'pointer',
                                        minHeight: '100px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'all 450ms ease'
                                    }}
                                >
                                    {/* Quote */}
                                    <div style={{
                                        opacity: showAuthor ? 0 : 1,
                                        transition: 'opacity 450ms ease',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '20px 0'
                                    }}>
                                        <p style={{
                                            fontFamily: '"Inter", sans-serif',
                                            fontWeight: 500,
                                            fontStyle: 'italic',
                                            fontSize: '1.125rem',
                                            lineHeight: '1.6',
                                            color: '#4B5563',
                                            margin: 0,
                                            borderLeft: '2px solid #0076ab',
                                            paddingLeft: '20px'
                                        }}>
                                            Three can keep a secret, if two of them are dead.
                                        </p>
                                    </div>

                                    {/* Author */}
                                    <div style={{
                                        opacity: showAuthor ? 1 : 0,
                                        transition: 'opacity 450ms ease 40ms',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '20px 0'
                                    }}>
                                        <p style={{
                                            fontFamily: '"Inter", sans-serif',
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            color: '#9CA3AF',
                                            margin: 0,
                                            textAlign: 'center'
                                        }}>
                                            – Benjamin Franklin
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Design Notes */}
                        <div style={{
                            marginTop: '80px',
                            padding: '24px',
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB'
                        }}>
                            <Heading level={3} style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: '#111827',
                                marginBottom: '16px',
                                fontFamily: '"Blinker", sans-serif'
                            }}>
                                💬 Design Specifications
                            </Heading>
                            <div style={{
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.875rem',
                                lineHeight: '1.6'
                            }}>
                                <strong style={{ color: '#111827' }}>Ultra Minimal:</strong>
                                <Text variant="caption" style={{ color: '#6B7280', display: 'block', marginTop: '4px' }}>
                                    • No background or heavy styling<br />
                                    • 2px Magnus Blue left border (#0076ab)<br />
                                    • 20px left padding for text<br />
                                    • Medium weight italic quote (1.125rem)<br />
                                    • Typography-focused design<br />
                                    • Maximum reading flow integration<br />
                                    • Tap to toggle author
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
