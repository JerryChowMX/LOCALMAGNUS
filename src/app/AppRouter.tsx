import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { routes } from './routes';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';
import { getMonterreyDate } from '../lib/dateUtils';

// Lazy load page components
const HomeHubsPage = lazy(() => import('../modules/home/pages/HomeHubsPage').then(module => ({ default: module.HomeHubsPage })));

// Notas Routes
const NotasFeedPage = lazy(() => import('../modules/articles/pages/NotasFeedPage').then(module => ({ default: module.NotasFeedPage })));
const UnifiedArticleView = lazy(() => import('../modules/articles/pages/UnifiedArticleView').then(module => ({ default: module.UnifiedArticleView })));

// Resumen Ejecutivo (keeping this separate module)
const ResumenEjecutivoPage = lazy(() => import('../modules/resumenEjecutivo/pages/ResumenEjecutivoPage').then(module => ({ default: module.ResumenEjecutivoPage })));

// Videos del Día
const VideosDelDiaPage = lazy(() => import('../modules/videosDelDia/pages/VideosDelDiaPage').then(module => ({ default: module.VideosDelDiaPage })));

// EPaper
const EpaperHubPage = lazy(() => import('../modules/epaper/pages/EpaperHubPage').then(module => ({ default: module.EpaperHubPage })));
const EpaperEditionPage = lazy(() => import('../modules/epaper/pages/EpaperEditionPage').then(module => ({ default: module.EpaperEditionPage })));

// Auth
const LoginPage = lazy(() => import('../modules/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('../modules/auth/pages/SignupPage').then(module => ({ default: module.SignupPage })));
const ForgotPasswordPage = lazy(() => import('../modules/auth/pages/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const AuthCallbackPage = lazy(() => import('../modules/auth/pages/AuthCallbackPage').then(module => ({ default: module.AuthCallbackPage })));
const PerfilHubPage = lazy(() => import('../modules/perfilHub/pages/PerfilHubPage').then(module => ({ default: module.PerfilHubPage })));

// Dev Routes
const StagingMenu = lazy(() => import('../modules/staging/StagingMenu').then(module => ({ default: module.StagingMenu })));
const PlaygroundRouter = lazy(() => import('./routes/PlaygroundRouter').then(module => ({ default: module.PlaygroundRouter })));
const StrapiTestPage = lazy(() => import('../modules/playground/pages/StrapiTestPage'));
const StandardOneRoute = lazy(() => import('./routes/article/StandardOneRoute').then(module => ({ default: module.StandardOneRoute })));
const PodcastTestPage = lazy(() => import('../modules/podcasts/pages/PodcastTestPage').then(module => ({ default: module.PodcastTestPage })));
const PodcastHubPage = lazy(() => import('../modules/podcasts/pages/PodcastHubPage').then(module => ({ default: module.PodcastHubPage })));

// Error Pages
const NotFoundPage = lazy(() => import('../modules/errors/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Fallback loader
const RouteLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <p>Loading...</p>
    </div>
);

// Helper to redirect to today's date
const RedirectToToday = () => {
    const location = useLocation();
    const today = getMonterreyDate();
    const cleanPath = location.pathname.replace(/\/$/, '');
    return <Navigate to={`${cleanPath}/${today}`} replace />;
};

import { SubscriptionGuard } from '../modules/monetization/components/SubscriptionGuard';
import { Outlet } from 'react-router-dom';

const MonetizedLayout = () => (
    <SubscriptionGuard>
        <Outlet />
    </SubscriptionGuard>
);

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Suspense fallback={<RouteLoader />}>
                    <Routes>
                        {/* Auth (Public) */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path={routes.signup} element={<SignupPage />} />
                        <Route path={routes.forgotPassword} element={<ForgotPasswordPage />} />
                        <Route path={routes.authCallback} element={<AuthCallbackPage />} />

                        {/* Dev Routes (Public for Development) */}
                        <Route path={routes.STAGING_ROOT} element={<StagingMenu />} />
                        <Route path="/dev/playground/*" element={<PlaygroundRouter />} />
                        <Route path={routes.strapiTest} element={<StrapiTestPage />} />
                        <Route path="/dev/staging/standard-one/:slug" element={<StandardOneRoute />} />

                        {/* Protected / Monetized Routes */}
                        <Route element={<MonetizedLayout />}>
                            {/* Home */}
                            <Route path={routes.home} element={<HomeHubsPage />} />

                            {/* Notas Routes */}
                            <Route path="/Notas" element={<RedirectToToday />} />
                            <Route path="/Notas/:date" element={<NotasFeedPage />} />
                            <Route path="/Notas/:date/:slug" element={<UnifiedArticleView />} />
                            <Route path="/articulo/:slug" element={<StandardOneRoute />} />

                            {/* Videos del Día Routes */}
                            <Route path="/VideosDelDia" element={<RedirectToToday />} />
                            <Route path="/VideosDelDia/:date" element={<VideosDelDiaPage />} />

                            {/* EPaper Routes */}
                            <Route path="/EPaper" element={<RedirectToToday />} />
                            <Route path="/EPaper/:date" element={<EpaperHubPage />} />
                            <Route path="/EPaper/:date/:editionNumber" element={<EpaperEditionPage />} />


                            {/* Podcasts del Día Routes */}
                            <Route path="/PodcastsDelDia" element={<RedirectToToday />} />
                            <Route path="/PodcastsDelDia/:date" element={<PodcastHubPage />} />

                            {/* Resumen */}
                            <Route path={routes.ejecutivo} element={<ResumenEjecutivoPage />} />

                            {/* Perfil Hub (Protected) */}
                            <Route
                                path={routes.perfilHub}
                                element={
                                    <ProtectedRoute>
                                        <PerfilHubPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>


                        {/* Podcasts Test Route (Phase 0) */}
                        <Route path="/test-podcasts" element={<PodcastTestPage />} />

                        {/* 404 Catch-all */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </BrowserRouter>
    );
};

// Renaming ProtectedRoute to PermissionsGuard to avoid confusion, 
// as SubscriptionGuard now handles the main "Access" protection.
// But wait, ProtectedRoute import is at the top. 
// I should just use MonetizedLayout for now. I'll leave PerfilHub as is for now, but wrapped in MonetizedLayout so it also checks subscription.

