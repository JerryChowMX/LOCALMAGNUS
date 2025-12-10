# Strapi Readiness Audit

This document outlines the current state of the MAGNUS HO codebase and its readiness to integrate with Strapi as a Headless CMS for handling article uploads (images, titles, text).

## 1. Executive Summary

**Readiness Status: LOW / PARTIALLY READY**

The current application is structured with a clear separation of concerns (API, Services, UI), which is excellent. However, the data layer is currently hardcoded to expect specific, flat JSON structures that do not match the standard response format of Strapi (v4/v5). Significant refactoring is required in the **API Client**, **Type Definitions**, and **Data Transformation** layers to support a real CMS integration.

## 2. Key Findings & Gaps

### 2.1. API Client & Response Structure
*   **Current State**: `src/api/apiClient.ts` expects the API to return the data directly as type `T` (e.g., `Promise<T>`).
*   **Strapi Reality**: Strapi responses are nested. A typical response looks like:
    ```json
    {
      "data": [
        {
          "id": 1,
          "attributes": {
            "title": "...",
            "content": "..."
          }
        }
      ],
      "meta": { "pagination": { ... } }
    }
    ```
*   **Action Required**:
    *   Update `apiClient` to handle Strapi's `data` wrapper or create a dedicated `strapiClient` that unwraps responses automatically.
    *   Implement a "Transform" layer to map Strapi's `attributes` to our flat application interfaces.

### 2.2. Type Definitions (Data Models)
*   **Current State**: Interfaces like `ResumenArticle` (in `src/types/resumen.ts`) and `NoticiasArticle` are flat objects.
    ```typescript
    export interface ResumenArticle {
        id: string;
        title: string;
        imageUrl: string; // Expects a direct string URL
        // ...
    }
    ```
*   **Strapi Reality**:
    *   **IDs**: Strapi IDs are typically numbers (though v5 might use strings/UUIDs).
    *   **Images**: Strapi returns an image object (Media Field), not a string.
        ```json
        "image": {
          "data": {
            "attributes": {
              "url": "/uploads/...",
              "formats": { "thumbnail": { ... }, "medium": { ... } }
            }
          }
        }
        ```
*   **Action Required**:
    *   Create `StrapiResponse<T>` generic types.
    *   Update domain types to handle the Media object structure or map it in the service layer.

### 2.3. Image Handling
*   **Current State**: Components expect `imageUrl` to be a complete, absolute URL string (e.g., from `picsum.photos`).
*   **Strapi Reality**: Strapi returns relative paths (e.g., `/uploads/image.jpg`).
*   **Action Required**:
    *   Create a utility function `getStrapiMedia(url)` to prepend the `STRAPI_API_URL` environment variable to image paths.
    *   Update components or the transformation layer to use this utility.

### 2.4. Rich Text Content
*   **Current State**: `content` is defined as a simple string.
*   **Strapi Reality**: Strapi uses Markdown or a Blocks editor (JSON structure) for rich text.
*   **Action Required**:
    *   Decide on the editor in Strapi (Markdown vs. Blocks).
    *   Install a renderer (e.g., `react-markdown` or Strapi's Blocks renderer) to display the content properly in the UI.

### 2.5. Authentication & Environment
*   **Current State**: `apiClient.ts` uses `import.meta.env.VITE_API_URL`.
*   **Gap**: No mechanism for handling API Tokens (Bearer tokens) if the Strapi API is private (which it should be for drafts/previews).
*   **Action Required**:
    *   Add `VITE_STRAPI_TOKEN` to `.env`.
    *   Update `apiClient` to inject the `Authorization: Bearer <token>` header.

## 3. Recommended Roadmap

1.  **Environment Setup**:
    *   Define `VITE_STRAPI_URL` and `VITE_STRAPI_TOKEN` in `.env`.

2.  **Type Layer Refactor**:
    *   Create `src/types/strapi.ts` for generic Strapi response types.
    *   Update `ResumenArticle` and others to reflect the mapped structure.

3.  **Service Layer Update (The Adapter Pattern)**:
    *   Modify `resumenApi.ts` to fetch from Strapi endpoints.
    *   **Crucial**: Implement a `normalizeArticle` function inside the service to transform the nested Strapi JSON into the flat `ResumenArticle` shape the UI expects. This keeps the UI components clean and unaware of Strapi.

4.  **Image Utility**:
    *   Create `src/utils/media.ts` to handle full URL construction.

5.  **Content Rendering**:
    *   Implement a `RichTextRenderer` component.

## 4. Conclusion
The system is **not ready** for a direct "plug-and-play" connection. Connecting it now would break the UI because the data shapes do not match. However, the **architecture is sound**. By implementing a "Service Adapter" layer that fetches from Strapi and transforms the data into the existing interfaces, we can migrate to Strapi without rewriting the UI components.
