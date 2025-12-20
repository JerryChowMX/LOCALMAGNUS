import React, { useRef, useEffect, useState } from 'react';
import './MarqueeText.css';

interface MarqueeTextProps {
    text: string;
    className?: string; // For font styling, color, etc.
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({ text, className = '' }) => {
    const textRef = useRef<HTMLSpanElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            if (textRef.current && wrapperRef.current) {
                const textWidth = textRef.current.scrollWidth;
                const wrapperWidth = wrapperRef.current.clientWidth;
                // Add a small buffer (e.g., 2px) to prevent tiny overscrolls
                setShouldAnimate(textWidth > wrapperWidth + 2);
            }
        };

        // Check initially and on resize
        checkOverflow();

        // Also check after a frame in case fonts are loading
        const timeoutId = setTimeout(checkOverflow, 100);

        window.addEventListener('resize', checkOverflow);
        return () => {
            window.removeEventListener('resize', checkOverflow);
            clearTimeout(timeoutId);
        };
    }, [text]);

    return (
        <div className={`marquee-wrapper ${className}`} ref={wrapperRef}>
            <span
                ref={textRef}
                className={`marquee-content ${shouldAnimate ? 'marquee-content--animate' : ''}`}
            >
                {/* Symmetrical segments for smooth loop */}
                {shouldAnimate ? (
                    <>
                        <span className="marquee-segment">{text}</span>
                        <span className="marquee-segment">{text}</span>
                    </>
                ) : (
                    text
                )}
            </span>
        </div>
    );
};
