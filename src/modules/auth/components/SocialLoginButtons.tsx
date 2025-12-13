import React from 'react';
import { SocialButton } from '../../../components/Button/SocialButton';
import './SocialLoginButtons.css';

export const SocialLoginButtons: React.FC = () => {
    const handleGoogleLogin = () => {
        // Redirect to Strapi's Google auth provider
        // Strapi OAuth endpoint is at /api/connect/google
        const strapiBase = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api').replace(/\/api\/?$/, '');
        window.location.href = `${strapiBase}/api/connect/google`;
    };

    return (
        <div className="social-login-buttons">
            <SocialButton
                provider="google"
                onClick={handleGoogleLogin}
            />
            <SocialButton
                provider="apple"
                onClick={() => console.log('Login with Apple')}
            />
        </div>
    );
};
