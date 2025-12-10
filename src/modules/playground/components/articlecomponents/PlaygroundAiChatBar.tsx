import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { Section, Stack } from '../../../../components/Layout';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { HeaderContent } from '../../../noticiasHub/components/HeaderContent';
import { AiChatBar } from '../../../../components/AiChatBar';
import { routes } from '../../../../app/routes';

export const PlaygroundAiChatBar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F3F4F6', paddingBottom: '100px' }}>
                <HeaderContent onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)} />

                <Section padding="md">
                    <Stack spacing="lg">
                        <div style={{ textAlign: 'center' }}>
                            <Heading level={2}>Chat + Comments</Heading>
                            <Text variant="body" style={{ color: '#6B7280' }}>
                                Floating action bar concepts integrating AI Chat and Comments.
                            </Text>
                        </div>

                        {/* FINAL PRODUCTION COMPONENT */}
                        <div style={{ marginTop: '24px' }}>
                            <Text variant="caption" style={{ marginBottom: '8px', display: 'block', fontWeight: 600 }}>Final Production Component (Interactive)</Text>
                            <div style={{
                                position: 'relative', height: '300px', border: '1px dashed #E5E7EB', borderRadius: '12px', background: '#f9fafb',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                            }}>
                                {/* Mock Context for Article */}
                                <AiChatBar context="global" />

                                <Text style={{ color: '#9CA3AF' }}>Interact with the bar below</Text>
                            </div>
                        </div>

                    </Stack>
                </Section>
            </div>
        </PageWrapper>
    );
};
