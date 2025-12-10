import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconCopy, IconShare, IconCheck, IconQuote } from '@tabler/icons-react';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { routes } from '../../../../app/routes';

// Mock Quote Data
const QUOTE_DATA = {
    text: "El periodismo no es un circo para exhibirse, sino un instrumento para pensar, para ayudar al hombre en su eterno combate por una vida más digna y menos injusta.",
    author: "Tomás Eloy Martínez"
};

// Reusable Quote Component
interface QuoteVariantProps {
    text: string;
    author: string;
}

const QuoteVariant = ({ text, author }: QuoteVariantProps) => {
    const [showAuthor, setShowAuthor] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`"${text}" - ${author}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: 'Magnus Quote',
                text: `"${text}" - ${author}`,
            }).catch(console.error);
        } else {
            alert('Share functionality not available on this device');
        }
    };

    const toggleAuthor = () => setShowAuthor(!showAuthor);

    // Only Card Variant Logic
    return (
        <div style={{ position: 'relative', marginBottom: '60px', width: '100%', maxWidth: '680px', margin: '0 auto 60px auto' }}>

            {/* Component Container */}
            <div style={{ position: 'relative' }}>
                <div style={{
                    backgroundColor: '#fff',
                    padding: '32px',
                    borderRadius: '0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid #F3F4F6',
                    position: 'relative',
                    minHeight: '200px', // Ensure some minimum for aesthetics
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }} onClick={toggleAuthor}>

                    <IconQuote size={32} color="#E5E7EB" style={{ marginBottom: '16px' }} />

                    {/* Content Container - Grid for alignment */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        width: '100%',
                        position: 'relative',
                        alignItems: 'center'
                    }}>
                        {/* Quote - Sets the height, simply fades out */}
                        <p style={{
                            gridArea: '1 / 1',
                            fontSize: '1.125rem',
                            lineHeight: '1.7',
                            color: '#4B5563',
                            margin: '0 0 16px 0',
                            fontFamily: '"Inter", sans-serif',
                            fontStyle: 'italic',
                            opacity: showAuthor ? 0 : 1,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: showAuthor ? 'none' : 'auto'
                        }}>
                            {text}
                        </p>

                        {/* Author - Overlay */}
                        <div style={{
                            gridArea: '1 / 1',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: showAuthor ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: showAuthor ? 'auto' : 'none'
                        }}>
                            <span style={{
                                fontFamily: '"Blinker", sans-serif',
                                fontWeight: 700,
                                fontSize: '1.5rem',
                                color: '#111827'
                            }}>
                                {author}
                            </span>
                        </div>
                    </div>


                </div>

                {/* Floating Actions */}
                <div style={{
                    position: 'absolute',
                    top: '-16px',
                    right: '0',
                    display: 'flex',
                    gap: '8px',
                    padding: '4px',
                }}>
                    <button
                        onClick={handleCopy}
                        title="Copy text"
                        style={{
                            background: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#6B7280',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </button>
                    <button
                        onClick={handleShare}
                        title="Share"
                        style={{
                            background: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#6B7280',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <IconShare size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const PlaygroundQuote = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#F9FAFB',
                paddingBottom: '100px'
            }}>
                {/* Navigation Header */}
                <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', marginBottom: '60px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <HeaderContent onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)} />
                    </div>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <Heading level={1} style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#111827' }}>
                            Interactive Quote
                        </Heading>
                        <Text variant="body" style={{ color: '#6B7280' }}>
                            Tap the quote to reveal the author without layout shift.
                        </Text>
                    </div>

                    <QuoteVariant text={QUOTE_DATA.text} author={QUOTE_DATA.author} />

                </div>
            </div>
        </PageWrapper>
    );
};
