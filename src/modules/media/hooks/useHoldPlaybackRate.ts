import { useEffect, useRef, useState, type RefObject } from 'react';

export interface VideoPlaybackController {
    getPlaybackRate(): number;
    setPlaybackRate(rate: number): void;
    isPaused(): boolean;
    togglePlay?(): void; // Optional for backward compat, but needed for tap handling
}

interface UseHoldPlaybackRateConfig {
    enabled?: boolean;
    rate?: number; // Target rate, e.g., 2.0
    thresholdMs?: number; // Time in ms before activation
    cancelMovePx?: number; // Pixels to move before cancelling
    zoneRightPct?: number; // 0.4 means right 40%
}

export const useHoldPlaybackRate = (
    containerRef: RefObject<HTMLElement | null>,
    controller: VideoPlaybackController | null,
    config: UseHoldPlaybackRateConfig = {}
) => {
    const {
        enabled = true,
        rate = 2.0,
        thresholdMs = 200,
        cancelMovePx = 12,
        zoneRightPct = 0.4
    } = config;

    const [isActive, setIsActive] = useState(false);

    // Refs for internal state to avoid re-renders / closure staleness
    const stateRef = useRef({
        isHolding: false,
        isActive: false,
        startX: 0,
        startY: 0,
        startTime: 0, // Track start time for tap detection
        pointerId: null as number | null,
        timeoutId: null as ReturnType<typeof setTimeout> | null,
        prevRate: 1.0
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !enabled) return;

        const handlePointerDown = (e: PointerEvent) => {
            if (!controller || controller.isPaused()) return;

            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;

            // Check if in the active zone (right side)
            const zoneStart = width * (1 - zoneRightPct);
            if (x < zoneStart) return;

            // Start tracking
            stateRef.current.isHolding = true;
            stateRef.current.startX = e.clientX;
            stateRef.current.startY = e.clientY;
            stateRef.current.startTime = Date.now();
            stateRef.current.pointerId = e.pointerId;
            stateRef.current.prevRate = controller.getPlaybackRate();

            // Capture pointer to track movement even if it leaves element momentarily
            container.setPointerCapture(e.pointerId);

            // Start timer
            stateRef.current.timeoutId = setTimeout(() => {
                if (stateRef.current.isHolding) {
                    activate();
                }
            }, thresholdMs);
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!stateRef.current.isHolding || stateRef.current.pointerId !== e.pointerId) return;

            const dx = Math.abs(e.clientX - stateRef.current.startX);
            const dy = Math.abs(e.clientY - stateRef.current.startY);

            // Cancel if moved too much (swipe intent)
            if (dx > cancelMovePx || dy > cancelMovePx) {
                cancel();
            }
        };

        const handlePointerUp = (e: PointerEvent) => {
            if (stateRef.current.pointerId === e.pointerId) {
                cancel();
            }
        };

        const handlePointerCancel = (e: PointerEvent) => {
            if (stateRef.current.pointerId === e.pointerId) {
                cancel();
            }
        };

        const activate = () => {
            if (!controller) return;
            stateRef.current.isActive = true;
            setIsActive(true);

            // Direct manipulation for cheat-mode latency (no react render loop delay)
            controller.setPlaybackRate(rate);

            // Optional: Navigator vibration if supported
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(50);
            }
        };

        const cancel = () => {
            // Check for legitimate Tap (short press, didn't activate speed, minimal movement)
            const duration = Date.now() - stateRef.current.startTime;
            const wasActive = stateRef.current.isActive;

            // Just clearing timer
            if (stateRef.current.timeoutId) {
                clearTimeout(stateRef.current.timeoutId);
                stateRef.current.timeoutId = null;
            }

            // Restore rate if needed
            if (wasActive && controller) {
                controller.setPlaybackRate(1.0);
            } else if (!wasActive && stateRef.current.isHolding && duration < thresholdMs) {
                // It was a tap! Toggle play/pause manually since we stole the pointer event.
                if (controller && controller.togglePlay) {
                    controller.togglePlay();
                }
            }

            // Reset state
            stateRef.current.isHolding = false;
            stateRef.current.isActive = false;
            stateRef.current.pointerId = null;
            setIsActive(false);

            // Release capture
            if (stateRef.current.pointerId && container.hasPointerCapture(stateRef.current.pointerId)) {
                try {
                    container.releasePointerCapture(stateRef.current.pointerId);
                } catch (e) {/* ignore */ }
            }
        };

        // Attach events
        container.addEventListener('pointerdown', handlePointerDown);
        container.addEventListener('pointermove', handlePointerMove);
        container.addEventListener('pointerup', handlePointerUp);
        container.addEventListener('pointercancel', handlePointerCancel);
        container.addEventListener('pointerleave', handlePointerCancel); // Safety net

        return () => {
            if (stateRef.current.timeoutId) clearTimeout(stateRef.current.timeoutId);
            container.removeEventListener('pointerdown', handlePointerDown);
            container.removeEventListener('pointermove', handlePointerMove);
            container.removeEventListener('pointerup', handlePointerUp);
            container.removeEventListener('pointercancel', handlePointerCancel);
            container.removeEventListener('pointerleave', handlePointerCancel);
        };
    }, [containerRef, controller, enabled, rate, thresholdMs, cancelMovePx, zoneRightPct]);

    return { isActive };
};
