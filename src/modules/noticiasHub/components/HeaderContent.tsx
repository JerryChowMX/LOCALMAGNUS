import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useScrolledHeader } from '../../../hooks/useScrolledHeader';
import { Icons } from '../../../components/Icons';
import './HeaderContent.css';

export interface HeaderContentProps {
    variant?: "light" | "dark";
    onBack?: () => void;
    onShare?: () => void;
    rightIcon?: React.ReactNode;
    onRightClick?: () => void;
}

export const HeaderContent: React.FC<HeaderContentProps> = ({
    variant = "light",
    onBack,
    onShare,
    rightIcon,
    onRightClick
}) => {
    const { isScrolled } = useScrolledHeader();
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleShare = async () => {
        if (onShare) {
            onShare();
            return;
        }

        // Default native share
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            console.log('Web Share API not supported');
            // Fallback: Copy to clipboard or show modal (could be implemented later)
            alert('Share functionality not supported on this browser/device context.');
        }
    };

    return (
        <header className={`header-content header-content--${variant} ${isScrolled ? 'header-content--scrolled' : ''}`}>
            {/* Left: Back Button */}
            <button className="header-content__back" onClick={handleBack}>
                <Icons.back size={24} stroke={2} />
            </button>

            {/* Center: Logo Block */}
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="header-content__logo-block">
                    <div className="header-content__logo">MAGNUS</div>
                </div>
            </Link>

            {/* Right: Action Button */}
            <button className="header-content__share" onClick={onRightClick || handleShare}>
                {rightIcon || <Icons.share size={24} stroke={2} />}
            </button>
        </header>
    );
};
