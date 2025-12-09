import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';
import { useLightbox } from '../../../../context/LightboxContext';

// Mock image data
const MOCK_IMAGE = {
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
    caption: 'Vista panorámica del centro financiero de la Ciudad de México al atardecer',
    photo_credit: 'Fotografía: Carlos Mendoza / MAGNUS'
};

const SingleImageCard = ({ image }: { image: typeof MOCK_IMAGE }) => {
    const { openSingleImage } = useLightbox();

    return (
        <div style={{
            backgroundColor: '#fff',
            maxWidth: '680px',
            margin: '0 auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            cursor: 'pointer'
        }} onClick={() => openSingleImage(image.imageUrl, `${image.caption} (${image.photo_credit})`, image.caption)}>
            <img
                src={image.imageUrl}
                alt={image.caption}
                style={{ width: '100%', display: 'block', border: '1px solid #F3F4F6' }}
            />
            {/* Caption removed from view, only accessible via click/lightbox */}
        </div>
    );
};

export const PlaygroundSingleImage = () => {
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
                            Single Image
                        </Heading>
                        <Text variant="body" style={{ color: '#6B7280' }}>
                            Clean card presentation for article images.
                        </Text>
                    </div>

                    <SingleImageCard image={MOCK_IMAGE} />

                </div>
            </div>
        </PageWrapper>
    );
};
