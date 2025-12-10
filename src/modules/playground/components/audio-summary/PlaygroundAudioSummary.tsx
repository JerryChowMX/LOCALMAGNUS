import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { HeaderContent } from '../../../noticiasHub/components/HeaderContent';
import { AudioSummaryCard } from '../../../../components/AudioSummary/AudioSummaryCard';

// Mock Data
const ARTICLE_DATA = {
    title: "Aseguran pipa con 30 mil litros de hidrocarburo en carretera a Saltillo",
    imageUrl: "https://images.unsplash.com/photo-1628540841228-5ae32c86b206?q=80&w=1000&auto=format&fit=crop",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
};

export const PlaygroundAudioSummary = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
                <HeaderContent onBack={() => navigate('/dev/playground/components')} />

                <div style={{ padding: '24px' }}>
                    <Heading level={1} style={{ fontSize: '1.5rem', marginBottom: '12px', fontWeight: 700, letterSpacing: '-0.02em', color: '#111827' }}>Audio Summary Card</Heading>
                    <Text variant="body" style={{ color: '#6B7280', marginBottom: '40px', maxWidth: '400px', lineHeight: 1.6 }}>
                        The definitive cinematic layout for audio summaries. Features a spacious vertical portrait image and refined typography for maximum visual impact.
                    </Text>

                    <AudioSummaryCard
                        title={ARTICLE_DATA.title}
                        imageUrl={ARTICLE_DATA.imageUrl}
                        audioSrc={ARTICLE_DATA.audioSrc}
                        durationLabel="3 min"
                    />
                </div>
            </div>
        </PageWrapper>
    );
};
