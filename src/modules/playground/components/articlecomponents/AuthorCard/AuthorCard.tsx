import { useState } from 'react';
import styles from './AuthorCard.module.css';

export interface AuthorCardProps {
    name: string;
    role?: string;
    bio?: string;
    avatarUrl?: string;
    articleCount?: number;
    followersCount?: number;
    isFollowing?: boolean;
    onFollow?: () => void;
    onViewProfile?: () => void;
    variant?: 'circle' | 'square'; // Avatar shape variant
    centered?: boolean; // Center align content
}

export const AuthorCard: React.FC<AuthorCardProps> = ({
    name,
    role = 'Periodista',
    bio,
    avatarUrl,
    articleCount,
    followersCount,
    isFollowing: initialIsFollowing = false,
    onFollow,
    onViewProfile,
    variant = 'circle',
    centered = false
}) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

    const handleFollowClick = () => {
        setIsFollowing(!isFollowing);
        onFollow?.();
    };

    // Determine if we should show the actions section
    const showActions = onFollow || onViewProfile;

    return (
        <div className={styles.card}>
            {/* Header Section */}
            <div className={`${styles.header} ${centered ? styles.headerCentered : ''}`}>
                <div className={styles.avatarContainer}>
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={name}
                            className={variant === 'square' ? styles.avatarSquare : styles.avatar}
                        />
                    ) : (
                        <div className={variant === 'square' ? styles.avatarPlaceholderSquare : styles.avatarPlaceholder}>
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className={styles.info}>
                    <h3 className={styles.name}>{name}</h3>
                    <p className={styles.role}>{role}</p>
                </div>
            </div>

            {/* Bio Section */}
            {bio && (
                <p className={styles.bio}>{bio}</p>
            )}

            {/* Stats Section */}
            {(articleCount !== undefined || followersCount !== undefined) && (
                <div className={styles.stats}>
                    {articleCount !== undefined && (
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{articleCount}</span>
                            <span className={styles.statLabel}>Artículos</span>
                        </div>
                    )}
                    {followersCount !== undefined && (
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{followersCount.toLocaleString()}</span>
                            <span className={styles.statLabel}>Seguidores</span>
                        </div>
                    )}
                </div>
            )}

            {/* Actions Section */}
            {showActions && (
                <div className={styles.actions}>
                    {onFollow && (
                        <button
                            className={`${styles.button} ${styles.buttonPrimary} ${isFollowing ? styles.buttonFollowing : ''}`}
                            onClick={handleFollowClick}
                        >
                            {isFollowing ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Siguiendo
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    Seguir
                                </>
                            )}
                        </button>
                    )}
                    {onViewProfile && (
                        <button
                            className={`${styles.button} ${styles.buttonSecondary}`}
                            onClick={onViewProfile}
                        >
                            Ver perfil
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
