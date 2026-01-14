/**
 * VideoFeedScroller - Infinite scroll with snap-to-video behavior
 * Uses IntersectionObserver for viewport detection
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { VideoSideBar } from './VideoSideBar';
import { Icons } from '../../../components/Icons';
import type { VideoPost } from '../types/video.types';
import { likeVideo, unlikeVideo } from '../services/videoApi';
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
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const videoRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    // Track if video was playing before expand (to resume on collapse)
    const wasPlayingRef = useRef(false);

    // Track active index in ref to avoid stale closures in observer
    const activeIndexRef = useRef(0);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    const [likedVideos, setLikedVideos] = useState<Set<string>>(() => {
        const stored = localStorage.getItem('likedVideos');
        return stored ? new Set(JSON.parse(stored)) : new Set();
    });

    // Track video like counts (optimistic updates)
    const [videoCounts, setVideoCounts] = useState<Map<string, number>>(new Map());

    // Handle like/unlike
    const handleLike = useCallback(async (video: VideoPost) => {
        const isLiked = likedVideos.has(video.documentId);

        // Optimistic update
        const newLikedVideos = new Set(likedVideos);
        if (isLiked) {
            newLikedVideos.delete(video.documentId);
        } else {
            newLikedVideos.add(video.documentId);
        }
        setLikedVideos(newLikedVideos);
        localStorage.setItem('likedVideos', JSON.stringify([...newLikedVideos]));

        try {
            // Call API
            const result = isLiked
                ? await unlikeVideo(video.documentId)
                : await likeVideo(video.documentId);

            // Update count
            setVideoCounts(prev => new Map(prev).set(video.documentId, result.likeCount));
        } catch (error) {
            // Revert on error
            setLikedVideos(likedVideos);
            localStorage.setItem('likedVideos', JSON.stringify([...likedVideos]));
            console.error('Failed to update like:', error);
        }
    }, [likedVideos]);

    const handleShare = useCallback(async (video: VideoPost) => {
        if (navigator.share) {
            try {
                // Construct a shareable URL (either specific video deep link or just the current page)
                // For now, using the current page + hash or query param if supported, otherwise just current URL
                const shareUrl = window.location.href; // Or construct specific URL

                await navigator.share({
                    title: video.title,
                    text: video.dek || `Mira este video: ${video.title}`,
                    url: shareUrl,
                });
            } catch (error) {
                // User cancelled or share failed
                console.log('Share failed or cancelled', error);
            }
        } else {
            console.log('Share not supported on this device/browser');
        }
    }, []);

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
                        // Only update if index changed prevents redundant collapse of expanded state
                        if (index !== activeIndexRef.current) {
                            setActiveIndex(index);
                            // Collapse description when scrolling to new video
                            setExpandedIndex(null);
                        }
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
            setExpandedIndex(null);
        }
    }, [videos.length === 0]); // Only reset when going from 0 to some

    // Expand description (title tap or "More" tap)
    const handleExpand = useCallback((index: number) => {
        setExpandedIndex(index);
        wasPlayingRef.current = true; // Video will be paused via isPaused prop
    }, []);

    // Collapse description
    const handleCollapse = useCallback(() => {
        setExpandedIndex(null);
    }, []);

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
                <div className="video-feed-scroller__empty-content">
                    <div className="video-feed-scroller__empty-icon">
                        <Icons.play size={48} />
                    </div>
                    <h2 className="video-feed-scroller__empty-title">
                        No hay videos para esta fecha
                    </h2>
                    <p className="video-feed-scroller__empty-text">
                        Intenta buscar en otro día usando el selector de fecha superior.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="video-feed-scroller">
            {videos.map((video, index) => {
                // Only render videos in a reasonable range (memory optimization)
                const isInRange = Math.abs(index - activeIndex) <= 3;
                const isActive = index === activeIndex;
                const isExpanded = expandedIndex === index;

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
                                    isActive={isActive}
                                    shouldPreload={isActive || index === activeIndex + 1}
                                    onScrubChange={isActive ? setIsScrubbing : undefined}
                                >
                                    {/* Info overlay */}
                                    <div
                                        className={`video-feed-scroller__info ${isScrubbing && isActive ? 'video-feed-scroller__info--hidden' : ''
                                            } ${isExpanded ? 'video-feed-scroller__info--expanded' : ''}`}
                                        onClick={(e) => e.stopPropagation()}
                                        onTouchStart={(e) => e.stopPropagation()}
                                        onTouchEnd={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onMouseUp={(e) => e.stopPropagation()}
                                    >
                                        {/* Title - always visible, tappable to expand */}
                                        <h2
                                            className="video-feed-scroller__title"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (video.dek && !isExpanded) handleExpand(index);
                                            }}
                                        >
                                            {video.title}
                                        </h2>

                                        {/* Collapsed state: show "More" if dek exists */}
                                        {!isExpanded && video.dek && (
                                            <button
                                                type="button"
                                                className="video-feed-scroller__more-btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleExpand(index);
                                                }}
                                            >
                                                Más <Icons.chevronDown size={16} />
                                            </button>
                                        )}

                                        {/* Expanded state: show full dek then "Menos" button */}
                                        {isExpanded && video.dek && (
                                            <div className="video-feed-scroller__dek-container">
                                                <p className="video-feed-scroller__dek">{video.dek}</p>
                                                <button
                                                    type="button"
                                                    className="video-feed-scroller__more-btn"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleCollapse();
                                                    }}
                                                >
                                                    Menos <Icons.chevronUp size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Side Action Bar - Always visible, fixed position */}
                                    <VideoSideBar
                                        likeCount={videoCounts.get(video.documentId) ?? video.likeCount}
                                        isLiked={likedVideos.has(video.documentId)}
                                        onLike={() => handleLike(video)}
                                        onComment={() => console.log('Comment clicked')}
                                        onReadArticle={video.originalArticleUrl ? () => {
                                            if (video.originalArticleUrl?.startsWith('/')) {
                                                // Internal navigation
                                                window.location.href = video.originalArticleUrl;
                                            } else {
                                                // External navigation
                                                window.open(video.originalArticleUrl, '_blank');
                                            }
                                        } : undefined}
                                        onShare={() => handleShare(video)}
                                    />
                                </VideoPlayer>
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
