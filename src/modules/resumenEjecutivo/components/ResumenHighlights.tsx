import styles from './ResumenComponents.module.css';
import { Heading, Text } from '../../../components/Typography/Typography';

export interface ResumenHighlightsProps {
    items: string[];
}

export const ResumenHighlights = ({ items }: ResumenHighlightsProps) => {
    return (
        <div className={styles.bodyContainer}>
            <Heading level={2} className={styles.highlightsTitle}>
                Entérate en un minuto:
            </Heading>

            <div className={styles.highlightsList}>
                {items.map((item, index) => (
                    <div key={index} className={styles.highlightItem}>
                        <Text variant="heading-3" className={styles.highlightNumber}>
                            0{index + 1}
                        </Text>
                        <Text variant="body" className={styles.highlightText}>
                            {item}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};
