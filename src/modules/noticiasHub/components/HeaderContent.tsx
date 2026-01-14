import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useScrolledHeader } from '../../../hooks/useScrolledHeader';
import { useShare } from '../../../hooks/useShare';
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
    const { handleShare } = useShare();
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const onShareClick = async () => {
        if (onShare) {
            onShare();
            return;
        }

        await handleShare({
            title: document.title,
            url: window.location.href
        });
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

            {/* Right: Action Buttons */}
            <div className="flex gap-1 items-center">
                <button className="header-content__share" onClick={onRightClick || onShareClick}>
                    {rightIcon || <Icons.share size={24} stroke={2} />}
                </button>
            </div>
        </header>
    );
};
