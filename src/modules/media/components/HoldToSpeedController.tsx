import React, { type RefObject } from 'react';
import { useHoldPlaybackRate, type VideoPlaybackController } from '../hooks/useHoldPlaybackRate';
import { HoldToSpeedOverlay } from './HoldToSpeedOverlay';

interface HoldToSpeedControllerProps {
    containerRef: RefObject<HTMLElement | null>;
    controller: VideoPlaybackController | null;
    enabled?: boolean;
    rate?: number;
    thresholdMs?: number;
    zoneRightPct?: number;
}

export const HoldToSpeedController: React.FC<HoldToSpeedControllerProps> = ({
    containerRef,
    controller,
    enabled = true,
    rate = 2.0,
    thresholdMs = 200,
    zoneRightPct = 0.4
}) => {
    const { isActive } = useHoldPlaybackRate(containerRef, controller, {
        enabled,
        rate,
        thresholdMs,
        zoneRightPct
    });

    if (!enabled) return null;

    return (
        <HoldToSpeedOverlay
            isActive={isActive}
            zoneRightPct={zoneRightPct}
        />
    );
};
