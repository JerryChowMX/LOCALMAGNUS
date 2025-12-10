import { ZoomableImage } from '../../../components/Media/ZoomableImage';
import type { ResumenPhoto } from '../../../types/resumen';
import './ResumenPhotoGallery.css';

export interface ResumenPhotoGalleryProps {
    photos: ResumenPhoto[];
}

export const ResumenPhotoGallery: React.FC<ResumenPhotoGalleryProps> = ({ photos }) => {
    return (
        <div className="resumen-photo-gallery">
            {photos.map(photo => (
                <div key={photo.id} className="resumen-photo-item">
                    <ZoomableImage
                        src={photo.imageUrl}
                        alt={photo.title}
                        caption={photo.photographer ? `${photo.title} - ${photo.photographer}` : photo.title}
                    />
                </div>
            ))}
        </div>
    );
};
