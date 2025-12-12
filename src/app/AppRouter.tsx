import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { routes } from './routes';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { Heading, Text } from '../components/Typography/Typography';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';
import { getMonterreyDate } from '../lib/dateUtils';

// Lazy load all page components
const HomeHubsPage = lazy(() => import('../modules/home/pages/HomeHubsPage').then(module => ({ default: module.HomeHubsPage })));
const NoticiasHubPage = lazy(() => import('../modules/noticiasHub/pages/NoticiasHubPage').then(module => ({ default: module.NoticiasHubPage })));
const NoticiasArticlePage = lazy(() => import('../modules/noticiasHub/pages/NoticiasArticlePage').then(module => ({ default: module.NoticiasArticlePage })));
const NoticiasArticleFormatPage = lazy(() => import('../modules/noticiasHub/pages/NoticiasArticleFormatPage').then(module => ({ default: module.NoticiasArticleFormatPage })));

const ResumenHubPage = lazy(() => import('../modules/resumenHub/pages/ResumenHubPage').then(module => ({ default: module.ResumenHubPage })));
const ResumenLas5Page = lazy(() => import('../modules/resumenHub/pages/ResumenLas5Page').then(module => ({ default: module.ResumenLas5Page })));
const ResumenLas5ArticlePage = lazy(() => import('../modules/resumenHub/pages/ResumenLas5ArticlePage').then(module => ({ default: module.ResumenLas5ArticlePage })));
const ResumenLas5ArticleFormatPage = lazy(() => import('../modules/resumenHub/pages/ResumenLas5ArticleFormatPage').then(module => ({ default: module.ResumenLas5ArticleFormatPage })));

const ResumenOpinionPage = lazy(() => import('../modules/resumenHub/pages/ResumenOpinionPage').then(module => ({ default: module.ResumenOpinionPage })));
const ResumenOpinionArticlePage = lazy(() => import('../modules/resumenHub/pages/ResumenOpinionArticlePage').then(module => ({ default: module.ResumenOpinionArticlePage })));
const ResumenOpinionArticleFormatPage = lazy(() => import('../modules/resumenHub/pages/ResumenOpinionArticleFormatPage').then(module => ({ default: module.ResumenOpinionArticleFormatPage })));

const ResumenPodcastPage = lazy(() => import('../modules/resumenHub/pages/ResumenPodcastPage').then(module => ({ default: module.ResumenPodcastPage })));
const ResumenFotosPage = lazy(() => import('../modules/resumenHub/pages/ResumenFotosPage').then(module => ({ default: module.ResumenFotosPage })));
const ResumenCartonesPage = lazy(() => import('../modules/resumenHub/pages/ResumenCartonesPage').then(module => ({ default: module.ResumenCartonesPage })));
const ResumenJuegosRedirectPage = lazy(() => import('../modules/resumenHub/pages/ResumenJuegosRedirectPage').then(module => ({ default: module.ResumenJuegosRedirectPage })));
const ResumenEjecutivoPage = lazy(() => import('../modules/resumenEjecutivo/pages/ResumenEjecutivoPage').then(module => ({ default: module.ResumenEjecutivoPage })));


const EpaperHubPage = lazy(() => import('../modules/epaper/pages/EpaperHubPage').then(module => ({ default: module.EpaperHubPage })));


const EpaperEditionPage = lazy(() => import('../modules/epaper/pages/EpaperEditionPage').then(module => ({ default: module.EpaperEditionPage })));

