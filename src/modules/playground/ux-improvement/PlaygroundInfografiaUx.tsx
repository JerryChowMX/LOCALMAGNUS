import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../components/Typography/Typography';
import { PlaygroundHeader } from '../components/PlaygroundHeader';
import './components/PlaygroundStyles.css';
import { useState } from 'react';

// Mobile-First Minimal Vertical Card
const MinimalVertical = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div style={{
                maxWidth: '420px',
                margin: '0 auto'
            }}>
                {/* Vertical Infographic Preview */}
                <div
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '9/16',
                        backgroundColor: '#F1F5F9',
                        cursor: 'pointer',
                        overflow: 'hidden'
                    }}
                >
                    {/* Real Image Placeholder */}
                    <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=1066&q=80"
                        alt="Infographic Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />

                    {/* Fullscreen Icon */}
                    <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        cursor: 'pointer',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Simulated Lightbox Overlay */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    background: 'rgba(0,0,0,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    {/* Main Image Container */}
                    <div style={{
                        width: '100%',
                        maxWidth: '500px', // Constrained for vertical infographics
                        height: '80vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                            alt="Full Infographic"
                            style={{
                                listStyle: 'none',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            }}
                        />
                    </div>

                    {/* Lightbox Actions Bar */}
                    <div style={{
                        marginTop: '24px',
                        display: 'flex',
                        gap: '24px',
                        alignItems: 'center'
                    }}>
                        <button style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '30px',
                            padding: '12px 24px',
                            color: 'white',
                            fontFamily: 'var(--font-family-body)',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background 0.2s'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Descargar en HD
                        </button>

                        <button style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '46px',
                            height: '46px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export const PlaygroundInfografiaUx = () => {
    return (
        <PageWrapper>
            <PlaygroundHeader />
            <div className="playground-page-wrapper">
                <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <Text variant="caption" style={{
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            color: '#8B5CF6',
                            fontWeight: 'bold'
                        }}>
                            UX Lab
                        </Text>
                        <Heading level={1} style={{ marginBottom: '16px', fontSize: '32px' }}>
                            Infografía UX
                        </Heading>
                        <p style={{ color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>
                            Exploring different approaches to presenting infographic content
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <MinimalVertical />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default PlaygroundInfografiaUx;
