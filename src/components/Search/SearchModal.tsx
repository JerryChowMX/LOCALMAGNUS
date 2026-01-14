import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useArticleSearch } from '../../hooks/useArticleSearch';
import { useVideoSearch } from '../../hooks/useVideoSearch';
import { usePodcastSearch } from '../../hooks/usePodcastSearch';
import { X, Search as SearchIcon, ChevronRight, Play, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STRAPI_ORIGIN } from '../../lib/env';
import './SearchModal.css';

export type SearchMode = 'articles' | 'videos' | 'podcasts';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: SearchMode;
    onVideoSelect?: (video: any) => void;
    onPodcastSelect?: (podcast: any) => void;
}

// Placeholder config per mode
const PLACEHOLDERS: Record<SearchMode, string> = {
    articles: 'Buscar noticias, autores, temas...',
    videos: 'Buscar videos...',
    podcasts: 'Buscar podcasts...',
};

// Format duration in mm:ss
const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const SearchModal = ({ 
    isOpen, 
    onClose, 
    mode = 'articles',
    onVideoSelect,
    onPodcastSelect 
}: SearchModalProps) => {
    const [inputValue, setInputValue] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Use the appropriate hook based on mode
    const articleSearch = useArticleSearch(mode === 'articles' ? debouncedQuery : '');
    const videoSearch = useVideoSearch(mode === 'videos' ? debouncedQuery : '');
    const podcastSearch = usePodcastSearch(mode === 'podcasts' ? debouncedQuery : '');

    // Select the active search based on mode
    const getActiveSearch = () => {
        switch (mode) {
            case 'videos':
                return videoSearch;
            case 'podcasts':
                return podcastSearch;
            default:
                return articleSearch;
        }
    };

    const { results, meta, isLoading, error } = getActiveSearch();

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(inputValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue]);

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setDebouncedQuery(inputValue);
        }
    };

    // Focus input on open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Clear state when modal closes or mode changes
    useEffect(() => {
        if (!isOpen) {
            setInputValue('');
            setDebouncedQuery('');
        }
    }, [isOpen]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle video selection
    const handleVideoClick = (video: any) => {
        if (onVideoSelect) {
            onVideoSelect(video);
        }
        onClose();
    };

    // Handle podcast selection
    const handlePodcastClick = (podcast: any) => {
        if (onPodcastSelect) {
            onPodcastSelect(podcast);
        }
        onClose();
    };

    if (!isOpen) return null;

    // Render article results
    const renderArticleResults = () => (
        <>
            {(results as any[]).map((article) => (
                <Link
                    key={article.id}
                    to={`/articulo/${article.slug}`}
                    onClick={onClose}
                    className="search-result-card"
                >
                    {article.hero_image?.url && (
                        <div className="search-result-image-wrapper">
                            <img
                                src={`${STRAPI_ORIGIN}${article.hero_image.url}`}
                                alt=""
                                className="search-result-image"
                            />
                        </div>
                    )}
                    <div className="search-result-content">
                        <h3 className="search-result-title">
                            {article.title}
                        </h3>
                        {article.category && (
                            <span className="search-result-category">
                                {article.category.name}
                            </span>
                        )}
                    </div>
                    <ChevronRight className="search-chevron" />
                </Link>
            ))}
        </>
    );

    // Render video results
    const renderVideoResults = () => (
        <>
            {(results as any[]).map((video) => (
                <button
                    key={video.id}
                    onClick={() => handleVideoClick(video)}
                    className="search-result-card search-result-card--video"
                >
                    <div className="search-result-image-wrapper search-result-image-wrapper--video">
                        {video.poster?.url ? (
                            <img
                                src={`${STRAPI_ORIGIN}${video.poster.url}`}
                                alt=""
                                className="search-result-image"
                            />
                        ) : (
                            <div className="search-result-image-placeholder">
                                <Play size={24} />
                            </div>
                        )}
                        <div className="search-result-play-overlay">
                            <Play size={20} fill="white" />
                        </div>
                        {video.duration_seconds && (
                            <span className="search-result-duration">
                                {formatDuration(video.duration_seconds)}
                            </span>
                        )}
                    </div>
                    <div className="search-result-content">
                        <h3 className="search-result-title">
                            {video.title}
                        </h3>
                        {video.dek && (
                            <p className="search-result-dek">
                                {video.dek}
                            </p>
                        )}
                    </div>
                    <ChevronRight className="search-chevron" />
                </button>
            ))}
        </>
    );

    // Render podcast results
    const renderPodcastResults = () => (
        <div className="search-results-grid--podcast">
            {(results as any[]).map((podcast) => (
                <button
                    key={podcast.id}
                    onClick={() => handlePodcastClick(podcast)}
                    className="search-result-card--podcast-square"
                >
                    {/* Background image */}
                    {podcast.cover_art?.url ? (
                        <img
                            src={`${STRAPI_ORIGIN}${podcast.cover_art.url}`}
                            alt=""
                            className="podcast-card-bg"
                        />
                    ) : (
                        <div className="podcast-card-bg podcast-card-bg--placeholder">
                            <Headphones size={48} />
                        </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="podcast-card-gradient" />
                    
                    {/* Content overlay */}
                    <div className="podcast-card-content">
                        <h3 className="podcast-card-title">
                            {podcast.title}
                        </h3>
                        {podcast.duration && (
                            <div className="podcast-card-duration">
                                <Headphones size={12} />
                                <span>{formatDuration(podcast.duration)}</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Play icon */}
                    <div className="podcast-card-play">
                        <Play size={20} fill="white" />
                    </div>
                </button>
            ))}
        </div>
    );

    // Render results based on mode
    const renderResults = () => {
        switch (mode) {
            case 'videos':
                return renderVideoResults();
            case 'podcasts':
                return renderPodcastResults();
            default:
                return renderArticleResults();
        }
    };

    return createPortal(
        <div className="search-modal-overlay">
            {/* Header / Input Area */}
            <div className="search-header">
                {isLoading ? (
                    <div className="search-header-spinner" />
                ) : (
                    <SearchIcon className="search-icon" />
                )}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={PLACEHOLDERS[mode]}
                    className="search-input"
                />
                <button
                    onClick={onClose}
                    className="search-close-btn"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Results Area */}
            <div className="search-results-container">
                {error ? (
                    <div className="search-error">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Initial Loading (only if no results yet) */}
                        {isLoading && results.length === 0 && (
                            <div className="search-loading">
                                <div className="search-spinner"></div>
                            </div>
                        )}

                        {/* Results List (Dimmed when refreshing) */}
                        {results.length > 0 && (
                            <div className={`search-results-wrapper ${isLoading ? 'search-results-dimmed' : ''}`}>
                                <div className="search-results-count">
                                    {meta?.total} resultados encontrados
                                </div>
                                {renderResults()}
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && debouncedQuery.length >= 2 && results.length === 0 && (
                            <div className="search-empty">
                                <p>No se encontraron resultados para "{debouncedQuery}"</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>,
        document.body
    );
};
