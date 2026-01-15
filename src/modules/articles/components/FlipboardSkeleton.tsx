import React from 'react';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import './FlipboardSkeleton.css';

/**
 * Prevents Layout Shift (CLS) by mimicking the Flipboard structure while loading.
 */
export const FlipboardSkeleton: React.FC = () => {
    return (
        <div className="flipboard-skeleton">
            {/* Top Half Mock */}
            <div className="skeleton-half skeleton-half--top">
                <div className="skeleton-content">
                    <Skeleton variant="text" width="40%" height="20px" className="mb-4" />
                    <Skeleton variant="text" width="90%" height="40px" />
                </div>
            </div>

            {/* Divider Line */}
            <div className="skeleton-hinge" />

            {/* Bottom Half Mock */}
            <div className="skeleton-half skeleton-half--bottom">
                <div className="skeleton-content">
                    <Skeleton variant="text" width="80%" height="40px" className="mb-2" />
                    <Skeleton variant="text" width="30%" height="16px" />
                </div>
            </div>
        </div>
    );
};
