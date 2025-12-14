import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Icons } from '../../../components/Icons';
import './AuthCallbackPage.css';

// Error message translations
const ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
    access_denied: {
        title: 'Acceso Denegado',
        message: 'Por favor, intenta de nuevo.'
    },
    invalid_request: {
        title: 'Solicitud Inválida',
        message: 'Hubo un problema con la solicitud de autenticación. Por favor, intenta de nuevo.'
    },
    unauthorized_client: {
        title: 'Cliente No Autorizado',
        message: 'Esta aplicación no está autorizada para realizar esta operación.'
    },
    server_error: {
        title: 'Error del Servidor',
        message: 'Ocurrió un error en el servidor de autenticación. Por favor, intenta más tarde.'
    },
    temporarily_unavailable: {
        title: 'Servicio No Disponible',
        message: 'El servicio de autenticación no está disponible temporalmente. Por favor, intenta más tarde.'
    },
    default: {
        title: 'Error de Autenticación',
        message: 'Ocurrió un error durante el inicio de sesión. Por favor, intenta de nuevo.'
    }
};

// Provider display names
const PROVIDER_NAMES: Record<string, string> = {
    google: 'Google',
    apple: 'Apple',
    facebook: 'Facebook'
};

export const AuthCallbackPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { provider } = useParams<{ provider: string }>();
    const { socialLogin } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [errorCode, setErrorCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            if (!provider) {
                setError('No se especificó el proveedor de autenticación');
                setErrorCode('default');
                setIsLoading(false);
                return;
            }

            const searchParams = new URLSearchParams(location.search);

            // Check for OAuth error in URL first
            const urlError = searchParams.get('error');
            if (urlError) {
                setErrorCode(urlError);
                const errorInfo = ERROR_MESSAGES[urlError] || ERROR_MESSAGES.default;
                setError(errorInfo.message);
                setIsLoading(false);
                return;
            }

            const accessToken = searchParams.get('access_token');
            const idToken = searchParams.get('id_token');

            if (!accessToken && !idToken) {
                setError('No se recibió un token de autenticación');
                setErrorCode('default');
                setIsLoading(false);
                return;
            }

            try {
                let jwt = searchParams.get('jwt');

                // If no JWT but we have an access_token, we likely need to exchange it
                if (!jwt && accessToken) {
                    const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api';
                    const res = await fetch(`${strapiUrl}/auth/${provider}/callback?access_token=${accessToken}`);
                    const data = await res.json();

                    if (data.jwt) {
                        jwt = data.jwt;
                    } else {
                        throw new Error(data.error?.message || 'Error al intercambiar el token');
                    }
                }

                if (jwt) {
                    await socialLogin(jwt);
                    navigate('/PerfilHub', { replace: true });
                } else {
                    setError('No se pudo obtener el token de sesión');
                    setErrorCode('default');
                }

            } catch (err: any) {
                console.error('Auth callback error', err);
                setError(err.message || 'Error desconocido durante la autenticación');
                setErrorCode('default');
            } finally {
                setIsLoading(false);
            }
        };

        handleCallback();
    }, [location, provider, socialLogin, navigate]);

    const handleReturnToLogin = () => {
        navigate('/login');
    };

    const providerName = PROVIDER_NAMES[provider || ''] || provider || 'el proveedor';
    const errorInfo = ERROR_MESSAGES[errorCode || 'default'] || ERROR_MESSAGES.default;

    // Error state
    if (error) {
        return (
            <PageWrapper>
                <div className="auth-callback">
                    <div className="auth-callback__icon auth-callback__icon--error">
                        <Icons.alertCircle size={80} stroke={1.5} />
                    </div>
                    <h1 className="auth-callback__title">{errorInfo.title}</h1>
                    <p className="auth-callback__message">{error}</p>
                    <button
                        type="button"
                        className="auth-callback__button"
                        onClick={handleReturnToLogin}
                    >
                        <Icons.arrowLeft size={20} />
                        Volver al inicio de sesión
                    </button>
                </div>
            </PageWrapper>
        );
    }

    // Loading state
    return (
        <PageWrapper>
            <div className="auth-callback">
                <div className="auth-callback__icon auth-callback__icon--loading">
                    <div className="auth-callback__spinner" />
                </div>
                <h1 className="auth-callback__title">Iniciando sesión con {providerName}</h1>
                <p className="auth-callback__message">
                    Por favor espera mientras completamos tu inicio de sesión...
                </p>
            </div>
        </PageWrapper>
    );
};
