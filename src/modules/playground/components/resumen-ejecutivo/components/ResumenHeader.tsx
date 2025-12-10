import styles from './ResumenComponents.module.css';
import { Heading, Text } from '../../../../../components/Typography/Typography';

export interface ResumenHeaderProps {
    date: string;
    title: string;
    dek: string;
    imageUrl: string;
}

export const ResumenHeader = ({ date, title, dek, imageUrl }: ResumenHeaderProps) => {
    return (
        <div className={styles.headerContainer}>
            {/* Date */}
            <div className={styles.date}>
                <Text variant="caption" className={styles.dateText}>
                    {date}
                </Text>
            </div>

            {/* Title */}
            <div className={styles.title}>
                <Heading level={1} className={styles.titleText}>
                    {title}
                </Heading>
            </div>

            {/* Dek */}
            <div className={styles.dek}>
                <Text variant="body" className={styles.dekText}>
                    {dek}
                </Text>
            </div>

            {/* Hero Image */}
            <div className={styles.heroImage}>
                <img
                    src={imageUrl}
                    alt={title}
                />
            </div>
        </div>
    );
};
