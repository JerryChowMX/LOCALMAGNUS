/**
 * VideosDelDiaPage - Main route component for video feed
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HeaderCenteredStack } from '../../../components/Header/HeaderCenteredStack';
import { VideoFeedScroller } from '../components/VideoFeedScroller';
import { useVideoFeed } from '../hooks/useVideoFeed';
import { getMonterreyDate } from '../../../lib/dateUtils';
import './VideosDelDiaPage.css';

export const VideosDelDiaPage: React.FC = () => {
    const { date } = useParams<{ date: string }>();
    const navigate = useNavigate();

    // Fallback to today if no date provided
    const currentDate = date || getMonterreyDate();

    const {
        videos,
        isLoading,
        hasMore,
        error,
        loadMore,
    } = useVideoFeed({ date: currentDate });

    // Handle date change - navigate to new date
    const handleDateChange = (newDate: string) => {
        navigate(`/VideosDelDia/${newDate}`);
    };

    // Handle video selection from search
    const handleVideoSelect = (video: any) => {
        // TODO: Navigate to video or scroll to it in feed
        // For now, we could potentially scroll to the video if it's in the current feed
        console.log('Selected video from search:', video);
    };

    return (
        <div className="videos-del-dia-page">
            <HeaderCenteredStack
                variant="light"
                currentDate={currentDate}
                onDateChange={handleDateChange}
                onBack={() => navigate('/')}
                searchMode="videos"
                onVideoSelect={handleVideoSelect}
            />

            {error ? (
                <div className="videos-del-dia-page__error">
                    <p>Error: {error}</p>
                    <button onClick={() => window.location.reload()}>
                        Reintentar
                    </button>
                </div>
            ) : (
                <VideoFeedScroller
                    videos={videos}
                    isLoading={isLoading}
                    hasMore={hasMore}
                    onLoadMore={loadMore}
                />
            )}
        </div>
    );
};
