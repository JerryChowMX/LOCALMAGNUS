# MAGNUS – Typography Guidelines

**Version:** 1.0
**Brand Fonts:**
- **Display / Brand:** Blinker
- **Body / UI:** Inter

Magnus utiliza una tipografía dual cuidadosamente seleccionada para ofrecer una experiencia editorial premium, altamente legible y adaptada al formato mobile-first.

## 1. Filosofía de Tipografía

1.  **Ser legible y clara en pantallas pequeñas**: Inter se encarga de todas las áreas donde hay lectura continua, metadatos o UI.
2.  **Crear marca con un estilo visual fuerte**: Blinker es la voz visual de Magnus: moderna, directa, édita y con presencia.
3.  **Mantener consistencia**: Todas las combinaciones deben seguir la misma estructura de tokens y variantes.
4.  **Separar propósito editorial vs. funcional**:
    -   Editorial → **Blinker**
    -   Funcional → **Inter**

## 2. Roles Tipográficos

### 2.1. Blinker (Display Font / Brand)
**Usos principales:**
-   Titulares (H1, H2, H3)
-   Nombres de secciones
-   HeaderHubs y HeaderContent
-   Tarjetas de artículos (títulos)
-   Etiquetas de módulos (“Las 5 noticias del día”, “La Opinión del día”…)
-   Pantallas de navegación (Hubs)
-   Elementos promocionales o destacados
-   Títulos en la Presentación Guiada
-   Nombres de edición en EPaper

### 2.2. Inter (Body Font / UI)
**Usos principales:**
-   Cuerpo de textos
-   Resúmenes ejecutivos
-   Descripciones de EPaper
-   Detalles de artículos (fecha, autor, tiempo de lectura)
-   Labels en inputs
-   Botones
-   Menús
-   Captions, notas pequeñas
-   Chat input
-   Mensajes dentro del AI Chat Bar

## 3. Variantes y Jerarquía de Texto

| Nivel | Uso | Fuente | Clase CSS / Variant |
| :--- | :--- | :--- | :--- |
| **H1** | Títulos principales, secciones clave | Blinker | `.text-heading-1` / `heading-1` |
| **H2** | Titulares de hubs | Blinker | `.text-heading-2` / `heading-2` |
| **H3** | Tarjetas de artículos, headers internos | Blinker | `.text-heading-3` / `heading-3` |
| **Subhead** | Descripción breve bajo título | Inter | `.text-body-sm` / `body-sm` |
| **Body** | Texto normal | Inter | `.text-body` / `body` |
| **Caption** | Metadatos, fechas | Inter | `.text-caption` / `caption` |
| **Label** | Botones, UI, filtros | Inter | `.text-label` / `label` |

## 4. Uso por Módulo

### 4.1 Noticias Hub
-   **HeaderHubs**:
    -   Date: `.text-body-sm`
    -   Section title: `.text-heading-2`
-   **ArticleCard**:
    -   Title: `.text-heading-3`
    -   Category/tag: `.text-caption`
    -   Metrics: `.text-caption`
-   **Article Formats**:
    -   Format titles: `.text-label`
    -   Article title: `.text-heading-1`
    -   Summaries: `.text-body`

### 4.2 Resumen Hub
-   **Main Screen**:
    -   OptionCard title: `.text-heading-3`
    -   Description: `.text-body-sm`
-   **Las 5 / Opinión**:
    -   Article title: `.text-heading-3`
    -   Banner: `.text-caption`
    -   Page title: `.text-heading-1`
    -   Body: `.text-body`
    -   Metadata: `.text-caption`
-   **Podcast**:
    -   Episode title: `.text-heading-3`
    -   Description: `.text-body`
    -   Timestamp: `.text-caption`
-   **Photos / Cartoons**:
    -   Titles: `.text-heading-3`
    -   Captions: `.text-caption`

### 4.3 EPaper Hub
-   **EPaperCard**:
    -   Edition title: `.text-heading-3`
    -   Date: `.text-caption`
-   **Edition Page**:
    -   HeaderContent title: `.text-heading-2`
    -   PDF description: `.text-body`
-   **AI Chat Bar**:
    -   Placeholder: `.text-body-sm`
    -   Bubble text: `.text-body`
    -   System messages: `.text-caption`

## 5. Reglas de Oro
1.  **Blinker es Magnus.**
2.  **Inter es tu UI.**
3.  Nunca escribir estilos tipográficos en JSX.
4.  Solo usar tokens.
5.  Todos los headings son Blinker.
6.  Todo lo que se lee más de 2 líneas → Inter.
