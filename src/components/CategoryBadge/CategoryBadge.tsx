import React from 'react';
import './CategoryBadge.css';

export interface CategoryBadgeProps {
    /** The category name to display */
    category: string;
    /** Optional className for additional styling */
    className?: string;
}

/**
 * A small badge displaying the article category.
 * Used on special article cards - appears in top-right corner.
 * 
 * Design: Magnus Blue fill (#1E6FA8), Cream text (#FFFCF6), no borders
 */
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
    category,
    className = ''
}) => {
    if (!category) return null;

    return (
        <span className={`category-badge ${className}`}>
            {category}
        </span>
    );
};
