import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load all playground components
const PlaygroundMenu = lazy(() => import('../../modules/playground/PlaygroundMenu').then(module => ({ default: module.PlaygroundMenu })));
const PlaygroundArticle = lazy(() => import('../../modules/playground/PlaygroundArticle').then(module => ({ default: module.PlaygroundArticle })));
const PlaygroundArticleStandard = lazy(() => import('../../modules/playground/PlaygroundArticleStandard').then(module => ({ default: module.PlaygroundArticleStandard })));
const PlaygroundArticleStandardDark = lazy(() => import('../../modules/playground/PlaygroundArticleStandardDark').then(module => ({ default: module.PlaygroundArticleStandardDark })));
const PlaygroundHome = lazy(() => import('../../modules/playground/PlaygroundHome').then(module => ({ default: module.PlaygroundHome })));
const PlaygroundHeaders = lazy(() => import('../../modules/playground/PlaygroundHeaders').then(module => ({ default: module.PlaygroundHeaders })));
const PlaygroundComponents = lazy(() => import('../../modules/playground/PlaygroundComponents').then(module => ({ default: module.PlaygroundComponents })));
const PlaygroundArticleComponents = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundArticleComponents').then(module => ({ default: module.PlaygroundArticleComponents })));
const PlaygroundRecommendedArticles = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundRecommendedArticles').then(module => ({ default: module.PlaygroundRecommendedArticles })));
const PlaygroundAuthorCard = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundAuthorCard').then(module => ({ default: module.PlaygroundAuthorCard })));
const PlaygroundRichText = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundRichText').then(module => ({ default: module.PlaygroundRichText })));
const PlaygroundQuote = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundQuote').then(module => ({ default: module.PlaygroundQuote })));
const PlaygroundGallery = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundGallery').then(module => ({ default: module.PlaygroundGallery })));
const PlaygroundEmbed = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundEmbed').then(module => ({ default: module.PlaygroundEmbed })));
const PlaygroundInfographics = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundInfographics').then(module => ({ default: module.PlaygroundInfographics })));
const PlaygroundIllustrations = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundIllustrations').then(module => ({ default: module.PlaygroundIllustrations })));
const PlaygroundSingleImage = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundSingleImage').then(module => ({ default: module.PlaygroundSingleImage })));
const PlaygroundAudioPlayer = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundAudioPlayer').then(module => ({ default: module.PlaygroundAudioPlayer })));
const PlaygroundHeroImage = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundHeroImage').then(module => ({ default: module.PlaygroundHeroImage })));
const PlaygroundArticleCommentsEntry = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundArticleCommentsEntry').then(module => ({ default: module.PlaygroundArticleCommentsEntry })));
const PlaygroundResumenEjecutivoComponents = lazy(() => import('../../modules/playground/components/resumen-ejecutivo/PlaygroundResumenEjecutivoComponents').then(module => ({ default: module.PlaygroundResumenEjecutivoComponents })));
const PlaygroundResumenBody = lazy(() => import('../../modules/playground/components/resumen-ejecutivo/PlaygroundResumenBody').then(module => ({ default: module.PlaygroundResumenBody })));
const PlaygroundResumenUpperDesign = lazy(() => import('../../modules/playground/components/resumen-ejecutivo/PlaygroundResumenUpperDesign').then(module => ({ default: module.PlaygroundResumenUpperDesign })));
const PlaygroundResumenMainBody = lazy(() => import('../../modules/playground/components/resumen-ejecutivo/PlaygroundResumenMainBody').then(module => ({ default: module.PlaygroundResumenMainBody })));
const PlaygroundResumenLowerDesign = lazy(() => import('../../modules/playground/components/resumen-ejecutivo/PlaygroundResumenLowerDesign').then(module => ({ default: module.PlaygroundResumenLowerDesign })));
const PlaygroundResumenStaging = lazy(() => import('../../modules/playground/components/resumen-ejecutivo/PlaygroundResumenStaging').then(module => ({ default: module.PlaygroundResumenStaging })));
const PlaygroundAudioSummary = lazy(() => import('../../modules/playground/components/audio-summary/PlaygroundAudioSummary').then(module => ({ default: module.PlaygroundAudioSummary })));
const PlaygroundComments = lazy(() => import('../../modules/playground/components/comments/PlaygroundComments').then(module => ({ default: module.PlaygroundComments })));
const PlaygroundNoticiasArticleLanding = lazy(() => import('../../modules/playground/PlaygroundNoticiasArticleLanding').then(module => ({ default: module.PlaygroundNoticiasArticleLanding })));
const PlaygroundAiChatBar = lazy(() => import('../../modules/playground/components/articlecomponents/PlaygroundAiChatBar').then(module => ({ default: module.PlaygroundAiChatBar })));
const PlaygroundUxImprovement = lazy(() => import('../../modules/playground/PlaygroundUxImprovement').then(module => ({ default: module.PlaygroundUxImprovement })));
const PlaygroundUxNoticiasFlow = lazy(() => import('../../modules/playground/ux-improvement/PlaygroundUxNoticiasFlow').then(module => ({ default: module.PlaygroundUxNoticiasFlow })));
const PlaygroundVideoUx = lazy(() => import('../../modules/playground/ux-improvement/PlaygroundVideoUx').then(module => ({ default: module.PlaygroundVideoUx })));
const PlaygroundPodcastUx = lazy(() => import('../../modules/playground/ux-improvement/PlaygroundPodcastUx').then(module => ({ default: module.PlaygroundPodcastUx })));
const PlaygroundPresentacionUx = lazy(() => import('../../modules/playground/ux-improvement/PlaygroundPresentacionUx').then(module => ({ default: module.PlaygroundPresentacionUx })));
const PlaygroundPresentacionPdf = lazy(() => import('../../modules/playground/ux-improvement/PlaygroundPresentacionPdf').then(module => ({ default: module.PlaygroundPresentacionPdf })));
const PlaygroundPresentacionVideo = lazy(() => import('../../modules/playground/ux-improvement/PlaygroundPresentacionVideo').then(module => ({ default: module.PlaygroundPresentacionVideo })));
const PlaygroundInfografiaUx = lazy(() => import('../../modules/playground/ux-improvement/PlaygroundInfografiaUx').then(module => ({ default: module.PlaygroundInfografiaUx })));

