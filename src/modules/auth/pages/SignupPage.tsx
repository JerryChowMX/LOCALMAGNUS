import React from 'react';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout/Section';
import { Stack } from '../../../components/Layout/Stack';
import { Divider } from '../../../components/Divider/Divider';
import { AuthHeaderLogo } from '../components/AuthHeaderLogo';
import { SignupForm } from '../components/SignupForm';
import { SocialLoginButtons } from '../components/SocialLoginButtons';
import './SignupPage.css';

export const SignupPage: React.FC = () => {
    return (
        <PageWrapper>
            <div className="signup-page__container">
                <Section padding="lg">
                    <Stack spacing="xl" align="center">
                        <AuthHeaderLogo />

                        <div className="signup-page__form-card">
                            <SignupForm />

                            <Divider orientation="horizontal">Ó</Divider>

                            <SocialLoginButtons />
                        </div>
                    </Stack>
                </Section>
            </div>
        </PageWrapper>
    );
};
