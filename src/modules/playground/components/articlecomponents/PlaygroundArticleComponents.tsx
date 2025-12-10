import { PageWrapper } from '../../../../components/Layout/PageWrapper';
import { HeaderContent } from '../../../../modules/noticiasHub/components/HeaderContent';
import { Heading, Text } from '../../../../components/Typography/Typography';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../../../../app/routes';

// Simple list component for playground menu - ready to be used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PlaygroundLink = ({ to, title, description }: { to: string, title: string, description: string }) => (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '16px' }}>
        <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#fff', transition: 'all 0.2s' }}>
            <Text variant="body" style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{title}</Text>
            <Text variant="caption" style={{ color: '#6B7280' }}>{description}</Text>
        </div>
    </Link>
);

export const PlaygroundArticleComponents = () => {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <HeaderContent
                    onBack={() => navigate(routes.playgroundComponents)}
                />

                <div style={{ padding: '24px' }}>
                    <Heading level={1} style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Article Components</Heading>
                    <Text variant="body" style={{ color: '#6B7280', marginBottom: '24px' }}>
                        Individual components used in article pages.
                    </Text>

                    <PlaygroundLink
                        to={routes.PLAYGROUND_RECOMMENDED_ARTICLES}
                        title="Recommended Articles (Carousel)"
                        description="Horizontal scrollable list of recommended articles."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_AUTHOR_CARD}
                        title="Author Card"
                        description="Author information card component."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_RICH_TEXT}
                        title="Rich Text"
                        description="Rich Text renderer for handling complex content blocks (markdown, quotes, etc)."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_QUOTE}
                        title="Quote"
                        description="Stylized quote component for highlighted text."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_GALLERY}
                        title="Gallery"
                        description="Image gallery component handling multiple images."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_EMBED}
                        title="Embed"
                        description="Embed component for external content (videos, tweets, etc)."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_INFOGRAPHICS}
                        title="Infographics"
                        description="Infographic component for data visualizations."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_ILLUSTRATIONS}
                        title="Illustrations"
                        description="Illustration component for editorial images."
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_SINGLE_IMAGE}
                        title="Single Image"
                        description="Photo and image display variations with captions"
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_AUDIO_PLAYER}
                        title="Audio Player"
                        description="Audio playback component with controls and progress bar"
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_HERO_IMAGE}
                        title="Hero Image"
                        description="Hero image display variations for article headers"
                    />

                    <PlaygroundLink
                        to={routes.PLAYGROUND_ARTICLE_COMMENTS_ENTRY}
                        title="Comments (Article Entry)"
                        description="Design for the comment section entry point at the bottom of an article."
                    />

                </div>
            </div>
        </PageWrapper>
    );
};
