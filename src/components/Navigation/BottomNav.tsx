import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMonterreyDate } from '../../lib/dateUtils';
import './BottomNav.css';

interface BottomNavProps {
    variant?: 'light' | 'dark';
}

export const BottomNav: React.FC<BottomNavProps> = ({ variant = 'light' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const today = getMonterreyDate();

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    return (
        <nav className={`bottom-nav bottom-nav--${variant}`}>
            <button
                className={`bottom-nav__item ${isActive('/') && location.pathname === '/' ? 'bottom-nav__item--active' : ''}`}
                onClick={() => navigate('/')}
                aria-label="Home"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            </button>

            <button
                className={`bottom-nav__item ${isActive('/VideosDelDia') ? 'bottom-nav__item--active' : ''}`}
                onClick={() => navigate(`/VideosDelDia/${today}`)}
                aria-label="Videos"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
            </button>

            <button
                className={`bottom-nav__item ${isActive('/PodcastsDelDia') ? 'bottom-nav__item--active' : ''}`}
                onClick={() => navigate(`/PodcastsDelDia/${today}`)}
                aria-label="Podcasts"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
            </button>

            <button
                className={`bottom-nav__item ${isActive('/Notas') ? 'bottom-nav__item--active' : ''}`}
                onClick={() => navigate(`/Notas/${today}`)}
                aria-label="Buscar"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </button>

            <button
                className={`bottom-nav__item ${isActive('/perfil') ? 'bottom-nav__item--active' : ''}`}
                onClick={() => navigate('/perfil')}
                aria-label="Perfil"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </button>
        </nav>
    );
};
