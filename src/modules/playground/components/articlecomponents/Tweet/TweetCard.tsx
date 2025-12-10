import React from 'react';
import styles from './TweetCard.module.css';
import { MessageCircle, Repeat2, Heart, Share, BadgeCheck } from 'lucide-react';

interface TweetData {
    author: {
        name: string;
        handle: string;
        avatar: string;
        verified?: boolean;
    };
    content: string;
    image?: string;
    date: string;
    metrics: {
        replies: string;
        reposts: string;
        likes: string;
        views?: string;
    };
}

interface TweetCardProps {
    data: TweetData;
    // Variant prop removed as we have selected the single "Sharp" design
}

const XLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor" style={{ width: '100%', height: '100%' }}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
);

export const TweetCard: React.FC<TweetCardProps> = ({ data }) => {
    return (
        <div className={`${styles.container} ${styles.sharp}`}>
            <div className={styles.header}>
                <div className={styles.authorInfo}>
                    <img src={data.author.avatar} alt={data.author.name} className={styles.avatar} />
                    <div className={styles.names}>
                        <div className={styles.displayName}>
                            {data.author.name}
                            {data.author.verified && <BadgeCheck className={styles.verified} size={16} fill="currentColor" />}
                        </div>
                        <div className={styles.username}>@{data.author.handle}</div>
                    </div>
                </div>
                <div className={styles.logoIcon}>
                    <XLogo />
                </div>
            </div>

            <div className={styles.content}>
                {data.content}
            </div>

            {data.image && (
                <div className={styles.media}>
                    <img src={data.image} alt="Tweet media" className={styles.mediaImage} />
                </div>
            )}

            <div className={styles.metadata}>
                <span>{data.date}</span>
                {data.metrics.views && (
                    <>
                        <span>·</span>
                        <span style={{ fontWeight: 600 }}>{data.metrics.views}</span>
                        <span>Views</span>
                    </>
                )}
            </div>

            <div className={styles.actions}>
                <div className={`${styles.actionButton} ${styles.reply}`}>
                    <MessageCircle size={18} />
                    <span>{data.metrics.replies}</span>
                </div>
                <div className={`${styles.actionButton} ${styles.repost}`}>
                    <Repeat2 size={18} />
                    <span>{data.metrics.reposts}</span>
                </div>
                <div className={`${styles.actionButton} ${styles.like}`}>
                    <Heart size={18} />
                    <span>{data.metrics.likes}</span>
                </div>
                <div className={`${styles.actionButton} ${styles.share}`}>
                    <Share size={18} />
                </div>
            </div>
        </div>
    );
};
