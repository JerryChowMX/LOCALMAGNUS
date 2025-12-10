import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout/Section';
import { Heading, Text } from '../../../components/Typography/Typography';

export const AuthCallbackPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { provider } = useParams<{ provider: string }>();
    const { socialLogin } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            if (!provider) {
                setError('No provider specified');
                return;
            }

            const searchParams = new URLSearchParams(location.search);
            const accessToken = searchParams.get('access_token');
            const idToken = searchParams.get('id_token');

            if (!accessToken && !idToken) {
                setError('No authentication token received');
                return;
            }

            try {
                let jwt = searchParams.get('jwt');

                // If no JWT but we have an access_token, we likely need to exchange it
                if (!jwt && accessToken) {
                    console.log('Exchanging access_token for Strapi JWT...');
                    const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api';
                    const res = await fetch(`${strapiUrl}/auth/${provider}/callback?access_token=${accessToken}`);
                    const data = await res.json();

                    if (data.jwt) {
                        jwt = data.jwt;
                    } else {
                        // Capture exchange error
                        throw new Error(`Token exchange failed: ${data.error?.message || JSON.stringify(data)}`);
                    }
                }

                if (jwt) {
                    await socialLogin(jwt);
                    navigate('/PerfilHub', { replace: true });
                } else {
                    setError('Authentication flow failed: No JWT could be obtained.');
                }

            } catch (err: any) {
                console.error('Auth callback error', err);
                const jwt = new URLSearchParams(location.search).get('access_token') || '';
                const tokenPrefix = jwt.substring(0, 5);
                const params = Array.from(new URLSearchParams(location.search).keys()).join(', ');

                const errorMessage = err.message || 'Unknown error';
                setError(`Auth Failed. Params: [${params}]. Prefix: ${tokenPrefix}. Msg: ${errorMessage}`);
            }
        };

        handleCallback();
    }, [location, provider, socialLogin, navigate]);

    if (error) {
        return (
            <PageWrapper>
                <Section padding="lg">
                    <Heading level={2}>Authentication Error</Heading>
                    <Text variant="body" color="error">{error}</Text>
                    <Text variant="caption" className="cursor-pointer" onClick={() => navigate('/login')}>
                        Return to Login
                    </Text>
                </Section>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Section padding="lg">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                    <Heading level={3}>Authenticating with {provider}...</Heading>
                    <Text variant="body">Please wait while we log you in.</Text>
                </div>
            </Section>
        </PageWrapper>
    );
};
