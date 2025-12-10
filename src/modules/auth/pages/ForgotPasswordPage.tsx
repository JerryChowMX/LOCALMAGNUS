import React from 'react';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout/Section';
import { Stack } from '../../../components/Layout/Stack';
import { AuthHeaderLogo } from '../components/AuthHeaderLogo';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import './ForgotPasswordPage.css';

export const ForgotPasswordPage: React.FC = () => {
    return (
        <PageWrapper>
            <div className="forgot-password-page__container">
                <Section padding="lg">
                    <Stack spacing="xl" align="center">
                        <AuthHeaderLogo />

                        <div className="forgot-password-page__form-card">
                            <ForgotPasswordForm />
                        </div>
                    </Stack>
                </Section>
            </div>
        </PageWrapper>
    );
};
