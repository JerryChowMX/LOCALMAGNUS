export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * WebMeasurementAdapter: Web-specific implementation for measuring text ranges.
 * Uses Range API and ClientRects to find pixel coordinates.
 */
export class WebMeasurementAdapter {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    /**
     * Measures a character range within the container and returns its rects.
     * Coordinates are local to the container.
     */
    public measureRange(charStart: number, charEnd: number): Rect[] {
        const range = this.createRange(charStart, charEnd);
        if (!range) return [];

        let clientRects = range.getClientRects();

        // WebKit/iOS Fallback: If getClientRects is empty but the range is valid,
        // use getBoundingClientRect as a single-line fallback.
        if (clientRects.length === 0) {
            const b = range.getBoundingClientRect();
            if (b.width > 0 && b.height > 0) {
                // @ts-ignore - manual construction for fallback
                clientRects = [b] as DOMRectList;
            }
        }

        const containerRect = this.container.getBoundingClientRect();
        const scrollTop = this.container.scrollTop;
        const scrollLeft = this.container.scrollLeft;

        const rects: Rect[] = [];
        for (let i = 0; i < clientRects.length; i++) {
            const r = clientRects[i];

            // Convert to container-local coordinates
            rects.push({
                x: r.left - containerRect.left + scrollLeft,
                y: r.top - containerRect.top + scrollTop,
                width: r.width,
                height: r.height
            });
        }

        return rects;
    }

    /**
     * Walks the DOM to find the text nodes corresponding to the char offsets.
     */
    private createRange(charStart: number, charEnd: number): Range | null {
        const range = document.createRange();
        let currentOffset = 0;
        let startNode: Node | null = null;
        let startOffset = 0;
        let endNode: Node | null = null;
        let endOffset = 0;

        const walker = document.createTreeWalker(this.container, NodeFilter.SHOW_TEXT, null);
        let node: Node | null;

        while ((node = walker.nextNode())) {
            const length = node.textContent?.length || 0;

            // Check start
            if (!startNode && currentOffset + length > charStart) {
                startNode = node;
                startOffset = charStart - currentOffset;
            }

            // Check end
            if (!endNode && currentOffset + length >= charEnd) {
                endNode = node;
                endOffset = charEnd - currentOffset;
                break;
            }

            currentOffset += length;
        }

        if (startNode && endNode) {
            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);
            return range;
        }

        return null;
    }
}
