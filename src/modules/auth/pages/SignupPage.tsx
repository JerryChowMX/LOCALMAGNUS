import React from 'react';
import { Divider } from '../../../components/Divider/Divider';
import { AuthHeaderLogo } from '../components/AuthHeaderLogo';
import { SignupForm } from '../components/SignupForm';
import { SocialLoginButtons } from '../components/SocialLoginButtons';
import './SignupPage.css';

export const SignupPage: React.FC = () => {
    return (
        <div className="signup-page__container">
            <AuthHeaderLogo />

            <div className="signup-page__form-card">
                <SignupForm />

                <Divider orientation="horizontal">Ó</Divider>

                <SocialLoginButtons />
            </div>
        </div>
    );
};
