import React from 'react';
import { Divider } from '../../../components/Divider/Divider';
import { AuthHeaderLogo } from '../components/AuthHeaderLogo';
import { LoginForm } from '../components/LoginForm';
import { SocialLoginButtons } from '../components/SocialLoginButtons';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    return (
        <div className="login-page__container">
            <AuthHeaderLogo />

            <div className="login-page__form-card">
                <LoginForm />

                <Divider orientation="horizontal">Ó</Divider>

                <SocialLoginButtons />
            </div>
        </div>
    );
};
