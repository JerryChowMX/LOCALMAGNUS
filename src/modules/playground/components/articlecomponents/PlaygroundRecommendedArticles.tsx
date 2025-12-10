import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { RecommendedArticles } from './RecommendedArticles/RecommendedArticles';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

const MOCK_ARTICLES = [
    {
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?auto=format&fit=crop&w=800&q=80",
        category: "General",
        title: "¿Qué iniciativas se están tomando para mejorar el medio ambiente?",
    },
    {
        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80",
        category: "General",
        title: "Explícame el impacto del desarrollo urbano, simplificado para todos.",
    },
    {
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        category: "Viajes",
        title: "Los destinos más populares para visitar este verano.",
    },
    {
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        category: "Tecnología",
        title: "La inteligencia artificial y el futuro del trabajo.",
    }
];

export const PlaygroundRecommendedArticles = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#fff' }}>
                <HeaderContent
                    onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)}
                />

                <div style={{ paddingBottom: '40px' }}>
                    <RecommendedArticles articles={MOCK_ARTICLES} />
                </div>
            </div>
        </PageWrapper>
    );
};
