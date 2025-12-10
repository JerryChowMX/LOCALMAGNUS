import type { ResumenPhoto, ResumenCartoon } from '../../../types/resumen';

export const MOCK_PHOTOS: ResumenPhoto[] = Array.from({ length: 10 }).map((_, i) => ({
    id: `photo-${i}`,
    title: `Foto del día ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/photo-${i}/1200/800`,
    photographer: 'Fotógrafo Vanguardia'
}));

export const MOCK_CARTOONS: ResumenCartoon[] = Array.from({ length: 3 }).map((_, i) => ({
    id: `cartoon-${i}`,
    title: `Cartón Político ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/cartoon-${i}/800/800`,
    artist: 'Monero'
}));
