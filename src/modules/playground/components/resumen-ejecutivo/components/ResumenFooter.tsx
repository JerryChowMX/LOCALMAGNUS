import styles from './ResumenComponents.module.css';
import { Heading, Text } from '../../../../../components/Typography/Typography';

export interface ResumenFooterProps {
    thumbnailUrl: string;
    articleTitle: string;
    onReadMore?: () => void;
}

export const ResumenFooter = ({ thumbnailUrl, articleTitle, onReadMore }: ResumenFooterProps) => {
    return (
        <div className={styles.footerContainer} onClick={onReadMore} style={{ cursor: onReadMore ? 'pointer' : 'default' }}>
            {/* Heading */}
            <Text variant="body" className={styles.readMoreLabel}>
                Lee la nota completa:
            </Text>

            {/* Image Placeholder Card */}
            <div className={styles.imagePlaceholder}>
                <img
                    src={thumbnailUrl}
                    alt="Article Thumbnail"
                    className={styles.imagePlaceholderImg}
                />
            </div>

            {/* Article Title */}
            <Heading level={2} className={styles.footerTitle}>
                {articleTitle}
            </Heading>
        </div>
    );
};
