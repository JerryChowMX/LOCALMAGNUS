/**
 * VideoFeedScroller - Infinite scroll with snap-to-video behavior
 * Uses IntersectionObserver for viewport detection
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { VideoPlayer } from './VideoPlayer';
import type { VideoPost } from '../types/video.types';
import './VideoFeedScroller.css';

interface VideoFeedScrollerProps {
    videos: VideoPost[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

export const VideoFeedScroller: React.FC<VideoFeedScrollerProps> = ({
    videos,
    isLoading,
    hasMore,
    onLoadMore,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const videoRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    // Setup IntersectionObserver for active video detection
    useEffect(() => {
        const options: IntersectionObserverInit = {
            root: containerRef.current,
            threshold: 0.8, // 80% visibility required
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Number(entry.target.getAttribute('data-index'));
                    if (!isNaN(index)) {
                        setActiveIndex(index);
                    }
                }
            });
        }, options);

        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    // Register video elements with observer
    const registerVideoRef = useCallback((index: number, element: HTMLDivElement | null) => {
        if (element) {
            videoRefs.current.set(index, element);
            observerRef.current?.observe(element);
        } else {
            const existing = videoRefs.current.get(index);
            if (existing) {
                observerRef.current?.unobserve(existing);
                videoRefs.current.delete(index);
            }
        }
    }, []);

    // Trigger load more when approaching end
    useEffect(() => {
        if (activeIndex >= videos.length - 3 && hasMore && !isLoading) {
            onLoadMore();
        }
    }, [activeIndex, videos.length, hasMore, isLoading, onLoadMore]);

    // Reset scroll position when videos change (date change)
    useEffect(() => {
        if (containerRef.current && videos.length > 0) {
            containerRef.current.scrollTop = 0;
            setActiveIndex(0);
        }
    }, [videos.length === 0]); // Only reset when going from 0 to some

    if (isLoading && videos.length === 0) {
        return (
            <div className="video-feed-scroller video-feed-scroller--loading">
                <div className="video-feed-scroller__loader">
                    Cargando videos...
                </div>
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="video-feed-scroller video-feed-scroller--empty">
                <div className="video-feed-scroller__empty">
                    No hay videos para esta fecha
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="video-feed-scroller">
            {videos.map((video, index) => {
                // Only render videos in a reasonable range (memory optimization)
                const isInRange = Math.abs(index - activeIndex) <= 3;

                return (
                    <div
                        key={video.id}
                        ref={(el) => registerVideoRef(index, el)}
                        data-index={index}
                        className="video-feed-scroller__item"
                    >
                        {isInRange ? (
                            <>
                                <VideoPlayer
                                    videoUrl={video.videoUrl}
                                    posterUrl={video.posterUrl}
                                    isActive={index === activeIndex}
                                    shouldPreload={index === activeIndex || index === activeIndex + 1}
                                />
                                <div className="video-feed-scroller__info">
                                    <h2 className="video-feed-scroller__title">{video.title}</h2>
                                    {video.dek && (
                                        <p className="video-feed-scroller__dek">{video.dek}</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Placeholder for out-of-range videos
                            <div className="video-feed-scroller__placeholder" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