const LoginPage = lazy(() => import('../modules/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('../modules/auth/pages/SignupPage').then(module => ({ default: module.SignupPage })));
const ForgotPasswordPage = lazy(() => import('../modules/auth/pages/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const AuthCallbackPage = lazy(() => import('../modules/auth/pages/AuthCallbackPage').then(module => ({ default: module.AuthCallbackPage })));
const PerfilHubPage = lazy(() => import('../modules/perfilHub/pages/PerfilHubPage').then(module => ({ default: module.PerfilHubPage })));

// Playground & Staging
const PlaygroundMenu = lazy(() => import('../modules/playground/PlaygroundMenu').then(module => ({ default: module.PlaygroundMenu })));
const StagingMenu = lazy(() => import('../modules/staging/StagingMenu').then(module => ({ default: module.StagingMenu })));
const PlaygroundArticle = lazy(() => import('../modules/playground/PlaygroundArticle').then(module => ({ default: module.PlaygroundArticle })));
const PlaygroundArticleStandard = lazy(() => import('../modules/playground/PlaygroundArticleStandard').then(module => ({ default: module.PlaygroundArticleStandard })));
const PlaygroundArticleStandardDark = lazy(() => import('../modules/playground/PlaygroundArticleStandardDark').then(module => ({ default: module.PlaygroundArticleStandardDark })));
const PlaygroundHome = lazy(() => import('../modules/playground/PlaygroundHome').then(module => ({ default: module.PlaygroundHome })));
const PlaygroundHeaders = lazy(() => import('../modules/playground/PlaygroundHeaders').then(module => ({ default: module.PlaygroundHeaders })));
const PlaygroundComponents = lazy(() => import('../modules/playground/PlaygroundComponents').then(module => ({ default: module.PlaygroundComponents })));
const PlaygroundArticleComponents = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundArticleComponents').then(module => ({ default: module.PlaygroundArticleComponents })));
const PlaygroundRecommendedArticles = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundRecommendedArticles').then(module => ({ default: module.PlaygroundRecommendedArticles })));
const PlaygroundAuthorCard = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundAuthorCard').then(module => ({ default: module.PlaygroundAuthorCard })));
const PlaygroundRichText = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundRichText').then(module => ({ default: module.PlaygroundRichText })));
const PlaygroundQuote = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundQuote').then(module => ({ default: module.PlaygroundQuote })));
const PlaygroundGallery = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundGallery').then(module => ({ default: module.PlaygroundGallery })));
const PlaygroundEmbed = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundEmbed').then(module => ({ default: module.PlaygroundEmbed })));
const PlaygroundInfographics = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundInfographics').then(module => ({ default: module.PlaygroundInfographics })));
const PlaygroundIllustrations = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundIllustrations').then(module => ({ default: module.PlaygroundIllustrations })));
const PlaygroundSingleImage = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundSingleImage').then(module => ({ default: module.PlaygroundSingleImage })));
const PlaygroundAudioPlayer = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundAudioPlayer').then(module => ({ default: module.PlaygroundAudioPlayer })));
const PlaygroundHeroImage = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundHeroImage').then(module => ({ default: module.PlaygroundHeroImage })));
const PlaygroundArticleCommentsEntry = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundArticleCommentsEntry').then(module => ({ default: module.PlaygroundArticleCommentsEntry })));
const PlaygroundResumenEjecutivoComponents = lazy(() => import('../modules/playground/components/resumen-ejecutivo/PlaygroundResumenEjecutivoComponents').then(module => ({ default: module.PlaygroundResumenEjecutivoComponents })));
const PlaygroundResumenBody = lazy(() => import('../modules/playground/components/resumen-ejecutivo/PlaygroundResumenBody').then(module => ({ default: module.PlaygroundResumenBody })));
const PlaygroundResumenUpperDesign = lazy(() => import('../modules/playground/components/resumen-ejecutivo/PlaygroundResumenUpperDesign').then(module => ({ default: module.PlaygroundResumenUpperDesign })));
const PlaygroundResumenMainBody = lazy(() => import('../modules/playground/components/resumen-ejecutivo/PlaygroundResumenMainBody').then(module => ({ default: module.PlaygroundResumenMainBody })));
const PlaygroundResumenLowerDesign = lazy(() => import('../modules/playground/components/resumen-ejecutivo/PlaygroundResumenLowerDesign').then(module => ({ default: module.PlaygroundResumenLowerDesign })));
const PlaygroundResumenStaging = lazy(() => import('../modules/playground/components/resumen-ejecutivo/PlaygroundResumenStaging').then(module => ({ default: module.PlaygroundResumenStaging })));
const PlaygroundAudioSummary = lazy(() => import('../modules/playground/components/audio-summary/PlaygroundAudioSummary').then(module => ({ default: module.PlaygroundAudioSummary })));
const PlaygroundComments = lazy(() => import('../modules/playground/components/comments/PlaygroundComments').then(module => ({ default: module.PlaygroundComments })));
const PlaygroundNoticiasArticleLanding = lazy(() => import('../modules/playground/PlaygroundNoticiasArticleLanding').then(module => ({ default: module.PlaygroundNoticiasArticleLanding })));
const PlaygroundAiChatBar = lazy(() => import('../modules/playground/components/articlecomponents/PlaygroundAiChatBar').then(module => ({ default: module.PlaygroundAiChatBar })));
const PlaygroundUxImprovement = lazy(() => import('../modules/playground/PlaygroundUxImprovement').then(module => ({ default: module.PlaygroundUxImprovement })));
const PlaygroundUxNoticiasFlow = lazy(() => import('../modules/playground/ux-improvement/PlaygroundUxNoticiasFlow').then(module => ({ default: module.PlaygroundUxNoticiasFlow })));
const PlaygroundVideoUx = lazy(() => import('../modules/playground/ux-improvement/PlaygroundVideoUx').then(module => ({ default: module.PlaygroundVideoUx })));
const PlaygroundPodcastUx = lazy(() => import('../modules/playground/ux-improvement/PlaygroundPodcastUx').then(module => ({ default: module.PlaygroundPodcastUx })));
const PlaygroundPresentacionUx = lazy(() => import('../modules/playground/ux-improvement/PlaygroundPresentacionUx').then(module => ({ default: module.PlaygroundPresentacionUx })));
const PlaygroundPresentacionPdf = lazy(() => import('../modules/playground/ux-improvement/PlaygroundPresentacionPdf').then(module => ({ default: module.PlaygroundPresentacionPdf })));
const PlaygroundPresentacionVideo = lazy(() => import('../modules/playground/ux-improvement/PlaygroundPresentacionVideo').then(module => ({ default: module.PlaygroundPresentacionVideo })));
const StrapiTestPage = lazy(() => import('../modules/noticiasHub/pages/StrapiTestPage'));

const StandardOneRoute = lazy(() => import('./routes/article/StandardOneRoute').then(module => ({ default: module.StandardOneRoute })));

const Articles = () => (
    <PageWrapper>
        <Heading level={2}>Latest Articles</Heading>
        <Text variant="body">Article list will go here.</Text>
    </PageWrapper>
);

const ArticleDetail = () => (
    <PageWrapper>
        <Heading level={2}>Article Headline</Heading>
        <Text variant="body">Article content...</Text>
    </PageWrapper>
);

// Fallback loader
const RouteLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <p>Loading...</p>
    </div>
);

// Helper to redirect to today's date
const RedirectToToday = () => {
    const location = useLocation();
    // Get today's date in YYYY-MM-DD format (Monterrey Time)
    const today = getMonterreyDate();

    // Construct new path: /CurrentPath/YYYY-MM-DD
    // Ensure we don't double slash if location.pathname ends with /
    const cleanPath = location.pathname.replace(/\/$/, '');

    return <Navigate to={`${cleanPath}/${today}`} replace />;
};

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Suspense fallback={<RouteLoader />}>
                    <Routes>
                        <Route path={routes.home} element={<HomeHubsPage />} />
                        <Route path={routes.articleList} element={<Articles />} />
                        <Route path="/articles/:slug" element={<ArticleDetail />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path={routes.signup} element={<SignupPage />} />
                        <Route path={routes.forgotPassword} element={<ForgotPasswordPage />} />
                        <Route path={routes.authCallback} element={<AuthCallbackPage />} />

                        {/* Noticias Hub Routes */}
                        <Route path="/NoticiasHub" element={<RedirectToToday />} />
                        <Route path="/NoticiasHub/:date" element={<NoticiasHubPage />} />
                        <Route path="/NoticiasHub/:date/:slug" element={<NoticiasArticlePage />} />
                        <Route path="/NoticiasHub/:date/:slug/:format" element={<NoticiasArticleFormatPage />} />

                        {/* Resumen Hub Routes */}
                        <Route path="/ResumenHub" element={<RedirectToToday />} />
                        <Route path="/ResumenHub/:date" element={<ResumenHubPage />} />



                        <Route path="/ResumenHub/:date/Las5DelDia" element={<ResumenLas5Page />} />
                        <Route path="/ResumenHub/:date/Las5DelDia/:slug" element={<ResumenLas5ArticlePage />} />
                        <Route path="/ResumenHub/:date/Las5DelDia/:slug/:format" element={<ResumenLas5ArticleFormatPage />} />

                        <Route path="/ResumenHub/:date/LaOpinionDelDia" element={<ResumenOpinionPage />} />
                        <Route path="/ResumenHub/:date/LaOpinionDelDia/:slug" element={<ResumenOpinionArticlePage />} />
                        <Route path="/ResumenHub/:date/LaOpinionDelDia/:slug/:format" element={<ResumenOpinionArticleFormatPage />} />

                        <Route path="/ResumenHub/:date/ElPodcastDelDia" element={<ResumenPodcastPage />} />
                        <Route path="/ResumenHub/:date/LasFotosDelDia" element={<ResumenFotosPage />} />
                        <Route path="/ResumenHub/:date/LosCartonesDelDia" element={<ResumenCartonesPage />} />
                        <Route path="/ResumenHub/:date/LosJuegosDelDia" element={<ResumenJuegosRedirectPage />} />

                        {/* EPaper Routes */}
                        <Route path="/EPaper" element={<RedirectToToday />} />
                        <Route path="/EPaper/:date" element={<EpaperHubPage />} />
                        <Route path="/EPaper/:date/:editionNumber" element={<EpaperEditionPage />} />


                        {/* Perfil Hub Routes */}
                        <Route
                            path={routes.perfilHub}
                            element={
                                <ProtectedRoute>
                                    <PerfilHubPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Playground & Staging Routes */}
                        <Route path={routes.STAGING_ROOT} element={<StagingMenu />} />
                        <Route path={routes.playground} element={<PlaygroundMenu />} />
                        <Route path={routes.PLAYGROUND_ARTICLE} element={<PlaygroundArticle />} />
                        <Route path={routes.PLAYGROUND_ARTICLE_STANDARD} element={<PlaygroundArticleStandard />} />
                        <Route path={routes.PLAYGROUND_ARTICLE_STANDARD_2} element={<PlaygroundArticleStandardDark />} />
                        <Route path={routes.PLAYGROUND_HOME} element={<PlaygroundHome />} />
                        <Route path={routes.PLAYGROUND_HEADERS} element={<PlaygroundHeaders />} />
                        <Route path={routes.playgroundComponents} element={<PlaygroundComponents />} />
                        <Route path={routes.PLAYGROUND_ARTICLE_COMPONENTS} element={<PlaygroundArticleComponents />} />
                        <Route path={routes.PLAYGROUND_RECOMMENDED_ARTICLES} element={<PlaygroundRecommendedArticles />} />
                        <Route path={routes.PLAYGROUND_AUTHOR_CARD} element={<PlaygroundAuthorCard />} />
                        <Route path={routes.PLAYGROUND_RICH_TEXT} element={<PlaygroundRichText />} />
                        <Route path={routes.PLAYGROUND_QUOTE} element={<PlaygroundQuote />} />
                        <Route path={routes.PLAYGROUND_GALLERY} element={<PlaygroundGallery />} />
                        <Route path={routes.PLAYGROUND_EMBED} element={<PlaygroundEmbed />} />
                        <Route path={routes.PLAYGROUND_INFOGRAPHICS} element={<PlaygroundInfographics />} />
                        <Route path={routes.PLAYGROUND_ILLUSTRATIONS} element={<PlaygroundIllustrations />} />
                        <Route path={routes.PLAYGROUND_SINGLE_IMAGE} element={<PlaygroundSingleImage />} />
                        <Route path={routes.PLAYGROUND_AUDIO_PLAYER} element={<PlaygroundAudioPlayer />} />
                        <Route path={routes.PLAYGROUND_HERO_IMAGE} element={<PlaygroundHeroImage />} />
                        <Route path={routes.PLAYGROUND_RESUMEN_EJECUTIVO_COMPONENTS} element={<PlaygroundResumenEjecutivoComponents />} />
                        <Route path={routes.PLAYGROUND_RESUMEN_BODY} element={<PlaygroundResumenBody />} />
                        <Route path={routes.PLAYGROUND_RESUMEN_UPPER_DESIGN} element={<PlaygroundResumenUpperDesign />} />
                        <Route path={routes.PLAYGROUND_RESUMEN_MAIN_BODY} element={<PlaygroundResumenMainBody />} />
                        <Route path={routes.PLAYGROUND_RESUMEN_LOWER_DESIGN} element={<PlaygroundResumenLowerDesign />} />
                        <Route path={routes.PLAYGROUND_RESUMEN_STAGING} element={<PlaygroundResumenStaging />} />
                        <Route path={routes.PLAYGROUND_AUDIO_SUMMARY} element={<PlaygroundAudioSummary />} />
                        <Route path={routes.PLAYGROUND_COMMENTS} element={<PlaygroundComments />} />
                        <Route path={routes.PLAYGROUND_ARTICLE_COMMENTS_ENTRY} element={<PlaygroundArticleCommentsEntry />} />
                        <Route path={routes.PLAYGROUND_NOTICIAS_ARTICLE_LANDING} element={<PlaygroundNoticiasArticleLanding />} />
                        <Route path={routes.PLAYGROUND_AI_CHAT_BAR} element={<PlaygroundAiChatBar />} />
                        <Route path={routes.PLAYGROUND_UX_IMPROVEMENT} element={<PlaygroundUxImprovement />} />
                        <Route path={routes.PLAYGROUND_UX_NOTICIAS_FLOW} element={<PlaygroundUxNoticiasFlow />} />
                        <Route path="/dev/playground/ux-improvement/video-ux" element={<PlaygroundVideoUx />} />
                        <Route path="/dev/playground/ux-improvement/podcast-ux" element={<PlaygroundPodcastUx />} />
                        <Route path="/dev/playground/ux-improvement/presentacion-ux" element={<PlaygroundPresentacionUx />} />
                        <Route path="/dev/playground/ux-improvement/presentacion-ux/pdf" element={<PlaygroundPresentacionPdf />} />
                        <Route path="/dev/playground/ux-improvement/presentacion-ux/video" element={<PlaygroundPresentacionVideo />} />

                        {/* Staging Routes */}
                        <Route path="/articulo/:slug" element={<StandardOneRoute />} />
                        <Route path="/dev/staging/standard-one/:slug" element={<StandardOneRoute />} />\r
                        <Route path={routes.ejecutivo} element={<ResumenEjecutivoPage />} />

                        {/* Strapi Integration Test */}
                        <Route path={routes.strapiTest} element={<StrapiTestPage />} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </BrowserRouter >
    );
};
