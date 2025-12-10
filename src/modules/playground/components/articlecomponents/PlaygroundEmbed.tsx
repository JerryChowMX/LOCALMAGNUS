import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';
import { TweetCard } from './Tweet/TweetCard';

export const PlaygroundEmbed = () => {
    const navigate = useNavigate();

    const mockTweets = [
        {
            title: '1. Standard Post',
            description: 'The definitive Sharp Minimal style for Magnus.',
            data: {
                author: {
                    name: 'Elon Musk',
                    handle: 'elonmusk',
                    avatar: 'https://pbs.twimg.com/profile_images/1780044485541699584/p78MCn3B_400x400.jpg',
                    verified: true
                },
                content: 'Magnus is going to be the most advanced news platform on Earth.',
                date: '10:05 AM · Dec 6, 2025',
                metrics: {
                    replies: '5.2K',
                    reposts: '12K',
                    likes: '145K',
                    views: '22M'
                }
            }
        },
        {
            title: '2. Media Post',
            description: 'How the component handles embedded media.',
            data: {
                author: {
                    name: 'Design Daily',
                    handle: 'designdaily',
                    avatar: 'https://images.unsplash.com/photo-1542354727-2c976962f3f6?w=200&h=200&fit=crop',
                    verified: true
                },
                content: 'Simplicity is the ultimate sophistication. When we remove the noise, the signal becomes clear. 🌿',
                image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&h=600&fit=crop',
                date: '8:42 AM · Dec 5, 2025',
                metrics: {
                    replies: '124',
                    reposts: '890',
                    likes: '3.2K',
                    views: '45K'
                }
            }
        },
        {
            title: '3. Breaking News',
            description: 'High impact short content.',
            data: {
                author: {
                    name: 'SpaceX',
                    handle: 'SpaceX',
                    avatar: 'https://pbs.twimg.com/profile_images/1082744382585856001/rH_k3PtQ_400x400.jpg',
                    verified: true
                },
                content: 'Starship flight 6 confirmed. Launch window opens at 08:00 CT.',
                date: '11:20 PM · Dec 4, 2025',
                metrics: {
                    replies: '8.5K',
                    reposts: '45K',
                    likes: '280K',
                    views: '5.6M'
                }
            }
        }
    ];

    return (
        <PageWrapper>
            {/* Background wrapper to show off the Glass effect */}
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f3f4f6',
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgb(240, 245, 255) 0%, rgb(255, 255, 255) 90%)'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', backgroundColor: 'transparent' }}>
                    <HeaderContent
                        onBack={() => navigate(routes.PLAYGROUND_ARTICLE_COMPONENTS)}
                    />

                    <div style={{ padding: '24px 24px 100px 24px' }}>
                        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                            <Heading level={1} style={{ marginBottom: '16px' }}>Social Standard X</Heading>
                            <Text variant="body" style={{ color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>
                                The selected embed style for the Magnus design system.
                                Sharp corners, high utility, and Magnus Blue accents.
                            </Text>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
                            {mockTweets.map((tweet, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                                        <Heading level={3} style={{ fontSize: '20px', marginBottom: '8px' }}>{tweet.title}</Heading>
                                        <Text variant="caption" style={{ color: '#6B7280' }}>{tweet.description}</Text>
                                    </div>

                                    {/* The Component Render */}
                                    <TweetCard
                                        data={tweet.data}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};
