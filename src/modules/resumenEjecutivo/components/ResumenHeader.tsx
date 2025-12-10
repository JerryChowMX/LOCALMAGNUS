// ... imports
import { ImageSlider } from '../../../components/Media/ImageSlider';
import styles from './ResumenComponents.module.css';
import { Heading, Text } from '../../../components/Typography/Typography';

export interface ResumenHeaderProps {
    date: string;
    title: string;
    dek: string;
    imageUrl: string;
}

export const ResumenHeader = ({ date, title, dek, imageUrl }: ResumenHeaderProps) => {

    // Helper to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        // If it looks like ISO (YYYY-MM-DD), format it
        if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
            // Create date using UTC to avoid timezone shifts
            const [year, month, day] = dateString.split('-').map(Number);
            const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
            return dateObj.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
        // Fallback or if already formatted
        return dateString;
    };

    return (
        <div className={styles.headerContainer}>
            {/* Date */}
            <div className={styles.date}>
                <Text variant="caption" className={styles.dateText}>
                    {formatDate(date)}
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
            {imageUrl && (
                <div className={styles.heroImage}>
                    <ImageSlider
                        images={[
                            {
                                src: imageUrl,
                                alt: title,
                                caption: ''
                            }
                        ]}
                    />
                </div>
            )}
        </div>
    );
};
