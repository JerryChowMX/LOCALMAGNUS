import { PageWrapper } from '../../components/Layout/PageWrapper';
import { Heading, Text } from '../../components/Typography/Typography';

export const StagingMenu = () => {
    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', padding: '24px' }}>
                <Heading level={1} style={{ marginBottom: '8px' }}>MAGNUS Staging</Heading>
                <Text variant="body" style={{ marginBottom: '24px', color: '#6B7280' }}>
                    Candidate features for production. Strict styling rules apply.
                </Text>

                <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#F3F4F6', borderRadius: '12px', border: '1px dashed #D1D5DB' }}>
                    <Text variant="body" style={{ color: '#9CA3AF' }}>No features in staging yet.</Text>
                </div>
            </div>
        </PageWrapper>
    );
};
