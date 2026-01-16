import React, { useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { useArticleWindow } from '../hooks/useArticleWindow';
import { StoryCard } from './StoryCard';
import type { StrapiArticle } from '../../../types/strapi';
import './Flipboard.css';

// --- PROPS ---

interface FlipboardProps {
    articles: StrapiArticle[];
}

interface FlipboardRendererProps {
    currentArticle: StrapiArticle;
    nextArticle?: StrapiArticle | null;
    prevArticle?: StrapiArticle | null;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

// --- FLIPBOARD RENDERER (The Physics Engine) ---
// This component is mounted fresh on every page turn due to the key={currentIndex} in the parent.
// This guarantees that all physics state (springs, motion values) starts at exactly 0 with zero momentum.
const FlipboardRenderer: React.FC<FlipboardRendererProps> = ({
    currentArticle, nextArticle, prevArticle, onNext, onPrev, hasNext, hasPrev
}) => {
    // -- State Locks --
    const [isAnimating, setIsAnimating] = useState(false);

    // -- Physics Engine --
    const angle = useMotionValue(0); // Starts effectively at 0
    const smoothAngle = useSpring(angle, { stiffness: 500, damping: 45, mass: 1.5 });

    // -- Lighting Model --
    const shadowOpacityFront = useTransform(smoothAngle, [0, 90, 180], [0, 0.85, 0]);
    const shadowOpacityBack = useTransform(smoothAngle, [0, 90, 180], [0, 0.85, 0]);
    const shadowOpacityRevFront = useTransform(smoothAngle, [0, -90, -180], [0, 0.85, 0]);
    const shadowOpacityRevBack = useTransform(smoothAngle, [0, -90, -180], [0, 0.85, 0]);

    // -- STATIC LAYER VISIBILITY (Reactive) --
    // Instantly toggle opacity based on angle direction.
    const opacityStaticNextBottom = useTransform(angle, (a) => a > 0 ? 1 : 0);
    const opacityStaticCurrentBottom = useTransform(angle, (a) => a > 0 ? 0 : 1);
    const opacityStaticPrevTop = useTransform(angle, (a) => a < 0 ? 1 : 0);
    const opacityStaticCurrentTop = useTransform(angle, (a) => a < 0 ? 0 : 1);

    // -- Gesture Handlers --
    const onPan = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (isAnimating) return;

        const delta = info.delta.y;
        const currentAngle = angle.get();

        // SCALING: 1px = 0.4deg
        // DRAG UP (Next): 0 -> 180
        if (delta < 0 && hasNext && currentAngle >= 0) {
            angle.set(Math.min(180, Math.max(0, currentAngle + (delta * -0.4))));
        }
        // DRAG DOWN (Prev): 0 -> -180
        else if (delta > 0 && hasPrev && currentAngle <= 0) {
            angle.set(Math.max(-180, Math.min(0, currentAngle + (delta * -0.4))));
        }
    }, [angle, hasNext, hasPrev, isAnimating]);

    const onPanEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (isAnimating) return;

        const currentAngle = angle.get();
        const velocity = info.velocity.y;
        const THRESHOLD_ANGLE = 90;
        const THRESHOLD_VELOCITY = 300;

        // NEXT FLIP
        if (currentAngle > 0) {
            if (currentAngle > THRESHOLD_ANGLE || velocity < -THRESHOLD_VELOCITY) {
                setIsAnimating(true);
                angle.set(180);
                if (window.navigator?.vibrate) window.navigator.vibrate(10);
                setTimeout(onNext, 400); // Trigger Parent Switch -> Remounts Renderer
            } else {
                angle.set(0);
            }
        }
        // PREV FLIP
        else if (currentAngle < 0) {
            if (Math.abs(currentAngle) > THRESHOLD_ANGLE || velocity > THRESHOLD_VELOCITY) {
                setIsAnimating(true);
                angle.set(-180);
                if (window.navigator?.vibrate) window.navigator.vibrate(10);
                setTimeout(onPrev, 400); // Trigger Parent Switch -> Remounts Renderer
            } else {
                angle.set(0);
            }
        }
    }, [angle, onNext, onPrev, isAnimating]);

    return (
        <div className="flipboard-container" onPointerDown={() => { }}>
            <motion.div
                className="gesture-overlay"
                onPan={onPan}
                onPanEnd={onPanEnd}
                style={{ touchAction: 'none' }}
            />

            {/* STATIC LAYERS */}
            <div className="flip-layer layer-bottom z-0">
                {nextArticle && (
                    <motion.div className="page-content-bottom" style={{ opacity: opacityStaticNextBottom }}>
                        <StoryCard story={nextArticle} />
                    </motion.div>
                )}
                <motion.div className="page-content-bottom" style={{ opacity: opacityStaticCurrentBottom }}>
                    <StoryCard story={currentArticle} />
                </motion.div>
            </div>

            <div className="flip-layer layer-top z-0">
                {prevArticle && (
                    <motion.div className="page-content-top" style={{ opacity: opacityStaticPrevTop }}>
                        <StoryCard story={prevArticle} />
                    </motion.div>
                )}
                <motion.div className="page-content-top" style={{ opacity: opacityStaticCurrentTop }}>
                    <StoryCard story={currentArticle} />
                </motion.div>
                <div className="crease-shadow-top" />
            </div>

            {/* FORWARD FLIPPER */}
            <motion.div
                className="flipper-leaf z-10"
                style={{
                    rotateX: smoothAngle,
                    display: useTransform(angle, (a) => a < -1 ? 'none' : 'block')
                }}
            >
                <div className="flipper-face face-front">
                    <div className="page-content-bottom">
                        <StoryCard story={currentArticle} />
                    </div>
                    <motion.div className="shadow-overlay" style={{ opacity: shadowOpacityFront }} />
                </div>
                {nextArticle && (
                    <div className="flipper-face face-back">
                        <div className="page-content-top">
                            <StoryCard story={nextArticle} />
                        </div>
                        <motion.div className="shadow-overlay" style={{ opacity: shadowOpacityBack }} />
                    </div>
                )}
            </motion.div>

            {/* REVERSE FLIPPER */}
            <motion.div
                className="flipper-leaf-top z-10"
                style={{
                    rotateX: smoothAngle,
                    display: useTransform(angle, (a) => a > 1 ? 'none' : 'block')
                }}
            >
                <div className="flipper-face face-front">
                    <div className="page-content-top">
                        <StoryCard story={currentArticle} />
                    </div>
                    <motion.div className="shadow-overlay" style={{ opacity: shadowOpacityRevFront }} />
                </div>
                {prevArticle && (
                    <div className="flipper-face face-back">
                        <div className="page-content-bottom">
                            <StoryCard story={prevArticle} />
                        </div>
                        <motion.div className="shadow-overlay" style={{ opacity: shadowOpacityRevBack }} />
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// --- MAIN WRAPPER (Data Source) ---
export const Flipboard: React.FC<FlipboardProps> = ({ articles }) => {
    const {
        currentArticle, nextArticle, prevArticle, goNext, goPrev, hasNext, hasPrev, currentIndex
    } = useArticleWindow(articles);

    if (!currentArticle) return null;

    return (
        <FlipboardRenderer
            key={currentIndex} // ATOMIC RESET: Destroys physics state on every page turn
            currentArticle={currentArticle}
            nextArticle={nextArticle}
            prevArticle={prevArticle}
            onNext={goNext}
            onPrev={goPrev}
            hasNext={hasNext}
            hasPrev={hasPrev}
        />
    );
};
