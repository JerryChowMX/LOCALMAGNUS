import type { FC } from 'react';
import { Heading, Text } from '../../Typography/Typography';
import './ArticleHeader.css';

export interface ArticleHeaderProps {
    date: string;
    title: string;
    abstract: string;
    author: string;
    readingTime: string;
    imageUrl: string;
    imageCaption: string;
}

export const ArticleHeader: FC<ArticleHeaderProps> = ({
    date,
    title,
    abstract,
    author,
    readingTime,
    imageUrl,
    imageCaption
}) => {
    return (
        <div className="article-header">
            {/* Top Section with Content */}
            <div className="article-header__content">
                {/* Date */}
                <Text variant="caption" className="article-header__date">
                    {date}
                </Text>

                {/* Title */}
                <Heading level={1} className="article-header__title">
                    {title}
                </Heading>

                {/* Summary/Dek */}
                <Text variant="body" className="article-header__abstract">
                    {abstract}
                </Text>

                {/* Author and Reading Time */}
                <div className="article-header__meta">
                    <Text variant="body" className="article-header__author">
                        Por {author}
                    </Text>
                    <Text variant="caption" className="article-header__meta-text">
                        •
                    </Text>
                    <Text variant="caption" className="article-header__meta-text">
                        {readingTime} de lectura
                    </Text>
                </div>
            </div>

            {/* Image with Gradient Blend */}
            <div className="article-header__image-container">
                <img
                    src={imageUrl}
                    alt={imageCaption}
                    className="article-header__image"
                />

                {/* Gradient Overlay from White to Transparent */}
                <div className="article-header__gradient-top"></div>

                {/* Image Caption */}
                <div className="article-header__caption-container">
                    {imageCaption}
                </div>
            </div>
        </div>
    );
};
