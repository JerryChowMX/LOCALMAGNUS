import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageWrapper } from '../Layout/PageWrapper';
import { Section } from '../Layout';
import { Body } from '../Typography/Typography';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <PageWrapper>
                <Section padding="md">
                    <Body>Cargando sesión...</Body>
                </Section>
            </PageWrapper>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page, but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
