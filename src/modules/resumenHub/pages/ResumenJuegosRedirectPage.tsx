import React, { useEffect } from 'react';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section } from '../../../components/Layout';
import { Body } from '../../../components/Typography/Typography';

export const ResumenJuegosRedirectPage: React.FC = () => {
    useEffect(() => {
        window.location.href = "https://vanguardia.com.mx/juegos";
    }, []);

    return (
        <PageWrapper>
            <Section padding="lg">
                <Body>Redirigiendo a juegos...</Body>
            </Section>
        </PageWrapper>
    );
};
