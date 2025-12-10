import React from 'react';
import { SocialButton } from '../../../components/Button/SocialButton';
import './SocialLoginButtons.css';

export const SocialLoginButtons: React.FC = () => {
    const handleGoogleLogin = () => {
        // Redirect to Strapi's Google auth provider
        window.location.href = `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api'}/connect/google`;
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
