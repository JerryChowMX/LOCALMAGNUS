import React from 'react';
import './Layout.css';

export interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
    children,
    className = '',
    maxWidth = 'lg',
    padding = true
}) => {
    const classes = [
        'container',
        `container--max-${maxWidth}`,
        padding ? 'container--padding' : '',
        className
    ].filter(Boolean).join(' ');

    return <div className={classes}>{children}</div>;
};
