import { useState } from 'react';
import { PageWrapper } from '../../components/Layout/PageWrapper';
import { Heading, Text } from '../../components/Typography/Typography';
import { HeaderCenteredStack } from '../../components/Header/HeaderCenteredStack';
import { PlaygroundHeader } from './components/PlaygroundHeader';

export const PlaygroundHeaders = () => {
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const handleDateChange = (newDate: string) => {
        setDate(newDate);
    }

    return (
        <PageWrapper>
            <PlaygroundHeader />
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', paddingBottom: '100px', backgroundColor: '#F9FAFB' }}>

                <div style={{ padding: '24px' }}>
                    <Heading level={1} style={{ marginBottom: '8px' }}>Glassmorphism Header</Heading>
                    <Text variant="body" style={{ marginBottom: '32px', color: '#666' }}>
                        Production-ready header component with glassmorphism effects - now fully scalable and reusable!
                    </Text>
                </div>

                {/* Glassmorphism Demo */}
                <div style={{ marginBottom: '64px' }}>
                    <Text variant="caption" style={{ padding: '0 24px', marginBottom: '12px', display: 'block', fontWeight: 'bold', color: '#888' }}>
                        PRODUCTION COMPONENT
                    </Text>
                    <div style={{
                        border: '1px solid #ccc',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        height: '400px',
                        position: 'relative',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
                    }}>
                        {/* Content behind the glass header */}
                        <div style={{ padding: '100px 24px 24px', position: 'relative', zIndex: 1 }}>
                            <div style={{ height: '40px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '8px', marginBottom: '16px', backdropFilter: 'blur(10px)' }}></div>
                            <div style={{ height: '120px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '8px', marginBottom: '16px', backdropFilter: 'blur(10px)' }}></div>
                            <div style={{ height: '80px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}></div>
                        </div>

                        {/* The Reusable Glass Header */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
                            <HeaderCenteredStack
                                variant="light"
                                currentDate={date}
                                onDateChange={handleDateChange}
                                showBackButton={true}
                            />
                        </div>
                    </div>
                    <Text variant="caption" style={{ padding: '12px 24px', display: 'block', color: '#666' }}>
                        ✅ Uses CSS variables (no hardcoded values)<br />
                        ✅ Proper TypeScript interfaces<br />
                        ✅ Theme-aware (light/dark)<br />
                        ✅ Configurable with props<br />
                        ✅ Follows MAGNUS design system
                    </Text>
                </div>

            </div>
        </PageWrapper>
    );
};
