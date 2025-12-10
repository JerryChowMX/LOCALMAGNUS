import type { ResumenArticle } from '../../../types/resumen';

export const MOCK_LAS_5: ResumenArticle[] = [
    { id: 'portada', title: 'Portada', imageUrl: 'https://picsum.photos/seed/portada/800/600', summary: 'Resumen de la portada...' },
    { id: 'politicon', title: 'Politicon', imageUrl: 'https://picsum.photos/seed/politicon/800/600', summary: 'Resumen de politicon...' },
    { id: 'editorial', title: 'Editorial', imageUrl: 'https://picsum.photos/seed/editorial/800/600', summary: 'Resumen de la editorial...' },
    { id: 'saltillo', title: 'Saltillo', imageUrl: 'https://picsum.photos/seed/saltillo/800/600', summary: 'Resumen de saltillo...' },
    { id: 'dinero', title: 'Dinero', imageUrl: 'https://picsum.photos/seed/dinero/800/600', summary: 'Resumen de dinero...' },
];

export const MOCK_OPINION: ResumenArticle[] = [
    { id: 'op-1', title: 'La Columna del Director', imageUrl: 'https://picsum.photos/seed/op-1/800/600', author: 'Armando Fuentes Aguirre', summary: 'Resumen de la columna...' },
    { id: 'op-2', title: 'Opinión Invitada', imageUrl: 'https://picsum.photos/seed/op-2/800/600', author: 'Sergio Sarmiento', summary: 'Resumen de la opinión...' },
    { id: 'op-3', title: 'Editorial del Día', imageUrl: 'https://picsum.photos/seed/op-3/800/600', author: 'Vanguardia', summary: 'Resumen de la editorial...' },
];
