import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface LightboxImage {
    src: string;
    alt?: string;
    caption?: string;
}

interface LightboxContextType {
    isOpen: boolean;
    images: LightboxImage[];
    currentIndex: number;
    openLightbox: (images: LightboxImage[], index?: number) => void; // Changed signature
    openSingleImage: (src: string, caption?: string, alt?: string) => void; // Legacy support
    closeLightbox: () => void;
    nextImage: () => void;
    prevImage: () => void;
    currentImage: LightboxImage | null;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export const LightboxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [images, setImages] = useState<LightboxImage[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = useCallback((newImages: LightboxImage[], index: number = 0) => {
        setImages(newImages);
        setCurrentIndex(index);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);

    const openSingleImage = useCallback((src: string, caption?: string, alt?: string) => {
        openLightbox([{ src, caption, alt }], 0);
    }, [openLightbox]);

    const closeLightbox = useCallback(() => {
        setIsOpen(false);
        // Clean up after animation might be better, but for now immediate
        document.body.style.overflow = '';
        setTimeout(() => setImages([]), 300); // Clear data after generic fade out time
    }, []);

    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const currentImage = images[currentIndex] || null;

    return (
        <LightboxContext.Provider value={{
            isOpen,
            images,
            currentIndex,
            openLightbox,
            openSingleImage,
            closeLightbox,
            nextImage,
            prevImage,
            currentImage
        }}>
            {children}
        </LightboxContext.Provider>
    );
};

export const useLightbox = () => {
    const context = useContext(LightboxContext);
    if (!context) {
        throw new Error('useLightbox must be used within a LightboxProvider');
    }
    return context;
};
