import { STRAPI_URL, STRAPI_TOKEN } from '../lib/env';

export interface StrapiClientConfig {
    baseUrl?: string;
    token?: string;
}

const DEFAULT_CONFIG: StrapiClientConfig = {
    baseUrl: STRAPI_URL,
    token: STRAPI_TOKEN,
};

class StrapiClient {
    private baseUrl: string;
    private token?: string;

    constructor(config: StrapiClientConfig = DEFAULT_CONFIG) {
        this.baseUrl = config.baseUrl || "http://localhost:1337/api";
        this.token = config.token;

        // Try to load JWT from localStorage on init (for auth persistence)
        const storedToken = localStorage.getItem('jwt');
        if (storedToken) {
            this.token = storedToken;
        }
    }

    /**
     * Set authentication token (JWT)
     * Used after login to authenticate subsequent requests
     */
    setToken(token: string) {
        this.token = token;
        localStorage.setItem('jwt', token);
    }

    /**
     * Clear authentication token
     * Used on logout
     */
    clearToken() {
        this.token = undefined;
        localStorage.removeItem('jwt');
    }

    /**
     * Get current token
     */
    getToken(): string | undefined {
        return this.token;
    }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
        const headers = {
            "Content-Type": "application/json",
            ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
            ...options?.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            let errorMessage = `Strapi Request Failed: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                // Strapi error format: { error: { status, name, message, details } }
                if (errorData?.error?.message) {
                    errorMessage = errorData.error.message;
                }

                // Enhance common Strapi errors
                if (errorMessage === 'Forbidden') {
                    errorMessage = 'Acceso denegado. Es posible que tu cuenta no esté confirmada.';
                }
            } catch (e) {
                // stick to default error if json parse fails
            }
            const error = new Error(errorMessage);
            throw error;
        }

        return response.json();
    }

    async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
        return this.request<T>(`${endpoint}${queryString}`, {
            method: "GET",
        });
    }

    async getOne<T>(endpoint: string, id: string | number, params?: Record<string, string>): Promise<T> {
        const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
        return this.request<T>(`${endpoint}/${id}${queryString}`, {
            method: "GET",
        });
    }

    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: "DELETE",
        });
    }

    /**
     * Execute a GraphQL query or mutation
     */
    async graphql<T>(query: string, variables?: Record<string, any>): Promise<T> {
        // Adjust URL from /api to /graphql
        // Assuming baseUrl ends with /api. If not, this logical might need hardening.
        const graphqlUrl = this.baseUrl.replace(/\/api\/?$/, '/graphql');

        const response = await fetch(graphqlUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            const error = new Error(`GraphQL Request Failed: ${response.status} ${response.statusText}`);
            throw error;
        }

        const result = await response.json();
        if (result.errors) {
            console.error("GraphQL Errors:", result.errors);
            throw new Error(`GraphQL Error: ${result.errors[0]?.message || 'Unknown error'}`);
        }

        return result.data;
    }

    /**
     * Upload a file to Strapi
     * @param file The file to upload
     * @param linkTo Optional - link the file to an entity during upload
     */
    async upload(file: File, linkTo?: { ref: string; refId: string | number; field: string }): Promise<any> {
        const url = `${this.baseUrl}/upload`;
        const formData = new FormData();
        formData.append('files', file);

        // If linking to an entity, add the reference info
        if (linkTo) {
            formData.append('ref', linkTo.ref);
            formData.append('refId', linkTo.refId.toString());
            formData.append('field', linkTo.field);
        }

        const headers: Record<string, string> = {
            ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
            // Content-Type is set automatically by fetch for FormData
        };

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            let errorMessage = `Upload Failed: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData?.error?.message) {
                    errorMessage = errorData.error.message;
                }
            } catch (e) {
                // stick to default error
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        // Strapi returns an array of uploaded files
        return data[0];
    }
}


export const strapiClient = new StrapiClient();
