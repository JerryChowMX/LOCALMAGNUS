MAGNUS APP
└── Home (/)
    ├── Noticias Hub (/NoticiasHub/:date)
    │   └── Article (/NoticiasHub/:date/:slug)
    │       └── Format (/NoticiasHub/:date/:slug/:format)
    │           ├── original      (Leer nota original)
    │           ├── ejecutivo     (Resumen Ejecutivo)
    │           ├── audio         (Resumen de audio)
    │           └── guiada        (Presentación guiada)
    │
    ├── Resumen Hub (/ResumenHub/:date)
    │   ├── Las 5 noticias del día (/ResumenHub/:date/Las5DelDia)
    │   │   └── Article (/ResumenHub/:date/Las5DelDia/:slug)
    │   │       └── Format (/ResumenHub/:date/Las5DelDia/:slug/:format)
    │   │           ├── original
    │   │           ├── ejecutivo
    │   │           ├── audio
    │   │           └── guiada
    │   │
    │   ├── El podcast del día (/ResumenHub/:date/ElPodcastDelDia)
    │   │   └── [Podcast player screen]
    │   │
    │   ├── La opinión del día (/ResumenHub/:date/LaOpinionDelDia)
    │   │   └── Article (/ResumenHub/:date/LaOpinionDelDia/:slug)
    │   │       └── Format (/ResumenHub/:date/LaOpinionDelDia/:slug/:format)
    │   │           ├── original
    │   │           ├── ejecutivo
    │   │           ├── audio
    │   │           └── guiada
    │   │
    │   ├── Las fotografías del día (/ResumenHub/:date/LasFotosDelDia)
    │   │   └── [Photo gallery screen]
    │   │
    │   ├── Los cartones del día (/ResumenHub/:date/LosCartonesDelDia)
    │   │   └── [Cartoon strip screen]
    │   │
    │   └── Los juegos del día (/ResumenHub/:date/LosJuegosDelDia)
    │       └── REDIRECT → https://vanguardia.com.mx/juegos
    │
    ├── EPaper Hub (/EPaper/:date)
    │   └── EPaper Edition (/EPaper/:date/:editionNumber)
    │       ├── PDF Viewer
    │       └── Floating AI Chat Bar (glassmorphism)
    │
    └── Perfil Hub (/PerfilHub)
        └── [Profile / Settings screens – TBD]
