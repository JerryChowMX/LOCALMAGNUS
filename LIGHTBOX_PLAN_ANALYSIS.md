# Lightbox & Zoom Implementation Analysis

This document analyzes the proposed plan to implement a consistent image lightbox and zoom experience across the MAGNUS application.

## 1. Analysis of the Proposal

**Verdict: HIGHLY RECOMMENDED**

The proposal is solid and addresses a key user experience requirement for media-heavy applications. A unified lightbox experience elevates the "premium" feel of the app (one of the core design aesthetics) and improves accessibility and usability.

### Strengths of the Plan
*   **Scope is clear**: Covers all key areas (Resumen, Las 5, Opinión, fotos del dia).
*   **Behavior is standard**: Users expect pinch-to-zoom and tap-to-close.
*   **Mobile-First approach**: Critical for this feature, as gestures are primary on mobile.
*   **Accessibility**: Explicit mention of focus traps and keyboard navigation is excellent.

### Technical Considerations & Challenges
1.  **Gesture Complexity**: Implementing smooth "pinch-to-zoom" and "drag-to-pan" from scratch is error-prone and complex to get right across all devices (iOS Safari vs. Android Chrome).
2.  **Background Images**: Currently, `ResumenArticleCard` uses `background-image`. Lightboxes work best with `<img>` tags or direct URLs. We will need to adapt the cards to either:
    *   Pass the URL to the lightbox handler explicitly.
    *   Refactor cards to use `<img>` with `object-fit: cover` (Recommended for accessibility anyway).
3.  **Z-Index & Stacking Contexts**: The lightbox must sit at the very top of the DOM tree (e.g., in `App.tsx` or a Portal) to avoid being clipped by parent containers with `overflow: hidden`.

## 2. Proposed Technical Implementation

I recommend using a **Context-based approach** with a **lightweight gesture library** (like `react-use-gesture` + `react-spring` or a dedicated lightbox library like `yet-another-react-lightbox` if external deps are allowed) to handle the physics of zooming.

If we must stay "Vanilla React" without heavy libraries, we can build a simpler version, but "pinch-to-zoom" is non-trivial to implement robustly without a library.

### 2.1. Architecture

1.  **`LightboxContext`**: Stores the state of the lightbox (`isOpen`, `currentImageSrc`, `caption`).
2.  **`LightboxOverlay`**: The component that sits at the root of the app. It listens to the context and renders the overlay when active.
3.  **`ZoomableImage`**: A wrapper component that replaces standard `<img>` tags.

### 2.2. Component API Proposal

#### `<ZoomableImage />`
This component will replace standard `<img>` tags in your articles.

```typescript
interface ZoomableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  caption?: string;
  zoomable?: boolean; // Default true
  className?: string;
  // Optional: distinct thumbnail vs full size
  fullSizeSrc?: string; 
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({ 
  src, 
  fullSizeSrc, 
  alt, 
  caption, 
  ...props 
}) => {
  const { openLightbox } = useLightbox();
  
  return (
    <figure className="zoomable-image-container">
      <img 
        src={src} 
        alt={alt} 
        onClick={() => openLightbox(fullSizeSrc || src, caption)}
        {...props} 
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};
```

#### `<LightboxOverlay />`
(Pseudo-code for the overlay)

```tsx
const LightboxOverlay = () => {
  const { isOpen, close, activeImage } = useLightbox();
  
  // Use a gesture hook or library here for pinch/pan
  
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="lightbox-backdrop" onClick={close}>
        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
           {/* Close Button */}
           <button className="lightbox-close" onClick={close}><IconX /></button>
           
           {/* Image Container with Transforms */}
           <img 
             src={activeImage.src} 
             style={{ transform: `scale(${scale}) translate(${x}px, ${y}px)` }} 
           />
           
           {/* Caption */}
           {activeImage.caption && <div className="lightbox-caption">{activeImage.caption}</div>}
        </div>
      </div>
    </Portal>
  );
};
```

## 3. Refactoring Plan

We need to update the following files to use `<ZoomableImage>` or trigger the lightbox:

1.  **`ResumenLas5ArticlePage.tsx`**:
    *   Replace `<img className="resumen-article-image" ... />` with `<ZoomableImage ... />`.
2.  **`ResumenArticleCard.tsx`**:
    *   Currently uses `background-image`.
    *   **Option A**: Refactor to use `<img>` with `object-fit: cover`. (Better for accessibility).
    *   **Option B**: Keep background, but add a "maximize" icon button that triggers the lightbox.
    *   *Recommendation*: Since the user wants "Tap on any image", Option A is better but requires CSS changes. If we keep background, the `onClick` of the card navigates to the article. We might NOT want the card image on the *list* view to open a lightbox, but rather navigate.
    *   *Clarification*: Usually, list view thumbnails navigate to the article. Detail view images open the lightbox. **I assume the scope "Las 5 del Día detail screens" implies the article page, not the list card.**
3.  **`ResumenOpinionArticlePage.tsx`** (and others):
    *   Similar replacement.

## 4. Edge Cases & Exclusions

*   **List View Cards**: Tapping a card usually navigates. We should probably **NOT** enable lightbox on the list view thumbnails unless explicitly requested. The user said "Las 5 del Día detail screens", which supports this.
*   **Icons/Logos**: Exclude from `ZoomableImage`.
*   **Small UI Images**: Exclude.

## 5. Next Steps

1.  **Create Context**: `src/context/LightboxContext.tsx`
2.  **Create Components**: 
    *   `src/components/Media/LightboxOverlay.tsx`
    *   `src/components/Media/ZoomableImage.tsx`
3.  **Integrate**: Add `LightboxProvider` and `LightboxOverlay` to `App.tsx`.
4.  **Refactor**: Update `ResumenLas5ArticlePage.tsx` to use `ZoomableImage`.
