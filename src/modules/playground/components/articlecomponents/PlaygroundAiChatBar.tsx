import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { Section, Stack } from '../../../../components/Layout';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { HeaderContent } from '../../../noticiasHub/components/HeaderContent';
import { AiChatBarCollapsed } from '../../../../components/AiChatBar/AiChatBarCollapsed';
import { routes } from '../../../../app/routes';

// Icons (Simulated or imported if available)
const ChatIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);
const CommentsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);
const SparklesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    </svg>
);

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
                            <Text variant="caption" style={{ marginBottom: '8px', display: 'block', fontWeight: 600 }}>Final Production Component</Text>
                            <div style={{
                                position: 'relative', height: '100px', border: '1px dashed #E5E7EB', borderRadius: '12px', background: '#f9fafb',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <AiChatBarCollapsed
                                    onChatClick={() => console.log('Chat clicked')}
                                    onCommentsClick={() => console.log('Comments clicked')}
                                    commentCount={12}
                                />
                            </div>
                        </div>

                    </Stack>
                </Section>
            </div>
        </PageWrapper>
    );
};
