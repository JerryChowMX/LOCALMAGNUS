import React from 'react';
import './PageWrapper.css';

export interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => {
    return <div className={`page-wrapper ${className || ''}`}>{children}</div>;
};
