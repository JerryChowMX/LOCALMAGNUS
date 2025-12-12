import React from 'react';
import './MediaStyles.css';

interface HoldToSpeedOverlayProps {
    isActive: boolean;
    zoneRightPct?: number; // 0.0 - 1.0
}

export const HoldToSpeedOverlay: React.FC<HoldToSpeedOverlayProps> = ({
    isActive,
    zoneRightPct = 0.4
}) => {
    return (
        <div
            className="hold-speed-overlay"
            style={{ width: `${zoneRightPct * 100}%` }}
        >
            <div className={`hold-speed-badge ${isActive ? 'active' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginTop: '1px' }}>
                    <path d="M5 18l8.5-6L5 6v12zM15 6v12l8.5-6L15 6z" />
                </svg>
                <span>2× Speed</span>
            </div>
        </div>
    );
};