// Fallback loader
const RouteLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <p>Loading playground...</p>
    </div>
);

/**
 * PlaygroundRouter - Contains all development/playground routes
 * Mounted at /dev/playground/* in AppRouter
 */
export const PlaygroundRouter = () => {
    return (
        <Suspense fallback={<RouteLoader />}>
            <Routes>
                {/* Menu */}
                <Route index element={<PlaygroundMenu />} />

                {/* Article Playground */}
                <Route path="article" element={<PlaygroundArticle />} />
                <Route path="article/standard-one" element={<PlaygroundArticleStandard />} />
                <Route path="article/standard-two" element={<PlaygroundArticleStandardDark />} />

                {/* Home & Headers */}
                <Route path="home" element={<PlaygroundHome />} />
                <Route path="home/headers" element={<PlaygroundHeaders />} />

                {/* Components */}
                <Route path="components" element={<PlaygroundComponents />} />
                <Route path="components/articlecomponents" element={<PlaygroundArticleComponents />} />
                <Route path="components/articlecomponents/recommended" element={<PlaygroundRecommendedArticles />} />
                <Route path="components/articlecomponents/authorcard" element={<PlaygroundAuthorCard />} />
                <Route path="components/articlecomponents/richtext" element={<PlaygroundRichText />} />
                <Route path="components/articlecomponents/quote" element={<PlaygroundQuote />} />
                <Route path="components/articlecomponents/gallery" element={<PlaygroundGallery />} />
                <Route path="components/articlecomponents/embed" element={<PlaygroundEmbed />} />
                <Route path="components/articlecomponents/infographics" element={<PlaygroundInfographics />} />
                <Route path="components/articlecomponents/illustrations" element={<PlaygroundIllustrations />} />
                <Route path="components/articlecomponents/singleimage" element={<PlaygroundSingleImage />} />
                <Route path="components/articlecomponents/audioplayer" element={<PlaygroundAudioPlayer />} />
                <Route path="components/articlecomponents/heroimage" element={<PlaygroundHeroImage />} />
                <Route path="components/articlecomponents/comments-entry" element={<PlaygroundArticleCommentsEntry />} />
                <Route path="components/articlecomponents/aichatbar" element={<PlaygroundAiChatBar />} />

                {/* Resumen Ejecutivo */}
                <Route path="components/resumen-ejecutivo" element={<PlaygroundResumenEjecutivoComponents />} />
                <Route path="components/resumen-ejecutivo/resumen-body" element={<PlaygroundResumenBody />} />
                <Route path="components/resumen-ejecutivo/resumen-body/upper-design" element={<PlaygroundResumenUpperDesign />} />
                <Route path="components/resumen-ejecutivo/resumen-body/main-body" element={<PlaygroundResumenMainBody />} />
                <Route path="components/resumen-ejecutivo/resumen-body/lower-design" element={<PlaygroundResumenLowerDesign />} />
                <Route path="components/resumen-ejecutivo/staging" element={<PlaygroundResumenStaging />} />

                {/* Other Components */}
                <Route path="components/audio-summary" element={<PlaygroundAudioSummary />} />
                <Route path="components/comments" element={<PlaygroundComments />} />

                {/* Noticias Landing */}
                <Route path="noticias-article-landing" element={<PlaygroundNoticiasArticleLanding />} />

                {/* UX Improvement */}
                <Route path="ux-improvement" element={<PlaygroundUxImprovement />} />
                <Route path="ux-improvement/noticias-flow" element={<PlaygroundUxNoticiasFlow />} />
                <Route path="ux-improvement/video-ux" element={<PlaygroundVideoUx />} />
                <Route path="ux-improvement/podcast-ux" element={<PlaygroundPodcastUx />} />
                <Route path="ux-improvement/presentacion-ux" element={<PlaygroundPresentacionUx />} />
                <Route path="ux-improvement/presentacion-ux/pdf" element={<PlaygroundPresentacionPdf />} />
                <Route path="ux-improvement/presentacion-ux/video" element={<PlaygroundPresentacionVideo />} />
                <Route path="ux-improvement/infografia-ux" element={<PlaygroundInfografiaUx />} />
            </Routes>
        </Suspense>
    );
};

export default PlaygroundRouter;
