import { useNavigate } from 'react-router-dom';

import { ArticleQuote } from '../../../../components/Article/ArticleQuote/ArticleQuote';
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
// Reusable Quote Component replaced by import
// Internal implementation removed to use production component


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

                    <ArticleQuote quote={QUOTE_DATA.text} author={QUOTE_DATA.author} />

                </div>
            </div>
        </PageWrapper>
    );
};
