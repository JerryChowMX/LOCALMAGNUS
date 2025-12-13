import { strapiClient } from '../api/strapiClient';
import { withMockFallback } from '../api/mockFallback';
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

// Mock data for fallback (matches Strapi response format)
const MOCK_USER: User = {
    id: 'user-123',
    name: 'Usuario Demo',
    email: 'demo@magnus.com',
    avatarUrl: undefined // No random avatar
};

const MOCK_AUTH_RESPONSE: AuthResponse = {
    user: MOCK_USER,
    token: 'mock-jwt-token-123456',
    refreshToken: 'mock-refresh-token-789012'
};

export const authApi = {
    /**
     * Register user
     */
    register: async (credentials: RegisterCredentials) => {
        return withMockFallback<AuthResponse>(
            async () => {
                const response = await strapiClient.post<{
                    jwt: string;
                    user: {
                        id: number;
                        username: string;
                        email: string;
                        provider: string;
                        confirmed: boolean;
                        blocked: boolean;
                    }
                }>('/auth/local/register', {
                    username: credentials.username,
                    email: credentials.email,
                    password: credentials.password
                });

                strapiClient.setToken(response.jwt);

                return {
                    user: {
                        id: response.user.id.toString(),
                        name: response.user.username,
                        email: response.user.email,
                        avatarUrl: undefined // User will upload their own avatar
                    },
                    token: response.jwt,
                    refreshToken: response.jwt
                };
            },
            MOCK_AUTH_RESPONSE,
            'auth/register'
        );
    },

    /**
     * Login user
     */
    login: async (credentials: LoginCredentials) => {
        return withMockFallback<AuthResponse>(
            async () => {
                const response = await strapiClient.post<{
                    jwt: string;
                    user: {
                        id: number;
                        username: string;
                        email: string;
                    }
                }>('/auth/local', {
                    identifier: credentials.email,
                    password: credentials.password
                });

                strapiClient.setToken(response.jwt);

                // Fetch full user profile with avatar after login
                const fullUser = await strapiClient.get<any>('/users/me?populate=avatar');
                const strapiUrl = import.meta.env.VITE_STRAPI_URL?.replace('/api', '') || 'http://localhost:1337';

                // Resolve avatar URL
                let avatarUrl: string | undefined;
                if (fullUser.avatar?.url) {
                    avatarUrl = fullUser.avatar.url.startsWith('http')
                        ? fullUser.avatar.url
                        : `${strapiUrl}${fullUser.avatar.url}`;
                }

                return {
                    user: {
                        id: fullUser.id.toString(),
                        name: fullUser.username,
                        email: fullUser.email,
                        avatarUrl,
                        description: fullUser.description
                    },
                    token: response.jwt,
                    refreshToken: response.jwt
                };
            },
            MOCK_AUTH_RESPONSE,
            'auth/login'
        );
    },

    /**
     * Logout user
     * Strapi doesn't have a logout endpoint - we just clear the client-side token
     */
    logout: async () => {
        return withMockFallback<void>(
            async () => {
                // Clear the JWT token from strapiClient
                strapiClient.clearToken();
                // No API call needed for Strapi logout
                return undefined;
            },
            undefined,
            'auth/logout'
        );
    },

    /**
     * Get current authenticated user
     * Requires JWT token to be set in strapiClient
     */
    getCurrentUser: async () => {
        return withMockFallback<User>(
            async () => {
                // Strapi endpoint for getting current user with avatar populated
                const response = await strapiClient.get<any>('/users/me?populate=avatar');

                console.log('[authApi] getCurrentUser response:', response);
                console.log('[authApi] avatar field:', response.avatar);

                const strapiUrl = import.meta.env.VITE_STRAPI_URL?.replace('/api', '') || 'http://localhost:1337';

                // Handle Strapi v5 structure - avatar could be object with url or nested data
                let avatarUrl: string | undefined;
                if (response.avatar) {
                    // Direct url property
                    if (response.avatar.url) {
                        avatarUrl = response.avatar.url.startsWith('http')
                            ? response.avatar.url
                            : `${strapiUrl}${response.avatar.url}`;
                    }
                    // Nested data structure (Strapi v4/v5)
                    else if (response.avatar.data?.attributes?.url) {
                        const url = response.avatar.data.attributes.url;
                        avatarUrl = url.startsWith('http') ? url : `${strapiUrl}${url}`;
                    }
                }

                console.log('[authApi] resolved avatarUrl:', avatarUrl);

                // Transform Strapi user to our User format
                return {
                    id: response.id.toString(),
                    name: response.username,
                    email: response.email,
                    avatarUrl,
                    description: response.description
                };
            },
            MOCK_USER,
            'auth/me'
        );
    }
};
