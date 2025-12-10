import React from 'react';
import './FooterNav.css';

export interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
}

export interface FooterNavProps {
    items: NavItem[];
    className?: string;
}

export const FooterNav: React.FC<FooterNavProps> = ({
    items,
    className = ''
}) => {
    return (
        <nav className={`footer-nav ${className}`}>
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`footer-nav__item ${item.isActive ? 'footer-nav__item--active' : ''}`}
                    onClick={item.onClick}
                >
                    <span className="footer-nav__icon">{item.icon}</span>
                    <span className="footer-nav__label">{item.label}</span>
                </div>
            ))}
        </nav>
    );
};
