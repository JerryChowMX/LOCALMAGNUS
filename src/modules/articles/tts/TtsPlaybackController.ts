import type { KaraokeModel, KaraokeState, PlaybackStatus } from './types';
import { TtsEngine } from './TtsEngine';

export type TtsChangeHandler = (state: KaraokeState) => void;
export type StatusChangeHandler = (status: PlaybackStatus) => void;

/**
 * TtsPlaybackController: Manages the state of TTS playback.
 * Platform-agnostic controller that emits state changes.
 */
export class TtsPlaybackController {
    private model: KaraokeModel | null = null;
    private status: PlaybackStatus = 'idle';
    private lastKnownTimeMs: number = 0;
    private currentState: KaraokeState = {
        sentenceIndex: -1,
        wordIndex: -1
    };

    private onStateChange: TtsChangeHandler | null = null;
    private onStatusChange: StatusChangeHandler | null = null;

    constructor(onStateChange?: TtsChangeHandler, onStatusChange?: StatusChangeHandler) {
        if (onStateChange) this.onStateChange = onStateChange;
        if (onStatusChange) this.onStatusChange = onStatusChange;
    }

    public setModel(model: KaraokeModel) {
        this.model = model;
        this.updateState(this.lastKnownTimeMs);
    }

    public setStatus(status: PlaybackStatus) {
        if (this.status === status) return;
        this.status = status;
        this.onStatusChange?.(status);
    }

    /**
     * Call this from the platform-specific audio loop (e.g., timeupdate event or rAF)
     */
    public tick(currentTimeMs: number) {
        if (!this.model) return;
        this.lastKnownTimeMs = currentTimeMs;
        this.updateState(currentTimeMs);
    }

    private updateState(currentTimeMs: number) {
        if (!this.model) return;

        const newState = TtsEngine.getKaraokeState(this.model, currentTimeMs);

        // Only emit if segments have actually changed to avoid unnecessary re-renders/SVG updates
        if (
            newState.sentenceIndex !== this.currentState.sentenceIndex ||
            newState.wordIndex !== this.currentState.wordIndex
        ) {
            this.currentState = newState;
            this.onStateChange?.(newState);
        }
    }

    public getCurrentState(): KaraokeState {
        return this.currentState;
    }

    public getStatus(): PlaybackStatus {
        return this.status;
    }
}
