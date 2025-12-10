import React from 'react';
import './Layout.css';

export interface SectionProps {
    children: React.ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
    background?: "default" | "surface" | "highlight";
}

export const Section: React.FC<SectionProps> = ({
    children,
    className,
    padding = "md",
    background = "default"
}) => {
    return (
        <section className={`section section--padding-${padding} section--bg-${background} ${className || ''}`}>
            {children}
        </section>
    );
};
