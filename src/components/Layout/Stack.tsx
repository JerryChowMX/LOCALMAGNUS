import React from 'react';
import './Layout.css';

export interface StackProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'row' | 'column';
    spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    wrap?: boolean;
}

export const Stack: React.FC<StackProps> = ({
    children,
    className = '',
    direction = 'column',
    spacing = 'md',
    align = 'stretch',
    justify = 'start',
    wrap = false
}) => {
    const classes = [
        'stack',
        `stack--${direction}`,
        `stack--spacing-${spacing}`,
        `stack--align-${align}`,
        `stack--justify-${justify}`,
        wrap ? 'stack--wrap' : '',
        className
    ].filter(Boolean).join(' ');

    return <div className={classes}>{children}</div>;
};
