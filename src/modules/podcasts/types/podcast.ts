export interface Podcast {
    id: string;
    title: string;
    audioUrl: string;
    duration: number; // in seconds
    coverUrl?: string;
    publishedAt: string;
    info?: string;
    author?: string;
}

export const MOCK_PODCASTS: Podcast[] = [
    {
        id: '1',
        title: 'Resumen de Mercados: Apertura',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Public test URL
        duration: 372,
        info: 'Análisis de la apertura de mercados asiáticos y futuros americanos.',
        publishedAt: new Date().toISOString(),
        author: 'Redacción Magnus'
    },
    {
        id: '2',
        title: 'Tecnología y Futuro: IA en 2025',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: 425,
        info: 'Impacto de los nuevos modelos de lenguaje en la productividad.',
        publishedAt: new Date().toISOString(),
        author: 'Magnus Tech'
    },
    {
        id: '3',
        title: 'Política Monetaria: ¿Qué sigue?',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: 310,
        info: 'Decisiones de la Fed y su impacto en el tipo de cambio.',
        publishedAt: new Date().toISOString(),
        author: 'Economía Global'
    }
];
