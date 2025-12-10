// ... imports
import { useLightbox } from '../../../context/LightboxContext';
import styles from './ResumenComponents.module.css';
import { Heading, Text } from '../../../components/Typography/Typography';

export interface ResumenFooterProps {
    thumbnailUrl: string;
    articleTitle: string;
    onReadMore?: () => void;
}

export const ResumenFooter = ({ thumbnailUrl, articleTitle, onReadMore }: ResumenFooterProps) => {
    const { openLightbox } = useLightbox();

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openLightbox(thumbnailUrl, articleTitle, articleTitle);
    };

    return (
        <div className={styles.footerContainer} onClick={onReadMore} style={{ cursor: onReadMore ? 'pointer' : 'default' }}>


            {/* Image Placeholder Card */}
            <div className={styles.imagePlaceholder}>
                <img
                    src={thumbnailUrl}
                    alt="Article Thumbnail"
                    className={styles.imagePlaceholderImg}
                    onClick={handleImageClick}
                    style={{ cursor: 'pointer' }}
                />
            </div>

            {/* Article Title */}
            <Heading level={2} className={styles.footerTitle}>
                {articleTitle}
            </Heading>
        </div>
    );
};
