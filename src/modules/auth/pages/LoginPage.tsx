import React from 'react';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout/Section';
import { Stack } from '../../../components/Layout/Stack';
import { Divider } from '../../../components/Divider/Divider';
import { AuthHeaderLogo } from '../components/AuthHeaderLogo';
import { LoginForm } from '../components/LoginForm';
import { SocialLoginButtons } from '../components/SocialLoginButtons';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    return (
        <PageWrapper>
            <div className="login-page__container">
                <Section padding="lg">
                    <Stack spacing="xl" align="center">
                        <AuthHeaderLogo />

                        <div className="login-page__form-card">
                            <LoginForm />

                            <Divider orientation="horizontal">Ó</Divider>

                            <SocialLoginButtons />
                        </div>
                    </Stack>
                </Section>
            </div>
        </PageWrapper>
    );
};
