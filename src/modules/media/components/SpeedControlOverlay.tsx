import React, { useState, useEffect } from 'react';
import { type VideoPlaybackController } from '../hooks/useHoldPlaybackRate';
import './MediaStyles.css';

interface SpeedControlOverlayProps {
    controller: VideoPlaybackController | null;
    visible?: boolean;
}

export const SpeedControlOverlay: React.FC<SpeedControlOverlayProps> = ({
    controller,
    visible = true
}) => {
    const [currentRate, setCurrentRate] = useState(1.0);

    // Poll for rate changes (since controller doesn't notify us)
    useEffect(() => {
        if (!controller) return;
        const interval = setInterval(() => {
            setCurrentRate(controller.getPlaybackRate());
        }, 500);
        return () => clearInterval(interval);
    }, [controller]);

    const handleRateChange = (rate: number) => {
        if (controller) {
            controller.setPlaybackRate(rate);
            setCurrentRate(rate);
        }
    };

    if (!controller) return null;

    return (
        <div className={`speed-control-panel ${visible ? 'visible' : ''}`}>
            {[1.0, 1.5, 2.0].map((rate) => (
                <button
                    key={rate}
                    className={`speed-btn ${Math.abs(currentRate - rate) < 0.1 ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent toggling play/pause
                        handleRateChange(rate);
                    }}
                >
                    {rate}×
                </button>
            ))}
        </div>
    );
};
